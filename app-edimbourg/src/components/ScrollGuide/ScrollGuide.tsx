import { useEffect, useRef } from "react";

/** Temps sans défilement avant que la flèche ne relance, en millisecondes. */
const PATIENCE = 2200;

/** Au-delà de cet avancement, le voyage est fini : plus rien à suggérer. */
const FIN = 0.985;

/**
 * Le fil du voyage, au bord droit de l'écran.
 *
 * Hors de l'intro, rien ne disait qu'il fallait continuer à défiler : une
 * scène qui s'arrête ressemblait à une page finie. Le fil montre où l'on en
 * est, et la flèche, quand on s'arrête, rappelle qu'il y a une suite — un
 * appui avance d'un écran.
 *
 * Comme les scènes, il écrit directement dans le DOM : l'avancement change
 * à chaque image et ne doit déclencher aucun rendu React.
 */
export function ScrollGuide() {
  const guide = useRef<HTMLDivElement>(null);
  const avance = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let image = 0;
    let attente = 0;

    const relancer = () => {
      const fini = guide.current?.classList.contains("fil--fini");
      // L'intro a déjà son propre « Fais défiler ».
      if (!fini && window.scrollY > window.innerHeight) {
        guide.current?.classList.add("fil--relance");
      }
    };

    const peindre = () => {
      image = 0;
      const course = document.documentElement.scrollHeight - window.innerHeight;
      const progression = course > 0 ? Math.min(window.scrollY / course, 1) : 0;
      avance.current?.style.setProperty("transform", `scaleY(${progression})`);
      guide.current?.classList.toggle("fil--fini", progression > FIN);
    };

    const surScroll = () => {
      guide.current?.classList.remove("fil--relance");
      window.clearTimeout(attente);
      attente = window.setTimeout(relancer, PATIENCE);
      if (!image) image = requestAnimationFrame(peindre);
    };

    peindre();
    attente = window.setTimeout(relancer, PATIENCE);
    window.addEventListener("scroll", surScroll, { passive: true });
    window.addEventListener("resize", surScroll);
    return () => {
      window.removeEventListener("scroll", surScroll);
      window.removeEventListener("resize", surScroll);
      window.clearTimeout(attente);
      cancelAnimationFrame(image);
    };
  }, []);

  const avancer = () => {
    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollBy({
      top: window.innerHeight * 0.9,
      behavior: doux ? "smooth" : "auto",
    });
  };

  return (
    <div className="fil" ref={guide}>
      <span className="fil__rail" aria-hidden="true">
        <span className="fil__avance" ref={avance} />
      </span>
      <button
        type="button"
        className="fil__suite"
        onClick={avancer}
        aria-label="Continuer le voyage"
      >
        <svg width="14" height="9" viewBox="0 0 14 9" aria-hidden="true">
          <path
            d="M1.5 1.5 L7 7 L12.5 1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
