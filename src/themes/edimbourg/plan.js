// Fond de plan d'Édimbourg, dessiné sous les parcours.
//
// La ville tient à sa géographie : une crête volcanique portant le Royal
// Mile du château à Holyrood, un vallon asséché devenu jardins, et au nord
// la grille géorgienne de la New Town. Le plan reprend cette structure.
//
// Le cadre est volontairement haut (360 × 248) : sur une bande deux fois
// plus large que haute, tout se tassait et devenait illisible.
//
// Évocateur et non cartographique : les proportions sont ajustées pour
// tenir dans le cadre, pas relevées sur une carte.

// Le bas du cadre doit laisser passer les libellés placés sous un point :
// à 230 de haut, « Musée » se retrouvait coupé.
export const VUE = "-15 -5 360 248";

export const plan = `
        <g aria-hidden="true">
          <!-- le Water of Leith, au nord-ouest -->
          <path class="plan-eau" d="M-14,64 C6,50 24,38 44,30 C58,25 70,23 84,23"></path>

          <!-- la grille géorgienne : Queen, George, Princes Street -->
          <path class="plan-rue-fine" d="M60,52 L250,62"></path>
          <path class="plan-rue" d="M58,76 L252,86"></path>
          <path class="plan-rue" d="M56,100 L256,110"></path>
          <path class="plan-rue-fine" d="M92,48 L96,106"></path>
          <path class="plan-rue-fine" d="M136,52 L140,110"></path>
          <path class="plan-rue-fine" d="M182,56 L186,114"></path>
          <path class="plan-rue-fine" d="M226,60 L230,118"></path>

          <!-- les jardins de Princes Street, dans l'ancien vallon -->
          <path class="plan-parc" d="M72,126 C110,116 170,114 224,120 C244,123 250,129 246,136 C200,146 130,148 84,140 C72,137 68,131 72,126 Z"></path>

          <!-- la crête : le Royal Mile, du château à Holyrood -->
          <path class="plan-rue" d="M64,168 C110,174 168,182 216,188 C244,192 262,194 280,196"></path>
          <path class="plan-rue-fine" d="M110,175 L106,198"></path>
          <path class="plan-rue-fine" d="M168,183 L166,208"></path>
          <path class="plan-rue-fine" d="M216,189 L218,212"></path>

          <!-- le rocher du château, à l'ouest de la crête -->
          <path class="plan-relief" d="M48,158 L76,154 L80,170 L52,175 Z"></path>

          <!-- Calton Hill et son monument inachevé -->
          <circle class="plan-relief" cx="296" cy="122" r="19"></circle>
          <path class="plan-rue-fine" d="M288,117 L304,117 M290,117 L290,127 M296,117 L296,127 M302,117 L302,127"></path>

          <!-- Arthur's Seat et les Salisbury Crags -->
          <path class="plan-relief" d="M266,212 C276,194 300,188 318,194 C336,201 342,218 332,230 C316,238 280,236 266,226 Z"></path>

          <text class="plan-legende" x="308" y="182" text-anchor="middle">Arthur's Seat</text>
          <text class="plan-legende" x="158" y="134" text-anchor="middle">Princes St Gardens</text>
          <text class="plan-legende" x="155" y="70" text-anchor="middle">New Town</text>
          <text class="plan-legende" x="256" y="216" text-anchor="middle">Holyrood</text>
        </g>`;
