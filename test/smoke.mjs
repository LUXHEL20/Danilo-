/**
 * Rooktest voor de webversie: doorloopt de volledige klantflow en de beheerderskant.
 * Gebruik: start een webserver in de projectmap en run
 *   APP_URL=http://127.0.0.1:8123/index.html node test/smoke.mjs
 * Vereist Playwright (globaal geïnstalleerd) en Chromium.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const fouten = [];
const BASIS = process.env.APP_URL || 'http://127.0.0.1:8123/index.html';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('console', (m) => { if (m.type() === 'error') fouten.push('console: ' + m.text()); });
page.setDefaultTimeout(4000);
page.on('pageerror', (e) => fouten.push('pageerror: ' + e.message));

const stap = async (naam, fn) => {
  try { await fn(); console.log('✓', naam); }
  catch (e) { console.log('✗', naam, '→', e.message.split('\n')[0]); fouten.push(`${naam}: ${e.message.split('\n')[0]}`); }
  finally { await page.evaluate(() => { document.querySelectorAll('.overlay').forEach(o => o.remove()); document.body.classList.remove('geen-scroll'); }); }
};

await page.goto(BASIS);
await page.waitForTimeout(600);

await stap('onboarding zichtbaar', async () => {
  await page.getByRole('button', { name: 'Beginnen' }).click();
  await page.getByText('Ik ben klant').click();
});
await stap('klantgegevens invullen', async () => {
  await page.locator('input[autocomplete="name"]').fill('Test Klant');
  await page.locator('input[autocomplete="tel"]').fill('0470 12 34 56');
  await page.getByRole('button', { name: 'Volgende' }).click();
});
await stap('bakgegevens invullen', async () => {
  const nums = page.locator('input[type="number"]');
  await nums.nth(0).fill('120'); await nums.nth(1).fill('50'); await nums.nth(2).fill('55');
  await page.waitForTimeout(150);
  const liters = await nums.nth(3).inputValue();
  if (Number(liters) < 200) throw new Error('liters niet berekend: ' + liters);
  await page.getByRole('button', { name: 'Volgende' }).click();
  await page.getByRole('button', { name: /Klaar, start de app/ }).click();
await page.waitForTimeout(400);
// Na de onboarding verschijnt het kennismakingsbericht vanzelf, bovenop het
// (al zichtbare) startscherm. Sluiten via zijn eigen knop, niet forceren: het
// forceren van een overlay in andere tests brak een bewust openblijvende dialoog.
await page.getByRole('button', { name: 'Overslaan' }).click();
});
await page.waitForTimeout(500);
await stap('startscherm', async () => {
  await page.waitForSelector('text=Doe uw eerste meting', { timeout: 3000 });
});
await stap('meting invullen met live advies', async () => {
  await page.locator('.navigatie a', { hasText: 'Meten' }).click();
  await page.waitForTimeout(300);
  const velden = page.locator('#scherm input[type="number"]');
  await velden.nth(1).fill('6.2');   // pH
  await velden.nth(2).fill('2');     // KH
  await velden.nth(4).fill('0.8');   // NO2
  await page.waitForTimeout(400);
  await page.waitForSelector('text=Voorgestelde acties', { timeout: 3000 });
});
await stap('meting opslaan', async () => {
  await page.getByRole('button', { name: /Meting opslaan/ }).click();
  await page.waitForSelector('.dialoog', { timeout: 4000 });
  await page.getByRole('button', { name: 'Naar startscherm' }).click();
  await page.waitForTimeout(600);
});
await stap('score op startscherm', async () => {
  await page.waitForSelector('.ring', { timeout: 3000 });
  const tekst = await page.locator('#scherm').innerText();
  if (!/Actie nodig|Even bijsturen/.test(tekst)) throw new Error('geen beoordeling getoond');
});
await stap('historiek met grafiek', async () => {
  await page.goto(`${BASIS}#/historiek`);
  await page.waitForTimeout(600);
  await page.waitForSelector('.tabbalk .chip', { timeout: 3000 });
});
await stap('vis toevoegen', async () => {
  await page.goto(`${BASIS}#/bak`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: '+ Toevoegen' }).click();
  await page.waitForSelector('.dialoog');
  await page.locator('.dialoog input').first().fill('Neonzalm');
  await page.locator('.dialoog input[type="number"]').fill('12');
  await page.locator('.dialoog__voet .knop', { hasText: 'Bewaren' }).click();
  await page.waitForTimeout(700);
  await page.waitForSelector('text=12× Neonzalm', { timeout: 3000 });
});
await stap('producten met dosering', async () => {
  await page.goto(`${BASIS}#/producten`);
  await page.waitForTimeout(500);
  const tekst = await page.locator('#scherm').innerText();
  if (!/Aqua Start/.test(tekst)) throw new Error('catalogus leeg');

  /* Aqua Start doseert op VERS water, niet op de bakinhoud. Ziet de klant hier
     de liters van zijn hele bak, dan overdoseert hij drie keer. */
  await page.locator('.klikbaar', { hasText: 'Aqua Start' }).first().click();
  await page.waitForSelector('.dialoog');
  const dosis = await page.locator('.dialoog').innerText();
  if (!/ml/.test(dosis)) throw new Error('geen dosering berekend');
  if (!/liter vers water/.test(dosis)) throw new Error('de dosering rekent niet op vers water');
  await page.locator('.dialoog .icoonknop').click();

  /* Fresh Bacto heeft twee doseringen: opstart en onderhoud. Allebei tonen, of
     de klant doseert de opstartdosis elke week. */
  await page.locator('.klikbaar', { hasText: 'Fresh Bacto' }).first().click();
  await page.waitForSelector('.dialoog');
  const twee = await page.locator('.dialoog').innerText();
  if (!/opstart/i.test(twee) || !/onderhoud/i.test(twee)) {
    throw new Error('de tweede dosering ontbreekt: ' + twee.slice(0, 200));
  }
  await page.locator('.dialoog .icoonknop').click();

  /* Black Water wisselt van basis: bij de start op de bak, daarna op vers water.
     Beide getallen moeten naast elkaar staan, met hun eigen volume erbij. */
  await page.locator('.klikbaar', { hasText: 'Black Water' }).first().click();
  await page.waitForSelector('.dialoog');
  const gemengd = await page.locator('.dialoog').innerText();
  if (!/bakinhoud/i.test(gemengd) || !/vers water/i.test(gemengd)) {
    throw new Error('Black Water toont de twee basissen niet: ' + gemengd.slice(0, 250));
  }
  await page.locator('.dialoog .icoonknop').click();

  /* Filterpads gaan met sprongen en mogen nooit een kommagetal tonen. */
  await page.locator('.klikbaar', { hasText: 'Nitro Stop' }).first().click();
  await page.waitForSelector('.dialoog');
  const pads = await page.locator('.dialoog').innerText();
  if (!/\d+ pads?/.test(pads)) throw new Error('geen aantal pads: ' + pads.slice(0, 200));
  if (/\d+[.,]\d+ pad/.test(pads)) throw new Error('halve pad in de dosering: ' + pads.slice(0, 200));
  await page.locator('.dialoog .icoonknop').click();
});
await stap('hulpvraag aanmaken', async () => {
  await page.goto(`${BASIS}#/hulp`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Huisbezoek voor advies/ }).click();
  await page.waitForSelector('.dialoog');
  await page.locator('.dialoog textarea').first().fill('Water is troebel sinds een week.');
  await page.getByRole('button', { name: 'Doorgaan' }).click();
  await page.waitForTimeout(800);
  await page.waitForSelector('text=Hoe stuurt u dit door', { timeout: 4000 });
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.waitForTimeout(600);
});
await stap('kennisbank', async () => {
  await page.goto(`${BASIS}#/kennis`);
  await page.waitForTimeout(400);
  await page.locator('.klikbaar', { hasText: 'Een nieuwe bak indraaien' }).click();
  await page.waitForSelector('.dialoog');
  await page.locator('.dialoog .icoonknop').click();
});
await stap('beheer + aanmelden als LUX AQUA', async () => {
  await page.goto(`${BASIS}#/beheer`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Aanmelden' }).click();
  await page.waitForTimeout(600);
  await page.locator('input[type="password"]').fill('Beau*1412');
  await page.getByRole('button', { name: 'Aanmelden' }).click();
  await page.waitForTimeout(1600);
  const tekst = await page.locator('#scherm').innerText();
  if (!/Klanten/.test(tekst)) throw new Error('klantenscherm niet geladen');
  if (!/Test Klant/.test(tekst)) throw new Error('klant niet zichtbaar in beheer');
});
await stap('hulpvragen-inbox', async () => {
  await page.goto(`${BASIS}#/hulpvragen`);
  await page.waitForTimeout(500);
  const tekst = await page.locator('#scherm').innerText();
  if (!/Huisbezoek/.test(tekst)) throw new Error('hulpvraag niet in inbox');
});
await stap('klantdetail', async () => {
  await page.goto(`${BASIS}#/klanten`);
  await page.waitForTimeout(500);
  await page.locator('.klikbaar', { hasText: 'Test Klant' }).first().click();
  await page.waitForTimeout(700);
  await page.locator('summary', { hasText: 'Installatie en vissenbestand' }).click();
  await page.waitForTimeout(200);
  const tekst = await page.locator('#scherm').innerText();
  if (!/Neonzalm/.test(tekst)) throw new Error('vissenbestand niet zichtbaar bij LUX AQUA');
  if (!/Laatste meting/.test(tekst)) throw new Error('meting niet zichtbaar bij LUX AQUA');
});


await browser.close();
console.log('\n--- fouten ---');
console.log(fouten.length ? fouten.join('\n') : 'geen');
process.exit(fouten.length ? 1 : 0);
