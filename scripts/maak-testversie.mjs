/**
 * Bouwt de testversie van LUX AQUA: de volledige app in één zelfstandig HTML-bestand.
 *
 * Gebruik: node scripts/maak-testversie.mjs [doelbestand]
 *          (standaard doel: /tmp/luxaqua-testversie.html)
 *
 * Waarom: de app bestaat uit gewone ES-modules die elk apart geladen worden. Om ze als
 * één artifact te kunnen delen (een link die meteen opent, zonder server en zonder
 * losse bestanden) worden alle modules samengevoegd tot één modulescope, met het
 * stijlblad en de logobestanden erin verwerkt.
 *
 * Wat het script doet:
 *  1. Leest de imports en bepaalt zelf de afhankelijkheidsvolgorde (topologisch).
 *     js/app.js komt altijd als laatste: die start de app.
 *  2. Verwijdert de import-regels en het sleutelwoord export.
 *     Voor "import * as x from './y.js'" wordt na module y een object const x = { ... }
 *     gebouwd met de exports van y.
 *  3. Controleert op botsende namen op moduleniveau en stopt met een duidelijke melding.
 *  4. Zet css/style.css inline en de logobestanden als data-URL's.
 *  5. Schrijft <title>, <meta>, <style>, de app-html en <script type="module">.
 *     Geen doctype, html, head of body: de artifactomgeving wikkelt dat er zelf omheen.
 *  6. Zet de registratie van de service worker uit (er staat geen sw.js naast een artifact).
 */
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const INGANG = join(WORTEL, 'js', 'app.js');
const DOEL = resolve(process.argv[2] || '/tmp/luxaqua-testversie.html');

const kort = (pad) => relative(WORTEL, pad).split('\\').join('/');

const stop = (boodschap) => {
  console.error(`FOUT: ${boodschap}`);
  process.exit(1);
};

/* ------------------------------------------------------------------ modules lezen */

// import ... from '...';  (ook over meerdere regels)
const IMPORT_RE = /^import\s+([\s\S]*?)\s*from\s*['"]([^'"]+)['"]\s*;?[ \t]*$/gm;
// import './iets.js';  (enkel voor het neveneffect)
const IMPORT_KAAL_RE = /^import\s*['"]([^'"]+)['"]\s*;?[ \t]*$/gm;
// export function|const|let|var|class NAAM
const EXPORT_DECL_RE = /^export\s+(?:async\s+)?(?:function\s*\*?|const|let|var|class)\s+([A-Za-z0-9_$]+)/gm;
// export { a, b as c };
const EXPORT_LIJST_RE = /^export\s*\{([^}]*)\}\s*;?[ \t]*$/gm;
// elke declaratie op het hoogste niveau (begint in kolom 0)
const DECL_RE = /^(?:export\s+)?(?:async\s+)?(?:function\s*\*?|const|let|var|class)\s+([A-Za-z0-9_$]+)/gm;

const modules = new Map();

function lees(pad) {
  if (modules.has(pad)) return modules.get(pad);
  let bron;
  try { bron = readFileSync(pad, 'utf8'); }
  catch { stop(`module niet gevonden: ${kort(pad)}`); }

  const invoer = [];      // { pad, naamruimte }
  for (const m of bron.matchAll(IMPORT_RE)) {
    const clausule = m[1].trim();
    const doelPad = resolve(dirname(pad), m[2]);
    const naamruimte = clausule.match(/^\*\s+as\s+([A-Za-z0-9_$]+)$/);
    invoer.push({ pad: doelPad, naamruimte: naamruimte ? naamruimte[1] : null });
  }
  for (const m of bron.matchAll(IMPORT_KAAL_RE)) {
    invoer.push({ pad: resolve(dirname(pad), m[1]), naamruimte: null });
  }

  const uitvoer = [];
  for (const m of bron.matchAll(EXPORT_DECL_RE)) uitvoer.push(m[1]);
  for (const m of bron.matchAll(EXPORT_LIJST_RE)) {
    for (const stuk of m[1].split(',')) {
      const naam = stuk.trim();
      if (!naam) continue;
      const alias = naam.match(/^([A-Za-z0-9_$]+)\s+as\s+([A-Za-z0-9_$]+)$/);
      uitvoer.push(alias ? alias[2] : naam);
    }
  }

  const declaraties = [...bron.matchAll(DECL_RE)].map((m) => m[1]);

  const mod = { pad, bron, invoer, uitvoer, declaraties };
  modules.set(pad, mod);
  for (const i of invoer) lees(i.pad);
  return mod;
}

lees(INGANG);

/* ------------------------------------------------- volgorde bepalen (topologisch) */

const staat = new Map();   // pad -> 'bezig' | 'klaar'
const volgorde = [];
const kringlopen = [];

function bezoek(pad, stapel) {
  const s = staat.get(pad);
  if (s === 'klaar') return;
  if (s === 'bezig') {                       // terugverwijzing: kringloop
    kringlopen.push([...stapel.slice(stapel.indexOf(pad)), pad].map(kort).join(' → '));
    return;                                  // die ene verwijzing negeren, de rest blijft staan
  }
  staat.set(pad, 'bezig');
  for (const i of modules.get(pad).invoer) bezoek(i.pad, [...stapel, pad]);
  staat.set(pad, 'klaar');
  volgorde.push(pad);
}

bezoek(INGANG, []);
for (const pad of modules.keys()) bezoek(pad, []);

// app.js start de app, dus die hoort altijd achteraan.
const rangschikking = [...volgorde.filter((p) => p !== INGANG), INGANG];

/* ------------------------------------------------------- botsende namen opsporen */

const naamruimten = new Map();   // modulepad -> naam van het object (store, db, ...)
for (const mod of modules.values()) {
  for (const i of mod.invoer) {
    if (!i.naamruimte) continue;
    const bestaand = naamruimten.get(i.pad);
    if (bestaand && bestaand !== i.naamruimte) {
      stop(`${kort(i.pad)} wordt onder twee namen ingelezen: "${bestaand}" en "${i.naamruimte}".`);
    }
    naamruimten.set(i.pad, i.naamruimte);
  }
}

const eigenaar = new Map();      // naam -> waar ze vandaan komt
const botsingen = [];
for (const pad of rangschikking) {
  for (const naam of modules.get(pad).declaraties) {
    const vorige = eigenaar.get(naam);
    if (vorige) botsingen.push(`"${naam}" staat zowel in ${vorige} als in ${kort(pad)}`);
    else eigenaar.set(naam, kort(pad));
  }
}
for (const [pad, naam] of naamruimten) {
  const vorige = eigenaar.get(naam);
  if (vorige) botsingen.push(`"${naam}" (het object voor ${kort(pad)}) botst met een naam in ${vorige}`);
  else eigenaar.set(naam, `het object voor ${kort(pad)}`);
}
if (botsingen.length) {
  stop(`botsende namen op moduleniveau, samenvoegen kan niet:\n  - ${botsingen.join('\n  - ')}`);
}

/* --------------------------------------------------------- stijlblad en beeldmerk */

const css = readFileSync(join(WORTEL, 'css', 'style.css'), 'utf8');
if (css.includes('</style')) stop('css/style.css bevat "</style", dat kan niet inline.');

const MIMES = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
const dataUrl = (relPad) => {
  const bytes = readFileSync(join(WORTEL, relPad));
  const ext = relPad.slice(relPad.lastIndexOf('.'));
  const mime = MIMES[ext] || 'application/octet-stream';
  return `data:${mime};base64,${bytes.toString('base64')}`;
};

// Elk pad naar assets/brand/ dat in de JS voorkomt, wordt een data-URL.
const merkPaden = new Set();
for (const mod of modules.values()) {
  for (const m of mod.bron.matchAll(/assets\/brand\/[A-Za-z0-9._-]+/g)) merkPaden.add(m[0]);
}
if (!merkPaden.size) stop('geen enkel logopad uit assets/brand/ gevonden in de JS, dat klopt niet.');
const merkUrls = new Map([...merkPaden].map((p) => [p, dataUrl(p)]));

/* ------------------------------------------------------------ modules samenvoegen */

const schoon = (mod) => mod.bron
  .replace(IMPORT_RE, '')
  .replace(IMPORT_KAAL_RE, '')
  .replace(EXPORT_LIJST_RE, '')
  .replace(/^export\s+(?=(?:async\s+)?(?:function|const|let|var|class)\b)/gm, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const stukken = [];
for (const pad of rangschikking) {
  const mod = modules.get(pad);
  let code = schoon(mod);

  if (pad === INGANG) {
    // De service worker mag hier niet geregistreerd worden: naast een artifact staat geen sw.js.
    // Eerst nakijken of de registratie in de bron nog steeds afgeschermd staat (pad + vangnet).
    const vangnet = /navigator\.serviceWorker\.register\((['"])sw\.js\1\)\s*\.catch\(/;
    if (!vangnet.test(code)) {
      stop('js/app.js registreert de service worker niet meer met een pad en een .catch(). '
        + 'Kijk dit na: zonder vangnet geeft de webversie een fout wanneer sw.js ontbreekt.');
    }
    const voorwaarde = "if (!isNative() && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {";
    if (!code.includes(voorwaarde)) {
      stop('de voorwaarde rond de registratie van de service worker in js/app.js is veranderd. '
        + 'Pas scripts/maak-testversie.mjs aan, anders zoekt de testversie naar een sw.js die er niet is.');
    }
    code = code.replace(voorwaarde,
      'if (false) { // testversie in één bestand: geen sw.js ernaast, dus niets registreren');
  }

  stukken.push(`/* =========================== ${kort(pad)} =========================== */\n${code}`);

  const naamruimte = naamruimten.get(pad);
  if (naamruimte) {
    const leden = modules.get(pad).uitvoer;
    if (!leden.length) stop(`${kort(pad)} wordt als naamruimte ingelezen maar exporteert niets.`);
    stukken.push(`/* de exports van ${kort(pad)}, gebundeld als "${naamruimte}" */\n`
      + `const ${naamruimte} = { ${leden.join(', ')} };`);
  }
}

let js = stukken.join('\n\n');
for (const [pad, url] of merkUrls) js = js.split(pad).join(url);

if (js.includes('</script')) stop('de samengevoegde code bevat "</script", dat breekt het HTML-bestand.');
const rest = js.match(/^\s*(?:import|export)\b.*$/m);
if (rest) stop(`er staat nog een import- of exportregel in de samengevoegde code: ${rest[0].trim()}`);

/* ------------------------------------------------------------------ HTML schrijven */

const html = `<title>LUX AQUA testversie</title>
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#0D1730">
<meta name="description" content="LUX AQUA: houd uw waterwaarden bij, lees uw teststrip in met de camera en krijg meteen advies en de juiste dosering.">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="LUX AQUA">
<style>
${css}
</style>
<div id="app">
  <header class="kopbalk" id="kopbalk"></header>
  <main id="scherm"><p class="zacht midden">Bezig met laden…</p></main>
  <nav class="navigatie" id="navigatie"></nav>
</div>
<div id="meldingen"></div>
<noscript><p style="padding:20px">Deze app heeft JavaScript nodig om te werken.</p></noscript>
<script type="module">
${js}
</script>
`;

writeFileSync(DOEL, html);

/* ------------------------------------------------------------------------ verslag */

const grootte = statSync(DOEL).size;
const kb = (n) => `${(n / 1024).toFixed(1)} kB`;
console.log(`Volgorde (${rangschikking.length} modules):`);
console.log(`  ${rangschikking.map(kort).join('\n  ')}`);
if (kringlopen.length) {
  console.log(`Kringlopen (opgelost door de terugverwijzing te negeren):`);
  for (const k of kringlopen) console.log(`  ${k}`);
}
console.log(`Naamruimten: ${[...naamruimten].map(([p, n]) => `${n} = ${kort(p)}`).join(', ') || 'geen'}`);
console.log(`Namen op moduleniveau: ${eigenaar.size}, geen botsingen.`);
console.log(`Ingesloten: css/style.css (${kb(css.length)}), `
  + [...merkUrls].map(([p, u]) => `${p} (${kb(u.length)})`).join(', '));
console.log(`Service worker: registratie uitgezet in de testversie.`);
console.log(`Klaar: ${DOEL} (${kb(grootte)})`);
