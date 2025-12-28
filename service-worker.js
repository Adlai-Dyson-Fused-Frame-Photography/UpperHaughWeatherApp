const CACHE_NAME = "uh-weather-cache-v7.2";
const FILES_TO_CACHE = [
  "./",
  "./index.html"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Only cache requests from the same origin
  if (url.origin !== self.location.origin) {
    return; // bypass service worker for external resources (like R2)
  }

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
