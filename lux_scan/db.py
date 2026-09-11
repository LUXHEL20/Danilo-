"""SQLite-laag: koeriers, pakketten en de scanhistorie."""
from __future__ import annotations

import secrets
import sqlite3
from datetime import datetime
from typing import Any, Iterable

from . import config

SCHEMA = """
CREATE TABLE IF NOT EXISTS koeriers (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    naam          TEXT NOT NULL UNIQUE,
    actief        INTEGER NOT NULL DEFAULT 1,
    toegangscode  TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS pakketten (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    code          TEXT NOT NULL UNIQUE,
    koerier_id    INTEGER REFERENCES koeriers(id),
    ontvanger     TEXT NOT NULL DEFAULT '',
    adres         TEXT NOT NULL DEFAULT '',
    postcode      TEXT NOT NULL DEFAULT '',
    plaats        TEXT NOT NULL DEFAULT '',
    telefoon      TEXT NOT NULL DEFAULT '',
    plank         TEXT NOT NULL DEFAULT '',
    opmerking     TEXT NOT NULL DEFAULT '',
    status        TEXT NOT NULL,
    in_op         TEXT,
    in_door       TEXT NOT NULL DEFAULT '',
    uit_op        TEXT,
    uit_door      TEXT NOT NULL DEFAULT '',
    aangemaakt_op TEXT NOT NULL,
    gewijzigd_op  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_pakketten_koerier ON pakketten(koerier_id);
CREATE INDEX IF NOT EXISTS idx_pakketten_status  ON pakketten(status);

CREATE TABLE IF NOT EXISTS scans (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    pakket_id  INTEGER REFERENCES pakketten(id) ON DELETE CASCADE,
    code       TEXT NOT NULL,
    actie      TEXT NOT NULL,
    koerier_id INTEGER REFERENCES koeriers(id),
    gebruiker  TEXT NOT NULL DEFAULT '',
    tijdstip   TEXT NOT NULL,
    notitie    TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_scans_pakket ON scans(pakket_id);
"""


class ScanFout(Exception):
    """Nette, in het Nederlands leesbare fout die de app aan de gebruiker toont."""


def nu() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def normaliseer_code(code: str) -> str:
    """Barcodes hoofdletterongevoelig en zonder spaties vergelijken."""
    return (code or "").strip().upper()


# Zonder 0/O en 1/I: die worden te vaak verkeerd overgetypt op een gsm.
CODE_TEKENS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"


def nieuwe_toegangscode(lengte: int = 6) -> str:
    return "".join(secrets.choice(CODE_TEKENS) for _ in range(lengte))


def verbind() -> sqlite3.Connection:
    config.zorg_voor_mappen()
    conn = sqlite3.connect(config.DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db(conn: sqlite3.Connection | None = None) -> None:
    """Maakt tabellen aan en zet de 8 koeriers klaar als de database leeg is."""
    eigen = conn is None
    conn = conn or verbind()
    try:
        conn.executescript(SCHEMA)
        # Migratie voor databases van vóór de live koerierspagina.
        kolommen = {r["name"] for r in conn.execute("PRAGMA table_info(koeriers)")}
        if "toegangscode" not in kolommen:
            conn.execute("ALTER TABLE koeriers ADD COLUMN toegangscode TEXT NOT NULL DEFAULT ''")
        aantal = conn.execute("SELECT COUNT(*) FROM koeriers").fetchone()[0]
        if aantal == 0:
            conn.executemany(
                "INSERT INTO koeriers (naam, toegangscode) VALUES (?, ?)",
                [(naam, nieuwe_toegangscode()) for naam in config.STANDAARD_KOERIERS],
            )
        # Iedere koerier heeft een persoonlijke code voor zijn live pagina.
        for rij in conn.execute("SELECT id FROM koeriers WHERE toegangscode = ''").fetchall():
            conn.execute(
                "UPDATE koeriers SET toegangscode = ? WHERE id = ?",
                (nieuwe_toegangscode(), rij["id"]),
            )
        conn.commit()
    finally:
        if eigen:
            conn.close()


# --- koeriers ---------------------------------------------------------------

def koeriers(conn: sqlite3.Connection, alleen_actief: bool = True) -> list[sqlite3.Row]:
    sql = "SELECT * FROM koeriers"
    if alleen_actief:
        sql += " WHERE actief = 1"
    return list(conn.execute(sql + " ORDER BY id"))


def koerier(conn: sqlite3.Connection, koerier_id: int | None) -> sqlite3.Row | None:
    if koerier_id is None:
        return None
    return conn.execute("SELECT * FROM koeriers WHERE id = ?", (koerier_id,)).fetchone()


def hernoem_koerier(conn: sqlite3.Connection, koerier_id: int, naam: str) -> None:
    naam = (naam or "").strip()
    if not naam:
        raise ScanFout("De naam van een koerier mag niet leeg zijn.")
    if koerier(conn, koerier_id) is None:
        raise ScanFout(f"Koerier {koerier_id} bestaat niet.")
    bestaat = conn.execute(
        "SELECT id FROM koeriers WHERE naam = ? AND id <> ?", (naam, koerier_id)
    ).fetchone()
    if bestaat:
        raise ScanFout(f"Er is al een koerier met de naam '{naam}'.")
    conn.execute("UPDATE koeriers SET naam = ? WHERE id = ?", (naam, koerier_id))
    conn.commit()


# --- pakketten --------------------------------------------------------------

PAKKET_SELECT = """
SELECT p.*, k.naam AS koerier_naam
FROM pakketten p
LEFT JOIN koeriers k ON k.id = p.koerier_id
"""


def pakket_via_code(conn: sqlite3.Connection, code: str) -> sqlite3.Row | None:
    return conn.execute(PAKKET_SELECT + " WHERE p.code = ?", (normaliseer_code(code),)).fetchone()


def pakketten(
    conn: sqlite3.Connection,
    koerier_id: int | None = None,
    status: str | None = None,
    zoekterm: str | None = None,
) -> list[sqlite3.Row]:
    sql = PAKKET_SELECT
    voorwaarden: list[str] = []
    params: list[Any] = []
    if koerier_id is not None:
        voorwaarden.append("p.koerier_id = ?")
        params.append(koerier_id)
    if status:
        voorwaarden.append("p.status = ?")
        params.append(status)
    if zoekterm:
        term = f"%{zoekterm.strip().lower()}%"
        voorwaarden.append(
            "(LOWER(p.code) LIKE ? OR LOWER(p.ontvanger) LIKE ? OR LOWER(p.adres) LIKE ?"
            " OR LOWER(p.postcode) LIKE ? OR LOWER(p.plaats) LIKE ? OR LOWER(p.telefoon) LIKE ?"
            " OR LOWER(p.plank) LIKE ?)"
        )
        params.extend([term] * 7)
    if voorwaarden:
        sql += " WHERE " + " AND ".join(voorwaarden)
    sql += " ORDER BY COALESCE(p.uit_op, p.in_op, p.aangemaakt_op) DESC, p.id DESC"
    return list(conn.execute(sql, params))


def scans_van_pakket(conn: sqlite3.Connection, pakket_id: int) -> list[sqlite3.Row]:
    return list(
        conn.execute(
            """
            SELECT s.*, k.naam AS koerier_naam
            FROM scans s LEFT JOIN koeriers k ON k.id = s.koerier_id
            WHERE s.pakket_id = ? ORDER BY s.id
            """,
            (pakket_id,),
        )
    )


def laatste_scans(conn: sqlite3.Connection, limiet: int = 25) -> list[sqlite3.Row]:
    return list(
        conn.execute(
            """
            SELECT s.*, k.naam AS koerier_naam
            FROM scans s LEFT JOIN koeriers k ON k.id = s.koerier_id
            ORDER BY s.id DESC LIMIT ?
            """,
            (limiet,),
        )
    )


def _log_scan(
    conn: sqlite3.Connection,
    pakket_id: int,
    code: str,
    actie: str,
    koerier_id: int | None,
    gebruiker: str,
    tijdstip: str,
    notitie: str = "",
) -> None:
    conn.execute(
        """INSERT INTO scans (pakket_id, code, actie, koerier_id, gebruiker, tijdstip, notitie)
           VALUES (?, ?, ?, ?, ?, ?, ?)""",
        (pakket_id, code, actie, koerier_id, gebruiker, tijdstip, notitie),
    )


VELDEN = ("ontvanger", "adres", "postcode", "plaats", "telefoon", "plank", "opmerking")


def scan_in(
    conn: sqlite3.Connection,
    code: str,
    koerier_id: int,
    gebruiker: str = "",
    gegevens: dict[str, str] | None = None,
) -> sqlite3.Row:
    """Pakket inscannen: nieuw pakket aanmaken of een afgehaald pakket terugnemen."""
    code = normaliseer_code(code)
    if not code:
        raise ScanFout("Scan of typ eerst een barcode.")
    if koerier(conn, koerier_id) is None:
        raise ScanFout("Kies eerst een koerier voordat je inscant.")

    gegevens = {veld: (gegevens or {}).get(veld, "").strip() for veld in VELDEN}
    tijd = nu()
    bestaand = pakket_via_code(conn, code)

    if bestaand is None:
        conn.execute(
            f"""INSERT INTO pakketten (code, koerier_id, {', '.join(VELDEN)},
                    status, in_op, in_door, aangemaakt_op, gewijzigd_op)
                VALUES (?, ?, {', '.join('?' * len(VELDEN))}, ?, ?, ?, ?, ?)""",
            (code, koerier_id, *[gegevens[v] for v in VELDEN],
             config.STATUS_IN, tijd, gebruiker, tijd, tijd),
        )
        pakket_id = conn.execute("SELECT id FROM pakketten WHERE code = ?", (code,)).fetchone()["id"]
        _log_scan(conn, pakket_id, code, "IN", koerier_id, gebruiker, tijd, "nieuw pakket")
    else:
        if bestaand["status"] == config.STATUS_IN:
            raise ScanFout(
                f"Pakket {code} is al ingescand op {bestaand['in_op']} "
                f"voor {bestaand['koerier_naam'] or 'onbekende koerier'}."
            )
        # Ingevulde velden overschrijven, lege velden laten staan.
        nieuw = {veld: (gegevens[veld] or bestaand[veld]) for veld in VELDEN}
        conn.execute(
            f"""UPDATE pakketten SET koerier_id = ?, {', '.join(f'{v} = ?' for v in VELDEN)},
                    status = ?, in_op = ?, in_door = ?, uit_op = NULL, uit_door = '',
                    gewijzigd_op = ?
                WHERE id = ?""",
            (koerier_id, *[nieuw[v] for v in VELDEN],
             config.STATUS_IN, tijd, gebruiker, tijd, bestaand["id"]),
        )
        _log_scan(conn, bestaand["id"], code, "IN", koerier_id, gebruiker, tijd,
                  "opnieuw ingescand")
    conn.commit()
    return pakket_via_code(conn, code)


def scan_uit(
    conn: sqlite3.Connection,
    code: str,
    koerier_id: int | None = None,
    gebruiker: str = "",
) -> sqlite3.Row:
    """Pakket uitscannen: de koerier heeft het pakket meegenomen."""
    code = normaliseer_code(code)
    if not code:
        raise ScanFout("Scan of typ eerst een barcode.")
    pakket = pakket_via_code(conn, code)
    if pakket is None:
        raise ScanFout(f"Pakket {code} is onbekend. Scan het eerst in.")
    if pakket["status"] == config.STATUS_UIT:
        raise ScanFout(
            f"Pakket {code} is al afgehaald op {pakket['uit_op']} "
            f"door {pakket['koerier_naam'] or 'onbekende koerier'}."
        )
    if koerier_id is not None and koerier(conn, koerier_id) is None:
        raise ScanFout("Deze koerier bestaat niet.")

    tijd = nu()
    nieuwe_koerier = koerier_id if koerier_id is not None else pakket["koerier_id"]
    notitie = ""
    if koerier_id is not None and pakket["koerier_id"] and koerier_id != pakket["koerier_id"]:
        notitie = f"koerier gewijzigd van {pakket['koerier_naam']}"
    conn.execute(
        """UPDATE pakketten SET status = ?, uit_op = ?, uit_door = ?, koerier_id = ?,
                gewijzigd_op = ? WHERE id = ?""",
        (config.STATUS_UIT, tijd, gebruiker, nieuwe_koerier, tijd, pakket["id"]),
    )
    _log_scan(conn, pakket["id"], code, "UIT", nieuwe_koerier, gebruiker, tijd, notitie)
    conn.commit()
    return pakket_via_code(conn, code)


def werk_pakket_bij(conn: sqlite3.Connection, code: str, gegevens: dict[str, str]) -> sqlite3.Row:
    """Gegevens van een bestaand pakket aanpassen (ook de koerier)."""
    pakket = pakket_via_code(conn, code)
    if pakket is None:
        raise ScanFout(f"Pakket {code} is onbekend.")
    waarden = [gegevens.get(veld, pakket[veld] or "").strip() for veld in VELDEN]
    koerier_id = gegevens.get("koerier_id") or pakket["koerier_id"]
    koerier_id = int(koerier_id) if koerier_id else None
    if koerier_id is not None and koerier(conn, koerier_id) is None:
        raise ScanFout("Deze koerier bestaat niet.")
    conn.execute(
        f"""UPDATE pakketten SET {', '.join(f'{v} = ?' for v in VELDEN)},
                koerier_id = ?, gewijzigd_op = ? WHERE id = ?""",
        (*waarden, koerier_id, nu(), pakket["id"]),
    )
    conn.commit()
    return pakket_via_code(conn, code)


def statistieken(conn: sqlite3.Connection) -> dict[str, Any]:
    rij = conn.execute(
        """SELECT
             COUNT(*) AS totaal,
             SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS in_depot,
             SUM(CASE WHEN status = ? THEN 1 ELSE 0 END) AS afgehaald
           FROM pakketten""",
        (config.STATUS_IN, config.STATUS_UIT),
    ).fetchone()
    vandaag = datetime.now().strftime("%Y-%m-%d")
    per_koerier = list(
        conn.execute(
            """SELECT k.id, k.naam,
                      COUNT(p.id) AS totaal,
                      SUM(CASE WHEN p.status = ? THEN 1 ELSE 0 END) AS in_depot,
                      SUM(CASE WHEN p.status = ? THEN 1 ELSE 0 END) AS afgehaald
               FROM koeriers k LEFT JOIN pakketten p ON p.koerier_id = k.id
               WHERE k.actief = 1 GROUP BY k.id ORDER BY k.id""",
            (config.STATUS_IN, config.STATUS_UIT),
        )
    )
    scans_vandaag = conn.execute(
        "SELECT COUNT(*) FROM scans WHERE tijdstip LIKE ?", (vandaag + "%",)
    ).fetchone()[0]
    return {
        "totaal": rij["totaal"] or 0,
        "in_depot": rij["in_depot"] or 0,
        "afgehaald": rij["afgehaald"] or 0,
        "scans_vandaag": scans_vandaag,
        "per_koerier": [dict(r) for r in per_koerier],
    }


def rijen_als_dicts(rijen: Iterable[sqlite3.Row]) -> list[dict[str, Any]]:
    return [dict(r) for r in rijen]
