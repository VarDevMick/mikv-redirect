// Exporte les pages en fichiers statiques pour GitHub Pages (dossier docs/).
//   docs/30/index.html -> https://mikv.io/30  (gelée, visée par le QR imprimé)
//   docs/31/index.html -> https://mikv.io/31  (page de travail)
import { PAGE_30_HTML } from "../src/page-30.js";
import { PAGE_31_HTML } from "../src/pages/page-31.js";
import { PAGE_60_HTML } from "../src/pages/page-60.js";
import { writeFileSync, mkdirSync, copyFileSync } from "node:fs";

const DOMAINE = "mikv.io";

mkdirSync("docs/30", { recursive: true });
writeFileSync("docs/30/index.html", PAGE_30_HTML);

mkdirSync("docs/31", { recursive: true });
writeFileSync("docs/31/index.html", PAGE_31_HTML);

mkdirSync("docs/60", { recursive: true });
writeFileSync("docs/60/index.html", PAGE_60_HTML);
// Même fond de plan OpenStreetMap que /61.
copyFileSync("src/assets/edimbourg/plan-fond.png", "docs/60/plan-fond.png");

// docs/61 n'est plus écrit ici : la page de travail est devenue une
// application à part entière (app-edimbourg/, React + Leaflet), que Vite
// construit directement dans docs/61. Voir `npm run build:61`.

// Indique à GitHub Pages le domaine personnalisé à servir.
writeFileSync("docs/CNAME", `${DOMAINE}\n`);

// Page d'accueil neutre : évite un 404 brut si quelqu'un ouvre la racine,
// sans rien dévoiler de la surprise.
writeFileSync(
  "docs/index.html",
  `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>mikv.io</title>
<style>
  body {
    margin: 0;
    min-height: 100svh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1b2a41;
    color: #f4ecd8;
    font-family: Georgia, serif;
    letter-spacing: 0.2em;
  }
</style>
</head>
<body>mikv.io</body>
</html>
`
);

console.log("Export statique :");
console.log("  docs/30/index.html  ->  https://mikv.io/30  (gelée)");
console.log("  docs/31/index.html  ->  https://mikv.io/31  (travail)");
console.log("  docs/60/index.html  ->  https://mikv.io/60  (Carol)");
console.log("  docs/index.html     ->  https://mikv.io");
console.log(`  docs/CNAME          ->  ${DOMAINE}`);
