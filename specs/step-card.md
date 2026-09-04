# Cartes d'étape — F-02, F-09, F-10, F-11

## Intention

Présenter les trois journées de marche. Chaque étape est **un seul bloc**,
où le paysage occupe la place principale et les chiffres se lisent par
dessus.

## Comportement attendu

La photo remplit toute la carte. Un voile dégradé s'assombrit vers le bas,
et le texte se cale dessus en crème : jour, trajet, une phrase de
caractère, puis trois chiffres — durée de marche, D+, D−.

La section entière a un fond ocre soutenu texturé de courbes de niveau, qui
la distingue au premier coup d'œil des autres blocs.

## L'itinéraire (F-02)

Trois étapes consécutives du Tour du Queyras, choisies comme le trio le plus
accessible du tour — ce sont les étapes officielles 7, 8 et 9. Une version
antérieure enchaînait deux journées à +880 m et +840 m : trop dur, revu à la
demande. Le profil actuel ne comporte qu'une seule vraie montée.

| Jour | Trajet | Marche | D+ | D− |
|---|---|---|---|---|
| 1 | Souliers → Chalp d'Arvieux | 4h | +510 m | −660 m |
| 2 | Chalp d'Arvieux → Refuge de Furfande | 5h | +820 m | −210 m |
| 3 | Refuge de Furfande → Bramousse | 4h30 | +210 m | −1000 m |

Source : étapes officielles du Tour du Queyras (lequeyras.com). Le refuge de
Furfande est le point le plus contraint : ouvert du 30 mai au 26 septembre,
il se remplit vite en haute saison.

## Contraintes et pièges

**Le voile doit tenir sur n'importe quelle photo.** Il monte de 5 % en haut
à 90 % en bas : presque transparent sur l'image, opaque derrière le texte.
L'affaiblir rendrait le texte illisible sur un ciel clair.

**Aucune distance en kilomètres.** La source officielle ne les donne pas.
Il vaut mieux ne rien afficher qu'un chiffre inventé — c'est une randonnée,
quelqu'un s'y fiera.

**Les photos sont sous licence libre**, issues de Wikimedia Commons, crédit
conservé dans `src/data/steps.js`. Ne jamais hotlinker une image trouvée sur
un moteur de recherche : c'est de la republication d'œuvre protégée, et
beaucoup de sites bloquent le lien direct — l'image casserait le jour du
scan.

**`object-position: center 45%`** garde l'horizon et les sommets dans le
cadre. Les trois photos sont en paysage et se font recadrer ; la vallée de
Ceillac, très panoramique, est celle qui souffre le plus.

## Écarté

Trois traitements successifs, tous rejetés — cette section existe pour
éviter de les reproposer :

**Cadre en arche** — la photo dans une forme arrondie au-dessus de la
carte : « ça fait trop d'éléments », deux blocs séparés par étape.

**Crête découpée** — la photo en tête de carte, fondue dans le papier par
une silhouette de montagne : « je n'aime pas tes intégrations de cartes où
il y a les photos ».

**Frise dentée brune** sous le plan — « c'est moche », et elle coupait la
colonne du sentier.

## Fichiers

- `src/components/step-card/step-card.js` — carte et styles
- `src/data/steps.js` — contenu des trois étapes, photos et crédits

## Prompt

> `src/components/step-card/step-card.js` produit les trois cartes d'étape :
> photo en fond plein cadre, voile dégradé, texte en crème par-dessus. Le
> contenu est dans `src/data/steps.js`. Contraintes : pas de distance en km
> (la source ne les donne pas), photos sous licence libre uniquement avec
> crédit conservé, et le voile doit rester assez opaque en bas pour tenir
> sur un ciel clair. Le cadre en arche et la crête découpée ont déjà été
> essayés et rejetés — ne les repropose pas.
