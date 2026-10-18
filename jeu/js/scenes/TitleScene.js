/* =======================================================================
   Décor animé de l'écran d'accueil (Phaser) : ciel du soir fuchsia,
   Nini City illuminée de néons et paillettes qui scintillent. L'interface (boutons,
   textes) est en HTML par-dessus, voir js/ui/screens.js.
   ======================================================================= */

/* global Phaser */

const SKY_TOP = 0x3a0d5c; // violet nuit
const SKY_BOTTOM = 0xff3d9a; // rose fluo
const BUILDINGS_BACK = 0x7a2a8e;
const BUILDINGS_FRONT = 0x4a1466;
const NEONS = [0xff7ad0, 0x7af3ff, 0xfff27a, 0xffffff];

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("title");
  }

  create() {
    this.reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    this.draw();
    this.scale.on("resize", () => this.draw());
  }

  /* Redessine tout le décor à la taille de l'écran (rotation, barre Safari…). */
  draw() {
    this.children.removeAll(true);
    this.tweens.killAll();
    const { width: w, height: h } = this.scale;

    const sky = this.add.graphics();
    sky.fillGradientStyle(SKY_TOP, SKY_TOP, SKY_BOTTOM, SKY_BOTTOM, 1);
    sky.fillRect(0, 0, w, h);

    // Halos doux façon « bokeh »
    for (let i = 0; i < 7; i++) {
      const halo = this.add.circle(
        Phaser.Math.Between(0, w),
        Phaser.Math.Between(0, h * 0.6),
        Phaser.Math.Between(40, 110),
        0xff9fd8,
        0.16,
      );
      if (!this.reducedMotion) {
        this.tweens.add({
          targets: halo,
          y: halo.y + Phaser.Math.Between(-30, 30),
          alpha: 0.08,
          duration: Phaser.Math.Between(4000, 7000),
          yoyo: true,
          repeat: -1,
          ease: "Sine.inOut",
        });
      }
    }

    this.drawSkyline(h * 0.74, BUILDINGS_BACK, 0.55, false);
    this.drawSkyline(h * 0.8, BUILDINGS_FRONT, 0.85, true);

    // Trottoir
    this.add.rectangle(0, h * 0.8, w, h * 0.2, 0x2a0b3d).setOrigin(0, 0);
    this.add.rectangle(0, h * 0.8, w, 3, 0xff7ad0, 0.9).setOrigin(0, 0);

    this.spawnSparkles(w, h);
  }

  drawSkyline(baseY, color, maxHeightRatio, withWindows) {
    const { width: w, height: h } = this.scale;
    const g = this.add.graphics();
    let x = -10;
    while (x < w + 10) {
      const bw = Phaser.Math.Between(34, 70);
      const bh = Phaser.Math.Between(h * 0.08, h * 0.32 * maxHeightRatio);
      g.fillStyle(color, 1);
      g.fillRoundedRect(x, baseY - bh, bw, bh + 4, { tl: 8, tr: 8, bl: 0, br: 0 });
      if (withWindows) {
        for (let wy = baseY - bh + 12; wy < baseY - 14; wy += 18) {
          for (let wx = x + 9; wx < x + bw - 12; wx += 14) {
            if (Math.random() < 0.55) {
              g.fillStyle(Phaser.Utils.Array.GetRandom(NEONS), Phaser.Math.FloatBetween(0.6, 1));
              g.fillRoundedRect(wx, wy, 6, 9, 2);
            }
          }
        }
      }
      x += bw + Phaser.Math.Between(2, 10);
    }
  }

  spawnSparkles(w, h) {
    const count = this.reducedMotion ? 8 : 22;
    for (let i = 0; i < count; i++) {
      const s = this.add.star(
        Phaser.Math.Between(0, w),
        Phaser.Math.Between(0, h * 0.85),
        4,
        1.5,
        Phaser.Math.Between(4, 8),
        0xffffff,
        Phaser.Math.FloatBetween(0.5, 0.95),
      );
      if (this.reducedMotion) continue;
      this.tweens.add({
        targets: s,
        y: s.y - Phaser.Math.Between(20, 60),
        angle: 90,
        alpha: 0.15,
        duration: Phaser.Math.Between(2500, 5000),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 2000),
        ease: "Sine.inOut",
      });
    }
  }
}
