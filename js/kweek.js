/**
 * Kweekdossier: koppels, legsels en het eigen aanbod van de kweker.
 *
 * Waarom dit in de app hoort: een hobbykweker houdt vandaag een schriftje bij
 * met datums, aantallen en welk koppel wat gaf. Dat schriftje raakt kwijt, en
 * de cijfers erin zijn nooit te vergelijken. Hier staat het naast de
 * waterwaarden van dezelfde bak, en dat is precies wat een legsel maakt of
 * kraakt.
 *
 * Alles blijft op het toestel van de kweker. Enkel wat hij zelf doorstuurt,
 * bereikt LUX AQUA.
 */
import * as db from './db.js';
import * as store from './store.js';
import { kweeksoort, verwachteData } from './kweeksoorten.js';

const KWEEK_DAG = 86400e3;

/* -------------------------------------------------------------------- koppels */

export const koppels = () => db.alles('kweekkoppels');
export const koppel = (id) => db.get('kweekkoppels', id);
export const koppelsVanBak = (bakId) => db.waar('kweekkoppels', 'bakId', bakId);

export async function bewaarKoppel(data) {
  /* data laatst spreiden zou de nieuwe id weer op undefined zetten wanneer
     data.id niet bestaat, en dan weigert IndexedDB het hele record. */
  const rec = { aangemaakt: Date.now(), ...data, id: data.id || db.nieuwId('koppel') };
  await db.put('kweekkoppels', rec);
  return rec;
}

export async function verwijderKoppel(id) {
  for (const l of await legselsVanKoppel(id)) await db.del('legsels', l.id);
  for (const a of await aanbodVanKoppel(id)) await db.del('aanbod', a.id);
  await db.del('kweekkoppels', id);
}

/** De naam die op het scherm hoort, ook als de kweker er zelf geen gaf. */
export function koppelNaam(k) {
  if (k.naam) return k.naam;
  const s = kweeksoort(k.soortId);
  return k.eigenSoort || s?.naam || 'Naamloos koppel';
}

/* -------------------------------------------------------------------- legsels */

export const legsels = () => db.alles('legsels');
export const legsel = (id) => db.get('legsels', id);
export const legselsVanKoppel = async (koppelId) =>
  (await db.waar('legsels', 'koppelId', koppelId)).sort((a, b) => b.datum - a.datum);

/**
 * De stappen die een legsel doorloopt. Bij levendbarenden en garnalen slaat de
 * app het eierstadium over: daar is de dracht de hele voorgeschiedenis.
 */
export const STADIA = [
  { id: 'verwacht', label: 'Verwacht', icoon: '🕓' },
  { id: 'eieren', label: 'Eieren', icoon: '🥚' },
  { id: 'larven', label: 'Uitgekomen', icoon: '🐛' },
  { id: 'vrijzwemmend', label: 'Vrij zwemmend', icoon: '🐟' },
  { id: 'opgroei', label: 'Opgroei', icoon: '🌱' },
  { id: 'afgerond', label: 'Afgerond', icoon: '✅' },
  { id: 'mislukt', label: 'Mislukt', icoon: '✖️' },
];

export const stadium = (id) => STADIA.find((s) => s.id === id) || STADIA[0];

export async function bewaarLegsel(data) {
  const rec = { aangemaakt: Date.now(), status: 'eieren', ...data, id: data.id || db.nieuwId('legsel') };
  await db.put('legsels', rec);
  return rec;
}

export const verwijderLegsel = (id) => db.del('legsels', id);

/**
 * Wat er van dit legsel verwacht wordt, op basis van de soort en de startdatum.
 * Geeft ook terug hoeveel dagen dat nog is, zodat het scherm er niet zelf mee
 * hoeft te rekenen.
 */
export function verwachting(legselRec, koppelRec) {
  const s = kweeksoort(koppelRec?.soortId);
  if (!s || !legselRec?.datum) return null;
  const d = verwachteData(koppelRec.soortId, legselRec.datum);
  if (!d) return null;
  const dagenTot = (ts) => Math.round((ts - Date.now()) / KWEEK_DAG);
  const uit = {};
  for (const [sleutel, ts] of Object.entries(d)) uit[sleutel] = { ts, dagen: dagenTot(ts) };
  return uit;
}

/** Overleving van eieren of dracht tot opgegroeide jongen, in procent. */
export function overleving(l) {
  const start = l.aantalEieren || l.aantalLarven;
  if (!start || !l.aantalOpgegroeid) return null;
  return Math.round((l.aantalOpgegroeid / start) * 100);
}

/**
 * Cijfers over alle afgeronde legsels van een koppel: hoeveel legsels, hoeveel
 * jongen, de gemiddelde overleving en het gemiddelde aantal dagen tussen twee
 * legsels. Dat laatste is wat een kweker wil weten om te plannen.
 */
export function koppelCijfers(lijst) {
  const afgerond = lijst.filter((l) => l.status === 'afgerond' || l.aantalOpgegroeid);
  const jongen = afgerond.reduce((n, l) => n + (Number(l.aantalOpgegroeid) || 0), 0);
  const percentages = afgerond.map(overleving).filter((p) => p != null);
  const datums = [...lijst].map((l) => l.datum).filter(Boolean).sort((a, b) => a - b);
  let tussentijd = null;
  if (datums.length >= 2) {
    const gaten = datums.slice(1).map((d, i) => (d - datums[i]) / KWEEK_DAG);
    tussentijd = Math.round(gaten.reduce((a, b) => a + b, 0) / gaten.length);
  }
  return {
    legsels: lijst.length,
    afgerond: afgerond.length,
    jongen,
    overleving: percentages.length ? Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length) : null,
    tussentijd,
  };
}

/**
 * Legsels die aandacht vragen: een verwachte datum die vandaag of eerder valt
 * en waar het stadium nog niet op bijgewerkt is. Dit voedt de melding op het
 * startscherm.
 */
export async function watVraagtAandacht() {
  const alle = await legsels();
  const uit = [];
  for (const l of alle) {
    if (['afgerond', 'mislukt'].includes(l.status)) continue;
    const k = await koppel(l.koppelId);
    if (!k) continue;
    const v = verwachting(l, k);
    if (!v) continue;
    if (v.uitkomen && l.status === 'eieren' && v.uitkomen.dagen <= 0) {
      uit.push({ legsel: l, koppel: k, tekst: 'De eieren zouden nu uitgekomen moeten zijn.' });
    } else if (v.vrijzwemmen && l.status === 'larven' && v.vrijzwemmen.dagen <= 0) {
      uit.push({ legsel: l, koppel: k, tekst: 'De jongen zouden nu vrij moeten zwemmen. Tijd voor het eerste voer.' });
    } else if (v.werpen && l.status !== 'opgroei' && v.werpen.dagen <= 0) {
      uit.push({ legsel: l, koppel: k, tekst: 'Het vrouwtje zou nu moeten werpen.' });
    }
  }
  return uit;
}

/* --------------------------------------------------------------------- aanbod */

export const alleAanbod = () => db.alles('aanbod');
export const aanbodVanKoppel = (koppelId) => db.waar('aanbod', 'koppelId', koppelId);

export async function bewaarAanbod(data) {
  const rec = { aangemaakt: Date.now(), verstuurd: null, ...data, id: data.id || db.nieuwId('aanbod') };
  await db.put('aanbod', rec);
  return rec;
}

export const verwijderAanbod = (id) => db.del('aanbod', id);

export async function markeerVerstuurd(id) {
  const a = await db.get('aanbod', id);
  if (!a) return null;
  a.verstuurd = Date.now();
  await db.put('aanbod', a);
  return a;
}

/**
 * Het bericht dat naar LUX AQUA gaat wanneer een kweker jongvis aanbiedt.
 * Bewust in gewone zinnen: dit komt in WhatsApp of in een e-mail terecht en
 * moet daar leesbaar zijn zonder opmaak.
 */
export async function aanbodAlsTekst(a, klant) {
  const s = kweeksoort(a.soortId);
  const soortnaam = a.eigenSoort || s?.naam || 'Onbekende soort';
  const regels = [
    'Aanbod eigen kweek, via de app van LUX AQUA',
    '',
    `Soort: ${soortnaam}${s?.latijn ? ` (${s.latijn})` : ''}`,
    `Aantal: ${a.aantal || 'nog te tellen'}`,
  ];
  if (a.grootte) regels.push(`Grootte: ${a.grootte}`);
  if (a.leeftijd) regels.push(`Leeftijd: ${a.leeftijd}`);
  if (a.prijs) regels.push(`Gevraagde prijs: ${a.prijs}`);
  if (a.notitie) regels.push('', a.notitie);
  regels.push('', `Aantal foto's: ${(a.fotos || []).length}`);
  if (klant?.naam) {
    regels.push('', `Van: ${klant.naam}`);
    if (klant.telefoon) regels.push(`Telefoon: ${klant.telefoon}`);
    if (klant.email) regels.push(`E-mail: ${klant.email}`);
    if (klant.gemeente) regels.push(`Gemeente: ${klant.gemeente}`);
  }
  return regels.join('\n');
}

/** De foto's van een aanbod als bestanden om mee te sturen. */
export async function aanbodFotos(a) {
  const uit = [];
  for (const [i, id] of (a.fotos || []).entries()) {
    const f = await store.foto(id);
    if (f?.blob) uit.push({ naam: `kweek-${i + 1}.jpg`, blob: f.blob });
  }
  return uit;
}
