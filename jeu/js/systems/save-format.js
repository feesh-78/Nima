/* =======================================================================
   Format de la sauvegarde de Nini City (logique pure, sans navigateur).
   -----------------------------------------------------------------------
   ⚠️ Règle d'or : une mise à jour du jeu ne doit JAMAIS casser une partie.
   Si le format change :
     1) augmenter SAVE_VERSION,
     2) ajouter une fonction dans MIGRATIONS qui transforme l'ancienne
        version en la nouvelle,
     3) ajouter un test dans tests/save-format.test.js.
   ======================================================================= */

export const SAVE_VERSION = 2;

/* Une entrée par version : MIGRATIONS[n] transforme une sauvegarde v(n) en v(n+1). */
const MIGRATIONS = {
  // v1 → v2 : arrivée du dressing, de la tenue portée et du cadeau du jour.
  1: (s) => ({ ...s, version: 2, ...startingStyle() }),
};

export const STARTING_WALLET = { coins: 100, sparkles: 5 };
export const STARTER_OUTFIT = "basique";
export const DAILY_GIFT_COINS = 30;

function startingStyle() {
  return { wardrobe: [STARTER_OUTFIT], outfit: STARTER_OUTFIT, lastGiftDay: null };
}

export function sanitizeName(name) {
  const clean = String(name ?? "").replace(/\s+/g, " ").trim().slice(0, 20);
  return clean || "Nima";
}

export function createNewSave({ name, now = Date.now() } = {}) {
  return {
    version: SAVE_VERSION,
    createdAt: now,
    updatedAt: now,
    revision: 1, // augmente à chaque sauvegarde (servira à la synchro cloud)
    player: { name: sanitizeName(name) },
    wallet: { ...STARTING_WALLET },
    stats: { playTimeSec: 0, sessions: 1 },
    ...startingStyle(),
  };
}

/* Renvoie la liste des problèmes trouvés (liste vide = sauvegarde valide). */
export function validateSave(save) {
  const errors = [];
  const isNum = (v) => typeof v === "number" && Number.isFinite(v) && v >= 0;
  if (!save || typeof save !== "object") return ["la sauvegarde n'est pas un objet"];
  if (save.version !== SAVE_VERSION) errors.push(`version ${save.version} au lieu de ${SAVE_VERSION}`);
  if (!isNum(save.createdAt)) errors.push("createdAt invalide");
  if (!isNum(save.updatedAt)) errors.push("updatedAt invalide");
  if (!Number.isInteger(save.revision) || save.revision < 1) errors.push("revision invalide");
  if (typeof save.player?.name !== "string" || !save.player.name) errors.push("prénom manquant");
  if (!isNum(save.wallet?.coins)) errors.push("pièces invalides");
  if (!isNum(save.wallet?.sparkles)) errors.push("paillettes invalides");
  if (!isNum(save.stats?.playTimeSec)) errors.push("temps de jeu invalide");
  if (!Number.isInteger(save.stats?.sessions) || save.stats.sessions < 1) errors.push("sessions invalides");
  if (!Array.isArray(save.wardrobe) || !save.wardrobe.length || !save.wardrobe.every((id) => typeof id === "string")) {
    errors.push("dressing invalide");
  }
  if (!save.wardrobe?.includes(save.outfit)) errors.push("tenue portée absente du dressing");
  if (save.lastGiftDay !== null && typeof save.lastGiftDay !== "string") errors.push("cadeau du jour invalide");
  return errors;
}

/* Amène une sauvegarde (éventuellement ancienne) à la version actuelle. */
export function migrateSave(raw) {
  if (!raw || typeof raw !== "object" || !Number.isInteger(raw.version)) {
    throw new Error("Sauvegarde illisible");
  }
  if (raw.version > SAVE_VERSION) {
    throw new Error("Sauvegarde créée par une version plus récente du jeu");
  }
  let save = structuredClone(raw);
  while (save.version < SAVE_VERSION) {
    const step = MIGRATIONS[save.version];
    if (!step) throw new Error(`Migration manquante depuis la version ${save.version}`);
    save = step(save);
  }
  const errors = validateSave(save);
  if (errors.length) throw new Error("Sauvegarde invalide : " + errors.join(", "));
  return save;
}

/* Prépare une sauvegarde pour l'écriture : nouvelle révision + date. */
export function touchSave(save, now = Date.now()) {
  return { ...save, revision: save.revision + 1, updatedAt: now };
}

export function addPlayTime(save, seconds) {
  const add = Math.max(0, Math.round(seconds));
  return { ...save, stats: { ...save.stats, playTimeSec: save.stats.playTimeSec + add } };
}

export function startSession(save) {
  return { ...save, stats: { ...save.stats, sessions: save.stats.sessions + 1 } };
}

/* ---------- Dressing et boutique ---------- */

export function canAfford(save, outfit) {
  return save.wallet.coins >= outfit.price;
}

/* Achète une tenue (objet de data/outfits.json). Lève une erreur claire sinon. */
export function buyOutfit(save, outfit) {
  if (save.wardrobe.includes(outfit.id)) throw new Error("tu as déjà cette tenue");
  if (!canAfford(save, outfit)) throw new Error("pas encore assez de pièces");
  return {
    ...save,
    wallet: { ...save.wallet, coins: save.wallet.coins - outfit.price },
    wardrobe: [...save.wardrobe, outfit.id],
  };
}

export function wearOutfit(save, outfitId) {
  if (!save.wardrobe.includes(outfitId)) throw new Error("cette tenue n'est pas dans ton dressing");
  return { ...save, outfit: outfitId };
}

/* Jour local au format AAAA-MM-JJ (le cadeau revient chaque jour à minuit). */
export function dayKey(date = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

export function giftAvailable(save, today = dayKey()) {
  return save.lastGiftDay !== today;
}

export function claimDailyGift(save, today = dayKey()) {
  if (!giftAvailable(save, today)) throw new Error("cadeau déjà ouvert aujourd'hui, reviens demain");
  return {
    ...save,
    lastGiftDay: today,
    wallet: { ...save.wallet, coins: save.wallet.coins + DAILY_GIFT_COINS },
  };
}

/* 45 → "moins d'une minute", 754 → "12 min", 3900 → "1 h 05" */
export function formatPlayTime(totalSec) {
  const min = Math.floor(totalSec / 60);
  if (min < 1) return "moins d'une minute";
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
}
