import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "node:fs";

const URL_CIBLE = "https://mikv.io/30";

// Paramètres d'impression 3D (millimètres).
const MODULE_MM = 2.5;   // taille d'un carré du QR
const QUIET_MODULES = 4; // marge blanche obligatoire autour du QR
const BASE_MM = 2;       // épaisseur de la plaque
const RELIEF_MM = 1.5;   // hauteur des modules en relief

const qr = QRCode.create(URL_CIBLE, { errorCorrectionLevel: "H" });
const size = qr.modules.size;
const data = qr.modules.data;
const isDark = (x, y) => data[y * size + x] === 1;

mkdirSync("qr", { recursive: true });

// --- SVG (référence visuelle / découpe) ---
const svgSize = size + QUIET_MODULES * 2;
let rects = "";
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    if (isDark(x, y)) {
      rects += `<rect x="${x + QUIET_MODULES}" y="${y + QUIET_MODULES}" width="1" height="1"/>`;
    }
  }
}
writeFileSync(
  "qr/qr-mikv-30.svg",
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgSize} ${svgSize}" shape-rendering="crispEdges">` +
    `<rect width="${svgSize}" height="${svgSize}" fill="#fff"/><g fill="#000">${rects}</g></svg>\n`
);

// --- OpenSCAD (impression 3D) ---
const plateMM = svgSize * MODULE_MM;
let cubes = "";
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    if (isDark(x, y)) {
      const px = ((x + QUIET_MODULES) * MODULE_MM).toFixed(2);
      // Y inversé : l'origine OpenSCAD est en bas à gauche, celle du QR en haut à gauche.
      const py = ((svgSize - 1 - y - QUIET_MODULES) * MODULE_MM).toFixed(2);
      cubes += `  translate([${px}, ${py}, ${BASE_MM}]) cube([${MODULE_MM}, ${MODULE_MM}, ${RELIEF_MM}]);\n`;
    }
  }
}
writeFileSync(
  "qr/qr-mikv-30.scad",
  `// QR code vers ${URL_CIBLE}\n` +
    `// Plaque ${plateMM.toFixed(1)} x ${plateMM.toFixed(1)} mm, relief ${RELIEF_MM} mm sur base ${BASE_MM} mm.\n` +
    `// Ouvrir dans OpenSCAD, F6 pour rendre, F7 pour exporter en STL.\n\n` +
    `cube([${plateMM.toFixed(2)}, ${plateMM.toFixed(2)}, ${BASE_MM}]);\n\n` +
    cubes
);

// --- PNG (impression papier / vérification) ---
await QRCode.toFile("qr/qr-mikv-30.png", URL_CIBLE, {
  errorCorrectionLevel: "H",
  margin: QUIET_MODULES,
  width: 800,
});

console.log(`QR généré pour ${URL_CIBLE}`);
console.log(`  Matrice : ${size} x ${size} modules (niveau de correction H)`);
console.log(`  Plaque  : ${plateMM.toFixed(1)} x ${plateMM.toFixed(1)} mm`);
console.log(`  Fichiers : qr/qr-mikv-30.svg, qr/qr-mikv-30.scad`);
