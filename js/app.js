/* =======================================================================
   Site surprise 💕, Logique de l'application
   Data-driven : tout le contenu vient de quiz-data.js (CONFIG + ETAPES).
   Prend en charge :
     - choix unique (on avance automatiquement)
     - choix multiples (multi: true) avec bouton « Continuer »
     - champ libre (allowOther: true) pour compléter
   Les choix sont enregistrés dans le navigateur (localStorage).
   ======================================================================= */

(function () {
  "use strict";

  // Clé propre à chaque site (définie dans le fichier de données) pour ne pas
  // mélanger les réponses du site 1 et du site 2.
  const STORAGE_KEY = (typeof CONFIG !== "undefined" && CONFIG.storageKey)
    ? CONFIG.storageKey : "surprise-choix-v3";

  const state = {
    name: "",
    step: 0,
    answers: {},   // { etapeId: [index, ...] }  (ordre = préférence)
    others: {},    // { etapeId: "texte libre" }
    refus: {},     // { etapeId: true }  -> « non merci » sur toute la thématique
    vetos: {},     // { etapeId: [index, ...] } -> veto sur des réponses précises
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
        state.vetos = data.vetos || {};
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
    const hasVeto = getVetos(etape.id).length > 0; // n'avoir mis que des vetos compte aussi
    return hasSel || hasOther || hasVeto;
  }

  /* ----------------------- Message mignon à la validation ----------------------- */
  let sweetTimer = null;
  function showSweet(etape) {
    const pool = CONFIG.messagesMignons || [];
    let msg = etape && etape.sweet;
    if (!msg) {
      msg = pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : "J'adore ce choix 🥰";
    }
    let el = $(".sweet-pop");
    if (!el) { el = document.createElement("div"); el.className = "sweet-pop"; document.body.appendChild(el); }
    el.innerHTML = `<span class="sweet-msg">${escapeHtml(msg)}</span>`;
    void el.offsetWidth;
    el.classList.add("is-visible");
    clearTimeout(sweetTimer);
    sweetTimer = setTimeout(() => el.classList.remove("is-visible"), 1900);
  }

  /* ----------------------- Navigation écrans ----------------------- */
  function showScreen(key) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[key].classList.add("is-active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ----------------------- Écran d'accueil ----------------------- */
  function initIntro() {
    const it = $("#introTitle"); if (it) it.textContent = CONFIG.titre;
    const is = $("#introSub"); if (is) is.textContent = CONFIG.sousTitre;

    const sb = $("#startBtn");
    if (sb) sb.addEventListener("click", () => {
      if (isFinished()) { showRecap(); }
      else { showScreen("quiz"); renderStep(); }
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
    const vet = getVetos(etape.id);
    // Le veto par réponse est proposé sur les étapes à choix multiples
    const perOptionVeto = !!etape.multi;

    let hint = etape.hint ? escapeHtml(etape.hint) : "";
    if (etape.multi) {
      hint += (hint ? " " : "") +
        "<em>Classe tes envies dans l'ordre, ou mets ton veto ⛔ sur celles que tu ne veux pas 💕</em>";
    }
    const hintHtml = hint ? `<p class="q-hint">${hint}</p>` : "";

    const optionsHtml = etape.options.map((opt, i) => {
      const pos = sel.indexOf(i);
      const isVet = vet.indexOf(i) !== -1;
      const cls = (pos !== -1 ? " is-selected" : "") + (isVet ? " is-vetoed" : "");
      // Pour un choix multiple, on affiche le rang (1, 2, 3…) au lieu d'une coche
      const badge = (etape.multi && pos !== -1) ? String(pos + 1) : "✓";
      const vetoBtn = perOptionVeto ? `
            <button class="option-veto${isVet ? " is-active" : ""}" data-veto="${i}"
                    type="button" aria-label="Poser un veto sur cette option"
                    title="Non merci pour celle-ci">✕</button>` : "";
      const linkBtn = opt.link ? `
            <a class="option-link" href="${escapeHtml(opt.link)}" target="_blank"
               rel="noopener noreferrer" title="Voir l'annonce">👀 Voir</a>` : "";
      return `
        <div class="option${cls}" data-index="${i}" role="button" tabindex="0">
          <span class="option-emoji">${opt.emoji}</span>
          <span class="option-text">
            <span class="option-label">${escapeHtml(opt.label)}</span>
            ${opt.desc ? `<span class="option-desc">${escapeHtml(opt.desc)}</span>` : ""}
          </span>
          <span class="option-actions">
            ${linkBtn}
            <span class="option-check">${badge}</span>
            ${vetoBtn}
          </span>
        </div>`;
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

    // Clic / clavier sur une option (sélection + classement)
    $("#questionCard").querySelectorAll(".option").forEach((el) => {
      const idx = parseInt(el.dataset.index, 10);
      el.addEventListener("click", () => onOptionClick(etape, idx));
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOptionClick(etape, idx); }
      });
    });

    // Clic sur le veto d'une option (ne déclenche pas la sélection)
    $("#questionCard").querySelectorAll(".option-veto").forEach((vb) => {
      vb.addEventListener("click", (e) => {
        e.stopPropagation();
        onVetoClick(etape, parseInt(vb.dataset.veto, 10));
      });
    });

    // Clic sur le lien « Voir » (ouvre l'annonce sans sélectionner l'option)
    $("#questionCard").querySelectorAll(".option-link").forEach((lk) => {
      lk.addEventListener("click", (e) => e.stopPropagation());
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
          state.vetos[etape.id] = [];
          save();
          nextStep();
        }
      });
    }

    $("#backBtn").style.visibility = state.step === 0 ? "hidden" : "visible";
  }

  function getVetos(id) {
    const v = state.vetos[id];
    return Array.isArray(v) ? v : [];
  }

  // Clic sur le petit ✕ : bascule le veto sur CETTE réponse précise
  function onVetoClick(etape, idx) {
    if (isRefused(etape.id)) { delete state.refus[etape.id]; }
    const vet = getVetos(etape.id);
    const sel = getSel(etape.id);
    const vpos = vet.indexOf(idx);
    if (vpos === -1) {
      vet.push(idx);
      // une réponse vetotée ne peut pas être aussi choisie
      const spos = sel.indexOf(idx);
      if (spos !== -1) sel.splice(spos, 1);
    } else {
      vet.splice(vpos, 1);
    }
    state.vetos[etape.id] = vet;
    state.answers[etape.id] = sel;
    save();
    refreshOptions(etape);
  }

  function onOptionClick(etape, idx) {
    // choisir une option annule un éventuel « non merci » global
    if (isRefused(etape.id)) {
      delete state.refus[etape.id];
      const rb = $("#refusBtn");
      if (rb) rb.classList.remove("is-active");
    }
    const current = getSel(etape.id);

    if (etape.multi) {
      // sélectionner une réponse annule son veto éventuel
      const vet = getVetos(etape.id);
      const vpos = vet.indexOf(idx);
      if (vpos !== -1) { vet.splice(vpos, 1); state.vetos[etape.id] = vet; }
      // bascule dans le tableau (l'ordre d'ajout = ordre de préférence)
      const pos = current.indexOf(idx);
      if (pos === -1) current.push(idx); else current.splice(pos, 1);
      state.answers[etape.id] = current;
      save();
      refreshOptions(etape);
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

  // Met à jour l'état visuel des options (sélection + rang + veto)
  function refreshOptions(etape) {
    const sel = getSel(etape.id);
    const vet = getVetos(etape.id);
    document.querySelectorAll("#questionCard .option").forEach((el) => {
      const i = parseInt(el.dataset.index, 10);
      const pos = sel.indexOf(i);
      const isVet = vet.indexOf(i) !== -1;
      el.classList.toggle("is-selected", pos !== -1);
      el.classList.toggle("is-vetoed", isVet);
      const check = el.querySelector(".option-check");
      if (check && pos !== -1) check.textContent = etape.multi ? String(pos + 1) : "✓";
      const vb = el.querySelector(".option-veto");
      if (vb) vb.classList.toggle("is-active", isVet);
    });
  }

  function nextStep() {
    if (state.step < ETAPES.length - 1) {
      showSweet(ETAPES[state.step]); // petit mot mignon quand elle valide
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

  // Réinitialise complètement le questionnaire et repart de la 1re étape
  function resetQuiz() {
    state.step = 0;
    state.answers = {};
    state.others = {};
    state.refus = {};
    state.vetos = {};
    save();
    showScreen("quiz");
    renderStep();
  }

  function isFinished() {
    return ETAPES.every(isAnswered);
  }

  /* ----------------------- Résultat d'une étape ----------------------- */
  const REFUS_LABEL = "🙅 Non, pas cette fois";
  // Renvoie { refus, chosen: [..], vetoed: [..] }
  function stepResult(etape) {
    if (isRefused(etape.id)) return { refus: true, chosen: [REFUS_LABEL], vetoed: [] };
    const chosen = getSel(etape.id)
      .map((i) => etape.options[i]).filter(Boolean)
      .map((o) => o.emoji + " " + o.label);
    const other = (state.others[etape.id] || "").trim();
    if (other) chosen.push("✍️ " + other);
    const vetoed = getVetos(etape.id)
      .map((i) => etape.options[i]).filter(Boolean)
      .map((o) => o.emoji + " " + o.label);
    return { refus: false, chosen: chosen, vetoed: vetoed };
  }

  /* ----------------------- Écran récapitulatif ----------------------- */
  function showRecap() {
    $("#progressBar").style.width = "100%";

    const prenom = state.name ? state.name : "mon amour";
    $("#recapTitle").textContent = "C'est noté, " + prenom + " ! 💕";

    $("#recapList").innerHTML = ETAPES.map((etape, n) => {
      const res = stepResult(etape);
      if (!res.chosen.length && !res.vetoed.length) return "";
      let answersHtml;
      if (res.refus) {
        answersHtml = `<span class="recap-chip recap-chip--refus">${escapeHtml(res.chosen[0])}</span>`;
      } else {
        const numbered = etape.multi && res.chosen.length > 1;
        const chosenHtml = res.chosen.map((l, i) => {
          const pref = numbered ? `<span class="recap-rank">${i + 1}</span>` : "";
          return `<span class="recap-chip">${pref}${escapeHtml(l)}</span>`;
        }).join("");
        const vetoHtml = res.vetoed.map((l) =>
          `<span class="recap-chip recap-chip--veto">⛔ ${escapeHtml(l)}</span>`
        ).join("");
        answersHtml = chosenHtml + vetoHtml;
      }
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
    let txt = "💕 Mes choix pour notre soirée surprise" + (prenom ? ", " + prenom : "") + "\n";
    txt += "----------------------------------------\n\n";
    ETAPES.forEach((etape) => {
      const res = stepResult(etape);
      if (!res.chosen.length && !res.vetoed.length) return;
      txt += etape.emoji + " " + etape.question + "\n";
      if (res.refus) {
        txt += "   → " + res.chosen[0] + "\n";
      } else {
        const numbered = etape.multi && res.chosen.length > 1;
        res.chosen.forEach((l, i) => {
          txt += "   → " + (numbered ? (i + 1) + ". " : "") + l + "\n";
        });
        res.vetoed.forEach((l) => { txt += "   ⛔ (veto) " + l + "\n"; });
      }
      txt += "\n";
    });
    txt += "Hâte d'y être avec toi ! ❤️";
    return txt;
  }

  /* ----------------------- Actions du récap ----------------------- */
  function mailtoFallback() {
    const sujet = encodeURIComponent(CONFIG.sujetEmail);
    const corps = encodeURIComponent(buildSummaryText());
    window.location.href =
      "mailto:" + CONFIG.emailDestinataire + "?subject=" + sujet + "&body=" + corps;
  }

  // Envoi des choix : d'abord via FormSubmit (réception automatique par e-mail),
  // avec repli sur la messagerie du téléphone si le service échoue.
  async function sendChoices() {
    const btn = $("#sendBtn");
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = "Envoi… 💌";
    const payload = {
      _subject: CONFIG.sujetEmail,
      _template: "box",
      _captcha: "false",
      Choix: buildSummaryText(),
    };
    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/" + encodeURIComponent(CONFIG.emailDestinataire),
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      const ok = res.ok && (data.success === "true" || data.success === true || data.message);
      if (!ok) throw new Error("formsubmit");
      btn.textContent = "Envoyé 💕";
      toast("C'est envoyé, merci mon amour 💕");
      setTimeout(() => { btn.innerHTML = original; btn.disabled = false; }, 2500);
    } catch (e) {
      // Repli : on ouvre la messagerie pré-remplie
      toast("On passe par ta messagerie 💌");
      mailtoFallback();
      btn.innerHTML = original;
      btn.disabled = false;
    }
  }

  function initRecapActions() {
    // Bouton final (site 2) : mène à la page de révélation
    if (CONFIG.finalLink) {
      const actions = $(".recap-actions");
      const fb = document.createElement("button");
      fb.className = "btn btn--primary";
      fb.id = "finalBtn";
      fb.textContent = CONFIG.finalLabel || "✨ Découvrir la suite";
      fb.addEventListener("click", () => { window.location.href = CONFIG.finalLink; });
      actions.insertBefore(fb, actions.firstChild);
    }

    $("#sendBtn").addEventListener("click", sendChoices);

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

    $("#restartBtn").addEventListener("click", resetQuiz);
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
    $("#resetBtn").addEventListener("click", () => {
      if (window.confirm("Tout recommencer depuis le début ?")) resetQuiz();
    });
    spawnBackgroundHearts();
    showScreen("intro");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
