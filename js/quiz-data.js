/* =======================================================================
   CONFIGURATION DE LA SURPRISE  💕
   -----------------------------------------------------------------------
   Ce fichier contient TOUT ce que tu peux personnaliser facilement :
   - l'e-mail où seront envoyés les choix
   - le titre / les petits messages
   - les étapes et les réponses proposées

   Chaque étape peut avoir :
     - multi: true      -> elle peut choisir PLUSIEURS réponses
                           (l'ordre des clics = son ordre de préférence)
     - allowOther: true -> un champ libre pour qu'elle complète elle-même
     - allowRefus: true -> un droit de veto « Non merci » sur la thématique
     - refusLabel       -> le texte du bouton de refus (optionnel)
   ======================================================================= */

const CONFIG = {
  // 📧 Adresse où Madame pourra t'envoyer ses choix à la fin
  emailDestinataire: "philippe.bussac@jalyastudio.com",

  // 💌 Sujet de l'e-mail pré-rempli
  sujetEmail: "💕 Mes choix pour notre soirée surprise",

  // Titre affiché sur l'écran d'accueil
  titre: "Une surprise t'attend…",
  sousTitre: "J'ai préparé quelque chose rien que pour nous deux. " +
             "Réponds à quelques questions, dans l'ordre de tes envies, " +
             "et laisse-moi organiser le reste. ✨",

  /* 💕 Petits messages mignons affichés quand elle valide une étape.
     (Tu peux en ajouter/retirer librement.) */
  messagesMignons: [
    "J'adore ce choix 🥰",
    "Tu me connais si bien 💕",
    "Excellent goût, comme toujours 😘",
    "Hâte d'y être avec toi 🔥",
    "Tu vas voir, ce sera parfait ✨",
    "Mon cœur fait boum 💓",
    "C'est noté, rien que pour toi 💌",
    "On va passer un moment magique 🥂",
    "Je craque… 😍",
  ],
};

/* -----------------------------------------------------------------------
   LES ÉTAPES DU QUIZ
   L'ordre ci-dessous est l'ordre d'affichage :
   1) la durée (elle donne le tempo)
   2) puis les thématiques (une ou plusieurs selon l'envie / le temps)
   3) enfin le jour
   ----------------------------------------------------------------------- */
const ETAPES = [
  {
    sweet: "Rien que du temps pour nous… j'aime 🕰️💕",
    id: "duree",
    emoji: "⏱️",
    question: "Combien de temps rien que pour nous ?",
    hint: "Ça donne le tempo : plus c'est long, plus tu peux te faire plaisir sur les thématiques 😉",
    options: [
      { emoji: "🌙", label: "Toute la soirée",           desc: "On prend notre temps" },
      { emoji: "🌇", label: "Fin d'après-midi → soirée", desc: "On enchaîne en douceur" },
      { emoji: "🕛", label: "Midi au soir",              desc: "Une longue parenthèse" },
      { emoji: "🌞", label: "Toute la journée",          desc: "Rien que nous deux, sans compter" },
    ],
  },
  {
    sweet: "Ce petit nid rien que pour nous… 🏡💕",
    id: "lieu",
    emoji: "📍",
    question: "Où on s'évade ?",
    hint: "Clique sur « Voir » pour découvrir chaque logement, puis classe tes préférés. (Séjour à priori sur 2 nuits.)",
    multi: true,
    allowRefus: true,
    otherPlaceholder: "Une autre idée de lieu ?",
    allowOther: true,
    options: [
      { emoji: "🏞️", label: "Bord du lac", desc: "≈ 2 nuits",
        link: "https://www.airbnb.fr/rooms/1189849132615294363?unique_share_id=2e70b455-8609-46b7-bfd5-597d7d52f1b9&viralityEntryPoint=1&s=76" },
      { emoji: "🌿", label: "Notre jardin secret", desc: "≈ 2 nuits",
        link: "https://www.airbnb.fr/rooms/1614626684710889574?unique_share_id=c302a607-5711-4081-840e-8c6edeeb4b6a&viralityEntryPoint=1&s=76" },
      { emoji: "🛋️", label: "Studio privé", desc: "≈ 2 nuits",
        link: "https://www.airbnb.fr/rooms/1009734885770279992?unique_share_id=a2a59c41-33fa-488a-bcd3-16d51a3a8777&viralityEntryPoint=1&s=76" },
      { emoji: "🪺", label: "Notre nid", desc: "≈ 2 nuits",
        link: "https://www.airbnb.fr/rooms/1233986426450752595?unique_share_id=69a84713-3b46-4e17-800e-30ac8f28ccab&viralityEntryPoint=1&s=76" },
      { emoji: "🏠", label: "Marie Depage", desc: "Notre logement de base" },
    ],
  },
  {
    id: "theme",
    emoji: "🎉",
    question: "Quelle ambiance pour notre soirée ?",
    multi: true,
    allowRefus: true,
    options: [
      { emoji: "🕯️", label: "Cosy & cocooning",        desc: "Plaid, bougies et douceur" },
      { emoji: "🥂", label: "Chic & romantique",       desc: "On se met sur notre 31" },
      { emoji: "🏖️", label: "Sex on the beach all day", desc: "Ambiance plage, cocktails… et le reste 😏" },
      { emoji: "🎲", label: "Fun & jeux",              desc: "Rires et complicité" },
    ],
  },
  {
    id: "decor",
    emoji: "🕯️",
    question: "On décore comment le nid ?",
    multi: true,
    allowRefus: true,
    options: [
      { emoji: "🕯️", label: "Bougies",         desc: "Lumière douce et tamisée" },
      { emoji: "🌹", label: "Pétales de rose", desc: "Semés un peu partout" },
      { emoji: "🎈", label: "Plaids & ballons", desc: "Cocon douillet et festif" },
      { emoji: "🚫", label: "Rien",            desc: "Juste nous, tout simplement" },
    ],
  },
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
  {
    id: "musique",
    emoji: "🎵",
    question: "L'ambiance musicale ?",
    hint: "Le style qui rythme notre moment.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Pas de musique",
    otherPlaceholder: "Un artiste, une playlist…",
    options: [
      { emoji: "💞", label: "Romantique",     desc: "Douceur et slows" },
      { emoji: "🔥", label: "Agressif",       desc: "Ça envoie, ça réveille" },
      { emoji: "🛏️", label: "Bedroom",        desc: "R&B feutré et sensuel" },
      { emoji: "📻", label: "Années 90/2000", desc: "Nostalgie et gros tubes" },
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
  {
    id: "format",
    emoji: "🍽️",
    question: "On dîne comment ?",
    multi: true,
    allowRefus: true,
    options: [
      { emoji: "🍽️", label: "Dîner à table",   desc: "Nappe, jolie table, en amoureux" },
      { emoji: "🧺", label: "Pique-nique au sol", desc: "Coussins et plaid par terre" },
      { emoji: "🛏️", label: "Au lit",           desc: "Confort total, on ne bouge plus" },
      { emoji: "🍤", label: "Finger food",      desc: "À grignoter, à se faire goûter" },
    ],
  },
  {
    id: "cuisine",
    emoji: "👩‍🍳",
    question: "Qui est aux fourneaux ?",
    multi: true,
    allowRefus: true,
    options: [
      { emoji: "👨‍🍳", label: "Je cuisine pour toi",  desc: "Je te chouchoute" },
      { emoji: "👩‍🍳", label: "Tu cuisines pour moi", desc: "C'est toi qui régales" },
      { emoji: "🧑‍🍳", label: "On cuisine ensemble",  desc: "Complices en cuisine" },
      { emoji: "🛵", label: "On commande",          desc: "Zéro vaisselle, que du plaisir" },
    ],
  },
  {
    id: "dessert",
    emoji: "🍰",
    question: "Et pour finir en douceur ?",
    hint: "Je te le prépare maison 👩‍🍳💕 — choisis et note le dessert dont tu rêves.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    otherPlaceholder: "Note le dessert dont tu rêves…",
    options: [
      { emoji: "🍫", label: "Fondant chocolat",   desc: "Coulant à souhait" },
      { emoji: "🍮", label: "Tiramisu",           desc: "Notre péché mignon" },
      { emoji: "🍨", label: "Glaces",             desc: "À partager à la petite cuillère" },
      { emoji: "🍓", label: "Fruits & chantilly", desc: "Léger et sensuel" },
    ],
  },
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
  {
    sweet: "Ce moment, je le note en grand ❤️",
    id: "jour",
    emoji: "📅",
    question: "C'est pour quand, notre surprise ?",
    hint: "Choisis le moment parfait.",
    options: [
      { emoji: "📅", label: "Jeudi",             desc: "On lance tôt le plaisir" },
      { emoji: "🌆", label: "Vendredi",          desc: "Pour lancer le week-end" },
      { emoji: "✨", label: "Samedi ou dimanche", desc: "Le week-end des amoureux" },
    ],
  },
];
