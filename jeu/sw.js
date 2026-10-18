/* =======================================================================
   Service worker de Nini City : garde le jeu sur le téléphone pour
   qu'il fonctionne sans connexion.

   ⚠️ À CHAQUE MODIFICATION DU JEU :
     1) augmenter VERSION (et GAME_VERSION dans js/version.js, identique),
     2) ajouter tout nouveau fichier dans PRECACHE.
   Les tests vérifient ces deux points.
   ======================================================================= */

const VERSION = "0.2.0";
const CACHE = `nini-city-${VERSION}`;
const RUNTIME = "nini-city-runtime";

const PRECACHE = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "css/game.css",
  "js/main.js",
  "js/version.js",
  "js/scenes/TitleScene.js",
  "js/systems/content.js",
  "js/systems/save-format.js",
  "js/systems/save-manager.js",
  "js/systems/storage.js",
  "js/ui/pwa.js",
  "js/ui/screens.js",
  "js/ui/toast.js",
  "data/outfits.json",
  "assets/outfits/basique.png",
  "assets/outfits/classe.png",
  "assets/outfits/preppy.png",
  "assets/outfits/soiree.png",
  "vendor/phaser-3.90.0.min.js",
  "assets/icons/icon-180.png",
  "assets/icons/icon-192.png",
  "assets/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      cache.addAll(PRECACHE.map((url) => new Request(url, { cache: "reload" }))),
    ),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== CACHE && k !== RUNTIME).map((k) => caches.delete(k)),
      ))
      .then(() => self.clients.claim()),
  );
});

// Le jeu demande la mise à jour quand Nima touche « Mettre à jour ».
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Fichiers du jeu : d'abord la copie sur le téléphone (rapide, hors ligne).
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request, { ignoreSearch: true }).then((hit) => {
        if (hit) return hit;
        if (request.mode === "navigate") {
          return fetch(request).catch(() => caches.match("index.html"));
        }
        return fetch(request);
      }),
    );
    return;
  }

  // Polices Google : copie locale, rafraîchie en arrière-plan.
  if (url.hostname.endsWith("googleapis.com") || url.hostname.endsWith("gstatic.com")) {
    event.respondWith(
      caches.open(RUNTIME).then(async (cache) => {
        const hit = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res.ok || res.type === "opaque") cache.put(request, res.clone());
            return res;
          })
          .catch(() => hit);
        return hit || network;
      }),
    );
  }
});
