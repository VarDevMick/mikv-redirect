# Décor — F-07

## Intention

Assurer la transition entre deux sections par un paysage plutôt que par une
ligne. Le regard passe d'une section à l'autre en traversant une vallée.

## Comportement attendu

Quatre plans superposés, du plus lointain au plus proche :

1. chaîne lointaine en pierre chaude, deux sommets enneigés ;
2. versant boisé vert sauge, planté de cinq sapins ;
3. alpage ocre ;
4. premier plan **dans la couleur de la section suivante**.

Chaque plan porte un trait fin sur sa crête.

## Contraintes et pièges

**Le dernier plan fait la transition.** `separation(fond)` reçoit la couleur
de la section qui suit, ce qui soude visuellement les deux sections. Passer
une couleur qui ne correspond pas produit une marche.

**Les sapins doivent être posés assez haut.** Première version : plantés
trop bas, ils étaient recouverts par les couches d'alpage et de premier
plan — on ne voyait que leurs pointes. Ils sont désormais à `y ≈ 48-54`
dans un `viewBox` de 90 de haut.

**Les sapins sont pleins, pas en contour.** En simple trait fin, ils
disparaissaient sur le fond.

**`preserveAspectRatio="none"`** étire le dessin horizontalement. Acceptable
pour des crêtes et des courbes, visible sur un motif détaillé — c'est
pourquoi les sapins restent simples.

## Écarté

**Une découpe en dents de scie** entre les sections — jugée « moche », trop
régulière, et elle traversait la colonne du sentier. Retirée entièrement.

**Un simple filet d'un pixel** — explicitement refusé : « je ne veux pas de
bords simple ligne ».

## Fichiers

- `src/components/scenery/scenery.js` — `separation(fond)` et le motif
  `SAPIN`, réutilisé par le massif d'ouverture

## Prompt

> `src/components/scenery/scenery.js` dessine les séparations entre
> sections : quatre plans de montagne, le plus proche prenant la couleur de
> la section suivante pour faire la transition. Les sapins sont des formes
> pleines posées haut sur le versant, sinon les couches suivantes les
> recouvrent. Pas de filet simple ni de dents de scie : les deux ont été
> rejetés.
