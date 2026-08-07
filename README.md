# 💕 Site surprise, Quiz de la soirée romantique

Un petit site interactif tout mignon : ta moitié répond à quelques questions
(ambiance, film, repas, dessert, la touche coquine, le jour…) et **ses choix
sont enregistrés** puis peuvent t'être envoyés par e-mail en un clic. Parfait
pour préparer une soirée surprise sur-mesure. ✨

> C'est très à la mode en ce moment : on laisse l'autre « choisir la bonne
> réponse » sans savoir qu'on prépare tout dans son dos. 😍

## 🎬 Aperçu

- **Écran d'accueil** : elle entre son prénom
- **Questions à choix** (une par écran) avec jolies animations
- **Récapitulatif final** avec tous ses choix
- **Enregistrement** : les réponses sont sauvegardées dans le navigateur
  (elle peut fermer/rouvrir sans perdre sa progression)
- **Envoi** : bouton « M'envoyer mes choix » (e-mail pré-rempli) + copier le récap

## 📁 Structure

```
index.html          → la page
css/styles.css      → le style (ambiance romantique, mobile-first)
js/quiz-data.js     → ⭐ TOUT ce qui se personnalise (questions, e-mail, textes)
js/app.js           → la logique du quiz
```

## ✏️ Comment personnaliser

Ouvre **`js/quiz-data.js`**, c'est le seul fichier à toucher pour l'essentiel :

- `CONFIG.emailDestinataire` : l'adresse où recevoir les choix
- `CONFIG.titre` / `CONFIG.sousTitre` : le message d'accueil
- `ETAPES` : la liste des questions. Chaque étape a une `question`, un `emoji`,
  et une liste d'`options` (`emoji`, `label`, `desc`). Ajoute, retire ou
  modifie librement !

Exemple pour ajouter une étape :

```js
{
  id: "musique",
  emoji: "🎵",
  question: "Quelle ambiance musicale ?",
  options: [
    { emoji: "🎷", label: "Jazz feutré",   desc: "Douceur et élégance" },
    { emoji: "🎸", label: "Pop/rock",       desc: "On bouge un peu" },
  ],
},
```

## 🚀 Tester en local

Ouvre simplement `index.html` dans ton navigateur (double-clic).
Aucune installation nécessaire, c'est du HTML/CSS/JS pur.

Pour un vrai serveur local :

```bash
# Python
python3 -m http.server 8000
# puis ouvre http://localhost:8000
```

## 🌐 Mettre en ligne (gratuit)

Le plus simple : **GitHub Pages**.

1. Dans le dépôt GitHub → **Settings → Pages**
2. **Source** : branche `main` (ou la branche de ton choix), dossier `/ (root)`
3. Enregistre → le site est publié sur une URL du type
   `https://feesh-78.github.io/nima/`

Tu peux aussi le déposer sur **Netlify** ou **Vercel** (glisser-déposer du
dossier), aucun réglage nécessaire, c'est un site statique.

---

Fait avec ❤️ pour préparer une belle surprise.
