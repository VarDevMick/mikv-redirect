// La carte du voyage. Il n'y en a qu'une, du départ de Reims au dernier
// café d'Édimbourg : seule sa caméra change d'échelle. Ce module la crée,
// l'expose au reste du site, et n'offre que des gestes simples — placer la
// caméra, tracer une route, poser un repère.
//
// Leaflet est piloté ici en impératif, sans passer par l'état React : les
// mises à jour arrivent à chaque image du scroll, elles ne doivent jamais
// déclencher de rendu.

import L from "leaflet";
import type { LatLng } from "../utils/geo";
import type { Place } from "../data/places";

// Tuiles OpenStreetMap, comme le reste du site. Elles arrivent en couleurs
// vives : c'est un filtre CSS (voir .leaflet-tile-pane) qui les bascule en
// nuit d'hiver, plutôt qu'un fournisseur de fond sombre — lesquels réclament
// tous une clé désormais.
const TUILES = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

let map: L.Map | null = null;
let layer: HTMLElement | null = null;
let dernierZoom = Number.NaN;

export function initMap(canvas: HTMLElement, wrapper: HTMLElement): L.Map {
  if (map) return map;

  map = L.map(canvas, {
    center: [49.0, 3.0],
    zoom: 6,
    // Le récit conduit la caméra : tous les gestes sont coupés, et le
    // scroll vertical de la page reste prioritaire sur mobile.
    dragging: false,
    touchZoom: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    keyboard: false,
    zoomControl: false,
    // Zoom fractionnaire : indispensable pour un dézoom continu au scroll.
    zoomSnap: 0,
    zoomAnimation: false,
    fadeAnimation: false,
    attributionControl: true,
  });

  L.tileLayer(TUILES, {
    attribution: ATTRIBUTION,
    maxZoom: 19,
  }).addTo(map);

  layer = wrapper;
  return map;
}

export function getMap(): L.Map | null {
  return map;
}

/** Place la caméra. Appelée à chaque image : aucune animation Leaflet. */
export function camera(lat: number, lng: number, zoom: number): void {
  if (!map) return;
  // Le zoom est arrondi au vingtième : assez fin pour que le mouvement
  // reste continu, assez grossier pour épargner des recalculs de tuiles.
  const arrondi = Math.round(zoom * 20) / 20;
  const centre = map.getCenter();
  if (
    arrondi === dernierZoom &&
    Math.abs(centre.lat - lat) < 1e-6 &&
    Math.abs(centre.lng - lng) < 1e-6
  ) {
    return;
  }
  dernierZoom = arrondi;
  map.setView([lat, lng], arrondi, { animate: false });
}

/**
 * Zoom qui fait tenir à l'écran une étendue donnée, en kilomètres.
 *
 * C'est la clé du cadrage : on ne fixe jamais un niveau de zoom en dur,
 * puisqu'il ne montrerait pas la même chose sur un téléphone et sur un
 * écran large. On dit « je veux voir 40 km », et Leaflet en déduit le zoom
 * à partir de la taille réelle du conteneur.
 */
export function zoomForSpan(lat: number, lng: number, km: number): number {
  if (!map) return 10;
  const degresLat = km / 111;
  const degresLng = km / (111 * Math.cos((lat * Math.PI) / 180) || 1);
  const bounds = L.latLngBounds(
    [lat - degresLat / 2, lng - degresLng / 2],
    [lat + degresLat / 2, lng + degresLng / 2]
  );
  return map.getBoundsZoom(bounds, false);
}

// Opacité et flou sont réécrits à chaque image du scroll : on ne touche au
// style que lorsque la valeur a réellement bougé.
let derniereOpacite = Number.NaN;
let dernierFlou = Number.NaN;

/** Opacité du calque entier : la carte entre et sort du récit. */
export function setMapOpacity(valeur: number): void {
  const arrondi = Math.round(valeur * 100) / 100;
  if (!layer || arrondi === derniereOpacite) return;
  derniereOpacite = arrondi;
  layer.style.opacity = String(arrondi);
}

/**
 * Flou du fond de carte, en pixels.
 *
 * Il sert le récit avant de servir l'image : les tuiles OpenStreetMap
 * écrivent « Edinburgh » en clair, et la ville ne doit pas être lisible
 * avant d'être nommée. Pendant le vol on vole donc dans les nuages, et la
 * carte se pose en même temps que l'avion.
 */
export function setMapBlur(pixels: number): void {
  const arrondi = Math.round(pixels * 10) / 10;
  if (!layer || arrondi === dernierFlou) return;
  dernierFlou = arrondi;
  layer.style.setProperty("--flou-carte", `${arrondi}px`);
}

/**
 * Trait du voyage, qui se dessine au fur et à mesure. En pointillé pour le
 * vol : une route aérienne n'est pas une route.
 */
export function createRouteLine(pointille = false): L.Polyline | null {
  if (!map) return null;
  return L.polyline([], {
    color: "#d4a94a",
    weight: 2.5,
    opacity: 0.9,
    lineCap: "round",
    lineJoin: "round",
    dashArray: pointille ? "5 7" : undefined,
    // Le tracé ne doit pas intercepter le geste de défilement.
    interactive: false,
  }).addTo(map);
}

export function setRoute(ligne: L.Polyline | null, points: LatLng[]): void {
  ligne?.setLatLngs(points);
}

/**
 * Repère discret : un point, et le nom du lieu au-dessus.
 *
 * Le nom est posé au-dessus plutôt qu'à côté : les tuiles portent déjà leurs
 * propres étiquettes de ville, et les deux se chevauchaient.
 */
export function createPlaceMarker(place: Place) {
  if (!map) return null;
  const icone = L.divIcon({
    className: "",
    html: `<div class="place-marker">
      <span class="place-label">${place.name}</span>
      <span class="place-dot"></span>
    </div>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
  return L.marker([place.lat, place.lng], {
    icon: icone,
    interactive: false,
    keyboard: false,
    opacity: 0,
  }).addTo(map);
}

export function setMarkerOpacity(marqueur: L.Marker | null, valeur: number): void {
  marqueur?.setOpacity(valeur);
}

/** Recalcule la taille du canevas après un changement de viewport. */
export function refreshMapSize(): void {
  map?.invalidateSize({ animate: false });
}
