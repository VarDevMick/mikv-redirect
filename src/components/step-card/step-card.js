// F-09 · Fond propre aux étapes · F-10 · Carte en photo pleine
//
// Le contenu vient de `src/data/`, jamais d'ici.

// Une étape = un seul bloc. La photo remplit la carte, un voile dégradé
// garantit la lisibilité du texte quelle que soit l'image.
export const carte = (etape, index) => `
    <div class="route-step" data-idx="${index + 1}">
      <div class="day-card">
        <img class="carte-fond" src="${etape.photo}" alt="${etape.trajet}" loading="lazy">
        <div class="carte-voile"></div>
        <div class="carte-corps">
          <div class="day-num">${etape.jour}</div>
          <div class="day-route">${etape.trajet}</div>
          <p class="day-note">${etape.note}</p>
          <div class="stats">
            <div class="stat"><b>${etape.marche}</b><span>Marche</span></div>
            <div class="stat"><b>${etape.montee}</b><span>D+</span></div>
            <div class="stat"><b>${etape.descente}</b><span>D-</span></div>
          </div>
        </div>
      </div>
    </div>`;

export const html = (etapes) => etapes.map(carte).join("\n");

export const css = `
  .route-step {
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem 1.5rem 3rem 74px;
  }

  .day-card {
    position: relative;
    background: var(--fond);
    /* Coins biseautés plutôt qu'un filet : la carte est taillée, pas cerclée. */
    clip-path: polygon(0 16px, 16px 0, 100% 0, 100% calc(100% - 16px),
                       calc(100% - 16px) 100%, 0 100%);
    padding: 0;
    max-width: 340px;
    width: 100%;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end; /* le texte se cale en bas de l'image */
    overflow: hidden;
    box-shadow: 0 14px 30px rgba(51,48,44,0.24);
  }
  .carte-fond {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 45%;
    display: block;
  }
  .carte-voile {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg,
      rgba(45,36,28,0.05) 0%,
      rgba(45,36,28,0.35) 42%,
      rgba(45,36,28,0.74) 68%,
      rgba(45,36,28,0.9) 100%);
  }
  .carte-corps {
    position: relative;
    z-index: 1;
    padding: 1.2rem 1.4rem 1.5rem;
    color: #fdf8ec;
    text-shadow: 0 1px 3px rgba(0,0,0,0.45);
  }
  .day-num {
    font-size: 0.78rem;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    opacity: 0.9;
    margin-bottom: 0.35rem;
  }
  .day-route {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
  }
  .day-note {
    font-size: 0.9rem;
    font-style: italic;
    opacity: 0.92;
    margin: 0 0 0.6rem;
  }
  .stats {
    display: flex;
    justify-content: center;
    gap: 1.3rem;
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }
  .stat { text-align: center; }
  .stat b { display: block; font-size: 1.1rem; }
  .stat span { font-size: 0.7rem; opacity: 0.85; text-transform: uppercase; letter-spacing: 0.05em; }
`;
