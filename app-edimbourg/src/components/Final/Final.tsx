import { useRef } from "react";
import { FINAL } from "../../data/trip";
import { EDINBURGH } from "../../data/places";
import { camera, setMapOpacity, setMapVeil } from "../../map/journeyMap";
import { useScrollScene } from "../../hooks/useScrollScene";
import { easeInOut, lerp, range, showBeat } from "../../utils/beats";

// La ville vue une dernière fois, les trois journées tracées dessus.
const ETENDUE_VILLE = 6;

/**
 * La clôture.
 *
 * Le bilan se pose sur la ville, la carte s'efface, et le site s'arrête sur
 * le mot de Chloé. Rien après : c'est la dernière chose que Carol lira.
 */
export function Final() {
  const section = useRef<HTMLElement>(null);
  const voile = useRef<HTMLDivElement>(null);
  const bilan = useRef<HTMLDivElement>(null);
  const surtout = useRef<HTMLParagraphElement>(null);
  const souvenirs = useRef<HTMLParagraphElement>(null);
  const pourToi = useRef<HTMLParagraphElement>(null);
  const signature = useRef<HTMLParagraphElement>(null);
  const voeu = useRef<HTMLHeadingElement>(null);

  useScrollScene(section, (p) => {
    setMapVeil(0);

    // La carte s'attarde sur la ville, puis se retire pour de bon : le
    // dernier mot se dit sur fond noir.
    setMapOpacity(1 - range(p, 0.32, 0.46));

    if (p < 0.46) {
      camera(
        EDINBURGH.lat,
        EDINBURGH.lng,
        lerp(4, ETENDUE_VILLE, easeInOut(p / 0.46))
      );
    }

    // Le bilan doit se lire par-dessus la ville : le voile monte avant lui.
    if (voile.current) {
      voile.current.style.opacity = String(range(p, 0.01, 0.1) * 0.9);
    }

    showBeat(bilan.current, p, 0.06, 0.3);
    showBeat(surtout.current, p, 0.38, 0.48);
    showBeat(souvenirs.current, p, 0.54, 0.64);
    showBeat(pourToi.current, p, 0.7, 0.8);

    showBeat(signature.current, p, 0.86, 1, { fade: 0.03 });
    showBeat(voeu.current, p, 0.9, 1, { fade: 0.03, rise: 0, scale: 0.9 });
  });

  return (
    <section className="act" ref={section} style={{ height: "650svh" }}>
      <div className="act__stage">
        <div className="scrim" ref={voile} />

        <div className="beat bilan" ref={bilan}>
          {FINAL.summary.map((ligne) => (
            <p className="bilan__ligne" key={ligne.label}>
              <span className="bilan__valeur">{ligne.value}</span>
              <span className="eyebrow">{ligne.label}</span>
            </p>
          ))}
        </div>

        <p className="beat line" ref={surtout}>
          {FINAL.pivot}
        </p>
        <p className="beat line" ref={souvenirs}>
          {FINAL.lines[0]}
        </p>
        <p className="beat line" ref={pourToi}>
          {FINAL.lines[1]}
        </p>

        <div className="stack">
          <p className="beat beat--flow line line--small" ref={signature}>
            {FINAL.signature}
          </p>
          <h2
            className="beat beat--flow display display--gold display--voeu"
            ref={voeu}
          >
            {FINAL.voeu}
          </h2>
        </div>
      </div>
    </section>
  );
}
