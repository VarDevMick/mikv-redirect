// F-19 · Mise en page des sections et comportement du défilement.
export const css = `
  /* Le défilement appartient au document : sinon window.scrollY reste à 0
     et rien de ce qui suit le scroll ne fonctionne. */
  html {
    scroll-snap-type: y proximity;
    scrollbar-width: none;        /* Firefox */
    -ms-overflow-style: none;     /* anciens Edge */
  }
  html::-webkit-scrollbar,
  body::-webkit-scrollbar { width: 0; height: 0; display: none; }

  .panel {
    min-height: 100svh;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 3rem 1.5rem 4.5rem 74px; /* dégage la place du sentier */
    position: relative;
    overflow: hidden;
  }
  .p1 { background: var(--fond); }
  .p2 { background: var(--fond-2); }
  .p3 { background: var(--fond-3); }
  .p7 { background: var(--fond-2); }
`;
