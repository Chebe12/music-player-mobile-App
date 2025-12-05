
const CACHE_NAME = 'vibestream-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.tailwindcss.com',
  'https://esm.sh/react@18.2.0?dev',
  'https://esm.sh/react-dom@18.2.0?dev',
  'https://esm.sh/react-dom@18.2.0/client?dev',
  'https://esm.sh/react@18.2.0/jsx-runtime?dev',
  'https://esm.sh/react@18.2.0/jsx-dev-runtime?dev',
  'https://esm.sh/lucide-react@0.344.0?dev&deps=react@18.2.0',
  'https://esm.sh/@google/genai@0.0.12',
  // Sample Media Pre-caching
  'https://picsum.photos/id/10/400/400',
  'https://picsum.photos/id/11/400/400',
  'https://picsum.photos/id/12/400/400',
  'https://picsum.photos/id/13/400/400',
  'https://picsum.photos/id/14/400/400',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
];

// Install Event: Cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event: Clean up old caches
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
    })
  );
  self.clients.claim();
});

// Fetch Event: Network First, then Cache (Stale-While-Revalidate strategy for some)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // For media files (audio/images), use Cache First, fall back to Network
  if (url.pathname.endsWith('.mp3') || url.hostname.includes('picsum.photos')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // For everything else, try Network first, then Cache
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Update cache with new version
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
