/* =======================================================================
   Tout ce qui fait de Nini City une « vraie app » sur iPhone :
   - le service worker (fonctionnement hors connexion),
   - le bandeau « Nouvelle version disponible »,
   - l'aide « Ajoute le jeu à ton écran d'accueil »,
   - l'indicateur hors ligne.
   ======================================================================= */

const $ = (sel) => document.querySelector(sel);
const A2HS_KEY = "nini-city:a2hs-vu";

function toast(text, ms = 3500) {
  const el = $("#toast");
  el.textContent = text;
  el.classList.add("is-visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("is-visible"), ms);
}

function isIos() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent) ||
    (navigator.userAgent.includes("Macintosh") && navigator.maxTouchPoints > 1);
}

export function isStandalone() {
  return navigator.standalone === true || matchMedia("(display-mode: standalone)").matches;
}

function initServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  const firstInstall = !navigator.serviceWorker.controller;

  navigator.serviceWorker.register("sw.js").then((reg) => {
    const offerUpdate = (worker) => {
      $("#update-banner").hidden = false;
      $("#btn-update").onclick = () => worker.postMessage("SKIP_WAITING");
    };
    if (reg.waiting && navigator.serviceWorker.controller) offerUpdate(reg.waiting);
    reg.addEventListener("updatefound", () => {
      const worker = reg.installing;
      worker?.addEventListener("statechange", () => {
        if (worker.state !== "installed") return;
        if (navigator.serviceWorker.controller) offerUpdate(worker);
        else if (firstInstall) toast("Nini City fonctionne maintenant sans connexion ✨");
      });
    });
    // Vérifie s'il y a une nouvelle version à chaque retour dans l'app.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") reg.update().catch(() => {});
    });
  }).catch((err) => console.warn("[pwa] service worker non enregistré :", err));

  let reloading = false;
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (firstInstall || reloading) return;
    reloading = true;
    location.reload();
  });
}

function initInstallHint() {
  const sheet = $("#a2hs");
  const open = () => { sheet.hidden = false; };
  const close = () => {
    sheet.hidden = true;
    try { localStorage.setItem(A2HS_KEY, "1"); } catch { /* rien */ }
  };
  $("#btn-a2hs-close").addEventListener("click", close);

  if (isStandalone()) return;
  const link = $("#btn-install");
  link.hidden = false;
  link.addEventListener("click", open);

  let seen = false;
  try { seen = localStorage.getItem(A2HS_KEY) === "1"; } catch { /* rien */ }
  if (isIos() && !seen) setTimeout(open, 1200);
}

function initOnlineStatus() {
  const pill = $("#offline-pill");
  const update = () => { pill.hidden = navigator.onLine; };
  addEventListener("online", update);
  addEventListener("offline", update);
  update();
}

export function initPwa() {
  initServiceWorker();
  initInstallHint();
  initOnlineStatus();
}
