/**
 * Domeinlaag boven de database: klanten, bakken, vissen, metingen, foto's,
 * hulpvragen en opvolgtaken. Alle schermen praten via deze module met de data.
 */
import * as db from './db.js';
import { PRODUCTEN } from './products.js';

const luisteraars = new Set();
export const onWijziging = (fn) => { luisteraars.add(fn); return () => luisteraars.delete(fn); };
const meld = (soort) => luisteraars.forEach((fn) => fn(soort));

/* ---------------------------------------------------------------- instellingen */
const STANDAARD_INSTELLINGEN = {
  id: 'app',
  rol: 'klant',              // 'klant' of 'luxaqua'
  actieveKlant: null,
  actieveBak: null,
  productenOverride: null,   // aangepaste catalogus door LUX AQUA
  kalibratie: {},            // per strip-preset: eigen kleurenkaart
  logo: null,                // eigen logo als data-URL (Beheer > Logo)
  bedrijf: {
    naam: 'LUX AQUA',
    telefoon: '011 91 92 91',
    email: 'info@luxhelchteren.be',
    whatsapp: '3211919291',  // WhatsApp Business, 0032 11 91 92 91 zonder plus en zonder nul
    website: 'https://luxhelchteren.be',
    werkgebied: 'Helchteren en omgeving',
    adres: 'Kazernelaan 11, 3530 Helchteren',
    onderdeelVan: 'LUX 2.0',
  },
  koppeling: { url: '', sleutel: '' }, // optionele server-koppeling voor LUX AQUA
  spaarkaart: null,          // instellingen van de spaarkaart, zie js/spaarkaart.js
  kweker: false,             // toont het kweekdossier in de navigatie
  onboardingKlaar: false,
};

let cache = null;

export async function instellingen() {
  if (cache) return cache;
  const opgeslagen = await db.get('instellingen', 'app');
  cache = { ...STANDAARD_INSTELLINGEN, ...(opgeslagen || {}) };
  return cache;
}

export async function zetInstelling(patch) {
  const huidig = await instellingen();
  cache = { ...huidig, ...patch, id: 'app' };
  await db.put('instellingen', cache);
  meld('instellingen');
  return cache;
}

export async function catalogus() {
  const i = await instellingen();
  return i.productenOverride?.length ? i.productenOverride : PRODUCTEN;
}

/* ---------------------------------------------------------------------- klanten */
export const klanten = () => db.alles('klanten');
export const klant = (id) => db.get('klanten', id);

export async function bewaarKlant(data) {
  const rec = { id: data.id || db.nieuwId('klant'), aangemaakt: data.aangemaakt || Date.now(), ...data };
  rec.gewijzigd = Date.now();
  await db.put('klanten', rec);
  meld('klanten');
  return rec;
}

export async function verwijderKlant(id) {
  for (const bak of await bakkenVanKlant(id)) await verwijderBak(bak.id);
  for (const h of await db.waar('hulpvragen', 'klantId', id)) await db.del('hulpvragen', h.id);
  await db.del('klanten', id);
  meld('klanten');
}

/* ----------------------------------------------------------------------- bakken */
export const bakken = () => db.alles('bakken');
export const bak = (id) => db.get('bakken', id);
export const bakkenVanKlant = (klantId) => db.waar('bakken', 'klantId', klantId);

export async function bewaarBak(data) {
  const rec = { id: data.id || db.nieuwId('bak'), aangemaakt: data.aangemaakt || Date.now(), ...data };
  rec.gewijzigd = Date.now();
  rec.liters = Number(rec.liters) || berekenLiters(rec.afmetingen);
  await db.put('bakken', rec);
  meld('bakken');
  return rec;
}

export async function verwijderBak(id) {
  for (const store of ['vissen', 'metingen', 'fotos', 'taken']) {
    for (const r of await db.waar(store, 'bakId', id)) await db.del(store, r.id);
  }
  await db.del('bakken', id);
  meld('bakken');
}

/** Netto-inhoud: bruto volume min ongeveer 10% voor bodem, decoratie en de rand die niet gevuld is. */
export function berekenLiters(afm) {
  if (!afm?.lengte || !afm?.breedte || !afm?.hoogte) return 0;
  const bruto = (Number(afm.lengte) * Number(afm.breedte) * Number(afm.hoogte)) / 1000;
  return Math.round(bruto * 0.9);
}

/* ----------------------------------------------------------------------- vissen */
export const vissenVanBak = (bakId) => db.waar('vissen', 'bakId', bakId);

export async function bewaarVis(data) {
  const rec = { id: data.id || db.nieuwId('vis'), aangemaakt: data.aangemaakt || Date.now(), ...data };
  rec.aantal = Number(rec.aantal) || 1;
  await db.put('vissen', rec);
  meld('vissen');
  return rec;
}
export async function verwijderVis(id) { await db.del('vissen', id); meld('vissen'); }

/* --------------------------------------------------------------------- metingen */
export async function metingenVanBak(bakId) {
  const lijst = await db.waar('metingen', 'bakId', bakId);
  return lijst.sort((a, b) => b.datum - a.datum);
}
export const alleMetingen = () => db.alles('metingen');

export async function bewaarMeting(data) {
  const rec = { id: data.id || db.nieuwId('meting'), datum: data.datum || Date.now(), ...data };
  await db.put('metingen', rec);
  meld('metingen');
  return rec;
}
export async function verwijderMeting(id) { await db.del('metingen', id); meld('metingen'); }

export async function laatsteMeting(bakId) {
  const lijst = await metingenVanBak(bakId);
  return lijst[0] || null;
}

/* ----------------------------------------------------------------------- foto's */
export const fotosVanBak = (bakId) => db.waar('fotos', 'bakId', bakId);

export async function bewaarFoto({ bakId, blob, thumb, soort = 'bak', notitie = '', metingId = null }) {
  const rec = { id: db.nieuwId('foto'), bakId, blob, thumb, soort, notitie, metingId, datum: Date.now() };
  await db.put('fotos', rec);
  meld('fotos');
  return rec;
}
export const foto = (id) => db.get('fotos', id);
export async function verwijderFoto(id) { await db.del('fotos', id); meld('fotos'); }

/* ------------------------------------------------------------------- hulpvragen */
export const hulpvragen = () => db.alles('hulpvragen');
export const hulpvragenVanKlant = (klantId) => db.waar('hulpvragen', 'klantId', klantId);

export async function bewaarHulpvraag(data) {
  const rec = {
    id: data.id || db.nieuwId('hulp'),
    aangemaakt: data.aangemaakt || Date.now(),
    status: data.status || 'nieuw',   // nieuw | opgenomen | gepland | afgerond
    ...data,
  };
  await db.put('hulpvragen', rec);
  meld('hulpvragen');
  return rec;
}
export async function verwijderHulpvraag(id) { await db.del('hulpvragen', id); meld('hulpvragen'); }

/* ------------------------------------------------------------------------ taken */
export const takenVanBak = (bakId) => db.waar('taken', 'bakId', bakId);
export const alleTaken = () => db.alles('taken');

export async function bewaarTaken(bakId, taken) {
  await db.putVeel('taken', taken.map((t) => ({ ...t, bakId })));
  meld('taken');
}

/**
 * Vervangt de nog openstaande taken die uit een MÉTING kwamen (bron: 'meting')
 * door een nieuwe reeks. Zonder dit stapelen taken zich op: elke meting voegt
 * anders opnieuw "opnieuw meten binnen 24 uur" toe, ook als een latere meting
 * dat punt allang heeft ingehaald. Taken uit een andere bron (bijvoorbeeld een
 * product dat net gedoseerd is) blijven onaangeroerd: die lopen op hun eigen
 * termijn, los van de volgende meting.
 */
export async function vervangMetingTaken(bakId, taken) {
  const oud = (await takenVanBak(bakId)).filter((t) => !t.klaar && t.bron === 'meting');
  for (const t of oud) await db.del('taken', t.id);
  await bewaarTaken(bakId, taken);
}
export async function zetTaakKlaar(id, klaar = true) {
  const t = await db.get('taken', id);
  if (!t) return;
  await db.put('taken', { ...t, klaar, afgerond: klaar ? Date.now() : null });
  if (klaar && t.bron === 'routine' && t.herhaalDagen) await plantVolgendeRoutine(t, Date.now());
  await ruimOudeTakenOp(t.bakId);
  meld('taken');
}
export async function verwijderTaak(id) { await db.del('taken', id); meld('taken'); }

/* ------------------------------------------------------------------- routines */
/**
 * Een nieuwe vaste routine (bijvoorbeeld "Water verversen" om de veertien
 * dagen). Slaat meteen de eerste taak op; het afvinken van die taak plant
 * daarna telkens de volgende (zie zetTaakKlaar en voltooiRoutineOp).
 */
export async function bewaarRoutine({ bakId, omschrijving, herhaalDagen, vanaf = Date.now(), product = null }) {
  const dagen = Math.max(1, Number(herhaalDagen) || 14);
  const taak = {
    id: db.nieuwId('taak'), omschrijving, herhaalDagen: dagen, product,
    termijn: `Elke ${dagen} dagen`, vervalt: vanaf + dagen * 86400e3,
    klaar: false, bron: 'routine',
  };
  await bewaarTaken(bakId, [taak]);
  return taak;
}

async function plantVolgendeRoutine(t, vanaf) {
  await bewaarTaken(t.bakId, [{
    id: db.nieuwId('taak'), omschrijving: t.omschrijving, herhaalDagen: t.herhaalDagen, product: t.product || null,
    termijn: `Elke ${t.herhaalDagen} dagen`, vervalt: vanaf + t.herhaalDagen * 86400e3, klaar: false, bron: 'routine',
  }]);
}

/**
 * "Ik heb dit eerder al gedaan": de klant hoeft niet te liegen tegen zijn app
 * door op een verkeerde dag af te vinken. De volgende beurt telt vanaf de
 * opgegeven datum, niet vanaf vandaag.
 */
export async function voltooiRoutineOp(id, datumTs) {
  const t = await db.get('taken', id);
  if (!t) return;
  await db.put('taken', { ...t, klaar: true, afgerond: datumTs });
  if (t.herhaalDagen) await plantVolgendeRoutine(t, datumTs);
  meld('taken');
}

/**
 * Ruimt afgewerkte eenmalige taken (uit een meting of een productdosering) op
 * na zeven dagen: zonder dit blijft een lange lijst afgevinkte punten staan.
 * Routines blijven met opzet buiten schot: hun geschiedenis is net de reden
 * waarom de klant ze bijhoudt.
 */
async function ruimOudeTakenOp(bakId) {
  if (!bakId) return;
  const grens = Date.now() - 7 * 86400e3;
  const oud = (await takenVanBak(bakId)).filter((t) => t.klaar && t.bron !== 'routine' && (t.afgerond || 0) < grens);
  for (const t of oud) await db.del('taken', t.id);
}

/* --------------------------------------------------------------------- logboek */
export async function logboek(bakId, tekst, soort = 'notitie') {
  const rec = { id: db.nieuwId('log'), bakId, tekst, soort, datum: Date.now() };
  await db.put('logboek', rec);
  meld('logboek');
  return rec;
}
export const logboekVanBak = async (bakId) =>
  (await db.alles('logboek')).filter((l) => l.bakId === bakId).sort((a, b) => b.datum - a.datum);

/* ------------------------------------------------------------------ hulpfuncties */
export { db };
