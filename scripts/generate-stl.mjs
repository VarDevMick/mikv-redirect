import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "node:fs";

const URL_CIBLE = "https://mikv.io/30";

// Paramètres d'impression (millimètres).
const MODULE_MM = 2.5;   // côté d'un carré du QR
const QUIET_MODULES = 4; // marge obligatoire autour du code
const BASE_MM = 2;       // épaisseur de la plaque
const RELIEF_MM = 1.5;   // hauteur des carrés en relief

const qr = QRCode.create(URL_CIBLE, { errorCorrectionLevel: "H" });
const size = qr.modules.size;
const data = qr.modules.data;
const isDark = (x, y) => data[y * size + x] === 1;

const grid = size + QUIET_MODULES * 2;
const plate = grid * MODULE_MM;

// Un pavé droit = 12 triangles.
function box(x0, y0, z0, dx, dy, dz) {
  const x1 = x0 + dx, y1 = y0 + dy, z1 = z0 + dz;
  const v = [
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
    [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
  ];
  const faces = [
    [0, 3, 2], [0, 2, 1], // dessous
    [4, 5, 6], [4, 6, 7], // dessus
    [0, 1, 5], [0, 5, 4],
    [1, 2, 6], [1, 6, 5],
    [2, 3, 7], [2, 7, 6],
    [3, 0, 4], [3, 4, 7],
  ];
  return faces.map((f) => [v[f[0]], v[f[1]], v[f[2]]]);
}

function writeSTL(path, triangles) {
  const buf = Buffer.alloc(84 + triangles.length * 50);
  buf.write("QR mikv.io/30 - genere par scripts/generate-stl.mjs", 0);
  buf.writeUInt32LE(triangles.length, 80);
  let o = 84;
  for (const t of triangles) {
    // Normale laissée à zéro : les slicers la recalculent.
    buf.writeFloatLE(0, o); buf.writeFloatLE(0, o + 4); buf.writeFloatLE(0, o + 8);
    o += 12;
    for (const p of t) {
      buf.writeFloatLE(p[0], o); buf.writeFloatLE(p[1], o + 4); buf.writeFloatLE(p[2], o + 8);
      o += 12;
    }
    buf.writeUInt16LE(0, o);
    o += 2;
  }
  writeFileSync(path, buf);
  return triangles.length;
}

mkdirSync("qr", { recursive: true });

const baseTris = box(0, 0, 0, plate, plate, BASE_MM);

const moduleTris = [];
for (let y = 0; y < size; y++) {
  for (let x = 0; x < size; x++) {
    if (!isDark(x, y)) continue;
    const px = (x + QUIET_MODULES) * MODULE_MM;
    // Y inversé : origine en bas à gauche côté STL, en haut à gauche côté QR.
    const py = (grid - 1 - y - QUIET_MODULES) * MODULE_MM;
    moduleTris.push(...box(px, py, BASE_MM, MODULE_MM, MODULE_MM, RELIEF_MM));
  }
}

writeSTL("qr/qr-30-complet.stl", [...baseTris, ...moduleTris]);
writeSTL("qr/qr-30-plaque.stl", baseTris);
writeSTL("qr/qr-30-motif.stl", moduleTris);

console.log(`QR 3D pour ${URL_CIBLE}`);
console.log(`  Plaque : ${plate.toFixed(1)} x ${plate.toFixed(1)} x ${BASE_MM} mm`);
console.log(`  Relief : ${RELIEF_MM} mm (${moduleTris.length / 12} carrés)`);
console.log(`  Fichiers : qr-30-complet.stl (une seule couleur)`);
console.log(`             qr-30-plaque.stl + qr-30-motif.stl (deux couleurs)`);
