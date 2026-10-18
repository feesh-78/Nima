import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SAVE_VERSION, createNewSave, validateSave, migrateSave, touchSave,
  addPlayTime, startSession, sanitizeName, formatPlayTime,
  buyOutfit, wearOutfit, claimDailyGift, giftAvailable, dayKey, STARTER_OUTFIT, DAILY_GIFT_COINS,
} from "../js/systems/save-format.js";

test("une nouvelle partie est valide", () => {
  const save = createNewSave({ name: "Nima", now: 1000 });
  assert.deepEqual(validateSave(save), []);
  assert.equal(save.version, SAVE_VERSION);
  assert.equal(save.player.name, "Nima");
  assert.equal(save.wallet.coins, 100);
});

test("le prénom est nettoyé, Nima par défaut", () => {
  assert.equal(sanitizeName("   "), "Nima");
  assert.equal(sanitizeName(undefined), "Nima");
  assert.equal(sanitizeName("  Léa   Rose "), "Léa Rose");
  assert.equal(sanitizeName("x".repeat(40)).length, 20);
});

test("chaque sauvegarde augmente la révision", () => {
  const save = createNewSave({ now: 1000 });
  const next = touchSave(save, 2000);
  assert.equal(next.revision, save.revision + 1);
  assert.equal(next.updatedAt, 2000);
  assert.equal(save.revision, 1, "l'original n'est pas modifié");
});

test("temps de jeu et sessions", () => {
  let save = createNewSave();
  save = addPlayTime(save, 61.4);
  save = addPlayTime(save, -5);
  assert.equal(save.stats.playTimeSec, 61);
  assert.equal(startSession(save).stats.sessions, 2);
});

test("migrateSave accepte une sauvegarde actuelle", () => {
  const save = createNewSave();
  assert.deepEqual(migrateSave(save), save);
});

test("migrateSave refuse les sauvegardes illisibles ou trop récentes", () => {
  assert.throws(() => migrateSave(null));
  assert.throws(() => migrateSave({ foo: 1 }));
  assert.throws(() => migrateSave({ ...createNewSave(), version: SAVE_VERSION + 1 }));
  assert.throws(() => migrateSave({ ...createNewSave(), wallet: { coins: -3, sparkles: 0 } }));
});

test("affichage du temps de jeu", () => {
  assert.equal(formatPlayTime(30), "moins d'une minute");
  assert.equal(formatPlayTime(754), "12 min");
  assert.equal(formatPlayTime(3900), "1 h 05");
});

test("migration v1 → v2 : la partie est gardée et reçoit la tenue de base", () => {
  const v1 = {
    version: 1, createdAt: 1000, updatedAt: 2000, revision: 7,
    player: { name: "Nima" }, wallet: { coins: 100, sparkles: 5 },
    stats: { playTimeSec: 90, sessions: 5 },
  };
  const save = migrateSave(v1);
  assert.equal(save.version, SAVE_VERSION);
  assert.equal(save.stats.playTimeSec, 90);
  assert.deepEqual(save.wardrobe, [STARTER_OUTFIT]);
  assert.equal(save.outfit, STARTER_OUTFIT);
  assert.deepEqual(validateSave(save), []);
});

const ROBE = { id: "soiree", price: 150 };
const PULL = { id: "preppy", price: 60 };

test("acheter une tenue : pièces retirées, tenue ajoutée au dressing", () => {
  const save = buyOutfit(createNewSave(), PULL);
  assert.equal(save.wallet.coins, 40);
  assert.ok(save.wardrobe.includes("preppy"));
  assert.deepEqual(validateSave(save), []);
  assert.throws(() => buyOutfit(save, PULL), /déjà/);
  assert.throws(() => buyOutfit(createNewSave(), ROBE), /pièces/);
});

test("porter une tenue seulement si elle est dans le dressing", () => {
  const save = buyOutfit(createNewSave(), PULL);
  assert.equal(wearOutfit(save, "preppy").outfit, "preppy");
  assert.throws(() => wearOutfit(save, "soiree"));
});

test("cadeau du jour : une fois par jour", () => {
  const day1 = dayKey(new Date(2026, 9, 18, 23, 0));
  const day2 = dayKey(new Date(2026, 9, 19, 0, 5));
  assert.equal(day1, "2026-10-18");
  let save = claimDailyGift(createNewSave(), day1);
  assert.equal(save.wallet.coins, 100 + DAILY_GIFT_COINS);
  assert.equal(giftAvailable(save, day1), false);
  assert.throws(() => claimDailyGift(save, day1));
  save = claimDailyGift(save, day2);
  assert.equal(save.wallet.coins, 100 + 2 * DAILY_GIFT_COINS);
});
