const CACHE_NAME = 'inul-pwa-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/jadwal.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // Tambahkan file HTML lain nanti
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('✅ Caching files');
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch (serve cache kalau offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Activate (bersihkan cache lama)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('🗑️ Hapus cache lama:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});
