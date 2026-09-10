/**
 * Maakt de vaste beeldmaterialen voor Play Console en App Store Connect,
 * uitsluitend uit de officiële logobestanden in assets/brand/ (zie BRAND.md).
 * Gebruik: node scripts/maak-winkelbeelden.mjs
 * Resultaat in winkelmateriaal/:
 *   play-icoon-512.png              Play Console: app-icoon, 512x512
 *   play-feature-graphic-1024x500.png  Play Console: promotiebanner
 *   appstore-icoon-1024.png         App Store Connect: marketing-icoon, 1024x1024 (geen alfakanaal)
 * Screenshots komen uit een apart script (scripts/maak-screenshots.mjs), dat de
 * echte, draaiende app fotografeert.
 */
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const sharp = createRequire(import.meta.url)('sharp');
const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const ICOON_PNG = join(WORTEL, 'assets/brand/LUX-AQUA-06-app-icoon-navy.png'); // wit logo op navy, 2000x2000
const LOGO_SVG_WIT = readFileSync(join(WORTEL, 'assets/brand/LUX-AQUA-03-wit.svg'));
const SVG_BREEDTE = 1096; // intrinsieke breedte (viewBox 1095.6 x 683.9)

const NAVY = '#0B1530';
const MARINE = '#0D1730';
const AQUA = '#0C9494';

const UIT = join(WORTEL, 'winkelmateriaal');
mkdirSync(UIT, { recursive: true });

const witLogoBuffer = async (breedtePx) => sharp(LOGO_SVG_WIT, { density: 72 * (breedtePx / SVG_BREEDTE) })
  .resize({ width: Math.round(breedtePx) })
  .png()
  .toBuffer();

async function playIcoon() {
  // Play Console vraagt exact 512x512, 32-bit PNG, mag alfakanaal hebben.
  await sharp(ICOON_PNG).resize(512, 512).png().toFile(join(UIT, 'play-icoon-512.png'));
  console.log('play-icoon-512.png');
}

async function appstoreIcoon() {
  // App Store Connect vraagt 1024x1024, RGB, GEEN alfakanaal (transparantie wordt geweigerd).
  await sharp(ICOON_PNG).resize(1024, 1024).flatten({ background: NAVY }).png().toFile(join(UIT, 'appstore-icoon-1024.png'));
  console.log('appstore-icoon-1024.png');
}

async function featureGraphic() {
  // Play Console vraagt exact 1024x500, geen transparantie, geen tekst te dicht bij de rand.
  const B = 1024, H = 500;
  const logoBreedte = Math.round(B * 0.34);
  const logo = await witLogoBuffer(logoBreedte);
  const logoMeta = await sharp(logo).metadata();

  const achtergrond = await sharp({
    create: { width: B, height: H, channels: 3, background: NAVY },
  })
    .composite([
      // subtiel verloop naar aqua rechtsonder, als vlak (geen tekst, geen fijn detail: leesbaar op elk formaat)
      {
        input: Buffer.from(
          `<svg width="${B}" height="${H}"><defs><radialGradient id="g" cx="80%" cy="120%" r="90%">
            <stop offset="0%" stop-color="${AQUA}" stop-opacity="0.55"/>
            <stop offset="100%" stop-color="${MARINE}" stop-opacity="0"/>
          </radialGradient></defs><rect width="${B}" height="${H}" fill="url(#g)"/></svg>`
        ),
        top: 0,
        left: 0,
      },
      { input: logo, left: Math.round((B - logoMeta.width) / 2), top: Math.round((H - logoMeta.height) / 2) },
    ])
    .flatten({ background: NAVY }) // Play Console weigert transparantie in de feature graphic
    .removeAlpha()
    .png()
    .toFile(join(UIT, 'play-feature-graphic-1024x500.png'));
  console.log('play-feature-graphic-1024x500.png');
}

await playIcoon();
await appstoreIcoon();
await featureGraphic();
console.log('Klaar. Bestanden in winkelmateriaal/.');
