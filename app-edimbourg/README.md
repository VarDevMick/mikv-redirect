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

Le fond n'est pas une couche de tuiles mais **trois images livrées avec le
site**, fabriquées par `scripts/fetch-backgrounds.py` à partir
d'OpenStreetMap. En tuiles, le récit réclamait près de 1 700 tuiles — une
cinquantaine de méga-octets — demandées pendant le scroll : trop lourd, et
le décor arrivait en retard. Les trois images pèsent 1,8 Mo à elles toutes,
se chargent une fois, et l'étendue visible décide laquelle est à l'écran.

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
```

Reste à écrire : les trois journées et leurs douze étapes, le clin d'œil
anniversaire entre le jour 1 et le jour 2, et la fin.
