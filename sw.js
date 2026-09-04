/* Service worker: de app blijft werken zonder internet. */
const CACHE = 'luxaqua-v1';
const BESTANDEN = [
  './', './index.html', './manifest.webmanifest',
  './css/style.css',
  './assets/icoon.svg', './assets/icoon-maskable.svg',
  './js/app.js', './js/ui.js', './js/db.js', './js/store.js', './js/params.js',
  './js/products.js', './js/advies.js', './js/strip.js', './js/color.js',
  './js/charts.js', './js/delen.js',
  './js/views/onboarding.js', './js/views/start.js', './js/views/meten.js',
  './js/views/bak.js', './js/views/historiek.js', './js/views/producten.js',
  './js/views/hulp.js', './js/views/kennis.js', './js/views/luxaqua.js',
  './js/views/beheer.js', './js/views/onderdelen.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(BESTANDEN)).then(() => self.skipWaiting()));
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
      }).catch(() => gecached || caches.match('./index.html'));
      return gecached || netwerk;
    })
  );
});
