const CACHE_NAME = "sjt-drive-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/drive/index.html",
  "/drive/public.html",
  "/drive/private.html"
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

  event.respondWith(

    caches.match(event.request)
    .then(response => {

      return response || fetch(event.request);

    })

  );

});