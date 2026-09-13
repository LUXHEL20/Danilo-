/**
 * Offline-controle van de service worker op de gebouwde map www/ (eerst: npm run build).
 * De test start een eigen http-server op poort 8125 en doodt die daarna echt: Playwright's
 * setOffline() snijdt de fetch van een service worker in Chromium niet af en gaf een vals groen.
 * Verwacht: na één online bezoek werkt de app offline (alles staat in de precache).
 * Draaien: node test/offline-test.mjs
 */
import { spawn, execSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_PAD || '/opt/node22/lib/node_modules/playwright/index.mjs');
const WORTEL = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE = (readFileSync(join(WORTEL, 'sw.js'), 'utf8').match(/const CACHE = '([^']+)'/) || [])[1];
if (!CACHE) throw new Error('cachenaam niet gevonden in sw.js');
if (!existsSync(join(WORTEL, 'www', 'index.html'))) throw new Error('www/ ontbreekt: doe eerst npm run build');
const BIN = process.env.HTTP_SERVER_BIN
  || join(execSync('npm root -g', { encoding: 'utf8' }).trim(), 'http-server', 'bin', 'http-server');
const POORT = 8125;
const BASIS = `http://127.0.0.1:${POORT}/index.html`;

let server = null;
const start = async () => {
  server = spawn(process.execPath, [BIN, '-p', String(POORT), '-c-1', 'www'], { cwd: WORTEL, stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(BASIS); if (r.ok) return; } catch { /* nog niet klaar */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error('server start niet');
};
const stop = async () => {
  if (!server) return;
  server.kill('SIGKILL');
  await new Promise((r) => server.on('exit', r));
  server = null;
  for (let i = 0; i < 30; i++) { try { await fetch(BASIS); await new Promise((r) => setTimeout(r, 100)); } catch { return; } }
};

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await context.newPage();
const fouten = [];
page.on('console', (m) => { if (m.type() === 'error') fouten.push('console: ' + m.text().split('\n')[0]); });
page.on('pageerror', (e) => fouten.push('pageerror: ' + e.message.split('\n')[0]));
const antwoorden = [];
page.on('response', (r) => { if (/native\.js/.test(r.url())) antwoorden.push(`native.js → ${r.status()} ${(r.headers()['content-type'] || '').split(';')[0]} sw=${r.fromServiceWorker()}`); });

const offlineProef = async (label) => {
  await stop();
  fouten.length = 0; antwoorden.length = 0;
  await page.reload({ waitUntil: 'load' }).catch((e) => fouten.push('reload: ' + e.message.split('\n')[0]));
  await page.waitForTimeout(1500);
  const scherm = (await page.locator('#scherm').innerText().catch(() => '(geen #scherm)')).slice(0, 50).replace(/\s+/g, ' ');
  const werkt = scherm.length > 0 && !/Bezig met laden|geen #scherm/.test(scherm);
  console.log(`${label}: app ${werkt ? 'WERKT' : 'WERKT NIET'} offline; #scherm="${scherm}"`);
  console.log('   ' + (antwoorden.join(' | ') || 'geen antwoord voor native.js'));
  console.log('   fouten: ' + (fouten.length ? fouten.join(' || ') : 'geen'));
  return werkt;
};

await start();
console.log('server gestart op', BASIS);
await page.goto(BASIS);
await page.waitForTimeout(800);
console.log('pagina geladen, wachten op de service worker');
await page.evaluate(() => Promise.race([navigator.serviceWorker.ready, new Promise((_, rej) => setTimeout(() => rej(new Error('service worker niet actief na 15 s')), 15000))]));
console.log('service worker actief');
await page.waitForFunction(async (naam) => (await (await caches.open(naam)).keys()).length >= 30, CACHE, { timeout: 10000 });
const info = await page.evaluate(async (naam) => {
  const c = await caches.open(naam);
  return { precache: (await c.keys()).length, nativeGecachet: !!(await c.match(new URL('js/native.js', location.href).href)) };
}, CACHE);
console.log('na 1e online bezoek:', JSON.stringify(info));
const na1 = await offlineProef('offline na 1 online bezoek');

await start();
await page.reload({ waitUntil: 'load' });
await page.waitForTimeout(1200);
const info2 = await page.evaluate(async (naam) => ({ nativeGecachet: !!(await (await caches.open(naam)).match(new URL('js/native.js', location.href).href)) }), CACHE);
console.log('na 2e online bezoek:', JSON.stringify(info2));
const na2 = await offlineProef('offline na 2 online bezoeken');

await browser.close();
await stop();
console.log(JSON.stringify({ offlineNa1: na1, offlineNa2: na2 }));
if (!na1 || !na2) { console.log('FOUT: de app werkt niet offline'); process.exit(1); }
console.log('Offline-test geslaagd.');
