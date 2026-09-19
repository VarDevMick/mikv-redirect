import { useLayoutEffect, useRef } from "react";
import type L from "leaflet";
import { FLIGHT } from "../../data/trip";
import { EDINBURGH_AIRPORT, ROISSY } from "../../data/places";
import { ECOSSE, VOILE_ARRIVEE, VOILE_VOL } from "../../map/framings";
import {
  camera,
  createRouteLine,
  setMapVeil,
  setMapOpacity,
  setRoute,
  zoomForSpan,
} from "../../map/journeyMap";
import { useScrollScene } from "../../hooks/useScrollScene";
import {
  bearingAt,
  cumulativeLengths,
  greatCircle,
  lerpLatLng,
  pointAt,
  traveled,
  unwrapAngle,
} from "../../utils/geo";
import { clamp01, easeInOut, lerp, range, showBeat } from "../../utils/beats";
import { PlaneIcon } from "./icons";

// La vraie route d'un avion : un arc de grand cercle, qui s'incurve vers le
// nord au lieu de couper tout droit.
const ARC = greatCircle(
  [ROISSY.lat, ROISSY.lng],
  [EDINBURGH_AIRPORT.lat, EDINBURGH_AIRPORT.lng]
);
const CUMUL = cumulativeLengths(ARC);

const DECOLLAGE = 0.12;
const ATTERRISSAGE = 0.86;

// Le vol respire : on quitte le sol, la carte s'ouvre jusqu'à tenir la
// France et la Manche, puis se referme sur le pays d'arrivée.
const ETENDUE_SOL = 10;
const ETENDUE_MONTEE = 70;
const ETENDUE_CROISIERE = 1250;
const ETENDUE_DESCENTE = 460;

/**
 * Paris-Roissy → Édimbourg, en avion.
 *
 * Rien ici ne nomme la destination : la scène s'achève sur l'Écosse
 * entière, le voyage tracé derrière, et c'est la scène suivante qui donne
 * enfin son nom à la ville.
 */
export function Flight() {
  const section = useRef<HTMLElement>(null);
  const decolle = useRef<HTMLParagraphElement>(null);
  const etiquette = useRef<HTMLParagraphElement>(null);
  const patience = useRef<HTMLParagraphElement>(null);
  const descend = useRef<HTMLParagraphElement>(null);
  const avion = useRef<HTMLDivElement>(null);

  const cap = useRef(Number.NaN);

  const ligne = useRef<L.Polyline | null>(null);

  useLayoutEffect(() => {
    ligne.current = createRouteLine(true);
    return () => {
      ligne.current?.remove();
    };
  }, []);

  useScrollScene(
    section,
    (p) => {
      setMapOpacity(1);
      // On prend de l'altitude et le pays passe dans la pénombre : ses noms
      // de villes deviennent illisibles, et Édimbourg reste une surprise. En
      // approche, la pénombre se lève à demi : l'Écosse se découvre, sans se
      // nommer encore.
      setMapVeil(
        p < ATTERRISSAGE
          ? lerp(0, VOILE_VOL, range(p, DECOLLAGE, 0.3))
          : lerp(VOILE_VOL, VOILE_ARRIVEE, range(p, ATTERRISSAGE, 1))
      );

      if (p < DECOLLAGE) {
        // Encore au sol : la piste s'éloigne doucement.
        const t = easeInOut(range(p, 0, DECOLLAGE));
        camera(
          ROISSY.lat,
          ROISSY.lng,
          lerp(
            zoomForSpan(ROISSY.lat, ROISSY.lng, ETENDUE_SOL),
            zoomForSpan(ROISSY.lat, ROISSY.lng, ETENDUE_MONTEE),
            t
          )
        );
        setRoute(ligne.current, []);
      } else {
        const vol = range(p, DECOLLAGE, ATTERRISSAGE);
        const [lat, lng] = pointAt(ARC, CUMUL, vol);

        // Étendue visible : elle s'ouvre jusqu'à la moitié du vol, puis se
        // referme — le dézoom et le zoom du brief, en une seule courbe.
        const etendue =
          vol < 0.5
            ? lerp(ETENDUE_MONTEE, ETENDUE_CROISIERE, easeInOut(vol / 0.5))
            : lerp(
                ETENDUE_CROISIERE,
                ETENDUE_DESCENTE,
                easeInOut((vol - 0.5) / 0.5)
              );

        // En toute fin de scène, la caméra quitte l'avion pour se poser sur
        // le cadrage que la révélation reprendra à l'identique.
        const pose = easeInOut(range(p, ATTERRISSAGE, 1));
        const [centreLat, centreLng] = lerpLatLng(
          [lat, lng],
          [ECOSSE.lat, ECOSSE.lng],
          pose
        );
        camera(
          centreLat,
          centreLng,
          lerp(
            zoomForSpan(centreLat, centreLng, etendue),
            zoomForSpan(centreLat, centreLng, ECOSSE.km),
            pose
          )
        );

        setRoute(ligne.current, traveled(ARC, CUMUL, vol));

        if (avion.current) {
          cap.current = unwrapAngle(cap.current, bearingAt(ARC, CUMUL, vol));
          avion.current.style.transform = `translate(-50%, -50%) rotate(${cap.current.toFixed(2)}deg)`;
        }
      }

      // L'avion disparaît une fois posé.
      if (avion.current) {
        const entree = range(p, 0, 0.05);
        const sortie = 1 - range(p, ATTERRISSAGE, ATTERRISSAGE + 0.06);
        avion.current.style.opacity = String(clamp01(Math.min(entree, sortie)));
      }

      showBeat(decolle.current, p, 0.05, 0.14);
      showBeat(etiquette.current, p, 0.22, 0.45, { rise: 8 });
      showBeat(patience.current, p, 0.55, 0.64);
      showBeat(descend.current, p, 0.76, 0.84);
    },
    {
      // En remontant avant le vol, le ciel se dégage : la voiture roule sur
      // une carte nette.
      onLeaveBack: () => {
        setRoute(ligne.current, []);
        setMapVeil(0);
      },
    }
  );

  return (
    <section className="act" ref={section} style={{ height: "700svh" }}>
      <div className="act__stage">
        <p className="beat beat--bottom line" ref={decolle}>
          {FLIGHT.beats[0]}
        </p>
        <p className="beat beat--bottom line line--small" ref={etiquette}>
          {FLIGHT.label}
        </p>
        <p className="beat beat--bottom line" ref={patience}>
          {FLIGHT.beats[1]}
        </p>
        <p className="beat beat--bottom line" ref={descend}>
          {FLIGHT.beats[2]}
        </p>
      </div>

      <div className="vehicle" ref={avion}>
        <PlaneIcon />
      </div>
    </section>
  );
}
