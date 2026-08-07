/* =======================================================================
   CONFIGURATION, SITE 2 (Partie 2) 💕🔥
   Les envies : tenues, films par genre, repas par moment, câlin, jouets…
   puis la révélation (page reveal.html).
   ======================================================================= */

const CONFIG = {
  emailDestinataire: "philippe.bussac@jalyastudio.com",
  sujetEmail: "💕 Mes choix (Partie 2), nos envies",

  titre: "La partie 2 t'attend… 🔥",
  sousTitre: "Encore quelques envies rien qu'à nous, classe-les dans l'ordre que tu préfères. " +
             "Et à la fin… une surprise. ✨",

  // Clé de sauvegarde propre au site 2 (ne se mélange pas avec le site 1)
  storageKey: "surprise-p2-v1",
  // (la révélation est désormais au DÉBUT de la partie 2, plus de bouton final)

  messagesMignons: [
    "J'adore ce choix 🥰",
    "Tu me connais si bien 💕",
    "Hâte d'y être avec toi 🔥",
    "Mon cœur (et le reste) s'emballe 💓",
    "C'est noté, rien que pour toi 💌",
    "Coquine… j'aime beaucoup 😏",
    "Je craque… 😍",
  ],
};

const ETAPES = [
  {
    sweet: "Tu vas être renversante… 😍",
    id: "tenue",
    emoji: "👗",
    question: "On s'habille comment ?",
    hint: "Classe tes envies dans l'ordre. (Je m'adapte à toi 😉)",
    multi: true,
    allowOther: true,
    allowRefus: true,
    otherPlaceholder: "Une autre idée de tenue…",
    options: [
      { emoji: "👔", label: "Classe",                 desc: "Je mets une chemise… et toi, tu choisis quoi ? ✨" },
      { emoji: "👙", label: "Défilé de maillots",     desc: "Tu défiles, je regarde… 😍" },
      { emoji: "🧸", label: "Cocooning",              desc: "Gros pull, plaid, tout confort" },
      { emoji: "🔥", label: "Tenue sexy de madame",   desc: "Tu la choisis rien que pour moi" },
      { emoji: "😎", label: "Chill",                  desc: "Décontracté, à l'aise" },
    ],
  },

  /* ---------- FILMS : un genre = une étape, à classer dans l'ordre ---------- */
  {
    sweet: "Bon programme en vue 🍿",
    id: "film_gossip",
    emoji: "💅",
    question: "Gossip, on regarde quoi ?",
    hint: "Classe tes préférés, veto sur le reste, ou ajoute une idée.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Pas de Gossip",
    otherPlaceholder: "Une autre idée Gossip…",
    options: [
      { emoji: "🕵️", label: "Suis-je mauvais ?",  desc: "Le doc/série qui fait jaser" },
      { emoji: "🎙️", label: "Sh*t N Gigs",        desc: "Le podcast qui régale" },
      { emoji: "📺", label: "Télé-réalité",        desc: "Guilty pleasure assumé" },
      { emoji: "👑", label: "La Chronique des Bridgerton", desc: "Romance et scandales" },
    ],
  },
  {
    id: "film_humour",
    emoji: "😂",
    question: "Humour, on rit avec quoi ?",
    hint: "Classe tes préférés, veto sur le reste, ou ajoute une idée.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Pas d'humour ce soir",
    otherPlaceholder: "Un autre truc drôle…",
    options: [
      { emoji: "🎤", label: "One man show",         desc: "Fary ? (je choisis lequel)" },
      { emoji: "👨‍👩‍👧", label: "Ma famille d'abord", desc: "Le classique réconfortant" },
      { emoji: "🖤", label: "Black-ish",            desc: "Drôle et attachant" },
      { emoji: "🤣", label: "Un film avec Kevin Hart", desc: "Fou rire garanti" },
    ],
  },
  {
    id: "film_afro",
    emoji: "🌍",
    question: "Afro romantique, on choisit quoi ?",
    hint: "Classe tes préférés, veto sur le reste, ou ajoute une idée.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Pas celui-là",
    otherPlaceholder: "Une autre idée afro romantique…",
    options: [
      { emoji: "🐸", label: "La Princesse et la Grenouille", desc: "Disney afro, tout doux" },
      { emoji: "💃", label: "Sistas",               desc: "La série qui accroche" },
      { emoji: "💑", label: "Think Like a Man Too", desc: "Comédie romantique" },
    ],
  },
  {
    id: "film_action",
    emoji: "💥",
    question: "Action, on part sur quoi ?",
    hint: "Classe tes préférés, veto sur le reste, ou ajoute une idée.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Pas d'action",
    otherPlaceholder: "Une idée, une envie ?",
    options: [
      { emoji: "🏰", label: "Un Disney",            desc: "Aventure et grand spectacle" },
      { emoji: "🎬", label: "Une série avec Kevin Hart", desc: "Rythmé et fun" },
    ],
  },
  {
    sweet: "Coquine… j'aime beaucoup 😏🔥",
    id: "film_hot",
    emoji: "🔞",
    question: "Pour pimenter, on regarde quoi ? 🔞",
    hint: "Rien d'obligé. Classe, veto, ou propose. 😉",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Rien de tout ça",
    otherPlaceholder: "Une autre envie à me souffler…",
    options: [
      { emoji: "💋", label: "Film « préliminaires »", desc: "Tout en douceur, pour chauffer" },
      { emoji: "👩‍❤️‍👨", label: "Un homme, une femme", desc: "Le classique" },
      { emoji: "👯‍♀️", label: "Plusieurs femmes, un homme", desc: "" },
      { emoji: "👯", label: "Plusieurs hommes, une femme", desc: "" },
      { emoji: "👩‍❤️‍👩", label: "Lesbienne",         desc: "" },
      { emoji: "👨‍❤️‍👨", label: "Gay",               desc: "(le gay, c'est plus dur pour moi 😂)" },
      { emoji: "🎥", label: "On fait NOTRE film",   desc: "Avec ton téléphone… et tu le gardes 😏" },
    ],
  },

  /* ---------- REPAS par moment de la journée ---------- */
  {
    sweet: "Un midi tout doux 🥙",
    id: "midi",
    emoji: "🥙",
    question: "Le midi, on grignote quoi ?",
    hint: "Classe tes envies, veto sur le reste, ou ajoute.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    otherPlaceholder: "Une autre envie pour le midi…",
    options: [
      { emoji: "🥙", label: "Mes pitas sauce cacahuète", desc: "Ma petite spécialité 😋" },
      { emoji: "🌯", label: "Pitas, autre sauce",        desc: "Dis-moi laquelle tu préfères" },
      { emoji: "🍤", label: "Amuse-gueules / finger food", desc: "Petites entrées préparées, surprise de monsieur" },
    ],
  },
  {
    id: "soir",
    emoji: "🍲",
    question: "Qu'est-ce qu'on mange le soir ?",
    multi: true,
    allowOther: true,
    allowRefus: true,
    otherPlaceholder: "Autre : ton envie, le resto qui te tente…",
    options: [
      { emoji: "🍲", label: "Afrique de l'Ouest", desc: "Je te laisse choisir, par souci de logistique" },
      { emoji: "🍣", label: "Asiatique (rolls ?)", desc: "Je te laisse choisir" },
      { emoji: "👩‍🍳", label: "Autre proposition", desc: "On échange le type de plats ? C'est toi la cheffe cuistot" },
    ],
  },
  {
    sweet: "Le réveil parfait 🥞",
    id: "brunch",
    emoji: "🥞",
    question: "Au réveil, on grignote quoi ?",
    hint: "Le brunch au lit est déjà prévu 😌 Choisis les gourmandises.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    otherPlaceholder: "Autre : une gourmandise à noter…",
    options: [
      { emoji: "🥞", label: "Pancakes",   desc: "Moelleux, sirop et gourmandise" },
      { emoji: "🍇", label: "Raisins",    desc: "À picorer à deux" },
      { emoji: "🫐", label: "Myrtilles",  desc: "Fraîches et sucrées" },
      { emoji: "🙋", label: "Je te laisse choisir", desc: "Par logistique, à toi de voir" },
    ],
  },
  {
    sweet: "Merci mon amour 💕",
    id: "oubli",
    emoji: "🤔",
    question: "Ai-je oublié quelque chose ?",
    hint: "Ajoute tout ce qui te ferait plaisir. Sinon, dis-moi que c'est parfait 💕",
    allowOther: true,
    allowRefus: true,
    refusLabel: "✅ Non, c'est parfait comme ça",
    otherPlaceholder: "Une dernière envie, une idée, un petit mot…",
    options: [],
  },
];
