/**
 * Native laag (Capacitor): camera, delen, bestanden, terugknop en statusbalk.
 *
 * De app draait als PWA in de browser en als Capacitor-app op Android en iOS.
 * In de native app spuit de bridge window.Capacitor in; de geïnstalleerde plugins
 * zitten onder window.Capacitor.Plugins. Op het web bestaat dat allemaal niet en
 * valt elke functie hier terug op het gewone webgedrag. Elke plugin-aanroep zit in
 * een try/catch: een ontbrekende plugin mag de app nooit doen crashen.
 */
import { download, melding, dialoog, h } from './ui.js';

/** True enkel wanneer de app effectief in de native schil draait. */
export function isNative() {
  try {
    return window.Capacitor?.isNativePlatform?.() === true;
  } catch {
    return false;
  }
}

/** True in de native app op Android (daar laten de meeste apps de tekst vallen als er een bijlage meegaat). */
export function isAndroid() {
  try {
    return isNative() && window.Capacitor?.getPlatform?.() === 'android';
  } catch {
    return false;
  }
}

/** Geeft de native plugin met die naam, of null als hij er niet is. */
export function plugin(naam) {
  try {
    return window.Capacitor?.Plugins?.[naam] || null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ hulpjes */

const isAnnulering = (e) => /cancel|annul|dismiss/i.test(String(e?.message || e?.code || e || ''));

/** Zet een data-URL om in een File. */
function dataUrlNaarFile(dataUrl, naam = 'foto.jpg') {
  const [kop, data] = String(dataUrl).split(',');
  const mime = (kop.match(/^data:([^;]+)/) || [])[1] || 'image/jpeg';
  const binair = atob(data);
  const bytes = new Uint8Array(binair.length);
  for (let i = 0; i < binair.length; i++) bytes[i] = binair.charCodeAt(i);
  return new File([bytes], naam, { type: mime });
}

/** Leest een Blob als base64 (zonder het data:-voorvoegsel). */
const blobNaarBase64 = (blob) => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(',')[1] || '');
  r.onerror = rej;
  r.readAsDataURL(blob);
});

const isTekst = (mime) => /^text\/|json|xml|javascript/i.test(mime || '');

const bestandsnaam = (voorvoegsel, ext) => `${voorvoegsel}-${Date.now()}-${Math.floor(Math.random() * 1e4)}.${ext}`;

/** Submap in de cachemap voor bestanden die gedeeld worden; wordt bij elke start geleegd. */
const DEELMAP = 'delen';

/**
 * Schrijft een bestand naar de cachemap van het toestel en geeft de native uri terug.
 * @param {string} naam
 * @param {string|Blob} inhoud
 * @param {string} mime
 */
async function schrijfNaarCache(naam, inhoud, mime) {
  const Filesystem = plugin('Filesystem');
  if (!Filesystem) throw new Error('Bestandsopslag is niet beschikbaar.');
  const type = mime || (inhoud instanceof Blob ? inhoud.type : '') || 'application/octet-stream';
  let data, encoding;
  if (typeof inhoud === 'string') {
    data = inhoud; encoding = 'utf8';
  } else if (isTekst(type)) {
    data = await inhoud.text(); encoding = 'utf8';
  } else {
    data = await blobNaarBase64(inhoud); encoding = undefined; // base64 is de standaard
  }
  const res = await Filesystem.writeFile({
    path: `${DEELMAP}/${naam}`, data, directory: 'CACHE', recursive: true, ...(encoding ? { encoding } : {}),
  });
  return res?.uri || res?.path || null;
}

/** Ruimt de gedeelde bestanden van een vorige keer op (het deelmenu heeft ze dan al overgenomen). */
async function leegDeelmap() {
  const Filesystem = plugin('Filesystem');
  if (!Filesystem?.rmdir) return;
  try { await Filesystem.rmdir({ path: DEELMAP, directory: 'CACHE', recursive: true }); } catch { /* bestond nog niet */ }
}

/* ----------------------------------------------------------------- foto kiezen */

/**
 * Laat de gebruiker een foto nemen of kiezen.
 * Belangrijk: synchroon aanroepen vanuit een klik, anders blokkeert de browser de kiezer.
 * Met bestand: true gaat het om een beeldbestand (bv. een logo) en niet om een foto: dan
 * gebruiken we ook natief de gewone bestandskiezer, zodat svg en transparante png intact blijven
 * (de camera-plugin geeft altijd jpeg terug).
 * @param {{bron?: 'camera'|'galerij'|'vraag', meerdere?: boolean, bestand?: boolean, accept?: string}} opties
 * @returns {Promise<File[]>} leeg bij annuleren
 */
export function kiesFoto({ bron = 'vraag', meerdere = false, bestand = false, accept = 'image/*' } = {}) {
  const Camera = isNative() && !bestand ? plugin('Camera') : null;
  if (Camera) return kiesFotoNatief(Camera, bron, meerdere);
  return kiesFotoWeb(bron, meerdere, accept);
}

/** Vraagt natief of de gebruiker één foto wil nemen of meerdere uit de galerij wil kiezen. */
function vraagCameraOfGalerij() {
  return dialoog({
    titel: 'Foto toevoegen',
    inhoud: h('p', { class: 'klein zacht' }, 'Neem een foto met de camera of kies een of meer foto\'s uit uw galerij.'),
    acties: [
      { label: 'Uit de galerij', waarde: 'galerij', stijl: 'knop--stil' },
      { label: 'Foto nemen', waarde: 'camera', stijl: 'knop--primair' },
    ],
  });
}

async function kiesFotoNatief(Camera, bron, meerdere) {
  try {
    if (meerdere && typeof Camera.pickImages === 'function') {
      if (bron === 'vraag') {
        // pickImages is enkel de galerij; de klant moet ook ter plekke een foto kunnen nemen
        const keuze = await vraagCameraOfGalerij();
        if (keuze === 'camera') return kiesFotoNatief(Camera, 'camera', false);
        if (keuze !== 'galerij') return [];
      } else if (bron === 'camera') {
        return kiesFotoNatief(Camera, 'camera', false);
      }
      const res = await Camera.pickImages({ quality: 85, width: 1600 });
      const uit = [];
      for (const [i, p] of (res?.photos || []).entries()) {
        // een file://-pad kan de WebView niet ophalen; de bridge zet het om
        const url = p.webPath || (p.path && window.Capacitor?.convertFileSrc ? window.Capacitor.convertFileSrc(p.path) : null);
        if (!url) continue;
        const blob = await (await fetch(url)).blob();
        uit.push(new File([blob], bestandsnaam(`foto-${i + 1}`, p.format || 'jpg'), { type: blob.type || 'image/jpeg' }));
      }
      return uit;
    }
    const foto = await Camera.getPhoto({
      resultType: 'dataUrl',
      source: bron === 'camera' ? 'CAMERA' : bron === 'galerij' ? 'PHOTOS' : 'PROMPT',
      quality: 85,
      correctOrientation: true,
      width: 1600,
      promptLabelHeader: 'Foto',
      promptLabelPhoto: 'Uit de galerij',
      promptLabelPicture: 'Foto nemen',
      promptLabelCancel: 'Annuleren',
    });
    if (!foto?.dataUrl) return [];
    return [dataUrlNaarFile(foto.dataUrl, bestandsnaam('foto', foto.format || 'jpg'))];
  } catch (e) {
    if (isAnnulering(e)) return [];
    console.error(e);
    melding(`Foto kiezen lukte niet: ${e?.message || e}`, 'fout');
    return [];
  }
}

function kiesFotoWeb(bron, meerdere, accept = 'image/*') {
  return new Promise((resolve) => {
    const inv = document.createElement('input');
    inv.type = 'file';
    inv.accept = accept;
    if (bron === 'camera') inv.setAttribute('capture', 'environment');
    if (meerdere) inv.multiple = true;
    inv.style.cssText = 'position:fixed;left:-9999px;top:0;width:1px;height:1px;opacity:0';
    let klaar = false;
    let focusTimer = null;
    // Browsers met een 'cancel'-event melden zelf netjes dat de kiezer gesloten werd
    // (Chrome en iOS 16.4 en hoger). Dan hebben wij geen terugval op focus nodig.
    const heeftCancel = typeof inv.oncancel !== 'undefined';
    const afronden = (bestanden, stil = true) => {
      if (klaar) return;
      klaar = true;
      clearTimeout(focusTimer);
      window.removeEventListener('focus', opFocus);
      // de input blijft in de DOM tot de belofte opgelost is, nooit langer
      setTimeout(() => inv.remove(), 0);
      if (!stil) melding('Er kwam geen foto binnen. Probeer het opnieuw.', 'fout');
      resolve(bestanden);
    };
    inv.addEventListener('change', () => afronden(Array.from(inv.files || [])));
    inv.addEventListener('cancel', () => afronden([]));
    // Terugval enkel voor oudere browsers zonder 'cancel'-event. Ruim genomen (20 s):
    // op een trage telefoon komt de focus bij het terugkeren uit de camera-app vaak
    // vóór het change-event, en een te korte terugval gooit die foto dan weg.
    const opFocus = () => {
      clearTimeout(focusTimer);
      focusTimer = setTimeout(() => { if (!inv.files?.length) afronden([], false); }, 20000);
    };
    if (!heeftCancel) window.addEventListener('focus', opFocus);
    document.body.append(inv);
    inv.click();
  });
}

/* ----------------------------------------------------------------------- delen */

/**
 * Deelt tekst en eventueel bestanden via het deelmenu van het toestel.
 * 'niet-mogelijk' betekent dat er geen deelmenu is (de aanroeper kiest dan een andere weg);
 * 'mislukt' betekent dat het native deelmenu een fout gaf (de gebruiker kreeg al een melding).
 * @param {{titel?: string, tekst?: string, bestanden?: File[]}} opties
 * @returns {Promise<'gedeeld'|'geannuleerd'|'niet-mogelijk'|'mislukt'>}
 */
export async function deel({ titel = 'LUX AQUA', tekst = '', bestanden = [] } = {}) {
  if (isNative() && plugin('Share')) {
    const r = await deelNatief(titel, tekst, bestanden);
    if (r !== 'niet-mogelijk') return r;
  }
  return deelWeb(titel, tekst, bestanden);
}

async function deelNatief(titel, tekst, bestanden) {
  const Share = plugin('Share');
  try {
    const files = [];
    for (const b of bestanden || []) {
      const uri = await schrijfNaarCache(b.name || bestandsnaam('bestand', 'bin'), b, b.type);
      if (uri) files.push(uri);
    }
    const opties = { title: titel, dialogTitle: titel };
    if (tekst) opties.text = tekst;
    if (files.length) opties.files = files;
    await Share.share(opties);
    return 'gedeeld';
  } catch (e) {
    if (isAnnulering(e)) return 'geannuleerd';
    console.error(e);
    melding(`Delen lukte niet: ${e?.message || e}`, 'fout');
    return 'mislukt';
  }
}

async function deelWeb(titel, tekst, bestanden) {
  if (!navigator.share) return 'niet-mogelijk';
  try {
    if (bestanden?.length && navigator.canShare && navigator.canShare({ files: bestanden })) {
      await navigator.share({ title: titel, text: tekst, files: bestanden });
      return 'gedeeld';
    }
    await navigator.share({ title: titel, text: tekst });
    return 'gedeeld';
  } catch (e) {
    if (e?.name === 'AbortError' || isAnnulering(e)) return 'geannuleerd';
    console.error(e);
    return 'niet-mogelijk';
  }
}

/**
 * Bewaart een bestand en biedt het aan: natief via het deelmenu (het bestand staat in de
 * cachemap), op het web als gewone download.
 * @param {string} naam
 * @param {string|Blob} inhoud
 * @param {string} mime
 * @returns {Promise<'gedeeld'|'geannuleerd'|'niet-mogelijk'|'gedownload'>}
 */
export async function bewaarEnDeelBestand(naam, inhoud, mime = 'application/json') {
  if (isNative() && plugin('Share') && plugin('Filesystem')) {
    try {
      const uri = await schrijfNaarCache(naam, inhoud, mime);
      await plugin('Share').share({ title: naam, dialogTitle: naam, files: [uri] });
      return 'gedeeld';
    } catch (e) {
      if (isAnnulering(e)) return 'geannuleerd';
      console.error(e);
      melding(`Bestand delen lukte niet: ${e?.message || e}`, 'fout');
      return 'niet-mogelijk';
    }
  }
  download(naam, inhoud, mime);
  return 'gedownload';
}

/* ------------------------------------------------------------------ opstarten */

const STARTROUTES = ['', 'start', 'klanten'];

function opStartscherm() {
  const naam = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)[0] || '';
  return STARTROUTES.includes(naam);
}

/** Terugknop, statusbalk en splashscherm van de native app. Doet niets op het web. */
export async function initNative() {
  if (!isNative()) return;

  const App = plugin('App');
  if (App?.addListener) {
    try {
      App.addListener('backButton', () => {
        // een open dialoog sluit eerst (via de sluitknop, zodat de dialoog-promise netjes met null oplost)
        const overlay = document.querySelector('.overlay');
        if (overlay) {
          const sluitknop = overlay.querySelector('.dialoog__kop .icoonknop');
          if (sluitknop) sluitknop.click();
          else { overlay.remove(); document.body.classList.remove('geen-scroll'); }
          return;
        }
        if (opStartscherm()) { try { App.exitApp?.(); } catch { /* dan blijft de app gewoon open */ } return; }
        if (history.length > 1) history.back();
        else location.hash = '#/';
      });
    } catch (e) { console.warn('Terugknop niet gekoppeld', e); }
  }

  const StatusBar = plugin('StatusBar');
  if (StatusBar) {
    try { await StatusBar.setStyle({ style: 'DARK' }); } catch { /* niet op elk toestel */ }
    try { await StatusBar.setBackgroundColor({ color: '#0D1730' }); } catch { /* enkel Android */ }
  }

  const SplashScreen = plugin('SplashScreen');
  if (SplashScreen) {
    try { await SplashScreen.hide(); } catch { /* geen ramp */ }
  }

  leegDeelmap();
}
