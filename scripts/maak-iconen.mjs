/**
 * Maakt alle icoon- en splashbestanden uit de officiële logobestanden in assets/brand/.
 * Gebruik: node scripts/maak-iconen.mjs
 * Bronnen (nooit hertekenen, zie BRAND.md):
 *   assets/brand/LUX-AQUA-06-app-icoon-navy.png   wit logo op navy vierkant, 2000 x 2000
 *   assets/brand/LUX-AQUA-03-wit.svg               witte vector voor transparante en splashbeelden
 * Resultaat:
 *   resources/      bronnen voor "npm run assets" (Android en iOS)
 *   assets/icons/   iconen voor de webversie (manifest, favicon, apple-touch-icon)
 * Gebruikt sharp, dat met @capacitor/assets meegeïnstalleerd is.
 */
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const sharp = createRequire(import.meta.url)('sharp');
const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ICOON_PNG = join(WORTEL, 'assets/brand/LUX-AQUA-06-app-icoon-navy.png');
const LOGO_SVG = readFileSync(join(WORTEL, 'assets/brand/LUX-AQUA-03-wit.svg'));
const SVG_BREEDTE = 1096; // intrinsieke breedte van de svg (viewBox 1095.6 x 683.9)

const NAVY = '#0B1530';   // merkpalet, achtergrond van het app-icoon
const MARINE = '#0D1730'; // aquapalet, achtergrond van de splash

const RESOURCES = join(WORTEL, 'resources');
const ICONS = join(WORTEL, 'assets/icons');
mkdirSync(RESOURCES, { recursive: true });
mkdirSync(ICONS, { recursive: true });

// Rastert de witte vector scherp op de gevraagde breedte.
const logoOpBreedte = (breedte) =>
  sharp(LOGO_SVG, { density: Math.ceil(72 * breedte / SVG_BREEDTE) + 8 })
    .resize({ width: breedte })
    .png()
    .toBuffer();

// Effen vierkant, eventueel doorzichtig.
const vlak = (maat, kleur) =>
  sharp({ create: { width: maat, height: maat, channels: 4, background: kleur } });

// Vierkant met het witte logo gecentreerd op een deel van de breedte.
const vlakMetLogo = async (maat, kleur, deel) => {
  const logo = await logoOpBreedte(Math.round(maat * deel));
  return vlak(maat, kleur).composite([{ input: logo, gravity: 'centre' }]).png();
};

// Het 06-icoon verkleind; met "deel" kleiner dan 1 komt het logo iets kleiner op dezelfde navy.
const icoonOpMaat = async (maat, deel = 1) => {
  if (deel >= 1) return sharp(ICOON_PNG).resize(maat, maat).png();
  const kern = await sharp(ICOON_PNG).resize(Math.round(maat * deel)).png().toBuffer();
  return vlak(maat, NAVY).composite([{ input: kern, gravity: 'centre' }]).png();
};

const schrijf = async (pad, beeld) => {
  const info = await beeld.toFile(pad);
  console.log(`${pad.replace(WORTEL + '/', '')}  ${info.width} x ${info.height}`);
};

// Bronnen voor @capacitor/assets
await schrijf(join(RESOURCES, 'icon-only.png'), await icoonOpMaat(1024));
await schrijf(join(RESOURCES, 'icon-foreground.png'), await vlakMetLogo(1024, { r: 0, g: 0, b: 0, alpha: 0 }, 0.58));
await schrijf(join(RESOURCES, 'icon-background.png'), vlak(1024, NAVY).png());
await schrijf(join(RESOURCES, 'splash.png'), await vlakMetLogo(2732, MARINE, 0.34));
await schrijf(join(RESOURCES, 'splash-dark.png'), await vlakMetLogo(2732, MARINE, 0.34));

// Iconen voor de webversie
await schrijf(join(ICONS, 'icon-192.png'), await icoonOpMaat(192));
await schrijf(join(ICONS, 'icon-512.png'), await icoonOpMaat(512));
await schrijf(join(ICONS, 'maskable-512.png'), await icoonOpMaat(512, 0.79));
await schrijf(join(ICONS, 'apple-touch-icon.png'), await icoonOpMaat(180));

console.log('Klaar.');
