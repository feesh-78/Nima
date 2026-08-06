/* =======================================================================
   CONFIGURATION DE LA SURPRISE  💕
   -----------------------------------------------------------------------
   Ce fichier contient TOUT ce que tu peux personnaliser facilement :
   - l'e-mail où seront envoyés les choix
   - le titre / les petits messages
   - les étapes et les réponses proposées

   Chaque étape peut avoir :
     - multi: true      -> elle peut choisir PLUSIEURS réponses
     - allowOther: true -> un champ libre pour qu'elle complète elle-même
   ======================================================================= */

const CONFIG = {
  // 📧 Adresse où Madame pourra t'envoyer ses choix à la fin
  emailDestinataire: "philippe.bussac@jalyastudio.com",

  // 💌 Sujet de l'e-mail pré-rempli
  sujetEmail: "💕 Mes choix pour notre soirée surprise",

  // Titre affiché sur l'écran d'accueil
  titre: "Une surprise t'attend…",
  sousTitre: "J'ai préparé quelque chose rien que pour nous deux. " +
             "Réponds à quelques questions et laisse-moi organiser le reste. ✨",
};

/* -----------------------------------------------------------------------
   LES ÉTAPES DU QUIZ
   ----------------------------------------------------------------------- */
const ETAPES = [
  {
    id: "theme",
    emoji: "🎉",
    question: "Quelle ambiance pour notre soirée ?",
    hint: "Choisis ce qui te fait le plus envie.",
    multi: true,
    options: [
      { emoji: "🕯️", label: "Cosy & cocooning",        desc: "Plaid, bougies et douceur" },
      { emoji: "🥂", label: "Chic & romantique",       desc: "On se met sur notre 31" },
      { emoji: "🏖️", label: "Sex on the beach all day", desc: "Ambiance plage, cocktails… et le reste 😏" },
      { emoji: "🎲", label: "Fun & jeux",              desc: "Rires et complicité" },
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
    id: "repas",
    emoji: "🍽️",
    question: "Qu'est-ce qu'on mange ?",
    hint: "Je cuisine ou je commande, à toi de choisir la saveur.",
    multi: true,
    allowOther: true,
    otherPlaceholder: "Une autre envie ?",
    options: [
      { emoji: "🍝", label: "Italien",       desc: "Pâtes, pizza, dolce vita" },
      { emoji: "🍣", label: "Japonais",      desc: "Sushis et makis" },
      { emoji: "🧀", label: "Raclette",      desc: "Fromage fondant & convivialité" },
      { emoji: "🍔", label: "Burger maison", desc: "Gourmand et réconfortant" },
    ],
  },
  {
    id: "boisson",
    emoji: "🥂",
    question: "On trinque avec quoi ?",
    multi: true,
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
    multi: true,
    options: [
      { emoji: "🍫", label: "Fondant chocolat",   desc: "Coulant à souhait" },
      { emoji: "🍮", label: "Tiramisu",           desc: "Notre péché mignon" },
      { emoji: "🍨", label: "Glaces",             desc: "À partager à la petite cuillère" },
      { emoji: "🍓", label: "Fruits & chantilly", desc: "Léger et sensuel" },
    ],
  },
  {
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
      { emoji: "🙈", label: "Surprise…",        desc: "Laisse-moi te surprendre" },
    ],
  },
  {
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
    id: "jour",
    emoji: "📅",
    question: "C'est pour quand, notre soirée ?",
    hint: "Choisis le moment parfait.",
    options: [
      { emoji: "🌆", label: "Vendredi soir", desc: "Pour lancer le week-end" },
      { emoji: "✨", label: "Samedi soir",   desc: "La soirée des amoureux" },
      { emoji: "☀️", label: "Dimanche",      desc: "Cocooning sans réveil" },
      { emoji: "🎁", label: "Surprends-moi", desc: "Je te fais confiance" },
    ],
  },
];
