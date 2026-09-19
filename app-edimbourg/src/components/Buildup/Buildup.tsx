import { useRef } from "react";
import { BUILDUP } from "../../data/trip";
import { useScrollScene } from "../../hooks/useScrollScene";
import { showBeat } from "../../utils/beats";

/**
 * Deux phrases, et rien d'autre. On sait qu'on part, on ne sait pas où :
 * la destination n'apparaîtra qu'à l'atterrissage.
 */
export function Buildup() {
  const section = useRef<HTMLElement>(null);
  const phrases = useRef<(HTMLParagraphElement | null)[]>([]);

  useScrollScene(section, (p) => {
    showBeat(phrases.current[0], p, 0.08, 0.38);
    showBeat(phrases.current[1], p, 0.56, 0.88);
  });

  return (
    <section className="act" ref={section} style={{ height: "250svh" }}>
      <div className="act__stage">
        {BUILDUP.map((texte, i) => (
          <p
            key={texte}
            className="beat line"
            ref={(element) => {
              phrases.current[i] = element;
            }}
          >
            {texte}
          </p>
        ))}
      </div>
    </section>
  );
}
