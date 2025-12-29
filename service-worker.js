const CACHE_NAME = "uh-weather-cache-v7.5";
const FILES_TO_CACHE = [
  "./",
  "./index.html"
];

// Install event: cache local assets
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate event: clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch event: intercept requests
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Only handle same-origin requests (your Pages site)
  if (url.origin !== self.location.origin) {
    // Bypass Service Worker for cross-origin requests (R2/CDN)
    return;
  }

  // Handle caching for same-origin requests
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
