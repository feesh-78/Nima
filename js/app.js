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

  const STORAGE_KEY = "surprise-choix-v3";

  const state = {
    name: "",
    step: 0,
    answers: {},   // { etapeId: [index, ...] }  (toujours un tableau)
    others: {},    // { etapeId: "texte libre" }
    refus: {},     // { etapeId: true }  -> elle a dit « non merci » à cette étape
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
        state.refus = data.refus || {};
        state.step = data.step || 0;
      }
    } catch (e) {}
  }

  /* ----------------------- Helpers réponses ----------------------- */
  function getSel(id) {
    const v = state.answers[id];
    return Array.isArray(v) ? v : (typeof v === "number" ? [v] : []);
  }
  function isRefused(id) { return state.refus[id] === true; }
  function isAnswered(etape) {
    if (isRefused(etape.id)) return true; // dire « non » est une réponse valable
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
      hint += (hint ? " " : "") +
        "<em>Choisis-en une ou plusieurs, dans l'ordre de tes envies 💕</em>";
    }
    const hintHtml = hint ? `<p class="q-hint">${hint}</p>` : "";

    const optionsHtml = etape.options.map((opt, i) => {
      const pos = sel.indexOf(i);
      const selected = pos !== -1 ? " is-selected" : "";
      // Pour un choix multiple, on affiche le rang (1, 2, 3…) au lieu d'une coche
      const badge = (etape.multi && pos !== -1) ? String(pos + 1) : "✓";
      return `
        <button class="option${selected}" data-index="${i}">
          <span class="option-emoji">${opt.emoji}</span>
          <span class="option-text">
            <span class="option-label">${escapeHtml(opt.label)}</span>
            ${opt.desc ? `<span class="option-desc">${escapeHtml(opt.desc)}</span>` : ""}
          </span>
          <span class="option-check">${badge}</span>
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

    // Bouton « Non merci » : uniquement si l'étape l'autorise (allowRefus)
    const refusActive = isRefused(etape.id) ? " is-active" : "";
    const refusHtml = etape.allowRefus ? `
      <button class="refus-btn${refusActive}" id="refusBtn">
        ${escapeHtml(etape.refusLabel || "🙅 Non merci, on passe")}
      </button>` : "";

    $("#questionCard").innerHTML = `
      <span class="q-emoji">${etape.emoji}</span>
      <h2 class="q-title">${escapeHtml(etape.question)}</h2>
      ${hintHtml}
      <div class="options">${optionsHtml}</div>
      ${otherHtml}
      ${continueHtml}
      ${refusHtml}
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
          toast("Choisis une option, ou clique sur « Non merci » 😊");
          return;
        }
        nextStep();
      });
    }

    // Bouton « Non merci »
    const refusBtn = $("#refusBtn");
    if (refusBtn) {
      refusBtn.addEventListener("click", () => {
        if (isRefused(etape.id)) {
          // annuler le refus et rester sur l'étape
          delete state.refus[etape.id];
          save();
          renderStep();
        } else {
          // enregistrer le refus, effacer les choix, et avancer
          state.refus[etape.id] = true;
          state.answers[etape.id] = [];
          state.others[etape.id] = "";
          save();
          nextStep();
        }
      });
    }

    $("#backBtn").style.visibility = state.step === 0 ? "hidden" : "visible";
  }

  function onOptionClick(etape, idx) {
    // choisir une option annule un éventuel « non merci »
    if (isRefused(etape.id)) {
      delete state.refus[etape.id];
      const rb = $("#refusBtn");
      if (rb) rb.classList.remove("is-active");
    }
    const current = getSel(etape.id);

    if (etape.multi) {
      // bascule dans le tableau (l'ordre d'ajout = ordre de préférence)
      const pos = current.indexOf(idx);
      if (pos === -1) current.push(idx); else current.splice(pos, 1);
      state.answers[etape.id] = current;
      save();
      updateOrderBadges(etape);
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

  // Met à jour l'état visuel (sélection + numéro d'ordre) des options
  function updateOrderBadges(etape) {
    const sel = getSel(etape.id);
    document.querySelectorAll("#questionCard .option").forEach((btn) => {
      const i = parseInt(btn.dataset.index, 10);
      const pos = sel.indexOf(i);
      const check = btn.querySelector(".option-check");
      if (pos !== -1) {
        btn.classList.add("is-selected");
        if (check) check.textContent = etape.multi ? String(pos + 1) : "✓";
      } else {
        btn.classList.remove("is-selected");
      }
    });
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

  /* ----------------------- Résultat d'une étape ----------------------- */
  const REFUS_LABEL = "🙅 Non, pas cette fois";
  // Renvoie { refus: bool, labels: [..] }
  function stepResult(etape) {
    if (isRefused(etape.id)) return { refus: true, labels: [REFUS_LABEL] };
    const parts = getSel(etape.id).map((i) => etape.options[i]).filter(Boolean);
    const labels = parts.map((o) => o.emoji + " " + o.label);
    const other = (state.others[etape.id] || "").trim();
    if (other) labels.push("✍️ " + other);
    return { refus: false, labels: labels };
  }

  /* ----------------------- Écran récapitulatif ----------------------- */
  function showRecap() {
    $("#progressBar").style.width = "100%";

    const prenom = state.name ? state.name : "toi";
    $("#recapTitle").textContent = "C'est noté, " + prenom + " ! 💕";

    $("#recapList").innerHTML = ETAPES.map((etape, n) => {
      const res = stepResult(etape);
      if (!res.labels.length) return "";
      const chipClass = res.refus ? "recap-chip recap-chip--refus" : "recap-chip";
      // Numérotation quand plusieurs choix (montre l'ordre de préférence)
      const numbered = etape.multi && !res.refus && res.labels.length > 1;
      const answersHtml = res.labels
        .map((l, i) => {
          const pref = numbered ? `<span class="recap-rank">${i + 1}</span>` : "";
          return `<span class="${chipClass}">${pref}${escapeHtml(l)}</span>`;
        })
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
      const res = stepResult(etape);
      if (!res.labels.length) return;
      const numbered = etape.multi && !res.refus && res.labels.length > 1;
      txt += etape.emoji + " " + etape.question + "\n";
      res.labels.forEach((l, i) => {
        const pref = numbered ? (i + 1) + ". " : "";
        txt += "   → " + pref + l + "\n";
      });
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
      state.refus = {};
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
