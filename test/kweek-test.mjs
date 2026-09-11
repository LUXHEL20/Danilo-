/**
 * Test voor het kweekdossier: koppels, legsels, verwachte datums, cijfers en
 * het aanbod uit eigen kweek.
 * Gebruik: APP_URL=http://127.0.0.1:8130/index.html node test/kweek-test.mjs
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';

const fouten = [];
const BASIS = process.env.APP_URL || 'http://127.0.0.1:8130/index.html';

const stap = async (naam, fn) => {
  try { await fn(); console.log('✓', naam); }
  catch (e) { console.log('✗', naam, '→', e.message.split('\n')[0]); fouten.push(`${naam}: ${e.message.split('\n')[0]}`); }
  finally {
    await page.evaluate(() => {
      document.querySelectorAll('.overlay').forEach((o) => o.remove());
      document.body.classList.remove('geen-scroll');
    });
  }
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on('console', (m) => { if (m.type() === 'error') fouten.push('console: ' + m.text()); });
page.on('pageerror', (e) => fouten.push('pageerror: ' + e.message));
page.setDefaultTimeout(5000);

await page.goto(BASIS);
await page.waitForTimeout(600);
await page.getByRole('button', { name: 'Beginnen' }).click();
await page.getByText('Ik ben klant').click();
await page.locator('input[autocomplete="name"]').fill('Test Kweker');
await page.locator('input[autocomplete="tel"]').fill('0470 12 34 56');
await page.getByRole('button', { name: 'Volgende' }).click();
const nums = page.locator('input[type="number"]');
await nums.nth(0).fill('120'); await nums.nth(1).fill('50'); await nums.nth(2).fill('55');
await page.waitForTimeout(150);
await page.getByRole('button', { name: 'Volgende' }).click();
await page.getByRole('button', { name: /Klaar, start de app/ }).click();
await page.waitForTimeout(600);

const naar = async (pad) => {
  await page.evaluate(() => { location.hash = '#/start'; });
  await page.waitForTimeout(200);
  await page.evaluate((p) => { location.hash = `#/${p}`; }, pad);
  await page.waitForTimeout(550);
};

await stap('kweekdossier staat standaard uit', async () => {
  const labels = await page.locator('.navigatie a').allInnerTexts();
  if (labels.some((l) => /Kweek/.test(l))) throw new Error('Kweek staat in de balk zonder aangezet te zijn');
});

await stap('kweekdossier aanzetten vanuit beheer', async () => {
  await naar('beheer');
  await page.getByRole('button', { name: 'Kweekdossier aanzetten' }).click();
  await page.waitForTimeout(900);
  const labels = await page.locator('.navigatie a').allInnerTexts();
  if (!labels.some((l) => /Kweek/.test(l))) throw new Error('Kweek staat niet in de balk: ' + labels.join(', '));
  if (labels.some((l) => /Producten/.test(l))) throw new Error('Producten staat er nog naast, dat zijn zeven tabbladen');
});

await stap('lege staat nodigt uit om een koppel te maken', async () => {
  await naar('kweek');
  const tekst = await page.locator('#scherm').innerText();
  if (!/Nog geen kweekkoppels/.test(tekst)) throw new Error('geen lege staat, wel: ' + tekst.slice(0, 90));
});

await stap('koppel toevoegen', async () => {
  await page.getByRole('button', { name: 'Koppel toevoegen' }).click();
  await page.waitForTimeout(350);
  await page.locator('.dialoog input').first().fill('Koppel rood');
  await page.locator('.dialoog select').first().selectOption('ancistrus');
  await page.getByRole('button', { name: 'Bewaren' }).click();
  await page.waitForTimeout(900);
  const tekst = await page.locator('#scherm').innerText();
  if (!/Koppel rood/.test(tekst)) throw new Error('koppel niet in de lijst');
});

await stap('koppelscherm toont wat de soort vraagt', async () => {
  await page.getByRole('button', { name: /Koppel rood/ }).click();
  await page.waitForTimeout(800);
  const tekst = await page.locator('#scherm').innerText();
  if (!/Kweektemperatuur 24 tot 27 graden/.test(tekst)) throw new Error('kweekgegevens van de soort ontbreken');
  if (!/kweekbuis/.test(tekst)) throw new Error('de tip bij de soort ontbreekt');
});

await stap('legsel noteren met een datum van vijf dagen geleden', async () => {
  const geleden = await page.evaluate(() => {
    const d = new Date(Date.now() - 5 * 86400e3);
    return d.toISOString().slice(0, 10);
  });
  await page.getByRole('button', { name: '+ Legsel noteren' }).click();
  await page.waitForTimeout(350);
  await page.locator('.dialoog input[type="date"]').fill(geleden);
  await page.locator('.dialoog input[type="number"]').first().fill('60');
  await page.getByRole('button', { name: 'Bewaren' }).click();
  await page.waitForTimeout(900);
  const tekst = await page.locator('#scherm').innerText();
  if (!/60 eieren/.test(tekst)) throw new Error('legsel niet zichtbaar');
  if (!/Uitkomen werd verwacht/.test(tekst)) throw new Error('de verwachte datum ontbreekt of ligt nog in de toekomst');
});

await stap('een afwijkend aantal wordt gemeld', async () => {
  const r = await page.evaluate(async () => {
    const m = await import('./js/kweeksoorten.js');
    return { laag: m.nestOordeel('ancistrus', 5), gewoon: m.nestOordeel('ancistrus', 60), hoog: m.nestOordeel('ancistrus', 400) };
  });
  if (r.laag.soort !== 'laag' || r.gewoon.soort !== 'gewoon' || r.hoog.soort !== 'hoog') {
    throw new Error('oordeel klopt niet: ' + JSON.stringify(r));
  }
});

await stap('het legsel vraagt aandacht op het startscherm', async () => {
  await naar('start');
  const tekst = await page.locator('#scherm').innerText();
  if (!/legsel vraagt aandacht|legsels vragen aandacht/.test(tekst)) {
    throw new Error('geen melding op het startscherm');
  }
});

await stap('cijfers na een afgerond legsel', async () => {
  const r = await page.evaluate(async () => {
    const kw = await import('./js/kweek.js');
    const [k] = await kw.koppels();
    const [l] = await kw.legselsVanKoppel(k.id);
    await kw.bewaarLegsel({ ...l, status: 'afgerond', aantalLarven: 50, aantalOpgegroeid: 30 });
    const lijst = await kw.legselsVanKoppel(k.id);
    return kw.koppelCijfers(lijst);
  });
  if (r.jongen !== 30) throw new Error('aantal jongen klopt niet: ' + r.jongen);
  if (r.overleving !== 50) throw new Error('overleving moet 50% zijn (30 van 60), kreeg ' + r.overleving);
});

await stap('aanbod klaarzetten', async () => {
  await naar('kweek');
  await page.getByRole('button', { name: '+ Aanbod klaarzetten' }).click();
  await page.waitForTimeout(400);
  await page.locator('.dialoog select').first().selectOption('ancistrus');
  await page.locator('.dialoog input[type="number"]').first().fill('25');
  const tekstvelden = page.locator('.dialoog input[type="text"], .dialoog input:not([type])');
  await tekstvelden.nth(0).fill('3 tot 4 cm');
  await page.getByRole('button', { name: 'Bewaren' }).click();
  await page.waitForTimeout(900);
  const tekst = await page.locator('#scherm').innerText();
  if (!/25 × Blauwe antennemeerval/.test(tekst)) throw new Error('aanbod niet zichtbaar: ' + tekst.slice(0, 120));
});

await stap('het bericht naar LUX AQUA bevat soort, aantal en de gegevens van de kweker', async () => {
  const tekst = await page.evaluate(async () => {
    const kw = await import('./js/kweek.js');
    const s = await import('./js/store.js');
    const [a] = await kw.alleAanbod();
    const inst = await s.instellingen();
    const klant = inst.actieveKlant ? await s.klant(inst.actieveKlant) : null;
    return kw.aanbodAlsTekst(a, klant);
  });
  for (const nodig of ['Blauwe antennemeerval', 'Ancistrus', '25', 'Test Kweker']) {
    if (!tekst.includes(nodig)) throw new Error(`"${nodig}" ontbreekt in het bericht:\n${tekst}`);
  }
});

await stap('een dracht bij levendbarenden rekent de werpdatum uit', async () => {
  const r = await page.evaluate(async () => {
    const m = await import('./js/kweeksoorten.js');
    const start = Date.parse('2026-01-01T12:00:00Z');
    const d = m.verwachteData('guppy', start);
    return Math.round((d.werpen - start) / 86400e3);
  });
  if (r !== 28) throw new Error('draagtijd guppy moet 28 dagen zijn, kreeg ' + r);
});

await stap('koppel verwijderen ruimt de legsels en het eigen aanbod op', async () => {
  /* Het aanbod uit de vorige stap is vanuit het overzicht gemaakt en hangt dus
     aan geen enkel koppel. Dat moet blijven staan: het gaat over vissen die de
     kweker nog altijd heeft. Enkel wat aan dit koppel hangt, verdwijnt mee. */
  const r = await page.evaluate(async () => {
    const kw = await import('./js/kweek.js');
    const [k] = await kw.koppels();
    await kw.bewaarAanbod({ koppelId: k.id, soortId: 'ancistrus', aantal: 10, fotos: [] });
    const voor = (await kw.alleAanbod()).length;
    await kw.verwijderKoppel(k.id);
    return {
      koppels: (await kw.koppels()).length,
      legsels: (await kw.legsels()).length,
      aanbodVoor: voor,
      aanbodNa: (await kw.alleAanbod()).length,
    };
  });
  if (r.koppels) throw new Error('het koppel staat er nog');
  if (r.legsels) throw new Error('er bleven legsels staan');
  if (r.aanbodVoor !== 2) throw new Error('opzet klopt niet, verwacht twee aanbiedingen, kreeg ' + r.aanbodVoor);
  if (r.aanbodNa !== 1) throw new Error('het losse aanbod moet blijven staan, over: ' + r.aanbodNa);
});

console.log('\n--- fouten ---');
console.log(fouten.length ? fouten.join('\n') : 'geen');
await browser.close();
process.exit(fouten.length ? 1 : 0);
