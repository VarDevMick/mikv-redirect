# Design system — F-06, F-19

## Intention

Donner à la page une identité d'affiche de montagne : papier chaud, encre
brune, quelques accents. Et garantir que le défilement se comporte de la
façon dont dépendent toutes les animations liées au scroll.

## Comportement attendu

- Fonds papier déclinés en trois nuances très proches, qui distinguent les
  sections sans jamais devenir des blocs de couleur.
- Typographie sérif (Georgia), titres compacts, texte à 1,02 rem.
- Barre de défilement invisible, alignement doux des sections.

## Contraintes et pièges

**Le défilement doit appartenir au document.** C'est la contrainte la plus
coûteuse du projet. Une version antérieure posait `height: 100%` et
`overflow-y: scroll` sur `body` : le body devenait alors le conteneur de
défilement, `window.scrollY` restait bloqué à 0, et **tout ce qui suit le
scroll cessait de fonctionner** — la randonneuse ne bougeait plus d'un
pixel. Ne jamais remettre ces deux propriétés sur `body`.

`scroll-snap-type` va donc sur `html`, pas sur `body`.

**Les accents chauds sont rares par construction.** Terracotta et ocre ne
servent qu'aux points d'attention. Les banaliser fait perdre leur effet —
c'est ce qui s'est passé pendant la phase verte.

## Écarté

**Palette sombre** (bleu nuit, sections alternées foncées) — abandonnée au
profit du dessin au trait sur fond clair.

**Palette à dominante verte** — essayée sur demande, puis rejetée : « on
aimait mieux les couleurs d'avant ». Les verts restent, mais comme couleur
de décor, pas comme fond.

**Dessin au trait intégral** (personnages en contours, sans aplats) — le
décor l'a gardé, les personnages non : jugés moins lisibles ainsi.

## Fichiers

- `src/styles/tokens.js` — palette, typographie
- `src/styles/layout.js` — sections, défilement

## Prompt

> Dans `src/styles/`, la palette est une affiche de montagne : papier crème,
> encre brune, terracotta et ocre en accents rares, verts réservés au décor.
> Le défilement appartient au document — ne remets jamais `height: 100%` ni
> `overflow-y: scroll` sur `body`, ça casse toutes les animations de scroll.
> Une palette verte dominante a déjà été essayée et rejetée.
