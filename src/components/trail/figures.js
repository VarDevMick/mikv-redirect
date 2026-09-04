// Les trois dessins du personnage : en marche, sa tente, son couchage.
// Aplats colorés, contours implicites — voir F-14, F-15, F-16.

export const RANDONNEUSE = `
<svg viewBox="0 0 44 62" aria-hidden="true">
  <line x1="29" y1="27" x2="29" y2="54" stroke="#a5804d" stroke-width="1.6" stroke-linecap="round"></line>
  <g class="jambe jambe-arriere">
    <path d="M21,36 L16,50" stroke="#9c7f52" stroke-width="4" stroke-linecap="round" fill="none"></path>
    <path d="M16,50.5 L13,52.5" stroke="#3a2b1c" stroke-width="4" stroke-linecap="round" fill="none"></path>
  </g>
  <g class="jambe jambe-avant">
    <path d="M21,36 L26,50" stroke="#b39262" stroke-width="4" stroke-linecap="round" fill="none"></path>
    <path d="M26,50.5 L29,52.5" stroke="#4a3826" stroke-width="4" stroke-linecap="round" fill="none"></path>
  </g>
  <g class="buste">
    <rect x="12" y="20" width="9.5" height="13.5" rx="4" fill="#e2b53b"></rect>
    <rect x="13.5" y="24" width="6.5" height="1.8" rx="0.9" fill="#b8860b"></rect>
    <path d="M21.5,36 L22,20" stroke="#2f5233" stroke-width="7" stroke-linecap="round" fill="none"></path>
    <path class="bras" d="M22.5,24 L28.4,29" stroke="#2f5233" stroke-width="3.2" stroke-linecap="round" fill="none"></path>
    <ellipse cx="22" cy="12.4" rx="6.6" ry="6.3" fill="#c4551a"></ellipse>
    <path class="meche" d="M16.4,13 q-3.4,4.6 -2,9.4 q0.8,2.6 2.6,3.6 q-1.9,-4.8 0.3,-7 q-1.6,-2.6 -0.9,-6 z" fill="#c4551a"></path>
    <path class="meche" d="M15.2,18.5 q-2.4,3.4 -1,6.6 q0.9,-2.6 2.1,-3.4 z" fill="#a8410f"></path>
    <circle cx="23.2" cy="13.6" r="5.2" fill="#e9c39c"></circle>
    <path d="M18.4,10.8 q3.6,-3.4 8.6,-1.4 q-3.8,-0.2 -6.6,2.8 z" fill="#a8410f"></path>
  </g>
</svg>`;

export const BIVOUAC = `
<svg viewBox="0 0 34 26" aria-hidden="true">
  <path d="M3,22 L17,4 L31,22 Z" fill="#c1440e"></path>
  <path d="M17,4 L17,22" stroke="#8f3209" stroke-width="1.2"></path>
  <path d="M12.5,22 L17,10 L21.5,22 Z" fill="#5c2a12"></path>
  <line x1="0.5" y1="22" x2="33.5" y2="22" stroke="#e2b53b" stroke-width="1.8" stroke-linecap="round"></line>
</svg>`;

export const DODO = `
<svg viewBox="0 0 140 56" aria-hidden="true">
  <rect x="6" y="41" width="128" height="5" rx="2.5" fill="#6b563a"></rect>
  <g class="souffle">
    <rect x="40" y="26" width="86" height="16" rx="8" fill="#c1440e"></rect>
    <path d="M46,26 q6,-5 14,0" fill="none" stroke="#8f3209" stroke-width="1.4"></path>
    <rect x="112" y="28" width="12" height="12" rx="6" fill="#a83a0c"></rect>
    <rect x="16" y="31" width="24" height="11" rx="5.5" fill="#fdf8ec"></rect>
    <ellipse cx="30" cy="29" rx="12" ry="8.5" fill="#c4551a"></ellipse>
    <path d="M20,26 q-6,3 -7,8 q4,-4 8,-4 z" fill="#c4551a"></path>
    <circle cx="34" cy="30" r="7" fill="#e9c39c"></circle>
    <path d="M34,28.5 q2.4,2 4.6,0" fill="none" stroke="#3a2f26" stroke-width="1.2" stroke-linecap="round"></path>
    <path d="M35,34 q2,1.6 3.8,0" fill="none" stroke="#3a2f26" stroke-width="1" stroke-linecap="round"></path>
  </g>
  <rect x="122" y="30" width="12" height="11" rx="4" fill="#e2b53b"></rect>
  <text class="zzz zzz1" x="46" y="20" font-family="Georgia, serif" font-size="11" fill="#7a6a58">z</text>
  <text class="zzz zzz2" x="55" y="14" font-family="Georgia, serif" font-size="9" fill="#7a6a58">z</text>
  <text class="zzz zzz3" x="63" y="9" font-family="Georgia, serif" font-size="7" fill="#7a6a58">z</text>
</svg>`;
