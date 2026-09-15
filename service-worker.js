const CACHE_NAME = "guitare-notes-v1";
const FICHIERS_A_METTRE_EN_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
];

// Installation : on met les fichiers de l'appli en cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FICHIERS_A_METTRE_EN_CACHE);
    })
  );
});

// À chaque requête, on sert le fichier en cache s'il existe, sinon on va sur le réseau
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((reponseEnCache) => {
      return reponseEnCache || fetch(event.request);
    })
  );
});
