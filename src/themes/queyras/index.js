// Thème Queyras, regroupé. Un thème fournit une palette, des décors et des
// figures ; les composants n'en savent rien de plus.
import { palette } from "./palette.js";
import { separation, massif } from "./paysage.js";
import { MARCHEUR, ETAPE, REPOS } from "./figures.js";

export const theme = {
  palette,
  separation,          // (couleurFondSuivant) => svg
  decorOuverture: massif,
  figures: { marcheur: MARCHEUR, etape: ETAPE, repos: REPOS },
};
