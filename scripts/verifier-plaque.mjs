// Vérifie qu'un STL de QR code reste scannable, AVANT de lancer l'impression.
// Copie du vérificateur du skill qr-3d, qui accepte en plus une zone évidée
// rectangulaire (le cartouche de la plaque 60).
//
//   node verifier.mjs <url> [chemin-stl] [chemin-png-sortie]
//
// Deux contrôles :
//   1. rendu des faces supérieures du maillage en image ;
//   2. comparaison module par module contre la matrice théorique.
//
// Le seul résultat acceptable est zéro divergence. Ce contrôle rattrape le
// cas classique où l'arrondi mange les coins des repères d'angle : le code
// paraît parfait à l'œil et ne scanne pas.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { deflateSync } from "node:zlib";
import QRCode from "qrcode";

const STL = process.argv[3] || "qr/plaque-sombre.stl";
const SORTIE = process.argv[4] || "qr/apercu.png";
const GEOMETRIE = "qr/geometrie.json";

// La géométrie exacte vient du générateur. La deviner depuis le maillage
// serait faux : le maillage sombre exclut la marge et la bande de texte.
if (!existsSync(GEOMETRIE)) {
  console.error(`Manquant : ${GEOMETRIE}. Lancer plaque.mjs d'abord.`);
  process.exit(1);
}
const geo = JSON.parse(readFileSync(GEOMETRIE, "utf8"));
const URL_CIBLE = process.argv[2] || geo.url;

// --- lecture du STL binaire ---
const buf = readFileSync(STL);
const nbTriangles = buf.readUInt32LE(80);
const triangles = [];
let zmax = -Infinity;
for (let i = 0; i < nbTriangles; i++) {
  const o = 84 + i * 50 + 12;
  const p = [];
  for (let k = 0; k < 3; k++) {
    p.push([
      buf.readFloatLE(o + k * 12),
      buf.readFloatLE(o + k * 12 + 4),
      buf.readFloatLE(o + k * 12 + 8),
    ]);
  }
  zmax = Math.max(zmax, ...p.map((q) => q[2]));
  triangles.push(p);
}
// Seules les faces du dessus décrivent le motif vu par un lecteur.
const dessus = triangles.filter((t) => t.every((q) => Math.abs(q[2] - zmax) < 1e-4));

// --- cadrage automatique ---
let bx0 = Infinity, bx1 = -Infinity, by0 = Infinity, by1 = -Infinity;
for (const t of triangles) for (const q of t) {
  bx0 = Math.min(bx0, q[0]); bx1 = Math.max(bx1, q[0]);
  by0 = Math.min(by0, q[1]); by1 = Math.max(by1, q[1]);
}
const PAD = 40;
const W = 1400;
const H = Math.round(1400 * (by1 - by0) / (bx1 - bx0));
const s = Math.min((W - 2 * PAD) / (bx1 - bx0), (H - 2 * PAD) / (by1 - by0));
const px = new Uint8Array(W * H).fill(255);

function remplir(t) {
  const pts = t.map((q) => [PAD + (q[0] - bx0) * s, H - PAD - (q[1] - by0) * s]);
  const [a, b, c] = pts;
  const d = (b[1] - c[1]) * (a[0] - c[0]) + (c[0] - b[0]) * (a[1] - c[1]);
  if (Math.abs(d) < 1e-9) return;
  const minY = Math.max(0, Math.floor(Math.min(...pts.map((p) => p[1]))));
  const maxY = Math.min(H - 1, Math.ceil(Math.max(...pts.map((p) => p[1]))));
  const minX = Math.max(0, Math.floor(Math.min(...pts.map((p) => p[0]))));
  const maxX = Math.min(W - 1, Math.ceil(Math.max(...pts.map((p) => p[0]))));
  for (let y = minY; y <= maxY; y++) {
    for (let x = minX; x <= maxX; x++) {
      const w1 = ((b[1] - c[1]) * (x + 0.5 - c[0]) + (c[0] - b[0]) * (y + 0.5 - c[1])) / d;
      const w2 = ((c[1] - a[1]) * (x + 0.5 - c[0]) + (a[0] - c[0]) * (y + 0.5 - c[1])) / d;
      const w3 = 1 - w1 - w2;
      if (w1 >= -0.001 && w2 >= -0.001 && w3 >= -0.001) px[y * W + x] = 0;
    }
  }
}
dessus.forEach(remplir);

// --- écriture PNG en niveaux de gris, sans dépendance ---
function crc(b) {
  let c = ~0;
  for (const v of b) {
    c ^= v;
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function bloc(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const cr = Buffer.alloc(4); cr.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, cr]);
}
const brut = Buffer.alloc((W + 1) * H);
for (let y = 0; y < H; y++) {
  brut[y * (W + 1)] = 0;
  for (let x = 0; x < W; x++) brut[y * (W + 1) + 1 + x] = px[y * W + x];
}
const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 0;
writeFileSync(SORTIE, Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  bloc("IHDR", ihdr),
  bloc("IDAT", deflateSync(brut)),
  bloc("IEND", Buffer.alloc(0)),
]));

// --- comparaison module par module ---
const qr = QRCode.create(URL_CIBLE, { errorCorrectionLevel: "H" });
const taille = qr.modules.size;

const QUIET = geo.quietModules;
const pas = geo.moduleMm;

// La zone centrale est évidée volontairement pour loger un chiffre : elle
// diverge de la matrice par construction, et c'est la correction d'erreur
// qui la reconstitue. On l'exclut donc du contrôle.
const demiCentre = geo.centreModules ? (geo.centreModules - 1) / 2 : -1;
const milieu = (taille - 1) / 2;
// Une zone évidée rectangulaire (geo.evide, en modules) s'exclut de même.
const ev = geo.evide;
const estCentre = (x, y) =>
  (demiCentre >= 0 && Math.abs(x - milieu) <= demiCentre && Math.abs(y - milieu) <= demiCentre) ||
  (ev && x >= ev.x0 && x <= ev.x1 && y >= ev.y0 && y <= ev.y1);

let evides = 0;
let divergents = 0;
const details = [];
for (let y = 0; y < taille; y++) {
  for (let x = 0; x < taille; x++) {
    // Repère de la plaque : origine en bas à gauche, QR posé au-dessus
    // de la bande de texte.
    const mx = (x + QUIET) * pas + pas / 2;
    const my = geo.bandeTexteMm + (taille + QUIET - 1 - y) * pas + pas / 2;
    const ix = Math.round(PAD + (mx - bx0) * s);
    const iy = Math.round(H - PAD - (my - by0) * s);
    if (ix < 0 || ix >= W || iy < 0 || iy >= H) continue;
    if (estCentre(x, y)) { evides++; continue; }
    const sombre = px[iy * W + ix] < 128;
    const attendu = qr.modules.data[y * taille + x] === 1;
    if (sombre !== attendu) {
      divergents++;
      if (details.length < 12) details.push(`(${x},${y}) attendu=${attendu} lu=${sombre}`);
    }
  }
}

console.log(`Vérification de ${STL}`);
console.log(`  Matrice   : ${taille} x ${taille} modules (niveau H)`);
console.log(`  Aperçu    : ${SORTIE}`);
console.log(`  Divergents: ${divergents} / ${taille * taille - evides}`);
if (evides) {
  const part = ((evides / (taille * taille)) * 100).toFixed(1);
  console.log(`  Centre    : ${evides} modules évidés (${part} % — le niveau H en reconstitue 30 %)`);
}
if (divergents) {
  console.log("\n  ÉCHEC — ne pas imprimer. Premiers écarts :");
  details.forEach((d) => console.log("   " + d));
  console.log("\n  Cause la plus fréquente : arrondi trop large sur les repères d'angle.");
  process.exit(1);
}
console.log("\n  OK — la géométrie correspond exactement à la matrice.");
console.log("  Sur macOS, confirmer avec le décodeur d'Apple :");
console.log(`    swiftc -O scripts/scan.swift -o /tmp/scan && /tmp/scan ${SORTIE}`);
