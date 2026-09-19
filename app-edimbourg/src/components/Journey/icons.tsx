// Véhicules du voyage : vus du dessus, dessinés au trait, pointés vers le
// haut. C'est la rotation appliquée au conteneur qui leur donne leur cap.

export function PlaneIcon() {
  return (
    <svg width="30" height="34" viewBox="0 0 30 34" aria-hidden="true">
      <ellipse cx="15" cy="17" rx="13" ry="15" fill="#d4a94a" opacity="0.12" />
      <path
        d="M15 1c1.4 0 2.3 1.9 2.5 5.3l.1 3.4 10.6 6.6c.5.3.8.9.8 1.5v2.3l-11.3-3.4.2 6.4 3.4 2.6c.3.3.5.7.5 1.1v1.9L15 28.8 8.2 30.7v-1.9c0-.4.2-.8.5-1.1l3.4-2.6.2-6.4L1 22.1v-2.3c0-.6.3-1.2.8-1.5l10.6-6.6.1-3.4C12.7 2.9 13.6 1 15 1z"
        fill="#d4a94a"
      />
    </svg>
  );
}

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
