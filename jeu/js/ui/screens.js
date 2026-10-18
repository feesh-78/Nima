/* =======================================================================
   Écrans en HTML par-dessus le décor : accueil, nouvelle partie,
   « Chez toi », dressing et boutique.
   ======================================================================= */

import { saveManager } from "../systems/save-manager.js";
import {
  formatPlayTime, buyOutfit, wearOutfit, canAfford, giftAvailable, claimDailyGift, DAILY_GIFT_COINS,
} from "../systems/save-format.js";
import { loadOutfits } from "../systems/content.js";
import { showError, toast } from "./toast.js";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

let outfits = [];
const outfitById = (id) => outfits.find((o) => o.id === id);

function show(id) {
  $$(".screen").forEach((el) => el.classList.toggle("is-active", el.id === id));
}

/* Branche une action sur un élément : bouton désactivé pendant l'action,
   et message visible en cas de problème. */
function on(target, event, action) {
  const el = typeof target === "string" ? $(target) : target;
  el.addEventListener(event, async (e) => {
    if (event === "submit") e.preventDefault();
    const btn = el.tagName === "FORM" ? el.querySelector("[type=submit]") : el;
    if (btn.disabled) return;
    btn.disabled = true;
    try {
      await action(e);
    } catch (err) {
      showError(err);
    } finally {
      btn.disabled = false;
    }
  });
}

function sparkle() {
  navigator.vibrate?.(12);
}

/* ---------- Accueil ---------- */

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

/* ---------- Infos communes (pièces, paillettes) ---------- */

function renderWallet(save) {
  $$(".js-coins").forEach((el) => { el.textContent = save.wallet.coins; });
  $$(".js-sparkles").forEach((el) => { el.textContent = save.wallet.sparkles; });
}

/* ---------- Chez toi ---------- */

function renderHub(save) {
  const worn = outfitById(save.outfit) || outfits[0];
  $("#hub-name").textContent = save.player.name;
  $("#hub-heroine").src = worn.image;
  $("#hub-caption").textContent = `Tenue du jour : ${worn.name}`;
  const gift = $("#btn-gift");
  gift.classList.toggle("has-badge", giftAvailable(save));
  renderWallet(save);
}

async function openHub() {
  outfits = await loadOutfits();
  renderHub(saveManager.save);
  show("screen-hub");
}

/* ---------- Dressing ---------- */

let selectedOutfit = null;

function renderWardrobe(save) {
  const owned = outfits.filter((o) => save.wardrobe.includes(o.id));
  const current = outfitById(selectedOutfit) || outfitById(save.outfit);
  $("#wardrobe-preview").src = current.image;
  $("#wardrobe-label").textContent = `${current.name} · ${current.style}`;
  $("#wardrobe-list").innerHTML = owned.map((o) => `
    <button class="thumb${o.id === current.id ? " is-selected" : ""}" data-outfit="${o.id}" aria-label="${o.name}">
      <img src="${o.image}" alt="" />
      ${o.id === save.outfit ? `<span class="thumb-badge">Portée</span>` : ""}
    </button>`).join("");
  const btn = $("#btn-wear");
  const isWorn = current.id === save.outfit;
  btn.textContent = isWorn ? "Tu la portes déjà ✨" : "Porter cette tenue";
  btn.classList.toggle("btn--ghost", isWorn);
  btn.classList.toggle("btn--primary", !isWorn);
  renderWallet(save);
}

function openWardrobe() {
  selectedOutfit = saveManager.save.outfit;
  renderWardrobe(saveManager.save);
  show("screen-wardrobe");
}

/* ---------- Boutique ---------- */

function renderShop(save) {
  $("#shop-list").innerHTML = outfits.filter((o) => !o.starter).map((o) => {
    const owned = save.wardrobe.includes(o.id);
    const afford = canAfford(save, o);
    const action = owned
      ? `<span class="shop-owned">✓ Dans ton dressing</span>`
      : `<button class="btn btn--small${afford ? " btn--buy" : " btn--locked"}" data-buy="${o.id}">💰 ${o.price}</button>`;
    return `
      <article class="shop-card${owned ? " is-owned" : ""}">
        <div class="shop-img"><img src="${o.image}" alt="" /></div>
        <div class="shop-info">
          <span class="shop-style">${o.style}</span>
          <h3 class="shop-name">${o.name}</h3>
          ${action}
        </div>
      </article>`;
  }).join("");
  renderWallet(save);
}

function openShop() {
  renderShop(saveManager.save);
  show("screen-shop");
}

/* ---------- Branchements ---------- */

async function enterGame() {
  await openHub();
}

export function initScreens() {
  saveManager.onChange((save) => {
    renderWallet(save);
    if ($("#screen-hub").classList.contains("is-active")) renderHub(save);
  });

  on("#btn-continue", "click", async () => {
    const save = await saveManager.continueGame();
    if (!save) {
      await renderTitle();
      throw new Error("partie introuvable sur ce téléphone");
    }
    await enterGame();
  });

  on("#btn-new", "click", async () => {
    const existing = await saveManager.peek();
    $("#new-warning").hidden = !existing;
    $("#input-name").value = existing?.player.name || "Nima";
    show("screen-new");
  });

  on("#form-new", "submit", async () => {
    $("#input-name").blur();
    await saveManager.newGame($("#input-name").value);
    await enterGame();
    toast("Bienvenue à Nini City ! Ouvre ton cadeau du jour 🎁");
  });

  on("#btn-new-back", "click", renderTitle);

  on("#btn-home", "click", async () => {
    await saveManager.flush().catch(showError);
    await renderTitle();
  });

  $$(".js-back").forEach((btn) => on(btn, "click", openHub));
  on("#btn-wardrobe", "click", openWardrobe);
  on("#btn-shop", "click", openShop);

  on("#btn-gift", "click", () => {
    if (!giftAvailable(saveManager.save)) {
      toast("Tu as déjà ouvert ton cadeau aujourd'hui. Reviens demain 💕");
      return;
    }
    saveManager.update(claimDailyGift);
    sparkle();
    toast(`🎁 +${DAILY_GIFT_COINS} pièces ! À demain pour un nouveau cadeau.`);
  });

  $("#wardrobe-list").addEventListener("click", (e) => {
    const thumb = e.target.closest("[data-outfit]");
    if (!thumb) return;
    selectedOutfit = thumb.dataset.outfit;
    renderWardrobe(saveManager.save);
  });

  on("#btn-wear", "click", () => {
    if (selectedOutfit === saveManager.save.outfit) return;
    const save = saveManager.update((s) => wearOutfit(s, selectedOutfit));
    sparkle();
    renderWardrobe(save);
    toast("Trop belle ✨");
  });

  $("#shop-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-buy]");
    if (!btn) return;
    const outfit = outfitById(btn.dataset.buy);
    if (!canAfford(saveManager.save, outfit)) {
      const missing = outfit.price - saveManager.save.wallet.coins;
      toast(`Il te manque ${missing} pièces. Ouvre ton cadeau du jour 🎁`);
      return;
    }
    try {
      const save = saveManager.update((s) => wearOutfit(buyOutfit(s, outfit), outfit.id));
      sparkle();
      renderShop(save);
      toast(`« ${outfit.name} » est à toi, et tu la portes déjà ✨`);
    } catch (err) {
      showError(err);
    }
  });

  return renderTitle().catch(showError);
}
