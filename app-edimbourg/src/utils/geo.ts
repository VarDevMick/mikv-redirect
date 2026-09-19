// Parcours d'un tracé : où se trouve le véhicule à l'avancement t, dans
// quelle direction il pointe, et quelle portion du chemin est déjà faite.

export type LatLng = [number, number];

const rad = (deg: number) => (deg * Math.PI) / 180;
const deg = (rad: number) => (rad * 180) / Math.PI;

/** Distance approchée entre deux points, en kilomètres (Haversine). */
export function distance([lat1, lng1]: LatLng, [lat2, lng2]: LatLng): number {
  const R = 6371;
  const dLat = rad(lat2 - lat1);
  const dLng = rad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Longueurs cumulées le long d'un tracé, normalisées entre 0 et 1.
 * Calculées une fois, pour que l'avancement au scroll soit régulier en
 * distance et non en nombre de points.
 */
export function cumulativeLengths(path: LatLng[]): number[] {
  const cumul = [0];
  for (let i = 1; i < path.length; i++) {
    cumul.push(cumul[i - 1] + distance(path[i - 1], path[i]));
  }
  const total = cumul[cumul.length - 1] || 1;
  return cumul.map((d) => d / total);
}

/** Interpolation linéaire entre deux positions. */
export function lerpLatLng(a: LatLng, b: LatLng, t: number): LatLng {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
}

function segmentAt(cumul: number[], t: number) {
  const clamped = Math.min(Math.max(t, 0), 1);
  let i = 1;
  while (i < cumul.length - 1 && cumul[i] < clamped) i++;
  const span = cumul[i] - cumul[i - 1] || 1;
  return { index: i, local: (clamped - cumul[i - 1]) / span };
}

/** Position sur le tracé à l'avancement t (0 = départ, 1 = arrivée). */
export function pointAt(path: LatLng[], cumul: number[], t: number): LatLng {
  const { index, local } = segmentAt(cumul, t);
  return lerpLatLng(path[index - 1], path[index], local);
}

/** Cap suivi à l'avancement t, en degrés depuis le nord. */
export function bearingAt(path: LatLng[], cumul: number[], t: number): number {
  const { index } = segmentAt(cumul, t);
  const [lat1, lng1] = path[index - 1];
  const [lat2, lng2] = path[index];
  const dLng = rad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(rad(lat2));
  const x =
    Math.cos(rad(lat1)) * Math.sin(rad(lat2)) -
    Math.sin(rad(lat1)) * Math.cos(rad(lat2)) * Math.cos(dLng);
  return (deg(Math.atan2(y, x)) + 360) % 360;
}

/** Portion déjà parcourue, prête à être donnée à une polyligne. */
export function traveled(path: LatLng[], cumul: number[], t: number): LatLng[] {
  const { index, local } = segmentAt(cumul, t);
  const parcouru = path.slice(0, index);
  parcouru.push(lerpLatLng(path[index - 1], path[index], local));
  return parcouru;
}

/**
 * Arc de grand cercle entre deux points : la route que suit vraiment un
 * avion, courbée vers le nord sur une carte plate.
 */
export function greatCircle(from: LatLng, to: LatLng, steps = 96): LatLng[] {
  const [lat1, lng1] = [rad(from[0]), rad(from[1])];
  const [lat2, lng2] = [rad(to[0]), rad(to[1])];
  const d =
    2 *
    Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2
      )
    );
  if (d === 0) return [from, to];

  const points: LatLng[] = [];
  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    const a = Math.sin((1 - f) * d) / Math.sin(d);
    const b = Math.sin(f * d) / Math.sin(d);
    const x = a * Math.cos(lat1) * Math.cos(lng1) + b * Math.cos(lat2) * Math.cos(lng2);
    const y = a * Math.cos(lat1) * Math.sin(lng1) + b * Math.cos(lat2) * Math.sin(lng2);
    const z = a * Math.sin(lat1) + b * Math.sin(lat2);
    points.push([deg(Math.atan2(z, Math.sqrt(x * x + y * y))), deg(Math.atan2(y, x))]);
  }
  return points;
}
