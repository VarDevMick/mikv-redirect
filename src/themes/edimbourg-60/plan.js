// Fond de plan d'Édimbourg, dessiné sous les parcours.
//
// La ville tient à sa géographie : une crête volcanique portant le Royal
// Mile du château à Holyrood, un vallon asséché devenu jardins, et au nord
// la grille géorgienne de la New Town. Le plan reprend cette structure.
//
// Le cadre est presque carré (360 × 335) : le plan doit dominer la
// surface de l'écran, pas se limiter à une bande sous un titre. Les
// coordonnées ci-dessous ont été réétalées verticalement par calcul
// (voir l'historique) plutôt que redessinées à la main, pour ne pas
// introduire d'erreur de recopie sur une géométrie déjà posée.
//
// Évocateur et non cartographique : les proportions sont ajustées pour
// tenir dans le cadre, pas relevées sur une carte.
export const VUE = "-15 65 360 335";

export const plan = `
        <g aria-hidden="true">
          <!-- le Water of Leith, au nord-ouest -->
          <path class="plan-eau" d="M -14,142.18 C 6,123.84 24,108.12 44,97.64 C 58,91.09 70,88.47 84,88.47"></path>

          <!-- la grille géorgienne : Queen, George, Princes Street -->
          <path class="plan-rue-fine" d="M 60,126.46 L 250,139.56"></path>
          <path class="plan-rue" d="M 58,157.9 L 252,171"></path>
          <path class="plan-rue" d="M 56,189.34 L 256,202.44"></path>
          <path class="plan-rue-fine" d="M 92,121.22 L 96,197.2"></path>
          <path class="plan-rue-fine" d="M 136,126.46 L 140,202.44"></path>
          <path class="plan-rue-fine" d="M 182,131.7 L 186,207.68"></path>
          <path class="plan-rue-fine" d="M 226,136.94 L 230,212.92"></path>

          <!-- les jardins de Princes Street, dans l'ancien vallon -->
          <path class="plan-parc" d="M 72,223.4 C 110,210.3 170,207.68 224,215.54 C 244,219.47 250,227.33 246,236.5 C 200,249.6 130,252.22 84,241.74 C 72,237.81 68,229.95 72,223.4 Z"></path>

          <!-- la crête : le Royal Mile, du château à Holyrood -->
          <path class="plan-rue" d="M 64,278.42 C 110,286.28 168,296.76 216,304.62 C 244,309.86 262,312.48 280,315.1"></path>
          <path class="plan-rue-fine" d="M 110,287.59 L 106,317.72"></path>
          <path class="plan-rue-fine" d="M 168,298.07 L 166,330.82"></path>
          <path class="plan-rue-fine" d="M 216,305.93 L 218,336.06"></path>

          <!-- le rocher du château, à l'ouest de la crête -->
          <path class="plan-relief" d="M 48,265.32 L 76,260.08 L 80,281.04 L 52,287.59 Z"></path>

          <!-- Calton Hill et son monument inachevé -->
          <circle class="plan-relief" cx="296" cy="218.16" r="19"></circle>
          <path class="plan-rue-fine" d="M 288,211.61 L 304,211.61 M 290,211.61 L 290,224.71 M 296,211.61 L 296,224.71 M 302,211.61 L 302,224.71"></path>

          <!-- Arthur's Seat et les Salisbury Crags -->
          <path class="plan-relief" d="M 266,336.06 C 276,312.48 300,304.62 318,312.48 C 336,321.65 342,343.92 332,359.64 C 316,370.12 280,367.5 266,354.4 Z"></path>

          <text class="plan-legende" x="308" y="296.76" text-anchor="middle">Arthur's Seat</text>
          <text class="plan-legende" x="158" y="233.88" text-anchor="middle">Princes St Gardens</text>
          <text class="plan-legende" x="155" y="150.04" text-anchor="middle">New Town</text>
          <text class="plan-legende" x="256" y="341.3" text-anchor="middle">Holyrood</text>
        </g>`;
