// Thème Queyras — affiche de montagne, papier chaud et encre brune.
//
// Les noms sont des rôles, pas des couleurs : un thème urbain peut remplir
// `accent` avec du violet bruyère sans que le nom devienne absurde.

export const palette = {
  fond: "#fdf8ec",        // fond principal
  fond2: "#f8f0dd",       // fond des sections paires
  fond3: "#f3e8d0",       // fond des sections d'appui
  encre: "#3a2f26",       // texte et contours francs
  trait: "#7a6a58",       // traits fins du décor
  accent: "#c1440e",      // terracotta, l'accent principal
  accentFonce: "#2f5233", // vert sapin
  accentClair: "#e2b53b", // ocre
  parcouru: "#3f6b40",    // portion de chemin déjà faite

  // Teintes du plan et des commandes, exprimées en composantes pour
  // pouvoir moduler leur transparence.
  planRgb: "43,32,24",
  eauRgb: "70,110,140",
  boutonFond: "rgba(253,251,246,0.85)",
  boutonBord: "rgba(51,48,44,0.35)",
  astuceFond: "rgba(51,48,44,0.8)",

  // Couleurs du feu d'artifice.
  feu: ["#c1440e", "#e2b53b", "#c4551a", "#2f5233", "#e9c39c"],

  // Fond de la section des étapes : papier soutenu et courbes de niveau.
  fondEtapes: `    background-color: #efe3ca;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Cg fill='none' stroke='%23c2ab7e' stroke-width='1.1' opacity='0.55'%3E%3Cpath d='M-10,24 C30,8 74,40 160,18'/%3E%3Cpath d='M-10,52 C34,34 78,68 160,44'/%3E%3Cpath d='M-10,80 C28,64 82,96 160,72'/%3E%3Cpath d='M-10,108 C36,92 76,124 160,100'/%3E%3Cpath d='M-10,136 C30,120 80,150 160,128'/%3E%3C/g%3E%3C/svg%3E");`,
};
