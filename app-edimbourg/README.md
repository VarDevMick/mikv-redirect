# app-edimbourg — la page `/61`

Le mini-site immersif offert à Carol pour ses 60 ans. Le brief est dans
`../specs/brief-60-immersif.md` ; ce fichier ne dit que comment le code est
organisé, et pourquoi.

```
npm run dev      # http://localhost:5173/61/
npm run build    # écrit directement dans ../docs/61
```

Depuis la racine du dépôt, `npm run build` construit les quatre pages :
`/30`, `/31` et `/60` par l'ancien générateur statique, `/61` par Vite.

## Le principe

Le scroll fait avancer le voyage. Une seule carte accompagne tout le récit,
de Reims à Édimbourg ; seule sa caméra change d'échelle.

Chaque scène est une section haute de N × 100 svh dont l'enfant est collant.
`useScrollScene` transforme la traversée de cette section en un avancement
de 0 à 1 — jamais un nombre de pixels, pour que le récit soit le même sur un
petit téléphone et sur un écran large.

Deux règles y tiennent tout le reste :

- **Le scroll pose une cible, une boucle d'animation s'en rapproche.** Les
  événements de défilement arrivent par paquets irréguliers ; peindre
  directement dessus faisait sautiller la carte.
- **Rien ne passe par l'état React.** L'avancement change à chaque image :
  les scènes écrivent directement dans le DOM et dans Leaflet.

## La carte

`map/journeyMap.ts` est le seul endroit qui parle à Leaflet. Les scènes lui
demandent un point et **une étendue en kilomètres** — jamais un niveau de
zoom, qui ne montrerait pas la même chose selon la taille de l'écran.

Le fond n'est pas une couche de tuiles mais **cinq images livrées avec le
site**, fabriquées par `scripts/fetch-backgrounds.py` à partir
d'OpenStreetMap. En tuiles, le récit réclamait près de 1 700 tuiles — une
cinquantaine de méga-octets — demandées pendant le scroll : trop lourd, et
le décor arrivait en retard. Les cinq images pèsent 3,4 Mo à elles toutes,
se chargent une fois, et l'étendue visible décide laquelle est à l'écran.

La ville porte son propre filtre, plus clair que celui des fonds lointains
(`.fond--ville`) : c'est le seul fond qu'on lise vraiment — on y cherche une
rue, un parc, la distance d'un arrêt au suivant.

Deux calques se glissent entre le fond et les tracés :

- le **voile** (`setMapVeil`) éteint le pays pendant le vol. Les fonds
  écrivent « Edinburgh » en clair, et la ville ne doit pas être lisible
  avant d'être nommée.
- le **filtre de nuit** (CSS, `.leaflet-fond-pane`) retourne les couleurs de
  plein jour en hiver écossais. Il est fixe : toute valeur animée sur un
  filtre oblige le navigateur à refabriquer l'image à chaque frame.

## Les données

Tout le contenu est séparé du code, dans `src/data/` :

| Fichier | Contenu |
|---|---|
| `trip.ts` | les faits du voyage et tous les textes |
| `itinerary.ts` | les trois journées et leurs douze étapes |
| `places.ts` | les points géographiques, géocodés via Nominatim |
| `routes.generated.ts` | le tracé routier Reims → Roissy, par OSRM |
| `backdrops.generated.ts` | les fenêtres exactes des trois fonds |

Les fichiers `*.generated.ts` sont écrits par les scripts et versionnés :
le site se construit sans réseau. **Aucune coordonnée n'est inventée** — pour
en ajouter une, la géocoder.

## Le récit

La destination reste secrète jusqu'à l'atterrissage : on part sans savoir
où, et Édimbourg n'est nommée qu'une fois l'Écosse dessinée sous l'avion.
Aucun texte, aucune étiquette ne doit vendre la mèche avant.

```
Intro → Buildup → RoadTrip → Flight → DestinationReveal
      → CityTransition → Jour 1 → BirthdayBeat → Jour 2 → Jour 3 → Final
```

Une journée se marche : le scroll fait avancer un chemin piéton continu
(`walks.generated.ts`, calculé par OSRM), la caméra suit le pas, et chaque
arrêt allume son repère puis sa fiche. On s'arrête plus longtemps qu'on ne
marche — c'est à l'arrêt qu'il y a quelque chose à lire.

Chaque trajet porte sa distance au milieu du tracé, et la poussette d'Hector
le parcourt à l'écran. Au-delà de deux kilomètres, c'est un bus : le
Britannia est à Leith, et cette étape-là ne se marche pas.

Le voyage s'accumule vers l'avant : une scène traversée garde son dernier
état, ce qui laisse les tracés et les repères en place pour la carte finale.
En remontant, chaque scène efface ce qu'elle avait posé.

Reste à faire : choisir le dernier lieu du jour 3 (`toDecide` dans
`itinerary.ts`), puis geler `/60` et graver la plaque QR.
