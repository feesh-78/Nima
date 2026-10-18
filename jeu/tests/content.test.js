/* Vérifie le catalogue des tenues (data/outfits.json), pour qu'un ajout
   (à la main ou par l'agent de nuit) ne casse jamais le jeu. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { STARTER_OUTFIT } from "../js/systems/save-format.js";

const root = new URL("../", import.meta.url);
const { outfits } = JSON.parse(readFileSync(new URL("data/outfits.json", root), "utf8"));

test("chaque tenue est complète et son image existe", () => {
  const ids = outfits.map((o) => o.id);
  assert.equal(new Set(ids).size, ids.length, "identifiant de tenue en double");
  for (const o of outfits) {
    assert.match(o.id, /^[a-z0-9-]+$/, `identifiant invalide : ${o.id}`);
    assert.ok(o.name && o.style, `${o.id} : nom ou style manquant`);
    assert.ok(Number.isInteger(o.price) && o.price >= 0, `${o.id} : prix invalide`);
    assert.ok(existsSync(new URL(o.image, root)), `${o.id} : image introuvable ${o.image}`);
  }
});

test("la tenue de départ existe et est gratuite", () => {
  const starter = outfits.find((o) => o.id === STARTER_OUTFIT);
  assert.ok(starter, "tenue de départ absente du catalogue");
  assert.equal(starter.price, 0);
  assert.ok(starter.starter);
});

test("la boutique propose au moins une tenue abordable au départ", () => {
  assert.ok(outfits.some((o) => !o.starter && o.price <= 100));
});
