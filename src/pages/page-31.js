// Page de travail servie sur /31.
//
// Ce fichier n'assemble que des composants : il ne contient ni style ni
// balisage propre. Chaque composant expose `html`, `css` et parfois `js`,
// que l'on concatène ici. Pour modifier une fonctionnalité, on va donc
// directement dans son composant, pas ici.
//
// /30 est gelée et reste servie par src/page-30.js, monolithique et intact.

import * as tokens from "../styles/tokens.js";
import * as layout from "../styles/layout.js";
import * as scenery from "../components/scenery/scenery.js";
import * as hero from "../components/hero/hero.js";
import * as story from "../components/story/story.js";
import * as routeMap from "../components/route-map/route-map.js";
import * as stepCard from "../components/step-card/step-card.js";
import * as trail from "../components/trail/trail.js";
import * as music from "../components/music/music.js";

// L'ordre définit la cascade CSS et l'ordre d'exécution des scripts.
const COMPOSANTS = [
  tokens, layout, scenery, hero, story,
  routeMap, stepCard, trail, music,
];

const styles = COMPOSANTS.map((c) => c.css || "").join("\n");
const scripts = COMPOSANTS.map((c) => c.js || "").join("\n");

// Bandeau de la page de travail : rappelle qu'on n'est pas sur /30.
const bandeauDev = `
  <div class="bandeau-dev">DEV</div>`;

const cssBandeau = `
  .bandeau-dev {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
    background: var(--soleil);
    color: var(--papier);
    text-align: center;
    font-family: Georgia, serif;
    font-size: 0.72rem;
    letter-spacing: 0.32em;
    padding: 4px 0 3px;
    pointer-events: none;
  }`;

export const PAGE_31_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Une surprise pour toi</title>
<style>
${styles}
${cssBandeau}
</style>
</head>
<body>
${bandeauDev}
${music.html}
${trail.html}
${hero.html}
${story.invitation}
${routeMap.html}
${story.conclusion}
<script>
${scripts}
</script>
</body>
</html>
`;
