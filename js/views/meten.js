/**
 * Meting toevoegen: teststrip fotograferen en laten uitlezen, of zelf invullen.
 * Terwijl je de waarden ingeeft, toont de app meteen de voorgestelde acties.
 */
import { h, kaart, badge, veld, invoer, tekstvak, melding, dialoog, legeStaat } from '../ui.js';
import { ctx, ganaar, teken } from '../app.js';
import * as store from '../store.js';
import { PARAMETERS, param, profile, fmt, statusOf } from '../params.js';
import { STRIP_PRESETS } from '../params.js';
import { maakAdvies, opvolgTaken } from '../advies.js';
import { laadAfbeelding, naarCanvas, comprimeer, thumbnail, zoekStrip, standaardKader, leesStrip } from '../strip.js';
import { rgbToCss } from '../color.js';
import { adviesKaart, parameterUitleg } from './onderdelen.js';
import { kiesFoto } from '../native.js';

export async function toonMeten() {
  const bak = ctx.bak;
  if (!bak) {
    return legeStaat('🐠', 'Nog geen bak', 'Maak eerst je aquarium of vijver aan.',
      h('button', { class: 'knop knop--primair', onclick: () => ganaar('bak/nieuw') }, 'Bak toevoegen'));
  }

  const prof = profile(bak.profiel);
  const instellingen = await store.instellingen();
  const catalogus = await store.catalogus();
  const historiek = await store.metingenVanBak(bak.id);

  const waarden = {};                 // paramId -> waarde (string)
  const bronnen = {};                 // paramId -> 'strip' | 'handmatig'
  let stripAnalyse = null;            // resultaat van het uitlezen
  let stripFoto = null;               // gecomprimeerde blob
  let stripThumb = null;

  const wrap = h('div', {});
  const adviesHouder = h('div', {});
  const formulierHouder = h('div', {});
  const stripHouder = h('div', {});

  /* ------------------------------------------------------------- strip inlezen */
  // camera of galerij, natief via de Capacitor-camera en op het web via een bestandskiezer
  const fotoKiezen = () => kiesFoto({ bron: 'vraag' }).then(([f]) => { if (f) verwerkFoto(f); });

  const stripKaart = kaart(h('span', {}, '📸 Teststrip inlezen'),
    h('p', { class: 'klein zacht' },
      'Dompel je strip volgens de handleiding, schud het overtollige water af en fotografeer de strip meteen ' +
      '(na de wachttijd op de verpakking) op een effen, donkere ondergrond bij daglicht — zonder flits en zonder schaduw over de strip.'),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--primair', onclick: fotoKiezen }, '📷 Foto nemen of kiezen'),
      h('button', { class: 'knop knop--stil', onclick: () => toonStripHulp() }, 'Tips voor een goede foto')),
    stripHouder);

  wrap.append(stripKaart);

  async function verwerkFoto(bestand) {
    try {
      melding('Foto wordt geanalyseerd…');
      const img = await laadAfbeelding(bestand);
      const canvas = naarCanvas(img, 1000);
      const ctx2d = canvas.getContext('2d', { willReadFrequently: true });
      const imageData = ctx2d.getImageData(0, 0, canvas.width, canvas.height);
      stripFoto = await comprimeer(img, 1200, 0.8);
      stripThumb = await thumbnail(img, 420);

      const staat = {
        canvas, imageData, img,
        rect: zoekStrip(imageData) || standaardKader(canvas.width, canvas.height),
        presetId: instellingen.laatsteStrip || 'strip6',
        omgekeerd: false,
      };
      tekenStripUI(staat);
    } catch (e) {
      console.error(e);
      melding(`Analyse mislukt: ${e.message}`, 'fout');
    }
  }

  function tekenStripUI(staat) {
    const preset = STRIP_PRESETS.find((p) => p.id === staat.presetId) || STRIP_PRESETS[0];
    const kalibratie = instellingen.kalibratie?.[preset.id] || null;
    stripAnalyse = leesStrip(staat.imageData, staat.rect, preset.pads, { omgekeerd: staat.omgekeerd, kalibratie });

    // waarden overnemen als voorstel
    for (const r of stripAnalyse.resultaten) {
      if (r.waarde != null) { waarden[r.param] = String(r.waarde); bronnen[r.param] = 'strip'; }
    }

    const doek = h('canvas', { class: 'stripdoek__canvas' });
    doek.width = staat.canvas.width; doek.height = staat.canvas.height;
    const dctx = doek.getContext('2d');
    const herteken = () => {
      dctx.drawImage(staat.canvas, 0, 0);
      dctx.strokeStyle = '#4fd1c5'; dctx.lineWidth = Math.max(2, doek.width / 220);
      dctx.setLineDash([8, 6]);
      dctx.strokeRect(staat.rect.x, staat.rect.y, staat.rect.w, staat.rect.h);
      dctx.setLineDash([]);
      dctx.lineWidth = Math.max(2, doek.width / 300);
      for (const r of stripAnalyse.resultaten) {
        dctx.strokeStyle = '#ffffff';
        dctx.strokeRect(r.vak.x, r.vak.y, r.vak.w, r.vak.h);
        dctx.strokeStyle = '#f4511e';
        dctx.strokeRect(r.vak.x + 1, r.vak.y + 1, r.vak.w - 2, r.vak.h - 2);
      }
    };
    herteken();

    // handmatig kader slepen
    let sleep = null;
    const naarDoek = (e) => {
      const r = doek.getBoundingClientRect();
      return { x: ((e.clientX - r.left) / r.width) * doek.width, y: ((e.clientY - r.top) / r.height) * doek.height };
    };
    doek.addEventListener('pointerdown', (e) => { doek.setPointerCapture(e.pointerId); sleep = naarDoek(e); });
    doek.addEventListener('pointermove', (e) => {
      if (!sleep) return;
      const p = naarDoek(e);
      dctx.drawImage(staat.canvas, 0, 0);
      dctx.strokeStyle = '#4fd1c5'; dctx.lineWidth = Math.max(2, doek.width / 220);
      dctx.strokeRect(Math.min(sleep.x, p.x), Math.min(sleep.y, p.y), Math.abs(p.x - sleep.x), Math.abs(p.y - sleep.y));
    });
    doek.addEventListener('pointerup', (e) => {
      if (!sleep) return;
      const p = naarDoek(e);
      const nieuw = {
        x: Math.round(Math.min(sleep.x, p.x)), y: Math.round(Math.min(sleep.y, p.y)),
        w: Math.round(Math.abs(p.x - sleep.x)), h: Math.round(Math.abs(p.y - sleep.y)),
      };
      sleep = null;
      if (nieuw.w > 12 && nieuw.h > 12) { staat.rect = nieuw; tekenStripUI(staat); }
      else herteken();
    });

    const presetKeuze = h('select', {
      class: 'invoer',
      onchange: async (e) => { staat.presetId = e.target.value; await store.zetInstelling({ laatsteStrip: e.target.value }); tekenStripUI(staat); },
    }, ...STRIP_PRESETS.map((p) => h('option', { value: p.id, selected: p.id === staat.presetId }, p.label)));

    stripHouder.replaceChildren(
      h('div', { class: 'stripdoek', style: { marginTop: '12px' } }, doek),
      h('p', { class: 'mini zacht', style: { marginTop: '6px' } },
        stripAnalyse.veldjesGevonden
          ? '✅ De testveldjes zijn automatisch gevonden. Klopt het kader niet? Sleep met je vinger een nieuw kader over de strip.'
          : '⚠️ De veldjes konden niet automatisch gevonden worden. Sleep een kader rond enkel de strip en controleer de waarden goed.'),
      veld('Welke strip gebruik je?', presetKeuze),
      h('div', { class: 'knoprij' },
        h('button', { class: 'knop knop--stil', onclick: () => { staat.omgekeerd = !staat.omgekeerd; tekenStripUI(staat); } }, '🔄 Volgorde omkeren'),
        h('button', { class: 'knop knop--stil', onclick: () => { staat.rect = zoekStrip(staat.imageData) || standaardKader(staat.canvas.width, staat.canvas.height); tekenStripUI(staat); } }, '🎯 Opnieuw zoeken'),
        h('button', { class: 'knop knop--stil', onclick: fotoKiezen }, '📷 Nieuwe foto')),
      h('div', { class: 'kaart kaart--vlak', style: { marginTop: '10px' } },
        h('h4', {}, 'Wat de app afleest'),
        ...stripAnalyse.resultaten.map((r) => stripVeldRij(r)),
        h('p', { class: 'mini zacht', style: { marginTop: '8px' } },
          'Dit is een voorstel op basis van de kleuren. Kijk het altijd na met de kleurenkaart op je verpakking — ' +
          'je kan elke waarde hieronder aanpassen. Bij twijfel: doe een druppeltest voor die ene waarde.')),
    );
    tekenFormulier();
  }

  function stripVeldRij(r) {
    const p = param(r.param);
    const bt = r.betrouwbaarheid;
    return h('div', { class: 'stripveld' },
      h('span', { class: 'staal', style: { background: rgbToCss(r.kleur) } }),
      h('span', { class: 'groei' },
        h('strong', {}, p?.label || r.param), h('br'),
        h('span', { class: `mini betrouwbaar-${bt.niveau}` }, `${bt.tekst} (${bt.percent}%)`),
        r.gekalibreerd ? h('span', { class: 'mini zacht' }, ' · eigen ijking') : null),
      h('span', { style: { textAlign: 'right' } },
        h('strong', {}, r.waarde != null ? fmt(r.param, r.waarde) : '?'), h('br'),
        r.geschat != null && r.geschat !== r.waarde
          ? h('span', { class: 'mini zacht' }, `tussenwaarde ≈ ${fmt(r.param, r.geschat)}`) : null));
  }

  async function toonStripHulp() {
    await dialoog({
      titel: 'Zo krijg je een betrouwbare aflezing',
      inhoud: h('div', {},
        h('ul', { class: 'opsomming' },
          h('li', {}, 'Respecteer de wachttijd op de verpakking — te vroeg of te laat fotograferen geeft een andere kleur.'),
          h('li', {}, 'Leg de strip plat op een effen, donkere en droge ondergrond.'),
          h('li', {}, 'Fotografeer recht van boven, bij daglicht, zonder flits.'),
          h('li', {}, 'Zorg dat je eigen schaduw niet over de strip valt.'),
          h('li', {}, 'Vul de strip zo groot mogelijk in beeld, maar hou de volledige strip zichtbaar.'),
          h('li', {}, 'Schud het teveel aan water af zodat de kleuren niet uitlopen.')),
        h('p', { class: 'klein zacht' },
          'Wil je het nóg nauwkeuriger? Fotografeer één keer de kleurenkaart van je verpakking bij ' +
          'Beheer → Kleurenkaart ijken. De app gebruikt dan de kleuren van jouw merk in plaats van de standaardkaart.')),
      acties: [{ label: 'Begrepen', stijl: 'knop--primair', waarde: true }],
    });
  }

  /* ------------------------------------------------------------------ formulier */
  function tekenFormulier() {
    const velden = prof.params.map((id) => {
      const p = PARAMETERS[id];
      const inv = invoer({
        type: 'number', inputmode: 'decimal', step: p.step, min: p.min, max: p.max,
        value: waarden[id] ?? '', placeholder: p.unit || '',
        oninput: (e) => {
          waarden[id] = e.target.value;
          bronnen[id] = bronnen[id] === 'strip' && e.target.value === String(stripWaarde(id)) ? 'strip' : 'handmatig';
          tekenAdvies();
          kleurVeld(inv, id, e.target.value);
        },
      });
      kleurVeld(inv, id, waarden[id]);
      return h('div', { style: { marginBottom: '4px' } },
        h('div', { class: 'rij rij--tussen' },
          h('span', { class: 'veld__label', style: { marginBottom: 0 } }, p.label),
          h('button', {
            class: 'chip', style: { minHeight: '28px', padding: '2px 10px', fontSize: '.72rem' },
            onclick: () => dialoog({ titel: p.label, inhoud: parameterUitleg(id), acties: [{ label: 'Sluiten', waarde: true }] }),
          }, 'ℹ️ uitleg')),
        h('div', { class: 'rij' }, inv,
          bronnen[id] === 'strip' ? badge('strip', 'info') : null));
    });

    const opmerking = tekstvak({ placeholder: 'Wat valt je op? (algen, gedrag van de vissen, geur, troebel water…)' });
    const datumVeld = invoer({ type: 'datetime-local', value: nuVoorInvoer() });

    formulierHouder.replaceChildren(
      kaart('✍️ Waarden',
        h('p', { class: 'klein zacht' }, `Streefwaarden voor ${prof.label.toLowerCase()}. Laat leeg wat je niet gemeten hebt.`),
        ...velden,
        veld('Datum en uur', datumVeld),
        veld('Opmerking', opmerking),
        h('button', {
          class: 'knop knop--primair knop--vol knop--groot', style: { marginTop: '8px' },
          onclick: (e) => bewaar(e.currentTarget, opmerking.value, datumVeld.value),
        }, '✅ Meting opslaan')));
    tekenAdvies();
  }

  const stripWaarde = (id) => stripAnalyse?.resultaten.find((r) => r.param === id)?.waarde;

  function kleurVeld(inv, id, waarde) {
    const st = waarde === '' || waarde == null ? 'onbekend' : statusOf(id, Number(waarde), bak.profiel);
    inv.style.borderColor = st === 'kritiek' ? 'var(--kritiek)' : st === 'let-op' ? 'var(--letop)' : st === 'goed' ? 'var(--goed)' : 'var(--rand)';
    inv.style.borderWidth = st === 'goed' || st === 'onbekend' ? '1px' : '2px';
  }

  /* ------------------------------------------------------ live advies bij typen */
  function tekenAdvies() {
    const ingevuld = Object.entries(waarden).filter(([, v]) => v !== '' && v != null);
    if (!ingevuld.length) { adviesHouder.replaceChildren(); return; }
    const advies = maakAdvies({ waarden: Object.fromEntries(ingevuld) }, bak, historiek, catalogus);
    const blok = kaart(h('span', {}, '💡 Voorgestelde acties ', badge(advies.samenvatting, advies.score >= 80 ? 'goed' : advies.score >= 50 ? 'let-op' : 'kritiek')),
      h('p', { class: 'mini zacht' }, 'Dit werkt mee terwijl je invult, zodat je al kan starten vóór een eventueel huisbezoek.'));
    advies.acties.slice(0, 5).forEach((a) => blok.append(adviesKaart(a)));
    if (advies.huisbezoekAangeraden) {
      blok.append(h('button', { class: 'knop knop--hulp knop--vol', style: { marginTop: '10px' }, onclick: () => ganaar('hulp') },
        '🆘 Dit bekijken we beter samen — hulp vragen'));
    }
    adviesHouder.replaceChildren(blok);
  }

  /* -------------------------------------------------------------------- bewaren */
  async function bewaar(knopEl, opmerking, datumTekst) {
    const ingevuld = Object.fromEntries(
      Object.entries(waarden).filter(([, v]) => v !== '' && v != null).map(([k, v]) => [k, Number(v)]));
    if (!Object.keys(ingevuld).length) { melding('Vul minstens één waarde in.', 'fout'); return; }
    knopEl.disabled = true;
    try {
      const meting = await store.bewaarMeting({
        bakId: bak.id, klantId: bak.klantId,
        datum: datumTekst ? new Date(datumTekst).getTime() : Date.now(),
        waarden: ingevuld,
        bronnen,
        opmerking,
        strip: stripAnalyse ? {
          preset: stripAnalyse.resultaten.map((r) => r.param),
          resultaten: stripAnalyse.resultaten.map((r) => ({
            param: r.param, waarde: r.waarde, geschat: r.geschat, kleur: r.kleur,
            afstand: r.afstand, betrouwbaarheid: r.betrouwbaarheid.niveau,
          })),
        } : null,
      });

      if (stripFoto) {
        await store.bewaarFoto({ bakId: bak.id, blob: stripFoto, thumb: stripThumb, soort: 'strip', metingId: meting.id, notitie: 'Teststrip' });
      }

      const advies = maakAdvies(meting, bak, historiek, catalogus);
      const taken = opvolgTaken(advies, meting.datum);
      if (taken.length) await store.bewaarTaken(bak.id, taken.slice(0, 10));
      await store.logboek(bak.id, `Meting toegevoegd: ${advies.samenvatting}`, 'meting');

      melding('Meting opgeslagen.', 'ok');
      await toonResultaat(advies, meting);
    } catch (e) {
      console.error(e);
      melding(`Opslaan mislukt: ${e.message}`, 'fout');
    } finally {
      knopEl.disabled = false;
    }
  }

  async function toonResultaat(advies, meting) {
    const inhoud = h('div', {},
      h('p', {}, advies.samenvatting),
      ...advies.acties.map((a) => adviesKaart(a)),
      advies.huisbezoekAangeraden
        ? h('div', { class: 'hulpblok', style: { marginTop: '12px' } },
          h('h3', {}, 'Laat dit even nakijken'),
          h('p', {}, 'Op basis van deze waarden raden we aan om samen te kijken. Je dossier met foto\'s wordt automatisch meegestuurd.'))
        : null);
    const keuzeGemaakt = await dialoog({
      titel: 'Resultaat en advies', breed: true, inhoud,
      acties: [
        { label: 'Naar startscherm', waarde: 'start' },
        { label: '🆘 Hulp vragen', stijl: advies.huisbezoekAangeraden ? 'knop--hulp' : 'knop--stil', waarde: 'hulp' },
      ],
    });
    ganaar(keuzeGemaakt === 'hulp' ? 'hulp' : 'start');
    teken();
  }

  tekenFormulier();
  wrap.append(adviesHouder, formulierHouder);
  return wrap;
}

function nuVoorInvoer() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}
