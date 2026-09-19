import { useLayoutEffect, useRef } from "react";
import type L from "leaflet";
import { REVEAL } from "../../data/trip";
import { EDINBURGH } from "../../data/places";
import { ECOSSE, VOILE_ARRIVEE } from "../../map/framings";
import {
  camera,
  createPlaceMarker,
  setMapVeil,
  setMapOpacity,
  setMarkerOpacity,
} from "../../map/journeyMap";
import { useScrollScene } from "../../hooks/useScrollScene";
import { lerp, range, showBeat } from "../../utils/beats";

/**
 * La révélation, à l'arrivée.
 *
 * L'Écosse est déjà à l'écran, le voyage entier tracé derrière : il ne
 * reste qu'à nommer la ville. La caméra ne bouge presque pas — un lent
 * rapprochement, rien de plus — pour que toute l'attention aille au texte.
 */
export function DestinationReveal() {
  const section = useRef<HTMLElement>(null);
  const voile = useRef<HTMLDivElement>(null);
  const ville = useRef<HTMLHeadingElement>(null);
  const pays = useRef<HTMLParagraphElement>(null);
  const dates = useRef<HTMLParagraphElement>(null);
  const trois = useRef<HTMLParagraphElement>(null);
  const ensemble = useRef<HTMLParagraphElement>(null);
  const signature = useRef<HTMLParagraphElement>(null);

  const repere = useRef<L.Marker | null>(null);

  useLayoutEffect(() => {
    repere.current = createPlaceMarker(EDINBURGH);
    return () => {
      repere.current?.remove();
    };
  }, []);

  useScrollScene(section, (p) => {
    setMapOpacity(1);
    // Le jour se lève sur le pays au moment où son nom apparaît.
    setMapVeil(lerp(VOILE_ARRIVEE, 0, range(p, 0.08, 0.45)));

    const approche = lerp(ECOSSE.km, ECOSSE.km * 0.82, p);
    camera(ECOSSE.lat, ECOSSE.lng, approche);

    // Le voile assombrit le pays le temps de la révélation, puis se retire
    // avant la suite : sans cela il restait tendu sur toute l'exploration de
    // la ville, une scène gardant son dernier état une fois traversée.
    if (voile.current) {
      voile.current.style.opacity = String(
        0.82 * range(p, 0, 0.12) * (1 - range(p, 0.9, 1))
      );
    }

    // Le point de la ville s'allume juste avant que son nom n'apparaisse,
    // et s'efface quand la caméra part se poser dans les rues : la scène
    // suivante y pose ses propres repères.
    setMarkerOpacity(
      repere.current,
      range(p, 0.05, 0.14) * (1 - range(p, 0.88, 1))
    );

    showBeat(ville.current, p, 0.14, 1, { fade: 0.04, rise: 0, scale: 0.84 });
    showBeat(pays.current, p, 0.26, 1, { rise: 10 });
    showBeat(dates.current, p, 0.38, 1, { rise: 10 });
    showBeat(trois.current, p, 0.58, 1, { rise: 10 });
    showBeat(ensemble.current, p, 0.68, 1, { rise: 10 });
    showBeat(signature.current, p, 0.82, 1, { rise: 10 });
  });

  return (
    <section className="act" ref={section} style={{ height: "550svh" }}>
      <div className="act__stage">
        <div className="scrim" ref={voile} />

        <div className="stack">
          <h1 className="beat beat--flow display display--gold" ref={ville}>
            {REVEAL.destination}
          </h1>
          <p className="beat beat--flow line line--small" ref={pays}>
            {REVEAL.country}
          </p>
          <p className="beat beat--flow eyebrow" ref={dates}>
            {REVEAL.dates}
          </p>

          <p className="beat beat--flow line reveal__gap" ref={trois}>
            {REVEAL.lines[0]}
          </p>
          <p className="beat beat--flow line" ref={ensemble}>
            {REVEAL.lines[1]}
          </p>
          <p className="beat beat--flow line line--small" ref={signature}>
            {REVEAL.signature}
          </p>
        </div>
      </div>
    </section>
  );
}
