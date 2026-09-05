// Thème Édimbourg — les décors dessinés : silhouette de la ville, château
// sur son rocher.
//
// Le vocabulaire remplace celui de la montagne : Arthur's Seat tient le
// plan lointain, les toits et les flèches font le relief, les cheminées
// remplacent les sapins comme motif répété. Quelques fenêtres allumées
// apportent la seule touche chaude.
//
// Les cheminées portent leur couleur en dur plutôt que la classe `.sapins` :
// celle-ci tire son vert du thème montagne et jurerait sur de la pierre.

const CHEMINEE =
  "M-3,0 L-3,-7 L-1.6,-7 L-1.6,-10 L-0.4,-10 L-0.4,-7 L0.4,-7 L0.4,-10 L1.6,-10 L1.6,-7 L3,-7 L3,0 Z";

// Valeurs de nuit : les plans s'assombrissent en s'approchant, à l'inverse
// d'un paysage de jour. Seules les fenêtres éclairent.
const PIERRE_LOIN = "#2a3a58";
const PIERRE = "#1c2a44";
const PIERRE_PROCHE = "#16233a";
const TOIT = "#0e1729";
const FENETRE = "#e8b866";

// Séparation entre deux sections : quatre plans successifs, le plus proche
// prenant la couleur de la section suivante pour faire la jointure.
export const separation = (fond) => `
<svg class="divider" viewBox="0 0 400 90" preserveAspectRatio="none" aria-hidden="true">
  <!-- Arthur's Seat, au loin -->
  <path d="M0,90 L0,64 C46,62 84,52 124,42 C146,36 172,33 198,38 C230,44 262,54 302,58 C342,62 372,60 400,58 L400,90 Z" fill="${PIERRE_LOIN}"></path>
  <path class="d-trait" d="M0,64 C46,62 84,52 124,42 C146,36 172,33 198,38 C230,44 262,54 302,58 C342,62 372,60 400,58"></path>

  <!-- la ligne de toits : tours du château, flèche du Scott Monument, clochers -->
  <path d="M0,90 L0,72 L18,72 L18,62 L34,62 L34,70 L48,70 L48,50 L54,42 L60,50 L60,68 L76,68 L76,48 L92,48 L92,40 L98,40 L98,48 L112,48 L112,66 L130,66 L130,58 L146,58 L146,68 L164,68 L164,60 L178,60 L178,54 L184,26 L190,54 L190,66 L206,66 L206,56 L224,56 L224,70 L242,70 L242,58 L258,58 L258,48 L266,40 L274,48 L274,64 L292,64 L292,70 L310,70 L310,60 L328,60 L328,68 L346,68 L346,56 L364,56 L364,70 L382,70 L382,64 L400,64 L400,90 Z" fill="${PIERRE}"></path>

  <!-- quelques fenêtres allumées -->
  <g fill="${FENETRE}">
    <rect x="21" y="66" width="3" height="4"></rect>
    <rect x="80" y="54" width="3" height="4"></rect>
    <rect x="116" y="70" width="3" height="4"></rect>
    <rect x="210" y="60" width="3" height="4"></rect>
    <rect x="246" y="62" width="3" height="4"></rect>
    <rect x="332" y="72" width="3" height="4"></rect>
    <rect x="368" y="60" width="3" height="4"></rect>
  </g>

  <!-- l'avant-plan prend la couleur de la section suivante -->
  <path d="M0,90 L0,80 L26,80 L26,84 L58,84 L58,78 L96,78 L96,83 L140,83 L140,79 L186,79 L186,84 L232,84 L232,80 L280,80 L280,85 L330,85 L330,80 L370,80 L370,84 L400,84 L400,90 Z" fill="${fond}"></path>
  <path class="d-trait" d="M0,80 L26,80 L26,84 L58,84 L58,78 L96,78 L96,83 L140,83 L140,79 L186,79 L186,84 L232,84 L232,80 L280,80 L280,85 L330,85 L330,80 L370,80 L370,84 L400,84"></path>

  <g fill="${TOIT}">
    <path transform="translate(38,80)" d="${CHEMINEE}"></path>
    <path transform="translate(76,78)" d="${CHEMINEE}"></path>
    <path transform="translate(158,83)" d="${CHEMINEE}"></path>
    <path transform="translate(210,79)" d="${CHEMINEE}"></path>
    <path transform="translate(300,80)" d="${CHEMINEE}"></path>
    <path transform="translate(352,85)" d="${CHEMINEE}"></path>
  </g>
</svg>`;

// Décor d'ouverture : le château sur son rocher, la vieille ville qui
// descend vers l'est. Le versant ouest est une vraie falaise — c'est la
// silhouette qui rend Édimbourg reconnaissable.
export const chateau = `
    <svg class="massif" viewBox="0 0 400 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <path d="M0,240 L0,214 L14,212 C26,196 34,164 52,140 C60,128 68,120 80,116 L168,112 C202,120 244,142 288,160 C330,178 364,190 400,196 L400,240 Z" fill="${PIERRE_LOIN}"></path>
      <path class="d-trait" d="M14,212 C26,196 34,164 52,140 C60,128 68,120 80,116 L168,112 C202,120 244,142 288,160 C330,178 364,190 400,196"></path>

      <!-- le château : corps de logis, tours crénelées, mât -->
      <path d="M80,116 L80,84 L90,84 L90,72 L102,72 L102,84 L120,84 L120,64 L132,64 L132,84 L150,84 L150,76 L162,76 L162,112 L80,116 Z" fill="${PIERRE}"></path>
      <path class="d-trait" d="M80,116 L80,84 L90,84 L90,72 L102,72 L102,84 L120,84 L120,64 L132,64 L132,84 L150,84 L150,76 L162,76 L162,112"></path>
      <g fill="${FENETRE}">
        <rect x="94" y="94" width="5" height="7"></rect>
        <rect x="122" y="90" width="5" height="7"></rect>
        <rect x="140" y="96" width="5" height="7"></rect>
      </g>
      <path class="d-trait" d="M126,64 L126,42"></path>
      <path d="M126,42 L146,48 L126,54 Z" fill="#b083c9"></path>

      <!-- la vieille ville, en contrebas vers l'est -->
      <path d="M0,240 L0,206 L26,206 L26,182 L52,182 L52,196 L78,196 L78,172 L100,172 L100,190 L126,190 L126,178 L152,178 L152,198 L178,198 L178,184 L196,184 L196,170 L206,132 L216,170 L216,192 L242,192 L242,176 L268,176 L268,200 L294,200 L294,186 L320,186 L320,202 L346,202 L346,190 L372,190 L372,204 L400,204 L400,240 Z" fill="${PIERRE_PROCHE}"></path>
      <g fill="${FENETRE}">
        <rect x="34" y="190" width="4" height="6"></rect>
        <rect x="86" y="180" width="4" height="6"></rect>
        <rect x="134" y="186" width="4" height="6"></rect>
        <rect x="250" y="184" width="4" height="6"></rect>
        <rect x="302" y="194" width="4" height="6"></rect>
        <rect x="354" y="198" width="4" height="6"></rect>
      </g>

      <g fill="${TOIT}">
        <path transform="translate(38,182) scale(1.3)" d="${CHEMINEE}"></path>
        <path transform="translate(90,172) scale(1.3)" d="${CHEMINEE}"></path>
        <path transform="translate(256,176) scale(1.3)" d="${CHEMINEE}"></path>
        <path transform="translate(358,190) scale(1.3)" d="${CHEMINEE}"></path>
      </g>
    </svg>`;

export { CHEMINEE };
