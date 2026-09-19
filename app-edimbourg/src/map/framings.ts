// Cadrages et voiles partagés par plusieurs scènes.
//
// Le vol se termine exactement là où la révélation commence : les deux
// scènes doivent viser le même point et porter le même voile, sinon la carte
// sauterait entre elles.

/** L'Écosse entière, le voyage arrivant par le sud. */
export const ECOSSE = { lat: 56.4, lng: -4.1, km: 540 };

/** Pénombre posée sur le pays pendant le vol, de 0 à 1. */
export const VOILE_VOL = 0.78;

/**
 * Pénombre qui reste à l'arrivée : l'Écosse se dessine sous l'avion, avec
 * le voyage tracé derrière, mais ses noms de villes ne se lisent pas encore.
 * Le jour ne se lève tout à fait qu'une fois la ville nommée.
 */
export const VOILE_ARRIVEE = 0.42;
