# Specs

Une spec par composant. Chacune répond à trois questions que le code seul
ne sait pas raconter :

- **Pourquoi** cette fonctionnalité existe et ce qu'elle doit produire ;
- **Ce qu'on a appris** en la construisant — valeurs limites, pièges,
  approches abandonnées et la raison de leur abandon ;
- **Le prompt** à réutiliser pour la faire évoluer sans repartir de zéro.

Le troisième point est le plus utile en pratique : il évite de réexpliquer
le contexte à chaque session.

| Spec | Composant | Fonctionnalités |
|---|---|---|
| [design-system](design-system.md) | `styles/` | F-06, F-19 |
| [hero](hero.md) | `components/hero/` | F-01, F-08, F-12 |
| [scenery](scenery.md) | `components/scenery/` | F-07 |
| [story](story.md) | `components/story/` | F-03, F-04, F-05 |
| [route-map](route-map.md) | `components/route-map/` | F-17 |
| [step-card](step-card.md) | `components/step-card/` | F-02, F-09, F-10, F-11 |
| [trail](trail.md) | `components/trail/` | F-13 à F-16 |
| [music](music.md) | `components/music/` | F-18 |
| [qr-3d](qr-3d.md) | skill `qr-3d` | F-20 à F-25 |
| [publication](publication.md) | `scripts/build-static.mjs` | F-26 à F-28 |

## Règles qui valent pour tout le projet

**`/30` est gelée.** C'est la page visée par le QR code gravé sur la plaque
offerte. `src/page-30.js` reste monolithique et ne doit plus être modifié.
Toute évolution passe par `/31`. Après un changement, vérifier que
`docs/30/index.html` n'a pas bougé d'un octet.

**Rien ne part en production sans avoir été vu.** Publier sur `/31`, faire
regarder, puis seulement valider.

**Pas d'image sous droits.** Photos issues de Wikimedia Commons sous licence
libre, crédit conservé dans `src/data/steps.js`. Pas de hotlink vers un site
tiers, qui casserait au premier changement chez l'hébergeur.

**Le mobile d'abord.** La page est scannée depuis un téléphone. Tout se
juge sur un écran de téléphone, pas dans une fenêtre de bureau.
