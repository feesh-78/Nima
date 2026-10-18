# 👗 Nini City : prompt de développement du jeu de mode de Nima

> Ce document est le **prompt maître** à donner à Claude Code pour développer le jeu.
> Il se lit d'un bloc la première fois, puis on avance **phase par phase**
> (une phase = une session = une version testable sur iPhone).

---

## 1. Rôle et contexte

Tu es un développeur de jeux web senior. Tu crées un jeu de mode **pour une seule
joueuse : Nima, 29 ans**. C'est un cadeau personnel : pas de partage, pas de
classement, pas de pub, pas d'achat intégré.

Le commanditaire est un développeur **no-code / low-code** : il ne lit pas le code.
Donc :
- explique chaque livraison en français simple : ce qui a changé, comment le tester sur iPhone ;
- garde un code **simple, commenté en français, sans étape de build** ;
- tout ce qui est du **contenu** (vêtements, missions, dialogues, boutiques…) vit dans
  des fichiers de données séparés, faciles à modifier sans toucher au moteur.

## 2. Le concept en une phrase

**Un « Léa Passion Mode » moderne, avec la vie de quartier des Sims et les histoires
à rebondissements de Gossip Harbor** : Nima arrive à **Nini City**, une grande ville, s'installe
dans son appartement, se balade sur une carte vue de dessus, fait du shopping,
relève des missions de stylisme et des mini-jeux pour grimper les échelons de la mode
et étoffer son dressing.

Inspirations : Léa Passion Mode (DS), Les Sims, Gossip Harbor, DREST, Hollywood Crush.

## 3. Principes de jeu (non négociables)

1. **Jamais de game over, jamais rien de perdu.** On peut rater un mini-jeu ou une
   mission : on la **retente simplement, autant de fois qu'on veut**. Rater ne fait
   jamais perdre de pièces, de vêtements, de meubles ni de progression. Une réussite
   rapporte de 1 à 3 étoiles, et plus d'étoiles donnent plus de récompenses.
2. **Pas de son.** Aucun son ni musique. Les retours sont visuels : animations,
   paillettes, vibrations légères (`navigator.vibrate` quand c'est disponible).
3. **Sessions courtes et agréables** : on doit pouvoir jouer 5 minutes dans le métro.
4. **Le jeu ne se termine jamais vraiment** : l'histoire est découpée en chapitres,
   et de nouveaux chapitres, vêtements et missions sont ajoutés régulièrement
   (voir la phase 8, l'agent de nuit).
5. **Pensé pour l'iPhone d'abord** : portrait, jouable au pouce, zones tactiles
   d'au moins 44 px, respect des zones sûres (encoche, barre du bas).

## 4. Contenu du jeu

### 4.1 L'héroïne
- Une femme. La joueuse la personnalise au premier lancement : prénom (Nima par
  défaut), teint, coiffure, couleur de cheveux, yeux.
- **Poupée à habiller en calques** (« paper doll ») : corps, puis bas, haut, robe,
  chaussures, sac, bijoux, coiffure. Chaque vêtement est un calque superposé, ce qui
  permet des milliers de combinaisons.
- Deux représentations : un **mini personnage vu de dessus** pour la carte, et une
  **grande poupée de face** pour le dressing et les missions de style.

### 4.2 La ville (carte vue de dessus)
- **Nini City**, une grande ville stylisée vue de dessus, explorée en **touchant l'endroit où
  aller** (déplacement automatique) ou avec un **joystick virtuel**.
- La caméra suit l'héroïne. La ville est plus grande que l'écran.
- Lieux de départ (à enrichir plus tard) :
  - 🏠 **L'appartement** de Nima
  - 🛍️ **3 boutiques** au style différent : friperie vintage, enseigne tendance, boutique de luxe
  - ✂️ **L'atelier de couture** (mini-jeu de fusion)
  - 📸 **Le studio photo** (mini-jeu de shooting)
  - ☕ **Le café** (rencontres, potins, nouvelles missions)
  - 🏢 **L'agence de mode** (missions principales, montée en grade)
- Certains lieux sont **verrouillés** au début et se débloquent avec la progression.
- Entrer dans un bâtiment ouvre son écran (boutique, mini-jeu, dialogue…).

### 4.3 L'appartement (façon Sims, version simple)
- Une pièce vue de dessus sur une **grille**.
- Acheter des meubles et déco, les **placer, déplacer, pivoter, ranger** par simple toucher.
- Pas de murs à construire ni de besoins (faim, sommeil…) : uniquement de la déco plaisir.
- Le **dressing** se trouve dans l'appartement : c'est là qu'on compose et enregistre
  des tenues.
- Plus tard : agrandir l'appartement, puis déménager dans un loft.

### 4.4 Progression et économie
- **Deux monnaies** : 💰 pièces (gagnées partout) et 💎 paillettes (plus rares, pour
  les objets spéciaux).
- **Échelons de carrière** (débloquent lieux, objets et chapitres) :
  1. Stagiaire
  2. Assistante styliste
  3. Styliste
  4. Styliste star
  5. Directrice artistique
  6. Créatrice de sa propre marque
  7. Icône de la Fashion Week
- **Missions** :
  - *Principales* : elles font avancer l'histoire et la carrière ;
  - *Secondaires* : demandes des personnages (« Habille-moi pour un mariage champêtre »),
    renouvelées chaque jour ;
  - *Collection* : compléter des ensembles de vêtements pour des bonus.
- **Mission de style** (le cœur du jeu, façon DREST) : on reçoit un thème (« soirée
  gala », « brunch à Paris », « festival »), on compose une tenue avec son dressing,
  et la tenue est notée de 1 à 3 étoiles selon des règles simples et transparentes :
  étiquettes de style des vêtements (chic, casual, bohème, rock, sport…), couleurs
  assorties, nombre de pièces.

### 4.5 L'histoire (façon Gossip Harbor)
- Des **personnages récurrents** avec leur personnalité : une meilleure amie, une
  rivale, un mentor, une cheffe exigeante, un voisin mystérieux…
- Des **dialogues en bulles** avec portraits, et parfois des **choix de réponse** qui
  changent légèrement la relation avec un personnage (sans jamais bloquer la suite).
- L'histoire est découpée en **chapitres** décrits dans des fichiers de données.
  Ajouter un chapitre ne doit demander **aucune modification du moteur**.
- Ton : feel-good, un peu de drama et de potins, de l'humour, jamais sombre.

### 4.6 Mini-jeux (3 au départ, d'autres plus tard)
Courts (30 à 90 secondes). On peut rater et retenter librement, sans rien perdre.
Une réussite donne de 1 à 3 étoiles :
1. **Atelier de couture (fusion)** : sur une grille, fusionner deux objets identiques
   pour obtenir l'objet suivant (fil → tissu → patron → vêtement). Le vêtement obtenu
   rejoint le dressing. C'est la mécanique de Gossip Harbor, appliquée à la mode.
2. **Shooting photo** : la modèle prend des poses, on touche au bon moment quand la
   jauge passe dans la zone parfaite.
3. **Rush des soldes** : des articles tombent, on glisse un panier pour attraper ceux
   de la liste et éviter les fautes de goût.

## 5. Ambiance visuelle (validée)

**Style « poupée mannequin Y2K »**, inspiré des jeux de mode DS / PS2 des années 2000
(type Bratz, Barbie, Winx) : grosse tête, grands yeux en amande maquillés, lèvres
glossy, silhouette fine, plateformes, cheveux volumineux et brillants. Interface
glam : violet nuit, rose fluo, paillettes, boutons « bonbon » brillants, logo chromé.

- **L'héroïne** est métisse (peau caramel, longs cheveux bruns bouclés avec mèches
  caramel, yeux marron). Son visage doit rester **identique** sur toutes les images.
- **Les tenues** sont des **illustrations complètes** de l'héroïne (pas de calques),
  générées par IA avec l'outil d'images Canva, **en donnant toujours l'image de
  référence** (`canva` de la tenue « basique » dans `data/outfits.json`, fond retiré :
  MAHYZlovxfg ; image d'origine avec fond : MAHYZr503mI) pour garder le même visage.
  Fond retiré ensuite (outil « remove background »), image en PNG transparent.
- **Variété des styles** : classe, chic, décontracté, preppy, soirée, Y2K, sport…
  Pas uniquement des looks provocants.
- Toujours noter la source de chaque image dans `jeu/CREDITS.md`.

## 6. Exigences techniques

### 6.1 Technologies
| Besoin | Choix | Pourquoi |
|---|---|---|
| Moteur 2D (carte, mini-jeux, appartement) | **Phaser 3.90.0**, copié dans `jeu/vendor/` | Moteur 2D de référence pour le web, gère tactile, caméra et animations. La copie locale garantit le hors ligne |
| Menus, dressing, dialogues, boutiques | **HTML + CSS** par-dessus le canvas | Plus simple et plus net pour les interfaces |
| Code | **JavaScript moderne (modules ES)**, **sans étape de build** | Même approche que le reste du site : rien à installer, GitHub Pages sert les fichiers tels quels |
| Hors connexion + écran d'accueil | **PWA** : `manifest.webmanifest` + service worker écrit à la main | Plein écran, icône, fonctionne sans réseau |
| Sauvegarde locale | **IndexedDB** (repli sur `localStorage`) | Fiable, fonctionne hors ligne |
| Sauvegarde cloud | **Supabase** (offre gratuite) | Base de données + connexion par e-mail, simple à brancher |
| Hébergement | **GitHub Pages**, dans le dossier `jeu/` de ce dépôt | Gratuit, déjà en place pour le site |
| Tests | `node --test` sur la logique et la validation des données | Sans dépendance, l'agent de nuit peut les lancer |

### 6.2 Structure des fichiers
```
jeu/
  index.html              → point d'entrée
  manifest.webmanifest    → nom, icônes, plein écran
  sw.js                   → service worker (cache hors ligne)
  CREDITS.md              → sources et licences des ressources
  css/                    → styles de l'interface
  js/
    main.js               → démarrage
    scenes/               → scènes Phaser (ville, appartement, mini-jeux)
    ui/                   → écrans HTML (dressing, boutique, dialogues, menus)
    systems/              → sauvegarde, sync cloud, économie, missions, notation
  data/                   → ⭐ TOUT LE CONTENU (JSON)
    items.json            → vêtements et accessoires (calques, couleurs, étiquettes de style, prix)
    furniture.json        → meubles
    shops.json            → boutiques et leur stock
    characters.json       → personnages
    missions.json         → missions
    chapters/             → un fichier par chapitre d'histoire
    map.json              → lieux de la ville et conditions de déblocage
  assets/                 → images, sprites, SVG
  tests/                  → tests automatiques
```

### 6.3 Sauvegarde et synchronisation (important)
- **Sauvegarde automatique** à chaque action importante (achat, mission, déplacement
  de meuble), plus toutes les 30 secondes. Jamais de bouton « sauvegarder » obligatoire.
- **Hors ligne d'abord** : le jeu fonctionne entièrement sans réseau ; la sauvegarde
  locale fait foi.
- **Synchronisation cloud** dès qu'une connexion est disponible (événement `online`,
  retour dans l'app, et toutes les 2 minutes) :
  - chaque sauvegarde porte un **numéro de version** et un **horodatage** ;
  - on envoie la sauvegarde locale si elle est plus récente, on récupère celle du
    cloud sinon ;
  - en cas de doute (modifiée des deux côtés), on garde la plus avancée et on
    conserve l'autre dans un historique des 5 dernières sauvegardes.
- **Connexion** : par **code à 6 chiffres reçu par e-mail** (Supabase Email OTP),
  **pas par lien magique**, car sur iPhone un lien magique s'ouvre dans Safari et non
  dans l'app de l'écran d'accueil. On se connecte une seule fois, ensuite c'est automatique.
- Sécurité Supabase : activer **Row Level Security**, pour que chaque compte ne puisse
  lire et écrire que sa propre sauvegarde. Seule la clé publique (« anon ») est dans le
  code, jamais la clé secrète.
- Bonus dans les réglages : **exporter / importer** la sauvegarde sous forme de code
  à copier-coller.
- Le format de sauvegarde est **versionné**, avec des fonctions de migration, pour que
  les mises à jour du jeu ne cassent jamais une partie en cours.
- Petit indicateur discret : ☁️ synchronisé / ⏳ en attente / 📴 hors ligne.

### 6.4 iPhone et PWA
- Afficher une fois un petit tutoriel « Ajoute le jeu à ton écran d'accueil »
  (Partager → Sur l'écran d'accueil) quand le jeu tourne dans Safari et pas en mode app.
- `apple-mobile-web-app-capable`, `apple-touch-icon`, `viewport-fit=cover`,
  `env(safe-area-inset-*)`.
- Bloquer le zoom par pincement et le rebond de défilement pendant le jeu.
- Performance : 60 images/seconde visées sur un iPhone récent, assets légers.
- Quand une nouvelle version est disponible, l'afficher avec un bouton « Mettre à jour ».

### 6.5 Accès
- **Pas de mot de passe** pour le jeu : il est accessible directement par son lien
  (le rideau `js/gate.js` du reste du site ne s'applique pas à `jeu/`).

## 7. Plan de développement par phases

Chaque phase se termine par : une version en ligne testable sur iPhone, un résumé en
français de ce qui a changé et de comment le tester, et des tests qui passent.

| Phase | Contenu | Résultat testable |
|---|---|---|
| **0. Fondations** | Dossier `jeu/`, PWA, Phaser, écran titre, sauvegarde locale, mise en ligne | Le jeu s'installe sur l'écran d'accueil et marche hors ligne |
| **1. Héroïne et direction artistique** | Création du personnage, poupée en calques, écran de test des 2 styles | Nima crée son personnage et choisit le style |
| **2. La ville** | Carte vue de dessus, déplacement tactile, caméra, entrée dans les lieux | On se balade et on entre dans les bâtiments |
| **3. Shopping et dressing** | 3 boutiques, monnaies, achat, dressing, tenues enregistrées | On achète des vêtements et on compose des tenues |
| **4. Missions et histoire** | Missions de style notées, échelons de carrière, dialogues, chapitre 1 | On joue le premier chapitre en entier |
| **5. Mini-jeux** | Atelier de fusion, shooting photo, rush des soldes | 3 mini-jeux jouables et récompensés |
| **6. L'appartement** | Déco sur grille, achat et placement de meubles | On décore son appartement |
| **7. Sauvegarde cloud** | Supabase, connexion par code, synchro hors ligne / en ligne | La partie se retrouve après réinstallation |
| **8. Bouton avis et agent de nuit** | Bouton « Donner mon avis », agent automatique quotidien | Du nouveau contenu arrive tout seul |

## 8. Phase 8 : l'agent de nuit (le jeu qui grandit tout seul)

### 8.1 Bouton « Donner mon avis »
- Dans le menu : Nima écrit un avis libre (« j'aimerais plus de robes de soirée »,
  « le mini-jeu des soldes est trop rapide ») et peut noter son humeur avec un emoji.
- Les avis sont enregistrés dans une table Supabase `feedback` (ou en local, puis
  envoyés à la prochaine connexion).
- Le jeu envoie aussi des statistiques **anonymes et minimales** : missions jouées,
  mini-jeux préférés, temps de jeu. Elles aident l'agent à choisir quoi améliorer.

### 8.2 La tâche planifiée (Claude Code, chaque nuit vers 3 h, heure de Paris)
Mission de l'agent, dans l'ordre :
1. Lire les nouveaux avis et statistiques.
2. Choisir **une seule amélioration** par nuit, en priorité :
   a) corriger un bug signalé,
   b) répondre à un avis (ajuster une difficulté, ajouter le type de vêtement demandé…),
   c) sinon, faire avancer le contenu : quelques vêtements ou meubles, 2 ou 3 missions
      secondaires, ou une partie du chapitre suivant.
3. Respecter les règles :
   - privilégier les modifications dans `jeu/data/` (contenu) plutôt que dans le moteur ;
   - ne jamais casser une sauvegarde existante (migration si le format change) ;
   - respecter les principes de la section 3 (pas d'échec, pas de son, ton feel-good) ;
   - lancer les tests : si un test échoue, ne rien publier ;
   - laisser une note dans `jeu/data/journal.json`, affichée dans le jeu comme
     « 📰 Les nouveautés du jour ».
4. Proposer le changement (au début : une pull request à valider le matin) et écrire un résumé de
   la nuit dans `jeu/JOURNAL-AGENT.md`.

## 9. Définition de « terminé » pour chaque phase
- Fonctionne dans Safari sur iPhone et en mode app depuis l'écran d'accueil.
- Fonctionne en mode avion après un premier chargement.
- La progression est conservée après fermeture complète de l'app.
- Aucune erreur dans la console.
- Les tests passent.
- Un résumé en français explique comment tester.

## 10. Questions ouvertes (à trancher avant ou pendant le développement)
- [x] **Nom du jeu et de la ville** : **Nini City**
- [x] **Direction artistique** : poupée mannequin Y2K glam (voir section 5)
- [x] **Agent de nuit** : **validation chaque matin au début**. L'agent prépare ses
      changements sur une branche et ouvre une demande de fusion (pull request) ;
      rien n'est publié sans accord. On passera en publication automatique plus tard.
- [x] **Compte Supabase** : le commanditaire en a déjà un (il faudra juste créer le
      projet et donner l'URL et la clé publique à la phase 7)

## 11. Avancement
- [x] **Phase 0 : Fondations** (v0.1.0) : écran titre animé, nouvelle partie avec prénom,
      sauvegarde automatique sur le téléphone, fonctionnement hors ligne, aide
      d'installation sur l'écran d'accueil, bandeau de mise à jour, 11 tests.
- [x] **Phase 1 : Héroïne, dressing et boutique** (v0.2.0) : héroïne illustrée,
      4 tenues (1 offerte, 3 en boutique), dressing, achat avec les pièces, cadeau du
      jour (+30 pièces), interface glam. ⚠️ Les images sont encore des aperçus en basse
      définition (133 × 200) : à remplacer par les versions HD dès que l'accès réseau
      à Canva est ouvert.

---

## ▶️ Prompt de démarrage (à copier pour lancer la phase 0)

> Lis `docs/PROMPT-JEU-MODE.md` en entier. Réalise la **phase 0 (Fondations)** dans le
> dossier `jeu/` : PWA installable sur iPhone, Phaser 3 copié dans `jeu/vendor/`, écran titre aux couleurs « Pastel chic », sauvegarde locale
> versionnée dans IndexedDB, fonctionnement hors ligne, un premier test `node --test`.
> Ne touche pas aux autres pages du site. Quand c'est fini, commit, push, puis
> explique-moi en français simple comment tester sur iPhone.

Pour les phases suivantes :

> Lis `docs/PROMPT-JEU-MODE.md`, regarde où en est le dossier `jeu/`, puis réalise
> la **phase N**. Même règles : testable sur iPhone, tests qui passent, résumé simple.
