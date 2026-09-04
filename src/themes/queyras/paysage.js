// Thème Queyras — les décors dessinés : crêtes, sapins, massif d'ouverture.
//
// Tout ce qui est propre à la montagne vit ici. Les composants ne savent
// pas ce qu'ils affichent, ils reçoivent ces dessins en paramètre.

const SAPIN = "M0,0 L-6,10 L-2.5,10 L-7,17 L-2,17 L-2,21 L2,21 L2,17 L7,17 L2.5,10 L6,10 Z";

// Séparation entre deux sections : quatre plans successifs, le plus
// proche prenant la couleur de la section suivante pour faire la jointure.
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

// Décor d'ouverture, posé derrière le grand chiffre.
export const massif = `
    <svg class="massif" viewBox="0 0 400 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <!-- sommets, du plus lointain au plus proche -->
      <path d="M0,240 L0,150 L58,84 L104,124 L150,60 L206,132 L248,96 L300,150 L344,110 L400,166 L400,240 Z" fill="#c9bda6"></path>
      <path d="M128,80 L150,60 L172,80 L160,74 L142,78 Z" fill="#fdf8ec"></path>
      <path d="M184,102 L206,132 L228,104 L212,110 Z" fill="#fdf8ec" opacity="0.8"></path>
      <path class="d-trait" d="M0,150 L58,84 L104,124 L150,60 L206,132 L248,96 L300,150 L344,110 L400,166"></path>
      <path d="M0,240 L0,186 C74,164 128,196 196,180 C266,164 318,192 400,178 L400,240 Z" fill="#6f8a5c"></path>
      <path class="d-trait" d="M0,186 C74,164 128,196 196,180 C266,164 318,192 400,178"></path>
      <g class="sapins">
        <path transform="translate(74,176) scale(1.5)" d="${SAPIN}"></path>
        <path transform="translate(104,184) scale(1.1)" d="${SAPIN}"></path>
        <path transform="translate(258,190) scale(1.2)" d="${SAPIN}"></path>
        <path transform="translate(320,180) scale(1.5)" d="${SAPIN}"></path>
      </g>
      <path d="M0,240 L0,214 C90,202 190,224 282,212 C334,205 366,210 400,206 L400,240 Z" fill="#d8c68a"></path>
      <path class="d-trait" d="M0,214 C90,202 190,224 282,212 C334,205 366,210 400,206"></path>
    </svg>`;
