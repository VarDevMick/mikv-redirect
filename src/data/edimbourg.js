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
// vérifier avant le départ. Le billet du château se réserve à l'avance ;
// le marché de Stockbridge n'a lieu que le dimanche.

// ⚠️ Date d'exemple, en attente des vraies. Un seul endroit à changer.
export const DATES = "du 30 novembre au 2 décembre";

// Les journées sont découpées en trois moments plutôt qu'en kilomètres :
// on ne mesure pas une ville comme on mesure une randonnée.
export const ETAPES = [
  {
    id: "vieille-ville",
    jour: "Jour 1 · la vieille ville",
    trajet: "Du Royal Mile au Grassmarket",
    note: "On descend la grande rue pavée, on tourne dans Victoria Street et ses façades de toutes les couleurs, et on finit au chaud devant les vitrines du Musée national.",
    chiffres: [
      { valeur: "Royal Mile", libelle: "Matin" },
      { valeur: "Victoria St", libelle: "Après-midi" },
      { valeur: "Grassmarket", libelle: "Soir" },
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Edinburgh_Victora_Street_20211019.jpg/1280px-Edinburgh_Victora_Street_20211019.jpg",
    credit: "Victoria Street · Daniel Kraft, CC BY-SA 3.0",
  },
  {
    id: "chateau",
    jour: "Jour 2 · le château et la ville géorgienne",
    trajet: "Du rocher à Calton Hill",
    note: "Le château dès l'ouverture, avant la foule. L'après-midi, les larges rues géorgiennes de la New Town. Puis Calton Hill au moment où la ville s'allume.",
    chiffres: [
      { valeur: "Le château", libelle: "Matin" },
      { valeur: "New Town", libelle: "Après-midi" },
      { valeur: "Calton Hill", libelle: "Coucher" },
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Edinburgh_Castle_from_Esplanade_20211019.jpg/1280px-Edinburgh_Castle_from_Esplanade_20211019.jpg",
    credit: "Le château depuis l'esplanade · Daniel Kraft, CC BY-SA 3.0",
  },
  {
    id: "dean-village",
    jour: "Jour 3 · les villages dans la ville",
    trajet: "Dean Village et Stockbridge",
    note: "L'ancien hameau des meuniers, ses maisons de grès rouge au bord de l'eau. On remonte ensuite vers Stockbridge, ses boutiques et ses cafés, sans se presser.",
    chiffres: [
      { valeur: "Dean Village", libelle: "Matin" },
      { valeur: "Stockbridge", libelle: "Après-midi" },
      { valeur: "Holyrood", libelle: "Si le temps" },
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Well_Court%2C_Dean_Village_-_geograph.org.uk_-_7095759.jpg/1280px-Well_Court%2C_Dean_Village_-_geograph.org.uk_-_7095759.jpg",
    credit: "Well Court, Dean Village · M J Richardson, CC BY-SA 2.0",
  },
];

// Parcours suivi sur le plan : il remonte la crête du Royal Mile d'est en
// ouest, de Holyrood au château, puis bascule au nord-ouest vers Dean
// Village. Un seul sens de lecture, pas d'aller-retour.
//
// Calton Hill et Arthur's Seat restent des repères du plan sans être des
// étapes : les y faire passer obligeait le tracé à traverser deux fois.
export const TRACE_PLAN =
  "M258,110 C224,106 198,102 150,98 " +
  "C120,96 92,92 66,88 " +
  "C58,78 46,60 34,46 C30,41 27,37 24,34";

export const REPERES = [
  { x: 258, y: 110, label: "Holyrood" },
  { x: 150, y: 98, label: "Royal Mile" },
  { x: 66, y: 88, label: "Château" },
  { x: 24, y: 34, label: "Dean Village" },
];

// Fraction du tracé atteinte à chaque repère, mesurée sur la courbe.
export const FRACTIONS = [0.02, 0.42, 0.72, 1];

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
    note: "Une ville de pierre posée sur des collines, qui se parcourt entièrement à pied.",
    invite: "Fais défiler pour suivre le parcours →",
  },
  conclusion: {
    titre: "Ce qui t'attend",
    points: [
      "Vols et hôtel déjà réservés : tu n'as rien à prévoir.",
      "Tout se fait à pied, avec des pauses et des cafés.",
      "Des chaussures confortables, la ville est en pente.",
      "Une petite laine : là-bas, le vent vient de la mer.",
      `Et c'est ${DATES}.`,
    ],
    signature: "Joyeux anniversaire maman. — Chloé",
  },
};

// Vidéo : nom du fichier déposé dans docs/. Vide = pas de section.
export const VIDEO = "";
