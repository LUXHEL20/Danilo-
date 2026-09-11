/**
 * Spaarkaart: tokens sparen in de winkel en omzetten in korting.
 *
 * Hoe het werkt, en waarom zo:
 *
 * De app heeft geen server. De kopie op de telefoon van de klant en de kopie op
 * de telefoon van LUX AQUA hebben nooit contact met elkaar. Een token kan dus
 * niet door de winkel "toegekend" worden: hij moet op het toestel van de klant
 * zelf ontstaan. Daarom werkt het met een winkelcode die elke dag verandert en
 * die beide kopieën zelf kunnen uitrekenen uit dezelfde formule.
 *
 * LUX AQUA ziet de code van vandaag in de beheerstab en toont hem aan de
 * toonbank. De klant tikt hem in. De app van de klant rekent dezelfde code uit
 * en aanvaardt hem enkel als hij klopt. Een foto van de code van gisteren is
 * daardoor waardeloos, en er is geen internet nodig.
 *
 * Bewust geen QR-code die met de gewone camera gescand wordt: op een iPhone
 * opent die de link in Safari, en dat is een ANDERE kopie van de app met een
 * andere opslag. De token zou dan in de verkeerde kopie belanden en de klant
 * zou hem nooit zien. Intikken werkt op elk toestel.
 */
import * as db from './db.js';
import * as store from './store.js';

/* Deze twee waarden bepalen de codes. Wijzigt u ze, dan wijzigen alle codes
   mee en moeten alle klanten de app vernieuwen. Doe dat enkel als een code
   uitgelekt is. */
const GEHEIM_SPAREN = 'LUXAQUA-KAZERNELAAN-11';
const GEHEIM_BEHEER = 'LUXAQUA-BEHEER-HELCHTEREN';

/* Zonder 0, O, 1, I en L: die worden aan de toonbank te vaak verkeerd gelezen. */
const SPAAR_TEKENS = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

const SPAAR_DAG = 86400e3;

/** FNV-1a, 32 bit. Klein, snel en voldoende: dit beveiligt geen geld, het
    voorkomt dat iemand de code van vandaag morgen hergebruikt. */
function spaarHash(tekst) {
  let h = 0x811c9dc5;
  for (let i = 0; i < tekst.length; i++) {
    h ^= tekst.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** De dagsleutel als JJJJMMDD in lokale tijd. */
export function dagSleutel(ts = Date.now()) {
  const d = new Date(ts);
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function codeUit(geheim, lengte, ts) {
  const sleutel = dagSleutel(ts);
  let uit = '';
  for (let i = 0; i < lengte; i++) {
    const h = spaarHash(`${geheim}|${sleutel}|${i}`);
    uit += SPAAR_TEKENS[h % SPAAR_TEKENS.length];
  }
  return uit;
}

/** De winkelcode van vandaag, zes tekens. LUX AQUA toont deze aan de toonbank. */
export const winkelcode = (ts = Date.now()) => codeUit(GEHEIM_SPAREN, 6, ts);

/** De beheerscode van vandaag, vier tekens. Hiermee zet LUX AQUA een kaart terug op nul. */
export const beheercode = (ts = Date.now()) => codeUit(GEHEIM_BEHEER, 4, ts);

/** Normaliseert wat de klant intikt: hoofdletters, geen spaties of streepjes. */
const opschoonCode = (tekst) => String(tekst || '').toUpperCase().replace(/[^A-Z0-9]/g, '');

/* ------------------------------------------------------------------ instellingen */

/**
 * De trap die de app standaard gebruikt. Eén token per bezoek, de eerste
 * korting na tien bezoeken en daarna telkens vijftien bezoeken per extra vijf
 * procent. Dat is aan de toonbank in één zin uit te leggen, en de bovenste
 * trede is bereikbaar in plaats van decoratief.
 */
export const TRAP_STANDAARD = [
  { tokens: 10, procent: 5 },
  { tokens: 25, procent: 10 },
  { tokens: 40, procent: 15 },
  { tokens: 55, procent: 20 },
  { tokens: 70, procent: 25 },
  { tokens: 85, procent: 30 },
];

/**
 * Het rustigere tempo: tien tokens per procent korting. Met één token per dag
 * ligt de eerste korting daarmee op vijftig aparte bezoeken. Blijft beschikbaar
 * met één tik in de beheerstab.
 */
export const TRAP_TRAAG = [
  { tokens: 50, procent: 5 },
  { tokens: 100, procent: 10 },
  { tokens: 150, procent: 15 },
  { tokens: 200, procent: 20 },
  { tokens: 250, procent: 25 },
  { tokens: 300, procent: 30 },
];

export const STANDAARD_SPAARINSTELLINGEN = {
  aan: true,
  trap: TRAP_STANDAARD,
  geldigDagen: 7,        // hoelang een omgezette korting bruikbaar blijft
  vervalMaanden: 12,     // ongebruikte tokens vervallen na zoveel maanden stilte
  maxKortingEuro: 50,    // 0 = geen plafond; beschermt de grote aankoop bij 30 procent
  waarop: 'Geldig op verzorging, voeding en toebehoren.',
};

export async function spaarInstellingen() {
  const i = await store.instellingen();
  const s = { ...STANDAARD_SPAARINSTELLINGEN, ...(i.spaarkaart || {}) };
  s.trap = (Array.isArray(s.trap) && s.trap.length ? s.trap : TRAP_STANDAARD)
    .map((t) => ({ tokens: Number(t.tokens) || 0, procent: Number(t.procent) || 0 }))
    .filter((t) => t.tokens > 0 && t.procent > 0)
    .sort((a, b) => a.tokens - b.tokens);
  return s;
}

export const bewaarSpaarInstellingen = (patch) =>
  spaarInstellingen().then((huidig) => store.zetInstelling({ spaarkaart: { ...huidig, ...patch } }));

/* ------------------------------------------------------------------------ kaart */

const LEGE_KAART = { id: 'kaart', tokens: 0, laatsteScan: null, korting: null, geschiedenis: [] };

/** Haalt de kaart op en laat vervallen tokens vervallen. */
export async function haalKaart() {
  const opgeslagen = (await db.get('spaarkaart', 'kaart')) || { ...LEGE_KAART };
  const k = { ...LEGE_KAART, ...opgeslagen };
  const s = await spaarInstellingen();
  let gewijzigd = false;

  const vervalGrens = s.vervalMaanden * 30.44 * SPAAR_DAG;
  if (k.tokens > 0 && k.laatsteScan && Date.now() - k.laatsteScan > vervalGrens) {
    noteerSpaar(k, 'verval', `${k.tokens} tokens vervallen na ${s.vervalMaanden} maanden zonder bezoek.`);
    k.tokens = 0;
    gewijzigd = true;
  }
  if (k.korting && Date.now() > k.korting.vervalt) {
    noteerSpaar(k, 'verval', `Korting van ${k.korting.procent} procent is vervallen.`);
    k.korting = null;
    gewijzigd = true;
  }
  if (gewijzigd) await db.put('spaarkaart', k);
  return k;
}

function noteerSpaar(k, soort, tekst) {
  k.geschiedenis = [{ ts: Date.now(), soort, tekst }, ...(k.geschiedenis || [])].slice(0, 60);
}

/** Is er vandaag al een token bijgeschreven? Eén per kalenderdag. */
export const alGescandVandaag = (k) => !!k.laatsteScan && dagSleutel(k.laatsteScan) === dagSleutel();

/**
 * Schrijft een token bij als de ingetikte code klopt.
 * Geeft { ok, reden, kaart } terug. De reden is de tekst voor de klant.
 */
export async function voegTokenToe(ingetikt) {
  const s = await spaarInstellingen();
  if (!s.aan) return { ok: false, reden: 'De spaarkaart staat uit.' };

  const code = opschoonCode(ingetikt);
  if (!code) return { ok: false, reden: 'Vul de winkelcode in die u aan de toonbank ziet.' };

  /* Gisteren blijft één dag geldig: wie om middernacht in de winkel staat of in
     een andere tijdzone zit, mag daar niet op vastlopen. */
  const geldig = code === winkelcode() || code === winkelcode(Date.now() - SPAAR_DAG);
  if (!geldig) return { ok: false, reden: 'Die code klopt niet. Vraag de code van vandaag aan de toonbank.' };

  const k = await haalKaart();
  if (alGescandVandaag(k)) {
    return { ok: false, reden: 'U hebt vandaag al een token gekregen. Morgen kan u er weer een sparen.', kaart: k };
  }

  k.tokens += 1;
  k.laatsteScan = Date.now();
  noteerSpaar(k, 'token', 'Token gespaard in de winkel.');
  await db.put('spaarkaart', k);
  return { ok: true, reden: `Token bijgeschreven. U staat nu op ${k.tokens}.`, kaart: k };
}

/* ------------------------------------------------------------------- trap lezen */

/** De hoogste trede die met dit aantal tokens haalbaar is, of null. */
export const spaarBereikt = (tokens, trap) =>
  [...trap].reverse().find((t) => tokens >= t.tokens) || null;

/** De eerstvolgende trede boven dit aantal tokens, of null als alles bereikt is. */
export const spaarVolgende = (tokens, trap) => trap.find((t) => tokens < t.tokens) || null;

/** Alle tredes die de klant nu kan kiezen, van hoog naar laag. */
export const spaarKeuzes = (tokens, trap) => [...trap].filter((t) => tokens >= t.tokens).reverse();

/* -------------------------------------------------------------------- omzetten */

/** Kortingsbon van zes tekens, zodat de kassa ziet dat het om deze kaart gaat. */
function bonnummer(procent, ts) {
  const h = spaarHash(`${GEHEIM_SPAREN}|bon|${ts}|${procent}`);
  let uit = '';
  for (let i = 0; i < 4; i++) uit += SPAAR_TEKENS[(h >>> (i * 5)) % SPAAR_TEKENS.length];
  return `${procent}-${uit}`;
}

/**
 * Zet tokens om in korting. De tokens worden verbruikt, niet gewist: wie op 60
 * staat en 5 procent neemt, houdt er 10 over. Doorsparen mag nooit afgestraft
 * worden.
 */
export async function verzilver(procent) {
  const s = await spaarInstellingen();
  const trap = s.trap;
  const trede = trap.find((t) => t.procent === Number(procent));
  if (!trede) return { ok: false, reden: 'Die korting bestaat niet.' };

  const k = await haalKaart();
  if (k.korting) return { ok: false, reden: 'U hebt al een lopende korting. Gebruik die eerst.', kaart: k };
  if (k.tokens < trede.tokens) return { ok: false, reden: `Daarvoor hebt u ${trede.tokens} tokens nodig.`, kaart: k };

  const nu = Date.now();
  k.tokens -= trede.tokens;
  k.korting = {
    procent: trede.procent,
    tokensGebruikt: trede.tokens,
    verkregen: nu,
    vervalt: nu + s.geldigDagen * SPAAR_DAG,
    bon: bonnummer(trede.procent, nu),
    maxEuro: s.maxKortingEuro || 0,
  };
  noteerSpaar(k, 'korting', `${trede.tokens} tokens omgezet in ${trede.procent} procent korting.`);
  await db.put('spaarkaart', k);
  return { ok: true, reden: `U hebt ${trede.procent} procent korting. Toon dit scherm aan de kassa.`, kaart: k };
}

/** De klant heeft de korting gebruikt, of wil ze niet meer. */
export async function sluitKorting(gebruikt = true) {
  const k = await haalKaart();
  if (!k.korting) return k;
  noteerSpaar(k, 'korting', gebruikt
    ? `Korting van ${k.korting.procent} procent gebruikt aan de kassa.`
    : `Korting van ${k.korting.procent} procent geannuleerd.`);
  if (!gebruikt) k.tokens += k.korting.tokensGebruikt; // annuleren geeft de tokens terug
  k.korting = null;
  await db.put('spaarkaart', k);
  return k;
}

/* --------------------------------------------------------------------- beheer */

/**
 * Zet de kaart terug op nul. Enkel met de beheerscode van vandaag, die LUX AQUA
 * in de beheerstab ziet. Zo kan de klant zijn eigen kaart niet resetten door
 * een oude code te onthouden.
 */
export async function resetKaart(ingetikt) {
  const code = opschoonCode(ingetikt);
  if (code !== beheercode() && code !== beheercode(Date.now() - SPAAR_DAG)) {
    return { ok: false, reden: 'Die beheerscode klopt niet.' };
  }
  const k = await haalKaart();
  const oud = k.tokens;
  k.tokens = 0;
  k.korting = null;
  k.laatsteScan = null;
  noteerSpaar(k, 'reset', `Kaart op nul gezet door LUX AQUA (stond op ${oud}).`);
  await db.put('spaarkaart', k);
  return { ok: true, reden: 'De kaart staat terug op nul.', kaart: k };
}

/** Tokens handmatig bijschrijven, met de beheerscode. Voor een vergeten bezoek. */
export async function bijschrijven(aantal, ingetikt) {
  const code = opschoonCode(ingetikt);
  if (code !== beheercode() && code !== beheercode(Date.now() - SPAAR_DAG)) {
    return { ok: false, reden: 'Die beheerscode klopt niet.' };
  }
  const n = Math.max(1, Math.min(50, Math.round(Number(aantal) || 0)));
  const k = await haalKaart();
  k.tokens += n;
  k.laatsteScan = Date.now();
  noteerSpaar(k, 'token', `${n} ${n === 1 ? 'token' : 'tokens'} bijgeschreven door LUX AQUA.`);
  await db.put('spaarkaart', k);
  return { ok: true, reden: `${n} bijgeschreven. De kaart staat op ${k.tokens}.`, kaart: k };
}
