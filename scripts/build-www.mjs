/**
 * Bouwt de map www/ voor Capacitor: een schone kopie van de webversie.
 * Gebruik: node scripts/build-www.mjs   (of: npm run build)
 * Er wordt niets omgezet of gebundeld; de app is gewone ES-modules.
 */
import { cpSync, mkdirSync, rmSync, statSync, readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOEL = join(WORTEL, 'www');

// Enkel wat de webversie nodig heeft. Geen node_modules, tests, scripts of bronbestanden voor iconen.
const ITEMS = ['index.html', 'manifest.webmanifest', 'sw.js', 'css', 'js', 'assets'];

const telBestanden = (pad) => {
  const info = statSync(pad);
  if (!info.isDirectory()) return 1;
  return readdirSync(pad).reduce((som, naam) => som + telBestanden(join(pad, naam)), 0);
};

rmSync(DOEL, { recursive: true, force: true });
mkdirSync(DOEL, { recursive: true });

let totaal = 0;
for (const item of ITEMS) {
  const bron = join(WORTEL, item);
  const doel = join(DOEL, item);
  try { statSync(bron); }
  catch { console.warn(`Overgeslagen (bestaat niet): ${item}`); continue; }
  cpSync(bron, doel, { recursive: true });
  const aantal = telBestanden(doel);
  totaal += aantal;
  console.log(`Gekopieerd: ${item}${statSync(doel).isDirectory() ? '/' : ''} (${aantal} bestand${aantal === 1 ? '' : 'en'})`);
}
console.log(`Klaar: ${totaal} bestanden in www/`);

// Controle: elke module in www/js moet in de precache-lijst van sw.js staan,
// anders start de webversie offline niet meer (een ontbrekend script krijgt geen antwoord).
const sw = readFileSync(join(DOEL, 'sw.js'), 'utf8');
const modules = [];
const zoek = (map, prefix) => {
  for (const naam of readdirSync(map)) {
    const pad = join(map, naam);
    if (statSync(pad).isDirectory()) zoek(pad, `${prefix}${naam}/`);
    else if (naam.endsWith('.js')) modules.push(`${prefix}${naam}`);
  }
};
zoek(join(DOEL, 'js'), './js/');
const ontbreekt = modules.filter((m) => !sw.includes(`'${m}'`));
if (ontbreekt.length) {
  console.error(`FOUT: deze modules staan niet in de lijst BESTANDEN van sw.js: ${ontbreekt.join(', ')}`);
  process.exit(1);
}
console.log(`Controle sw.js: alle ${modules.length} modules staan in de precache-lijst.`);
