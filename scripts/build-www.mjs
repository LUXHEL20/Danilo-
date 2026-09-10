/**
 * Bouwt de map www/ voor Capacitor: een schone kopie van de webversie.
 * Gebruik: node scripts/build-www.mjs   (of: npm run build)
 * Er wordt niets omgezet of gebundeld; de app is gewone ES-modules.
 */
import { cpSync, mkdirSync, rmSync, statSync, readdirSync } from 'node:fs';
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
