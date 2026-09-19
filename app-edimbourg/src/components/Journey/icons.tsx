// Véhicules du voyage : vus du dessus, dessinés au trait, pointés vers le
// haut. C'est la rotation appliquée au conteneur qui leur donne leur cap.

export function CarIcon() {
  return (
    <svg width="26" height="42" viewBox="0 0 26 42" aria-hidden="true">
      <ellipse cx="13" cy="21" rx="12" ry="18" fill="#d4a94a" opacity="0.14" />
      <path
        d="M13 3c4.1 0 6.9 3 7.2 7.7l.5 11.5c.3 5.9-.5 10.7-2 14-.9 1.9-2.6 3-5.7 3s-4.8-1.1-5.7-3c-1.5-3.3-2.3-8.1-2-14l.5-11.5C6.1 6 8.9 3 13 3z"
        fill="#d4a94a"
      />
      <path
        d="M8.7 12.4c2.8-.9 5.8-.9 8.6 0l.6 3.9c-3.2-1-6.6-1-9.8 0z"
        fill="#0b1826"
        opacity="0.6"
      />
    </svg>
  );
}
