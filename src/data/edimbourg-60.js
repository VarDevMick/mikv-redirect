// Contenu du projet Édimbourg : étapes, plan de ville et textes.
//
// Carol fête ses 60 ans. Sa fille Chloé lui offre trois jours à Édimbourg.
// Ils partent à trois : Hector est du voyage, en poussette.
// Le voyage est réservé, mais les dates sont une surprise : la page déroule
// le programme d'abord, et ne les révèle qu'à la fin.
//
// Chloé tutoie sa mère.
//
// ⚠️ La poussette commande le programme. La vieille ville est l'un des
// environnements urbains les plus difficiles du Royaume-Uni pour une
// poussette : Royal Mile pavé sur toute sa longueur, ruelles en escalier.
// La New Town géorgienne, elle, est plate et lisse. Le château dispose
// d'une navette gratuite jusqu'à Crown Square. Un porte-bébé règle le
// reste. Ne pas ajouter Arthur's Seat ni les closes sans y repenser.
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
    trajet: "Royal Mile, Victoria Street, Grassmarket",
    note: "On descend la grande rue pavée jusqu'à la cathédrale, on tourne dans Victoria Street et ses façades de toutes les couleurs, puis on se pose au Grassmarket. L'après-midi au Musée national : c'est gratuit, c'est chauffé, il y a des ascenseurs partout et Hector peut y courir.",
    astuce: "Le Royal Mile est pavé : ça secoue. Le musée est le refuge idéal.",
    chiffres: [
      { valeur: "Royal Mile", libelle: "Matin" },
      { valeur: "Grassmarket", libelle: "Midi" },
      { valeur: "Musée national", libelle: "Après-midi" },
      { valeur: "Victoria St", libelle: "Fin de jour" },
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Edinburgh_Victora_Street_20211019.jpg/1280px-Edinburgh_Victora_Street_20211019.jpg",
    credit: "Victoria Street · Daniel Kraft, CC BY-SA 3.0",
  },
  {
    id: "chateau",
    jour: "Jour 2 · le château et la ville géorgienne",
    trajet: "Le rocher, la New Town, Calton Hill",
    note: "Le château dès l'ouverture, avant la foule. L'après-midi, les larges rues géorgiennes de la New Town et les jardins de Princes Street, plats et faciles. Puis Calton Hill quand la ville s'allume, vers seize heures.",
    astuce: "Une navette gratuite monte au château. La New Town est plate et lisse.",
    chiffres: [
      { valeur: "Le château", libelle: "Matin" },
      { valeur: "Princes St", libelle: "Midi" },
      { valeur: "New Town", libelle: "Après-midi" },
      { valeur: "Calton Hill", libelle: "Coucher" },
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Edinburgh_Castle_from_Esplanade_20211019.jpg/1280px-Edinburgh_Castle_from_Esplanade_20211019.jpg",
    credit: "Le château depuis l'esplanade · Daniel Kraft, CC BY-SA 3.0",
  },
  {
    id: "dean-village",
    jour: "Jour 3 · les villages dans la ville",
    trajet: "Dean Village, l'eau, Stockbridge",
    note: "L'ancien hameau des meuniers et ses maisons de grès rouge, puis le chemin qui longe le Water of Leith — plat, pavé, à l'abri du vent. On remonte à Stockbridge pour ses boutiques et ses cafés, sans se presser.",
    astuce: "La journée la plus facile du séjour : tout est plat et roulant.",
    chiffres: [
      { valeur: "Dean Village", libelle: "Matin" },
      { valeur: "Water of Leith", libelle: "Midi" },
      { valeur: "Stockbridge", libelle: "Après-midi" },
      { valeur: "Retour", libelle: "Fin de jour" },
    ],
    photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Well_Court%2C_Dean_Village_-_geograph.org.uk_-_7095759.jpg/1280px-Well_Court%2C_Dean_Village_-_geograph.org.uk_-_7095759.jpg",
    credit: "Well Court, Dean Village · M J Richardson, CC BY-SA 2.0",
  },
];

// Un parcours par journée : en ville, les jours sont des boucles
// distinctes, pas un chemin continu. Seul le jour de l'étape en cours
// s'allume sur le plan.
export const PARCOURS = [
  {
    jour: 1,
    titre: "Jour 1 · la vieille ville",
    d: "M 216,304.62 C 182,300.69 148,295.45 120,294.14 C 130,309.86 142,320.34 150,328.2",
    reperes: [
      { x: 216, y: 305, label: "Royal Mile" },
      { x: 120, y: 294, label: "Grassmarket" },
      { x: 150, y: 328, label: "Musée", dessous: true },
    ],
  },
  {
    jour: 2,
    titre: "Jour 2 · le château et la New Town",
    d: "M 64,278.42 C 74,249.6 100,215.54 150,194.58 C 200,173.62 258,184.1 288,207.68 C 292,211.61 294,215.54 296,218.16",
    reperes: [
      { x: 64, y: 278, label: "Château", dessous: true },
      { x: 150, y: 195, label: "Princes St" },
      { x: 296, y: 218, label: "Calton Hill" },
    ],
  },
  {
    jour: 3,
    titre: "Jour 3 · Dean Village et Stockbridge",
    d: "M 26,118.6 C 40,105.5 58,97.64 78,95.02",
    reperes: [
      { x: 26, y: 119, label: "Dean Village", dessous: true },
      { x: 78, y: 95, label: "Stockbridge" },
    ],
  },
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
    titre: "On part tous les trois.",
    sous: "Toi, moi et Hector, trois jours loin d'ici.",
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
      "Tout se fait à pied, à hauteur de poussette et de pauses café.",
      "Des chaussures confortables : la vieille ville est pavée et en pente.",
      "Le porte-bébé pour les ruelles où la poussette ne passe pas.",
      "Une petite laine : là-bas, le vent vient de la mer.",
      `Et c'est ${DATES}.`,
    ],
    signature: "Joyeux anniversaire maman. — Chloé",
  },
};

// Vidéo : nom du fichier déposé dans docs/. Vide = pas de section.
export const VIDEO = "";
