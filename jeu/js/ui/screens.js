/* =======================================================================
   Écrans en HTML par-dessus le décor : accueil, nouvelle partie,
   et un « hub » provisoire qui montre que la sauvegarde fonctionne.
   ======================================================================= */

import { saveManager } from "../systems/save-manager.js";
import { formatPlayTime } from "../systems/save-format.js";

const $ = (sel) => document.querySelector(sel);

function show(id) {
  document.querySelectorAll(".screen").forEach((el) => el.classList.toggle("is-active", el.id === id));
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
  $("#hub-sessions").textContent = save.stats.sessions;
  $("#hub-created").textContent = formatDate(save.createdAt);
}

export function initScreens() {
  saveManager.onChange((save) => {
    if ($("#screen-hub").classList.contains("is-active")) renderHub(save);
  });

  $("#btn-continue").addEventListener("click", async () => {
    const save = await saveManager.continueGame();
    if (!save) return renderTitle();
    renderHub(save);
    show("screen-hub");
  });

  $("#btn-new").addEventListener("click", async () => {
    const existing = await saveManager.peek();
    $("#new-warning").hidden = !existing;
    $("#input-name").value = existing?.player.name || "Nima";
    show("screen-new");
  });

  $("#form-new").addEventListener("submit", async (e) => {
    e.preventDefault();
    $("#input-name").blur();
    const save = await saveManager.newGame($("#input-name").value);
    renderHub(save);
    show("screen-hub");
  });

  $("#btn-new-back").addEventListener("click", renderTitle);

  $("#btn-hub-back").addEventListener("click", async () => {
    await saveManager.flush();
    renderTitle();
  });

  return renderTitle();
}
