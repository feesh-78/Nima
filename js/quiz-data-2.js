/* =======================================================================
   CONFIGURATION — SITE 2 (Partie 2) 💕🔥
   Les envies : tenues, films par genre, repas par moment, câlin, jouets…
   puis la révélation (page reveal.html).
   ======================================================================= */

const CONFIG = {
  emailDestinataire: "philippe.bussac@jalyastudio.com",
  sujetEmail: "💕 Mes choix (Partie 2) — nos envies",

  titre: "La partie 2 t'attend… 🔥",
  sousTitre: "Encore quelques envies rien qu'à nous — classe-les dans l'ordre que tu préfères. " +
             "Et à la fin… une surprise. ✨",

  // Clé de sauvegarde propre au site 2 (ne se mélange pas avec le site 1)
  storageKey: "surprise-p2-v1",

  // Bouton final après le récap : mène à la révélation
  finalLink: "reveal.html",
  finalLabel: "✨ Découvrir ta surprise",

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
    question: "Gossip — on regarde quoi ?",
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
    question: "Humour — on rit avec quoi ?",
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
    question: "Afro romantique — on choisit quoi ?",
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
    question: "Action — on part sur quoi ?",
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
    question: "Pour pimenter — on regarde quoi ? 🔞",
    hint: "Rien d'obligé. Classe, veto, ou propose. 😉",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Rien de tout ça",
    otherPlaceholder: "Une autre envie à me souffler…",
    options: [
      { emoji: "💋", label: "Film « préliminaires »", desc: "Tout en douceur, pour chauffer" },
      { emoji: "👩‍❤️‍💋‍👨", label: "Plusieurs femmes, un homme", desc: "" },
      { emoji: "👩‍❤️‍👩", label: "Plusieurs hommes, une femme", desc: "" },
      { emoji: "🌈", label: "Lesbien",              desc: "(le gay, c'est plus dur pour moi 😂)" },
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
      { emoji: "🍤", label: "Amuse-gueules / finger food", desc: "Petites entrées préparées — surprise de monsieur" },
    ],
  },
  {
    id: "soir",
    emoji: "🍲",
    question: "Le soir : plat africain de l'Ouest",
    hint: "Classe tes envies, veto, ou laisse-toi choisir le plat.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    otherPlaceholder: "Un plat qui te fait envie…",
    options: [
      { emoji: "🥜", label: "Mafé",             desc: "Sauce arachide, fondant" },
      { emoji: "🐟", label: "Thieboudienne",    desc: "Riz au poisson, le classique" },
      { emoji: "🍗", label: "Poulet Yassa",     desc: "Citron & oignons confits" },
      { emoji: "🍚", label: "Attiéké-poisson",  desc: "Frais et parfumé" },
      { emoji: "🙋", label: "Tu choisis le plat", desc: "Je te fais confiance — toi tu t'y connais 😅" },
    ],
  },
  {
    sweet: "Le réveil parfait 🥞",
    id: "brunch",
    emoji: "🥞",
    question: "Au réveil / à grignoter ?",
    hint: "Classe tes envies, veto sur le reste, ou ajoute.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    otherPlaceholder: "Une autre gourmandise…",
    options: [
      { emoji: "🛏️", label: "Brunch au lit", desc: "On ne se lève pas 😌" },
      { emoji: "🥞", label: "Pancakes",      desc: "Moelleux, sirop et gourmandise" },
      { emoji: "🍇", label: "Raisins",       desc: "Frais, à picorer à deux" },
      { emoji: "🍤", label: "Finger food",   desc: "Petites bouchées à partager" },
    ],
  },

  /* ---------- L'intime ---------- */
  {
    sweet: "Mmm… j'ai déjà hâte 😏🔥",
    id: "calin",
    emoji: "😏",
    question: "Notre moment rien qu'à nous…",
    hint: "Coche ce qui te tente, classe par envie, veto sur le reste. Rien n'est obligé. 😉",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Pas ce soir",
    otherPlaceholder: "Une envie à me souffler…",
    options: [
      { emoji: "💆", label: "Massage sensuel",          desc: "Huile chaude, mains douces" },
      { emoji: "💃", label: "Tu danses pour moi",       desc: "Un effeuillage rien que pour mes yeux" },
      { emoji: "💋", label: "Tu te doigtes",            desc: "Tu te caresses, je te regarde" },
      { emoji: "🔥", label: "La totale, je te regarde",  desc: "Tu danses, tu te caresses et tu utilises les jouets" },
      { emoji: "🌷", label: "Comme à Amsterdam",        desc: "Ambiance vitrine : tu te montres rien que pour moi" },
      { emoji: "🃏", label: "Action ou vérité",         desc: "Version coquine, à deux" },
      { emoji: "🎴", label: "Cartes coquines",          desc: "On pioche, on ose" },
      { emoji: "🔗", label: "On perd le contrôle",      desc: "Menottes, mains liées… 😈" },
      { emoji: "🎥", label: "Nouvelle position",        desc: "On regarde un tuto et on applique en direct" },
      { emoji: "🙈", label: "Surprise…",                desc: "Laisse-moi te surprendre" },
    ],
  },
  {
    sweet: "Coquine… et j'adore ça 😈",
    id: "jouets",
    emoji: "🎁",
    question: "Nos petits plus : jouets & gourmandises",
    hint: "Ce dont tu as envie qu'on utilise. Classe, ajoute, ou mets ton veto.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Rien de tout ça",
    otherPlaceholder: "Un jouet / accessoire en particulier ?",
    options: [
      { emoji: "💗", label: "Vibromasseur",             desc: "Pour monter d'un cran" },
      { emoji: "🪝", label: "Jouet à ventouse (au mur)", desc: "Tu le fixes au mur et tu t'en sers… je te regarde 😏" },
      { emoji: "🩹", label: "Bandeau sur les yeux",     desc: "On joue avec le mystère" },
      { emoji: "🥛", label: "Chantilly sur la peau",    desc: "À lécher tout doucement" },
      { emoji: "🍯", label: "Miel",                     desc: "Doux et collant… juste ce qu'il faut" },
      { emoji: "🍶", label: "Sirop",                    desc: "Sucré à souhait" },
      { emoji: "🍫", label: "Chocolat",                 desc: "Fondant et gourmand" },
    ],
  },
];
