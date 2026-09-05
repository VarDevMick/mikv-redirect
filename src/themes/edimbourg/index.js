// Thème Édimbourg, regroupé. Même contrat que le thème Queyras : une
// palette, des décors, des figures. Les composants n'en savent rien de plus.
import { palette } from "./palette.js";
import { separation, chateau } from "./paysage.js";
import { MARCHEUR, ETAPE, REPOS } from "./figures.js";
import { plan, VUE } from "./plan.js";

export const theme = {
  palette,
  separation,          // (couleurFondSuivant) => svg
  decorOuverture: chateau,
  fondPlan: plan,      // fond de carte, dessiné sous le parcours
  vuePlan: VUE,        // cadre du plan, plus haut que large
  figures: { marcheur: MARCHEUR, etape: ETAPE, repos: REPOS },
};
