self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('taskflow-v1').then(cache => {
      return cache.addAll([
        './Aplicación.html'
        // Puedes agregar más archivos si los separas (css, js local, etc.)
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});