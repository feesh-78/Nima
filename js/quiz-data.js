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
      { emoji: "⏳", label: "Un moment câlin",      desc: "1 à 2 heures" },
      { emoji: "🌙", label: "Toute la soirée",      desc: "On prend notre temps" },
      { emoji: "🌛", label: "Toute la nuit",        desc: "Jusqu'au bout…" },
      { emoji: "🗓️", label: "Le week-end entier",   desc: "Rien que nous deux" },
    ],
  },
  {
    sweet: "Ce petit nid rien que pour nous… 🏡💕",
    id: "lieu",
    emoji: "📍",
    question: "Où on s'évade ?",
    hint: "Clique sur « Voir » pour découvrir chaque logement, puis classe tes préférés.",
    multi: true,
    allowRefus: true,
    otherPlaceholder: "Une autre idée de lieu ?",
    allowOther: true,
    options: [
      { emoji: "🏞️", label: "Bord du lac", desc: "2 jours",
        link: "https://www.airbnb.fr/rooms/1189849132615294363?unique_share_id=2e70b455-8609-46b7-bfd5-597d7d52f1b9&viralityEntryPoint=1&s=76" },
      { emoji: "🌿", label: "Notre jardin secret", desc: "À découvrir",
        link: "https://www.airbnb.fr/rooms/1614626684710889574?unique_share_id=c302a607-5711-4081-840e-8c6edeeb4b6a&viralityEntryPoint=1&s=76" },
      { emoji: "🛋️", label: "Studio privé", desc: "À découvrir",
        link: "https://www.airbnb.fr/rooms/1009734885770279992?unique_share_id=a2a59c41-33fa-488a-bcd3-16d51a3a8777&viralityEntryPoint=1&s=76" },
      { emoji: "🪺", label: "Notre nid", desc: "À découvrir",
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
    id: "film",
    emoji: "🎬",
    question: "On regarde quoi ensemble ?",
    hint: "Films, séries ou documentaires — à toi de choisir l'univers.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Aucun, pas de film ce soir",
    otherPlaceholder: "Ajoute tes envies…",
    options: [
      { emoji: "💅", label: "Gossip",           desc: "Potins, glamour et drama" },
      { emoji: "🌍", label: "Afro romantique",  desc: "Amour et vibes" },
      { emoji: "💘", label: "Romantique",       desc: "Pour s'attendrir" },
      { emoji: "😂", label: "Humoristique",     desc: "Fous rires garantis" },
      { emoji: "💥", label: "Action",           desc: "Adrénaline et pop-corn" },
      { emoji: "👀", label: "Porno… ensemble ?", desc: "Si tu oses 😏" },
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
  {
    id: "repas",
    emoji: "🍽️",
    question: "Qu'est-ce qu'on mange ?",
    hint: "Je cuisine ou je commande, à toi de choisir la saveur.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    otherPlaceholder: "Une autre cuisine qui te fait envie ?",
    options: [
      { emoji: "💃", label: "Latino",        desc: "Épicé, coloré, festif" },
      { emoji: "🥖", label: "Français",      desc: "Nos classiques raffinés" },
      { emoji: "🍢", label: "Afro",          desc: "Saveurs et épices d'Afrique" },
      { emoji: "🥙", label: "Maghrébin",     desc: "Tajine, couscous & douceurs" },
      { emoji: "🫒", label: "Méditerranéen", desc: "Frais, huile d'olive, soleil" },
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
      { emoji: "👨‍🍳", label: "Tu cuisines pour moi", desc: "Je me laisse chouchouter" },
      { emoji: "👩‍🍳", label: "Je cuisine pour toi",  desc: "C'est moi qui régale" },
      { emoji: "🧑‍🍳", label: "On cuisine ensemble",  desc: "Complices en cuisine" },
      { emoji: "🛵", label: "On commande",          desc: "Zéro vaisselle, que du plaisir" },
    ],
  },
  {
    id: "boisson",
    emoji: "🥂",
    question: "On trinque avec quoi ?",
    multi: true,
    allowRefus: true,
    options: [
      { emoji: "🍾", label: "Champagne",   desc: "Pour les grandes occasions" },
      { emoji: "🍷", label: "Vin rouge",   desc: "Chaleureux et velouté" },
      { emoji: "🍹", label: "Cocktails",   desc: "Un brin festif" },
      { emoji: "🧉", label: "Sans alcool", desc: "Frais et pétillant" },
    ],
  },
  {
    id: "dessert",
    emoji: "🍰",
    question: "Et pour finir en douceur ?",
    hint: "Boulangerie ou fait maison ? Choisis, et note le dessert dont tu rêves.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    otherPlaceholder: "Note le dessert dont tu rêves…",
    options: [
      { emoji: "🥐", label: "Boulangerie", desc: "Viennoiseries & pâtisseries" },
      { emoji: "👩‍🍳", label: "Fait maison", desc: "Je te prépare un dessert maison" },
      { emoji: "🍫", label: "Fondant chocolat",   desc: "Coulant à souhait" },
      { emoji: "🍮", label: "Tiramisu",           desc: "Notre péché mignon" },
      { emoji: "🍨", label: "Glaces",             desc: "À partager à la petite cuillère" },
      { emoji: "🍓", label: "Fruits & chantilly", desc: "Léger et sensuel" },
    ],
  },
  {
    sweet: "Mmm… cette idée me plaît 😏",
    id: "coquin",
    emoji: "😏",
    question: "La touche coquine de la soirée…",
    hint: "Rien d'obligé — juste pour pimenter la complicité. 😉",
    multi: true,
    allowOther: true,
    allowRefus: true,
    refusLabel: "🙅 Non merci, pas de coquineries",
    otherPlaceholder: "Une autre idée à me souffler…",
    options: [
      { emoji: "💋", label: "Action ou vérité", desc: "Version tous les deux" },
      { emoji: "💆", label: "Massage surprise", desc: "Détente… et plus si affinités" },
      { emoji: "🎴", label: "Cartes coquines",  desc: "On pioche, on ose" },
      { emoji: "🔗", label: "Menottes",         desc: "On perd un peu le contrôle 😈" },
      { emoji: "🍓", label: "Se faire dévorer", desc: "Dessert à même la peau" },
      { emoji: "🎥", label: "Nouvelle position", desc: "On regarde un tuto ensemble et on applique en direct" },
      { emoji: "🙈", label: "Surprise…",        desc: "Laisse-moi te surprendre" },
    ],
  },
  {
    sweet: "Gourmande, et j'adore ça 😋",
    id: "gourmandise",
    emoji: "🍯",
    question: "On t'étale quoi sur la peau ? 😏",
    hint: "Pour se faire dévorer tout en douceur.",
    multi: true,
    allowRefus: true,
    refusLabel: "🙅 Non merci, on garde ça pour une autre fois",
    options: [
      { emoji: "🥛", label: "Chantilly", desc: "Nuageuse et légère" },
      { emoji: "🍯", label: "Miel",      desc: "Doux et collant… juste ce qu'il faut" },
      { emoji: "🍶", label: "Sirop",     desc: "Sucré à souhait" },
      { emoji: "🍫", label: "Chocolat",  desc: "Fondant et gourmand" },
    ],
  },
  {
    sweet: "Ce moment, je le note en grand ❤️",
    id: "jour",
    emoji: "📅",
    question: "C'est pour quand, notre surprise ?",
    hint: "Choisis le moment parfait.",
    options: [
      { emoji: "🌆", label: "Vendredi soir", desc: "Pour lancer le week-end" },
      { emoji: "✨", label: "Samedi soir",   desc: "La soirée des amoureux" },
      { emoji: "☀️", label: "Dimanche",      desc: "Cocooning sans réveil" },
      { emoji: "🎁", label: "Surprends-moi", desc: "Je te fais confiance" },
    ],
  },
];
