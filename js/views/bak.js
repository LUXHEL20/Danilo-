/** Mijn bak: gegevens, vissenbestand, foto's en logboek. */
import { h, kaart, badge, veld, invoer, tekstvak, keuze, melding, dialoog, bevestig, datum, geleden, legeStaat } from '../ui.js';
import { ctx, ganaar, teken } from '../app.js';
import * as store from '../store.js';
import { PROFILES, profile } from '../params.js';
import { comprimeer, thumbnail } from '../strip.js';
import { kiesFoto } from '../native.js';

export async function toonBak(arg) {
  if (arg === 'nieuw') return bakFormulier(null);
  const bak = ctx.bak;
  if (!bak) {
    return legeStaat('🐠', 'Nog geen bak', 'Voeg uw aquarium of vijver toe.',
      h('button', { class: 'knop knop--primair', onclick: () => ganaar('bak/nieuw') }, 'Bak toevoegen'));
  }
  if (arg === 'bewerk') return bakFormulier(bak);

  const wrap = h('div', {});
  const vissen = await store.vissenVanBak(bak.id);
  const fotos = (await store.fotosVanBak(bak.id)).sort((a, b) => b.datum - a.datum);
  const log = await store.logboekVanBak(bak.id);
  const prof = profile(bak.profiel);

  /* --- gegevens --- */
  const rij = (l, w) => w ? h('li', {}, h('span', { class: 'zacht klein', style: { minWidth: '116px' } }, l), h('span', { class: 'groei' }, w)) : null;
  wrap.append(kaart(
    h('span', { class: 'rij rij--tussen groei' },
      h('span', {}, '🐠 ', bak.naam || 'Aquarium'),
      h('button', { class: 'chip', onclick: () => ganaar('bak/bewerk') }, 'Bewerken')),
    h('ul', { class: 'lijst' },
      rij('Type', prof.label),
      rij('Inhoud', bak.liters ? `${bak.liters} liter (netto)` : null),
      rij('Afmetingen', bak.afmetingen?.lengte ? `${bak.afmetingen.lengte} × ${bak.afmetingen.breedte} × ${bak.afmetingen.hoogte} cm` : null),
      rij('Opgestart', bak.opgestart ? `${datum(bak.opgestart, false)} (${geleden(bak.opgestart)})` : null),
      rij('Filter', bak.filter),
      rij('Verlichting', bak.verlichting),
      rij('CO₂', bak.co2),
      rij('Bodem', bak.bodem),
      rij('Verversing', bak.verversing),
      rij('Leidingwater', bak.leidingwater),
      rij('Opmerking', bak.opmerking))));

  if (bak.opgestart && (Date.now() - bak.opgestart) < 42 * 86400e3) {
    wrap.append(h('section', { class: 'kaart kaart--aandacht' },
      h('h3', {}, '🌱 Uw bak is nog aan het indraaien'),
      h('p', { class: 'klein' },
        'De eerste 4 tot 6 weken bouwt uw filter zijn bacteriën op. Meet in deze periode om de 2 à 3 dagen NO₂ en NH₄, ' +
        'voeder heel weinig, spoel uw filter niet uit en zet pas nieuwe vissen bij als beide waarden twee metingen na elkaar 0 zijn.')));
  }

  /* --- vaste opvolging: terugkerende routines --- */
  wrap.append(await routineBlok(bak, prof));

  /* --- vissenbestand --- */
  const vissenBlok = kaart(
    h('span', { class: 'rij rij--tussen groei' },
      h('span', {}, '🐟 Vissenbestand ', badge(String(vissen.reduce((s, v) => s + (v.aantal || 0), 0)) + ' dieren')),
      h('button', { class: 'chip', onclick: () => visFormulier(bak) }, '+ Toevoegen')));
  if (!vissen.length) {
    vissenBlok.append(h('p', { class: 'zacht klein' },
      'Nog niets ingevuld. Het vissenbestand helpt LUX AQUA om van op afstand in te schatten of uw bak overbezet is en welke waarden voor uw dieren het belangrijkst zijn.'));
  } else {
    vissenBlok.append(h('ul', { class: 'lijst' }, ...vissen.map((v) =>
      h('li', {},
        v.thumb ? h('img', { src: v.thumb, class: 'foto', style: { width: '46px', height: '46px' }, alt: v.soort }) : h('span', { style: { fontSize: '22px' } }, '🐟'),
        h('span', { class: 'groei' },
          h('strong', {}, `${v.aantal}× ${v.soort}`), h('br'),
          h('span', { class: 'mini zacht' },
            [v.sinds ? `sinds ${datum(v.sinds, false)}` : null, v.opmerking].filter(Boolean).join(' · '))),
        h('span', { class: 'lijst__actie' },
          h('button', { class: 'chip', onclick: () => visFormulier(bak, v) }, '✎'),
          h('button', {
            class: 'chip', onclick: async () => {
              if (await bevestig('Verwijderen?', `${v.aantal}× ${v.soort} uit het bestand halen?`, 'Verwijderen')) {
                await store.verwijderVis(v.id); teken();
              }
            },
          }, '🗑'))))));
    const bezetting = beoordeelBezetting(vissen, bak);
    if (bezetting) vissenBlok.append(h('p', { class: `klein ${bezetting.soort === 'kritiek' ? 'betrouwbaar-laag' : 'zacht'}`, style: { marginTop: '10px' } }, bezetting.tekst));
  }
  wrap.append(vissenBlok);

  /* --- foto's --- */
  const fotosKiezen = () => kiesFoto({ bron: 'vraag', meerdere: true }).then(async (bestanden) => {
    if (!bestanden.length) return;
    for (const f of bestanden) await voegFotoToe(bak, f);
    teken();
  });
  const fotoBlok = kaart(
    h('span', { class: 'rij rij--tussen groei' },
      h('span', {}, '📷 Foto\'s'),
      h('button', { class: 'chip', onclick: fotosKiezen }, '+ Foto')),
    h('p', { class: 'klein zacht' }, 'Foto\'s van de bak, van algen, van een zieke vis of van uw filter: zo kan LUX AQUA van op afstand al veel zien.'));
  if (fotos.length) {
    fotoBlok.append(h('div', { class: 'fotoraster' }, ...fotos.map((f) =>
      h('div', { class: 'fotokaart' },
        h('img', { src: f.thumb, alt: f.notitie || f.soort, loading: 'lazy', onclick: () => toonFoto(f) }),
        h('span', { class: 'fotokaart__soort' }, f.soort),
        h('button', {
          class: 'fotokaart__weg', 'aria-label': 'Foto verwijderen', onclick: async () => {
            if (await bevestig('Foto verwijderen?', 'Deze foto wordt definitief verwijderd.', 'Verwijderen')) { await store.verwijderFoto(f.id); teken(); }
          },
        }, '✕')))));
  }
  wrap.append(fotoBlok);

  /* --- logboek --- */
  const notitie = invoer({ placeholder: 'bv. 30% water ververst, filter gespoeld' });
  wrap.append(kaart('📓 Logboek',
    h('div', { class: 'rij' }, notitie,
      h('button', {
        class: 'knop knop--primair', onclick: async () => {
          if (!notitie.value.trim()) return;
          await store.logboek(bak.id, notitie.value.trim());
          melding('Genoteerd.', 'ok'); teken();
        },
      }, 'Bewaren')),
    log.length
      ? h('ul', { class: 'lijst' }, ...log.slice(0, 15).map((l) =>
        h('li', {}, h('span', { class: 'groei' }, l.tekst, h('br'), h('span', { class: 'mini zacht' }, datum(l.datum))))))
      : h('p', { class: 'zacht klein' }, 'Noteer hier wat u doet: waterverversingen, filterbeurten, nieuwe vissen, medicatie. Dat maakt later zoeken naar de oorzaak veel makkelijker.')));

  wrap.append(h('div', { class: 'knoprij' },
    h('button', { class: 'knop knop--stil', onclick: () => ganaar('bak/nieuw') }, '+ Nog een bak'),
    h('button', {
      class: 'knop knop--stil', onclick: async () => {
        if (await bevestig('Bak verwijderen?', 'Alle metingen, foto\'s en vissen van deze bak worden mee verwijderd.', 'Verwijderen')) {
          await store.verwijderBak(bak.id);
          await store.zetInstelling({ actieveBak: null });
          ganaar('start'); teken();
        }
      },
    }, '🗑 Bak verwijderen')));

  return wrap;
}

/* ------------------------------------------------------------------ formulier */
async function bakFormulier(bestaande) {
  const b = bestaande || { profiel: 'zoet_gezelschap', afmetingen: {} };
  const naam = invoer({ value: b.naam || '', placeholder: 'bv. Woonkamer 300 l' });
  const prof = keuze(Object.values(PROFILES).map((p) => ({ value: p.id, label: `${p.group}: ${p.label}`, selected: p.id === b.profiel })));
  const lengte = invoer({ type: 'number', inputmode: 'decimal', value: b.afmetingen?.lengte || '' });
  const breedte = invoer({ type: 'number', inputmode: 'decimal', value: b.afmetingen?.breedte || '' });
  const hoogte = invoer({ type: 'number', inputmode: 'decimal', value: b.afmetingen?.hoogte || '' });
  const liters = invoer({ type: 'number', inputmode: 'decimal', value: b.liters || '' });
  const opgestart = invoer({ type: 'date', value: b.opgestart ? new Date(b.opgestart).toISOString().slice(0, 10) : '' });
  const filter = invoer({ value: b.filter || '', placeholder: 'merk, type, debiet' });
  const verlichting = invoer({ value: b.verlichting || '', placeholder: 'type en aantal uren per dag' });
  const co2 = invoer({ value: b.co2 || '', placeholder: 'bv. 2 bellen per seconde' });
  const bodem = invoer({ value: b.bodem || '', placeholder: 'bv. grind 2-3 mm, voedingsbodem' });
  const verversing = invoer({ value: b.verversing || '', placeholder: 'bv. 30% per week' });
  const leidingwater = invoer({ value: b.leidingwater || '', placeholder: 'bv. hard, KH 12, nitraat 25' });
  const opmerking = tekstvak({ value: b.opmerking || '', placeholder: 'Wat wilt u bereiken? Wat loopt er mis?' });

  [lengte, breedte, hoogte].forEach((i) => i.addEventListener('input', () => {
    const l = store.berekenLiters({ lengte: lengte.value, breedte: breedte.value, hoogte: hoogte.value });
    if (l) liters.value = l;
  }));

  return kaart(bestaande ? 'Bak bewerken' : 'Nieuwe bak',
    veld('Naam', naam),
    veld('Type', prof),
    h('div', { class: 'raster3' }, veld('Lengte (cm)', lengte), veld('Breedte (cm)', breedte), veld('Hoogte (cm)', hoogte)),
    veld('Netto inhoud (liter)', liters, 'Automatisch berekend uit de afmetingen, min ongeveer 10% voor bodem en decoratie.'),
    veld('Opgestart op', opgestart),
    veld('Filter', filter),
    veld('Verlichting', verlichting),
    veld('CO₂', co2),
    veld('Bodem', bodem),
    veld('Waterverversing', verversing),
    veld('Leidingwater', leidingwater, 'Handig om te weten: veel problemen beginnen bij het water uit de kraan.'),
    veld('Opmerking', opmerking),
    h('div', { class: 'knoprij' },
      h('button', { class: 'knop knop--stil', onclick: () => { ganaar('bak'); } }, 'Annuleren'),
      h('button', {
        class: 'knop knop--primair', onclick: async () => {
          const i = await store.instellingen();
          const rec = await store.bewaarBak({
            ...b,
            klantId: b.klantId || i.actieveKlant,
            naam: naam.value.trim() || 'Aquarium',
            profiel: prof.value,
            liters: Number(liters.value) || 0,
            afmetingen: { lengte: Number(lengte.value) || 0, breedte: Number(breedte.value) || 0, hoogte: Number(hoogte.value) || 0 },
            opgestart: opgestart.value ? new Date(opgestart.value).getTime() : null,
            filter: filter.value.trim(), verlichting: verlichting.value.trim(), co2: co2.value.trim(),
            bodem: bodem.value.trim(), verversing: verversing.value.trim(), leidingwater: leidingwater.value.trim(),
            opmerking: opmerking.value.trim(),
          });
          await store.zetInstelling({ actieveBak: rec.id });
          melding('Bewaard.', 'ok');
          ganaar('bak'); teken();
        },
      }, 'Bewaren')));
}

/* --------------------------------------------------------------------- vissen */
async function visFormulier(bak, bestaande) {
  const v = bestaande || {};
  const soort = invoer({ value: v.soort || '', placeholder: 'bv. Neonzalm, Koi, Garnaal' });
  const aantal = invoer({ type: 'number', inputmode: 'numeric', min: 1, value: v.aantal || 1 });
  const sinds = invoer({ type: 'date', value: v.sinds ? new Date(v.sinds).toISOString().slice(0, 10) : '' });
  const opmerking = invoer({ value: v.opmerking || '', placeholder: 'bv. kweekgroep, of: eet slecht' });
  let thumb = v.thumb || null;
  const voorbeeld = h('div', {});
  const fotoKiezen = () => kiesFoto({ bron: 'vraag' }).then(async ([f]) => {
    if (!f) return;
    thumb = await thumbnail(f, 320);
    voorbeeld.replaceChildren(h('img', { src: thumb, class: 'foto', style: { width: '90px', height: '90px' }, alt: '' }));
  });
  if (thumb) voorbeeld.append(h('img', { src: thumb, class: 'foto', style: { width: '90px', height: '90px' }, alt: '' }));

  const bewaard = await dialoog({
    titel: bestaande ? 'Vis bewerken' : 'Vis toevoegen',
    inhoud: h('div', {},
      veld('Soort', soort),
      veld('Aantal', aantal),
      veld('In de bak sinds', sinds),
      veld('Opmerking', opmerking),
      veld('Foto', h('div', {},
        h('button', { class: 'knop knop--stil', onclick: fotoKiezen }, '📷 Foto kiezen'), voorbeeld))),
    acties: [
      { label: 'Annuleren', waarde: false },
      {
        label: 'Bewaren', stijl: 'knop--primair', actie: async () => {
          if (!soort.value.trim()) { melding('Vul de soort in.', 'fout'); return false; }
          await store.bewaarVis({ ...v, bakId: bak.id, soort: soort.value.trim(), aantal: Number(aantal.value) || 1,
            sinds: sinds.value ? new Date(sinds.value).getTime() : null, opmerking: opmerking.value.trim(), thumb });
          return true;
        },
      },
    ],
  });
  if (bewaard) { melding('Bewaard.', 'ok'); teken(); }
}

/** Ruwe inschatting van de bezetting. Bewust voorzichtig geformuleerd. */
function beoordeelBezetting(vissen, bak) {
  const liters = Number(bak.liters);
  if (!liters) return null;
  const totaal = vissen.reduce((s, v) => s + (v.aantal || 0), 0);
  if (!totaal) return null;
  const perVis = liters / totaal;
  if (bak.profiel?.startsWith('vijver')) return null;
  if (perVis < 3) return { soort: 'kritiek', tekst: `⚠️ ${totaal} dieren in ${liters} liter is veel. Bij een hoge bezetting stijgen nitraat en fosfaat snel: ververs vaker en laat uw bezetting nakijken.` };
  if (perVis < 6) return { soort: 'let-op', tekst: `Let op met bijzetten: ${totaal} dieren in ${liters} liter is al een stevige bezetting.` };
  return { soort: 'goed', tekst: `Bezetting oogt rustig (${totaal} dieren in ${liters} liter). Hou wel rekening met de volwassen grootte van elke soort.` };
}

/* --------------------------------------------------------------------- foto's */
export async function voegFotoToe(bak, bestand, soort = 'bak', notitie = '') {
  const blob = await comprimeer(bestand, 1400, 0.82);
  const thumb = await thumbnail(bestand, 420);
  await store.bewaarFoto({ bakId: bak.id, blob, thumb, soort, notitie });
}

async function toonFoto(f) {
  const bron = f.blob ? URL.createObjectURL(f.blob) : f.thumb;
  await dialoog({
    titel: f.notitie || f.soort, breed: true,
    inhoud: h('div', {},
      h('img', { src: bron, style: { width: '100%', borderRadius: '12px' }, alt: f.notitie || '' }),
      h('p', { class: 'mini zacht' }, datum(f.datum))),
    acties: [{ label: 'Sluiten', waarde: true }],
  });
  if (f.blob) URL.revokeObjectURL(bron);
}

/* -------------------------------------------------------------------- routines */

/** Voorstellen per soort bak, met een gebruikelijk interval in dagen. */
const ROUTINE_VOORSTELLEN = {
  Vijver: [
    { omschrijving: 'Water verversen', dagen: 30 },
    { omschrijving: 'Filter reinigen', dagen: 30 },
    { omschrijving: 'UV-lamp vervangen', dagen: 365 },
  ],
  default: [
    { omschrijving: 'Water verversen', dagen: 14 },
    { omschrijving: 'Filter spoelen', dagen: 30 },
    { omschrijving: 'Bodem afzuigen', dagen: 14 },
  ],
};

async function routineBlok(bak, prof) {
  const taken = (await store.takenVanBak(bak.id)).filter((t) => !t.klaar && t.bron === 'routine').sort((a, b) => a.vervalt - b.vervalt);
  const blok = kaart(
    h('span', { class: 'rij rij--tussen groei' },
      h('span', {}, '🔁 Vaste opvolging'),
      h('button', { class: 'chip', onclick: () => routineFormulier(bak, prof) }, '+ Routine')));

  if (!taken.length) {
    blok.append(h('p', { class: 'klein zacht' },
      'Nog geen vaste routines. Een routine als "water verversen om de veertien dagen" zorgt dat u het niet zelf moet onthouden.'));
    return blok;
  }

  blok.append(h('ul', { class: 'lijst' }, ...taken.map((t) => {
    const teLaat = t.vervalt < Date.now();
    return h('li', {},
      h('input', {
        type: 'checkbox', 'aria-label': 'Routine afvinken',
        style: { width: '22px', height: '22px', marginTop: '2px', flex: 'none' },
        onchange: async (e) => { if (e.target.checked) { await store.zetTaakKlaar(t.id, true); melding('Genoteerd. Volgende beurt ingepland.', 'ok'); teken(); } },
      }),
      h('span', { class: 'groei' },
        t.omschrijving, h('br'),
        h('span', { class: 'mini zacht' }, teLaat ? '⏰ te laat · ' : '', `${t.termijn} (${datum(t.vervalt, false)})`)),
      h('div', { class: 'kolom', style: { gap: '4px', flex: 'none' } },
        h('button', {
          class: 'chip', type: 'button', title: 'Ik heb dit eerder al gedaan',
          onclick: () => routineEerderGedaan(t),
        }, '📅 Al gedaan'),
        h('button', {
          class: 'chip', type: 'button', title: 'Routine stoppen',
          onclick: async () => {
            if (await bevestig('Routine stoppen?', `"${t.omschrijving}" wordt niet meer vanzelf opnieuw ingepland.`, 'Stoppen')) {
              await store.verwijderTaak(t.id); teken();
            }
          },
        }, '✕ Stoppen')));
  })));
  return blok;
}

/** "Ik heb dit eerder al gedaan": de volgende beurt telt vanaf die datum, niet vanaf vandaag. */
async function routineEerderGedaan(t) {
  const wanneer = invoer({ type: 'date', value: new Date().toISOString().slice(0, 10) });
  const bevestigd = await dialoog({
    titel: 'Ik heb dit eerder al gedaan',
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' }, `Wanneer deed u "${t.omschrijving}" voor het laatst?`),
      veld('Datum', wanneer)),
    acties: [
      { label: 'Annuleren', waarde: false },
      { label: 'Bewaren', stijl: 'knop--primair', waarde: true },
    ],
  });
  if (!bevestigd || !wanneer.value) return;
  await store.voltooiRoutineOp(t.id, new Date(wanneer.value).getTime());
  melding('Genoteerd. Volgende beurt ingepland.', 'ok');
  teken();
}

async function routineFormulier(bak, prof) {
  const voorstellen = ROUTINE_VOORSTELLEN[prof.group] || ROUTINE_VOORSTELLEN.default;
  const omschrijving = invoer({ value: '', placeholder: 'bv. Water verversen' });
  const dagen = invoer({ type: 'number', min: 1, max: 730, value: '14' });

  const chips = h('div', { class: 'rij', style: { flexWrap: 'wrap', gap: '6px', marginBottom: '8px' } },
    ...voorstellen.map((v) => h('button', {
      class: 'chip', type: 'button',
      onclick: () => { omschrijving.value = v.omschrijving; dagen.value = String(v.dagen); },
    }, v.omschrijving)));

  const bevestigd = await dialoog({
    titel: 'Routine toevoegen',
    inhoud: h('div', {},
      h('p', { class: 'klein zacht' }, 'Kies een voorstel, of vul uw eigen routine in.'),
      chips,
      veld('Wat moet er gebeuren?', omschrijving),
      veld('Om de hoeveel dagen?', dagen)),
    acties: [
      { label: 'Annuleren', waarde: false },
      { label: 'Bewaren', stijl: 'knop--primair', waarde: true },
    ],
  });
  if (!bevestigd) return;
  if (!omschrijving.value.trim()) { melding('Vul in wat er moet gebeuren.', 'fout'); return; }
  await store.bewaarRoutine({ bakId: bak.id, omschrijving: omschrijving.value.trim(), herhaalDagen: Number(dagen.value) || 14 });
  melding('Routine toegevoegd.', 'ok');
  teken();
}
