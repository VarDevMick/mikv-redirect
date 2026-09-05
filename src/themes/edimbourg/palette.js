// Thème Édimbourg — bleu nuit, pierre froide, ambre des fenêtres.
//
// Fin novembre, le jour tombe vers 15 h 40 : la ville se vit éclairée. Les
// fonds sont donc des bleus de nuit, l'encre devient claire, et la seule
// chaleur vient de l'ambre — fenêtres allumées, lampadaires, whisky. La
// bruyère apporte le second accent, éclaircie pour rester lisible sur nuit.

export const palette = {
  fond: "#101a2e",        // bleu nuit profond
  fond2: "#16233c",       // nuit un ton au-dessus
  fond3: "#1b2a48",       // nuit des sections d'appui
  encre: "#e9e7e0",       // texte clair, la nuit inverse le contraste
  trait: "#8b97ad",       // traits du décor, gris bleuté
  accent: "#e0913f",      // ambre, l'accent principal
  accentFonce: "#b083c9", // bruyère éclaircie
  accentClair: "#e8b866", // ambre clair
  parcouru: "#e0913f",    // le chemin déjà fait s'allume

  // Teintes du plan et des commandes.
  planRgb: "233,231,224", // traits clairs sur fond sombre
  eauRgb: "126,168,206",
  boutonFond: "rgba(22,35,60,0.85)",
  boutonBord: "rgba(233,231,224,0.35)",
  astuceFond: "rgba(233,231,224,0.88)",

  // Feu d'artifice au-dessus du château : c'est la ville du Hogmanay.
  feu: ["#e0913f", "#e8b866", "#b083c9", "#8fc4e8", "#f4e6cd"],

  // Fond de la section des étapes : nuit et trame de rues.
  fondEtapes: `    background-color: #13203a;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Cg fill='none' stroke='%23e9e7e0' stroke-width='1' opacity='0.09'%3E%3Cpath d='M-10,30 L170,42'/%3E%3Cpath d='M-10,72 L170,84'/%3E%3Cpath d='M-10,114 L170,126'/%3E%3Cpath d='M28,-10 L36,170'/%3E%3Cpath d='M84,-10 L92,170'/%3E%3Cpath d='M136,-10 L144,170'/%3E%3C/g%3E%3C/svg%3E");`,
};
