// Plaque QR de la page offerte à Carol : https://mikv.io/birthday/60.
//
//   node scripts/generate-plaque-60.mjs
//
// Dérivée du skill qr-3d (~/.claude/skills/qr-3d), avec ce qui est propre à
// ce cadeau : un cartouche au centre du QR — un avion qui décolle, « 60 »,
// le château d'Édimbourg —, et un support qui tient la plaque inclinée
// comme un téléphone.
//
// Produit dans qr/ :
//   plaque-60-claire.stl  plaque, filament clair
//   plaque-60-sombre.stl  QR + texte + dessins, filament sombre
//   support-60.stl        le support, à imprimer à part, couché sur le flanc
//   geometrie.json        repères exacts pour le vérificateur du skill
//
// Avant d'imprimer, toujours vérifier :
//   node <skill>/verifier.mjs https://mikv.io/birthday/60 qr/plaque-60-sombre.stl qr/apercu-60.png
import QRCode from "qrcode";
import opentype from "opentype.js";
import earcut from "earcut";
import { writeFileSync, mkdirSync, readFileSync } from "node:fs";

const URL_CIBLE = "https://mikv.io/birthday/60";
const TEXTE = "Joyeux anniversaire !";
const CENTRE_TEXTE = "60";
// Cartouche évidé au centre du QR : avion | 60 | château. En modules,
// colonnes 7 à 25 et lignes 13 à 19 : il évite les lignes de synchronisation
// (ligne et colonne 6) et le motif d'alignement (autour de 26, 26).
//
// Sept lignes, pas neuf : à neuf, le code restait juste en théorie, mais le
// décodeur d'Apple ne le trouvait plus dès que l'image rapetissait (300 px).
// À sept, il le lit encore à 160 px, comme le « 60 » seul.
//
// Trois mises en page, au choix par QR_VARIANTE :
//   cartouche  avion | 60 | château dans le QR
//   coins      « 60 » seul au centre ; avion et château dans les coins
//              libres de la plaque, en haut à droite et en bas à gauche
//   agrandie   « 60 » seul au centre ; plaque rallongée en haut pour
//              l'avion, à droite ; château en bas à gauche, devant le texte
const VARIANTE = process.env.QR_VARIANTE || "cartouche";
const CARTOUCHE = VARIANTE === "cartouche"
  ? { x0: 7, x1: 25, y0: 13, y1: 19 }
  : { x0: 11, x1: 21, y0: 11, y1: 21 }; // le carré 11 × 11 du « 60 » seul
const POLICE = process.env.QR_POLICE || "/System/Library/Fonts/Supplemental/Arial Bold.ttf";

// Dimensions (mm)
// 4e argument : taille d'un module en mm, c'est lui qui règle la taille finale.
//   2.5 -> plaque de 92 mm | 3 -> 111 mm | 3.5 -> 130 mm | 4 -> 148 mm
// 2,7 mm plutôt que 3 : l'adresse est plus longue que celle de /30 (33
// modules au lieu de 29), et la plaque garde ainsi la même largeur, 111 mm.
const MODULE_MM = 2.7;
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
// Le bas de la plaque est pris dans la lèvre du support : une bande vide
// de LEVRE_MM y est réservée, sous le texte et les dessins.
const LEVRE_MM = 7;
const ZONE_TEXTE_MM = 0.24 * largeur;
const BANDE_TEXTE_MM = LEVRE_MM + ZONE_TEXTE_MM;
const HAUTEUR_TEXTE_MM = 0.10 * largeur;  // hauteur visée pour un texte long
const HAUTEUR_TEXTE_MAX = 0.15 * largeur; // un texte court grossit jusque-là
const LARGEUR_TEXTE_MAX = 0.84 * largeur;
// Dans la variante « coins », l'avion loge dans le coin : arrondi réduit.
const RAYON_PLAQUE = (VARIANTE === "coins" ? 0.03 : 0.055) * largeur;
// Bande ajoutée en haut pour l'avion, dans la variante « agrandie ».
const BANDE_HAUT_MM = VARIANTE === "agrandie" ? 16 : 0;

const hauteur = largeur + BANDE_TEXTE_MM + BANDE_HAUT_MM;

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

// Cartouche évidé au centre. La correction d'erreur de niveau H récupère
// jusqu'à 30 % du code : ces modules manquants sont reconstitués.
const estCentre = (x, y) =>
  x >= CARTOUCHE.x0 && x <= CARTOUCHE.x1 && y >= CARTOUCHE.y0 && y <= CARTOUCHE.y1;

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

// ---------- dessins du cartouche ----------
//
// Les dessins sont des silhouettes pleines, sans trou ni détail fin : en
// 0,8 mm de relief avec une buse de 0,4, rien sous 1 mm ne sort proprement.
// Coordonnées dans un repère libre, mises à l'échelle à la pose.

/** Avion de ligne de profil, nez à droite, avant inclinaison. */
const AVION = [
  [100, 7], [96, 11], [88, 13], [24, 13], [11, 31], [3, 31], [7, 13],
  [1, 11], [0, 8], [3, 4], [40, 3], [27, -15], [36, -15], [61, 3],
  [92, 3], [98, 5],
];

/** Le château sur son rocher : tour centrale, remparts crénelés. */
function chateau() {
  const pts = [[0, 0], [100, 0], [97, 7], [90, 13], [82, 18], [80, 18]];
  // Créneaux de droite à gauche, entre x0 et x1, à la hauteur y.
  const creneaux = (x0, x1, y, n) => {
    const pas = (x0 - x1) / (2 * n - 1);
    for (let i = 0; i < 2 * n - 1; i++) {
      const xa = x0 - i * pas, xb = x0 - (i + 1) * pas;
      const h = i % 2 === 0 ? y + 6 : y;
      pts.push([xa, h], [xb, h]);
    }
  };
  pts.push([80, 40]);
  creneaux(80, 60, 40, 2);
  pts.push([60, 40], [60, 64]);
  creneaux(60, 40, 64, 2);
  pts.push([40, 64], [40, 40]);
  creneaux(40, 20, 40, 2);
  pts.push([20, 40], [20, 18], [14, 15], [6, 10], [2, 5]);
  return pts;
}

const tourner = (pts, deg) => {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]);
};

/** Pose un contour dans une boîte (x, y, l, h), centré, proportions gardées. */
function poser(pts, x, y, l, h) {
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys);
  const lw = Math.max(...xs) - x0, lh = Math.max(...ys) - y0;
  const k = Math.min(l / lw, h / lh);
  const dx = x + (l - lw * k) / 2, dy = y + (h - lh * k) / 2;
  let c = pts.map(([px, py]) => [dx + (px - x0) * k, dy + (py - y0) * k]);
  if (aire(c) < 0) c = c.reverse(); // sens direct, comme les lettres
  return c;
}

// Le cartouche : avion | 60 | château, dans la zone évidée.
{
  const zone = cellule(
    CARTOUCHE.x0, CARTOUCHE.y0,
    CARTOUCHE.x1 - CARTOUCHE.x0 + 1, CARTOUCHE.y1 - CARTOUCHE.y0 + 1
  );
  const marge = 0.9 * M;  // blanc autour des dessins, pour les détacher du code
  const ecart = 0.6 * M;  // entre deux dessins
  const h = zone.h - 2 * marge;
  const lDessin = 5.2 * M;
  const lChiffre = zone.w - 2 * marge - 2 * (lDessin + ecart);
  const x0 = zone.x + marge, y0 = zone.y + marge;

  for (const contour of VARIANTE !== "cartouche" ? [] : [
    poser(tourner(AVION, 22), x0, y0, lDessin, h),
    poser(chateau(), zone.x + zone.w - marge - lDessin, y0, lDessin, h),
  ]) {
    noir.push(...extruderGroupe({ exterieur: contour, trous: [] }, BASE_MM, BASE_MM + RELIEF_MM, { x: 0, y: 0 }));
  }

  const t = VARIANTE === "cartouche"
    ? preparerTexte(CENTRE_TEXTE, h, lChiffre, h)
    : preparerTexte(CENTRE_TEXTE, zone.h - 2.2 * M, zone.w - 2.2 * M, zone.h - 2.2 * M);
  const dec = {
    x: zone.x + (zone.w - t.larg) / 2 - t.minX,
    y: zone.y + (zone.h - t.haut) / 2 - t.minY,
  };
  for (const g of grouperContours(t.contours)) {
    noir.push(...extruderGroupe(g, BASE_MM, BASE_MM + RELIEF_MM, dec));
  }
}

// Avion et château hors du QR, selon la variante. La marge blanche de
// QUIET_MODULES autour du code est obligatoire : rien ne doit y entrer,
// sauf dans la variante « coins », qui n'occupe que ses angles, en
// diagonale des repères, là où les lignes de lecture ne passent pas.
const finQR = { x: largeur - QUIET_MODULES * M, y: BANDE_TEXTE_MM + (size + QUIET_MODULES) * M };
let texteX0 = (largeur - LARGEUR_TEXTE_MAX) / 2, texteL = LARGEUR_TEXTE_MAX;
const dessins = [];
if (VARIANTE === "coins") {
  const c = QUIET_MODULES * M - 2.2;  // côté de la case de coin, sans toucher bord ni repère
  dessins.push(poser(tourner(AVION, 35), finQR.x + 1.2, finQR.y + 1.2, c, c));
  dessins.push(poser(chateau(), 1.2, BANDE_TEXTE_MM - 0.5 * c, c + 3, c));
} else if (VARIANTE === "agrandie") {
  const marge = 0.07 * largeur;
  const h = BANDE_HAUT_MM - 3;
  dessins.push(poser(tourner(AVION, 22), largeur - marge - 2.2 * h, hauteur - BANDE_HAUT_MM + 0.5, 2.2 * h, h));
  const lc = 0.17 * largeur;
  dessins.push(poser(chateau(), marge, LEVRE_MM + (ZONE_TEXTE_MM - 0.62 * lc) / 2, lc, 0.62 * lc));
  texteX0 = marge + lc + 0.03 * largeur;
  texteL = largeur - marge - texteX0;
}
for (const contour of dessins) {
  noir.push(...extruderGroupe({ exterieur: contour, trous: [] }, BASE_MM, BASE_MM + RELIEF_MM, { x: 0, y: 0 }));
}

// Le texte sous le QR, sur une ligne, au-dessus de la lèvre du support.
if (BANDE_TEXTE_MM > 0) {
  const t = preparerTexte(TEXTE, HAUTEUR_TEXTE_MM, texteL, HAUTEUR_TEXTE_MAX);
  const dec = {
    x: texteX0 + (texteL - t.larg) / 2 - t.minX,
    y: LEVRE_MM + (ZONE_TEXTE_MM - t.haut) / 2 - t.minY,
  };
  for (const g of grouperContours(t.contours)) {
    noir.push(...extruderGroupe(g, BASE_MM, BASE_MM + RELIEF_MM, dec));
  }
  console.log(`  Texte  : lettres capitales de ${t.haut.toFixed(1)} mm`);
}

mkdirSync("qr", { recursive: true });
// Repères exacts pour le vérificateur : les deviner depuis le maillage
// serait fragile, le maillage sombre excluant marge et bande de texte.
writeFileSync("qr/geometrie.json", JSON.stringify({
  url: URL_CIBLE,
  moduleMm: MODULE_MM,
  quietModules: QUIET_MODULES,
  modules: size,
  largeurMm: largeur,
  hauteurMm: hauteur,
  bandeTexteMm: BANDE_TEXTE_MM,
  centreModules: 0,
  // Zone évidée rectangulaire, en modules, exclue de la comparaison.
  evide: CARTOUCHE,
}, null, 2));

writeSTL("qr/plaque-60-claire.stl", blanc, "Plaque claire - mikv.io/birthday/60");
writeSTL("qr/plaque-60-sombre.stl", noir, "QR + texte + dessins, sombre - mikv.io/birthday/60");


// ---------- support incliné ----------
//
// Un profil extrudé : une semelle, une pente à 65° sur laquelle la plaque
// s'adosse, et une lèvre devant qui retient son bord bas. Il s'imprime
// couché sur le flanc, profil à plat sur le plateau : aucun support, et les
// couches suivent la forme, ce qui rend la lèvre solide.
const ANGLE = 65;                       // inclinaison de la plaque, depuis l'horizontale
const SUPPORT_L = 80;                   // largeur du support (la plaque fait ~111)
const SEMELLE = 4;                      // épaisseur du fond
const LEVRE_EP = 3;                     // épaisseur de la lèvre
const LEVRE_H = LEVRE_MM - 2;           // hauteur de lèvre au-dessus du fond
const PENTE = 55;                       // longueur d'appui le long de la plaque
const PROFONDEUR = 72;                  // emprise au sol, plaque comprise
const EPAISSEUR_PLAQUE = BASE_MM + RELIEF_MM;
const th = (ANGLE * Math.PI) / 180;
// La rainure accueille l'épaisseur de la plaque, vue à l'horizontale, plus du jeu.
const RAINURE = EPAISSEUR_PLAQUE / Math.sin(th) + 0.6;

const A = [LEVRE_EP + RAINURE, SEMELLE];
const T = [A[0] + PENTE * Math.cos(th), A[1] + PENTE * Math.sin(th)];
const profil = [
  [0, 0], [PROFONDEUR, 0], [PROFONDEUR, SEMELLE], [T[0] + 6, T[1]], T, A,
  [LEVRE_EP, SEMELLE], [LEVRE_EP, SEMELLE + LEVRE_H], [0, SEMELLE + LEVRE_H],
];
const support = extruderGroupe({ exterieur: profil, trous: [] }, 0, SUPPORT_L, { x: 0, y: 0 });
writeSTL("qr/support-60.stl", support, "Support incline - plaque mikv.io/birthday/60");

// Centre de gravité de la plaque, à l'horizontale : il doit tomber sur la
// semelle, sinon l'ensemble bascule en arrière.
const gravite = A[0] + (hauteur / 2) * Math.cos(th);
if (gravite > PROFONDEUR - 5) throw new Error("Support trop court : la plaque basculerait.");

writeFileSync("qr/support-60.json", JSON.stringify({
  angle: ANGLE, largeur: SUPPORT_L, profondeur: PROFONDEUR,
  hauteur: +T[1].toFixed(1), profil, appui: A, plaque: { largeur, hauteur, epaisseur: EPAISSEUR_PLAQUE, rayon: RAYON_PLAQUE },
}, null, 2));

console.log(`Plaque ${largeur.toFixed(1)} x ${hauteur.toFixed(1)} x ${(BASE_MM + RELIEF_MM).toFixed(1)} mm`);
console.log(`  Bas    : ${TEXTE ? `"${TEXTE}"` : "aucun"}`);
const evides = (CARTOUCHE.x1 - CARTOUCHE.x0 + 1) * (CARTOUCHE.y1 - CARTOUCHE.y0 + 1);
console.log(`  Centre : avion | "${CENTRE_TEXTE}" | château, ${evides} modules évidés (${((100 * evides) / (size * size)).toFixed(1)} % du code)`);
console.log(`  Blanc  : plaque de ${BASE_MM} mm`);
console.log(`  Noir   : QR + texte + dessins, ${RELIEF_MM} mm de relief`);
console.log(`Support ${SUPPORT_L} x ${PROFONDEUR} x ${T[1].toFixed(1)} mm, plaque à ${ANGLE}°`);

