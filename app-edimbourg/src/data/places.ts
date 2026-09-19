// Tous les points géographiques du voyage, en un seul endroit.
//
// Les coordonnées viennent de Nominatim (OpenStreetMap), relevées le
// 2026-09-19. Aucune n'est inventée : pour en ajouter une, la géocoder
// plutôt que l'estimer.

export interface Place {
  /** Nom affiché sur la carte et dans les textes. */
  name: string;
  lat: number;
  lng: number;
}

export const REIMS: Place = { name: "Reims", lat: 49.25779, lng: 4.03193 };

export const ROISSY: Place = {
  name: "Paris-Roissy",
  lat: 49.00689,
  lng: 2.57108,
};

export const EDINBURGH_AIRPORT: Place = {
  name: "Aéroport d'Édimbourg",
  lat: 55.95026,
  lng: -3.35939,
};

/** Centre de la vieille ville, utilisé comme point d'ancrage de la caméra. */
export const EDINBURGH: Place = {
  name: "Édimbourg",
  lat: 55.94947,
  lng: -3.19648,
};
