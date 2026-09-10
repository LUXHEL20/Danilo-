/** Beheer en instellingen: rol, bedrijfsgegevens, producten, ijking en back-ups. */
import { h, kaart, badge, veld, invoer, tekstvak, keuze, melding, dialoog, bevestig, download, datum } from '../ui.js';
import { ganaar, teken } from '../app.js';
import * as store from '../store.js';
import * as db from '../db.js';
import { CATEGORIEEN } from '../products.js';
import { PARAMETERS, STRIP_PRESETS, param } from '../params.js';
import { laadAfbeelding, naarCanvas, leesKleurenkaart, thumbnail } from '../strip.js';
import { rgbToCss } from '../color.js';
import { importeerBestand } from './luxaqua.js';
import { isNative, kiesFoto, bewaarEnDeelBestand } from '../native.js';

export async function toonBeheer() {
  const i = await store.instellingen();
  const wrap = h('div', {});
  const isLux = i.rol === 'luxaqua';

  /* --- rol --- */
  wrap.append(kaart('👤 Modus',
    h('p', { class: 'klein zacht' }, isLux
      ? 'U zit in de beheerdersmodus van LUX AQUA: u ziet alle klanten en hun hulpvragen.'
      : 'U zit in de klantmodus: u volgt uw eigen bak op.'),
    h('div', { class: 'knoprij' },
      h('button', {
        class: `knop ${isLux ? 'knop--stil' : 'knop--primair'}`,
        onclick: async () => { await store.zetInstelling({ rol: 'klant' }); ganaar('start'); teken(); },
      }, '🏠 Klantmodus'),
      h('button', {
        class: `knop ${isLux ? 'knop--primair' : 'knop--stil'}`,
        onclick: async () => { await store.zetInstelling({ rol: 'luxaqua' }); ganaar('klanten'); teken(); },
      }, '🛠️ LUX AQUA-modus'))));

  /* --- logo --- */
  const logoVoorbeeld = h('div', { class: 'rij', style: { marginBottom: '10px' } },
    i.logo
      ? h('img', { src: i.logo, class: 'logo-groot logo-groot--eigen', alt: 'Huidig logo' })
      : h('img', { src: 'assets/brand/LUX-AQUA-01-navy.svg', class: 'logo-groot', alt: 'LUX AQUA' }),
    h('span', { class: 'klein zacht' }, i.logo ? 'Een eigen logo is opgeladen.' : 'Het officiële LUX AQUA-logo wordt gebruikt.'));
  const logoKiezen = () => kiesFoto({ bron: 'galerij' }).then(async ([f]) => {
    if (!f) return;
    try {
      // svg en kleine bestanden houden we zoals ze zijn (transparantie blijft behouden),
      // grotere foto's verkleinen we naar 512 px
      const dataUrl = (f.type === 'image/svg+xml' || f.size < 400 * 1024)
        ? await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); })
        : await thumbnail(f, 512, 0.92);
      await store.zetInstelling({ logo: dataUrl });
      melding('Logo bewaard.', 'ok');
      teken();
    } catch (err) { melding(`Logo laden mislukt: ${err.message}`, 'fout'); }
  });
  wrap.append(kaart('🖼️ Logo',
    h('p', { class: 'klein zacht' },
      'Laad hier het LUX AQUA-logo op (png, jpg of svg). Het verschijnt in de kopbalk, op het welkomscherm ' +
      'en boven elk afgedrukt dossier. Standaard gebruikt de app het officiële LUX AQUA-logo.'),
    logoVoorbeeld,
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--primair', onclick: logoKiezen }, '📷 Logo kiezen'),
      i.logo ? h('button', {
        class: 'knop knop--stil', onclick: async () => {
          await store.zetInstelling({ logo: null }); melding('Logo verwijderd.', 'ok'); teken();
        },
      }, 'Verwijderen') : null)));

  /* --- bedrijfsgegevens --- */
  const b = i.bedrijf || {};
  const bNaam = invoer({ value: b.naam || 'LUX AQUA' });
  const bTel = invoer({ type: 'tel', value: b.telefoon || '', placeholder: 'Telefoonnummer met landcode, bv. +32 4xx xx xx xx' });
  const bMail = invoer({ type: 'email', value: b.email || '' });
  const bWeb = invoer({ type: 'url', value: b.website || '', placeholder: 'https://' });
  const bGebied = invoer({ value: b.werkgebied || '', placeholder: 'bv. regio Antwerpen en Kempen' });
  wrap.append(kaart('🏢 Gegevens van LUX AQUA',
    h('p', { class: 'klein zacht' }, 'Deze gegevens worden gebruikt voor de contactknoppen en om hulpvragen door te sturen.'),
    veld('Naam', bNaam), veld('Telefoon (WhatsApp)', bTel), veld('E-mail', bMail),
    veld('Website', bWeb), veld('Werkgebied', bGebied),
    h('button', {
      class: 'knop knop--primair knop--vol', onclick: async () => {
        await store.zetInstelling({ bedrijf: {
          naam: bNaam.value.trim(), telefoon: bTel.value.trim(), email: bMail.value.trim(),
          website: bWeb.value.trim(), werkgebied: bGebied.value.trim(),
        } });
        melding('Bewaard.', 'ok'); teken();
      },
    }, 'Bewaren')));

  /* --- kleurenkaart ijken --- */
  wrap.append(kaart('🎨 Kleurenkaart ijken',
    h('p', { class: 'klein zacht' },
      'Elke fabrikant gebruikt eigen kleuren. Fotografeer één keer de kleurenkaart van uw verpakking: ' +
      'de app leest de kleuren uit en gebruikt die daarna om uw strips af te lezen. Dat maakt het merkbaar nauwkeuriger.'),
    h('div', { class: 'chips', style: { marginBottom: '10px' } },
      ...STRIP_PRESETS.map((p) => badge(
        `${p.label}${i.kalibratie?.[p.id] ? ' ✓' : ''}`, i.kalibratie?.[p.id] ? 'goed' : ''))),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--primair', onclick: () => ijkKleurenkaart(i) }, '📷 Kaart inlezen'),
      Object.keys(i.kalibratie || {}).length
        ? h('button', {
          class: 'knop knop--stil', onclick: async () => {
            if (await bevestig('IJking wissen?', 'De app gebruikt daarna weer de standaardkleuren.', 'Wissen')) {
              await store.zetInstelling({ kalibratie: {} }); melding('IJking gewist.', 'ok'); teken();
            }
          },
        }, 'IJking wissen') : null)));

  /* --- producten --- */
  const catalogus = await store.catalogus();
  wrap.append(kaart('🧴 Producten',
    h('p', { class: 'klein zacht' },
      `${catalogus.length} producten. ` +
      (i.productenOverride ? 'U gebruikt een aangepaste catalogus.' : 'U gebruikt de standaardcatalogus. Pas namen, doseringen en verpakkingen aan naar uw echte assortiment.')),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--primair', onclick: () => beheerProducten() }, '✎ Producten beheren'),
      h('button', {
        class: 'knop knop--stil', onclick: () => bewaarEnDeelBestand('luxaqua-producten.json', JSON.stringify(catalogus, null, 2), 'application/json'),
      }, '⬇️ Exporteren'),
      h('button', { class: 'knop knop--stil', onclick: () => importeerProducten() }, '📥 Importeren'))));

  /* --- koppeling --- */
  if (isLux) {
    const kUrl = invoer({ type: 'url', value: i.koppeling?.url || '', placeholder: 'https://…/dossier' });
    const kSleutel = invoer({ value: i.koppeling?.sleutel || '', placeholder: 'Optionele toegangssleutel' });
    wrap.append(kaart('☁️ Automatisch doorsturen (optioneel)',
      h('p', { class: 'klein zacht' },
        'Zonder koppeling werkt alles lokaal op het toestel en delen klanten hun dossier via WhatsApp, e-mail of een bestand. ' +
        'Hebt u een eigen server of webhook, vul die dan hier in: klanten krijgen dan de knop om rechtstreeks door te sturen.'),
      veld('Webadres (POST)', kUrl), veld('Sleutel', kSleutel),
      h('button', {
        class: 'knop knop--primair knop--vol', onclick: async () => {
          await store.zetInstelling({ koppeling: { url: kUrl.value.trim(), sleutel: kSleutel.value.trim() } });
          melding('Koppeling bewaard.', 'ok');
        },
      }, 'Bewaren')));
  }

  /* --- gegevens --- */
  wrap.append(kaart('💾 Gegevens en back-up',
    h('p', { class: 'klein zacht' }, 'Alles staat op dit toestel. Maak regelmatig een back-up, zeker vóór u van toestel verandert.'),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--primair', onclick: maakBackup }, '⬇️ Back-up maken'),
      h('button', { class: 'knop knop--stil', onclick: zetBackupTerug }, '📥 Back-up terugzetten'),
      isLux ? h('button', { class: 'knop knop--stil', onclick: () => importeerBestand() }, '📥 Dossier inlezen') : null),
    h('div', { class: 'knoprij', style: { marginTop: '8px' } },
      h('button', {
        class: 'knop knop--stil', onclick: async () => {
          if (await bevestig('Alles wissen?', 'Alle klanten, bakken, metingen en foto\'s op dit toestel worden definitief verwijderd. Maak eerst een back-up.', 'Alles wissen')) {
            for (const s of db.STORES) await db.wis(s);
            melding('Alles gewist.', 'ok');
            location.hash = '#/';
            location.reload();
          }
        },
      }, '🗑 Alles wissen'))));

  /* --- over --- */
  wrap.append(kaart('ℹ️ Over deze app',
    h('ul', { class: 'opsomming klein' },
      h('li', {}, 'Werkt offline: u kan meten en noteren zonder internet.'),
      h('li', {}, 'Uw gegevens blijven op uw toestel tot u ze zelf deelt.'),
      h('li', {}, 'Voeg de app toe aan uw beginscherm om ze als een gewone app te gebruiken.'),
      h('li', {}, 'De aflezing van een teststrip is een hulpmiddel: bij twijfel of bij een alarmerende waarde bevestigt u met een druppeltest.')),
    h('p', { class: 'mini zacht' }, `Gegevens laatst gewijzigd: ${datum(Date.now())}`)));

  return wrap;
}

/* ------------------------------------------------------------------- back-ups */
async function maakBackup() {
  const data = { versie: 1, gemaakt: Date.now(), stores: {} };
  for (const s of db.STORES) {
    const rijen = await db.alles(s);
    data.stores[s] = await Promise.all(rijen.map(async (r) => {
      if (r.blob instanceof Blob) return { ...r, blob: null, blobWeggelaten: true };
      return r;
    }));
  }
  const naam = `luxaqua-backup-${new Date().toISOString().slice(0, 10)}.json`;
  if (isNative()) {
    const r = await bewaarEnDeelBestand(naam, JSON.stringify(data), 'application/json');
    if (r === 'gedeeld') melding('Back-up gedeeld. (Foto\'s zitten als kleine versie in de back-up.)', 'ok');
    return;
  }
  download(naam, JSON.stringify(data));
  melding('Back-up gedownload. (Foto\'s zitten als kleine versie in de back-up.)', 'ok');
}

function zetBackupTerug() {
  const inv = h('input', {
    type: 'file', accept: 'application/json,.json', hidden: true,
    onchange: async (e) => {
      const f = e.target.files?.[0]; if (!f) return;
      try {
        const data = JSON.parse(await f.text());
        if (!data?.stores) throw new Error('Dit is geen back-upbestand.');
        if (!await bevestig('Terugzetten?', 'De huidige gegevens op dit toestel worden aangevuld met de back-up.', 'Terugzetten')) return;
        for (const [naam, rijen] of Object.entries(data.stores)) {
          if (!db.STORES.includes(naam)) continue;
          await db.putVeel(naam, rijen);
        }
        melding('Back-up teruggezet.', 'ok');
        location.reload();
      } catch (err) {
        melding(`Terugzetten mislukt: ${err.message}`, 'fout');
      } finally { inv.remove(); }
    },
  });
  document.body.append(inv); inv.click();
}

/* ------------------------------------------------------------------- producten */
async function beheerProducten() {
  const catalogus = [...(await store.catalogus())];
  const lijst = h('div', {});

  const herteken = () => lijst.replaceChildren(...catalogus.map((p, index) =>
    h('div', { class: 'klikbaar' },
      h('span', { class: 'groei' }, h('strong', {}, p.naam), h('br'),
        h('span', { class: 'mini zacht' }, p.dosering?.omschrijving || '')),
      h('button', { class: 'chip', onclick: async () => { if (await productFormulier(p, catalogus, index)) herteken(); } }, '✎'),
      h('button', {
        class: 'chip', onclick: async () => {
          if (await bevestig('Product verwijderen?', p.naam, 'Verwijderen')) { catalogus.splice(index, 1); herteken(); }
        },
      }, '🗑'))));
  herteken();

  const bewaard = await dialoog({
    titel: 'Producten beheren', breed: true,
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' },
        'Pas de productnamen, omschrijvingen en doseringen aan naar het echte assortiment van LUX AQUA. ' +
        'De app gebruikt deze gegevens om automatisch de juiste dosering voor de bak van de klant te berekenen.'),
      lijst,
      h('button', {
        class: 'knop knop--stil knop--vol', onclick: async () => {
          const nieuw = { id: `product-${Date.now()}`, naam: 'Nieuw product', categorie: 'waterbereiding', lost_op: [], richting: 'neutraliseert', omschrijving: '', dosering: { model: 'vast', hoeveelheid: 5, per: 50, eenheid: 'ml', omschrijving: '5 ml per 50 liter' }, toepassing: '', opvolging: [], waarschuwingen: [], verpakkingen: [] };
          if (await productFormulier(nieuw, catalogus, catalogus.length)) herteken();
        },
      }, '+ Product toevoegen')),
    acties: [
      { label: 'Annuleren', waarde: false },
      {
        label: 'Standaard herstellen', actie: async () => {
          if (!await bevestig('Herstellen?', 'De standaardcatalogus wordt teruggezet en uw aanpassingen gaan verloren.', 'Herstellen')) return false;
          await store.zetInstelling({ productenOverride: null });
          return true;
        },
      },
      { label: 'Bewaren', stijl: 'knop--primair', actie: async () => { await store.zetInstelling({ productenOverride: catalogus }); return true; } },
    ],
  });
  if (bewaard) { melding('Catalogus bewaard.', 'ok'); teken(); }
}

async function productFormulier(p, catalogus, index) {
  const naam = invoer({ value: p.naam || '' });
  const categorie = keuze(CATEGORIEEN.map((c) => ({ value: c.id, label: c.label, selected: c.id === p.categorie })));
  const omschrijving = tekstvak({ value: p.omschrijving || '' });
  const verpakkingen = invoer({ value: (p.verpakkingen || []).join(', '), placeholder: '250 ml, 1 l' });
  const lostOp = invoer({ value: (p.lost_op || []).join(', '), placeholder: 'no2, no3, kh' });
  const richting = keuze([
    { value: 'omhoog', label: 'Verhoogt de waarde', selected: p.richting === 'omhoog' },
    { value: 'omlaag', label: 'Verlaagt de waarde', selected: p.richting === 'omlaag' },
    { value: 'neutraliseert', label: 'Neutraliseert / algemeen', selected: p.richting === 'neutraliseert' },
  ]);
  const model = keuze([
    { value: 'vast', label: 'Vaste dosis per volume', selected: p.dosering?.model !== 'delta' },
    { value: 'delta', label: 'Dosis om een waarde te verschuiven', selected: p.dosering?.model === 'delta' },
  ]);
  const hoeveelheid = invoer({ type: 'number', step: 0.1, value: p.dosering?.hoeveelheid ?? 5 });
  const eenheid = keuze([
    { value: 'ml', label: 'ml', selected: p.dosering?.eenheid === 'ml' },
    { value: 'g', label: 'g', selected: p.dosering?.eenheid === 'g' },
    { value: 'druppel', label: 'druppels', selected: p.dosering?.eenheid === 'druppel' },
  ]);
  const per = invoer({ type: 'number', value: p.dosering?.per ?? 50 });
  const doelParam = keuze([{ value: '', label: '(geen)' }, ...Object.values(PARAMETERS).map((x) => ({ value: x.id, label: x.label, selected: x.id === p.dosering?.param }))]);
  const effect = invoer({ type: 'number', step: 0.1, value: p.dosering?.effect ?? 1 });
  const doseringTekst = invoer({ value: p.dosering?.omschrijving || '' });
  const toepassing = tekstvak({ value: p.toepassing || '' });
  const opvolging = tekstvak({
    value: (p.opvolging || []).map((o) => `${o.na} | ${o.actie}`).join('\n'),
    placeholder: '24 uur | KH opnieuw meten\n1 week | Controlemeting',
  });
  const waarschuwingen = tekstvak({ value: (p.waarschuwingen || []).join('\n'), placeholder: 'Eén waarschuwing per regel' });

  return dialoog({
    titel: 'Product', breed: true,
    inhoud: h('div', {},
      veld('Naam', naam), veld('Categorie', categorie), veld('Omschrijving', omschrijving),
      veld('Verpakkingen', verpakkingen),
      veld('Werkt op welke waarden?', lostOp, `Gebruik de codes: ${Object.keys(PARAMETERS).join(', ')}`),
      veld('Richting', richting),
      veld('Doseringsmodel', model),
      h('div', { class: 'raster3' }, veld('Hoeveelheid', hoeveelheid), veld('Eenheid', eenheid), veld('Per (liter)', per)),
      veld('Verschuift welke waarde? (enkel bij model "verschuiven")', doelParam),
      veld('Effect per dosis', effect, 'bv. 1 = één eenheid verschuiving (°dH, pH-punt…)'),
      veld('Doseringstekst voor de klant', doseringTekst),
      veld('Hoe toepassen?', toepassing),
      veld('Opvolging (één per regel: termijn | actie)', opvolging),
      veld('Waarschuwingen', waarschuwingen)),
    acties: [
      { label: 'Annuleren', waarde: false },
      {
        label: 'Bewaren', stijl: 'knop--primair', actie: () => {
          const nieuw = {
            ...p,
            naam: naam.value.trim(), categorie: categorie.value, omschrijving: omschrijving.value.trim(),
            verpakkingen: verpakkingen.value.split(',').map((s) => s.trim()).filter(Boolean),
            lost_op: lostOp.value.split(',').map((s) => s.trim()).filter((s) => PARAMETERS[s]),
            richting: richting.value,
            dosering: {
              model: model.value, hoeveelheid: Number(hoeveelheid.value) || 0, per: Number(per.value) || 1,
              eenheid: eenheid.value, param: doelParam.value || undefined, effect: Number(effect.value) || 1,
              omschrijving: doseringTekst.value.trim(),
            },
            toepassing: toepassing.value.trim(),
            opvolging: opvolging.value.split('\n').map((r) => {
              const [na, ...rest] = r.split('|');
              return na && rest.length ? { na: na.trim(), actie: rest.join('|').trim() } : null;
            }).filter(Boolean),
            waarschuwingen: waarschuwingen.value.split('\n').map((s) => s.trim()).filter(Boolean),
          };
          catalogus[index] = nieuw;
          return true;
        },
      },
    ],
  });
}

function importeerProducten() {
  const inv = h('input', {
    type: 'file', accept: 'application/json,.json', hidden: true,
    onchange: async (e) => {
      const f = e.target.files?.[0]; if (!f) return;
      try {
        const lijst = JSON.parse(await f.text());
        if (!Array.isArray(lijst)) throw new Error('Het bestand moet een lijst met producten bevatten.');
        await store.zetInstelling({ productenOverride: lijst });
        melding(`${lijst.length} producten ingelezen.`, 'ok');
        teken();
      } catch (err) { melding(`Inlezen mislukt: ${err.message}`, 'fout'); }
      finally { inv.remove(); }
    },
  });
  document.body.append(inv); inv.click();
}

/* ---------------------------------------------------------- kleurenkaart ijken */
async function ijkKleurenkaart(instellingen) {
  const presetKeuze = keuze(STRIP_PRESETS.map((p) => ({ value: p.id, label: p.label })));
  let kaartFoto = null;             // gekozen foto van de kleurenkaart
  const kaartNaam = h('span', { class: 'klein zacht' }, 'Nog geen foto gekozen.');
  const kaartKnop = h('button', { class: 'knop knop--stil', type: 'button' }, '📷 Foto nemen of kiezen');
  const bestand = h('div', { class: 'rij' }, kaartKnop, kaartNaam);
  const houder = h('div', {});
  let raster = null, preset = STRIP_PRESETS[0], rect = null, canvas = null, imageData = null;
  let kolommen = 6;

  const kolomVeld = invoer({ type: 'number', min: 2, max: 12, value: kolommen });

  const analyseer = async () => {
    const f = kaartFoto; if (!f) return;
    preset = STRIP_PRESETS.find((p) => p.id === presetKeuze.value) || STRIP_PRESETS[0];
    kolommen = Number(kolomVeld.value) || 6;
    const img = await laadAfbeelding(f);
    canvas = naarCanvas(img, 1000);
    imageData = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, canvas.width, canvas.height);
    rect = rect || { x: 0, y: 0, w: canvas.width, h: canvas.height };
    raster = leesKleurenkaart(imageData, rect, preset.pads.length, kolommen);
    tekenVoorbeeld();
  };

  const waardeVelden = {};
  function tekenVoorbeeld() {
    houder.replaceChildren(
      h('p', { class: 'klein zacht' },
        `De kaart wordt gelezen als ${preset.pads.length} rijen (in de volgorde van de strip) × ${kolommen} kolommen. ` +
        'Zorg dat enkel de kleurenkaart in beeld staat, recht van boven gefotografeerd.'),
      ...preset.pads.map((paramId, r) => {
        const standaard = (PARAMETERS[paramId]?.scale || []).map((s) => s.value);
        const veldje = invoer({
          value: (waardeVelden[paramId] ?? standaard.slice(0, kolommen).join(', ')),
          placeholder: 'waarden per kolom, gescheiden door komma\'s',
          oninput: (e) => { waardeVelden[paramId] = e.target.value; },
        });
        return h('div', { style: { marginBottom: '10px' } },
          h('div', { class: 'rij rij--tussen' },
            h('strong', { class: 'klein' }, param(paramId)?.label || paramId),
            h('div', { class: 'rij', style: { gap: '3px' } },
              ...(raster?.[r] || []).map((c) => h('span', { style: { width: '20px', height: '20px', borderRadius: '5px', background: rgbToCss(c) } })))),
          veldje);
      }));
  }

  kaartKnop.addEventListener('click', () => kiesFoto({ bron: 'vraag' }).then(([f]) => {
    if (!f) return;
    kaartFoto = f;
    kaartNaam.textContent = f.name || 'Foto gekozen';
    analyseer();
  }));
  kolomVeld.addEventListener('change', analyseer);
  presetKeuze.addEventListener('change', analyseer);

  const bewaard = await dialoog({
    titel: 'Kleurenkaart ijken', breed: true,
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' },
        'Fotografeer de kleurenkaart van uw verpakking. De app leest per testveld de kleuren uit en gebruikt die ' +
        'voortaan in plaats van de standaardkleuren.'),
      veld('Welke strip?', presetKeuze),
      veld('Aantal kleurniveaus per veld', kolomVeld),
      veld('Foto van de kaart', bestand),
      houder),
    acties: [
      { label: 'Annuleren', waarde: false },
      {
        label: 'IJking bewaren', stijl: 'knop--primair', actie: async () => {
          if (!raster) { melding('Kies eerst een foto van de kaart.', 'fout'); return false; }
          const kalibratie = { ...(instellingen.kalibratie || {}) };
          const perParam = {};
          preset.pads.forEach((paramId, r) => {
            const waarden = (waardeVelden[paramId] ?? (PARAMETERS[paramId]?.scale || []).map((s) => s.value).slice(0, kolommen).join(','))
              .split(',').map((s) => Number(s.trim())).filter((n) => !Number.isNaN(n));
            const kleuren = raster[r] || [];
            const schaal = waarden.map((value, k) => (kleuren[k] ? { value, rgb: kleuren[k] } : null)).filter(Boolean);
            if (schaal.length >= 2) perParam[paramId] = schaal;
          });
          if (!Object.keys(perParam).length) { melding('Er kon geen bruikbare schaal gemaakt worden.', 'fout'); return false; }
          kalibratie[preset.id] = perParam;
          await store.zetInstelling({ kalibratie });
          return true;
        },
      },
    ],
  });
  if (bewaard) { melding('IJking bewaard. Uw strips worden nu met uw kaart gelezen.', 'ok'); teken(); }
}
