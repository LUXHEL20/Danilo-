/* Scanpagina: één invoerveld dat werkt met een handscanner (die eindigt met Enter). */
(function () {
  const $ = (id) => document.getElementById(id);
  const codeVeld = $("code");
  const resultaat = $("resultaat");
  const extraVelden = ["ontvanger", "adres", "postcode", "plaats", "telefoon", "plank", "opmerking"];
  let actie = "IN";

  // Koerier en scannernaam onthouden tussen sessies.
  const onthoud = (sleutel, veld) => {
    const bewaard = localStorage.getItem(sleutel);
    if (bewaard !== null) veld.value = bewaard;
    veld.addEventListener("change", () => localStorage.setItem(sleutel, veld.value));
  };
  onthoud("lux.koerier", $("koerier"));
  onthoud("lux.gebruiker", $("gebruiker"));

  function zetModus(nieuw) {
    actie = nieuw;
    document.querySelectorAll(".mod").forEach((b) =>
      b.classList.toggle("actief", b.dataset.actie === nieuw)
    );
    $("extra").style.display = nieuw === "IN" ? "" : "none";
    codeVeld.focus();
  }
  document.querySelectorAll(".mod").forEach((b) =>
    b.addEventListener("click", () => zetModus(b.dataset.actie))
  );

  function toon(soort, tekst, detail) {
    resultaat.className = "resultaat " + soort;
    resultaat.innerHTML = "";
    resultaat.append(tekst);
    if (detail) {
      const span = document.createElement("span");
      span.className = "detail";
      span.textContent = detail;
      resultaat.append(span);
    }
  }

  function piep(gelukt) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = gelukt ? 880 : 220;
      gain.gain.value = 0.08;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + (gelukt ? 0.12 : 0.35));
    } catch (e) { /* geluid is optioneel */ }
  }

  function pakketDetail(p) {
    if (!p) return "";
    const delen = [
      p.ontvanger, p.adres, [p.postcode, p.plaats].filter(Boolean).join(" "),
      p.telefoon, p.plank ? "plank " + p.plank : "", p.opmerking,
    ].filter(Boolean);
    return `${p.koerier_naam || "geen koerier"} · ${delen.join(" · ")}`;
  }

  function ververs(data) {
    if (data.stats) {
      $("stat-depot").textContent = data.stats.in_depot;
      $("stat-afgehaald").textContent = data.stats.afgehaald;
      $("stat-totaal").textContent = data.stats.totaal;
      $("stat-scans").textContent = data.stats.scans_vandaag;
    }
    if (data.laatste) {
      const body = document.querySelector("#laatste-tabel tbody");
      body.innerHTML = "";
      data.laatste.forEach((s) => {
        const tr = document.createElement("tr");
        const uit = s.actie === "UIT";
        tr.innerHTML =
          `<td>${s.tijdstip}</td>` +
          `<td><a href="/pakket/${encodeURIComponent(s.code)}">${s.code}</a></td>` +
          `<td><span class="badge ${uit ? "groen" : "oranje"}">${uit ? "AFGEHAALD" : "INGESCAND"}</span></td>` +
          `<td>${s.koerier_naam || "—"}</td><td>${s.gebruiker || "—"}</td>`;
        body.append(tr);
      });
    }
  }

  async function verstuur() {
    const code = codeVeld.value.trim();
    if (!code) { codeVeld.focus(); return; }

    const lading = {
      actie, code,
      koerier_id: $("koerier").value,
      gebruiker: $("gebruiker").value,
    };
    extraVelden.forEach((v) => (lading[v] = $(v).value));

    toon("info", "Bezig…");
    let data;
    try {
      const antwoord = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lading),
      });
      data = await antwoord.json();
    } catch (e) {
      toon("fout", "Geen verbinding met de app. Draait de server nog?");
      piep(false);
      return;
    }

    if (!data.ok) {
      toon("fout", "✖ " + data.melding);
      piep(false);
      codeVeld.select();
      return;
    }

    toon(actie === "ZOEK" ? "info" : "ok",
         (actie === "UIT" ? "✔ " : actie === "IN" ? "✔ " : "🔍 ") + data.melding,
         pakketDetail(data.pakket));
    piep(true);
    ververs(data);

    codeVeld.value = "";
    if (!$("behouden").checked) extraVelden.forEach((v) => ($(v).value = ""));
    codeVeld.focus();
  }

  $("verstuur").addEventListener("click", verstuur);
  $("wissen").addEventListener("click", () => {
    codeVeld.value = "";
    extraVelden.forEach((v) => ($(v).value = ""));
    toon("leeg", "Velden leeggemaakt.");
    codeVeld.focus();
  });
  codeVeld.addEventListener("keydown", (e) => {
    if (e.key === "Enter") { e.preventDefault(); verstuur(); }
  });

  // De cursor hoort altijd in het scanveld te staan.
  document.addEventListener("click", (e) => {
    if (!e.target.closest("input, select, button, a, summary, label")) codeVeld.focus();
  });
  zetModus("IN");
})();
