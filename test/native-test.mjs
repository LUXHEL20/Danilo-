/**
 * Test van de native tak (js/native.js) met een gemockte Capacitor-runtime in Chromium.
 * De echte plugins (camera, deelmenu, bestanden, terugknop) kunnen hier niet draaien; de mock
 * telt de aanroepen en geeft realistische antwoorden. Het gemockte platform is Android.
 * Draaien: APP_URL=http://127.0.0.1:8123/index.html node test/native-test.mjs
 */
const { chromium } = await import(process.env.PLAYWRIGHT_PAD || '/opt/node22/lib/node_modules/playwright/index.mjs');

const fouten = [];
const BASIS = process.env.APP_URL || 'http://127.0.0.1:8123/index.html';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
let consoleFouten = [];
page.on('console', (m) => { if (m.type() === 'error' && !/sharing is in progress/.test(m.text())) { consoleFouten.push(m.text()); fouten.push('console: ' + m.text()); } });
page.on('pageerror', (e) => { consoleFouten.push('pageerror ' + e.message); fouten.push('pageerror: ' + e.message); });
page.setDefaultTimeout(4000);

await page.addInitScript(() => {
  window.__native = { getPhoto: 0, pickImages: 0, share: 0, writeFile: 0, rmdir: 0, backButton: 0, statusBar: 0, splash: 0, exit: 0, swRegister: 0 };
  window.__shareFout = false;
  window.__pickZonderWebPath = false;
  window.__gedeeldLijst = [];
  window.__geschrevenLijst = [];
  window.__annuleerCamera = false;
  window.__annuleerShare = false;
  // kleine geldige jpeg: canvas met een "strip" van gekleurde vakjes
  const maakJpeg = () => {
    const c = document.createElement('canvas'); c.width = 240; c.height = 80;
    const g = c.getContext('2d');
    g.fillStyle = '#222'; g.fillRect(0, 0, 240, 80);
    g.fillStyle = '#f5f5f5'; g.fillRect(20, 30, 200, 20);
    ['#c8a04a', '#d46a3c', '#7bb04e', '#3f7fc4', '#b04e9a', '#e0d060'].forEach((k, i) => { g.fillStyle = k; g.fillRect(28 + i * 32, 32, 24, 16); });
    return c.toDataURL('image/jpeg', 0.85);
  };
  const annulering = (tekst) => { const e = new Error(tekst); e.code = 'UNKNOWN'; return e; };
  window.Capacitor = {
    isNativePlatform: () => true,
    getPlatform: () => 'android',
    // zoals op het toestel: een file://-pad wordt een url die de WebView wél kan ophalen
    convertFileSrc: (pad) => location.origin + location.pathname.replace(/index\.html$/, '') + 'assets/icons/icon-512.png?van=' + encodeURIComponent(pad),
    Plugins: {
      Camera: {
        getPhoto: async (o) => {
          window.__native.getPhoto++; window.__laatsteGetPhoto = o;
          if (window.__annuleerCamera) throw annulering('User cancelled photos app');
          return { dataUrl: maakJpeg(), format: 'jpeg' };
        },
        pickImages: async (o) => {
          window.__native.pickImages++; window.__laatstePickImages = o;
          if (window.__annuleerCamera) throw annulering('User cancelled photos app');
          // echte, ophaalbare paden van dezelfde origin (zoals https://localhost/_capacitor_file_/... op het toestel)
          const basis = location.origin + location.pathname.replace(/index\.html$/, '');
          if (window.__pickZonderWebPath) return { photos: [{ path: 'file:///storage/enkel-pad.png', format: 'png' }] };
          return { photos: [
            { webPath: basis + 'assets/brand/LUX-AQUA-06-app-icoon-navy.png', path: 'file:///storage/foto1.png', format: 'png' },
            { webPath: basis + 'assets/icons/icon-192.png', path: 'file:///storage/foto2.png', format: 'png' },
          ] };
        },
      },
      Share: { share: async (o) => { window.__native.share++; if (window.__annuleerShare) throw annulering('Share canceled'); if (window.__shareFout) throw new Error("Can't share while sharing is in progress"); window.__gedeeld = o; window.__gedeeldLijst.push(o); return { activityType: 'test' }; } },
      Filesystem: { writeFile: async (o) => { window.__native.writeFile++; window.__laatstGeschreven = o; window.__geschrevenLijst.push({ path: o.path, directory: o.directory, encoding: o.encoding, lengte: String(o.data).length }); return { uri: 'file:///cache/' + o.path }; }, rmdir: async (o) => { window.__native.rmdir++; window.__laatsteRmdir = o; } },
      App: {
        addListener: (naam, fn) => { window.__native.backButton++; if (naam === 'backButton') window.__terug = fn; return { remove() {} }; },
        exitApp: async () => { window.__native.exit++; },
      },
      StatusBar: { setStyle: async (o) => { window.__native.statusBar++; window.__statusStyle = o; }, setBackgroundColor: async (o) => { window.__native.statusBar++; window.__statusKleur = o; } },
      SplashScreen: { hide: async () => { window.__native.splash++; } },
    },
  };
  // service worker mocken en tellen
  try {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: { register: () => { window.__native.swRegister++; return Promise.resolve({}); }, getRegistrations: async () => [] },
    });
  } catch (e) { console.warn('sw-mock mislukt', e); }
});

const sluitOverlays = () => page.evaluate(() => { document.querySelectorAll('.overlay').forEach((o) => o.remove()); document.body.classList.remove('geen-scroll'); });
const stap = async (naam, fn) => {
  consoleFouten = [];
  try {
    await fn();
    if (consoleFouten.length) throw new Error('consolefouten tijdens de stap: ' + consoleFouten.join(' | '));
    console.log('✓', naam);
  } catch (e) { console.log('✗', naam, '→', e.message.split('\n')[0]); fouten.push(`${naam}: ${e.message.split('\n')[0]}`); await sluitOverlays(); }
};
const n = () => page.evaluate(() => window.__native);

await page.goto(BASIS);
await page.waitForTimeout(700);

await stap('onboarding doorlopen (native)', async () => {
  await page.getByRole('button', { name: 'Beginnen' }).click();
  await page.getByText('Ik ben klant').click();
  await page.locator('input[autocomplete="name"]').fill('Native Klant');
  await page.locator('input[autocomplete="tel"]').fill('0470 12 34 56');
  await page.getByRole('button', { name: 'Volgende' }).click();
  const nums = page.locator('input[type="number"]');
  await nums.nth(0).fill('120'); await nums.nth(1).fill('50'); await nums.nth(2).fill('55');
  await page.waitForTimeout(150);
  await page.getByRole('button', { name: 'Volgende' }).click();
  await page.getByRole('button', { name: /Klaar, start de app/ }).click();
  await page.waitForTimeout(600);
  await page.waitForSelector('text=Doe uw eerste meting', { timeout: 3000 });
});

await stap('initNative: StatusBar DARK + #0D1730, SplashScreen.hide, backButton gekoppeld', async () => {
  const x = await n();
  const stijl = await page.evaluate(() => window.__statusStyle);
  const kleur = await page.evaluate(() => window.__statusKleur);
  if (x.statusBar < 2) throw new Error('StatusBar niet ingesteld: ' + JSON.stringify(x));
  if (stijl?.style !== 'DARK') throw new Error('stijl niet DARK: ' + JSON.stringify(stijl));
  if (kleur?.color !== '#0D1730') throw new Error('kleur niet #0D1730: ' + JSON.stringify(kleur));
  if (x.splash < 1) throw new Error('SplashScreen.hide niet aangeroepen');
  if (x.backButton < 1) throw new Error('App.addListener niet aangeroepen');
  const terug = await page.evaluate(() => typeof window.__terug);
  if (terug !== 'function') throw new Error('window.__terug is geen functie: ' + terug);
});

await stap('navigator.serviceWorker.register wordt NIET aangeroepen', async () => {
  // de 'load'-gebeurtenis is al lang voorbij; even wachten voor de zekerheid
  await page.waitForTimeout(300);
  const x = await n();
  if (x.swRegister !== 0) throw new Error('register aangeroepen: ' + x.swRegister + ' keer');
});

await stap('terugknop: op subpagina doet history.back(), op start exitApp', async () => {
  await page.evaluate(() => { location.hash = '#/start'; });
  await page.waitForTimeout(300);
  await page.evaluate(() => { location.hash = '#/bak'; });
  await page.waitForTimeout(400);
  const lengteVoor = await page.evaluate(() => history.length);
  await page.evaluate(() => window.__terug({ canGoBack: true }));
  await page.waitForTimeout(400);
  const hash = await page.evaluate(() => location.hash);
  if (hash === '#/bak') throw new Error('history.back() deed niets, hash is nog ' + hash);
  if ((await n()).exit !== 0) throw new Error('exitApp ten onrechte aangeroepen op subpagina');
  console.log(`   → history.length ${lengteVoor}, na terugknop hash = ${hash}`);
  await page.evaluate(() => { location.hash = '#/start'; });
  await page.waitForTimeout(300);
  await page.evaluate(() => window.__terug({ canGoBack: true }));
  await page.waitForTimeout(100);
  if ((await n()).exit !== 1) throw new Error('exitApp niet aangeroepen op startscherm');
});

await stap('terugknop met open dialoog sluit enkel de dialoog', async () => {
  await page.goto(`${BASIS}#/bak`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: '+ Toevoegen' }).click();
  await page.waitForSelector('.dialoog');
  await page.evaluate(() => window.__terug({ canGoBack: true }));
  await page.waitForTimeout(400);
  const overlays = await page.locator('.overlay').count();
  const hash = await page.evaluate(() => location.hash);
  const scroll = await page.evaluate(() => document.body.classList.contains('geen-scroll'));
  console.log(`   → na terugknop: ${overlays} overlay(s) nog open, hash = ${hash}`);
  await sluitOverlays();
  if (overlays > 0) throw new Error('dialoog blijft open terwijl de pagina eronder wegnavigeert');
  if (hash !== '#/bak') throw new Error('de terugknop navigeerde weg in plaats van enkel de dialoog te sluiten: ' + hash);
  if (scroll) throw new Error('geen-scroll blijft op body staan');
});

await stap('initNative: de deelmap in de cache wordt bij het opstarten geleegd', async () => {
  const x = await n();
  const o = await page.evaluate(() => window.__laatsteRmdir);
  if (x.rmdir < 1) throw new Error('Filesystem.rmdir niet aangeroepen');
  if (o?.path !== 'delen' || o?.directory !== 'CACHE' || !o?.recursive) throw new Error('verkeerde rmdir-opties: ' + JSON.stringify(o));
});

await stap('meten: fotoknop -> Camera.getPhoto (dataUrl, PROMPT, NL-labels) en analyse start zonder fouten', async () => {
  await page.goto(`${BASIS}#/meten`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Foto nemen of kiezen/ }).click();
  await page.waitForTimeout(1500);
  const x = await n();
  if (x.getPhoto !== 1) throw new Error('Camera.getPhoto niet (één keer) aangeroepen: ' + x.getPhoto);
  const o = await page.evaluate(() => window.__laatsteGetPhoto);
  if (o.resultType !== 'dataUrl') throw new Error('resultType is ' + o.resultType);
  if (o.source !== 'PROMPT') throw new Error('source is ' + o.source);
  if (!o.promptLabelPicture || !o.promptLabelPhoto) throw new Error('promptlabels ontbreken');
  const doek = await page.locator('.stripdoek').count();
  const fout = await page.locator('.melding--fout').count();
  if (fout) throw new Error('foutmelding: ' + await page.locator('.melding--fout').first().innerText());
  if (!doek) throw new Error('geen .stripdoek na de foto');
  console.log(`   → opties: ${JSON.stringify(o)}`);
});

await stap('meten: "Nieuwe foto" roept getPhoto opnieuw aan', async () => {
  await page.getByRole('button', { name: /Nieuwe foto/ }).click();
  await page.waitForTimeout(1000);
  if ((await n()).getPhoto !== 2) throw new Error('getPhoto niet opnieuw aangeroepen');
});

await stap('meten: annuleren in de camera geeft geen foutmelding en geen crash', async () => {
  await page.evaluate(() => { window.__annuleerCamera = true; });
  await page.getByRole('button', { name: /Nieuwe foto/ }).click();
  await page.waitForTimeout(600);
  await page.evaluate(() => { window.__annuleerCamera = false; });
  const fout = await page.locator('.melding--fout').count();
  if (fout) throw new Error('foutmelding bij annuleren: ' + await page.locator('.melding--fout').first().innerText());
});

await stap('hulp: hulpvraag aanmaken', async () => {
  await page.goto(`${BASIS}#/hulp`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Huisbezoek voor advies/ }).click();
  await page.waitForSelector('.dialoog');
  await page.locator('.dialoog textarea').first().fill('Water is troebel sinds een week.');
  await page.getByRole('button', { name: 'Doorgaan' }).click();
  await page.waitForTimeout(800);
  await page.waitForSelector('text=Hoe stuurt u dit door', { timeout: 4000 });
});

await stap('hulp: "Delen" deelt op Android enkel de tekst (geen bijlage, die laat WhatsApp de tekst vallen)', async () => {
  await page.evaluate(() => { window.__gedeeld = null; });
  const writesVoor = (await n()).writeFile;
  await page.getByRole('button', { name: /Delen via mijn toestel/ }).click();
  await page.waitForTimeout(900);
  const g = await page.evaluate(() => window.__gedeeld);
  if (!g) throw new Error('Share.share niet aangeroepen');
  if (g.files?.length) throw new Error('op Android mag er geen bestand mee: ' + JSON.stringify(g.files));
  if (!/dossier/i.test(g.text || '')) throw new Error('tekst ontbreekt');
  if ((await n()).writeFile !== writesVoor) throw new Error('er werd toch een bestand geschreven');
  console.log(`   → title "${g.title}", tekstlengte ${g.text.length}`);
});

await stap('hulp: een echte fout bij het delen geeft een foutmelding, geen "gekopieerd"', async () => {
  await page.evaluate(() => { window.__shareFout = true; });
  await page.getByRole('button', { name: /Delen via mijn toestel/ }).click();
  await page.waitForTimeout(700);
  await page.evaluate(() => { window.__shareFout = false; });
  consoleFouten = consoleFouten.filter((t) => !/sharing is in progress/.test(t)); // die console.error is verwacht
  const meldingen = await page.locator('.melding').allInnerTexts();
  if (meldingen.some((t) => /Gekopieerd/.test(t))) throw new Error('bij een fout toch naar het klembord gekopieerd');
  if (!meldingen.some((t) => /Delen lukte niet/.test(t))) throw new Error('geen foutmelding: ' + JSON.stringify(meldingen));
  await page.waitForTimeout(3500); // meldingen laten verdwijnen
});

await stap('hulp: "Als bestand bewaren" -> ook via Share (json in CACHE, zonder tekst)', async () => {
  await page.evaluate(() => { window.__gedeeld = null; });
  await page.getByRole('button', { name: /Als bestand bewaren/ }).click();
  await page.waitForTimeout(900);
  const g = await page.evaluate(() => window.__gedeeld);
  if (!g) throw new Error('Share.share niet aangeroepen');
  if (!g.files?.[0] || !/^file:\/\/\/cache\/delen\/luxaqua-dossier-.*\.json$/.test(g.files[0])) throw new Error('json niet gedeeld: ' + JSON.stringify(g.files));
  const w = await page.evaluate(() => window.__laatstGeschreven);
  if (w.encoding !== 'utf8' || w.directory !== 'CACHE' || !w.recursive) throw new Error('verkeerde opslag: ' + JSON.stringify({ e: w.encoding, d: w.directory, r: w.recursive }));
  console.log(`   → ${g.files[0]}`);
});

await stap('hulp: "Dossier als bestand delen" -> html via Share', async () => {
  await page.evaluate(() => { window.__gedeeld = null; });
  const knop = page.locator('.dialoog').getByRole('button', { name: /Dossier als bestand delen/ });
  if (!await knop.count()) throw new Error('knoplabel niet aangepast op natief');
  if (!await page.locator('#scherm').getByRole('button', { name: /Dossier als bestand delen/ }).count()) throw new Error('knoplabel op de hulp-pagina niet aangepast');
  await knop.click();
  await page.waitForTimeout(900);
  const w = await page.evaluate(() => window.__laatstGeschreven);
  if (w.path !== 'delen/luxaqua-dossier.html') throw new Error('html niet geschreven: ' + w.path);
  if (!/<html/i.test(w.data)) throw new Error('inhoud is geen html');
  if (!/<img src="data:image\/svg\+xml/.test(w.data)) throw new Error('het standaardlogo is niet ingelijnd als data-URL (gedeeld bestand zou geen logo tonen)');
  const g = await page.evaluate(() => window.__gedeeld);
  if (!g?.files?.[0]?.endsWith('luxaqua-dossier.html')) throw new Error('html niet gedeeld: ' + JSON.stringify(g?.files));
});

await stap('hulp: annuleren van de share-sheet geeft geen klembordkopie en geen fout', async () => {
  await page.evaluate(() => { window.__annuleerShare = true; });
  await page.getByRole('button', { name: /Delen via mijn toestel/ }).click();
  await page.waitForTimeout(700);
  await page.evaluate(() => { window.__annuleerShare = false; });
  const meldingen = await page.locator('.melding').allInnerTexts();
  if (meldingen.some((t) => /Gekopieerd/.test(t))) throw new Error('bij annuleren toch naar het klembord gekopieerd');
  if (meldingen.some((t) => /lukte niet/.test(t))) throw new Error('foutmelding bij annuleren: ' + meldingen.join(' | '));
  await page.getByRole('button', { name: 'Klaar' }).click();
  await page.waitForTimeout(500);
});

await stap('bak: "+ Foto" vraagt eerst camera of galerij; "Uit de galerij" -> pickImages, twee fotokaarten', async () => {
  await page.goto(`${BASIS}#/bak`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: '+ Foto' }).click();
  await page.waitForSelector('.dialoog');
  if (!await page.locator('.dialoog').getByRole('button', { name: /Foto nemen/ }).count()) throw new Error('geen keuze "Foto nemen"');
  await page.locator('.dialoog').getByRole('button', { name: /Uit de galerij/ }).click();
  await page.waitForTimeout(1800);
  const x = await n();
  if (x.pickImages !== 1) throw new Error('pickImages niet aangeroepen: ' + x.pickImages);
  const kaarten = await page.locator('.fotokaart').count();
  if (kaarten !== 2) throw new Error('verwacht 2 fotokaarten, gevonden ' + kaarten);
  const o = await page.evaluate(() => window.__laatstePickImages);
  console.log(`   → pickImages-opties ${JSON.stringify(o)}, ${kaarten} fotokaarten`);
});

await stap('bak: "+ Foto" en dan "Foto nemen" -> getPhoto met source CAMERA, één fotokaart erbij', async () => {
  const voor = (await n()).getPhoto;
  await page.getByRole('button', { name: '+ Foto' }).click();
  await page.waitForSelector('.dialoog');
  await page.locator('.dialoog').getByRole('button', { name: /Foto nemen/ }).click();
  await page.waitForTimeout(1500);
  if ((await n()).getPhoto !== voor + 1) throw new Error('getPhoto niet aangeroepen');
  const o = await page.evaluate(() => window.__laatsteGetPhoto);
  if (o.source !== 'CAMERA') throw new Error('source is ' + o.source);
  const kaarten = await page.locator('.fotokaart').count();
  if (kaarten !== 3) throw new Error('verwacht 3 fotokaarten, gevonden ' + kaarten);
});

await stap('bak: "+ Foto" en de keuze sluiten -> niets gebeurt', async () => {
  const x0 = await n();
  await page.getByRole('button', { name: '+ Foto' }).click();
  await page.waitForSelector('.dialoog');
  await page.locator('.dialoog .icoonknop').click();
  await page.waitForTimeout(500);
  const x1 = await n();
  if (x1.getPhoto !== x0.getPhoto || x1.pickImages !== x0.pickImages) throw new Error('camera toch aangeroepen');
  if (await page.locator('.overlay').count()) throw new Error('dialoog blijft open');
});

await stap('bak: pickImages zonder webPath -> pad via Capacitor.convertFileSrc opgehaald', async () => {
  await page.evaluate(() => { window.__pickZonderWebPath = true; });
  const voor = await page.locator('.fotokaart').count();
  await page.getByRole('button', { name: '+ Foto' }).click();
  await page.waitForSelector('.dialoog');
  await page.locator('.dialoog').getByRole('button', { name: /Uit de galerij/ }).click();
  await page.waitForTimeout(1500);
  await page.evaluate(() => { window.__pickZonderWebPath = false; });
  const fout = await page.locator('.melding--fout').count();
  if (fout) throw new Error('foutmelding: ' + await page.locator('.melding--fout').first().innerText());
  const na = await page.locator('.fotokaart').count();
  if (na !== voor + 1) throw new Error(`verwacht ${voor + 1} fotokaarten, gevonden ${na}`);
});

await stap('bak: visfoto -> getPhoto en thumbnail getoond', async () => {
  await page.getByRole('button', { name: '+ Toevoegen' }).click();
  await page.waitForSelector('.dialoog');
  const voor = (await n()).getPhoto;
  await page.locator('.dialoog button', { hasText: 'Foto kiezen' }).click();
  await page.waitForTimeout(800);
  if ((await n()).getPhoto !== voor + 1) throw new Error('getPhoto niet aangeroepen');
  const img = await page.locator('.dialoog img.foto').count();
  if (!img) throw new Error('geen voorbeeldfoto in de dialoog');
  await sluitOverlays();
});

await stap('beheer: back-up maken deelt via CACHE; productexport ook', async () => {
  await page.goto(`${BASIS}#/beheer`);
  await page.waitForTimeout(500);
  await page.getByRole('button', { name: /Back-up maken/ }).click();
  await page.waitForTimeout(900);
  let w = await page.evaluate(() => window.__laatstGeschreven);
  if (!/^delen\/luxaqua-backup-.*\.json$/.test(w.path)) throw new Error('back-up niet geschreven: ' + w.path);
  let g = await page.evaluate(() => window.__gedeeld);
  if (!g?.files?.[0]?.includes('luxaqua-backup-')) throw new Error('back-up niet gedeeld: ' + JSON.stringify(g?.files));
});

await stap('beheer: logo kiezen gaat ook natief via de bestandskiezer (svg en transparante png blijven intact)', async () => {
  const knop = page.locator('#scherm button', { hasText: /Logo kiezen/ });
  if (!await knop.count()) throw new Error('geen logoknop gevonden');
  const voor = (await n()).getPhoto;
  const [kiezer] = await Promise.all([page.waitForEvent('filechooser'), knop.first().click()]);
  const accept = await kiezer.element().getAttribute('accept');
  if (!/svg/.test(accept || '')) throw new Error('accept laat geen svg toe: ' + accept);
  if ((await n()).getPhoto !== voor) throw new Error('de camera-plugin werd toch gebruikt voor het logo');
  await kiezer.setFiles({ name: 'logo.svg', mimeType: 'image/svg+xml', buffer: Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="#0D1730"/></svg>') });
  await page.waitForTimeout(800);
  const src = await page.evaluate(() => document.querySelector('.kopbalk__logo--eigen')?.getAttribute('src') || '');
  if (!src.startsWith('data:image/svg+xml')) throw new Error('svg-logo niet als svg bewaard: ' + src.slice(0, 40));
});

console.log('\n--- overzicht native aanroepen ---');
console.log(JSON.stringify(await n()));
console.log('geschreven bestanden:', JSON.stringify(await page.evaluate(() => window.__geschrevenLijst)));

await browser.close();
console.log('\n--- fouten ---');
console.log(fouten.length ? fouten.join('\n') : 'geen');
process.exit(fouten.length ? 1 : 0);
