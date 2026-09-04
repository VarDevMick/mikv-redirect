# QR code imprimable en 3D — F-20 à F-25

## Intention

Fabriquer l'objet physique du cadeau : une plaque imprimée en 3D portant un
QR code qui mène à `https://mikv.io/30`.

Le travail est packagé en **skill réutilisable** : `~/.claude/skills/qr-3d/`.
Cette spec ne répète pas son mode d'emploi, elle garde ce qui est propre au
projet et les leçons apprises.

## Ce qui a été produit pour ce projet

- Plaque de 111 × 137,6 × 3,2 mm, module de 3 mm
- QR en style arrondi, chiffre « 30 » au centre, « Joyeux anniversaire ! »
  gravé dessous
- Deux STL bicolores, imprimés sur une Bambu Lab A1 avec AMS

## Contraintes et pièges

**Un QR mono-couleur ne scanne pas.** Le relief seul ne suffit pas, il faut
un contraste de couleur. D'où les deux STL.

**Une seule transition de couleur sur toute l'impression** : le clair occupe
les couches de 0 à 2,4 mm, le sombre de 2,4 à 3,2 mm. L'AMS ne purge donc
qu'une fois. Le sens clair → sombre est le bon, l'inverse gaspille beaucoup.

**L'arrondi des repères est plafonné à 1,2 module.** Au-delà, les quatre
coins de chacun des trois repères d'angle disparaissent — douze modules — et
la détection échoue. Le code paraissait parfait à l'œil. Ne pas relever
cette valeur sans repasser la vérification.

**Vision fait foi, pas jsQR.** Le décodeur de bibliothèque jsQR a refusé le
style arrondi que le moteur Vision d'Apple — celui de l'appareil photo de
l'iPhone — décode sans peine, jusqu'à une image réduite à 160 px.

**Le chiffre central coûte 14 % du code**, quand le niveau de correction H
en reconstitue 30 %. La marge est confortable, mais elle n'est pas infinie.

## Vérifier avant d'imprimer, toujours

Une impression ratée, c'est du filament et des heures perdues. La chaîne de
contrôle est dans le skill : comparaison module par module contre la matrice
théorique, puis décodage réel par Vision.

Deux bugs du vérificateur lui-même ont été corrigés en le testant : il
déduisait l'échelle de la boîte englobante du maillage sombre — qui exclut
la marge et la bande de texte — et il comptait la zone centrale évidée comme
des erreurs. Le générateur du skill écrit désormais sa géométrie exacte dans un fichier
annexe, que le vérificateur lit au lieu de la deviner.

## Fichiers

- `~/.claude/skills/qr-3d/` — le skill, réutilisable ailleurs
- `scripts/generate-plaque.mjs` — la version propre à ce projet
- `scripts/generate-qr.mjs`, `scripts/generate-stl.mjs` — premières versions
  (SVG, PNG, OpenSCAD, STL carré), conservées
- `qr/` — les fichiers produits

## Prompt

> Utilise le skill `qr-3d` pour générer une plaque QR imprimable. Rappels
> pour ce projet : le QR encode `https://mikv.io/30`, l'arrondi des repères
> ne dépasse jamais 1,2 module sous peine de rendre le code illisible, et il
> faut deux STL bicolores car un QR mono-couleur ne scanne pas. Vérifie
> toujours avant d'imprimer, avec le décodeur Vision d'Apple et pas avec
> jsQR, qui refuse à tort les styles arrondis.
