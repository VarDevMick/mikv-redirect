// F-06 · Palette et typographie. Point de changement unique des couleurs.
export const css = `
  :root {
    /* Palette chaude d'affiche, posée sur un dessin au trait. */
    --papier: #fdf8ec;
    --papier2: #f8f0dd;
    --papier3: #f3e8d0;
    --encre: #3a2f26;
    --trait: #7a6a58;
    --soleil: #c1440e;
    --sapin: #2f5233;
    --sapin2: #3f6b40;
    --sauge: #6f8a5c;
    --alpage: #d8c68a;
    --roche: #c9bda6;
    --bois: #6b4a2f;
    --mustard: #e2b53b;
  }
  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    color: var(--encre);
    background: var(--papier);
  }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 0.7rem;
    opacity: 0.75;
    margin-bottom: 0.9rem;
  }
  h1 {
    font-size: 1.9rem;
    line-height: 1.3;
    margin: 0 0 0.6rem;
    font-weight: 700;
  }
  h2 {
    font-size: 1.5rem;
    margin: 0 0 0.8rem;
    font-weight: 700;
  }
  p { font-size: 1.02rem; line-height: 1.55; margin: 0.4rem 0; opacity: 0.9; }
`;
