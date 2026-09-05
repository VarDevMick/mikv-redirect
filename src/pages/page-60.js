// Page offerte à Carol, servie sur /60 — thème Édimbourg.
//
// Ce fichier n'assemble que des composants génériques, un thème et des
// données. Aucun style ni balisage propre, hormis le bandeau DEV.
//
// Pour modifier une fonctionnalité : son composant.
// Pour modifier une couleur ou un dessin : `src/themes/edimbourg/`.
// Pour modifier un texte ou une étape : `src/data/edimbourg.js`.
//
// /60 sera la page offerte à Carol, gelée à l'impression de la plaque.

import { theme } from "../themes/edimbourg/index.js";
import { ETAPES, PARCOURS, OUVERTURE, TEXTES, VIDEO } from "../data/edimbourg.js";

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
  routeMap.css(theme.palette.fondEtapes), stepCard.css, trail.css,
  music.css(theme.palette),
].join("\n");

const scripts = [
  hero.js(theme.palette.feu),
  routeMap.jsJours,
  trail.js,
  music.js,
].join("\n");

export const PAGE_60_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Une surprise pour toi</title>
<style>
${styles}
</style>
</head>
<body>
${music.html}
${trail.html(theme.figures)}
${hero.html(theme.decorOuverture, OUVERTURE)}
${story.invitation(theme.separation, TEXTES)}
${routeMap.htmlJours(PARCOURS, stepCard.html(ETAPES), theme.fondPlan, theme.vuePlan)}
${story.conclusion(TEXTES, VIDEO)}
<script>
${scripts}
</script>
</body>
</html>
`;
