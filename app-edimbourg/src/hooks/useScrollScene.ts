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

    // Une scène ne peint que si on l'a atteinte. Sans cette règle, toutes
    // les scènes s'annoncent au chargement et la dernière de la page impose
    // son décor : on se retrouvait avec l'Écosse derrière l'ouverture.
    // Une scène déjà traversée garde le droit d'écrire, à l'avancement 1 :
    // c'est ce qui laisse la carte allumée et le tracé en place.
    const jouer = (self: ScrollTrigger) => {
      if (self.scroll() >= self.start - 1) onProgress(self.progress);
    };

    const trigger = ScrollTrigger.create({
      trigger: element,
      start: "top top",
      end: "bottom bottom",
      onUpdate: jouer,
      onRefresh: jouer,
      onLeaveBack: options.onLeaveBack,
      onLeave: options.onLeave,
    });

    jouer(trigger);
    return () => trigger.kill();
    // Les rappels sont lus une seule fois, au montage : les scènes sont
    // fixes pour la durée de vie de la page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
