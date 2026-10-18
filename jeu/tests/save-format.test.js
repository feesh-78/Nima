import { test } from "node:test";
import assert from "node:assert/strict";
import {
  SAVE_VERSION, createNewSave, validateSave, migrateSave, touchSave,
  addPlayTime, startSession, sanitizeName, formatPlayTime,
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
