// Thème Édimbourg — les figures : le duo mère-fille qui marche dans la
// ville, l'étape visitée, le repos du soir.
//
// Deux silhouettes au lieu d'une, côte à côte. La mécanique d'animation
// est celle du composant : mêmes classes `jambe`, `bras`, `buste`, `meche`,
// donc la démarche fonctionne sans une ligne de code en plus.

// Sur fond de nuit, les vêtements sont éclaircis : des tons sombres se
// perdraient dans le décor.
const MANTEAU_MERE = "#b083c9";   // bruyère claire
const MANTEAU_FILLE = "#5f9ea0";  // bleu-vert clair
const PEAU = "#f0d5b8";
const CHEVEUX_MERE = "#d8d4cd";   // cheveux gris clair
const CHEVEUX_FILLE = "#a67c52";  // châtain éclairci
const JAMBE = "#5a6478";
const CHAUSSURE = "#39404f";

// Elles marchent de profil, la fille devant, la mère juste derrière.
export const MARCHEUR = `
<svg viewBox="0 0 62 62" aria-hidden="true">
  <!-- la mère, légèrement en retrait -->
  <g class="jambe jambe-arriere">
    <path d="M18,38 L14,50" stroke="${JAMBE}" stroke-width="3.6" stroke-linecap="round" fill="none"></path>
    <path d="M14,50.5 L11,52.5" stroke="${CHAUSSURE}" stroke-width="3.6" stroke-linecap="round" fill="none"></path>
  </g>
  <g class="jambe jambe-avant">
    <path d="M18,38 L22,50" stroke="${JAMBE}" stroke-width="3.6" stroke-linecap="round" fill="none"></path>
    <path d="M22,50.5 L25,52.5" stroke="${CHAUSSURE}" stroke-width="3.6" stroke-linecap="round" fill="none"></path>
  </g>
  <g class="buste">
    <path d="M18,38 L18.5,22" stroke="${MANTEAU_MERE}" stroke-width="8" stroke-linecap="round" fill="none"></path>
    <path class="bras" d="M19,26 L23.5,31" stroke="${MANTEAU_MERE}" stroke-width="3" stroke-linecap="round" fill="none"></path>
    <ellipse cx="18.6" cy="15" rx="5.6" ry="5.4" fill="${CHEVEUX_MERE}"></ellipse>
    <path class="meche" d="M13.6,15.6 q-2.4,3.6 -1.4,7.2 q0.7,2 2,2.8 q-1.4,-3.8 0.2,-5.4 q-1.2,-2 -0.8,-4.6 z" fill="${CHEVEUX_MERE}"></path>
    <circle cx="19.8" cy="16" r="4.4" fill="${PEAU}"></circle>
  </g>

  <!-- la fille, devant -->
  <g class="jambe jambe-avant">
    <path d="M38,38 L42,50" stroke="${JAMBE}" stroke-width="3.6" stroke-linecap="round" fill="none"></path>
    <path d="M42,50.5 L45,52.5" stroke="${CHAUSSURE}" stroke-width="3.6" stroke-linecap="round" fill="none"></path>
  </g>
  <g class="jambe jambe-arriere">
    <path d="M38,38 L34,50" stroke="${JAMBE}" stroke-width="3.6" stroke-linecap="round" fill="none"></path>
    <path d="M34,50.5 L31,52.5" stroke="${CHAUSSURE}" stroke-width="3.6" stroke-linecap="round" fill="none"></path>
  </g>
  <g class="buste">
    <path d="M38,38 L38.5,21" stroke="${MANTEAU_FILLE}" stroke-width="8" stroke-linecap="round" fill="none"></path>
    <path class="bras" d="M39,25 L43.5,30" stroke="${MANTEAU_FILLE}" stroke-width="3" stroke-linecap="round" fill="none"></path>
    <ellipse cx="38.6" cy="13.6" rx="5.8" ry="5.6" fill="${CHEVEUX_FILLE}"></ellipse>
    <path class="meche" d="M33.4,14.2 q-2.8,4 -1.6,8 q0.8,2.2 2.2,3 q-1.6,-4.2 0.2,-6 q-1.4,-2.2 -0.8,-5 z" fill="${CHEVEUX_FILLE}"></path>
    <circle cx="40" cy="14.6" r="4.6" fill="${PEAU}"></circle>
  </g>
</svg>`;

// L'étape : un lampadaire victorien, planté là où elles s'arrêtent.
export const ETAPE = `
<svg viewBox="0 0 34 30" aria-hidden="true">
  <path d="M12,28 L22,28" stroke="${CHAUSSURE}" stroke-width="2.2" stroke-linecap="round"></path>
  <path d="M17,28 L17,10" stroke="${JAMBE}" stroke-width="2.4" stroke-linecap="round"></path>
  <path d="M11,10 L23,10 L20,4 L14,4 Z" fill="#39404f"></path>
  <rect x="14.5" y="5.5" width="5" height="3.5" fill="#e8b866"></rect>
  <circle cx="17" cy="2.6" r="1.6" fill="${JAMBE}"></circle>
</svg>`;

// Le repos : deux tasses de thé et un plaid, en fin de journée.
export const REPOS = `
<svg viewBox="0 0 140 56" aria-hidden="true">
  <path d="M10,46 L130,46" stroke="${CHAUSSURE}" stroke-width="2.4" stroke-linecap="round"></path>
  <g class="souffle">
    <!-- le plaid posé sur le banc -->
    <path d="M28,46 q-8,0 -8,-9 q0,-9 9,-9 l60,0 q9,0 9,9 q0,9 -9,9 z" fill="${MANTEAU_MERE}"></path>
    <path d="M38,28 L38,46 M52,28 L52,46 M66,28 L66,46 M80,28 L80,46" stroke="#7d5a92" stroke-width="1.2"></path>
    <path d="M20,34 L98,34 M20,40 L98,40" stroke="#7d5a92" stroke-width="1.2"></path>
    <!-- deux tasses -->
    <path d="M104,46 q-6,0 -6,-7 l0,-5 l13,0 l0,5 q0,7 -7,7 z" fill="#e9e7e0" stroke="${CHAUSSURE}" stroke-width="1.4"></path>
    <path d="M111,36 q5,0 5,4 q0,4 -5,4" fill="none" stroke="${CHAUSSURE}" stroke-width="1.4"></path>
    <path d="M122,46 q-5,0 -5,-6 l0,-4 l11,0 l0,4 q0,6 -6,6 z" fill="#e9e7e0" stroke="${CHAUSSURE}" stroke-width="1.4"></path>
  </g>
  <!-- la vapeur qui monte -->
  <text class="zzz zzz1" x="100" y="24" font-family="Georgia, serif" font-size="11" fill="#8b97ad">~</text>
  <text class="zzz zzz2" x="110" y="18" font-family="Georgia, serif" font-size="9" fill="#8b97ad">~</text>
  <text class="zzz zzz3" x="119" y="13" font-family="Georgia, serif" font-size="7" fill="#8b97ad">~</text>
</svg>`;
