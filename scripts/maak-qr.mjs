/**
 * Maakt de QR-code die naar de infopagina van de app verwijst.
 * Gebruik:
 *   node scripts/maak-qr.mjs                      (gebruikt het standaardadres hieronder)
 *   node scripts/maak-qr.mjs https://ander/adres   (voor een ander adres)
 *
 * Resultaat in winkelmateriaal/:
 *   qr-luxaqua.png   1200 x 1200, voor scherm en gewoon drukwerk
 *   qr-luxaqua.svg   vectorversie, voor groot drukwerk (raamsticker, affiche)
 *
 * De QR verwijst bewust naar de INFOPAGINA (installeren.html) en niet
 * rechtstreeks naar de app: de klant krijgt eerst te zien hoe hij ze op zijn
 * beginscherm zet. Foutcorrectieniveau M, ruime witmarge, navy op wit, zodat
 * hij ook van op afstand en op papier vlot scant.
 */
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const QRCode = createRequire(import.meta.url)('qrcode');
const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const UIT = join(WORTEL, 'winkelmateriaal');
mkdirSync(UIT, { recursive: true });

const STANDAARD = 'https://luxhelchteren.be/aqua/installeren.html';
const adres = process.argv[2] || STANDAARD;

const opties = {
  errorCorrectionLevel: 'M',
  margin: 4,
  color: { dark: '#0B1530', light: '#FFFFFF' }, // navy uit het merkpalet op wit
};

await QRCode.toFile(join(UIT, 'qr-luxaqua.png'), adres, { ...opties, type: 'png', width: 1200 });
await QRCode.toFile(join(UIT, 'qr-luxaqua.svg'), adres, { ...opties, type: 'svg' });

/* Blok om op luxhelchteren.be te plakken. De QR zit als data-URL in het blok
   zelf, zodat er geen apart beeldbestand opgeladen moet worden. Alle opmaak
   staat inline, zodat het blok de stijl van de website niet stoort en er ook
   niet door gestoord wordt. */
const qrDataUrl = await QRCode.toDataURL(adres, { ...opties, width: 600 });
const blok = `<!-- LUX AQUA app: knop, QR-code en uitleg. Plak dit blok op luxhelchteren.be.
     Gemaakt met scripts/maak-qr.mjs voor het adres: ${adres} -->
<div style="max-width:680px;margin:32px auto;padding:26px;border-radius:16px;background:#0D1730;color:#fff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6">
  <h2 style="margin:0 0 8px;font-size:1.45rem;color:#fff">De LUX AQUA-app</h2>
  <p style="margin:0 0 18px;color:#c3d3d8">
    Houd uw waterwaarden bij, fotografeer uw teststrip en krijg meteen advies op maat van uw
    aquarium of vijver. Gratis voor onze klanten, en uw gegevens blijven op uw eigen toestel.
  </p>

  <div style="display:flex;flex-wrap:wrap;gap:22px;align-items:center">
    <div style="flex:1 1 260px;min-width:240px">
      <ul style="margin:0 0 20px;padding-left:18px;color:#c3d3d8">
        <li style="margin-bottom:6px">Uw teststrip wordt door de camera afgelezen.</li>
        <li style="margin-bottom:6px">U ziet meteen wat u kan bijsturen, met de juiste dosering.</li>
        <li style="margin-bottom:6px">Met één knop vraagt u hulp of een huisbezoek.</li>
        <li>Werkt ook zonder internet.</li>
      </ul>
      <a href="${adres}" style="display:inline-block;background:#0C9494;color:#fff;text-decoration:none;font-weight:700;padding:14px 26px;border-radius:12px">
        Zet de app op uw telefoon
      </a>
    </div>

    <div style="flex:0 0 auto;text-align:center">
      <img src="${qrDataUrl}" alt="QR-code naar de LUX AQUA-app" width="170" height="170"
           style="display:block;border-radius:12px;background:#fff;padding:8px">
      <span style="display:block;margin-top:8px;font-size:.82rem;color:#9fb4bd">Scan met uw telefoon</span>
    </div>
  </div>
</div>
`;
writeFileSync(join(UIT, 'website-blok.html'), blok);

console.log(`QR-code gemaakt voor: ${adres}`);
console.log('  winkelmateriaal/qr-luxaqua.png (1200 x 1200)');
console.log('  winkelmateriaal/qr-luxaqua.svg (vector)');
console.log('  winkelmateriaal/website-blok.html (knop en QR, om op de website te plakken)');
console.log('\nLet op: wijzigt het adres, draai dit script dan opnieuw met het nieuwe adres.');
