/* =======================================================================
   Petit "rideau" de confidentialité (mot de passe côté client).
   NB : ce n'est pas un coffre-fort (le repo est public), mais ça bloque
   l'accès normal au site. Le mot de passe n'est pas stocké en clair.
   Saisie mémorisée par appareil (localStorage).
   ======================================================================= */
(function () {
  "use strict";
  var KEY = "nima-gate-v1";
  var EXPECT = "7e7735d6"; // empreinte du mot de passe
  function h(s) {
    var hash = 5381;
    for (var i = 0; i < s.length; i++) { hash = ((hash << 5) + hash) + s.charCodeAt(i); hash = hash & 0xffffffff; }
    return (hash >>> 0).toString(16);
  }
  var hide = document.getElementById("gate-hide");
  function reveal() { if (hide && hide.parentNode) hide.parentNode.removeChild(hide); }

  var ok = false;
  try { ok = localStorage.getItem(KEY) === EXPECT; } catch (e) {}
  if (ok) { reveal(); return; }

  var ov = document.createElement("div");
  ov.setAttribute("style",
    "position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;" +
    "padding:24px;background:linear-gradient(135deg,#3a1020,#5a1730);" +
    "font-family:-apple-system,BlinkMacSystemFont,'Manrope',system-ui,sans-serif;");
  ov.innerHTML =
    '<div style="background:#fff;border-radius:22px;box-shadow:0 20px 60px rgba(0,0,0,.35);max-width:340px;width:100%;padding:28px 24px;text-align:center;">' +
      '<div style="font-size:40px;margin-bottom:6px;">🔒💕</div>' +
      '<div style="font-family:Fraunces,Georgia,serif;font-size:23px;font-weight:600;color:#7a1438;margin-bottom:6px;">Espace privé</div>' +
      '<div style="font-size:13.5px;color:#9a7080;margin-bottom:16px;line-height:1.4;">Entre le mot de passe pour continuer 😊</div>' +
      '<input id="gate-pass" type="password" autocomplete="off" placeholder="Mot de passe" ' +
        'style="width:100%;padding:12px 14px;font-size:16px;border:1.5px solid #f0aec2;border-radius:12px;background:#fff6f9;color:#3a1020;outline:none;text-align:center;margin-bottom:10px;" />' +
      '<div id="gate-msg" style="height:16px;font-size:12.5px;color:#c23b6a;margin-bottom:8px;"></div>' +
      '<button id="gate-btn" style="width:100%;padding:12px;font-size:15px;font-weight:800;border:none;border-radius:12px;background:#c23b6a;color:#fff;cursor:pointer;">Entrer 💕</button>' +
    '</div>';
  document.documentElement.appendChild(ov);

  var input = ov.querySelector("#gate-pass");
  var msg = ov.querySelector("#gate-msg");
  function tryit() {
    if (h(input.value.trim()) === EXPECT) {
      try { localStorage.setItem(KEY, EXPECT); } catch (e) {}
      if (ov.parentNode) ov.parentNode.removeChild(ov);
      reveal();
    } else {
      msg.textContent = "Oups, ce n'est pas ça 🙈";
      input.value = ""; input.focus();
    }
  }
  ov.querySelector("#gate-btn").addEventListener("click", tryit);
  input.addEventListener("keydown", function (e) { if (e.key === "Enter") tryit(); });
  setTimeout(function () { input.focus(); }, 50);
})();
