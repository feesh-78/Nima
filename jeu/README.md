# 👗 Nini City

Le jeu de mode de Nima : une app web à installer sur l'écran d'accueil de l'iPhone.
Le cahier des charges complet est dans [`docs/PROMPT-JEU-MODE.md`](../docs/PROMPT-JEU-MODE.md).

## 📱 Jouer sur iPhone

1. Ouvre l'adresse du jeu dans **Safari** : `…/jeu/` (le site + `/jeu/`).
2. Touche **Partager** ⬆︎ puis **« Sur l'écran d'accueil »**.
3. Lance **Nini City** depuis son icône : plein écran, marche sans connexion.

## 🧪 Lancer les tests

```bash
cd jeu
npm test
```

Aucune installation nécessaire (Node.js 20 ou plus suffit).

## 🗂️ Organisation

```
index.html            → la page du jeu
sw.js                 → fonctionnement hors ligne (liste des fichiers à garder)
manifest.webmanifest  → nom et icône de l'app
css/game.css          → le style (couleurs et polices dans :root)
js/main.js            → démarrage
js/scenes/            → décors et scènes Phaser
js/ui/                → écrans HTML (accueil, nouvelle partie…)
js/systems/           → sauvegarde et règles du jeu
data/                 → le contenu du jeu (vêtements, missions…), à venir
vendor/               → Phaser 3.90.0 (copie locale pour le hors ligne)
tests/                → tests automatiques
```

## ⚠️ Règles pour toute modification

1. **Augmenter la version** dans `js/version.js` **et** `sw.js` (identiques).
   Sans ça, les iPhone gardent l'ancienne version en mémoire.
2. **Tout nouveau fichier** doit être ajouté à la liste `PRECACHE` de `sw.js`.
3. **Ne jamais casser une sauvegarde** : si le format change, ajouter une migration
   dans `js/systems/save-format.js`.
4. `npm test` doit passer (il vérifie les points 1 et 2).
