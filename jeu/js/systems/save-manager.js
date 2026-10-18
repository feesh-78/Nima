/* =======================================================================
   Gestion de la partie en cours : chargement, nouvelle partie,
   temps de jeu et sauvegarde automatique (toutes les 30 s + quand
   on quitte l'app). Aucun bouton « sauvegarder » nécessaire.
   ======================================================================= */

import { storage } from "./storage.js";
import { createNewSave, migrateSave, touchSave, addPlayTime, startSession } from "./save-format.js";

const AUTOSAVE_MS = 30_000;

class SaveManager {
  save = null;
  #lastTick = 0;
  #timers = [];
  #listeners = new Set();

  /* Lit la partie du téléphone. Renvoie null s'il n'y en a pas. */
  async peek() {
    const raw = await storage.loadCurrent();
    if (!raw) return null;
    try {
      return migrateSave(raw);
    } catch (err) {
      console.error("[sauvegarde] illisible, on la met de côté :", err);
      await storage.pushBackup(raw);
      return null;
    }
  }

  async continueGame() {
    const save = await this.peek();
    if (!save) return null;
    this.save = startSession(save);
    this.#start();
    this.flush().catch((err) => console.error("[sauvegarde]", err)); // en arrière-plan
    return this.save;
  }

  async newGame(name) {
    const previous = await storage.loadCurrent();
    if (previous) await storage.pushBackup(previous); // jamais de perte définitive
    this.save = createNewSave({ name });
    this.#start();
    this.flush().catch((err) => console.error("[sauvegarde]", err)); // en arrière-plan
    return this.save;
  }

  /* Modifie la partie (fn reçoit la sauvegarde et renvoie la nouvelle),
     prévient l'interface, puis enregistre en arrière-plan. */
  update(fn) {
    this.save = fn(this.save);
    this.#emit();
    this.flush().catch((err) => console.error("[sauvegarde]", err));
    return this.save;
  }

  /* Ajoute le temps écoulé puis écrit la sauvegarde. */
  async flush() {
    if (!this.save) return;
    this.#accumulate();
    this.save = touchSave(this.save);
    await storage.writeCurrent(this.save);
    this.#emit();
  }

  /* Prévient l'interface à chaque changement (temps de jeu, etc.). */
  onChange(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  stop() {
    this.#timers.forEach(clearInterval);
    this.#timers = [];
  }

  #start() {
    this.stop();
    this.#lastTick = performance.now();
    this.#timers.push(setInterval(() => this.flush().catch((err) => console.error("[sauvegarde]", err)), AUTOSAVE_MS));
    this.#timers.push(
      setInterval(() => {
        this.#accumulate();
        this.#emit();
      }, 1000),
    );
    storage.askPersistence();
  }

  #accumulate() {
    const now = performance.now();
    // On ne compte que le temps où l'app est réellement à l'écran.
    if (this.#lastTick && document.visibilityState === "visible") {
      const elapsed = (now - this.#lastTick) / 1000;
      if (elapsed >= 1) {
        const whole = Math.floor(elapsed);
        this.save = addPlayTime(this.save, whole);
        this.#lastTick += whole * 1000;
      }
    } else {
      this.#lastTick = now;
    }
  }

  #emit() {
    this.#listeners.forEach((fn) => fn(this.save));
  }
}

export const saveManager = new SaveManager();

// Sauvegarde quand l'app passe en arrière-plan ou se ferme.
const flushQuietly = () => saveManager.flush().catch((err) => console.error("[sauvegarde]", err));
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushQuietly();
});
addEventListener("pagehide", flushQuietly);
