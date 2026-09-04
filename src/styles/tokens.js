// F-06 · Jetons de style. La palette vient du thème, pas d'ici : c'est ce
// qui permet à une même page de servir la montagne ou la ville.

export const css = (palette) => `
  :root {
    --fond: ${palette.fond};
    --fond-2: ${palette.fond2};
    --fond-3: ${palette.fond3};
    --encre: ${palette.encre};
    --trait: ${palette.trait};
    --accent: ${palette.accent};
    --accent-fonce: ${palette.accentFonce};
    --accent-clair: ${palette.accentClair};
    --parcouru: ${palette.parcouru};
  }
  * { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: Georgia, "Times New Roman", serif;
    color: var(--encre);
    background: var(--fond);
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
