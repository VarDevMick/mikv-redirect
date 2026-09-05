// Page offerte à Carol, servie sur /60 — thème Édimbourg.
//
// GELÉE au sens du projet : elle importe une copie figée du thème et du
// contenu (edimbourg-60), indépendante de src/data/edimbourg.js et
// src/themes/edimbourg/ que /61 continue de faire évoluer. Un changement
// sur ces derniers ne touche donc plus /60.
//
// Ce fichier n'assemble que des composants génériques, un thème et des
// données. Aucun style ni balisage propre, hormis le bandeau DEV.
//
// Pour modifier une fonctionnalité : son composant.
// Pour modifier une couleur ou un dessin : `src/themes/edimbourg/`.
// Pour modifier un texte ou une étape : `src/data/edimbourg.js`.
//
// /60 sera la page offerte à Carol, gelée à l'impression de la plaque.

import { theme } from "../themes/edimbourg-60/index.js";
import { ETAPES, PARCOURS, OUVERTURE, TEXTES, VIDEO } from "../data/edimbourg-60.js";

import * as tokens from "../styles/tokens.js";
import * as layout from "../styles/layout.js";
import * as scenery from "../components/scenery/scenery.js";
import * as hero from "../components/hero/hero.js";
import * as story from "../components/story/story.js";
import * as routeMap from "../components/route-map/route-map.js";
import * as stepCard from "../components/step-card/step-card.js";
import * as music from "../components/music/music.js";

// L'ordre définit la cascade CSS et l'ordre d'exécution des scripts.
const styles = [
  tokens.css(theme.palette),
  layout.css, scenery.css, hero.css, story.css,
  routeMap.css(theme.palette.fondEtapes), stepCard.css, stepCard.cssCompact,
  music.css(theme.palette),
  // Le duo marche désormais sur les tracés du plan (voir route-map) : plus
  // de colonne fixe à gauche, la marge qu'elle réservait est rendue.
  `.panel, .route-step, .route-step.compact { padding-left: 1.5rem; }`,
].join("\n");

const scripts = [
  hero.js(theme.palette.feu),
  routeMap.jsJours,
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
${hero.html(theme.decorOuverture, OUVERTURE)}
${story.invitation(theme.separation, TEXTES)}
${routeMap.htmlJours(PARCOURS, stepCard.htmlCompact(ETAPES), theme.fondPlan, theme.vuePlan, theme.figures.marcheur)}
${story.conclusion(TEXTES, VIDEO)}
<script>
${scripts}
</script>
</body>
</html>
`;
