/* Service worker: de app blijft werken zonder internet. */
/* Verhoog CACHE bij elke wijziging aan de lijst hieronder; oude caches worden dan opgeruimd. */
const CACHE = 'luxaqua-v6';
const BESTANDEN = [
  './', './index.html', './manifest.webmanifest',
  './css/style.css',
  './assets/icoon.svg',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/icons/maskable-512.png', './assets/icons/apple-touch-icon.png',
  './assets/brand/LUX-AQUA-01-navy.svg', './assets/brand/LUX-AQUA-03-wit.svg', './assets/brand/LUX-AQUA-06-app-icoon-navy.png',
  './js/app.js', './js/ui.js', './js/db.js', './js/store.js', './js/params.js',
  './js/products.js', './js/advies.js', './js/strip.js', './js/color.js',
  './js/charts.js', './js/delen.js', './js/native.js', './js/spaarkaart.js', './js/auth.js',
  './js/views/onboarding.js', './js/views/start.js', './js/views/meten.js',
  './js/views/bak.js', './js/views/historiek.js', './js/views/producten.js',
  './js/views/hulp.js', './js/views/kennis.js', './js/views/luxaqua.js',
  './js/views/spaar.js', './js/views/aanmelden.js',
  './js/views/beheer.js', './js/views/onderdelen.js',
];

/* Zonder deze vier start de app niet; de rest mag ontbreken zonder de offlinewerking te slopen. */
const KERN = ['./', './index.html', './css/style.css', './js/app.js'];

/**
 * Vult de precache bestand per bestand. addAll is alles of niets: één ontbrekend of
 * verkeerd gespeld bestand op de host maakte vroeger de hele service worker onbruikbaar,
 * zonder enig signaal. Nu blijft de app offline werken en staat wat misliep in de console.
 */
async function vulCache() {
  const c = await caches.open(CACHE);
  const uitkomsten = await Promise.allSettled(BESTANDEN.map((b) => c.add(b)));
  const mislukt = BESTANDEN.filter((_, i) => uitkomsten[i].status === 'rejected');
  if (mislukt.length) console.warn(`[LUX AQUA] niet in de cache gekregen (${mislukt.length}): ${mislukt.join(', ')}`);
  const kernWeg = mislukt.filter((b) => KERN.includes(b));
  if (kernWeg.length) throw new Error(`kernbestanden ontbreken: ${kernWeg.join(', ')}`);
}

self.addEventListener('install', (e) => {
  e.waitUntil(vulCache().then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((namen) => Promise.all(namen.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    caches.match(req).then((gecached) => {
      const netwerk = fetch(req).then((res) => {
        if (res.ok) {
          const kopie = res.clone();
          caches.open(CACHE).then((c) => c.put(req, kopie));
        }
        return res;
      }).catch(() => {
        if (gecached) return gecached;
        // enkel een paginanavigatie mag terugvallen op index.html;
        // een script of ander bestand krijgt nooit html als antwoord
        if (req.mode === 'navigate') return caches.match('./index.html');
        return Response.error();
      });
      return gecached || netwerk;
    })
  );
});
