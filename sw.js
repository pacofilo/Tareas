// Service Worker — PreCrastinar PWA
const CACHE = 'precrastinar-v1';
const ASSETS = [
  '/Tareas/',
  '/Tareas/index.html'
];

// Instalar: guardar en caché los archivos base
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activar: limpiar cachés antiguas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: red primero, caché como fallback
self.addEventListener('fetch', e => {
  // No interceptar peticiones de Firebase ni Google
  if (e.request.url.includes('firebase') ||
      e.request.url.includes('google') ||
      e.request.url.includes('gstatic')) {
    return;
  }
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
