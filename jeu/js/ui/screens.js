/* =======================================================================
   Écrans en HTML par-dessus le décor : accueil, nouvelle partie,
   et un « hub » provisoire qui montre que la sauvegarde fonctionne.
   ======================================================================= */

import { saveManager } from "../systems/save-manager.js";
import { formatPlayTime } from "../systems/save-format.js";
import { showError } from "./toast.js";

const $ = (sel) => document.querySelector(sel);

function show(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.toggle("is-active", el.id === id));
}

/* Branche une action sur un élément : bouton désactivé pendant l'action,
   et message visible en cas de problème. */
function on(sel, event, action) {
  const el = $(sel);
  el.addEventListener(event, async (e) => {
    if (event === "submit") e.preventDefault();
    const btn = el.tagName === "FORM" ? el.querySelector("[type=submit]") : el;
    if (btn.disabled) return;
    btn.disabled = true;
    try {
      await action();
    } catch (err) {
      showError(err);
    } finally {
      btn.disabled = false;
    }
  });
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

async function renderTitle() {
  saveManager.stop();
  const existing = await saveManager.peek();
  const btnContinue = $("#btn-continue");
  const btnNew = $("#btn-new");
  if (existing) {
    btnContinue.hidden = false;
    $("#continue-detail").textContent =
      `${existing.player.name} · ${formatPlayTime(existing.stats.playTimeSec)} de jeu`;
    btnNew.classList.replace("btn--primary", "btn--ghost");
  } else {
    btnContinue.hidden = true;
    btnNew.classList.replace("btn--ghost", "btn--primary");
  }
  show("screen-title");
}

function renderHub(save) {
  $("#hub-name").textContent = save.player.name;
  $("#hub-coins").textContent = save.wallet.coins;
  $("#hub-sparkles").textContent = save.wallet.sparkles;
  $("#hub-playtime").textContent = formatPlayTime(save.stats.playTimeSec);
  $("#hub-created").textContent = formatDate(save.createdAt);
}

export function initScreens() {
  saveManager.onChange((save) => {
    if ($("#screen-hub").classList.contains("is-active")) renderHub(save);
  });

  on("#btn-continue", "click", async () => {
    const save = await saveManager.continueGame();
    if (!save) {
      await renderTitle();
      throw new Error("partie introuvable sur ce téléphone");
    }
    renderHub(save);
    show("screen-hub");
  });

  on("#btn-new", "click", async () => {
    const existing = await saveManager.peek();
    $("#new-warning").hidden = !existing;
    $("#input-name").value = existing?.player.name || "Nima";
    show("screen-new");
  });

  on("#form-new", "submit", async () => {
    $("#input-name").blur();
    const save = await saveManager.newGame($("#input-name").value);
    renderHub(save);
    show("screen-hub");
  });

  on("#btn-new-back", "click", renderTitle);

  on("#btn-hub-back", "click", async () => {
    await saveManager.flush().catch(showError);
    await renderTitle();
  });

  return renderTitle().catch(showError);
}
