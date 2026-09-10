/**
 * Dossier opbouwen en delen: alles wat LUX AQUA nodig heeft om van op afstand
 * een eerste indruk te krijgen — bakgegevens, vissenbestand, laatste metingen,
 * advies, foto's en de hulpvraag.
 */
import * as store from './store.js';
import { fmt, param, profile, statusOf, STATUS_LABEL } from './params.js';
import { maakAdvies } from './advies.js';
import { download, kopieer, melding, blobNaarDataUrl } from './ui.js';
import { isNative, deel, bewaarEnDeelBestand } from './native.js';

export const DOSSIER_VERSIE = 1;

/**
 * Bouwt een volledig dossier van één bak.
 * @param {string} bakId
 * @param {{fotos?:boolean, aantalMetingen?:number, hulpvraag?:object}} opties
 */
export async function maakDossier(bakId, opties = {}) {
  const { fotos = true, aantalMetingen = 12, hulpvraag = null } = opties;
  const bak = await store.bak(bakId);
  if (!bak) throw new Error('Bak niet gevonden.');
  const klant = bak.klantId ? await store.klant(bak.klantId) : null;
  const vissen = await store.vissenVanBak(bakId);
  const metingen = (await store.metingenVanBak(bakId)).slice(0, aantalMetingen);
  const taken = (await store.takenVanBak(bakId)).filter((t) => !t.klaar);
  const catalogus = await store.catalogus();
  const advies = metingen[0] ? maakAdvies(metingen[0], bak, metingen.slice(1), catalogus) : null;

  const dossier = {
    versie: DOSSIER_VERSIE,
    gegenereerd: Date.now(),
    klant: klant ? { ...klant } : null,
    bak: { ...bak },
    vissen,
    metingen: metingen.map((m) => ({ ...m, stripFotoBlob: undefined })),
    taken,
    advies: advies ? { score: advies.score, samenvatting: advies.samenvatting, acties: advies.acties } : null,
    hulpvraag,
    fotos: [],
  };

  if (fotos) {
    const lijst = (await store.fotosVanBak(bakId)).sort((a, b) => b.datum - a.datum).slice(0, 12);
    for (const f of lijst) {
      dossier.fotos.push({
        id: f.id, soort: f.soort, notitie: f.notitie, datum: f.datum,
        thumb: f.thumb || (f.blob ? await blobNaarDataUrl(f.blob) : null),
      });
    }
  }
  return dossier;
}

/** Leesbare samenvatting in tekst (voor WhatsApp, e-mail of een telefonisch gesprek). */
export function dossierAlsTekst(dossier) {
  const b = dossier.bak;
  const prof = profile(b.profiel);
  const r = [];
  r.push(`*LUX AQUA: dossier ${b.naam || 'aquarium'}*`);
  if (dossier.klant) r.push(`Klant: ${dossier.klant.naam || '–'}${dossier.klant.telefoon ? ` (${dossier.klant.telefoon})` : ''}`);
  r.push(`Type: ${prof.label}, ${b.liters || '?'} liter`);
  if (b.opgestart) r.push(`Opgestart: ${new Date(b.opgestart).toLocaleDateString('nl-BE')}`);
  if (b.filter) r.push(`Filter: ${b.filter}`);
  if (b.verlichting) r.push(`Verlichting: ${b.verlichting}`);

  if (dossier.vissen?.length) {
    r.push('', '*Vissenbestand*');
    for (const v of dossier.vissen) r.push(`• ${v.aantal}× ${v.soort}${v.opmerking ? ` (${v.opmerking})` : ''}`);
  }

  const m = dossier.metingen?.[0];
  if (m) {
    r.push('', `*Laatste meting* (${new Date(m.datum).toLocaleDateString('nl-BE')})`);
    for (const [id, waarde] of Object.entries(m.waarden || {})) {
      if (waarde == null || waarde === '') continue;
      const st = statusOf(id, Number(waarde), b.profiel);
      const merk = st === 'kritiek' ? ' ‼️' : st === 'let-op' ? ' ⚠️' : '';
      r.push(`• ${param(id)?.short || id}: ${fmt(id, Number(waarde))}${merk}`);
    }
    if (m.opmerking) r.push(`Opmerking: ${m.opmerking}`);
  }

  if (dossier.advies) {
    r.push('', `*Beoordeling*: ${dossier.advies.samenvatting} (score ${dossier.advies.score}/100)`);
    for (const a of dossier.advies.acties.slice(0, 4)) {
      r.push(`• ${a.titel}`);
      if (a.producten?.length) r.push(`   → ${a.producten.map((p) => `${p.naam}${p.dosis ? ` (${p.dosis.tekst})` : ''}`).join(', ')}`);
    }
  }

  if (dossier.hulpvraag) {
    r.push('', '*Hulpvraag*');
    r.push(`Type: ${dossier.hulpvraag.type}`);
    r.push(`Urgentie: ${dossier.hulpvraag.urgentie}`);
    if (dossier.hulpvraag.omschrijving) r.push(dossier.hulpvraag.omschrijving);
    if (dossier.hulpvraag.beschikbaarheid) r.push(`Beschikbaar: ${dossier.hulpvraag.beschikbaarheid}`);
  }

  if (dossier.fotos?.length) r.push('', `${dossier.fotos.length} foto('s) beschikbaar in het dossierbestand.`);
  return r.join('\n');
}

/** Bewaart het dossier als bestand dat LUX AQUA kan inlezen: download op het web, deelmenu in de native app. */
export function exporteerDossier(dossier) {
  const naam = `luxaqua-dossier-${(dossier.bak?.naam || 'bak').replace(/[^\w-]+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`;
  const inhoud = JSON.stringify(dossier, null, 2);
  if (isNative()) return bewaarEnDeelBestand(naam, inhoud, 'application/json');
  download(naam, inhoud);
  return 'gedownload';
}

/** Deelt via het deelmenu van het toestel, met terugval op kopiëren. */
export async function deelDossier(dossier, { metBestand = true } = {}) {
  const tekst = dossierAlsTekst(dossier);
  const bestanden = metBestand
    ? [new File([JSON.stringify(dossier)], 'luxaqua-dossier.json', { type: 'application/json' })]
    : [];
  const r = await deel({ titel: 'LUX AQUA dossier', tekst, bestanden });
  if (r !== 'niet-mogelijk') return r;
  await kopieer(tekst);
  return 'gekopieerd';
}

export const whatsappLink = (tekst, nummer = '') =>
  `https://wa.me/${nummer.replace(/[^\d]/g, '')}?text=${encodeURIComponent(tekst)}`;

export const mailLink = (tekst, adres = '', onderwerp = 'LUX AQUA: dossier en hulpvraag') =>
  `mailto:${adres}?subject=${encodeURIComponent(onderwerp)}&body=${encodeURIComponent(tekst)}`;

/** Leest een dossierbestand in bij LUX AQUA en voegt het toe aan de eigen gegevens. */
export async function importeerDossier(json) {
  const d = typeof json === 'string' ? JSON.parse(json) : json;
  if (!d?.bak) throw new Error('Dit bestand bevat geen geldig dossier.');

  let klantId = d.klant?.id || null;
  if (d.klant) {
    const bestaande = (await store.klanten()).find((k) => k.id === d.klant.id || (k.email && k.email === d.klant.email));
    const rec = await store.bewaarKlant({ ...d.klant, id: bestaande?.id || d.klant.id, bron: 'gedeeld dossier' });
    klantId = rec.id;
  }

  const bak = await store.bewaarBak({ ...d.bak, klantId });
  for (const v of d.vissen || []) await store.bewaarVis({ ...v, bakId: bak.id });
  for (const m of d.metingen || []) await store.bewaarMeting({ ...m, bakId: bak.id, klantId });
  for (const t of d.taken || []) await store.bewaarTaken(bak.id, [t]);
  for (const f of d.fotos || []) {
    if (!f.thumb) continue;
    await store.bewaarFoto({ bakId: bak.id, blob: null, thumb: f.thumb, soort: f.soort, notitie: f.notitie });
  }
  if (d.hulpvraag) await store.bewaarHulpvraag({ ...d.hulpvraag, klantId, bakId: bak.id, bron: 'gedeeld dossier' });
  return { klantId, bakId: bak.id };
}

/** Optionele koppeling met een eigen server (bv. voor automatische opvolging). */
export async function stuurNaarServer(dossier) {
  const i = await store.instellingen();
  if (!i.koppeling?.url) return { ok: false, reden: 'geen-koppeling' };
  try {
    const res = await fetch(i.koppeling.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(i.koppeling.sleutel ? { Authorization: `Bearer ${i.koppeling.sleutel}` } : {}) },
      body: JSON.stringify(dossier),
    });
    if (!res.ok) throw new Error(`Server antwoordde met ${res.status}`);
    return { ok: true };
  } catch (e) {
    melding(`Versturen naar de server lukte niet: ${e.message}`, 'fout');
    return { ok: false, reden: e.message };
  }
}

/** Bouwt de printbare weergave van een dossier als volledige HTML-pagina. */
export function dossierAlsHtml(dossier, inst = {}) {
  const bedrijf = inst.bedrijf || {};
  const logo = inst.logo || 'assets/brand/LUX-AQUA-01-navy.svg';
  const b = dossier.bak;
  const prof = profile(b.profiel);
  const rij = (l, w) => `<tr><th>${l}</th><td>${w ?? '–'}</td></tr>`;
  const m = dossier.metingen?.[0];
  const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>LUX AQUA, dossier ${b.naam || 'aquarium'}</title>
  <style>
    body{font:14px/1.5 system-ui,sans-serif;color:#12232e;margin:32px;max-width:800px}
    h1{color:#0b6b78;margin-bottom:4px} h2{margin-top:28px;border-bottom:2px solid #0b6b78;padding-bottom:4px;color:#0b6b78}
    table{border-collapse:collapse;width:100%;margin:8px 0} th,td{text-align:left;padding:6px 8px;border-bottom:1px solid #dbe6ea}
    th{width:38%;font-weight:600;color:#3c5866} .kritiek{color:#b3261e;font-weight:700} .let-op{color:#a06400;font-weight:600}
    ul{padding-left:18px} img{max-width:220px;border-radius:8px;margin:6px 8px 0 0}
    .voet{margin-top:32px;font-size:12px;color:#6b7f89}
    .kop{display:flex;align-items:center;gap:14px;margin-bottom:6px}
    .kop img{height:56px;width:auto;object-fit:contain}
    .kop h1{margin:0}
  </style></head><body>
  <div class="kop"><img src="${logo}" alt=""><div><h1>${bedrijf.naam || 'LUX AQUA'}: dossier</h1>
  <div style="font-size:12px;color:#6b7f89">${[bedrijf.telefoon, bedrijf.email, bedrijf.website].filter(Boolean).join(' · ')}</div></div></div>
  <p>${b.naam || 'Aquarium'} · ${prof.label} · ${b.liters || '?'} liter · opgemaakt op ${new Date(dossier.gegenereerd).toLocaleString('nl-BE')}</p>
  <h2>Klant</h2><table>
    ${rij('Naam', dossier.klant?.naam)}${rij('Telefoon', dossier.klant?.telefoon)}${rij('E-mail', dossier.klant?.email)}
    ${rij('Adres', [dossier.klant?.adres, dossier.klant?.gemeente].filter(Boolean).join(', '))}</table>
  <h2>Installatie</h2><table>
    ${rij('Inhoud', b.liters ? b.liters + ' liter' : null)}${rij('Afmetingen', b.afmetingen ? `${b.afmetingen.lengte} × ${b.afmetingen.breedte} × ${b.afmetingen.hoogte} cm` : null)}
    ${rij('Opgestart', b.opgestart ? new Date(b.opgestart).toLocaleDateString('nl-BE') : null)}
    ${rij('Filter', b.filter)}${rij('Verlichting', b.verlichting)}${rij('CO₂', b.co2)}${rij('Bodem', b.bodem)}
    ${rij('Waterverversing', b.verversing)}${rij('Opmerkingen', b.opmerking)}</table>
  <h2>Vissenbestand</h2>
  ${dossier.vissen?.length ? `<ul>${dossier.vissen.map((v) => `<li>${v.aantal}× ${v.soort}${v.opmerking ? ` (${v.opmerking})` : ''}</li>`).join('')}</ul>` : '<p>Nog niet ingevuld.</p>'}
  <h2>Laatste meting</h2>
  ${m ? `<p>${new Date(m.datum).toLocaleString('nl-BE')}</p><table>${Object.entries(m.waarden || {}).filter(([, w]) => w !== '' && w != null)
      .map(([id, w]) => { const st = statusOf(id, Number(w), b.profiel); return `<tr><th>${param(id)?.label || id}</th><td class="${st}">${fmt(id, Number(w))} (${STATUS_LABEL[st]})</td></tr>`; }).join('')}</table>`
    : '<p>Nog geen meting.</p>'}
  <h2>Advies</h2>
  ${dossier.advies ? `<p><strong>${dossier.advies.samenvatting}</strong> (score ${dossier.advies.score}/100)</p>` +
      dossier.advies.acties.map((a) => `<h3>${a.titel}</h3><p>${a.waarom || ''}</p><ul>${(a.stappen || []).map((s) => `<li>${s}</li>`).join('')}</ul>` +
        (a.producten?.length ? `<p><em>Producten:</em> ${a.producten.map((p) => `${p.naam}${p.dosis ? `: ${p.dosis.tekst}` : ''}`).join('; ')}</p>` : '')).join('')
    : '<p>Geen advies beschikbaar.</p>'}
  ${dossier.hulpvraag ? `<h2>Hulpvraag</h2><table>${rij('Type', dossier.hulpvraag.type)}${rij('Urgentie', dossier.hulpvraag.urgentie)}${rij('Beschikbaarheid', dossier.hulpvraag.beschikbaarheid)}${rij('Omschrijving', dossier.hulpvraag.omschrijving)}</table>` : ''}
  ${dossier.fotos?.length ? `<h2>Foto's</h2>${dossier.fotos.map((f) => `<img src="${f.thumb}" alt="${f.soort}">`).join('')}` : ''}
  <p class="voet">Dit dossier is opgemaakt met de app van ${bedrijf.naam || 'LUX AQUA'}. De adviezen zijn een eerste inschatting op basis van de ingegeven waarden; met een huisbezoek stellen wij een probleem definitief vast. LUX AQUA is onderdeel van LUX 2.0.</p>
  </body></html>`;
  return html;
}

/**
 * Printbare weergave: op het web via de printdialoog (kan als pdf bewaard worden).
 * Een WebView kan niet afdrukken; in de native app delen we het dossier als html-bestand.
 */
export async function printDossier(dossier) {
  const inst = await store.instellingen();
  const html = dossierAlsHtml(dossier, inst);
  if (isNative()) return bewaarEnDeelBestand('luxaqua-dossier.html', html, 'text/html');
  const v = window.open('', '_blank');
  if (!v) { melding('Sta pop-ups toe om het dossier af te drukken.', 'fout'); return; }
  v.document.write(html); v.document.close();
  setTimeout(() => v.print(), 400);
}
