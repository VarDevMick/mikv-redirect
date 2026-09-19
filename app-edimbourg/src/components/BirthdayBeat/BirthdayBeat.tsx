import { useRef } from "react";
import { BIRTHDAY_BEAT } from "../../data/trip";
import { setMapVeil } from "../../map/journeyMap";
import { useScrollScene } from "../../hooks/useScrollScene";
import { lerp, range, showBeat } from "../../utils/beats";

/**
 * Le rappel, glissé entre le premier et le deuxième jour.
 *
 * La ville s'éteint un instant — on ne change pas de lieu, on change de
 * sujet — le temps de redire pourquoi ce voyage existe, puis le programme
 * reprend là où il s'était arrêté.
 */
export function BirthdayBeat() {
  const section = useRef<HTMLElement>(null);
  const amorce = useRef<HTMLParagraphElement>(null);
  const titre = useRef<HTMLHeadingElement>(null);
  const chute = useRef<HTMLParagraphElement>(null);

  useScrollScene(
    section,
    (p) => {
      // Un voile qui monte puis redescend : la carte reste là, en retrait.
      setMapVeil(
        p < 0.5 ? lerp(0, 0.92, range(p, 0, 0.18)) : lerp(0.92, 0, range(p, 0.86, 1))
      );

      showBeat(amorce.current, p, 0.14, 0.32);
      showBeat(titre.current, p, 0.4, 0.78, { scale: 0.88, rise: 0 });
      showBeat(chute.current, p, 0.56, 0.82, { rise: 10 });
    },
    { onLeaveBack: () => setMapVeil(0), onLeave: () => setMapVeil(0) }
  );

  return (
    <section className="act" ref={section} style={{ height: "380svh" }}>
      <div className="act__stage">
        <p className="beat line" ref={amorce}>
          {BIRTHDAY_BEAT.lead}
        </p>

        <div className="stack">
          <h2 className="beat beat--flow line line--name" ref={titre}>
            {BIRTHDAY_BEAT.title}
          </h2>
          <p className="beat beat--flow line line--small" ref={chute}>
            {BIRTHDAY_BEAT.line}
          </p>
        </div>
      </div>
    </section>
  );
}
