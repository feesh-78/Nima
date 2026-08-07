/* =======================================================================
   Fond animé « lac au crépuscule » (Canvas)
   Anime n'importe quel <canvas data-lake> : ciel + eau + reflets dorés
   qui scintillent, pour un effet vidéo sans fichier externe.
   Respecte prefers-reduced-motion (rend une image fixe).
   ======================================================================= */
(function () {
  "use strict";
  var canvas = document.querySelector("canvas[data-lake]");
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext("2d");
  var reduce = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var W = 0, H = 0, dpr = 1, horizon = 0, glints = [], trees = [];

  function rand() { return Math.random(); }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    canvas.width = Math.max(1, Math.round(W * dpr));
    canvas.height = Math.max(1, Math.round(H * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    horizon = H * 0.5;
    glints = [];
    var n = Math.max(10, Math.round(W / 24));
    for (var i = 0; i < n; i++) {
      glints.push({
        x: rand() * W,
        y: horizon + rand() * (H - horizon),
        w: 24 + rand() * 110,
        p: rand() * Math.PI * 2,
        s: 0.4 + rand() * 0.9,
        drift: 6 + rand() * 16,
      });
    }
    // Ligne de sapins sur la rive (esprit forêt)
    trees = [];
    var tn = Math.max(14, Math.round(W / 20));
    for (var j = 0; j < tn; j++) {
      trees.push({
        x: rand() * (W + 40) - 20,
        h: 16 + rand() * 40,
        w: 10 + rand() * 16,
      });
    }
  }

  function pine(x, base, h, w) {
    ctx.beginPath();
    for (var k = 0; k < 3; k++) {
      var ly = base - (h * 0.32 * k);
      var lh = h * 0.55;
      var lw = w * (1 - k * 0.2);
      ctx.moveTo(x - lw / 2, ly);
      ctx.lineTo(x + lw / 2, ly);
      ctx.lineTo(x, ly - lh);
      ctx.closePath();
    }
    ctx.fill();
  }

  function drawTrees() {
    // léger liseré de rive
    ctx.fillStyle = "rgba(3, 12, 20, 0.55)";
    ctx.fillRect(0, horizon - 2, W, 4);
    // sapins en silhouette
    ctx.fillStyle = "#03101a";
    for (var i = 0; i < trees.length; i++) {
      pine(trees[i].x, horizon + 1, trees[i].h, trees[i].w);
    }
  }

  function draw(t) {
    // Ciel (crépuscule)
    var sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, "#06121a");
    sky.addColorStop(0.62, "#123048");
    sky.addColorStop(1, "#33566a");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, horizon + 1);

    // Lueur chaude sur l'horizon (soleil couchant / baie vitrée)
    var glowX = W * 0.5 + Math.sin(t * 0.00007) * W * 0.06;
    var glow = ctx.createRadialGradient(glowX, horizon, 8, glowX, horizon, W * 0.7);
    glow.addColorStop(0, "rgba(230, 192, 122, 0.42)");
    glow.addColorStop(0.5, "rgba(230, 160, 120, 0.14)");
    glow.addColorStop(1, "rgba(230, 192, 122, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, horizon + 60);

    // Sapins sur la rive (silhouettes contre la lueur)
    drawTrees();

    // Eau
    var lake = ctx.createLinearGradient(0, horizon, 0, H);
    lake.addColorStop(0, "#16384a");
    lake.addColorStop(1, "#05101a");
    ctx.fillStyle = lake;
    ctx.fillRect(0, horizon, W, H - horizon);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // Colonne de reflet doré qui ondule
    var sway = Math.sin(t * 0.0004) * W * 0.02;
    var col = ctx.createLinearGradient(0, horizon, 0, H);
    col.addColorStop(0, "rgba(230, 192, 122, 0.22)");
    col.addColorStop(1, "rgba(230, 192, 122, 0)");
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(glowX - 34 + sway, horizon);
    ctx.lineTo(glowX + 34 + sway, horizon);
    ctx.lineTo(glowX + 130 + sway, H);
    ctx.lineTo(glowX - 130 + sway, H);
    ctx.closePath();
    ctx.fill();

    // Scintillements horizontaux sur l'eau
    for (var i = 0; i < glints.length; i++) {
      var g = glints[i];
      var a = 0.05 + 0.16 * (0.5 + 0.5 * Math.sin(t * 0.001 * g.s + g.p));
      var gx = g.x + Math.sin(t * 0.0003 + g.p) * g.drift;
      var depth = (g.y - horizon) / (H - horizon); // 0 près de l'horizon
      ctx.fillStyle = "rgba(220, 232, 236, " + (a * (0.5 + depth)).toFixed(3) + ")";
      ctx.beginPath();
      ctx.ellipse(gx, g.y, g.w * 0.5, 1.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  var raf = 0;
  function loop(now) { draw(now || 0); raf = requestAnimationFrame(loop); }

  window.addEventListener("resize", function () {
    resize();
    if (reduce) draw(1200);
  });

  resize();
  if (reduce) draw(1200);
  else raf = requestAnimationFrame(loop);
})();
