// Apparition et disparition des phrases du récit.
//
// Une phrase occupe une fenêtre d'avancement : elle monte en fondu à
// l'entrée, tient, puis s'efface. Rien d'autre que `opacity` et
// `transform`, pour que le navigateur n'ait jamais à recalculer la mise en
// page pendant le scroll.

export const clamp01 = (valeur: number) => Math.min(Math.max(valeur, 0), 1);

/** Interpolation entre deux valeurs, avec l'avancement borné. */
export function lerp(depuis: number, vers: number, t: number): number {
  return depuis + (vers - depuis) * clamp01(t);
}

/** Avancement ramené d'une fenêtre [debut, fin] vers [0, 1]. */
export function range(p: number, debut: number, fin: number): number {
  return clamp01((p - debut) / (fin - debut || 1));
}

/** Adoucit un aller-retour : lent au départ, lent à l'arrivée. */
export function easeInOut(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

const mouvementReduit = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

interface BeatOptions {
  /** Largeur du fondu, en avancement. */
  fade?: number;
  /** Montée à l'entrée, en pixels. Annulée si le mouvement est réduit. */
  rise?: number;
  /** Grossissement à l'entrée, pour les grands titres. */
  scale?: number;
}

/**
 * Affiche une phrase entre `debut` et `fin`, avec un fondu de part et
 * d'autre. Une fenêtre qui finit à 1 laisse la phrase à l'écran.
 */
export function showBeat(
  element: HTMLElement | null,
  p: number,
  debut: number,
  fin: number,
  options: BeatOptions = {}
): void {
  if (!element) return;

  const fade = options.fade ?? 0.06;
  const rise = mouvementReduit() ? 0 : (options.rise ?? 16);

  let opacite = 0;
  if (p >= debut - fade && p <= fin + fade) {
    if (p < debut) opacite = (p - (debut - fade)) / fade;
    else if (p > fin) opacite = 1 - (p - fin) / fade;
    else opacite = 1;
  }
  opacite = clamp01(opacite);

  element.style.opacity = String(opacite);

  const decalage = (1 - opacite) * rise;
  const grossissement = options.scale
    ? lerp(options.scale, 1, opacite)
    : 1;
  element.style.transform =
    `translate3d(0, ${decalage.toFixed(2)}px, 0)` +
    (options.scale ? ` scale(${grossissement.toFixed(3)})` : "");
}
