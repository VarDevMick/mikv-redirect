// Les faits du voyage et tous les textes du récit.
//
// C'est Chloé qui parle, à sa mère, en la tutoyant. Ni la voix d'un
// dépliant touristique, ni celle d'un site d'agence.

export const TRIP = {
  celebrant: "Carol",
  age: 60,
  giver: "Chloé",
  baby: { name: "Hector", months: 11 },
  destination: "Édimbourg",
  country: "Écosse",
  dates: "1er → 3 décembre 2026",
  nights: 2,
} as const;

/** Ouverture : fond sombre, un souffle entre chaque phrase. */
export const INTRO = [
  "Carol,",
  "Pour tes 60 ans...",
  "J'avais envie de t'offrir quelque chose qu'on ne peut pas vraiment emballer.",
  "Alors j'ai préparé un petit voyage.",
] as const;

export const SCROLL_HINT = "Fais défiler";

/** Révélation de la destination : le premier moment « waouh ». */
export const REVEAL = {
  buildup: ["Prépare ta valise...", "On part..."],
  destination: TRIP.destination,
  country: `🏴 ${TRIP.country}`,
  dates: TRIP.dates,
} as const;

/** Reims → Paris-Roissy, en voiture. */
export const ROAD = {
  intro: "Première étape...",
  label: "🚗 Reims → Paris-Roissy",
  start: "Reims",
  end: "Paris-Roissy",
  arrival: ["Paris-Roissy", "Bon...", "Maintenant, on décolle."],
} as const;

/** Le vol, puis l'arrivée. */
export const FLIGHT = {
  label: "✈️ Paris-Roissy → Édimbourg",
  arrival: {
    title: "Bienvenue à Édimbourg",
    lines: ["Trois jours.", "Tous ensemble."],
    signature: `${TRIP.giver} + ${TRIP.celebrant} + ${TRIP.baby.name} ❤️`,
  },
  toExploration: ["Maintenant...", "découvrons Édimbourg."],
} as const;

/** Rappel du sens du voyage, glissé entre le jour 1 et le jour 2. */
export const BIRTHDAY_BEAT = {
  lead: "Au fait...",
  title: "Ce voyage est pour toi.",
  line: "Parce que 60 ans, ça mérite quand même un petit détour par l'Écosse.",
} as const;

/** Clôture : résumé, puis fond sombre et dernier mot. */
export const FINAL = {
  summary: [
    { value: "3", label: "jours" },
    { value: "12", label: "découvertes" },
    { value: "1", label: "nouvelle ville" },
  ],
  pivot: "Mais surtout...",
  lines: [
    "Des souvenirs à créer ensemble.",
    "Joyeux 60 ans Maman ❤️",
    "Ce voyage est pour toi.",
  ],
  signature: ["Avec tout mon amour,", TRIP.giver],
  last: "On part à Édimbourg.",
  recap: "Reims → Édimbourg",
} as const;
