/* =======================================================================
   Site surprise 💕 — Logique de l'application
   Data-driven : tout le contenu vient de quiz-data.js (CONFIG + ETAPES).
   Prend en charge :
     - choix unique (on avance automatiquement)
     - choix multiples (multi: true) avec bouton « Continuer »
     - champ libre (allowOther: true) pour compléter
   Les choix sont enregistrés dans le navigateur (localStorage).
   ======================================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "surprise-choix-v2";

  const state = {
    name: "",
    step: 0,
    answers: {},   // { etapeId: [index, ...] }  (toujours un tableau)
    others: {},    // { etapeId: "texte libre" }
  };

  const $ = (sel) => document.querySelector(sel);

  const screens = {
    intro: $("#screen-intro"),
    quiz: $("#screen-quiz"),
    recap: $("#screen-recap"),
  };

  /* ----------------------- Persistance ----------------------- */
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }
  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (data && typeof data === "object") {
        state.name = data.name || "";
        state.answers = data.answers || {};
        state.others = data.others || {};
        state.step = data.step || 0;
      }
    } catch (e) {}
  }

  /* ----------------------- Helpers réponses ----------------------- */
  function getSel(id) {
    const v = state.answers[id];
    return Array.isArray(v) ? v : (typeof v === "number" ? [v] : []);
  }
  function isAnswered(etape) {
    const hasSel = getSel(etape.id).length > 0;
    const hasOther = etape.allowOther && (state.others[etape.id] || "").trim().length > 0;
    return hasSel || hasOther;
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

    const pct = Math.round((state.step / total) * 100);
    $("#progressBar").style.width = pct + "%";
    $("#progressText").textContent = "Étape " + (state.step + 1) + " sur " + total;

    const sel = getSel(etape.id);

    let hint = etape.hint ? escapeHtml(etape.hint) : "";
    if (etape.multi) {
      hint += (hint ? " " : "") + "<em>Plusieurs réponses possibles 💕</em>";
    }
    const hintHtml = hint ? `<p class="q-hint">${hint}</p>` : "";

    const optionsHtml = etape.options.map((opt, i) => {
      const selected = sel.indexOf(i) !== -1 ? " is-selected" : "";
      const mark = etape.multi ? "" : ""; // la coche ✓ suffit
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

    const otherHtml = etape.allowOther ? `
      <label class="field field--other">
        <input type="text" class="field-input" id="otherInput"
               placeholder="${escapeHtml(etape.otherPlaceholder || "Complète ici…")}"
               maxlength="80" value="${escapeHtml(state.others[etape.id] || "")}" />
      </label>` : "";

    // Bouton continuer : uniquement pour multi / champ libre
    const continueHtml = (etape.multi || etape.allowOther) ? `
      <button class="btn btn--primary continue-btn" id="continueBtn">
        Continuer <span class="btn-arrow">→</span>
      </button>` : "";

    $("#questionCard").innerHTML = `
      <span class="q-emoji">${etape.emoji}</span>
      <h2 class="q-title">${escapeHtml(etape.question)}</h2>
      ${hintHtml}
      <div class="options">${optionsHtml}</div>
      ${otherHtml}
      ${continueHtml}
    `;

    // Clic sur une option
    $("#questionCard").querySelectorAll(".option").forEach((btn) => {
      btn.addEventListener("click", () => onOptionClick(etape, parseInt(btn.dataset.index, 10)));
    });

    // Champ libre
    const other = $("#otherInput");
    if (other) {
      other.addEventListener("input", () => {
        state.others[etape.id] = other.value;
        save();
      });
    }

    // Bouton continuer
    const cont = $("#continueBtn");
    if (cont) {
      cont.addEventListener("click", () => {
        if (!isAnswered(etape)) {
          toast("Choisis au moins une option 😊");
          return;
        }
        nextStep();
      });
    }

    $("#backBtn").style.visibility = state.step === 0 ? "hidden" : "visible";
  }

  function onOptionClick(etape, idx) {
    const current = getSel(etape.id);

    if (etape.multi) {
      // bascule dans le tableau
      const pos = current.indexOf(idx);
      if (pos === -1) current.push(idx); else current.splice(pos, 1);
      state.answers[etape.id] = current;
      save();
      // met à jour l'affichage de la coche sans re-render complet
      const btn = $(`#questionCard .option[data-index="${idx}"]`);
      if (btn) btn.classList.toggle("is-selected");
    } else {
      // choix unique : on enregistre et on avance
      state.answers[etape.id] = [idx];
      save();
      $("#questionCard").querySelectorAll(".option").forEach((b) => b.classList.remove("is-selected"));
      const btn = $(`#questionCard .option[data-index="${idx}"]`);
      if (btn) btn.classList.add("is-selected");
      setTimeout(nextStep, 320);
    }
  }

  function nextStep() {
    if (state.step < ETAPES.length - 1) {
      state.step++;
      save();
      renderStep();
    } else {
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
    return ETAPES.every(isAnswered);
  }

  /* ----------------------- Texte d'une réponse ----------------------- */
  function answerLabels(etape) {
    const parts = getSel(etape.id).map((i) => etape.options[i]).filter(Boolean);
    const labels = parts.map((o) => o.emoji + " " + o.label);
    const other = (state.others[etape.id] || "").trim();
    if (other) labels.push("✍️ " + other);
    return labels;
  }

  /* ----------------------- Écran récapitulatif ----------------------- */
  function showRecap() {
    $("#progressBar").style.width = "100%";

    const prenom = state.name ? state.name : "toi";
    $("#recapTitle").textContent = "C'est noté, " + prenom + " ! 💕";

    $("#recapList").innerHTML = ETAPES.map((etape, n) => {
      const labels = answerLabels(etape);
      if (!labels.length) return "";
      const answersHtml = labels
        .map((l) => `<span class="recap-chip">${escapeHtml(l)}</span>`)
        .join("");
      return `
        <li class="recap-item" style="animation-delay:${n * 0.06}s">
          <span class="recap-item-emoji">${etape.emoji}</span>
          <span class="recap-item-text">
            <span class="recap-item-q">${escapeHtml(etape.question)}</span>
            <span class="recap-item-a">${answersHtml}</span>
          </span>
        </li>`;
    }).join("");

    showScreen("recap");
    launchConfetti();
  }

  /* ----------------------- Récap en texte ----------------------- */
  function buildSummaryText() {
    const prenom = state.name || "";
    let txt = "💕 Mes choix pour notre soirée surprise" + (prenom ? " — " + prenom : "") + "\n";
    txt += "----------------------------------------\n\n";
    ETAPES.forEach((etape) => {
      const labels = answerLabels(etape);
      if (!labels.length) return;
      txt += etape.emoji + " " + etape.question + "\n";
      labels.forEach((l) => { txt += "   → " + l + "\n"; });
      txt += "\n";
    });
    txt += "Hâte d'y être avec toi ! ❤️";
    return txt;
  }

  /* ----------------------- Actions du récap ----------------------- */
  function initRecapActions() {
    $("#sendBtn").addEventListener("click", () => {
      const sujet = encodeURIComponent(CONFIG.sujetEmail);
      const corps = encodeURIComponent(buildSummaryText());
      window.location.href =
        "mailto:" + CONFIG.emailDestinataire + "?subject=" + sujet + "&body=" + corps;
    });

    $("#copyBtn").addEventListener("click", async () => {
      const text = buildSummaryText();
      try {
        await navigator.clipboard.writeText(text);
        toast("Copié ! Tu peux le coller où tu veux 💕");
      } catch (e) {
        fallbackCopy(text);
        toast("Copié !");
      }
    });

    $("#restartBtn").addEventListener("click", () => {
      state.step = 0;
      state.answers = {};
      state.others = {};
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

  /* ----------------------- Effets ----------------------- */
  function toast(message) {
    let el = $(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; document.body.appendChild(el); }
    el.textContent = message;
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
    for (let i = 0; i < 14; i++) {
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

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
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
