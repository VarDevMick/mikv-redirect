# Plan interactif — F-17

## Intention

Donner un repère spatial pendant la traversée des trois étapes : où on en
est du parcours, et ce qui reste. Le plan reste visible pendant qu'on lit
les cartes.

## Comportement attendu

Un plan collé en haut de la section des étapes, avec quatre points clés :
Souliers, Arvieux, Furfande, Bramousse. En arrivant sur une étape, son
point s'active — il grossit et se colore — son libellé passe en gras, et le
tracé parcouru progresse jusqu'à lui.

## Contraintes et pièges

**Le tracé est stylisé, pas géographique.** Il évoque un itinéraire de
montagne, il ne reproduit pas les coordonnées réelles du GR58. Ne pas le
présenter comme une carte exacte.

**Les fractions de progression sont calées à la main** — `[0.02, 0.36,
0.68, 1]` — sur les positions des quatre points le long de la courbe. Si le
tracé change, ces valeurs doivent être recalées, sinon le trait ne s'arrête
plus sur les points.

**`IntersectionObserver` avec `rootMargin: "-40% 0px -40% 0px"`** : l'étape
devient active quand elle occupe la bande centrale de l'écran, pas dès
qu'elle effleure le bord.

**`data-idx` commence à 1** sur les étapes, l'index 0 étant le point de
départ. Le composant `step-card` produit ces attributs, et le sentier s'en
sert aussi pour placer les bivouacs.

## Écarté

**Un filet sous le plan** pour marquer sa limite — refusé, puis remplacé par
une frise dentée brune, elle-même retirée : « retire cette frise ». Le plan
n'a aujourd'hui aucune bordure basse.

## Fichiers

- `src/components/route-map/route-map.js` — plan, styles, script
- `src/data/steps.js` — `TRACE_PLAN` et `REPERES`

## Prompt

> `src/components/route-map/route-map.js` affiche le plan collé en haut des
> étapes, avec quatre points clés qui s'activent au défilement via
> `IntersectionObserver`. Le tracé est évocateur, pas géographique. Les
> fractions de progression sont calées à la main sur les points : si tu
> changes le tracé, recale-les. Ne remets pas de bordure sous le plan, ça a
> été refusé deux fois.
