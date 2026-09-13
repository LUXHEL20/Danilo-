/**
 * Aanmelden voor de beheerderskant van LUX AQUA.
 *
 * Wat dit wel doet: het houdt de beheerderskant uit het zicht van klanten. Zonder
 * aanmelding is er geen knop naar de klantenlijst, en zijn de winkelcode en de
 * beheerscode van de spaarkaart niet te zien.
 *
 * Wat dit niet doet: het is geen kluis. De app heeft geen server, dus de
 * controle gebeurt op het toestel zelf en het versleutelde wachtwoord staat mee
 * in de code van de app. Wie de app uitpluist, kan proberen het wachtwoord te
 * kraken. Daarom: gebruik dit wachtwoord nergens anders, en zet er nooit iets
 * achter dat echt geheim moet blijven.
 *
 * Het wachtwoord zelf staat nergens: enkel PBKDF2-SHA256 met 250.000 rondes en
 * een eigen zout. Dat maakt raden traag, meer niet.
 */
import * as store from './store.js';

/* Het ingebouwde beheerdersaccount. Wilt u het wachtwoord wijzigen, draai dan
   scripts/maak-wachtwoord.mjs en vervang deze drie waarden. */
const INGEBOUWD = {
  email: 'luxhelchteren@gmail.com',
  zout: '5bea2d2e98006e7642cdeddfe72fee3b',
  iteraties: 250000,
  hash: 'b2fc69dbb5764bb97784a68dac141f8fcb900ddde35f96a921838458c105c85a',
};

/** Hoelang een aanmelding blijft gelden voor ze opnieuw gevraagd wordt. */
const GELDIG_UREN = 12;

const hex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, '0')).join('');
const bytes = (hexTekst) => new Uint8Array(hexTekst.match(/../g).map((p) => parseInt(p, 16)));

/** Is de browser in staat om veilig te hashen? Vereist https of localhost. */
export const kanAanmelden = () => !!(globalThis.crypto?.subtle);

async function afleiden(wachtwoord, zoutHex, iteraties) {
  const sleutel = await crypto.subtle.importKey(
    'raw', new TextEncoder().encode(wachtwoord), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: bytes(zoutHex), iterations: iteraties, hash: 'SHA-256' }, sleutel, 256);
  return hex(bits);
}

/** Vergelijking die niet sneller stopt bij het eerste verschil. */
function gelijk(a, b) {
  if (a.length !== b.length) return false;
  let verschil = 0;
  for (let i = 0; i < a.length; i++) verschil |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return verschil === 0;
}

/** Het account waartegen gecontroleerd wordt: een eigen wachtwoord gaat voor. */
async function account() {
  const i = await store.instellingen();
  return i.beheerder?.hash ? i.beheerder : INGEBOUWD;
}

/**
 * Meldt aan met e-mailadres en wachtwoord.
 * Geeft { ok, reden } terug; de reden is de tekst voor het scherm.
 */
export async function meldAan(email, wachtwoord) {
  if (!kanAanmelden()) {
    return { ok: false, reden: 'Aanmelden lukt enkel op een beveiligde verbinding (https). Open de app via het https-adres.' };
  }
  const a = await account();
  const ingetikt = String(email || '').trim().toLowerCase();
  if (!ingetikt || !wachtwoord) return { ok: false, reden: 'Vul uw e-mailadres en wachtwoord in.' };

  const berekend = await afleiden(String(wachtwoord), a.zout, a.iteraties);
  /* Ook bij een verkeerd e-mailadres wordt er gehasht: zo verraadt de snelheid
     van het antwoord niet of het adres bestaat. */
  if (ingetikt !== a.email.toLowerCase() || !gelijk(berekend, a.hash)) {
    return { ok: false, reden: 'Dat e-mailadres of wachtwoord klopt niet.' };
  }
  await store.zetInstelling({
    rol: 'luxaqua',
    aangemeldTot: Date.now() + GELDIG_UREN * 3600e3,
  });
  return { ok: true, reden: 'Welkom terug.' };
}

/** Terug naar de klantmodus. */
export const meldAf = () => store.zetInstelling({ rol: 'klant', aangemeldTot: null });

/**
 * Is de beheerder nu aangemeld? Is de aanmelding verlopen, dan valt de app
 * vanzelf terug op de klantmodus.
 */
export async function isAangemeld() {
  const i = await store.instellingen();
  if (i.rol !== 'luxaqua') return false;
  if (!i.aangemeldTot || Date.now() > i.aangemeldTot) {
    await store.zetInstelling({ rol: 'klant', aangemeldTot: null });
    return false;
  }
  return true;
}

/**
 * Controleert het wachtwoord zonder een aanmelding te starten: geen rol- of
 * sessiewijziging, niets dat blijft staan op dit toestel. Bedoeld voor een
 * kort klusje op andermans toestel (bijvoorbeeld de spaarkaart van een klant
 * bijwerken aan de toonbank), waar een medewerker het wachtwoord even intikt
 * zonder zich daar effectief aan te melden.
 */
export async function verifieerWachtwoord(wachtwoord) {
  if (!kanAanmelden()) return { ok: false, reden: 'Dit lukt enkel op een beveiligde verbinding (https).' };
  if (!wachtwoord) return { ok: false, reden: 'Vul het wachtwoord van LUX AQUA in.' };
  const a = await account();
  const berekend = await afleiden(String(wachtwoord), a.zout, a.iteraties);
  if (!gelijk(berekend, a.hash)) return { ok: false, reden: 'Dat wachtwoord klopt niet.' };
  return { ok: true, reden: 'Wachtwoord klopt.' };
}

/** Een eigen wachtwoord instellen, enkel op dit toestel. */
export async function wijzigWachtwoord(huidig, nieuw) {
  if (!kanAanmelden()) return { ok: false, reden: 'Dit lukt enkel op een beveiligde verbinding (https).' };
  if (String(nieuw || '').length < 10) {
    return { ok: false, reden: 'Kies een wachtwoord van minstens tien tekens. Een zin werkt beter dan een woord.' };
  }
  const a = await account();
  const controle = await afleiden(String(huidig || ''), a.zout, a.iteraties);
  if (!gelijk(controle, a.hash)) return { ok: false, reden: 'Het huidige wachtwoord klopt niet.' };

  const zout = hex(crypto.getRandomValues(new Uint8Array(16)).buffer);
  const hash = await afleiden(String(nieuw), zout, INGEBOUWD.iteraties);
  await store.zetInstelling({ beheerder: { email: a.email, zout, iteraties: INGEBOUWD.iteraties, hash } });
  return {
    ok: true,
    reden: 'Wachtwoord gewijzigd op dit toestel. Op andere toestellen blijft het oude gelden tot de app daar vernieuwd wordt.',
  };
}

/** Het e-mailadres van de beheerder, om in het aanmeldscherm te tonen. */
export const beheerderEmail = async () => (await account()).email;
