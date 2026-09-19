// Généré par scripts/fetch-backgrounds.py — ne pas modifier à la main.
//
// Coordonnées exactes des fonds de carte livrés avec le site. Chaque fond
// couvre une échelle du voyage ; journeyMap les superpose et passe de l'un à
// l'autre en fondu selon l'étendue visible.
export interface Backdrop {
  /** Sud-ouest puis nord-est, en degrés. */
  bounds: [[number, number], [number, number]];
  /** Niveau de zoom OpenStreetMap auquel l'image a été fabriquée. */
  zoom: number;
  width: number;
  height: number;
}

export const FONDS = {
  couloir: {
    bounds: [
      [47.6, 2.0],
      [50.6, 4.6],
    ],
    zoom: 10,
    width: 1894,
    height: 3338,
  },
  france: {
    bounds: [
      [45.5, -2.0],
      [53.0, 7.0],
    ],
    zoom: 8,
    width: 1638,
    height: 2098,
  },
  ecosse: {
    bounds: [
      [53.5, -8.5],
      [59.5, 0.5],
    ],
    zoom: 8,
    width: 1638,
    height: 1984,
  },
  europe: {
    bounds: [
      [42.0, -12.0],
      [61.0, 10.0],
    ],
    zoom: 6,
    width: 1001,
    height: 1417,
  },
} satisfies Record<string, Backdrop>;

export type BackdropId = keyof typeof FONDS;
