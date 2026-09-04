// Génère la plaque QR + texte, en 2 STL (blanc / noir) pour impression bicolore.
import QRCode from "qrcode";
import opentype from "opentype.js";
import earcut from "earcut";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const URL_CIBLE = "https://mikv.io/30";
// Textes, modifiables en argument :
//   node scripts/generate-plaque.mjs "<texte du bas>" "<chiffre au centre>"
// Mettre "" pour en supprimer un.
const TEXTE = process.argv[2] ?? "Joyeux anniversaire !";
const CENTRE_TEXTE = process.argv[3] ?? "30";
const CENTRE_MODULES = 11; // taille de la zone évidée au centre (en modules)
const POLICE = "/System/Library/Fonts/Supplemental/Arial Bold.ttf";

// Dimensions (mm)
// 4e argument : taille d'un module en mm, c'est lui qui règle la taille finale.
//   2.5 -> plaque de 92 mm | 3 -> 111 mm | 3.5 -> 130 mm | 4 -> 148 mm
const MODULE_MM = Number(process.argv[4] || 3);
const QUIET_MODULES = 4;  // marge blanche autour du QR (obligatoire)
const BASE_MM = 2.4;      // épaisseur de la plaque blanche
const RELIEF_MM = 0.8;    // hauteur du noir (4 couches en 0.2 mm)
// Les proportions (bande de texte, arrondi...) suivent la largeur : voir plus bas.

// ---------- géométrie ----------
function box(x0, y0, z0, dx, dy, dz) {
  const x1 = x0 + dx, y1 = y0 + dy, z1 = z0 + dz;
  const v = [
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
    [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
  ];
  const f = [
    [0, 3, 2], [0, 2, 1], [4, 5, 6], [4, 6, 7],
    [0, 1, 5], [0, 5, 4], [1, 2, 6], [1, 6, 5],
    [2, 3, 7], [2, 7, 6], [3, 0, 4], [3, 4, 7],
  ];
  return f.map((t) => [v[t[0]], v[t[1]], v[t[2]]]);
}

function writeSTL(path, triangles, titre) {
  const buf = Buffer.alloc(84 + triangles.length * 50);
  buf.write(titre.slice(0, 79), 0);
  buf.writeUInt32LE(triangles.length, 80);
  let o = 84;
  for (const t of triangles) {
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
}

// ---------- texte : contours de police -> triangles extrudés ----------
const SEGMENTS = 10; // subdivisions par courbe de Bézier

function flattenGlyphPath(path) {
  const contours = [];
  let cur = null, px = 0, py = 0, sx = 0, sy = 0;
  const pt = (x, y) => cur.push([x, -y]); // repère écran -> repère modèle

  for (const c of path.commands) {
    if (c.type === "M") {
      if (cur && cur.length > 2) contours.push(cur);
      cur = [];
      pt(c.x, c.y); px = sx = c.x; py = sy = c.y;
    } else if (c.type === "L") {
      pt(c.x, c.y); px = c.x; py = c.y;
    } else if (c.type === "C") {
      for (let i = 1; i <= SEGMENTS; i++) {
        const t = i / SEGMENTS, u = 1 - t;
        pt(
          u * u * u * px + 3 * u * u * t * c.x1 + 3 * u * t * t * c.x2 + t * t * t * c.x,
          u * u * u * py + 3 * u * u * t * c.y1 + 3 * u * t * t * c.y2 + t * t * t * c.y
        );
      }
      px = c.x; py = c.y;
    } else if (c.type === "Q") {
      for (let i = 1; i <= SEGMENTS; i++) {
        const t = i / SEGMENTS, u = 1 - t;
        pt(
          u * u * px + 2 * u * t * c.x1 + t * t * c.x,
          u * u * py + 2 * u * t * c.y1 + t * t * c.y
        );
      }
      px = c.x; py = c.y;
    } else if (c.type === "Z") {
      if (cur && cur.length > 2) contours.push(cur);
      cur = null; px = sx; py = sy;
    }
  }
  if (cur && cur.length > 2) contours.push(cur);
  return contours;
}

const aire = (c) => {
  let a = 0;
  for (let i = 0, j = c.length - 1; i < c.length; j = i++) {
    a += (c[j][0] + c[i][0]) * (c[j][1] - c[i][1]);
  }
  return a / 2;
};

// Découpe les contours en groupes {exterieur, trous} : le plus grand contour
// englobe les suivants (vrai pour les lettres latines : o, e, a, 0...).
function grouperContours(contours) {
  const tries = [...contours].sort((a, b) => Math.abs(aire(b)) - Math.abs(aire(a)));
  const groupes = [];
  for (const c of tries) {
    const parent = groupes.find((g) => pointDans(c[0], g.exterieur));
    if (parent) parent.trous.push(c);
    else groupes.push({ exterieur: c, trous: [] });
  }
  return groupes;
}

function pointDans(p, poly) {
  let dedans = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) {
      dedans = !dedans;
    }
  }
  return dedans;
}

function extruderGroupe(groupe, z0, z1, decalage) {
  const tris = [];
  const anneaux = [groupe.exterieur, ...groupe.trous];
  const plat = [];
  const trousIdx = [];
  for (const a of anneaux) {
    if (plat.length) trousIdx.push(plat.length / 2);
    for (const p of a) plat.push(p[0] + decalage.x, p[1] + decalage.y);
  }
  const idx = earcut(plat, trousIdx, 2);
  const som = (i) => [plat[i * 2], plat[i * 2 + 1]];
  for (let i = 0; i < idx.length; i += 3) {
    const [a, b, c] = [som(idx[i]), som(idx[i + 1]), som(idx[i + 2])];
    tris.push([[a[0], a[1], z1], [b[0], b[1], z1], [c[0], c[1], z1]]);       // dessus
    tris.push([[c[0], c[1], z0], [b[0], b[1], z0], [a[0], a[1], z0]]);       // dessous
  }
  // parois latérales
  for (const a of anneaux) {
    for (let i = 0; i < a.length; i++) {
      const p = a[i], q = a[(i + 1) % a.length];
      const P = [p[0] + decalage.x, p[1] + decalage.y];
      const Q = [q[0] + decalage.x, q[1] + decalage.y];
      tris.push([[P[0], P[1], z0], [Q[0], Q[1], z0], [Q[0], Q[1], z1]]);
      tris.push([[P[0], P[1], z0], [Q[0], Q[1], z1], [P[0], P[1], z1]]);
    }
  }
  return tris;
}

// ---------- assemblage ----------
const qr = QRCode.create(URL_CIBLE, { errorCorrectionLevel: "H" });
const size = qr.modules.size;
const dark = (x, y) => qr.modules.data[y * size + x] === 1;

const grille = size + QUIET_MODULES * 2;
const largeur = grille * MODULE_MM;

// Proportions calées sur la largeur, pour que tout grandisse ensemble.
const BANDE_TEXTE_MM = TEXTE ? 0.24 * largeur : 0;
const HAUTEUR_TEXTE_MM = 0.10 * largeur;  // hauteur visée pour un texte long
const HAUTEUR_TEXTE_MAX = 0.15 * largeur; // un texte court grossit jusque-là
const LARGEUR_TEXTE_MAX = 0.84 * largeur;
const RAYON_PLAQUE = 0.055 * largeur;     // arrondi des coins

const hauteur = largeur + BANDE_TEXTE_MM;

const font = opentype.parse(readFileSync(POLICE).buffer);

// Prépare un texte : contours aplatis + décalage pour le centrer dans une zone.
function preparerTexte(texte, hauteurVisee, largeurMax, hauteurMax) {
  let taille = hauteurVisee / 0.716;
  const facteur = largeurMax / font.getAdvanceWidth(texte, taille);
  taille = Math.min(taille * facteur, hauteurMax / 0.716);
  const contours = flattenGlyphPath(font.getPath(texte, 0, 0, taille));
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const c of contours) for (const p of c) {
    minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]);
    minY = Math.min(minY, p[1]); maxY = Math.max(maxY, p[1]);
  }
  return { contours, larg: maxX - minX, haut: maxY - minY, minX, minY };
}

// La plaque blanche est construite plus bas, une fois les outils de tracé
// arrondi définis (voir RAYON_PLAQUE).

// ---------- style arrondi ----------
const M = MODULE_MM;
const JEU = 0.07 * M;              // léger retrait pour que les formes ne se touchent pas
const EPAIS = M - 2 * JEU;         // épaisseur des barres et diamètre des points
const SEG = 16;                    // segments par arc

// Repère : cellule QR (x,y) -> rectangle en mm sur la plaque.
const cellule = (xc, yc, wc = 1, hc = 1) => ({
  x: (xc + QUIET_MODULES) * M,
  y: BANDE_TEXTE_MM + (grille - 1 - (yc + hc - 1) - QUIET_MODULES) * M,
  w: wc * M,
  h: hc * M,
});

function rectArrondi(x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  const pts = [];
  const coins = [
    [x + w - r, y + r, -Math.PI / 2, 0],
    [x + w - r, y + h - r, 0, Math.PI / 2],
    [x + r, y + h - r, Math.PI / 2, Math.PI],
    [x + r, y + r, Math.PI, (3 * Math.PI) / 2],
  ];
  for (const [cx, cy, a0, a1] of coins) {
    for (let i = 0; i <= SEG; i++) {
      const a = a0 + ((a1 - a0) * i) / SEG;
      pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
  }
  return pts;
}

const estRepere = (x, y) =>
  (x < 7 && y < 7) || (x >= size - 7 && y < 7) || (x < 7 && y >= size - 7);

// Zone évidée au centre pour loger le "30". La correction d'erreur de niveau H
// récupère jusqu'à 30 % du code : ces modules manquants sont reconstitués.
const demi = (CENTRE_MODULES - 1) / 2;
const milieu = (size - 1) / 2;
const estCentre = (x, y) =>
  CENTRE_TEXTE &&
  Math.abs(x - milieu) <= demi &&
  Math.abs(y - milieu) <= demi;

const formes = []; // { exterieur, trous }

// Les 3 grands repères d'angle : un anneau arrondi + un carré plein au centre.
for (const [cx, cy] of [[0, 0], [size - 7, 0], [0, size - 7]]) {
  const ext = cellule(cx, cy, 7, 7);
  const int = cellule(cx + 1, cy + 1, 5, 5);
  formes.push({
    // Rayon limité à 1.2 module : au-delà, les coins du repère disparaissent
    // et le QR devient illisible.
    exterieur: rectArrondi(ext.x, ext.y, ext.w, ext.h, 1.2 * M),
    trous: [rectArrondi(int.x, int.y, int.w, int.h, 0.5 * M).reverse()],
  });
  const noyau = cellule(cx + 2, cy + 2, 3, 3);
  formes.push({
    exterieur: rectArrondi(noyau.x, noyau.y, noyau.w, noyau.h, 0.15 * M),
    trous: [],
  });
}

// Les données : chaque suite horizontale devient une barre à bouts ronds,
// un module isolé devient un point.
for (let y = 0; y < size; y++) {
  let x = 0;
  while (x < size) {
    if (!dark(x, y) || estRepere(x, y) || estCentre(x, y)) { x++; continue; }
    let n = 1;
    while (x + n < size && dark(x + n, y) && !estRepere(x + n, y) && !estCentre(x + n, y)) n++;
    const c = cellule(x, y, n, 1);
    formes.push({
      exterieur: rectArrondi(c.x + JEU, c.y + JEU, c.w - 2 * JEU, EPAIS, EPAIS / 2),
      trous: [],
    });
    x += n;
  }
}

// blanc : la plaque, aux coins arrondis
const blanc = extruderGroupe(
  { exterieur: rectArrondi(0, 0, largeur, hauteur, RAYON_PLAQUE), trous: [] },
  0,
  BASE_MM,
  { x: 0, y: 0 }
);

const noir = [];
for (const f of formes) {
  noir.push(...extruderGroupe(f, BASE_MM, BASE_MM + RELIEF_MM, { x: 0, y: 0 }));
}

// Le "30" au centre du QR.
if (CENTRE_TEXTE) {
  const zone = cellule(milieu - demi, milieu - demi, CENTRE_MODULES, CENTRE_MODULES);
  const marge = 1.1 * M; // blanc autour des chiffres, pour les détacher du code
  const t = preparerTexte(CENTRE_TEXTE, zone.h - 2 * marge, zone.w - 2 * marge, zone.h - 2 * marge);
  const dec = {
    x: zone.x + (zone.w - t.larg) / 2 - t.minX,
    y: zone.y + (zone.h - t.haut) / 2 - t.minY,
  };
  for (const g of grouperContours(t.contours)) {
    noir.push(...extruderGroupe(g, BASE_MM, BASE_MM + RELIEF_MM, dec));
  }
}

// Le texte sous le QR, si une bande a été prévue.
if (BANDE_TEXTE_MM > 0 && TEXTE) {
  const t = preparerTexte(TEXTE, HAUTEUR_TEXTE_MM, LARGEUR_TEXTE_MAX, HAUTEUR_TEXTE_MAX);
  const dec = {
    x: (largeur - t.larg) / 2 - t.minX,
    y: (BANDE_TEXTE_MM - t.haut) / 2 - t.minY,
  };
  for (const g of grouperContours(t.contours)) {
    noir.push(...extruderGroupe(g, BASE_MM, BASE_MM + RELIEF_MM, dec));
  }
}

mkdirSync("qr", { recursive: true });
writeSTL("qr/plaque-blanc.stl", blanc, "Plaque blanche - mikv.io/30");
writeSTL("qr/plaque-noir.stl", noir, "QR + texte noir - mikv.io/30");

console.log(`Plaque ${largeur.toFixed(1)} x ${hauteur.toFixed(1)} x ${(BASE_MM + RELIEF_MM).toFixed(1)} mm`);
console.log(`  Bas    : ${TEXTE ? `"${TEXTE}"` : "aucun"}`);
console.log(`  Centre : ${CENTRE_TEXTE ? `"${CENTRE_TEXTE}" sur ${CENTRE_MODULES}x${CENTRE_MODULES} modules` : "aucun"}`);
console.log(`  Blanc  : plaque de ${BASE_MM} mm`);
console.log(`  Noir   : QR + texte, ${RELIEF_MM} mm de relief`);
console.log(`  Fichiers : qr/plaque-blanc.stl, qr/plaque-noir.stl`);
