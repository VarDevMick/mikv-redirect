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
import { FONDS } from "../data/backdrops.generated";
import couloirUrl from "../assets/fonds/couloir.webp";
import franceUrl from "../assets/fonds/france.webp";
import ecosseUrl from "../assets/fonds/ecosse.webp";
import europeUrl from "../assets/fonds/europe.webp";

// Le fond n'est pas une couche de tuiles mais trois images livrées avec le
// site, fabriquées à partir d'OpenStreetMap par scripts/fetch-backgrounds.py.
//
// La caméra ne s'arrête jamais de bouger : en tuiles, le récit réclamait près
// de 1 700 tuiles — une cinquantaine de méga-octets — demandées en flux tendu
// pendant le scroll, ce qui coûtait cher et faisait apparaître le décor en
// retard. Trois images d'un méga-octet et demi à elles toutes, chargées une
// fois, suffisent : plus rien n'arrive pendant le voyage.
//
// Elles arrivent en couleurs de plein jour ; c'est un filtre CSS (voir
// .leaflet-fond-pane) qui les bascule en nuit d'hiver.
const ATTRIBUTION =
  '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

// Du plus large au plus serré : l'ordre d'empilement. Une image qui s'efface
// découvre celle du dessous, qui reste pleinement opaque — les fondus ne
// creusent donc jamais de trou sombre.
const IMAGES = [
  { id: "europe", url: europeUrl },
  { id: "france", url: franceUrl },
  { id: "ecosse", url: ecosseUrl },
  { id: "couloir", url: couloirUrl },
] as const;

let map: L.Map | null = null;
let layer: HTMLElement | null = null;
let veil: HTMLElement | null = null;
let dernierZoom = Number.NaN;
const fonds: Record<string, L.ImageOverlay> = {};

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

  // Les fonds viennent d'OpenStreetMap : le crédit reste dû, même si ce sont
  // désormais des images et non plus une couche de tuiles.
  map.attributionControl.addAttribution(ATTRIBUTION);

  // Les fonds vivent dans leur propre calque, sous les tracés : le filtre de
  // nuit ne doit toucher qu'eux, et surtout pas le trait doré du voyage.
  const calqueFond = map.createPane("fond");
  calqueFond.classList.add("map-fond");

  for (const image of IMAGES) {
    fonds[image.id] = L.imageOverlay(image.url, FONDS[image.id].bounds, {
      pane: "fond",
      interactive: false,
      // Chargées d'emblée, toutes les trois : elles pèsent moins qu'une
      // poignée de tuiles, et aucune ne doit se faire attendre en route.
      opacity: 1,
    }).addTo(map);
  }

  // Le voile du vol vit dans la carte, entre les tuiles et les tracés : il
  // doit éteindre le fond sans jamais ternir le trait doré du voyage. Un
  // calque Leaflet est le seul endroit où l'on peut se glisser entre les
  // deux, la carte formant son propre contexte d'empilement.
  veil = map.createPane("voile");
  veil.classList.add("map-veil");

  layer = wrapper;
  return map;
}

export function getMap(): L.Map | null {
  return map;
}

/**
 * Place la caméra : un point, et l'étendue qu'on veut voir, en kilomètres.
 *
 * Le cadrage ne s'exprime jamais en niveau de zoom, qui ne montrerait pas la
 * même chose sur un téléphone et sur un écran large. On dit « je veux voir
 * 40 km » et le zoom s'en déduit de la taille réelle du conteneur. L'étendue
 * choisit aussi lequel des trois fonds est à l'écran.
 *
 * Appelée à chaque image : aucune animation Leaflet.
 */
export function camera(lat: number, lng: number, etendueKm: number): void {
  if (!map) return;

  setBackdropForSpan(etendueKm);

  // La caméra n'est écrite qu'une fois par image (voir useScrollScene) : le
  // zoom peut donc être fin sans noyer Leaflet de recalculs.
  const zoom = Math.round(zoomForSpan(lat, lng, etendueKm) * 100) / 100;
  const centre = map.getCenter();
  if (
    zoom === dernierZoom &&
    Math.abs(centre.lat - lat) < 1e-6 &&
    Math.abs(centre.lng - lng) < 1e-6
  ) {
    return;
  }
  dernierZoom = zoom;
  map.setView([lat, lng], zoom, { animate: false });
}

/**
 * Choisit le fond selon l'étendue visible.
 *
 * Chaque image a été fabriquée pour une échelle : au-delà, elle serait
 * étirée et floue ; en deçà, elle ne couvrirait pas l'écran. Les bascules se
 * font en fondu, sur une plage assez large pour qu'aucune ne se remarque.
 */
function setBackdropForSpan(km: number): void {
  const rampe = (debut: number, fin: number) =>
    Math.min(Math.max((km - debut) / (fin - debut), 0), 1);

  // Chaque seuil correspond à ce que la fenêtre de l'image couvre vraiment :
  // le couloir tient jusqu'à 120 km de large, la France et l'Écosse
  // jusqu'à 420 et 620. Les fenêtres françaises et écossaises ne se
  // recouvrant pas, l'ordre entre elles est sans conséquence.
  regler("couloir", 1 - rampe(120, 155));
  regler("ecosse", 1 - rampe(620, 800));
  regler("france", 1 - rampe(420, 560));
}

const opacites: Record<string, number> = {};

function regler(id: string, valeur: number): void {
  const arrondi = Math.round(valeur * 100) / 100;
  if (opacites[id] === arrondi) return;
  opacites[id] = arrondi;
  fonds[id]?.setOpacity(arrondi);
}

/** Zoom qui fait tenir à l'écran une étendue donnée, en kilomètres. */
function zoomForSpan(lat: number, lng: number, km: number): number {
  if (!map) return 10;
  const degresLat = km / 111;
  const degresLng = km / (111 * Math.cos((lat * Math.PI) / 180) || 1);
  const bounds = L.latLngBounds(
    [lat - degresLat / 2, lng - degresLng / 2],
    [lat + degresLat / 2, lng + degresLng / 2]
  );
  return map.getBoundsZoom(bounds, false);
}

// Opacité et voile sont réécrits à chaque image du scroll : on ne touche au
// style que lorsque la valeur a réellement bougé.
let derniereOpacite = Number.NaN;
let dernierVoile = Number.NaN;

/** Opacité du calque entier : la carte entre et sort du récit. */
export function setMapOpacity(valeur: number): void {
  const arrondi = Math.round(valeur * 100) / 100;
  if (!layer || arrondi === derniereOpacite) return;
  derniereOpacite = arrondi;
  layer.style.opacity = String(arrondi);
}

/**
 * Voile posé sur le fond de carte, de 0 à 1.
 *
 * Il sert le récit avant de servir l'image : les tuiles OpenStreetMap
 * écrivent « Edinburgh » en clair, et la ville ne doit pas être lisible
 * avant d'être nommée. Pendant le vol, le pays reste donc dans la pénombre,
 * et le jour se lève sur lui au moment de la révélation.
 */
export function setMapVeil(valeur: number): void {
  const arrondi = Math.round(valeur * 100) / 100;
  if (!veil || arrondi === dernierVoile) return;
  dernierVoile = arrondi;
  veil.style.opacity = String(arrondi);
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
