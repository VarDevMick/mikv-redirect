// F-02 · Les trois étapes du trek, et F-11 · leurs photos.
//
// Trio consécutif le plus accessible du Tour du Queyras (étapes officielles
// 7, 8 et 9). Durées et dénivelés issus de lequeyras.com. Les distances en
// kilomètres sont absentes volontairement : la source ne les donne pas, et
// mieux vaut ne rien afficher qu'un chiffre inventé.
//
// Photos : Wikimedia Commons, licences libres, crédit conservé ci-dessous.
// Pour changer une image, il suffit de remplacer `photo` et `credit`.

export const ETAPES = [
  {
    id: "souliers",
    jour: "Jour 1 · mise en jambes",
    trajet: "Souliers → Chalp d'Arvieux",
    note: "Par le col Tronchet, tranquille pour commencer.",
    marche: "4h",
    montee: "+510 m",
    descente: "-660 m",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Vu_vers_le_Lac_Souliers_de_la_cr%C3%AAte_du_Tronchet_-_panoramio.jpg/1280px-Vu_vers_le_Lac_Souliers_de_la_cr%C3%AAte_du_Tronchet_-_panoramio.jpg",
    credit: "Lac de Souliers depuis la crête du Tronchet · Philippe Truillet, CC BY-SA 3.0",
  },
  {
    id: "arvieux",
    jour: "Jour 2 · la belle montée",
    trajet: "Chalp d'Arvieux → Refuge de Furfande",
    note: "La seule vraie grimpette, avec un refuge perché en récompense.",
    marche: "5h",
    montee: "+820 m",
    descente: "-210 m",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Arvieux_depuis_la_mont%C3%A9e_du_col_d%27Izoard.jpg/1280px-Arvieux_depuis_la_mont%C3%A9e_du_col_d%27Izoard.jpg",
    credit: "La vallée d'Arvieux · Mathieu Brossais, CC BY 4.0",
  },
  {
    id: "ceillac",
    jour: "Jour 3 · la grande descente",
    trajet: "Refuge de Furfande → Bramousse",
    note: "Par le col Lauze, puis on redescend tranquillement dans la vallée.",
    marche: "4h30",
    montee: "+210 m",
    descente: "-1000 m",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Vall%C3%A9e_de_Ceillac.jpg/1280px-Vall%C3%A9e_de_Ceillac.jpg",
    credit: "La vallée de Ceillac · ThomasInTheSky, CC BY 4.0",
  },
];

// F-17 · Points clés du plan interactif, dans les coordonnées de son tracé.
export const TRACE_PLAN =
  "M10,120 C35,95 50,55 70,45 C88,58 98,62 112,75 C124,92 132,112 142,122 " +
  "C158,100 168,62 182,52 C198,66 202,86 212,92 C228,72 238,42 252,32 " +
  "C270,52 286,92 300,112";

export const REPERES = [
  { x: 10, y: 120, label: "Souliers" },
  { x: 112, y: 75, label: "Arvieux" },
  { x: 212, y: 92, label: "Furfande" },
  { x: 300, y: 112, label: "Bramousse" },
];
