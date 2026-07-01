// Prosty service worker — cache-first dla assetów (hash w nazwie), network-first dla reszty.
// NIE cache'uje /api/* (żeby dane były świeże). Wersjonuj CACHE żeby wymusić odświeżenie.
const CACHE = 'domki-ekipa-v1';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/.netlify/')) return;

  if (url.pathname.startsWith('/assets/')) {
    // assety Vite mają hash w nazwie -> cache-first jest bezpieczne
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match(e.request).then((r) => r || fetch(e.request).then((res) => { c.put(e.request, res.clone()); return res; })),
      ),
    );
    return;
  }

  // reszta (index.html itd.) -> network-first, fallback do cache (offline)
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request)),
  );
});
