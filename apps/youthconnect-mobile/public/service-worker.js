const CACHE_NAME = 'youthconnect-pwa-cache-v2';
const OFFLINE_URL = '/';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache the app shell (index.html, manifest, icons)
      return cache.addAll([
        OFFLINE_URL,
        '/manifest.json',
        '/icon-192x192.png',
        '/icon-512x512.png'
      ]);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    (async () => {
      try {
        // Network First
        const networkResponse = await fetch(event.request);
        
        // Save the successful response to the cache for later offline use
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const cache = await caches.open(CACHE_NAME);
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      } catch (error) {
        // Fallback to Cache if Network fails (Offline)
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // If it's a navigation request (HTML page) and not in cache, fallback to index.html
        if (event.request.mode === 'navigate') {
          const cache = await caches.open(CACHE_NAME);
          return cache.match(OFFLINE_URL);
        }

        throw error;
      }
    })()
  );
});
