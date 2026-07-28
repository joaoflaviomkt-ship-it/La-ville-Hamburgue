const CACHE_NAME = "laville-pwa-v1";

const FILES_TO_CACHE = [
  "./",
  "./central.html",
  "./index.html",
  "./cardapio.html",
  "./funcionarios.html",
  "./controle.html",
  "./dono.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE).catch(() => null))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME ? caches.delete(key) : null))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          if (event.request.url.startsWith(self.location.origin)) {
            cache.put(event.request, copy).catch(() => null);
          }
        });
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./central.html")))
  );
});
