/**
 * Test voor de spaarkaart: winkelcode, één token per dag, omzetten in korting,
 * annuleren en de beheerscode.
 *
 * Gebruik: start een webserver in de projectmap en run
 *   APP_URL=http://127.0.0.1:8130/index.html node test/spaar-test.mjs
 *
 * De test rekent de codes van vandaag zelf uit met dezelfde formule als de app,
 * zodat hij ook morgen nog slaagt. Zou de formule in js/spaarkaart.js wijzigen
 * zonder dat deze test meewijzigt, dan valt hij meteen door de mand.
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const fouten = [];
const BASIS = process.env.APP_URL || 'http://127.0.0.1:8130/index.html';

const stap = async (naam, fn) => {
  try { await fn(); console.log('✓', naam); }
  catch (e) { console.log('✗', naam, '→', e.message.split('\n')[0]); fouten.push(`${naam}: ${e.message.split('\n')[0]}`); }
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('console', (m) => { if (m.type() === 'error') fouten.push('console: ' + m.text()); });
page.on('pageerror', (e) => fouten.push('pageerror: ' + e.message));
page.setDefaultTimeout(5000);

await page.goto(BASIS);
await page.waitForTimeout(600);

/* --- onboarding doorlopen, want zonder bak start de app niet --- */
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
await page.waitForTimeout(500);

/* De codes komen uit de app zelf: de test leest de module in, hij kopieert de
   formule niet. Zo kan de test niet stilletjes uit de pas lopen met de app. */
const codes = await page.evaluate(async () => {
  const m = await import('./js/spaarkaart.js');
  return { winkel: m.winkelcode(), beheer: m.beheercode(), gisteren: m.winkelcode(Date.now() - 86400e3) };
});

/* Eerst naar start en dan pas naar sparen: staat de hash al op #/spaar, dan
   vuurt hashchange niet en blijft het oude scherm staan. In de app zelf gebeurt
   dat niet, want elke wijziging roept teken() aan, maar deze test wijzigt de
   database rechtstreeks. */
const naarSpaar = async () => {
  await page.evaluate(() => { location.hash = '#/start'; });
  await page.waitForTimeout(250);
  await page.evaluate(() => { location.hash = '#/spaar'; });
  await page.waitForTimeout(500);
};
const tokenstand = () => page.locator('.spaarstand__cijfer strong').innerText();

await stap('spaarkaart opent en staat op nul', async () => {
  await naarSpaar();
  const n = await tokenstand();
  if (n.trim() !== '0') throw new Error('verwacht 0, kreeg ' + n);
});

await stap('verkeerde code wordt geweigerd', async () => {
  await page.getByRole('button', { name: /Ik ben in de winkel/ }).click();
  await page.waitForTimeout(250);
  await page.locator('.dialoog input').fill('XXXXXX');
  await page.getByRole('button', { name: 'Token sparen' }).click();
  await page.waitForTimeout(250);
  const tekst = await page.locator('.dialoog').innerText();
  if (!/klopt niet/i.test(tekst)) throw new Error('geen foutmelding bij een verkeerde code');
});

await stap('juiste code geeft een token', async () => {
  await page.locator('.dialoog input').fill(codes.winkel);
  await page.getByRole('button', { name: 'Token sparen' }).click();
  await page.waitForTimeout(600);
  const n = await tokenstand();
  if (n.trim() !== '1') throw new Error('verwacht 1, kreeg ' + n);
});

await stap('tweede keer op dezelfde dag lukt niet', async () => {
  const knop = page.getByRole('button', { name: /Vandaag al gespaard/ });
  if (!(await knop.count())) throw new Error('de knop staat niet op "Vandaag al gespaard"');
  if (!(await knop.first().isDisabled())) throw new Error('de knop is niet uitgeschakeld');
});

await stap('code van gisteren blijft één dag geldig', async () => {
  if (codes.gisteren === codes.winkel) throw new Error('de code van gisteren is gelijk aan die van vandaag');
  const r = await page.evaluate(async (code) => {
    const m = await import('./js/spaarkaart.js');
    const db = await import('./js/db.js');
    const k = await db.get('spaarkaart', 'kaart');
    await db.put('spaarkaart', { ...k, laatsteScan: Date.now() - 2 * 86400e3 }); // doe alsof het bezoek van eergisteren was
    return m.voegTokenToe(code);
  }, codes.gisteren);
  if (!r.ok) throw new Error('code van gisteren geweigerd: ' + r.reden);
});

await stap('tokens bijschrijven met de beheerscode', async () => {
  const r = await page.evaluate(async (code) => {
    const m = await import('./js/spaarkaart.js');
    await m.bijschrijven(8, code);           // 2 gespaard + 8 = 10, de eerste trede
    return (await m.haalKaart()).tokens;
  }, codes.beheer);
  if (r !== 10) throw new Error('verwacht 10 tokens, kreeg ' + r);
});

await stap('bijschrijven met een foute beheerscode lukt niet', async () => {
  const r = await page.evaluate(async () => {
    const m = await import('./js/spaarkaart.js');
    return m.bijschrijven(100, 'ZZZZ');
  });
  if (r.ok) throw new Error('een foute beheerscode werd aanvaard');
});

await stap('bij 10 tokens verschijnt de keuze', async () => {
  await naarSpaar();
  const tekst = await page.locator('#scherm').innerText();
  if (!/U kiest zelf/.test(tekst)) throw new Error('het keuzeblok ontbreekt');
  if (!/5 procent korting nu/.test(tekst)) throw new Error('de trede van 5 procent ontbreekt');
  if (/10 procent korting nu/.test(tekst)) throw new Error('een trede die nog niet behaald is, wordt toch aangeboden');
});

await stap('omzetten verbruikt de tokens en geeft een bon', async () => {
  await page.getByRole('button', { name: /5 procent korting nu/ }).click();
  await page.waitForTimeout(250);
  await page.getByRole('button', { name: 'Omzetten in korting' }).click();
  await page.waitForTimeout(700);
  const n = await tokenstand();
  if (n.trim() !== '0') throw new Error('tokens niet verbruikt, stand is ' + n);
  const bon = await page.locator('.spaarbon__bon').innerText();
  if (!/^Bon 5-/.test(bon)) throw new Error('geen bruikbaar bonnummer: ' + bon);
  const procent = await page.locator('.spaarbon__procent').innerText();
  if (procent.trim() !== '5%') throw new Error('verkeerd percentage: ' + procent);
});

await stap('annuleren geeft de tokens terug', async () => {
  await page.getByRole('button', { name: /Toch niet, zet terug/ }).click();
  await page.waitForTimeout(700);
  const n = await tokenstand();
  if (n.trim() !== '10') throw new Error('tokens niet teruggezet, stand is ' + n);
});

await stap('doorsparen naar een hogere trede kan', async () => {
  const r = await page.evaluate(async (code) => {
    const m = await import('./js/spaarkaart.js');
    await m.bijschrijven(15, code);           // 10 + 15 = 25, de tweede trede
    const uit = await m.verzilver(10);
    return { ok: uit.ok, tokens: (await m.haalKaart()).tokens, procent: (await m.haalKaart()).korting?.procent };
  }, codes.beheer);
  if (!r.ok) throw new Error('omzetten naar 10 procent mislukte');
  if (r.tokens !== 0) throw new Error('verwacht 0 tokens over, kreeg ' + r.tokens);
  if (r.procent !== 10) throw new Error('verwacht 10 procent, kreeg ' + r.procent);
});

await stap('een tweede korting naast de eerste kan niet', async () => {
  const r = await page.evaluate(async (code) => {
    const m = await import('./js/spaarkaart.js');
    await m.bijschrijven(20, code);
    return m.verzilver(5);
  }, codes.beheer);
  if (r.ok) throw new Error('twee kortingen tegelijk werden aanvaard');
});

await stap('kaart op nul zetten met de beheerscode', async () => {
  const r = await page.evaluate(async (code) => {
    const m = await import('./js/spaarkaart.js');
    await m.resetKaart(code);
    const k = await m.haalKaart();
    return { tokens: k.tokens, korting: k.korting };
  }, codes.beheer);
  if (r.tokens !== 0 || r.korting) throw new Error('kaart niet leeg: ' + JSON.stringify(r));
});

await stap('vervallen tokens verdwijnen na de vervaltermijn', async () => {
  const r = await page.evaluate(async (code) => {
    const m = await import('./js/spaarkaart.js');
    const db = await import('./js/db.js');
    await m.bijschrijven(20, code);
    const k = await db.get('spaarkaart', 'kaart');
    await db.put('spaarkaart', { ...k, laatsteScan: Date.now() - 400 * 86400e3 });
    return (await m.haalKaart()).tokens;
  }, codes.beheer);
  if (r !== 0) throw new Error('tokens niet vervallen, stand is ' + r);
});

await stap('winkelcode staat in de beheerstab van LUX AQUA', async () => {
  /* Aanmelden zoals de winkel het doet: rol rechtstreeks zetten werkt niet meer,
     want een aanmelding zonder geldigheidsduur valt vanzelf terug op klantmodus. */
  const aan = await page.evaluate(async () => {
    const a = await import('./js/auth.js');
    return a.meldAan('luxhelchteren@gmail.com', 'Beau*1412');
  });
  if (!aan.ok) throw new Error('aanmelden mislukte: ' + aan.reden);
  await page.evaluate(() => { location.hash = '#/beheer'; });
  await page.waitForTimeout(900);
  const code = await page.locator('.winkelcode').innerText();
  if (code.trim() !== codes.winkel) throw new Error(`beheerstab toont ${code.trim()}, verwacht ${codes.winkel}`);
});

await stap('trap omzetten naar het rustige tempo en terug', async () => {
  await page.getByRole('button', { name: /Rustig tempo/ }).click();
  await page.waitForTimeout(700);
  let r = await page.evaluate(async () => (await (await import('./js/spaarkaart.js')).spaarInstellingen()).trap);
  if (r[0].tokens !== 50 || r[0].procent !== 5) throw new Error('rustig tempo niet ingesteld: ' + JSON.stringify(r[0]));
  await page.getByRole('button', { name: /Standaard \(10 = 5%\)/ }).click();
  await page.waitForTimeout(700);
  r = await page.evaluate(async () => (await (await import('./js/spaarkaart.js')).spaarInstellingen()).trap);
  if (r[0].tokens !== 10 || r[5].tokens !== 85) throw new Error('standaardtrap niet hersteld: ' + JSON.stringify(r));
});

console.log('\n--- fouten ---');
console.log(fouten.length ? fouten.join('\n') : 'geen');
await browser.close();
process.exit(fouten.length ? 1 : 0);
