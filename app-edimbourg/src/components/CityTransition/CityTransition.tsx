import { useRef } from "react";
import { FLIGHT } from "../../data/trip";
import { EDINBURGH } from "../../data/places";
import { ECOSSE } from "../../map/framings";
import { camera, setMapOpacity, setMapVeil } from "../../map/journeyMap";
import { useScrollScene } from "../../hooks/useScrollScene";
import { easeInOut, lerp, showBeat } from "../../utils/beats";

// Du pays à la rue, d'un seul mouvement : c'est le moment où la carte
// change de métier sans changer de nature.
const ETENDUE_VILLE = 4;

export function CityTransition() {
  const section = useRef<HTMLElement>(null);
  const maintenant = useRef<HTMLParagraphElement>(null);
  const decouvrons = useRef<HTMLParagraphElement>(null);

  useScrollScene(section, (p) => {
    setMapOpacity(1);
    setMapVeil(0);

    const t = easeInOut(p);
    camera(
      lerp(ECOSSE.lat, EDINBURGH.lat, t),
      lerp(ECOSSE.lng, EDINBURGH.lng, t),
      lerp(ECOSSE.km, ETENDUE_VILLE, t)
    );

    showBeat(maintenant.current, p, 0.12, 0.42);
    showBeat(decouvrons.current, p, 0.55, 0.92);
  });

  return (
    <section className="act" ref={section} style={{ height: "350svh" }}>
      <div className="act__stage">
        <p className="beat beat--bottom line" ref={maintenant}>
          {FLIGHT.toExploration[0]}
        </p>
        <p className="beat beat--bottom line" ref={decouvrons}>
          {FLIGHT.toExploration[1]}
        </p>
      </div>
    </section>
  );
}
