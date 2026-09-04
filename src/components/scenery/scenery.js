// F-07 · Séparation entre sections : un paysage en plans successifs.
// Le plan le plus proche prend la couleur de la section suivante, ce qui
// assure la transition d'une section à l'autre.

const SAPIN = "M0,0 L-6,10 L-2.5,10 L-7,17 L-2,17 L-2,21 L2,21 L2,17 L7,17 L2.5,10 L6,10 Z";

export const separation = (fond) => `
<svg class="divider" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
  <!-- chaîne lointaine, adoucie par la distance -->
  <path d="M0,90 L0,44 L44,14 L76,34 L118,8 L158,36 L200,18 L244,42 L286,16 L330,38 L400,20 L400,90 Z" fill="#c9bda6"></path>
  <path d="M104,20 L118,8 L131,20 L123,17 L112,19 Z" fill="#fdf8ec"></path>
  <path d="M274,26 L286,16 L298,27 L290,24 L281,26 Z" fill="#fdf8ec"></path>
  <path class="d-trait" d="M0,44 L44,14 L76,34 L118,8 L158,36 L200,18 L244,42 L286,16 L330,38 L400,20"></path>
  <!-- versants boisés -->
  <path d="M0,90 L0,60 C68,48 116,66 174,58 C242,48 300,64 400,52 L400,90 Z" fill="#6f8a5c"></path>
  <path class="d-trait" d="M0,60 C68,48 116,66 174,58 C242,48 300,64 400,52"></path>
  <g class="sapins">
    <path transform="translate(50,48)" d="${SAPIN}"></path>
    <path transform="translate(72,52) scale(0.8)" d="${SAPIN}"></path>
    <path transform="translate(212,54)" d="${SAPIN}"></path>
    <path transform="translate(340,50)" d="${SAPIN}"></path>
    <path transform="translate(360,54) scale(0.85)" d="${SAPIN}"></path>
  </g>
  <!-- alpage, puis le premier plan dans la couleur de la section suivante -->
  <path d="M0,90 L0,72 C92,64 182,78 268,70 C330,65 362,69 400,65 L400,90 Z" fill="#d8c68a"></path>
  <path class="d-trait" d="M0,72 C92,64 182,78 268,70 C330,65 362,69 400,65"></path>
  <path d="M0,90 L0,82 C110,76 210,88 300,81 C346,77 372,80 400,78 L400,90 Z" fill="${fond}"></path>
  <path class="d-trait" d="M0,82 C110,76 210,88 300,81 C346,77 372,80 400,78"></path>
</svg>`;

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
    fill: var(--sapin);
    stroke: var(--encre);
    stroke-width: 1;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;
  }
`;

// Le motif de sapin est réutilisé par le massif d'ouverture.
export { SAPIN };
