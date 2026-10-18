/* Petit message en bas de l'écran, et affichage des erreurs inattendues
   (pour qu'un souci sur iPhone soit visible au lieu d'un bouton qui ne fait rien). */

export function toast(text, ms = 3500) {
  const el = document.querySelector("#toast");
  if (!el) return;
  el.textContent = text;
  el.classList.add("is-visible");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove("is-visible"), ms);
}

export function showError(err) {
  console.error(err);
  const message = err?.message || String(err);
  toast(`Oups, un souci : ${message}. Réessaie, et si ça continue, envoie-moi une capture 📸`, 8000);
}

addEventListener("error", (e) => {
  if (!e.error && /^Script error|ResizeObserver/.test(e.message)) return; // erreurs sans détail, inoffensives
  showError(e.error || e.message);
});
addEventListener("unhandledrejection", (e) => showError(e.reason));
