// Page de travail servie sur /31 — thème Queyras.
//
// Ce fichier n'assemble que des composants génériques, un thème et des
// données. Aucun style ni balisage propre, hormis le bandeau DEV.
//
// Pour modifier une fonctionnalité : son composant.
// Pour modifier une couleur ou un dessin : `src/themes/queyras/`.
// Pour modifier un texte ou une étape : `src/data/queyras.js`.
//
// /30 est gelée et reste servie par src/page-30.js, monolithique et intact.

import { theme } from "../themes/queyras/index.js";
import { ETAPES, TRACE_PLAN, REPERES, OUVERTURE, TEXTES, VIDEO } from "../data/queyras.js";

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
const styles = [
  tokens.css(theme.palette),
  layout.css, scenery.css, hero.css, story.css,
  routeMap.css, stepCard.css, trail.css, music.css,
].join("\n");

const scripts = [
  hero.js,
  routeMap.js(REPERES),
  trail.js,
  music.js,
].join("\n");

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
    background: var(--accent);
    color: var(--fond);
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
${trail.html(theme.figures)}
${hero.html(theme.decorOuverture, OUVERTURE)}
${story.invitation(theme.separation, TEXTES)}
${routeMap.html(TRACE_PLAN, REPERES, stepCard.html(ETAPES))}
${story.conclusion(TEXTES, VIDEO)}
<script>
${scripts}
</script>
</body>
</html>
`;
