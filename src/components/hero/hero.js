// F-01 · Révélation en cascade · F-08 · Massif d'ouverture · F-12 · Feu d'artifice
import { SAPIN } from "../scenery/scenery.js";

export const contenu = {
  eyebrow: "Joyeux anniversaire",
  prenom: "Charlotte",
  age: "30",
  accroche: "Ça se fête en altitude.",
  invite: "Continue de descendre.",
};

const massif = `
    <svg class="massif" viewBox="0 0 400 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
      <!-- sommets, du plus lointain au plus proche -->
      <path d="M0,240 L0,150 L58,84 L104,124 L150,60 L206,132 L248,96 L300,150 L344,110 L400,166 L400,240 Z" fill="#c9bda6"></path>
      <path d="M128,80 L150,60 L172,80 L160,74 L142,78 Z" fill="#fdf8ec"></path>
      <path d="M184,102 L206,132 L228,104 L212,110 Z" fill="#fdf8ec" opacity="0.8"></path>
      <path class="d-trait" d="M0,150 L58,84 L104,124 L150,60 L206,132 L248,96 L300,150 L344,110 L400,166"></path>
      <path d="M0,240 L0,186 C74,164 128,196 196,180 C266,164 318,192 400,178 L400,240 Z" fill="#6f8a5c"></path>
      <path class="d-trait" d="M0,186 C74,164 128,196 196,180 C266,164 318,192 400,178"></path>
      <g class="sapins">
        <path transform="translate(74,176) scale(1.5)" d="${SAPIN}"></path>
        <path transform="translate(104,184) scale(1.1)" d="${SAPIN}"></path>
        <path transform="translate(258,190) scale(1.2)" d="${SAPIN}"></path>
        <path transform="translate(320,180) scale(1.5)" d="${SAPIN}"></path>
      </g>
      <path d="M0,240 L0,214 C90,202 190,224 282,212 C334,205 366,210 400,206 L400,240 Z" fill="#d8c68a"></path>
      <path class="d-trait" d="M0,214 C90,202 190,224 282,212 C334,205 366,210 400,206"></path>
    </svg>`;

export const html = `
  <section class="panel p1">
    <canvas class="feu" id="feu" aria-hidden="true"></canvas>${massif}
    <div class="eyebrow reveal r1">${contenu.eyebrow}</div>
    <h1 class="name reveal r2">${contenu.prenom}</h1>
    <div class="big-thirty reveal r3" id="grosTrente" aria-label="${contenu.age} ans">${contenu.age}<span class="ans">ans</span></div>
    <p class="reveal r4">${contenu.accroche}</p>
    <p class="reveal r5" style="opacity:0.7">${contenu.invite}</p>
  </section>`;

export const css = `
  .name {
    font-size: 2.6rem;
    letter-spacing: 0.02em;
    margin-bottom: 0.2rem;
  }
  .big-thirty {
    font-size: clamp(6rem, 38vw, 11rem);
    font-weight: 700;
    line-height: 1;
    margin: 0.2rem 0 0.8rem;
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 0.08em;
    color: var(--encre);
    position: relative;
    z-index: 1;
  }
  .big-thirty .ans {
    font-size: 0.34em;
    letter-spacing: 0.04em;
    color: var(--sapin);
  }

  .feu {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    pointer-events: none;
  }
  /* Le texte de l'ouverture passe devant le décor et les fusées. */
  .p1 > .eyebrow,
  .p1 > h1,
  .p1 > .big-thirty,
  .p1 > p { position: relative; z-index: 2; }

  .massif {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: min(58vh, 420px);
    z-index: 0;
    opacity: 0.9;
    animation: leve 1.8s ease-out both;
  }
  @keyframes leve {
    from { opacity: 0; transform: translateY(26px); }
    to { opacity: 0.9; transform: none; }
  }

  .reveal {
    opacity: 0;
    transform: translateY(14px);
    animation: rise 0.9s ease forwards;
  }
  .r1 { animation-delay: 0.15s; }
  .r2 { animation-delay: 0.5s; }
  .r3 { animation-delay: 0.9s; }
  .r4 { animation-delay: 1.5s; }
  .r5 { animation-delay: 2.1s; }
  @keyframes rise {
    to { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .reveal, .massif { animation: none; opacity: 1; transform: none; }
  }
`;

// F-12 · Le feu d'artifice s'arrête pour de bon après la fête : pas de
// boucle qui tournerait en fond et viderait la batterie.
export const js = `
(function () {
  var canvas = document.getElementById("feu");
  if (!canvas || !canvas.getContext) return;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var COULEURS = ["#c1440e", "#e2b53b", "#c4551a", "#2f5233", "#e9c39c"];
  var particules = [], fusees = [], dpr = window.devicePixelRatio || 1;
  var largeur = 0, hauteur = 0;

  function dimensionner() {
    var r = canvas.getBoundingClientRect();
    largeur = r.width; hauteur = r.height;
    canvas.width = largeur * dpr;
    canvas.height = hauteur * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  dimensionner();
  window.addEventListener("resize", dimensionner);

  function lancer() {
    fusees.push({
      x: largeur * (0.18 + Math.random() * 0.64),
      y: hauteur,
      vy: -(hauteur / 78) * (0.85 + Math.random() * 0.4),
      cible: hauteur * (0.16 + Math.random() * 0.24),
      couleur: COULEURS[Math.floor(Math.random() * COULEURS.length)]
    });
  }

  function exploser(x, y, couleur) {
    var n = 34 + Math.floor(Math.random() * 16);
    for (var i = 0; i < n; i++) {
      var a = (Math.PI * 2 * i) / n + Math.random() * 0.2;
      var v = 1.4 + Math.random() * 2.6;
      particules.push({
        x: x, y: y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        vie: 1,
        couleur: Math.random() < 0.72 ? couleur : COULEURS[Math.floor(Math.random() * COULEURS.length)]
      });
    }
  }

  var debut = null, fini = false;
  var DUREE = 7200;      // durée de la fête
  var prochaine = 400;   // date du prochain tir

  function boucle(t) {
    if (debut === null) debut = t;
    var age = t - debut;
    ctx.clearRect(0, 0, largeur, hauteur);

    if (age > prochaine && age < DUREE) {
      lancer();
      prochaine = age + 700 + Math.random() * 700;
    }

    fusees = fusees.filter(function (f) {
      f.y += f.vy;
      f.vy += 0.045;
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = f.couleur;
      ctx.beginPath();
      ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
      ctx.fill();
      if (f.y <= f.cible || f.vy >= 0) { exploser(f.x, f.y, f.couleur); return false; }
      return true;
    });

    particules = particules.filter(function (p) {
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.055;
      p.vie -= 0.016;
      if (p.vie <= 0) return false;
      ctx.globalAlpha = Math.max(0, p.vie);
      ctx.fillStyle = p.couleur;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.1, 0, Math.PI * 2);
      ctx.fill();
      return true;
    });

    ctx.globalAlpha = 1;
    if (age > DUREE && !particules.length && !fusees.length) {
      if (!fini) { fini = true; ctx.clearRect(0, 0, largeur, hauteur); }
      return; // on arrête complètement l'animation
    }
    requestAnimationFrame(boucle);
  }
  requestAnimationFrame(boucle);
})();
`;
