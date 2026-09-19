import { useLayoutEffect } from "react";
import type { RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Options {
  /** Appelée quand on quitte la scène par le haut : remise à l'état amont. */
  onLeaveBack?: () => void;
  /** Appelée quand on quitte la scène par le bas : état laissé aux suivantes. */
  onLeave?: () => void;
}

/**
 * Transforme la traversée d'une section en avancement de 0 à 1.
 *
 * La scène commence quand le haut de la section touche le haut de l'écran et
 * finit quand son bas le rejoint : la durée dépend donc de la hauteur de la
 * section, exprimée en écrans (svh), jamais d'un nombre de pixels. Un petit
 * téléphone et un grand écran racontent la même chose.
 *
 * L'avancement est livré en fonction de rappel plutôt qu'en état React :
 * il change à chaque image du scroll et ne doit déclencher aucun rendu.
 */
export function useScrollScene(
  ref: RefObject<HTMLElement | null>,
  onProgress: (progress: number) => void,
  options: Options = {}
): void {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Le scroll n'arrive pas à cadence régulière : un doigt sur un écran ou
    // une molette envoient des paquets d'événements irréguliers, parfois
    // plusieurs par image, parfois aucun. Peindre directement dessus donnait
    // une carte qui sautille. L'avancement est donc suivi de loin : le
    // scroll pose une cible, et une boucle d'animation s'en rapproche à
    // chaque image. Le mouvement devient continu, et la caméra garde ce
    // léger retard des caméras qui suivent vraiment quelque chose.
    const SUIVI = 0.14;

    let cible = 0;
    let courant = 0;
    let boucle = 0;

    const doux = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const pas = () => {
      const ecart = cible - courant;
      if (!doux || Math.abs(ecart) < 0.0002) {
        courant = cible;
        boucle = 0;
      } else {
        courant += ecart * SUIVI;
        boucle = requestAnimationFrame(pas);
      }
      onProgress(courant);
    };

    // Une scène ne peint que si on l'a atteinte. Sans cette règle, toutes
    // les scènes s'annoncent au chargement et la dernière de la page impose
    // son décor : on se retrouvait avec l'Écosse derrière l'ouverture.
    // Une scène déjà traversée garde le droit d'écrire, à l'avancement 1 :
    // c'est ce qui laisse la carte allumée et le tracé en place.
    // Au-delà de ce saut, on ne suit plus : on rattrape. Cela couvre les
    // bonds — ancre, retour sur la page, onglet réveillé — pour lesquels une
    // poursuite en douceur ne voudrait rien dire, et protège du cas où la
    // boucle d'animation est suspendue par le navigateur.
    const SAUT = 0.25;

    const jouer = (self: ScrollTrigger, immediat = false) => {
      if (self.scroll() < self.start - 1) return;
      cible = self.progress;
      if (immediat || Math.abs(cible - courant) > SAUT) {
        courant = cible;
        onProgress(courant);
        return;
      }
      if (!boucle) boucle = requestAnimationFrame(pas);
    };

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => jouer(self),
      // Un remesurage n'est pas un mouvement : on s'y cale sans transition.
      onRefresh: (self) => jouer(self, true),
      onLeaveBack: options.onLeaveBack,
      onLeave: options.onLeave,
    });

    jouer(trigger, true);
    return () => {
      if (boucle) cancelAnimationFrame(boucle);
      trigger.kill();
    };
    // Les rappels sont lus une seule fois, au montage : les scènes sont
    // fixes pour la durée de vie de la page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
