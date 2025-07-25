const CACHE_NAME = 'inul-pwa-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/jadwal.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Tambahkan file CSS, JS, dan aset lainnya yang diperlukan
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('✅ Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error('❌ Cache installation failed:', err);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached response if found
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise try network request
        return fetch(event.request)
          .then(response => {
            // Optionally cache new requests
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // Return offline page or fallback if both cache and network fail
            return caches.match('/offline.html'); // Buat file offline.html untuk fallback
          });
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.map(key => {
          if (!cacheWhitelist.includes(key)) {
            console.log('🗑️ Hapus cache lama:', key);
            return caches.delete(key);
          }
        })
      ))
      .then(() => {
        console.log('🔄 Claiming clients');
        return self.clients.claim();
      })
  );
});
