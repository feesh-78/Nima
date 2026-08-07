/* =======================================================================
   CONFIGURATION, SITE 1 (Partie 1) 💕
   L'organisation : durée, lieu, ambiance, déco, musique, repas (format /
   qui cuisine / dessert), le jour.
   (Les envies détaillées + l'intime sont sur le SITE 2 : partie2.html)
   ======================================================================= */

const CONFIG = {
  emailDestinataire: "philippe.bussac@jalyastudio.com",
  sujetEmail: "💕 Mes choix (Partie 1) pour notre surprise",

  titre: "Une surprise t'attend…",
  sousTitre: "J'ai préparé quelque chose rien que pour nous deux. " +
             "Réponds à quelques questions, dans l'ordre de tes envies, " +
             "et laisse-moi organiser le reste. ✨",

  // Clé de sauvegarde propre au site 1 (ne se mélange pas avec le site 2)
  storageKey: "surprise-p1-v1",

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
    question: "Et pour le dessert ?",
    hint: "On l'achète (pendant les courses) ou je te le prépare maison ? Choisis, et dis-moi si tu veux autre chose.",
    multi: true,
    allowOther: true,
    allowRefus: true,
    otherPlaceholder: "Autre chose qui te fait envie ? Note-la…",
    options: [
      { emoji: "🛒", label: "Acheté",             desc: "On le prend pendant les courses" },
      { emoji: "👩‍🍳", label: "Fait maison",       desc: "Je te le prépare" },
      { emoji: "🍫", label: "Fondant chocolat",   desc: "Coulant à souhait" },
      { emoji: "🍮", label: "Tiramisu",           desc: "Notre péché mignon" },
      { emoji: "🍨", label: "Glaces",             desc: "À partager à la petite cuillère" },
      { emoji: "🍓", label: "Fruits & chantilly", desc: "Léger et sensuel" },
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
