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

export const SAVE_VERSION = 1;

/* Une entrée par version : MIGRATIONS[n] transforme une sauvegarde v(n) en v(n+1).
   Exemple pour plus tard :
   1: (s) => ({ ...s, version: 2, wardrobe: [] }), */
const MIGRATIONS = {};

export const STARTING_WALLET = { coins: 100, sparkles: 5 };

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

/* 45 → "moins d'une minute", 754 → "12 min", 3900 → "1 h 05" */
export function formatPlayTime(totalSec) {
  const min = Math.floor(totalSec / 60);
  if (min < 1) return "moins d'une minute";
  if (min < 60) return `${min} min`;
  return `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;
}
