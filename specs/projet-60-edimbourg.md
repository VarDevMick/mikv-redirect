# Projet /60 — Édimbourg, 60 ans

Plan de travail. À valider avant de commencer.

## Contexte

Deuxième page-cadeau, bâtie sur le code de `/30`. Elle est offerte par ta
copine **à sa mère**, pour ses 60 ans : un week-end de trois jours à
Édimbourg, déjà réservé.

Différence de fond avec `/30` : le voyage est **décidé, mais les dates
restent une surprise**. La page déroule donc le programme d'abord, et ne
révèle les dates qu'à la fin. C'est l'inverse de `/30`, qui proposait sans
rien fixer.

La voix qui parle est celle de **la fille à sa mère**. Ni la tienne, ni
celle d'un dépliant touristique.

## Décisions déjà prises

| Sujet | Choix |
|---|---|
| Adresses | `/60` la page offerte, `/61` sa copie de travail avec bandeau DEV |
| Rythme | Actif mais raisonnable — Arthur's Seat proposé, jamais imposé |
| Voyageuses | Ta copine et sa mère, en duo |
| Programme | Je le construis, tu corriges |
| Objet | Plaque QR imprimée en 3D, gravée sur `https://mikv.io/60` |

## Les personnes

- **Carol**, 60 ans — celle qui reçoit. Son prénom en grand sur la page.
- **Chloé**, sa fille — celle qui offre. C'est sa voix qui parle, et sa
  signature en bas de page.

## Les dates

Pas encore connues. La page utilise **30 novembre** comme valeur d'exemple,
isolée dans une constante et signalée en commentaire, pour qu'un seul
changement suffise le jour où elles sont fixées.

Chloé tutoie sa mère.

## Si le séjour a vraiment lieu fin novembre

Deux conséquences à connaître, parce qu'elles changeraient le programme :

**Le jour est très court.** À Édimbourg fin novembre, le soleil se couche
vers 15 h 40. Trois visites par jour deviennent le maximum réaliste, et
Dean Village comme Arthur's Seat doivent passer le matin. En revanche
Calton Hill au coucher du soleil devient facile — plus besoin d'attendre
21 h comme en été.

**Les marchés de Noël sont ouverts.** Celui de Princes Street Gardens
s'installe à la mi-novembre : grande roue, chalets, vin chaud, avec le
château illuminé au-dessus. Pour un anniversaire, c'est un cadre bien plus
chaleureux qu'un parc en plein jour, et ça mériterait sa place au
programme.

Ces deux points sont à confirmer une fois les vraies dates connues.

## Programme proposé

Trois jours à pied, la vieille ville étant compacte. À corriger librement.

**Jour 1 · La vieille ville**
Royal Mile, cathédrale St Giles, Victoria Street et ses façades colorées,
Grassmarket pour déjeuner, Greyfriars Kirkyard, puis le Musée national
d'Écosse — gratuit, et son toit offre une vue.

**Jour 2 · Le château et la ville géorgienne**
Château d'Édimbourg le matin, Princes Street Gardens, New Town et son
architecture géorgienne, Calton Hill en fin de journée pour le panorama —
montée courte et douce, sans commune mesure avec Arthur's Seat.

**Jour 3 · Les villages dans la ville**
Dean Village, ancien hameau de meuniers, puis Stockbridge et ses boutiques.
L'après-midi, Holyrood et le Parlement. Arthur's Seat en option pour qui
veut, avec repli sur les jardins pour qui préfère.

**En réserve, si la pluie s'invite** — Scotch Whisky Experience, Camera
Obscura, Mary King's Close et ses ruelles souterraines.

Deux réserves d'honnêteté : ces informations viennent de blogs de voyage,
donc **horaires et tarifs sont à vérifier** avant le départ. Et le **billet
du château se réserve à l'avance**, c'est le seul point vraiment contraint.
Le marché de Stockbridge n'a lieu que le dimanche.

## Ce que le code réutilise tel quel

Le découpage en composants paie ici : cinq briques fonctionnent sans
modification, seul leur contenu change.

| Composant | Réutilisé | Ce qui change |
|---|---|---|
| `components/music/` | intégralement | rien |
| `components/route-map/` | mécanique | le tracé devient un plan de ville |
| `components/step-card/` | intégralement | photos et textes |
| `components/trail/` | mécanique de défilement | les dessins |
| `components/hero/` | cascade et feu d'artifice | le décor de fond |
| `styles/layout.js` | intégralement | rien |

Le feu d'artifice tombe particulièrement bien : Édimbourg est la ville du
Hogmanay et de ses feux au-dessus du château.

## Ce qu'il faut créer

**Une notion de thème.** Aujourd'hui la palette et les dessins de montagne
sont écrits en dur. Je les sors dans `src/themes/`, avec `queyras/` pour
l'existant et `edimbourg/` pour le nouveau. Les composants reçoivent le
thème en paramètre au lieu de le supposer.

```
src/themes/
  queyras/     palette chaude, crêtes, sapins, randonneuse
  edimbourg/   palette pierre, silhouettes urbaines, duo mère-fille
```

**La palette d'Édimbourg** : pierre grise, bruyère violette, ambre du
whisky, vert et rouge de tartan, ardoise sombre. Rien à voir avec les ocres
du Queyras, mais la même logique — des fonds sobres, des accents rares.

**Les silhouettes urbaines** remplacent les crêtes entre les sections :
château sur son rocher, monument Scott, colonnes de Calton Hill, la bosse
d'Arthur's Seat. Dessinées au trait, comme les montagnes.

**Le duo mère-fille** remplace la randonneuse solitaire : deux personnages
qui marchent ensemble dans la ville. Même mécanique d'animation, deux
silhouettes au lieu d'une.

**Le plan de ville** remplace le tracé de sentier : un plan d'Édimbourg
stylisé avec les points visités. Il sera évocateur et non cartographique,
comme l'était le tracé du GR58 — je le dirai dans la spec pour que personne
ne le prenne pour une carte exacte.

**Les photos** viendront de Wikimedia Commons sous licence libre, comme
pour `/30`, avec leurs crédits conservés.

## Ordre de travail

1. Extraire les thèmes sans rien changer au rendu — `/30` et `/31` doivent
   rester identiques à l'octet près après cette étape
2. Créer le thème Édimbourg : palette, silhouettes, duo, plan de ville
3. Écrire le contenu : programme, textes, photos, révélation des dates
4. Assembler `/60` et `/61`, publier `/61` pour relecture
5. Une fois validé, générer la plaque QR avec le skill `qr-3d`
6. Geler `/60` à l'impression, écrire sa spec

## Vérification

- Après l'étape 1 : `docs/30/index.html` et `docs/31/index.html` inchangés,
  comparés octet par octet
- Chaque étape publiée sur `/61` avant validation
- La plaque QR passe le vérificateur du skill, puis le décodeur Vision
- Le lien `https://mikv.io/60` répond avant impression de l'objet

## Hors périmètre

`/30` et `/31` ne changent pas de rendu. `src/page-30.js` reste gelé et
n'est pas touché par l'extraction des thèmes.
