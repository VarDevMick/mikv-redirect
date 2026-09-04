// F-07 · Mise en forme des séparations entre sections.
//
// Le dessin lui-même appartient au thème : ce fichier ne décrit que la
// façon dont il se pose en bas d'une section.

export const css = `
  .divider {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 74px;
  }
  .d-trait {
    fill: none;
    stroke: var(--trait);
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
  .d-neige { stroke: var(--encre); stroke-width: 1.8; }
  .sapins path {
    fill: var(--accent-fonce);
    stroke: var(--encre);
    stroke-width: 1;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
`;
