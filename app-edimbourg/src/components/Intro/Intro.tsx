import { useRef } from "react";
import { INTRO, SCROLL_HINT } from "../../data/trip";
import { useScrollScene } from "../../hooks/useScrollScene";
import { showBeat } from "../../utils/beats";

// Chaque phrase occupe sa fenêtre d'avancement, avec un silence entre deux.
// L'ouverture doit intriguer, pas impressionner : rien ne bouge, sinon le
// texte qui monte à peine.
const FENETRES: [number, number][] = [
  [0.02, 0.16],
  [0.25, 0.39],
  [0.48, 0.63],
  [0.72, 0.9],
];

export function Intro() {
  const section = useRef<HTMLElement>(null);
  const phrases = useRef<(HTMLParagraphElement | null)[]>([]);
  const indice = useRef<HTMLDivElement>(null);

  useScrollScene(section, (p) => {
    FENETRES.forEach(([debut, fin], i) => {
      showBeat(phrases.current[i], p, debut, fin);
    });
    // L'indice de défilement accompagne toute l'ouverture, puis s'efface
    // une fois que le geste est acquis.
    showBeat(indice.current, p, 0.08, 0.55, { fade: 0.1, rise: 0 });
  });

  return (
    <section
      className="act"
      ref={section}
      style={{ height: `${(INTRO.length + 1) * 100}svh` }}
    >
      <div className="act__stage">
        {INTRO.map((texte, i) => (
          <p
            key={texte}
            className={`beat line${i === 0 ? " line--name" : ""}`}
            ref={(element) => {
              phrases.current[i] = element;
            }}
          >
            {texte}
          </p>
        ))}

        <div className="scroll-hint" ref={indice}>
          <span className="scroll-hint__arrow" />
          {SCROLL_HINT}
        </div>
      </div>
    </section>
  );
}
