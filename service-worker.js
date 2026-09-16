const CACHE_NAME = "g_notes-v4"; // ← incrémente ce numéro à chaque déploiement important
const FICHIERS_A_METTRE_EN_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
];

self.addEventListener("install", (event) => {
  self.skipWaiting(); // force le nouveau service worker à s'activer immédiatement
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FICHIERS_A_METTRE_EN_CACHE);
    })
  );
});

self.addEventListener("activate", (event) => {
  // Supprime tous les anciens caches qui ne correspondent plus au nom actuel
  event.waitUntil(
    caches.keys().then((noms) => {
      return Promise.all(
        noms
          .filter((nom) => nom !== CACHE_NAME)
          .map((nom) => caches.delete(nom))
      );
    })
  );
  self.clients.claim(); // prend le contrôle immédiatement, sans attendre un rechargement
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((reponseEnCache) => {
      return reponseEnCache || fetch(event.request);
    })
  );
});
