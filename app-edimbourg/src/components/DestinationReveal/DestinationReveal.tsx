import { useRef } from "react";
import { REVEAL } from "../../data/trip";
import { useScrollScene } from "../../hooks/useScrollScene";
import { showBeat } from "../../utils/beats";

/**
 * La révélation. Deux phrases qui font monter l'attente, puis le nom de la
 * ville qui prend tout l'écran. C'est le premier moment où l'on doit avoir
 * envie de crier — le reste du site peut ensuite prendre son temps.
 */
export function DestinationReveal() {
  const section = useRef<HTMLElement>(null);
  const valise = useRef<HTMLParagraphElement>(null);
  const onPart = useRef<HTMLParagraphElement>(null);
  const ville = useRef<HTMLHeadingElement>(null);
  const pays = useRef<HTMLParagraphElement>(null);
  const dates = useRef<HTMLParagraphElement>(null);

  useScrollScene(section, (p) => {
    showBeat(valise.current, p, 0.04, 0.2);
    showBeat(onPart.current, p, 0.3, 0.44);
    // Le nom arrive en grossissant très légèrement, puis ne repart plus :
    // il reste à l'écran pendant que le pays et les dates se posent sous
    // lui, et ne s'efface qu'en quittant la scène.
    showBeat(ville.current, p, 0.56, 1, { fade: 0.05, rise: 0, scale: 0.86 });
    showBeat(pays.current, p, 0.7, 1, { rise: 10 });
    showBeat(dates.current, p, 0.82, 1, { rise: 10 });
  });

  return (
    <section className="act" ref={section} style={{ height: "500svh" }}>
      <div className="act__stage">
        <p className="beat line" ref={valise}>
          {REVEAL.buildup[0]}
        </p>
        <p className="beat line" ref={onPart}>
          {REVEAL.buildup[1]}
        </p>

        {/* Ville, pays et dates se posent l'un sous l'autre : ils partagent
            un même bloc centré, et n'apparaissent qu'à leur tour. */}
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
        </div>
      </div>
    </section>
  );
}
