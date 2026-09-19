// Récupère les vrais cheminements piétons entre les étapes de chaque
// journée et les écrit dans src/data/walks.generated.ts.
//
//   node scripts/fetch-walks.mjs
//
// Une journée devient un seul chemin continu, du premier au dernier arrêt,
// avec la position de chaque arrêt le long de ce chemin. La scène n'a plus
// qu'à faire avancer une marche : le tracé se dessine, la caméra suit, et
// les arrêts s'allument quand on les atteint.
//
// À relancer seulement si le programme change : le fichier généré est
// versionné pour que le site se construise sans réseau.
import { writeFileSync } from "node:fs";
import { DAYS } from "../src/data/itinerary.ts";

// Profil piéton public d'OSRM. Le profil de la démo officielle ne connaît
// que la voiture, ce qui ferait passer les étapes par des sens interdits et
// éviterait les ruelles.
const OSRM = "https://routing.openstreetmap.de/routed-foot/route/v1/foot";

const attendre = (ms) => new Promise((r) => setTimeout(r, ms));

async function cheminement(depuis, vers) {
  const url =
    `${OSRM}/${depuis.lng},${depuis.lat};${vers.lng},${vers.lat}` +
    `?overview=full&geometries=geojson`;
  const reponse = await fetch(url);
  const donnees = await reponse.json();
  if (donnees.code !== "Ok") {
    throw new Error(`OSRM (${depuis.title} → ${vers.title}) : ${donnees.code}`);
  }
  const route = donnees.routes[0];
  return {
    points: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    metres: route.distance,
  };
}

const distance = ([lat1, lng1], [lat2, lng2]) => {
  const rad = (d) => (d * Math.PI) / 180;
  const a =
    Math.sin(rad(lat2 - lat1) / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(rad(lng2 - lng1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
};

const journees = [];

for (const jour of DAYS) {
  const chemin = [];
  const arrets = [0];
  let metres = 0;

  for (let i = 0; i < jour.activities.length - 1; i++) {
    const depart = jour.activities[i];
    const arrivee = jour.activities[i + 1];

    if (depart.lat === arrivee.lat && depart.lng === arrivee.lng) {
      // Deux étapes au même endroit — le dernier repas, encore à choisir.
      arrets.push(chemin.length - 1);
      continue;
    }

    const { points, metres: m } = await cheminement(depart, arrivee);
    metres += m;
    // Le point de jonction est déjà là : on ne le répète pas.
    chemin.push(...(chemin.length ? points.slice(1) : points));
    arrets.push(chemin.length - 1);
    await attendre(1100); // usage raisonnable du service public
  }

  // Position de chaque arrêt le long du chemin, en fraction de distance.
  const cumul = [0];
  for (let i = 1; i < chemin.length; i++) {
    cumul.push(cumul[i - 1] + distance(chemin[i - 1], chemin[i]));
  }
  const total = cumul.at(-1) || 1;

  journees.push({
    id: jour.id,
    chemin,
    arrets: arrets.map((index) => +(cumul[Math.max(index, 0)] / total).toFixed(4)),
    km: +(total).toFixed(1),
  });

  console.log(
    `${jour.id} : ${chemin.length} points, ${total.toFixed(1)} km, ` +
      `arrêts à ${journees.at(-1).arrets.join(", ")}`
  );
}

const corps = journees
  .map(
    (j) => `  "${j.id}": {
    km: ${j.km},
    arrets: [${j.arrets.join(", ")}],
    chemin: [
${j.chemin.map(([lat, lng]) => `      [${lat.toFixed(5)}, ${lng.toFixed(5)}],`).join("\n")}
    ],
  },`
  )
  .join("\n");

writeFileSync(
  new URL("../src/data/walks.generated.ts", import.meta.url),
  `// Généré par scripts/fetch-walks.mjs — ne pas modifier à la main.
//
// Un chemin continu par journée, calculé par OSRM (profil piéton) sur les
// données OpenStreetMap, et la position de chaque arrêt le long de ce
// chemin, en fraction de distance parcourue.
export interface Marche {
  /** Longueur totale de la journée, en kilomètres. */
  km: number;
  /** Avancement de chaque arrêt, de 0 à 1. */
  arrets: number[];
  chemin: [number, number][];
}

export const MARCHES: Record<string, Marche> = {
${corps}
};
`
);

console.log("\nwalks.generated.ts écrit.");
