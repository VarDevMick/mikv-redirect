import { useEffect, useRef } from "react";

/**
 * « Joyeux anniversaire », synthétisé par l'API Web Audio — la même musique
 * que la page /30 (voir `specs/music.md`, F-18).
 *
 * La mélodie est du domaine public et générée à la volée : aucun fichier à
 * héberger, aucun droit à acquitter.
 *
 * Le son est interdit sans geste utilisateur, et un défilement n'en est pas
 * un. On tente donc à chaque geste (le défilement compris, par acquit de
 * conscience) : un tampon muet ouvre la sortie sur iOS, `resume()` réveille
 * le contexte dans le geste même, et si ça échoue le geste suivant retente.
 * Tant que rien ne sonne, le bouton pulse et une mention le dit.
 */

const SOL = 392.0, LA = 440.0, SI = 493.88, DO = 523.25,
  RE = 587.33, MI = 659.25, FA = 698.46, SOL5 = 783.99;

const MELODIE: [number, number][] = [
  [SOL, 0.75], [SOL, 0.25], [LA, 1], [SOL, 1], [DO, 1], [SI, 1.75],
  [SOL, 0.75], [SOL, 0.25], [LA, 1], [SOL, 1], [RE, 1], [DO, 1.75],
  [SOL, 0.75], [SOL, 0.25], [SOL5, 1], [MI, 1], [DO, 1], [SI, 1], [LA, 1.75],
  [FA, 0.75], [FA, 0.25], [MI, 1], [DO, 1], [RE, 1], [DO, 2],
];

/** Durée d'une noire, en secondes. */
const NOIRE = 0.46;
/** Deux passes de 11 s : on finit sur une phrase complète. */
const PASSES = 2;
/** Respiration entre deux passes. */
const PAUSE = 0.7;

/** Deux oscillateurs à l'octave : plus chaud qu'une onde seule. */
const VOIX: [number, number, OscillatorType][] = [
  [1, 0.22, "triangle"],
  [2, 0.06, "sine"],
];

type AudioContextCtor = typeof AudioContext;

export function Music() {
  const bouton = useRef<HTMLButtonElement>(null);
  const astuce = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: AudioContext | null = null;
    let fin = 0;
    let enCours = false;
    let lance = false;
    let oscs: OscillatorNode[] = [];
    let indice = 0;

    bouton.current?.classList.add("son--attente");

    // Un seul contexte pour toute la page : sur iOS, en recréer un hors
    // d'un geste utilisateur est refusé.
    const contexte = () => {
      if (!ctx) {
        const AC: AudioContextCtor | undefined =
          window.AudioContext ??
          (window as unknown as { webkitAudioContext?: AudioContextCtor })
            .webkitAudioContext;
        if (!AC) return null;
        ctx = new AC();
      }
      return ctx;
    };

    // iOS n'ouvre vraiment la sortie que si un son, même muet, part pendant
    // le geste lui-même.
    const debloquer = (c: AudioContext) => {
      try {
        const source = c.createBufferSource();
        source.buffer = c.createBuffer(1, 1, 22050);
        source.connect(c.destination);
        source.start(0);
      } catch {
        /* rien à faire : le geste suivant retentera */
      }
    };

    const arreter = () => {
      window.clearTimeout(fin);
      oscs.forEach((o) => {
        try {
          o.stop();
        } catch {
          /* déjà arrêté */
        }
      });
      oscs = [];
      enCours = false;
    };

    const jouer = () => {
      arreter();
      const c = contexte();
      if (!c) return;
      enCours = true;
      let t = c.currentTime + 0.2;
      for (let p = 0; p < PASSES; p++) {
        for (const [note, temps] of MELODIE) {
          const duree = temps * NOIRE;
          for (const [octave, volume, forme] of VOIX) {
            const osc = c.createOscillator();
            const gain = c.createGain();
            osc.type = forme;
            osc.frequency.value = note * octave;
            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.exponentialRampToValueAtTime(volume, t + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + duree * 0.92);
            osc.connect(gain);
            gain.connect(c.destination);
            osc.start(t);
            osc.stop(t + duree);
            oscs.push(osc);
          }
          t += duree;
        }
        t += PAUSE;
      }
      bouton.current?.classList.remove("son--coupe", "son--attente");
      astuce.current?.classList.remove("son-astuce--visible");
      // À la fin, le bouton redevient un « rejouer », sans fermer le contexte.
      fin = window.setTimeout(() => {
        enCours = false;
        oscs = [];
      }, (t - c.currentTime + 0.3) * 1000);
    };

    const demarrer = (e: Event) => {
      // L'appui sur le bouton a son propre traitement.
      if ((e.target as Element | null)?.closest?.(".son")) return;
      if (lance) return;
      const c = contexte();
      if (!c) return;
      debloquer(c);
      // Le contexte naît suspendu : il faut le réveiller dans le geste même.
      if (c.state !== "running") {
        c.resume()
          .then(() => {
            if (c.state === "running" && !lance) {
              lance = true;
              jouer();
            }
          })
          .catch(() => {});
      } else {
        lance = true;
        jouer();
      }
    };

    const surBouton = () => {
      lance = true;
      if (enCours) {
        arreter();
        bouton.current?.classList.add("son--coupe");
        return;
      }
      const c = contexte();
      if (!c) return;
      if (c.state !== "running") c.resume().then(jouer).catch(() => {});
      else jouer();
    };

    // Si le défilement a commencé sans que le son ait pu partir, on le dit.
    const signaler = () => {
      indice = window.setTimeout(() => {
        if (!enCours && !lance) {
          astuce.current?.classList.add("son-astuce--visible");
        }
      }, 1200);
    };

    const gestes = ["touchend", "click", "keydown", "pointerup", "pointerdown", "scroll"];
    gestes.forEach((g) => window.addEventListener(g, demarrer, { passive: true }));
    window.addEventListener("scroll", signaler, { passive: true, once: true });
    const b = bouton.current;
    b?.addEventListener("click", surBouton);

    return () => {
      gestes.forEach((g) => window.removeEventListener(g, demarrer));
      window.removeEventListener("scroll", signaler);
      b?.removeEventListener("click", surBouton);
      window.clearTimeout(indice);
      arreter();
      ctx?.close().catch(() => {});
    };
  }, []);

  return (
    <>
      <button
        ref={bouton}
        type="button"
        className="son"
        aria-label="Couper ou relancer la musique"
      >
        &#9835;
      </button>
      <div ref={astuce} className="son-astuce" aria-hidden="true">
        Appuie pour la musique
      </div>
    </>
  );
}
