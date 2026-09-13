/**
 * Test voor de aanmelding van de beheerder.
 * Gebruik: APP_URL=http://127.0.0.1:8130/index.html node test/auth-test.mjs
 *
 * Aanmelden gebruikt crypto.subtle en dat bestaat enkel op een beveiligde
 * verbinding. 127.0.0.1 telt als beveiligd, een gewoon http-adres niet: slaagt
 * deze test lokaal maar niet op de host, dan staat de app daar niet op https.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const fouten = [];
const BASIS = process.env.APP_URL || 'http://127.0.0.1:8130/index.html';
const WACHTWOORD = 'Beau*1412';

const stap = async (naam, fn) => {
  try { await fn(); console.log('✓', naam); }
  catch (e) { console.log('✗', naam, '→', e.message.split('\n')[0]); fouten.push(`${naam}: ${e.message.split('\n')[0]}`); }
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('console', (m) => { if (m.type() === 'error') fouten.push('console: ' + m.text()); });
page.on('pageerror', (e) => fouten.push('pageerror: ' + e.message));
page.setDefaultTimeout(6000);

await page.goto(BASIS);
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'Beginnen' }).click();
await page.getByText('Ik ben klant').click();
await page.locator('input[autocomplete="name"]').fill('Test Klant');
await page.locator('input[autocomplete="tel"]').fill('0470 12 34 56');
await page.getByRole('button', { name: 'Volgende' }).click();
const nums = page.locator('input[type="number"]');
await nums.nth(0).fill('120'); await nums.nth(1).fill('50'); await nums.nth(2).fill('55');
await page.waitForTimeout(150);
await page.getByRole('button', { name: 'Volgende' }).click();
await page.getByRole('button', { name: /Klaar, start de app/ }).click();
await page.waitForTimeout(400);
// Na de onboarding verschijnt het kennismakingsbericht vanzelf, bovenop het
// (al zichtbare) startscherm. Sluiten via zijn eigen knop, niet forceren: het
// forceren van een overlay in andere tests brak een bewust openblijvende dialoog.
await page.getByRole('button', { name: 'Overslaan' }).click();
await page.waitForTimeout(600);

await stap('crypto.subtle is beschikbaar', async () => {
  const kan = await page.evaluate(async () => (await import('./js/auth.js')).kanAanmelden());
  if (!kan) throw new Error('crypto.subtle ontbreekt, de verbinding is niet beveiligd');
});

await stap('de klantenlijst stuurt door naar het aanmeldscherm', async () => {
  await page.evaluate(() => { location.hash = '#/klanten'; });
  await page.waitForTimeout(800);
  const tekst = await page.locator('#scherm').innerText();
  if (!/Aanmelden als LUX AQUA/.test(tekst)) throw new Error('geen aanmeldscherm, wel: ' + tekst.slice(0, 80));
});

await stap('een verkeerd wachtwoord wordt geweigerd', async () => {
  await page.locator('input[type="password"]').fill('fout wachtwoord');
  await page.getByRole('button', { name: 'Aanmelden' }).click();
  await page.waitForTimeout(1200);
  const tekst = await page.locator('#scherm').innerText();
  if (!/klopt niet/.test(tekst)) throw new Error('geen foutmelding bij een verkeerd wachtwoord');
});

await stap('een verkeerd e-mailadres wordt geweigerd', async () => {
  const r = await page.evaluate(async (ww) => {
    const a = await import('./js/auth.js');
    return a.meldAan('iemandanders@example.com', ww);
  }, WACHTWOORD);
  if (r.ok) throw new Error('een onbekend e-mailadres werd aanvaard');
});

await stap('het juiste wachtwoord meldt aan', async () => {
  await page.locator('input[type="password"]').fill(WACHTWOORD);
  await page.getByRole('button', { name: 'Aanmelden' }).click();
  await page.waitForTimeout(1600);
  const tekst = await page.locator('#scherm').innerText();
  if (!/Test Klant/.test(tekst)) throw new Error('klantenlijst niet geladen na aanmelden');
});

await stap('de beheerderskant toont de spaarkaartcodes', async () => {
  await page.evaluate(() => { location.hash = '#/beheer'; });
  await page.waitForTimeout(900);
  if (!(await page.locator('.winkelcode').count())) throw new Error('winkelcode niet zichtbaar voor de beheerder');
});

await stap('een verlopen aanmelding valt terug op klantmodus', async () => {
  await page.evaluate(async () => {
    const s = await import('./js/store.js');
    await s.zetInstelling({ aangemeldTot: Date.now() - 1000 });
    location.hash = '#/start';
  });
  await page.waitForTimeout(700);
  const rol = await page.evaluate(async () => (await (await import('./js/store.js')).instellingen()).rol);
  if (rol !== 'klant') throw new Error('rol is nog steeds ' + rol);
  await page.evaluate(() => { location.hash = '#/beheer'; });
  await page.waitForTimeout(800);
  if (await page.locator('.winkelcode').count()) throw new Error('de winkelcode is zichtbaar zonder aanmelding');
});

await stap('afmelden zet de rol terug', async () => {
  await page.evaluate(async (ww) => {
    const a = await import('./js/auth.js');
    await a.meldAan('luxhelchteren@gmail.com', ww);
    await a.meldAf();
  }, WACHTWOORD);
  const rol = await page.evaluate(async () => (await (await import('./js/store.js')).instellingen()).rol);
  if (rol !== 'klant') throw new Error('rol na afmelden is ' + rol);
});

await stap('een te kort nieuw wachtwoord wordt geweigerd', async () => {
  const r = await page.evaluate(async (ww) => {
    const a = await import('./js/auth.js');
    return a.wijzigWachtwoord(ww, 'kort');
  }, WACHTWOORD);
  if (r.ok) throw new Error('een wachtwoord van vier tekens werd aanvaard');
});

await stap('wachtwoord wijzigen werkt, het oude vervalt', async () => {
  const nieuw = 'drie blauwe vissen zwemmen';
  const r = await page.evaluate(async ([oud, nw]) => {
    const a = await import('./js/auth.js');
    const gewijzigd = await a.wijzigWachtwoord(oud, nw);
    const metOud = await a.meldAan('luxhelchteren@gmail.com', oud);
    const metNieuw = await a.meldAan('luxhelchteren@gmail.com', nw);
    return { gewijzigd: gewijzigd.ok, metOud: metOud.ok, metNieuw: metNieuw.ok };
  }, [WACHTWOORD, nieuw]);
  if (!r.gewijzigd) throw new Error('wijzigen mislukte');
  if (r.metOud) throw new Error('het oude wachtwoord werkt nog');
  if (!r.metNieuw) throw new Error('het nieuwe wachtwoord werkt niet');
});

console.log('\n--- fouten ---');
console.log(fouten.length ? fouten.join('\n') : 'geen');
await browser.close();
process.exit(fouten.length ? 1 : 0);
