const CACHE_NAME = 'odonto-legal-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/dashboard_admin.html',
  '/dashboard_perito.html',
  '/dashboard_assistente.html',
  '/css/styles.css',
  '/js/main.js',
  '/images/icons/playstore.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
