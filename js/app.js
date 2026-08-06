/* =======================================================================
   Site surprise 💕 — Logique de l'application
   Data-driven : tout le contenu vient de quiz-data.js (CONFIG + ETAPES).
   Les choix sont enregistrés dans le navigateur (localStorage) puis
   peuvent être envoyés par e-mail / copiés à la fin.
   ======================================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "surprise-choix-v1";

  // État courant
  const state = {
    name: "",
    step: 0,               // index dans ETAPES
    answers: {},           // { etapeId: indexOptionChoisie }
  };

  // Raccourci sélecteur
  const $ = (sel) => document.querySelector(sel);

  // Éléments
  const screens = {
    intro: $("#screen-intro"),
    quiz: $("#screen-quiz"),
    recap: $("#screen-recap"),
  };

  /* ----------------------- Persistance ----------------------- */
  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* stockage indisponible : on continue sans planter */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data && typeof data === "object") {
        state.name = data.name || "";
        state.answers = data.answers || {};
        state.step = data.step || 0;
      }
    } catch (e) { /* données corrompues : on repart de zéro */ }
  }

  /* ----------------------- Navigation écrans ----------------------- */
  function showScreen(key) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[key].classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ----------------------- Écran d'accueil ----------------------- */
  function initIntro() {
    $("#introTitle").textContent = CONFIG.titre;
    $("#introSub").textContent = CONFIG.sousTitre;

    const nameInput = $("#nameInput");
    nameInput.value = state.name;

    $("#startBtn").addEventListener("click", () => {
      state.name = nameInput.value.trim();
      save();
      // On reprend là où on s'était arrêté, sinon au début
      if (isFinished()) { showRecap(); }
      else { showScreen("quiz"); renderStep(); }
    });

    nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") $("#startBtn").click();
    });
  }

  /* ----------------------- Rendu d'une étape ----------------------- */
  function renderStep() {
    const etape = ETAPES[state.step];
    const total = ETAPES.length;

    // Progression
    const pct = Math.round((state.step / total) * 100);
    $("#progressBar").style.width = pct + "%";
    $("#progressText").textContent = "Étape " + (state.step + 1) + " sur " + total;

    // Carte question
    const card = $("#questionCard");
    const hint = etape.hint
      ? `<p class="q-hint">${escapeHtml(etape.hint)}</p>` : "";

    const optionsHtml = etape.options.map((opt, i) => {
      const selected = state.answers[etape.id] === i ? " is-selected" : "";
      return `
        <button class="option${selected}" data-index="${i}">
          <span class="option-emoji">${opt.emoji}</span>
          <span class="option-text">
            <span class="option-label">${escapeHtml(opt.label)}</span>
            ${opt.desc ? `<span class="option-desc">${escapeHtml(opt.desc)}</span>` : ""}
          </span>
          <span class="option-check">✓</span>
        </button>`;
    }).join("");

    card.innerHTML = `
      <span class="q-emoji">${etape.emoji}</span>
      <h2 class="q-title">${escapeHtml(etape.question)}</h2>
      ${hint}
      <div class="options">${optionsHtml}</div>
    `;

    // Clic sur une option
    card.querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = parseInt(btn.dataset.index, 10);
        state.answers[etape.id] = idx;
        save();

        // Feedback visuel bref puis on avance tout seul
        card.querySelectorAll(".option").forEach((b) => b.classList.remove("is-selected"));
        btn.classList.add("is-selected");

        setTimeout(nextStep, 320);
      });
    });

    // Bouton retour : caché à la 1re étape
    $("#backBtn").style.visibility = state.step === 0 ? "hidden" : "visible";
  }

  function nextStep() {
    if (state.step < ETAPES.length - 1) {
      state.step++;
      save();
      renderStep();
    } else {
      // Dernière étape terminée
      showRecap();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    if (state.step > 0) {
      state.step--;
      save();
      renderStep();
    }
  }

  function isFinished() {
    return ETAPES.every((e) => typeof state.answers[e.id] === "number");
  }

  /* ----------------------- Écran récapitulatif ----------------------- */
  function showRecap() {
    // Barre pleine
    $("#progressBar").style.width = "100%";

    const prenom = state.name ? state.name : "toi";
    $("#recapTitle").textContent = "C'est noté, " + prenom + " ! 💕";

    const list = $("#recapList");
    list.innerHTML = ETAPES.map((etape, n) => {
      const idx = state.answers[etape.id];
      const opt = etape.options[idx];
      if (!opt) return "";
      return `
        <li class="recap-item" style="animation-delay:${n * 0.06}s">
          <span class="recap-item-emoji">${opt.emoji}</span>
          <span class="recap-item-text">
            <span class="recap-item-q">${escapeHtml(etape.question)}</span>
            <span class="recap-item-a">${escapeHtml(opt.label)}</span>
          </span>
        </li>`;
    }).join("");

    showScreen("recap");
    launchConfetti();
  }

  /* ----------------------- Construction du récap texte ----------------------- */
  function buildSummaryText() {
    const prenom = state.name || "";
    let txt = "";
    txt += "💕 Mes choix pour notre soirée surprise" + (prenom ? " — " + prenom : "") + "\n";
    txt += "----------------------------------------\n\n";
    ETAPES.forEach((etape) => {
      const opt = etape.options[state.answers[etape.id]];
      if (!opt) return;
      txt += etape.emoji + " " + etape.question + "\n";
      txt += "   → " + opt.label + (opt.desc ? " (" + opt.desc + ")" : "") + "\n\n";
    });
    txt += "Hâte d'y être avec toi ! ❤️";
    return txt;
  }

  /* ----------------------- Actions du récap ----------------------- */
  function initRecapActions() {
    // Envoyer par e-mail (mailto pré-rempli)
    $("#sendBtn").addEventListener("click", () => {
      const sujet = encodeURIComponent(CONFIG.sujetEmail);
      const corps = encodeURIComponent(buildSummaryText());
      window.location.href =
        "mailto:" + CONFIG.emailDestinataire + "?subject=" + sujet + "&body=" + corps;
    });

    // Copier dans le presse-papier
    $("#copyBtn").addEventListener("click", async () => {
      const text = buildSummaryText();
      try {
        await navigator.clipboard.writeText(text);
        toast("Copié ! Tu peux le coller où tu veux 💕");
      } catch (e) {
        // Repli : sélection manuelle
        fallbackCopy(text);
        toast("Copié !");
      }
    });

    // Recommencer
    $("#restartBtn").addEventListener("click", () => {
      state.step = 0;
      state.answers = {};
      save();
      showScreen("quiz");
      renderStep();
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ----------------------- Petits effets ----------------------- */
  function toast(message) {
    let el = $(".toast");
    if (!el) {
      el = document.createElement("div");
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    // Forcer le reflow pour rejouer l'animation
    void el.offsetWidth;
    el.classList.add("is-visible");
    setTimeout(() => el.classList.remove("is-visible"), 2600);
  }

  function launchConfetti() {
    const emojis = ["💕", "💖", "💗", "🌸", "✨", "💘"];
    for (let i = 0; i < 26; i++) {
      const c = document.createElement("div");
      c.className = "confetti";
      c.textContent = emojis[i % emojis.length];
      c.style.left = Math.random() * 100 + "vw";
      c.style.animationDuration = (2.5 + Math.random() * 2) + "s";
      c.style.animationDelay = Math.random() * 0.6 + "s";
      c.style.fontSize = (16 + Math.random() * 16) + "px";
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5200);
    }
  }

  function spawnBackgroundHearts() {
    const container = $("#hearts");
    const emojis = ["💗", "💕", "💖", "🌸"];
    const COUNT = 14;
    for (let i = 0; i < COUNT; i++) {
      const h = document.createElement("div");
      h.className = "heart";
      h.textContent = emojis[i % emojis.length];
      h.style.left = Math.random() * 100 + "vw";
      h.style.fontSize = (14 + Math.random() * 20) + "px";
      h.style.animationDuration = (7 + Math.random() * 9) + "s";
      h.style.animationDelay = (Math.random() * 8) + "s";
      container.appendChild(h);
    }
  }

  /* ----------------------- Utilitaire sécurité ----------------------- */
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /* ----------------------- Démarrage ----------------------- */
  function init() {
    load();
    initIntro();
    initRecapActions();
    $("#backBtn").addEventListener("click", prevStep);
    spawnBackgroundHearts();
    showScreen("intro");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
