// Fond de plan d'Édimbourg, dessiné sous le parcours.
//
// La ville tient à sa géographie : une crête volcanique portant le Royal
// Mile du château à Holyrood, un vallon asséché devenu jardins, et au nord
// la grille géorgienne de la New Town. Le plan reprend cette structure.
//
// Évocateur et non cartographique : les proportions sont ajustées pour
// tenir dans le cadre, pas relevées sur une carte.

export const plan = `
        <g aria-hidden="true">
          <!-- le Water of Leith, au nord-ouest -->
          <path class="plan-eau" d="M-24,66 C-6,54 8,44 22,36 C34,29 44,26 56,25"></path>

          <!-- les jardins de Princes Street, dans l'ancien vallon -->
          <path class="plan-parc" d="M62,66 C96,58 140,56 188,60 C206,62 214,66 212,72 C176,80 120,82 74,76 C64,74 60,70 62,66 Z"></path>

          <!-- la grille géorgienne : Queen, George, Princes Street -->
          <path class="plan-rue-fine" d="M50,18 L204,26"></path>
          <path class="plan-rue" d="M48,34 L206,42"></path>
          <path class="plan-rue" d="M46,52 L214,60"></path>
          <path class="plan-rue-fine" d="M76,15 L80,58"></path>
          <path class="plan-rue-fine" d="M116,17 L120,60"></path>
          <path class="plan-rue-fine" d="M156,19 L160,62"></path>
          <path class="plan-rue-fine" d="M194,22 L198,64"></path>

          <!-- la crête : le Royal Mile, du château à Holyrood -->
          <path class="plan-rue" d="M52,88 C96,92 150,98 198,102 C224,105 242,107 258,110"></path>
          <path class="plan-rue-fine" d="M96,92 L92,116"></path>
          <path class="plan-rue-fine" d="M150,98 L148,124"></path>
          <path class="plan-rue-fine" d="M198,102 L200,126"></path>

          <!-- le rocher du château, à l'ouest de la crête -->
          <path class="plan-relief" d="M40,80 L62,78 L66,90 L44,94 Z"></path>

          <!-- Calton Hill et son monument inachevé -->
          <circle class="plan-relief" cx="278" cy="58" r="16"></circle>
          <path class="plan-rue-fine" d="M271,54 L285,54 M273,54 L273,62 M278,54 L278,62 M283,54 L283,62"></path>

          <!-- Arthur's Seat et les Salisbury Crags -->
          <path class="plan-relief" d="M256,132 C264,116 284,110 300,116 C316,122 322,138 314,150 C300,158 268,156 256,146 Z"></path>

          <text class="plan-legende" x="288" y="166" text-anchor="middle">Arthur's Seat</text>
          <text class="plan-legende" x="136" y="72" text-anchor="middle">Princes St Gardens</text>
          <text class="plan-legende" x="128" y="40" text-anchor="middle">New Town</text>
        </g>`;
