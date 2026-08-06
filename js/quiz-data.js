/* =======================================================================
   CONFIGURATION DE LA SURPRISE  💕
   -----------------------------------------------------------------------
   Ce fichier contient TOUT ce que tu peux personnaliser facilement :
   - l'e-mail où seront envoyés les choix
   - le titre / les petits messages
   - les étapes et les réponses proposées

   Modifie librement les textes, les emojis, ajoute ou retire des étapes.
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
   Chaque étape a :
     - id       : identifiant court (sans espace)
     - emoji    : petit emoji d'ambiance
     - question : la question posée
     - hint     : (optionnel) petite phrase sous la question
     - options  : la liste des réponses, chacune avec { emoji, label, desc }
   ----------------------------------------------------------------------- */
const ETAPES = [
  {
    id: "theme",
    emoji: "🎉",
    question: "Quelle ambiance pour notre soirée ?",
    hint: "Choisis le thème qui te fait le plus envie ce soir-là.",
    options: [
      { emoji: "🕯️", label: "Cosy & cocooning",      desc: "Plaid, bougies et douceur" },
      { emoji: "🥂", label: "Chic & romantique",     desc: "On se met sur notre 31" },
      { emoji: "✈️", label: "Évasion & voyage",       desc: "Dépaysement garanti à la maison" },
      { emoji: "🎲", label: "Fun & jeux",            desc: "Rires et complicité" },
    ],
  },
  {
    id: "film",
    emoji: "🎬",
    question: "On regarde quoi ensemble ?",
    hint: "Blottis l'un contre l'autre devant…",
    options: [
      { emoji: "💘", label: "Comédie romantique",  desc: "Pour sourire et s'attendrir" },
      { emoji: "😱", label: "Thriller à suspense",  desc: "Pour se serrer un peu plus fort" },
      { emoji: "💥", label: "Film d'action",        desc: "Adrénaline et pop-corn" },
      { emoji: "🍿", label: "Un grand classique",   desc: "Une valeur sûre" },
    ],
  },
  {
    id: "repas",
    emoji: "🍽️",
    question: "Qu'est-ce qu'on mange ?",
    hint: "Je cuisine ou je commande, à toi de choisir la saveur.",
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
    options: [
      { emoji: "🍾", label: "Champagne",          desc: "Pour les grandes occasions" },
      { emoji: "🍷", label: "Vin rouge",          desc: "Chaleureux et velouté" },
      { emoji: "🍹", label: "Cocktails",          desc: "Un brin festif" },
      { emoji: "🧉", label: "Sans alcool",        desc: "Frais et pétillant" },
    ],
  },
  {
    id: "dessert",
    emoji: "🍰",
    question: "Et pour finir en douceur ?",
    options: [
      { emoji: "🍫", label: "Fondant chocolat",  desc: "Coulant à souhait" },
      { emoji: "🍮", label: "Tiramisu",          desc: "Notre péché mignon" },
      { emoji: "🍨", label: "Glaces",            desc: "À partager à la petite cuillère" },
      { emoji: "🍓", label: "Fruits & chantilly", desc: "Léger et sensuel" },
    ],
  },
  {
    id: "coquin",
    emoji: "😏",
    question: "La petite touche coquine de la soirée…",
    hint: "Rien d'obligé — juste pour pimenter la complicité. 😉",
    options: [
      { emoji: "💋", label: "Action ou vérité",     desc: "Version tous les deux" },
      { emoji: "💆", label: "Massage surprise",     desc: "Détente… et plus si affinités" },
      { emoji: "🎴", label: "Cartes coquines",      desc: "On pioche, on ose" },
      { emoji: "🙈", label: "Surprise…",            desc: "Laisse-moi te surprendre" },
    ],
  },
  {
    id: "jour",
    emoji: "📅",
    question: "C'est pour quand, notre soirée ?",
    hint: "Choisis le moment parfait.",
    options: [
      { emoji: "🌆", label: "Vendredi soir",  desc: "Pour lancer le week-end" },
      { emoji: "✨", label: "Samedi soir",    desc: "La soirée des amoureux" },
      { emoji: "☀️", label: "Dimanche",       desc: "Cocooning sans réveil" },
      { emoji: "🎁", label: "Surprends-moi",  desc: "Je te fais confiance" },
    ],
  },
];
