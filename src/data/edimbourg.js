// Contenu du projet Édimbourg : étapes, plan de ville et textes.
//
// Carol fête ses 60 ans. Sa fille Chloé lui offre trois jours à Édimbourg.
// Le voyage est réservé, mais les dates sont une surprise : la page déroule
// le programme d'abord, et ne les révèle qu'à la fin.
//
// Chloé tutoie sa mère.
//
// Photos : Wikimedia Commons, licences libres, crédit conservé.
// Sources du programme : blogs de voyage — horaires et tarifs restent à
// vérifier avant le départ.

// ⚠️ Date d'exemple, en attente des vraies. Un seul endroit à changer.
export const DATES = "du 30 novembre au 2 décembre";

export const ETAPES = [
  {
    id: "vieille-ville",
    jour: "Jour 1 · la vieille ville",
    trajet: "Royal Mile & Victoria Street",
    note: "Les façades colorées, les ruelles en escalier, et le Musée national pour finir au chaud.",
    marche: "Royal Mile",
    montee: "Victoria St",
    descente: "Musée",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Edinburgh_Victora_Street_20211019.jpg/1280px-Edinburgh_Victora_Street_20211019.jpg",
    credit: "Victoria Street · Daniel Kraft, CC BY-SA 3.0",
  },
  {
    id: "chateau",
    jour: "Jour 2 · le château et la ville géorgienne",
    trajet: "Edinburgh Castle & Calton Hill",
    note: "Le château le matin, puis les rues géorgiennes, et Calton Hill quand le jour tombe.",
    marche: "Château",
    montee: "New Town",
    descente: "Calton Hill",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Edinburgh_Castle_from_Esplanade_20211019.jpg/1280px-Edinburgh_Castle_from_Esplanade_20211019.jpg",
    credit: "Le château depuis l'esplanade · Daniel Kraft, CC BY-SA 3.0",
  },
  {
    id: "dean-village",
    jour: "Jour 3 · les villages dans la ville",
    trajet: "Dean Village & Stockbridge",
    note: "L'ancien hameau des meuniers le long de l'eau, puis les boutiques de Stockbridge.",
    marche: "Dean Village",
    montee: "Stockbridge",
    descente: "Holyrood",
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Well_Court%2C_Dean_Village_-_geograph.org.uk_-_7095759.jpg/1280px-Well_Court%2C_Dean_Village_-_geograph.org.uk_-_7095759.jpg",
    credit: "Well Court, Dean Village · M J Richardson, CC BY-SA 2.0",
  },
];

// Plan de ville stylisé : la crête du Royal Mile, d'ouest en est, et les
// quartiers de part et d'autre. Évocateur, pas cartographique.
export const TRACE_PLAN =
  "M14,96 C40,84 62,74 92,72 C124,70 150,80 178,86 " +
  "C206,92 232,88 258,76 C280,66 296,58 306,44";

export const REPERES = [
  { x: 14, y: 96, label: "Dean Village" },
  { x: 92, y: 72, label: "Château" },
  { x: 178, y: 86, label: "Royal Mile" },
  { x: 306, y: 44, label: "Calton Hill" },
];

// Textes de l'ouverture.
export const OUVERTURE = {
  eyebrow: "Joyeux anniversaire",
  prenom: "Carol",
  age: "60",
  accroche: "Ça se fête ailleurs.",
  invite: "Continue de descendre.",
};

// Textes du récit. La révélation des dates est gardée pour la fin.
export const TEXTES = {
  invitation: {
    titre: "On part toutes les deux.",
    sous: "Trois jours rien qu'à nous, loin d'ici.",
    note: "Et c'est déjà réservé.",
  },
  destination: {
    titre: "Édimbourg",
    sous: "Écosse",
    format: "3 jours · 2 nuits",
    note: "Une ville qui se fait à pied, entre pierre, collines et cafés.",
    invite: "Fais défiler pour suivre le parcours →",
  },
  conclusion: {
    titre: "Ce qui t'attend",
    points: [
      "Vols et hôtel déjà réservés, tu n'as rien à prévoir.",
      "Tout se fait à pied, avec des pauses et des cafés.",
      "Des chaussures confortables, la ville est en pente.",
      `Et c'est ${DATES}.`,
    ],
    signature: "Joyeux anniversaire maman. — Chloé",
  },
};

// Vidéo : nom du fichier déposé dans docs/. Vide = pas de section.
export const VIDEO = "";
