/**
 * Striptest: de webtak van kiesFoto (bestandskiezer) en de analyse van een synthetische teststrip.
 * Draaien: APP_URL=http://127.0.0.1:8123/index.html node test/strip-test.mjs
 * Playwright wordt gezocht via PLAYWRIGHT_PAD of de globale npm-map.
 */
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { maakStrip } from './maak-strip.mjs';

const { chromium } = await import(process.env.PLAYWRIGHT_PAD || '/opt/node22/lib/node_modules/playwright/index.mjs');

// twee strips in de volgorde van de 6-in-1-strip (no3, no2, gh, kh, ph, cl2), kleuren uit js/params.js
const S = mkdtempSync(join(tmpdir(), 'luxaqua-strip-'));
writeFileSync(join(S, 'strip-vuil.png'), maakStrip(['#f2b79b', '#ef9fb8', '#c8d68d', '#c2d67f', '#c3cd62', '#e2aecd']));
writeFileSync(join(S, 'strip-gezond.png'), maakStrip(['#fdf2e0', '#fdf6e8', '#c8d68d', '#c2d67f', '#c3cd62', '#fdfaf0']));
const BASIS = process.env.APP_URL || 'http://127.0.0.1:8123/index.html';
const fouten = [];
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
let verwachteFout = false; // de laatste stap logt bewust een console.error (ongeldig bestand)
page.on('console', (m) => { if (m.type() === 'error' && !verwachteFout) fouten.push('console: ' + m.text()); });
page.on('pageerror', (e) => fouten.push('pageerror: ' + e.message));
page.setDefaultTimeout(5000);

const stap = async (naam, fn) => {
  try { const r = await fn(); console.log('✓', naam, r ? '→ ' + r : ''); }
  catch (e) { console.log('✗', naam, '→', e.message.split('\n')[0]); fouten.push(`${naam}: ${e.message.split('\n')[0]}`); }
};

await page.goto(BASIS);
await page.waitForTimeout(600);
await stap('onboarding doorlopen', async () => {
  await page.getByRole('button', { name: 'Beginnen' }).click();
  await page.getByText('Ik ben klant').click();
  await page.locator('input[autocomplete="name"]').fill('Strip Tester');
  await page.locator('input[autocomplete="tel"]').fill('0470 00 00 00');
  await page.getByRole('button', { name: 'Volgende' }).click();
  const nums = page.locator('input[type="number"]');
  await nums.nth(0).fill('100'); await nums.nth(1).fill('40'); await nums.nth(2).fill('50');
  await page.waitForTimeout(150);
  await page.getByRole('button', { name: 'Volgende' }).click();
  await page.getByRole('button', { name: /Klaar, start de app/ }).click();
  await page.waitForTimeout(500);
});

await page.goto(`${BASIS}#/meten`);
await page.waitForTimeout(500);

await stap('geen zichtbare bestandsinvoer op het Meten-scherm', async () => {
  const n = await page.locator('input[type="file"]').count();
  if (n !== 0) throw new Error(`${n} input[type=file] in de DOM (verwacht 0: kiesFoto maakt hem tijdelijk aan)`);
});

let kiezer;
await stap('fotoknop opent de bestandskiezer synchroon (filechooser-event)', async () => {
  [kiezer] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /Foto nemen of kiezen/ }).click(),
  ]);
  const el = kiezer.element();
  const accept = await el.getAttribute('accept');
  const capture = await el.getAttribute('capture');
  const multiple = kiezer.isMultiple();
  return `accept=${accept} capture=${capture} multiple=${multiple}`;
});

const PARAMS = ['temp', 'ph', 'kh', 'gh', 'no2', 'no3', 'nh4', 'cl2', 'po4'];
const leesFormulier = async () => {
  const velden = page.locator('#scherm input[type="number"]');
  const uit = {};
  for (let i = 0; i < PARAMS.length; i++) uit[PARAMS[i]] = await velden.nth(i).inputValue();
  return uit;
};
const leesRijen = async () => {
  const rijen = page.locator('.stripveld');
  const n = await rijen.count();
  const uit = [];
  for (let i = 0; i < n; i++) uit.push((await rijen.nth(i).innerText()).replace(/\s+/g, ' ').trim());
  return uit;
};

const controleer = (form, verwacht, tolerantie) => {
  const problemen = [];
  for (const [id, v] of Object.entries(verwacht)) {
    const w = Number(form[id]);
    if (form[id] === '' || Number.isNaN(w)) problemen.push(`${id}: leeg`);
    else if (Math.abs(w - v) > tolerantie[id]) problemen.push(`${id}: ${w} (verwacht ≈ ${v})`);
  }
  if (problemen.length) throw new Error(problemen.join('; '));
};

await stap('strip "vuil" uploaden en analyseren', async () => {
  await kiezer.setFiles(`${S}/strip-vuil.png`);
  await page.waitForSelector('.stripdoek canvas', { timeout: 6000 });
  await page.waitForSelector('text=Wat de app afleest');
  await page.waitForTimeout(300);
  const tekst = await page.locator('#scherm').innerText();
  const gevonden = /testveldjes zijn automatisch gevonden/.test(tekst);
  const rijen = await leesRijen();
  console.log('   rijen:', JSON.stringify(rijen, null, 0));
  if (rijen.length !== 6) throw new Error(`${rijen.length} veldrijen (verwacht 6)`);
  if (!gevonden) throw new Error('melding "automatisch gevonden" ontbreekt (terugval op gelijke verdeling)');
  return `6 veldjes, automatisch gevonden`;
});

await stap('tijdelijke bestandsinvoer is weer uit de DOM', async () => {
  await page.waitForTimeout(100);
  const n = await page.locator('input[type="file"]').count();
  if (n !== 0) throw new Error(`${n} input[type=file] blijft staan`);
});

await stap('waarden staan in het formulier (strip vuil)', async () => {
  const form = await leesFormulier();
  console.log('   formulier:', JSON.stringify(form));
  const badges = await page.locator('#scherm .badge', { hasText: /^strip$/ }).count();
  // verwacht: no3 25, no2 1, gh 8, kh 6, ph 7.2, cl2 1; toegelaten afwijking = 1 kaartstaal
  controleer(form, { no3: 25, no2: 1, gh: 8, kh: 6, ph: 7.2, cl2: 1 }, { no3: 25, no2: 2, gh: 4, kh: 4, ph: 0.4, cl2: 2 });
  if (form.temp !== '' || form.nh4 !== '' || form.po4 !== '') throw new Error('niet-gemeten velden zijn toch ingevuld: ' + JSON.stringify(form));
  if (badges !== 6) throw new Error(`${badges} strip-badges (verwacht 6)`);
  return `6 strip-badges, waarden ${JSON.stringify({ no3: form.no3, no2: form.no2, gh: form.gh, kh: form.kh, ph: form.ph, cl2: form.cl2 })}`;
});

await stap('live advies verschijnt na de analyse', async () => {
  await page.waitForSelector('text=Voorgestelde acties', { timeout: 3000 });
});

await stap('betrouwbaarheid per veld', async () => {
  const rijen = await leesRijen();
  const laag = rijen.filter((r) => /Zwakke/.test(r));
  if (laag.length) throw new Error('zwakke overeenkomst bij: ' + laag.join(' | '));
  return rijen.map((r) => (r.match(/\((\d+)%\)/) || [])[1] + '%').join(' ');
});

await stap('annuleren van de kiezer ("Nieuwe foto" + cancel-event) laat de analyse staan', async () => {
  const voor = await leesFormulier();
  const [k2] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /Nieuwe foto/ }).click(),
  ]);
  const n1 = await page.locator('input[type="file"]').count();
  await page.evaluate(() => { const i = document.querySelector('input[type="file"]'); i.dispatchEvent(new Event('cancel')); });
  await page.waitForTimeout(200);
  const n2 = await page.locator('input[type="file"]').count();
  const na = await leesFormulier();
  if (n1 !== 1) throw new Error(`tijdens kiezen ${n1} inputs`);
  if (n2 !== 0) throw new Error(`na annuleren blijft input staan (${n2})`);
  if (JSON.stringify(voor) !== JSON.stringify(na)) throw new Error('formulier veranderd na annuleren');
  if (!(await page.locator('.stripdoek canvas').count())) throw new Error('stripdoek verdwenen');
  void k2;
});

await stap('"Volgorde omkeren" en "Opnieuw zoeken" werken', async () => {
  await page.getByRole('button', { name: /Volgorde omkeren/ }).click();
  await page.waitForTimeout(300);
  const omgekeerd = await leesFormulier();
  await page.getByRole('button', { name: /Volgorde omkeren/ }).click();
  await page.waitForTimeout(300);
  await page.getByRole('button', { name: /Opnieuw zoeken/ }).click();
  await page.waitForTimeout(300);
  const terug = await leesFormulier();
  if (omgekeerd.no3 === terug.no3 && omgekeerd.cl2 === terug.cl2) throw new Error('omkeren veranderde niets');
  return `omgekeerd no3=${omgekeerd.no3} cl2=${omgekeerd.cl2}; terug no3=${terug.no3} cl2=${terug.cl2}`;
});

await stap('strip "gezond" (drie bijna-witte velden) via "Nieuwe foto"', async () => {
  const [k3] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /Nieuwe foto/ }).click(),
  ]);
  await k3.setFiles(`${S}/strip-gezond.png`);
  await page.waitForTimeout(800);
  const tekst = await page.locator('#scherm').innerText();
  const gevonden = /testveldjes zijn automatisch gevonden/.test(tekst);
  const rijen = await leesRijen();
  console.log('   rijen:', JSON.stringify(rijen, null, 0));
  const form = await leesFormulier();
  console.log('   formulier:', JSON.stringify(form));
  // verwacht: no3 0, no2 0, gh 8, kh 6, ph 7.2, cl2 0
  controleer(form, { no3: 0, no2: 0, gh: 8, kh: 6, ph: 7.2, cl2: 0 }, { no3: 10, no2: 0.5, gh: 4, kh: 4, ph: 0.4, cl2: 0.5 });
  return `automatisch gevonden=${gevonden}`;
});

await stap('meting met stripfoto opslaan', async () => {
  await page.getByRole('button', { name: /Meting opslaan/ }).click();
  await page.waitForSelector('.dialoog', { timeout: 5000 });
  await page.getByRole('button', { name: 'Naar startscherm' }).click();
  await page.waitForTimeout(600);
});

await stap('stripfoto staat bij de bak (foto opgeslagen)', async () => {
  await page.goto(`${BASIS}#/bak`);
  await page.waitForTimeout(700);
  const tekst = await page.locator('#scherm').innerText();
  const imgs = await page.locator('#scherm img').count();
  if (!/Teststrip/.test(tekst) && imgs === 0) throw new Error('geen stripfoto zichtbaar bij de bak');
  return `${imgs} afbeelding(en), Teststrip-notitie ${/Teststrip/.test(tekst) ? 'zichtbaar' : 'niet zichtbaar'}`;
});

await stap('historiek toont de meting met stripbron', async () => {
  await page.goto(`${BASIS}#/historiek`);
  await page.waitForTimeout(700);
  const tekst = await page.locator('#scherm').innerText();
  if (!/strip/i.test(tekst)) throw new Error('geen verwijzing naar strip in historiek');
});

await stap('ongeldig bestand geeft nette foutmelding', async () => {
  verwachteFout = true;
  await page.goto(`${BASIS}#/meten`);
  await page.waitForTimeout(500);
  const [k4] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: /Foto nemen of kiezen/ }).click(),
  ]);
  await k4.setFiles({ name: 'kapot.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('dit is geen afbeelding') });
  await page.waitForSelector('text=Analyse mislukt', { timeout: 4000 });
  const n = await page.locator('input[type="file"]').count();
  if (n !== 0) throw new Error('input blijft staan na fout');
});

await browser.close();
console.log('\n--- fouten ---');
console.log(fouten.length ? fouten.join('\n') : 'geen');
process.exit(fouten.length ? 1 : 0);
