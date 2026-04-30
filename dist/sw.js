const CACHE_NAME = 'kgmao-cache-v2';

// Install Event - Force Skip Waiting
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate Event - Claim Clients
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch Event - Strict API Bypass
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. CRITICAL: Do NOT intercept or cache any API calls
  if (url.pathname.startsWith('/api')) {
    return; // Pass through to network
  }

  // 2. Only handle GET requests for static assets
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cache if found, else fetch from network
      return response || fetch(event.request).catch((err) => {
        // Fail gracefully
        console.warn('SW: Network fetch failed for:', url.pathname);
      });
    })
  );
});
