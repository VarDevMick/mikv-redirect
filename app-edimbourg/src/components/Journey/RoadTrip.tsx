import { useLayoutEffect, useRef } from "react";
import type L from "leaflet";
import { ROAD } from "../../data/trip";
import { ROISSY, REIMS } from "../../data/places";
import { ROUTE_REIMS_ROISSY } from "../../data/routes.generated";
import {
  camera,
  createPlaceMarker,
  createRouteLine,
  setMapBlur,
  setMapOpacity,
  setMarkerOpacity,
  setRoute,
  zoomForSpan,
} from "../../map/journeyMap";
import { useScrollScene } from "../../hooks/useScrollScene";
import {
  bearingAt,
  cumulativeLengths,
  lerpLatLng,
  pointAt,
  traveled,
} from "../../utils/geo";
import { clamp01, easeInOut, lerp, range, showBeat } from "../../utils/beats";
import { CarIcon } from "./icons";

// Le tracé et ses longueurs cumulées ne dépendent de rien : calculés une
// fois au chargement du module.
const CUMUL = cumulativeLengths(ROUTE_REIMS_ROISSY);

// Découpage de la scène. Avant, la caméra descend sur Reims ; pendant, la
// voiture roule ; après, tout le monde se pose à Roissy.
const DEBUT_ROUTE = 0.2;
const FIN_ROUTE = 0.78;

// Cadrages successifs, exprimés en kilomètres visibles plutôt qu'en niveaux
// de zoom : le récit montre alors la même chose sur un petit téléphone et
// sur un écran large. La caméra prend de la hauteur au milieu du trajet,
// puis revient se poser à l'arrivée.
const VUE_LARGE: [number, number] = [49.13, 3.3];
const ETENDUE_LARGE = 260;
const ETENDUE_DEPART = 14;
const ETENDUE_ROUTE = 95;
const ETENDUE_ARRIVEE = 7;

/**
 * Reims → Paris-Roissy, en voiture.
 *
 * La voiture reste au centre de l'écran : c'est la carte qui défile sous
 * elle, ce qui donne à la fois un mouvement parfaitement fluide et le
 * sentiment que la caméra suit la voiture. Le trait doré se dessine
 * derrière, sur le vrai tracé routier.
 */
export function RoadTrip() {
  const section = useRef<HTMLElement>(null);
  const premiereEtape = useRef<HTMLParagraphElement>(null);
  const etiquette = useRef<HTMLParagraphElement>(null);
  const roissy = useRef<HTMLParagraphElement>(null);
  const bon = useRef<HTMLParagraphElement>(null);
  const decolle = useRef<HTMLParagraphElement>(null);
  const voiture = useRef<HTMLDivElement>(null);

  const ligne = useRef<L.Polyline | null>(null);
  const repereReims = useRef<L.Marker | null>(null);
  const repereRoissy = useRef<L.Marker | null>(null);

  useLayoutEffect(() => {
    ligne.current = createRouteLine();
    repereReims.current = createPlaceMarker(REIMS);
    repereRoissy.current = createPlaceMarker(ROISSY);
    return () => {
      ligne.current?.remove();
      repereReims.current?.remove();
      repereRoissy.current?.remove();
    };
  }, []);

  useScrollScene(
    section,
    (p) => {
      // La carte entre dans le récit, nette : rien à cacher tant qu'on
      // roule en France.
      setMapOpacity(range(p, 0, 0.06));
      setMapBlur(0);
      setMarkerOpacity(repereReims.current, range(p, 0.06, 0.14));
      setMarkerOpacity(repereRoissy.current, range(p, 0.66, 0.76));

      if (p < DEBUT_ROUTE) {
        // Descente sur Reims, depuis une vue qui tient Paris et Reims.
        const t = easeInOut(range(p, 0, DEBUT_ROUTE));
        const [lat, lng] = lerpLatLng(VUE_LARGE, [REIMS.lat, REIMS.lng], t);
        camera(
          lat,
          lng,
          lerp(
            zoomForSpan(lat, lng, ETENDUE_LARGE),
            zoomForSpan(lat, lng, ETENDUE_DEPART),
            t
          )
        );
        setRoute(ligne.current, []);
      } else if (p < FIN_ROUTE) {
        // Le trajet lui-même.
        const t = range(p, DEBUT_ROUTE, FIN_ROUTE);
        const [lat, lng] = pointAt(ROUTE_REIMS_ROISSY, CUMUL, t);
        const recul = Math.sin(Math.PI * t);
        camera(
          lat,
          lng,
          lerp(
            zoomForSpan(lat, lng, ETENDUE_DEPART),
            zoomForSpan(lat, lng, ETENDUE_ROUTE),
            recul
          )
        );
        setRoute(ligne.current, traveled(ROUTE_REIMS_ROISSY, CUMUL, t));

        if (voiture.current) {
          const cap = bearingAt(ROUTE_REIMS_ROISSY, CUMUL, t);
          voiture.current.style.transform = `translate(-50%, -50%) rotate(${cap.toFixed(1)}deg)`;
        }
      } else {
        // Arrivée : la caméra se pose sur l'aéroport, le tracé est entier.
        const t = easeInOut(range(p, FIN_ROUTE, 1));
        const [lat, lng] = lerpLatLng(
          pointAt(ROUTE_REIMS_ROISSY, CUMUL, 1),
          [ROISSY.lat, ROISSY.lng],
          t
        );
        camera(
          lat,
          lng,
          lerp(
            zoomForSpan(lat, lng, ETENDUE_DEPART),
            zoomForSpan(lat, lng, ETENDUE_ARRIVEE),
            t
          )
        );
        setRoute(ligne.current, ROUTE_REIMS_ROISSY);
      }

      // La voiture n'existe que le temps du trajet. Son opacité est réglée
      // à part : son `transform` porte déjà son cap.
      if (voiture.current) {
        const entree = range(p, DEBUT_ROUTE - 0.04, DEBUT_ROUTE);
        const sortie = 1 - range(p, FIN_ROUTE, FIN_ROUTE + 0.04);
        voiture.current.style.opacity = String(clamp01(Math.min(entree, sortie)));
      }

      showBeat(premiereEtape.current, p, 0.08, 0.18);
      showBeat(etiquette.current, p, 0.24, 0.72, { rise: 8 });
      // Les trois phrases de l'arrivée se succèdent sans jamais se croiser :
      // fondus courts, fenêtres disjointes.
      showBeat(roissy.current, p, 0.83, 0.88, { fade: 0.02 });
      showBeat(bon.current, p, 0.91, 0.935, { fade: 0.015 });
      showBeat(decolle.current, p, 0.96, 1, { fade: 0.02 });
    },
    // En remontant avant la scène, la carte quitte le récit : l'ouverture
    // et la révélation se jouent sur fond noir.
    { onLeaveBack: () => setMapOpacity(0) }
  );

  return (
    <section className="act" ref={section} style={{ height: "800svh" }}>
      <div className="act__stage">
        {/* Dès que la carte est là, la narration se range en bas de l'écran :
            le centre appartient au voyage — la voiture, le tracé, les
            repères — et plus jamais au texte. */}
        <p className="beat beat--bottom line" ref={premiereEtape}>
          {ROAD.intro}
        </p>

        <p className="beat beat--bottom line line--small" ref={etiquette}>
          {ROAD.label}
        </p>

        <p className="beat beat--bottom line line--name" ref={roissy}>
          {ROAD.arrival[0]}
        </p>
        <p className="beat beat--bottom line" ref={bon}>
          {ROAD.arrival[1]}
        </p>
        <p className="beat beat--bottom line" ref={decolle}>
          {ROAD.arrival[2]}
        </p>
      </div>

      <div className="vehicle" ref={voiture}>
        <CarIcon />
      </div>
    </section>
  );
}
