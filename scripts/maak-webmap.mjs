/**
 * Zet de webversie klaar zoals ze bij Nomeo in de map /aqua/ moet staan, en
 * maakt er een zip van die op een Linuxserver correct uitpakt.
 *
 * Gebruik:
 *   node scripts/maak-webmap.mjs            (naar dist/aqua en dist/lux-aqua-app.zip)
 *   node scripts/maak-webmap.mjs /pad/naar  (ander doel)
 *
 * Wat dit script bewaakt, en waarom:
 *
 * 1. VOLLEDIGHEID. De service worker precacht een vaste lijst bestanden. Ontbreekt
 *    er een op de server, dan werkt de app online nog wel maar offline niet, en er
 *    komt geen enkele foutmelding. Dit script leest die lijst uit sw.js en stopt
 *    met een duidelijke melding als er een bestand ontbreekt.
 * 2. SCHUINE STREPEN IN DE ZIP. Een zip die op Windows gemaakt is, kan mappen als
 *    "assets\css\main.css" opslaan, met een backslash in de bestandsnaam. Op een
 *    Linuxserver wordt dat een bestand met een rare naam in plaats van een map, en
 *    dan is de site stuk. Wij pakken daarom in met het unix-hulpmiddel zip, dat
 *    altijd schuine strepen schrijft, en controleren dat achteraf.
 * 3. EIGEN .HTACCESS. De hoofdmap van de website levert zijn eigen .htaccess mee.
 *    De app heeft twee dingen nodig die daar niet in staan: het juiste mediatype
 *    voor het manifest, en de garantie dat sw.js NIET lang gecacht wordt. Zonder
 *    dat tweede blijven klanten maandenlang op een oude versie zitten.
 */
import { mkdirSync, rmSync, cpSync, writeFileSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, dirname, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const DOEL = process.argv[2] || join(WORTEL, 'dist');
const MAP = join(DOEL, 'aqua');
const ZIP = join(DOEL, 'lux-aqua-app.zip');

/* ------------------------------------------------- wat er mee moet, en niets meer */

/** Losse bestanden in de hoofdmap van /aqua/. */
const BESTANDEN = [
  'index.html',
  'installeren.html',
  'manifest.webmanifest',
  'sw.js',
];

/** Hele mappen die integraal mee gaan. */
const MAPPEN = ['css', 'js', 'assets'];

/** Nooit meesturen: dat hoort niet op een publieke webserver. */
const NOOIT = ['node_modules', 'android', 'ios', 'test', 'scripts', 'winkelmateriaal', '.git'];

/* ---------------------------------------------------------------- de precachelijst */

/** Leest de lijst uit sw.js, zodat de controle niet los van de app kan lopen. */
function precacheLijst() {
  const sw = readFileSync(join(WORTEL, 'sw.js'), 'utf8');
  const blok = sw.match(/const BESTANDEN = \[([\s\S]*?)\];/);
  if (!blok) {
    console.error('FOUT: de lijst BESTANDEN is niet gevonden in sw.js. Is de service worker herschreven?');
    process.exit(1);
  }
  return [...blok[1].matchAll(/'([^']+)'/g)]
    .map((m) => m[1].replace(/^\.\//, ''))
    .filter((b) => b && b !== '');
}

/* ------------------------------------------------------------------------- bouwen */

rmSync(DOEL, { recursive: true, force: true });
mkdirSync(MAP, { recursive: true });

const gekopieerd = [];

for (const b of BESTANDEN) {
  const bron = join(WORTEL, b);
  if (!existsSync(bron)) {
    console.error(`FOUT: ${b} bestaat niet in de projectmap.`);
    process.exit(1);
  }
  cpSync(bron, join(MAP, b));
  gekopieerd.push(b);
}

for (const m of MAPPEN) {
  const bron = join(WORTEL, m);
  if (!existsSync(bron)) {
    console.error(`FOUT: de map ${m} bestaat niet.`);
    process.exit(1);
  }
  cpSync(bron, join(MAP, m), { recursive: true });
  gekopieerd.push(`${m}/`);
}

/* ------------------------------------------------------- controle op volledigheid */

const ontbreekt = [];
for (const b of precacheLijst()) {
  if (b === '' || b === './') continue;
  if (!existsSync(join(MAP, b))) ontbreekt.push(b);
}
if (ontbreekt.length) {
  console.error('FOUT: de service worker precacht bestanden die niet in de webmap staan.');
  console.error('Offline zou de app dan stilzwijgend breken. Ontbrekend:');
  for (const b of ontbreekt) console.error('  -', b);
  process.exit(1);
}

/* Niets uit NOOIT mag er per ongeluk in zitten. */
for (const n of NOOIT) {
  if (existsSync(join(MAP, n))) {
    console.error(`FOUT: ${n} zit in de webmap en hoort daar niet.`);
    process.exit(1);
  }
}

/* ----------------------------------------------------------------------- htaccess */

const htaccess = `# LUX AQUA-app, eigen regels voor de map /aqua/.
# Deze regels staan bewust hier en niet in de hoofdmap, zodat zij niet botsen
# met de .htaccess van de website zelf.

# Het manifest krijgt zonder deze regel vaak het verkeerde mediatype, en dan
# biedt Chrome de app niet aan om te installeren.
AddType application/manifest+json .webmanifest

<IfModule mod_headers.c>
  # De service worker en het startbestand mogen NIET lang gecacht worden. Anders
  # blijven klanten op een oude versie zitten en komt een herstel nooit aan.
  <FilesMatch "^(sw\\.js|index\\.html|installeren\\.html|manifest\\.webmanifest)$">
    Header set Cache-Control "no-cache, must-revalidate"
  </FilesMatch>

  # De service worker mag enkel binnen /aqua/ werken, niet over de hele site.
  <Files "sw.js">
    Header set Service-Worker-Allowed "/aqua/"
  </Files>
</IfModule>

# De app is een gewone statische map: geen herschrijfregels nodig, want de
# navigatie gebeurt met een hekje in het adres.
<IfModule mod_rewrite.c>
  RewriteEngine Off
</IfModule>
`;
writeFileSync(join(MAP, '.htaccess'), htaccess);

const leesmij = `LUX AQUA-app, webversie
=======================

Deze map hoort als /aqua/ in de webmap van luxhelchteren.be te staan, zodat de
app bereikbaar is op:

  https://luxhelchteren.be/aqua/installeren.html   (de infopagina voor klanten)
  https://luxhelchteren.be/aqua/                   (de app zelf)

Voor wie dit oplaadt
--------------------
1. Pak de zip uit in de webmap, zodat er een map /aqua/ ontstaat. Controleer dat
   /aqua/js/ en /aqua/assets/ echte MAPPEN zijn en geen bestanden met een
   backslash in de naam. Is dat laatste zo, dan is de zip verkeerd ingepakt en
   werkt de app niet.
2. De map bevat een eigen .htaccess. Laat die staan: zonder die regels biedt
   Chrome de app niet aan om te installeren en blijven klanten op een oude
   versie hangen.
3. Het adres MOET https zijn en mag geen certificaatwaarschuwing geven. Op een
   gewoon http-adres werkt de app wel, maar zonder offlinewerking, zonder
   installatieknop op Android en zonder aanmelding voor de beheerder. Er komt
   daarbij geen enkele foutmelding.

Controle na het oplaadaden
--------------------------
- Open https://luxhelchteren.be/aqua/installeren.html op een Android-toestel en
  zet de app op het beginscherm met de knop op die pagina.
- Doe hetzelfde op een iPhone, via Safari en de deelknop.
- Open de app, zet het toestel in vliegtuigmodus en herlaad. Blijft de app
  werken, dan staat alles goed. In de app staat het ook bij het tandwiel, onder
  Over deze app, op de regel "Offline klaar".

Gemaakt met: node scripts/maak-webmap.mjs
`;
writeFileSync(join(DOEL, 'LEESMIJ.txt'), leesmij);

/* ---------------------------------------------------------------------- inpakken */

rmSync(ZIP, { force: true });
try {
  /* -r recursief, -q stil, -X zonder extra platformgegevens. Het unix-hulpmiddel
     zip schrijft altijd schuine strepen, wat precies is wat de Linuxserver wil. */
  execFileSync('zip', ['-r', '-q', '-X', ZIP, 'aqua', '../dist/LEESMIJ.txt'], { cwd: DOEL });
} catch {
  execFileSync('zip', ['-r', '-q', '-X', ZIP, 'aqua'], { cwd: DOEL });
}

/* Nakijken dat er geen enkele backslash in een naam zit. Dit is de fout die de
   websitesessie vanavond zelf tegenkwam, en zij is onzichtbaar tot de site stuk is. */
const inhoud = execFileSync('unzip', ['-Z1', ZIP], { encoding: 'utf8' }).trim().split('\n');
const scheef = inhoud.filter((n) => n.includes('\\'));
if (scheef.length) {
  console.error('FOUT: de zip bevat backslashes in de bestandsnamen. Op Linux pakt dat verkeerd uit:');
  for (const n of scheef.slice(0, 10)) console.error('  -', n);
  process.exit(1);
}
if (!inhoud.some((n) => n.startsWith('aqua/js/'))) {
  console.error('FOUT: de zip bevat geen map aqua/js/. Er is iets misgegaan bij het inpakken.');
  process.exit(1);
}

/* ------------------------------------------------------------------------ verslag */

const grootte = (pad) => {
  const b = statSync(pad).size;
  return b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.round(b / 1024)} kB`;
};

console.log('Webmap klaar.\n');
console.log(`  ${posix.join(DOEL.replace(WORTEL + '/', ''), 'aqua')}/   ${inhoud.length} bestanden`);
console.log(`  ${posix.join(DOEL.replace(WORTEL + '/', ''), 'lux-aqua-app.zip')}   ${grootte(ZIP)}`);
console.log(`\nMeegenomen: ${gekopieerd.join(', ')} plus .htaccess`);
console.log(`Precache nagekeken: alle ${precacheLijst().length} bestanden uit sw.js staan erin.`);
console.log('Zip nagekeken: enkel schuine strepen in de namen.');
console.log('\nDit hoort als /aqua/ in de webmap te komen, zodat het adres');
console.log('https://luxhelchteren.be/aqua/installeren.html werkt.');
