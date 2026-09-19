import { useRef } from "react";
import { FINAL } from "../../data/trip";
import { EDINBURGH } from "../../data/places";
import { camera, setMapOpacity, setMapVeil } from "../../map/journeyMap";
import { useScrollScene } from "../../hooks/useScrollScene";
import { easeInOut, lerp, range, showBeat } from "../../utils/beats";

// Le voyage entier tient dans ce cadrage : Reims en bas à droite, Édimbourg
// en haut à gauche, et les deux traits qui les relient.
const RECAP = { lat: 52.6, lng: 0.2, km: 1200 };

// La ville vue une dernière fois, tous les repères posés.
const ETENDUE_VILLE = 6;

export function Final() {
  const section = useRef<HTMLElement>(null);
  const voile = useRef<HTMLDivElement>(null);
  const bilan = useRef<HTMLDivElement>(null);
  const surtout = useRef<HTMLParagraphElement>(null);
  const souvenirs = useRef<HTMLParagraphElement>(null);
  const joyeux = useRef<HTMLHeadingElement>(null);
  const pourToi = useRef<HTMLParagraphElement>(null);
  const signature = useRef<HTMLParagraphElement>(null);
  const dernier = useRef<HTMLParagraphElement>(null);
  const trajet = useRef<HTMLParagraphElement>(null);

  useScrollScene(section, (p) => {
    setMapVeil(0);

    // La carte s'attarde sur la ville, s'efface pour le dernier mot, puis
    // revient montrer le voyage entier.
    const retrait = range(p, 0.3, 0.42);
    const retour = range(p, 0.86, 0.93);
    setMapOpacity(Math.max(1 - retrait, retour));

    if (p < 0.42) {
      camera(EDINBURGH.lat, EDINBURGH.lng, lerp(4, ETENDUE_VILLE, easeInOut(p / 0.42)));
    } else if (p > 0.82) {
      // Dernier dézoom : on retrouve tout le chemin parcouru.
      camera(RECAP.lat, RECAP.lng, lerp(RECAP.km * 0.8, RECAP.km, easeInOut(range(p, 0.86, 1))));
    }

    // Le voile accompagne le retrait de la carte et ne revient pas : la fin
    // se joue sur fond noir.
    if (voile.current) {
      // Le bilan doit se lire par-dessus la ville : le voile monte avant lui.
      voile.current.style.opacity = String(range(p, 0.01, 0.1) * 0.9);
    }

    showBeat(bilan.current, p, 0.06, 0.28);
    showBeat(surtout.current, p, 0.36, 0.46);
    showBeat(souvenirs.current, p, 0.5, 0.6);
    showBeat(joyeux.current, p, 0.63, 0.76, { scale: 0.9, rise: 0 });
    showBeat(pourToi.current, p, 0.7, 0.76, { rise: 10 });
    showBeat(signature.current, p, 0.78, 0.84);
    showBeat(dernier.current, p, 0.87, 1, { fade: 0.03 });
    showBeat(trajet.current, p, 0.93, 1, { fade: 0.03, rise: 8 });
  });

  return (
    <section className="act" ref={section} style={{ height: "700svh" }}>
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

        <div className="stack">
          <h2 className="beat beat--flow display display--gold display--voeu" ref={joyeux}>
            {FINAL.lines[1]}
          </h2>
          <p className="beat beat--flow line line--small" ref={pourToi}>
            {FINAL.lines[2]}
          </p>
        </div>

        <p className="beat line line--small signature" ref={signature}>
          {FINAL.signature[0]}
          <br />
          {FINAL.signature[1]}
        </p>

        <p className="beat line line--name" ref={dernier}>
          {FINAL.last}
        </p>

        <p className="beat beat--bottom eyebrow" ref={trajet}>
          {FINAL.recap}
        </p>
      </div>
    </section>
  );
}
