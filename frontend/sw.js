const CACHE_NAME = 'kgmao-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Skip caching for API requests
  if (event.request.url.includes('/api/v1')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(err => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          throw err;
        });
      }
    )
  );
});
