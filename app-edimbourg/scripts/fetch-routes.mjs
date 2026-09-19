// Récupère le vrai tracé routier Reims → Paris-Roissy (OSRM, données OSM) et
// l'écrit dans src/data/routes.generated.ts.
//
//   node scripts/fetch-routes.mjs
//
// À relancer seulement si le trajet change : le fichier généré est versionné
// pour que le site se construise sans réseau.
import { writeFileSync } from "node:fs";
import { REIMS, ROISSY } from "../src/data/places.ts";

const OSRM = "https://router.project-osrm.org/route/v1/driving";

const url =
  `${OSRM}/${REIMS.lng},${REIMS.lat};${ROISSY.lng},${ROISSY.lat}` +
  `?overview=full&geometries=geojson`;

const reponse = await fetch(url);
const donnees = await reponse.json();
if (donnees.code !== "Ok") throw new Error(`OSRM : ${donnees.code}`);

const route = donnees.routes[0];

// Le tracé complet fait plusieurs centaines de points : inutile pour une
// animation. On en garde un sur N, en conservant toujours le dernier.
const brut = route.geometry.coordinates;
const CIBLE = 120;
const pas = Math.max(1, Math.round(brut.length / CIBLE));
const points = brut.filter((_, i) => i % pas === 0);
if (points.at(-1) !== brut.at(-1)) points.push(brut.at(-1));

const lignes = points
  .map(([lng, lat]) => `  [${lat.toFixed(5)}, ${lng.toFixed(5)}],`)
  .join("\n");

writeFileSync(
  new URL("../src/data/routes.generated.ts", import.meta.url),
  `// Généré par scripts/fetch-routes.mjs — ne pas modifier à la main.
//
// Tracé routier Reims → Paris-Roissy calculé par OSRM sur les données
// OpenStreetMap : ${Math.round(route.distance / 1000)} km, environ ${Math.round(route.duration / 60)} minutes.
// ${brut.length} points d'origine réduits à ${points.length}.
export const ROUTE_REIMS_ROISSY: [number, number][] = [
${lignes}
];

export const ROUTE_REIMS_ROISSY_KM = ${Math.round(route.distance / 1000)};
export const ROUTE_REIMS_ROISSY_MINUTES = ${Math.round(route.duration / 60)};
`
);

console.log(
  `routes.generated.ts : ${points.length} points, ${Math.round(route.distance / 1000)} km`
);
