// Thème Édimbourg, regroupé. Même contrat que le thème Queyras : une
// palette, des décors, des figures. Les composants n'en savent rien de plus.
import { palette } from "./palette.js";
import { separation, chateau } from "./paysage.js";
import { MARCHEUR, ETAPE, REPOS } from "./figures.js";

export const theme = {
  palette,
  separation,          // (couleurFondSuivant) => svg
  decorOuverture: chateau,
  figures: { marcheur: MARCHEUR, etape: ETAPE, repos: REPOS },
};
