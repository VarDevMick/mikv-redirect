// Dessin coté : plaque de face, smartphone pour l'échelle, profil sur support.
import { readFileSync, writeFileSync } from "node:fs";
const [, , dossier, sortie] = process.argv;
const sup = JSON.parse(readFileSync(`${dossier}/support-60.json`, "utf8"));
const { largeur: PL, hauteur: PH } = sup.plaque;
const buf = readFileSync(`${dossier}/plaque-60-sombre.stl`);
const n = buf.readUInt32LE(80);
let zmax = -Infinity; const tris = [];
for (let i = 0; i < n; i++) {
  const o = 84 + i * 50 + 12; const t = [];
  for (let k = 0; k < 3; k++) t.push([buf.readFloatLE(o + k * 12), buf.readFloatLE(o + k * 12 + 4), buf.readFloatLE(o + k * 12 + 8)]);
  zmax = Math.max(zmax, ...t.map((p) => p[2])); tris.push(t);
}
const K = 3; // px par mm
const OX = 40, OY = 70; // origine vue de face
const fy = (y) => OY + (PH - y) * K;
const fx = (x) => OX + x * K;
const dessus = tris.filter((t) => t.every((p) => Math.abs(p[2] - zmax) < 1e-4))
  .map((t) => `M${t.map((p) => `${fx(p[0]).toFixed(1)},${fy(p[1]).toFixed(1)}`).join("L")}Z`).join("");
const encre = "#1b2a41", plaqueC = "#f4ecd8", or = "#b8862e", gris = "#6b7280";
const fleche = (x1, y1, x2, y2, txt, tx, ty, rot = 0) => `
  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${or}" stroke-width="1.5" marker-start="url(#f)" marker-end="url(#f)"/>
  <text x="${tx}" y="${ty}" fill="${or}" font-size="16" font-weight="600" text-anchor="middle" ${rot ? `transform="rotate(${rot} ${tx} ${ty})"` : ""}>${txt}</text>`;
// Téléphone pour l'échelle
const TX = fx(PL) + 70, TL = 71.6, TH = 147.6;
const tel = `<rect x="${TX}" y="${fy(TH)}" width="${TL * K}" height="${TH * K}" rx="${10 * K}" fill="none" stroke="${gris}" stroke-width="2" stroke-dasharray="7 5"/>
  <text x="${TX + TL * K / 2}" y="${fy(TH / 2)}" fill="${gris}" font-size="15" text-anchor="middle">smartphone</text>
  <text x="${TX + TL * K / 2}" y="${fy(TH / 2) + 20}" fill="${gris}" font-size="13" text-anchor="middle">147 × 72 mm</text>
  <text x="${TX + TL * K / 2}" y="${fy(TH / 2) + 38}" fill="${gris}" font-size="13" text-anchor="middle">pour l'échelle</text>`;
// Profil
const PX0 = TX + TL * K + 110, SOL = fy(0);
const px = (x) => PX0 + x * K, pz = (z) => SOL - z * K;
const th = (sup.angle * Math.PI) / 180, [ax, az] = sup.appui, ep = sup.plaque.epaisseur;
const u = [Math.cos(th), Math.sin(th)], nrm = [-Math.sin(th), Math.cos(th)];
const coin = (s, e) => [ax + s * u[0] + e * nrm[0], az + s * u[1] + e * nrm[1]];
const plaqueProfil = [coin(0, 0), coin(PH, 0), coin(PH, ep), coin(0, ep)];
const poly = (pts, fill, stroke) => `<polygon points="${pts.map(([x, z]) => `${px(x).toFixed(1)},${pz(z).toFixed(1)}`).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
const sommet = coin(PH, ep);
const hauteurTotale = Math.max(...plaqueProfil.map((p) => p[1]));
const W = px(sup.profondeur) + 140, H = SOL + 110;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="Helvetica, Arial, sans-serif">
<defs><marker id="f" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="${or}"/></marker></defs>
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="${OX}" y="38" fill="${encre}" font-size="22" font-weight="700">Plaque mikv.io/birthday/60 — dimensions</text>
<text x="${OX}" y="${OY - 10}" fill="${gris}" font-size="15">De face</text>
<rect x="${fx(0)}" y="${fy(PH)}" width="${PL * K}" height="${PH * K}" rx="${0.055 * PL * K}" fill="${plaqueC}" stroke="${encre}" stroke-width="1.5"/>
<path d="${dessus}" fill="${encre}"/>
<rect x="${fx(0)}" y="${fy(7)}" width="${PL * K}" height="${7 * K}" fill="${or}" opacity="0.18"/>
<text x="${fx(PL / 2)}" y="${fy(3.5) + 5}" fill="${or}" font-size="12" text-anchor="middle">pris dans la lèvre du support</text>
${fleche(fx(0), fy(0) + 30, fx(PL), fy(0) + 30, `${PL.toFixed(0)} mm`, fx(PL / 2), fy(0) + 55)}
${fleche(fx(PL) + 28, fy(PH), fx(PL) + 28, fy(0), `${PH.toFixed(0)} mm`, fx(PL) + 50, fy(PH / 2), 90)}
${tel}
<text x="${PX0}" y="${OY - 10}" fill="${gris}" font-size="15">De profil, sur son support</text>
<line x1="${PX0 - 30}" y1="${SOL}" x2="${px(sup.profondeur) + 30}" y2="${SOL}" stroke="${gris}" stroke-width="1.5"/>
${poly(sup.profil, "#d9cbb0", encre)}
${poly(plaqueProfil, plaqueC, encre)}
${fleche(px(0), SOL + 30, px(sup.profondeur), SOL + 30, `${sup.profondeur} mm`, px(sup.profondeur / 2), SOL + 55)}
${fleche(px(sup.profondeur) + 40, pz(hauteurTotale), px(sup.profondeur) + 40, SOL, `${hauteurTotale.toFixed(0)} mm`, px(sup.profondeur) + 62, pz(hauteurTotale / 2), 90)}
<path d="M${px(ax + 28)},${pz(az)} A ${28 * K} ${28 * K} 0 0 0 ${px(ax + 28 * Math.cos(th))},${pz(az + 28 * Math.sin(th))}" fill="none" stroke="${or}" stroke-width="1.5"/>
<text x="${px(ax + 32)}" y="${pz(az + 10)}" fill="${or}" font-size="16" font-weight="600">${sup.angle}°</text>
<text x="${PX0}" y="${SOL + 85}" fill="${gris}" font-size="13">Support : ${sup.largeur} mm de large, ${sup.hauteur} mm de haut</text>
</svg>`;
writeFileSync(sortie, svg);
console.log(`hauteur totale posée : ${hauteurTotale.toFixed(1)} mm`);
