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
  productenOverride: null,   // aangepaste catalogus door Lux Aqua
  kalibratie: {},            // per strip-preset: eigen kleurenkaart
  bedrijf: {
    naam: 'Lux Aqua',
    telefoon: '',
    email: '',
    website: '',
    werkgebied: '',
  },
  koppeling: { url: '', sleutel: '' }, // optionele server-koppeling voor Lux Aqua
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
export async function zetTaakKlaar(id, klaar = true) {
  const t = await db.get('taken', id);
  if (!t) return;
  await db.put('taken', { ...t, klaar, afgerond: klaar ? Date.now() : null });
  meld('taken');
}
export async function verwijderTaak(id) { await db.del('taken', id); meld('taken'); }

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
