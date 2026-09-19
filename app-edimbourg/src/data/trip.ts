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

/**
 * Ouverture : fond sombre, un souffle entre chaque phrase.
 *
 * Chloé ne dit jamais « Carol » : elle parle à sa mère. Le prénom n'existe
 * que dans les données, pour savoir de qui l'on parle.
 */
export const INTRO = [
  "Maman,",
  "Pour tes 60 ans...",
  "J'avais envie de t'offrir quelque chose qu'on ne peut pas vraiment emballer.",
  "Alors j'ai préparé un petit voyage.",
] as const;

export const SCROLL_HINT = "Fais défiler";

/**
 * Montée d'attente, avant le départ. Rien n'est nommé : la destination
 * reste secrète pendant tout le trajet.
 */
export const BUILDUP = ["Prépare ta valise...", "On part..."] as const;

/**
 * Révélation, à l'atterrissage seulement.
 *
 * Carol voit d'abord le pays se dessiner sous l'avion, le voyage entier
 * tracé derrière — et c'est là que la ville prend enfin son nom. Le
 * « waouh » est à l'arrivée, pas au départ.
 */
export const REVEAL = {
  destination: TRIP.destination,
  country: `🏴 ${TRIP.country}`,
  dates: TRIP.dates,
  lines: ["Trois jours.", "Tous ensemble."],
  signature: `Toi, moi et ${TRIP.baby.name} ❤️`,
} as const;

/** Reims → Paris-Roissy, en voiture. */
export const ROAD = {
  intro: "Première étape...",
  label: "🚗 Reims → Paris-Roissy",
  start: "Reims",
  end: "Paris-Roissy",
  arrival: ["Paris-Roissy", "Bon...", "Maintenant, on décolle."],
} as const;

/**
 * Le vol. Aucun de ces textes ne nomme la destination — ni l'étiquette, ni
 * les phrases : tout le suspense du site tient à ce silence.
 */
export const FLIGHT = {
  label: "✈️ Cap au nord",
  beats: ["On décolle.", "Encore un peu de patience...", "On descend."],
  toExploration: ["Maintenant...", "découvrons Édimbourg."],
} as const;

/**
 * Clôture : résumé, puis fond sombre et dernier mot.
 *
 * Le site s'arrête sur la signature de Chloé, et sur rien d'autre : après
 * « Joyeux anniversaire Maman », plus une ligne.
 */
export const FINAL = {
  summary: [
    { value: "3", label: "jours" },
    { value: "12", label: "découvertes" },
    { value: "1", label: "nouvelle ville" },
  ],
  pivot: "Mais surtout...",
  lines: ["Des souvenirs à créer ensemble.", "Ce voyage est pour toi."],
  signature: "Avec tout mon amour,",
  voeu: "Joyeux anniversaire Maman ❤️",
} as const;
