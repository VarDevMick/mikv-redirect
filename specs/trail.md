# Sentier et randonneuse — F-13, F-14, F-15, F-16

## Intention

Incarner la progression : une randonneuse descend un chemin au rythme exact
du défilement, plante sa tente à chaque étape, et finit par s'endormir. Elle
fait le lien entre l'anniversaire et le trek.

## Comportement attendu

Un sentier en lacets, tracé sur toute la hauteur de la fenêtre, à gauche. La
portion parcourue se dessine derrière elle, la suite reste en pointillés
pâles.

- **Apparition** — invisible au chargement, elle **émerge du 30** dès les
  premiers pixels de défilement, en grandissant depuis le centre du chiffre.
- **Marche** — jambes alternées, bras qui balance, buste qui tangue, mèche
  qui ondule. Elle se retourne selon le sens de la pente.
- **Bivouac** — à hauteur de chaque étape elle s'arrête, une tente se plante
  sur le sentier et elle se tourne vers elle.
- **Fin** — elle quitte le sentier, rejoint le milieu bas de page, s'efface
  et cède la place à la scène de sommeil.

## Contraintes et pièges

**Elle marche sur la courbe, pas à côté.** Sa position vient de
`getPointAtLength()` sur le tracé lui-même. Une version antérieure calculait
une sinusoïde indépendante : elle ne suivait alors aucun chemin visible.

**Le défilement doit appartenir au document.** Si `body` redevient le
conteneur de défilement, `window.scrollY` reste à 0 et **elle ne bouge
plus** — c'est exactement le bug qui a été signalé. Voir
`specs/design-system.md`.

**Les trois seuils commandent tout le parcours :**

| Seuil | Valeur | Rôle |
|---|---|---|
| `SORTIE` | 0.07 | fraction pendant laquelle elle sort du 30 |
| `APPROCHE` | 0.88 | à partir d'ici elle converge vers le bas de page |
| `COUCHEE` | 0.985 | au-delà, la scène de sommeil prend le relais |

**Le `viewBox` du sentier fait 1000 de haut** et s'étire sur la fenêtre. La
conversion en pixels multiplie donc par `innerHeight / 1000`.

**Elle dépend de deux éléments extérieurs** : `#grosTrente` pour son point
de départ, et les `.route-step` pour situer les bivouacs. Les retirer la
laisse au repos sur le tracé, sans erreur mais sans vie.

## Écarté

**Une colonne de fond** derrière le sentier — une bande bleu nuit fixe :
« le coup de la bande c'est moche ». Le sentier passe désormais directement
au-dessus des sections, sans fond.

**Une bulle d'opacité** derrière elle pour la détacher du fond : « retire la
bulle d'opacité c'est moche ».

**Un liseré clair** autour de sa silhouette, même objectif — remplacé par la
bulle, elle-même retirée. Il ne reste qu'une ombre portée discrète.

**Un dessin au trait** du personnage, sans aplats — jugé moins bon que la
version colorée : « le personnage était visuellement mieux avant ».

**Un déplacement rectiligne** — refusé : elle doit serpenter.

## Fichiers

- `src/components/trail/trail.js` — tracé, styles, logique de défilement
- `src/components/trail/figures.js` — les trois dessins

## Prompt

> `src/components/trail/trail.js` fait descendre une randonneuse le long
> d'un sentier en lacets, au rythme du défilement. Sa position vient de
> `getPointAtLength()` sur le tracé, donc elle marche exactement dessus.
> Elle émerge du `#grosTrente`, bivouaque à hauteur de chaque `.route-step`,
> et s'endort en fin de page. Trois seuils règlent le parcours : `SORTIE`,
> `APPROCHE`, `COUCHEE`. Ne remets pas de bande de fond, de bulle
> d'opacité ni de liseré autour d'elle : les trois ont été rejetés. Le
> personnage reste en aplats colorés, pas en dessin au trait.
