/* Chargement du contenu du jeu (dossier data/). */

let cache = null;

export function loadOutfits() {
  if (!cache) {
    cache = fetch("data/outfits.json")
      .then((r) => {
        if (!r.ok) throw new Error("catalogue des tenues introuvable");
        return r.json();
      })
      .then((data) => data.outfits)
      .catch((err) => { cache = null; throw err; });
  }
  return cache;
}
