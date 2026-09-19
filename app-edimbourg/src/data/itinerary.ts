// Le programme : trois journées, quatre étapes chacune.
//
// Ce ne sont pas des horaires. Hector a 11 mois et voyage en poussette :
// chaque journée est une suite de grands moments, avec de la place pour les
// pauses, les repas et le froid de décembre.
//
// Coordonnées : Nominatim (OpenStreetMap), relevées le 2026-09-19.

export interface Activity {
  id: string;
  title: string;
  description: string;
  /** Moment de la journée, jamais une heure précise. */
  time?: string;
  lat: number;
  lng: number;
  /** Petite phrase qui apparaît à l'étape. Rare, par choix. */
  aside?: string;
  /** Vrai quand la poussette passe partout sans effort. */
  babyFriendly?: boolean;
  /** Repli prévu si la météo ou la poussette rendent l'étape pénible. */
  fallback?: string;
  /** Lieu encore à choisir : à remplacer avant de figer /60. */
  toDecide?: boolean;
}

export interface Day {
  id: string;
  date: string;
  title: string;
  subtitle: string;
  activities: Activity[];
}

export const DAYS: Day[] = [
  {
    id: "jour-1",
    date: "1er décembre",
    title: "Premiers pas à Édimbourg",
    subtitle: "On découvre la ville tranquillement.",
    activities: [
      {
        id: "castle",
        title: "Edinburgh Castle",
        description:
          "Il est posé sur son rocher, au-dessus de tout. On commence par là, parce que de là-haut on comprend la ville d'un seul regard.",
        time: "Matin",
        lat: 55.94869,
        lng: -3.20042,
        aside: "Une navette gratuite monte jusqu'en haut 👶",
        babyFriendly: true,
      },
      {
        id: "royal-mile",
        title: "Royal Mile",
        description:
          "La grande rue pavée qui descend du château. On la prend sans se presser, en s'arrêtant à chaque ruelle qui donne envie.",
        time: "Midi",
        lat: 55.94929,
        lng: -3.19357,
        aside: "Ça secoue un peu la poussette, mais ça vaut le coup.",
      },
      {
        id: "victoria-street",
        title: "Victoria Street",
        description:
          "La rue courbe aux façades de toutes les couleurs. C'est le genre d'endroit qu'on photographie sans même y penser.",
        time: "Après-midi",
        lat: 55.94865,
        lng: -3.19377,
      },
      {
        id: "grassmarket",
        title: "Grassmarket",
        description:
          "La place au pied du château, avec ses cafés et ses pubs. On s'assoit, on regarde le rocher, et on ne fait rien de plus.",
        time: "Fin de journée",
        lat: 55.94748,
        lng: -3.19625,
        aside: "Pause café obligatoire ☕",
        babyFriendly: true,
      },
    ],
  },
  {
    id: "jour-2",
    date: "2 décembre",
    title: "Édimbourg en hiver",
    subtitle: "Aujourd'hui, on profite de l'ambiance de décembre.",
    activities: [
      {
        id: "princes-gardens",
        title: "Princes Street Gardens",
        description:
          "Les jardins en contrebas du château, plats et larges. En décembre, la ville s'y installe pour l'hiver.",
        time: "Matin",
        lat: 55.95025,
        lng: -3.19949,
        babyFriendly: true,
      },
      {
        id: "christmas-market",
        title: "Marché de Noël",
        description:
          "Chalets, grande roue, vin chaud, et le château illuminé au-dessus. Difficile de trouver plus écossais en décembre.",
        time: "Midi",
        lat: 55.9514,
        lng: -3.19464,
        aside: "Hector valide.",
        babyFriendly: true,
      },
      {
        id: "national-museum",
        title: "National Museum of Scotland",
        description:
          "Gratuit, immense et chauffé. Des ascenseurs partout, de la place pour courir, et un toit-terrasse avec vue sur la ville.",
        time: "Après-midi",
        lat: 55.94707,
        lng: -3.18934,
        aside: "Il fait froid ? On rentre se réchauffer.",
        babyFriendly: true,
      },
      {
        id: "calton-hill",
        title: "Calton Hill",
        description:
          "La colline aux colonnes, juste au bout de la ville. En décembre, le soleil se couche tôt : le panorama s'allume vers seize heures.",
        time: "Coucher du soleil",
        lat: 55.95525,
        lng: -3.1828,
        fallback:
          "S'il pleut ou si la montée est pénible avec la poussette : St Andrew Square et ses lumières, à plat.",
      },
    ],
  },
  {
    id: "jour-3",
    date: "3 décembre",
    title: "Une dernière journée",
    subtitle: "Avant de reprendre l'avion...",
    activities: [
      {
        id: "britannia",
        title: "Royal Yacht Britannia",
        description:
          "Le yacht royal, amarré à Leith. On visite au chaud, à son rythme, et il y a un salon de thé à bord.",
        time: "Matin",
        lat: 55.98215,
        lng: -3.17731,
        babyFriendly: true,
      },
      {
        id: "dean-village",
        title: "Dean Village",
        description:
          "Un ancien hameau de meuniers resté au bord de l'eau, en pleine ville. Maisons de grès, silence, et le bruit de la rivière.",
        time: "Midi",
        lat: 55.95226,
        lng: -3.21822,
      },
      {
        id: "stockbridge",
        title: "Stockbridge",
        description:
          "Le quartier d'à côté, ses boutiques et ses cafés. On remonte le long du Water of Leith : plat, abrité, facile.",
        time: "Après-midi",
        lat: 55.95797,
        lng: -3.20934,
        aside: "On continue ?",
        babyFriendly: true,
      },
      {
        id: "dernier-moment",
        title: "Un dernier moment ensemble",
        description:
          "Une table quelque part, tous les trois, avant de rentrer. Le lieu reste à choisir — c'est bien la seule chose que je n'ai pas réservée.",
        time: "Le soir",
        lat: 55.95797,
        lng: -3.20934,
        toDecide: true,
      },
    ],
  },
];

export const ACTIVITY_COUNT = DAYS.reduce(
  (total, day) => total + day.activities.length,
  0
);
