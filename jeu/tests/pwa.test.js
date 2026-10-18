/* Vérifie que la version hors ligne est complète et cohérente. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { GAME_VERSION } from "../js/version.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sw = readFileSync(join(root, "sw.js"), "utf8");
const precache = [...sw.match(/const PRECACHE = \[([\s\S]*?)\];/)[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);

function listFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? listFiles(full) : [relative(root, full)];
  });
}

test("la version du service worker = la version du jeu", () => {
  assert.equal(sw.match(/const VERSION = "([^"]+)"/)[1], GAME_VERSION);
});

test("tous les fichiers listés pour le hors ligne existent", () => {
  for (const path of precache) {
    if (path === "./") continue;
    assert.ok(existsSync(join(root, path)), `fichier manquant : ${path}`);
  }
});

test("tous les fichiers du jeu sont disponibles hors ligne", () => {
  const needed = [
    "index.html", "manifest.webmanifest",
    ...["css", "js", "vendor", "assets", "data"].filter((d) => existsSync(join(root, d)))
      .flatMap((d) => listFiles(join(root, d))),
  ].filter((p) => !/\.(md|txt)$/.test(p) && !p.endsWith(".gitkeep"));
  for (const path of needed) {
    assert.ok(precache.includes(path), `à ajouter dans PRECACHE (sw.js) : ${path}`);
  }
});

test("le manifeste est valide", () => {
  const manifest = JSON.parse(readFileSync(join(root, "manifest.webmanifest"), "utf8"));
  assert.equal(manifest.display, "standalone");
  for (const icon of manifest.icons) assert.ok(existsSync(join(root, icon.src)), icon.src);
});
