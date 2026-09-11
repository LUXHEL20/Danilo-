"""Flask-app: in- en uitscannen, opzoeken en automatische Excel-export."""
from __future__ import annotations

from pathlib import Path

from flask import (
    Flask, abort, flash, g, jsonify, redirect, render_template, request,
    send_file, url_for,
)

from . import config, db, excel


def maak_app() -> Flask:
    app = Flask(__name__)
    app.secret_key = "lux-2.0-pakketscanner"

    config.zorg_voor_mappen()
    db.init_db()

    @app.before_request
    def _open_verbinding():
        g.conn = db.verbind()

    @app.teardown_request
    def _sluit_verbinding(_fout=None):
        conn = g.pop("conn", None)
        if conn is not None:
            conn.close()

    # --- pagina's -----------------------------------------------------------

    @app.get("/")
    def scannen():
        return render_template(
            "scannen.html",
            koeriers=db.koeriers(g.conn),
            stats=db.statistieken(g.conn),
            laatste=db.laatste_scans(g.conn, 10),
        )

    @app.get("/overzicht")
    def overzicht():
        zoek = request.args.get("zoek", "").strip()
        koerier_id = request.args.get("koerier", type=int)
        status = request.args.get("status") or None
        rijen = db.pakketten(g.conn, koerier_id=koerier_id, status=status, zoekterm=zoek or None)
        return render_template(
            "overzicht.html",
            pakketten=rijen,
            koeriers=db.koeriers(g.conn),
            zoek=zoek,
            gekozen_koerier=koerier_id,
            gekozen_status=status,
        )

    @app.get("/pakket/<code>")
    def pakket(code: str):
        rij = db.pakket_via_code(g.conn, code)
        if rij is None:
            abort(404, f"Pakket {code} is onbekend.")
        return render_template(
            "pakket.html",
            pakket=rij,
            scans=db.scans_van_pakket(g.conn, rij["id"]),
            koeriers=db.koeriers(g.conn),
        )

    @app.post("/pakket/<code>")
    def pakket_bijwerken(code: str):
        try:
            rij = db.werk_pakket_bij(g.conn, code, request.form.to_dict())
            excel.ververs_na_scan(g.conn, rij["koerier_id"], rij["code"])
            flash(f"Gegevens van pakket {rij['code']} opgeslagen.", "ok")
        except db.ScanFout as fout:
            flash(str(fout), "fout")
        return redirect(url_for("pakket", code=db.normaliseer_code(code)))

    @app.get("/koeriers")
    def koeriers():
        stats = db.statistieken(g.conn)
        return render_template(
            "koeriers.html",
            koeriers=db.koeriers(g.conn),
            per_koerier={k["id"]: k for k in stats["per_koerier"]},
            export_map=str(config.KOERIER_EXPORT_DIR),
        )

    @app.post("/koeriers/<int:koerier_id>/naam")
    def koerier_hernoemen(koerier_id: int):
        try:
            db.hernoem_koerier(g.conn, koerier_id, request.form.get("naam", ""))
            excel.schrijf_koerierlijst(g.conn, koerier_id)
            excel.schrijf_master(g.conn)
            flash("Naam van de koerier aangepast.", "ok")
        except db.ScanFout as fout:
            flash(str(fout), "fout")
        return redirect(url_for("koeriers"))

    @app.get("/bestanden")
    def bestanden():
        lijst = []
        for k in db.koeriers(g.conn):
            pad = config.KOERIER_EXPORT_DIR / excel.koerier_bestandsnaam(k)
            lijst.append({"koerier": k, "pad": pad, "bestaat": pad.exists()})
        master = config.EXPORT_DIR / config.MASTER_BESTANDSNAAM
        return render_template(
            "bestanden.html",
            master=master,
            master_bestaat=master.exists(),
            koerierbestanden=lijst,
            export_map=str(config.EXPORT_DIR),
        )

    @app.post("/bestanden/hernieuwen")
    def bestanden_hernieuwen():
        excel.schrijf_master(g.conn)
        excel.schrijf_alle_koerierlijsten(g.conn)
        flash("Alle Excel-bestanden opnieuw aangemaakt.", "ok")
        return redirect(url_for("bestanden"))

    # --- downloads ----------------------------------------------------------

    def _stuur(pad: Path):
        if not Path(pad).exists():
            abort(404, "Dit Excel-bestand bestaat nog niet. Scan eerst een pakket.")
        return send_file(pad, as_attachment=True, download_name=Path(pad).name)

    @app.get("/download/master")
    def download_master():
        return _stuur(excel.schrijf_master(g.conn))

    @app.get("/download/koerier/<int:koerier_id>")
    def download_koerier(koerier_id: int):
        try:
            return _stuur(excel.schrijf_koerierlijst(g.conn, koerier_id))
        except db.ScanFout as fout:
            abort(404, str(fout))

    @app.get("/download/pakket/<code>")
    def download_pakket(code: str):
        try:
            return _stuur(excel.schrijf_pakket(g.conn, code))
        except db.ScanFout as fout:
            abort(404, str(fout))

    # --- API voor de scanpagina --------------------------------------------

    @app.post("/api/scan")
    def api_scan():
        data = request.get_json(silent=True) or request.form.to_dict()
        actie = (data.get("actie") or "").upper()
        code = data.get("code", "")
        gebruiker = (data.get("gebruiker") or "").strip()
        koerier_id = data.get("koerier_id")
        koerier_id = int(koerier_id) if str(koerier_id or "").strip() else None

        try:
            if actie == "IN":
                if koerier_id is None:
                    raise db.ScanFout("Kies eerst een koerier voordat je inscant.")
                pakket = db.scan_in(g.conn, code, koerier_id, gebruiker, data)
                melding = f"Pakket {pakket['code']} ingescand voor {pakket['koerier_naam']}."
            elif actie == "UIT":
                pakket = db.scan_uit(g.conn, code, koerier_id, gebruiker)
                melding = (
                    f"Pakket {pakket['code']} AFGEHAALD door {pakket['koerier_naam']} "
                    f"om {pakket['uit_op'][11:16]}."
                )
            elif actie == "ZOEK":
                pakket = db.pakket_via_code(g.conn, code)
                if pakket is None:
                    raise db.ScanFout(f"Pakket {db.normaliseer_code(code)} is niet gevonden.")
                melding = (
                    f"Pakket {pakket['code']} — {pakket['koerier_naam'] or 'geen koerier'} — "
                    + ("AFGEHAALD op " + pakket["uit_op"]
                       if pakket["status"] == config.STATUS_UIT
                       else "ligt in het depot" + (f" (plank {pakket['plank']})"
                                                   if pakket["plank"] else ""))
                )
                return jsonify({
                    "ok": True, "melding": melding, "pakket": dict(pakket),
                    "scans": db.rijen_als_dicts(db.scans_van_pakket(g.conn, pakket["id"])),
                    "stats": db.statistieken(g.conn),
                })
            else:
                raise db.ScanFout("Onbekende actie. Kies IN, UIT of ZOEK.")
        except db.ScanFout as fout:
            return jsonify({"ok": False, "melding": str(fout)}), 400

        bestanden = excel.ververs_na_scan(g.conn, pakket["koerier_id"], pakket["code"])
        return jsonify({
            "ok": True,
            "melding": melding,
            "pakket": dict(pakket),
            "bestanden": bestanden,
            "stats": db.statistieken(g.conn),
            "laatste": db.rijen_als_dicts(db.laatste_scans(g.conn, 10)),
        })

    @app.get("/api/pakket/<code>")
    def api_pakket(code: str):
        rij = db.pakket_via_code(g.conn, code)
        if rij is None:
            return jsonify({"ok": False, "melding": f"Pakket {code} is onbekend."}), 404
        return jsonify({"ok": True, "pakket": dict(rij)})

    @app.get("/api/stats")
    def api_stats():
        return jsonify(db.statistieken(g.conn))

    @app.errorhandler(404)
    def _niet_gevonden(fout):
        if request.path.startswith("/api/"):
            return jsonify({"ok": False, "melding": str(fout)}), 404
        return render_template("fout.html", melding=str(fout)), 404

    return app


app = maak_app()
