/**
 * Maakt echte schermafbeeldingen van de draaiende app voor Play Console en
 * App Store Connect. Geen mockups: dit is de app zelf, met representatieve
 * voorbeeldgegevens, gefotografeerd op de vereiste formaten.
 *
 * Gebruik: start eerst een webserver in de projectmap (poort 8123), dan
 *   APP_URL=http://127.0.0.1:8123/index.html node test/maak-screenshots.mjs
 *
 * Play Console (telefoon): minstens 2, tot 8 screenshots, JPEG/PNG.
 * App Store Connect (6,7" iPhone, verplicht): exact 1290x2796.
 *
 * Het echte toestel wordt nagebootst met zijn logische (CSS-)afmeting en
 * pixelverhouding, niet met de fysieke pixelmaat rechtstreeks als CSS-
 * viewport: anders rendert de mobielgerichte layout als een klein eilandje
 * op een veel te brede pagina.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'node:fs';

const BASIS = process.env.APP_URL || 'http://127.0.0.1:8123/index.html';
const UIT = 'winkelmateriaal/screenshots';
fs.mkdirSync(`${UIT}/android`, { recursive: true });
fs.mkdirSync(`${UIT}/ios`, { recursive: true });

const FORMATEN = [
  { map: 'android', naam: 'telefoon (Pixel-formaat)', breedte: 412, hoogte: 915, dsf: 2.625 },   // -> ±1081x2402
  { map: 'ios', naam: 'iphone-6.7', breedte: 430, hoogte: 932, dsf: 3 },                          // -> exact 1290x2796
];

async function zetVoorbeeldgegevensKlaar(page) {
  // Onboarding doorlopen met representatieve, herkenbare voorbeeldgegevens.
  await page.goto(BASIS);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: 'Beginnen' }).click();
  await page.getByText('Ik ben klant').click();
  await page.locator('input[autocomplete="name"]').fill('Familie Peeters');
  await page.getByRole('button', { name: 'Volgende' }).click();
  const nums = page.locator('input[type="number"]');
  await nums.nth(0).fill('120'); await nums.nth(1).fill('50'); await nums.nth(2).fill('50');
  await page.waitForTimeout(150);
  await page.getByRole('button', { name: 'Volgende' }).click();
  await page.getByRole('button', { name: /Klaar, start de app/ }).click();
  await page.waitForTimeout(400);

  // Een meting ingeven zodat het startscherm en de historiek gevulde schermen tonen.
  await page.goto(`${BASIS}#/meten`);
  await page.waitForTimeout(300);
  const velden = page.locator('#scherm input[type="number"]');
  await velden.nth(0).fill('25');   // temp
  await velden.nth(1).fill('7.2'); // ph
  await velden.nth(2).fill('7');   // kh
  await velden.nth(3).fill('9');   // gh
  await velden.nth(5).fill('20');  // no3
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: /Meting opslaan/ }).click();
  await page.waitForSelector('.dialoog', { timeout: 6000 });
  await page.getByRole('button', { name: 'Naar startscherm' }).click();
  await page.waitForTimeout(500);

  // Een vis toevoegen zodat "Mijn bak" niet leeg oogt.
  await page.goto(`${BASIS}#/bak`);
  await page.waitForTimeout(400);
  await page.getByRole('button', { name: '+ Toevoegen' }).click();
  await page.waitForSelector('.dialoog');
  await page.locator('.dialoog input').first().fill('Neonzalm');
  await page.locator('.dialoog input[type="number"]').fill('10');
  await page.locator('.dialoog__voet .knop', { hasText: 'Bewaren' }).click();
  await page.waitForTimeout(4500); // laat de "Bewaard."-melding volledig wegdoven vóór de eerste opname
}

async function maakSchermafbeelding(page, pad, route) {
  await page.goto(`${BASIS}#/${route}`);
  await page.waitForTimeout(600);
  await page.screenshot({ path: pad });
  console.log('geschreven:', pad);
}

const browser = await chromium.launch();
for (const f of FORMATEN) {
  const page = await browser.newPage({
    viewport: { width: f.breedte, height: f.hoogte },
    deviceScaleFactor: f.dsf,
    isMobile: true,
    hasTouch: true,
  });
  page.setDefaultTimeout(8000);
  await zetVoorbeeldgegevensKlaar(page);
  await maakSchermafbeelding(page, `${UIT}/${f.map}/01-start.png`, 'start');
  await maakSchermafbeelding(page, `${UIT}/${f.map}/02-mijn-bak.png`, 'bak');
  await maakSchermafbeelding(page, `${UIT}/${f.map}/03-historiek.png`, 'historiek');
  await maakSchermafbeelding(page, `${UIT}/${f.map}/04-producten.png`, 'producten');
  await maakSchermafbeelding(page, `${UIT}/${f.map}/05-hulp.png`, 'hulp');
  await page.close();
}
await browser.close();
console.log('Klaar. Screenshots in winkelmateriaal/screenshots/.');
