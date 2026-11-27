/* RMI · service worker: permite abrir la app sin conexión.
   Primero intenta la red (así siempre ves la última versión) y, si no hay conexión, usa la copia guardada.
   Los vídeos no se guardan, porque ocupan mucho. */
const CACHE = "rmi-v6";
const PAGES = ["./", "./index.html", "./aula-infortec.html", "./aula-multimedia.html", "./sala-profesorado.html",
               "./aula-edit.html", "./ciclo-i.html", "./ciclo-ii.html",
               "./aulas-tematicas.html", "./aula-tematica.html", "./tematicas-data.js",
               "./img/pc-profesorado.png", "./img/pizarra-smart.png", "./manifest.json", "./rmi-sync.js",
               "./icons/icon-192.png", "./icons/icon-512.png",
               "./img/aula-infortec.jpg", "./img/aula-multimedia.jpg", "./img/sala-profesorado.jpg",
               "./img/aula-edit.jpg", "./img/ciclo-i.jpg", "./img/ciclo-ii.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(PAGES.map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || req.url.includes(".mp4") || req.headers.has("range")) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok && new URL(req.url).origin === location.origin) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return res;
    }).catch(() => caches.match(req, {ignoreSearch: true}))
  );
});
