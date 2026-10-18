/* =======================================================================
   Démarrage de Nini City.
   ======================================================================= */

/* global Phaser */

import "./ui/toast.js";
import { TitleScene } from "./scenes/TitleScene.js";
import { initScreens } from "./ui/screens.js";
import { initPwa } from "./ui/pwa.js";
import { GAME_VERSION } from "./version.js";

new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#f7d6de",
  scale: { mode: Phaser.Scale.RESIZE, width: "100%", height: "100%" },
  banner: false,
  scene: [TitleScene],
});

document.querySelectorAll("[data-version]").forEach((el) => { el.textContent = `v${GAME_VERSION}`; });

initPwa();
initScreens();

// Empêche le zoom par pincement de Safari (iOS ignore user-scalable=no).
document.addEventListener("gesturestart", (e) => e.preventDefault());
