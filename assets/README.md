# 🖼️ Avatars du couple

Dépose ici les **vrais portraits** (version manga si tu veux) :

- `elle.png` — portrait d'elle
- `lui.png` — portrait de toi

Conseils : image **carrée**, **fond transparent** (PNG), visage bien centré.

## Comment les activer

Ouvre `js/quiz-data.js`, section `CONFIG.avatars`, et renseigne le champ `img` :

```js
avatars: {
  elle: { img: "assets/elle.png" },
  lui:  { img: "assets/lui.png" },
},
```

C'est tout ! Les images remplaceront automatiquement les mascottes dessinées,
partout dans le site (accueil, message mignon à chaque étape, récap).

> Tant que `img` est vide, une jolie mascotte dessinée (SVG) est affichée à la place.

## Où trouver une version manga de vous deux

- Applis d'avatars : **Picrew**, **Bitmoji**, **ZEPETO**
- Générateurs d'images IA (style manga/anime) à partir d'une photo
- Ou un·e illustrateur·rice pour un rendu unique
