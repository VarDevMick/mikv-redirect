// Page surprise pour le trek GR58 (Tour du Queyras).
// Pour ajouter une photo à une étape : cherche PHOTO_PLACEHOLDER et remplace
// le <div class="photo-frame">...</div> par <img class="photo-frame" src="...">.
// Pour ajouter la vidéo : cherche VIDEO_PLACEHOLDER dans la dernière section.

const mountainDivider = (fill) => `
<svg class="divider" viewBox="0 0 400 60" preserveAspectRatio="none" aria-hidden="true">
  <path d="M0,60 L0,35 L40,10 L70,30 L110,5 L150,32 L190,15 L230,38 L270,12 L310,34 L350,8 L400,30 L400,60 Z" fill="${fill}"></path>
</svg>`;

// Photos réelles des lieux, libres de droits (Wikimedia Commons).
// Pour remplacer par tes propres photos : change simplement l'url et le credit.
const PHOTOS = {
  souliers: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Vu_vers_le_Lac_Souliers_de_la_cr%C3%AAte_du_Tronchet_-_panoramio.jpg/1280px-Vu_vers_le_Lac_Souliers_de_la_cr%C3%AAte_du_Tronchet_-_panoramio.jpg",
    credit: "Lac de Souliers depuis la crête du Tronchet · Philippe Truillet, CC BY-SA 3.0",
  },
  arvieux: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Arvieux_depuis_la_mont%C3%A9e_du_col_d%27Izoard.jpg/1280px-Arvieux_depuis_la_mont%C3%A9e_du_col_d%27Izoard.jpg",
    credit: "La vallée d'Arvieux · Mathieu Brossais, CC BY 4.0",
  },
  ceillac: {
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Vall%C3%A9e_de_Ceillac.jpg/1280px-Vall%C3%A9e_de_Ceillac.jpg",
    credit: "La vallée de Ceillac · ThomasInTheSky, CC BY 4.0",
  },
};

const photoFrame = (key, label) => `
  <figure class="photo-block">
    <img class="photo-frame" src="${PHOTOS[key].url}" alt="${label}" loading="lazy">
    <!-- Légende masquée. Pour la réafficher : décommenter la ligne ci-dessous.
    <figcaption>${PHOTOS[key].credit}</figcaption>
    -->
  </figure>`;

// Vidéo : mets ici le nom du fichier déposé dans docs/ (ex. "message.mp4").
// Tant que c'est vide, la section n'apparaît pas.
const VIDEO = "";

// Coordonnées du tracé stylisé (pas géographiquement exactes, juste évocatrices).
const TRAIL_D = "M10,120 C35,95 50,55 70,45 C88,58 98,62 112,75 C124,92 132,112 142,122 C158,100 168,62 182,52 C198,66 202,86 212,92 C228,72 238,42 252,32 C270,52 286,92 300,112";
const WAYPOINTS = [
  { x: 10, y: 120, label: "Souliers" },
  { x: 112, y: 75, label: "Arvieux" },
  { x: 212, y: 92, label: "Furfande" },
  { x: 300, y: 112, label: "Bramousse" },
];

export const PAGE_30_HTML = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Une surprise pour toi</title>
<style>
  :root {
    --cream: #f4ecd8;
    --paper: #efe3c7;
    --ink: #2b2018;
    --terracotta: #c1440e;
    --forest: #2f5233;
    --mustard: #e2b53b;
    --navy: #1b2a41;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    height: 100%;
    scroll-snap-type: y proximity;
    overflow-y: scroll;
    font-family: Georgia, "Times New Roman", serif;
    color: var(--cream);
    background: var(--navy);
  }
  .panel {
    min-height: 100svh;
    scroll-snap-align: start;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 3rem 1.5rem 4.5rem;
    position: relative;
    overflow: hidden;
  }
  .divider {
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 60px;
  }
  .p1 {
    background:
      radial-gradient(circle at 50% 20%, rgba(226,181,59,0.25), transparent 60%),
      var(--navy);
  }
  .p2 { background: var(--forest); }
  .p3 { background: var(--terracotta); }
  .p7 { background: var(--navy); }

  .eyebrow {
    text-transform: uppercase;
    letter-spacing: 0.25em;
    font-size: 0.7rem;
    opacity: 0.75;
    margin-bottom: 0.9rem;
  }
  h1 {
    font-size: 1.9rem;
    line-height: 1.3;
    margin: 0 0 0.6rem;
    font-weight: 700;
  }
  h2 {
    font-size: 1.5rem;
    margin: 0 0 0.8rem;
    font-weight: 700;
  }
  p { font-size: 1.02rem; line-height: 1.55; margin: 0.4rem 0; opacity: 0.9; }

  .compass { width: 44px; height: 44px; margin-bottom: 1rem; color: var(--mustard); }

  /* --- Ouverture anniversaire --- */
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
    background: linear-gradient(100deg,
      #b8860b 0%, #e2b53b 30%, #fff6d5 45%, #e2b53b 60%, #b8860b 100%);
    background-size: 250% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    animation: shimmer 4.5s ease-in-out infinite;
    filter: drop-shadow(0 4px 18px rgba(226,181,59,0.35));
  }
  .big-thirty .ans {
    font-size: 0.34em;
    letter-spacing: 0.04em;
  }
  @keyframes shimmer {
    0%, 100% { background-position: 130% 0; }
    50% { background-position: -30% 0; }
  }

  .stars { position: absolute; inset: 0; pointer-events: none; }
  .stars span {
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: var(--mustard);
    opacity: 0;
    animation: twinkle 4s ease-in-out infinite;
  }
  @keyframes twinkle {
    0%, 100% { opacity: 0; transform: scale(0.6); }
    50% { opacity: 0.85; transform: scale(1); }
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
    .reveal, .stars span, .big-thirty { animation: none; opacity: 1; transform: none; }
    .big-thirty { color: var(--mustard); -webkit-text-fill-color: var(--mustard); }
  }

  .trek-title {
    font-size: 2.3rem;
    font-weight: 700;
    margin: 0.2rem 0;
    letter-spacing: 0.02em;
  }
  .trek-sub { font-size: 1.1rem; opacity: 0.9; font-style: italic; }

  /* --- Section carte interactive --- */
  .route-section {
    background: var(--paper);
    color: var(--ink);
  }
  .route-map-sticky {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--paper);
    border-bottom: 2px solid rgba(43,32,24,0.15);
    padding: 0.8rem 1rem 0.4rem;
  }
  .route-svg { width: 100%; height: auto; display: block; }
  .trail-bg, .trail-progress {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .trail-bg { stroke: rgba(43,32,24,0.45); stroke-width: 4; stroke-dasharray: 3 7; }
  .trail-progress {
    stroke: var(--terracotta);
    stroke-width: 5;
    transition: stroke-dashoffset 0.5s ease;
  }
  .waypoint circle { fill: var(--paper); stroke: rgba(43,32,24,0.55); stroke-width: 2.5; transition: all 0.3s ease; }
  .waypoint.active circle { fill: var(--terracotta); stroke: var(--terracotta); r: 7; }
  .waypoint text {
    font-family: Georgia, serif;
    font-size: 13px;
    fill: var(--ink);
    opacity: 0.65;
    transition: opacity 0.3s ease;
  }
  .waypoint.active text { opacity: 1; font-weight: 700; }
  .hiker-marker {
    transition: transform 0.5s ease;
  }
  .hiker-marker circle { fill: var(--mustard); stroke: var(--ink); stroke-width: 1.5; }

  .route-step {
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 2rem 1.5rem 3rem;
  }

  .day-card {
    background: rgba(255,255,255,0.5);
    border: 1px solid rgba(43,32,24,0.15);
    border-radius: 4px;
    padding: 1.4rem;
    max-width: 340px;
    width: 100%;
  }
  .day-num {
    font-size: 0.8rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    opacity: 0.75;
    margin-bottom: 0.4rem;
  }
  .day-route {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 0.8rem;
  }

  .photo-frame {
    width: 100%;
    max-width: 320px;
    /* Assez vertical pour que l'arche se lise, sans trop rogner les photos
       qui sont toutes en format paysage. */
    aspect-ratio: 4 / 5;
    border-radius: 50% 50% 14px 14px / 30% 30% 14px 14px;
    overflow: hidden;
    margin-bottom: 1rem;
    border: 6px solid var(--cream);
    box-shadow: 0 6px 20px rgba(43,32,24,0.28);
  }
  img.photo-frame {
    object-fit: cover;
    object-position: center 45%; /* garde l'horizon et les sommets dans le cadre */
    display: block;
    margin-bottom: 0.3rem;
  }
  .photo-block {
    margin: 0 0 1rem;
    max-width: 320px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .photo-block figcaption {
    font-size: 0.68rem;
    opacity: 0.55;
    line-height: 1.3;
  }

  .day-note {
    font-size: 0.9rem;
    font-style: italic;
    opacity: 0.8;
    margin: 0 0 0.4rem;
  }
  .stats {
    display: flex;
    justify-content: center;
    gap: 1.3rem;
    flex-wrap: wrap;
    margin-top: 0.8rem;
  }
  .stat { text-align: center; }
  .stat b { display: block; font-size: 1.1rem; }
  .stat span { font-size: 0.7rem; opacity: 0.75; text-transform: uppercase; letter-spacing: 0.05em; }

  .info-list { max-width: 340px; text-align: left; margin-top: 1rem; }
  .info-list li { margin-bottom: 0.6rem; }

  .signature { margin-top: 2rem; font-size: 0.95rem; opacity: 0.75; font-style: italic; }

  .son {
    position: fixed;
    top: 14px;
    right: 14px;
    z-index: 10;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1px solid rgba(244,236,216,0.4);
    background: rgba(27,42,65,0.5);
    color: var(--cream);
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
  }
  .son.coupe { opacity: 0.45; }

  .video {
    width: 100%;
    max-width: 340px;
    border-radius: 6px;
    border: 4px solid rgba(255,255,255,0.7);
    box-shadow: 0 4px 14px rgba(0,0,0,0.3);
    margin-bottom: 0.6rem;
  }
</style>
</head>
<body>

  <button class="son" id="btnSon" type="button" aria-label="Couper ou relancer la musique">&#9835;</button>

  <section class="panel p1">
    <div class="stars" aria-hidden="true">
      ${Array.from({ length: 18 }, (_, i) => {
        const left = (i * 37) % 100;
        const top = (i * 53) % 70;
        const delay = (i % 6) * 0.7;
        return `<span style="left:${left}%; top:${top}%; animation-delay:${delay}s"></span>`;
      }).join("")}
    </div>
    <div class="eyebrow reveal r1">Joyeux anniversaire</div>
    <h1 class="name reveal r2">Charlotte</h1>
    <div class="big-thirty reveal r3" aria-label="30 ans">30<span class="ans">ans</span></div>
    <p class="reveal r4">Ça se fête en altitude.</p>
    <p class="reveal r5" style="opacity:0.7">Continue de descendre.</p>
    ${mountainDivider("var(--forest)")}
  </section>

  <section class="panel p2">
    <h1>Et si on partait crapahuter ensemble ?</h1>
    <p>Rien que toi et moi, dans la montagne.</p>
    <p style="opacity:0.75; font-size:0.95rem;">Quand tu veux, tu choisis.</p>
    ${mountainDivider("var(--terracotta)")}
  </section>

  <section class="panel p3">
    <svg class="compass" viewBox="0 0 60 60" aria-hidden="true">
      <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
      <path d="M30,6 L34,28 L30,54 L26,28 Z" fill="currentColor"></path>
      <path d="M6,30 L28,26 L54,30 L28,34 Z" fill="currentColor" opacity="0.5"></path>
    </svg>
    <div class="eyebrow">Destination</div>
    <div class="trek-title">GR58</div>
    <div class="trek-sub">Tour du Queyras</div>
    <p style="margin-top:1rem">3 jours · 2 nuits en refuge</p>
    <p style="opacity:0.85; font-size:0.95rem;">Les étapes les plus douces du tour : 4 à 5 h de marche par jour.</p>
    <p style="opacity:0.7; font-size:0.9rem;">Fais défiler pour suivre le tracé →</p>
    ${mountainDivider("var(--paper)")}
  </section>

  <section class="route-section">
    <div class="route-map-sticky">
      <svg class="route-svg" viewBox="-30 -5 370 175" id="routeSvg">
        <path class="trail-bg" d="${TRAIL_D}"></path>
        <path class="trail-progress" id="trailProgress" d="${TRAIL_D}"></path>
        ${WAYPOINTS.map((w, i) => `
        <g class="waypoint" data-idx="${i}" transform="translate(${w.x},${w.y})">
          <circle r="5"></circle>
          <text x="0" y="${i % 2 === 0 ? -12 : 20}" text-anchor="middle">${w.label}</text>
        </g>`).join("")}
        <g class="hiker-marker" id="hikerMarker" transform="translate(${WAYPOINTS[0].x},${WAYPOINTS[0].y})">
          <circle r="6"></circle>
        </g>
      </svg>
    </div>

    <div class="route-step" data-idx="1">
      ${photoFrame("souliers", "Souliers → Chalp d'Arvieux")}
      <div class="day-card">
        <div class="day-num">Jour 1 · mise en jambes</div>
        <div class="day-route">Souliers → Chalp d'Arvieux</div>
        <p class="day-note">Par le col Tronchet, tranquille pour commencer.</p>
        <div class="stats">
          <div class="stat"><b>4h</b><span>Marche</span></div>
          <div class="stat"><b>+510 m</b><span>D+</span></div>
          <div class="stat"><b>-660 m</b><span>D-</span></div>
        </div>
      </div>
    </div>

    <div class="route-step" data-idx="2">
      ${photoFrame("arvieux", "Chalp d'Arvieux → Refuge de Furfande")}
      <div class="day-card">
        <div class="day-num">Jour 2 · la belle montée</div>
        <div class="day-route">Chalp d'Arvieux → Refuge de Furfande</div>
        <p class="day-note">La seule vraie grimpette, avec un refuge perché en récompense.</p>
        <div class="stats">
          <div class="stat"><b>5h</b><span>Marche</span></div>
          <div class="stat"><b>+820 m</b><span>D+</span></div>
          <div class="stat"><b>-210 m</b><span>D-</span></div>
        </div>
      </div>
    </div>

    <div class="route-step" data-idx="3">
      ${photoFrame("ceillac", "Refuge de Furfande → Bramousse")}
      <div class="day-card">
        <div class="day-num">Jour 3 · la grande descente</div>
        <div class="day-route">Refuge de Furfande → Bramousse</div>
        <p class="day-note">Par le col Lauze, puis on redescend tranquillement dans la vallée.</p>
        <div class="stats">
          <div class="stat"><b>4h30</b><span>Marche</span></div>
          <div class="stat"><b>+210 m</b><span>D+</span></div>
          <div class="stat"><b>-1000 m</b><span>D-</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="panel p7 no-arrow">
    <h2>Le bon plan</h2>
    <ul class="info-list">
      <li>Nuits en refuge de montagne (demi-pension).</li>
      <li>Sac léger, bonnes chaussures, on prend son temps.</li>
      <li>Possible de fin juin à mi-septembre : on choisit ensemble.</li>
      <li>Je m'occupe des réservations, toi tu ramènes ton sourire.</li>
    </ul>
    <p class="signature">À très vite dans le Queyras.</p>
  </section>

  ${VIDEO ? `
  <section class="panel p2 no-arrow">
    <div class="eyebrow">Un dernier mot</div>
    <video class="video" controls playsinline preload="metadata">
      <source src="/${VIDEO}" type="video/mp4">
    </video>
    <p style="opacity:0.75; font-size:0.9rem;">Appuie pour lancer</p>
  </section>` : ""}

<script>
// "Joyeux anniversaire" synthetise a la volee (melodie du domaine public).
// Les navigateurs interdisent le son sans geste utilisateur : on demarre
// donc au premier toucher ou defilement.
(function () {
  var SOL = 392.00, LA = 440.00, SI = 493.88, DO = 523.25,
      RE = 587.33, MI = 659.25, FA = 698.46, SOL5 = 783.99;
  var MELODIE = [
    [SOL, 0.75], [SOL, 0.25], [LA, 1], [SOL, 1], [DO, 1], [SI, 1.75],
    [SOL, 0.75], [SOL, 0.25], [LA, 1], [SOL, 1], [RE, 1], [DO, 1.75],
    [SOL, 0.75], [SOL, 0.25], [SOL5, 1], [MI, 1], [DO, 1], [SI, 1], [LA, 1.75],
    [FA, 0.75], [FA, 0.25], [MI, 1], [DO, 1], [RE, 1], [DO, 2]
  ];

  var ctx = null, fin = null, enCours = false, oscs = [];
  var bouton = document.getElementById("btnSon");

  // Un seul contexte pour toute la page : sur iOS, en recreer un hors d'un
  // geste utilisateur est refuse.
  function contexte() {
    if (!ctx) {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    return ctx;
  }

  function jouer() {
    arreter();
    if (!contexte()) return;
    enCours = true;
    var t = ctx.currentTime + 0.2;
    var noire = 0.46;   // tempo
    var PASSES = 2;     // 2 x 11 s = environ 22 s
    var PAUSE = 0.7;    // respiration entre deux passes

    for (var p = 0; p < PASSES; p++) {
    MELODIE.forEach(function (n) {
      var duree = n[1] * noire;
      // Deux oscillateurs a l'octave : le son est plus chaud qu'une onde seule.
      [[n[0], 0.22, "triangle"], [n[0] * 2, 0.06, "sine"]].forEach(function (v) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = v[2];
        osc.frequency.value = v[0];
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(v[1], t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duree * 0.92);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + duree);
        oscs.push(osc);
      });
      t += duree;
    });
      t += PAUSE;
    }
    bouton.classList.remove("coupe");
    // A la fin, le bouton redevient un "rejouer" (sans fermer le contexte).
    fin = setTimeout(function () {
      enCours = false;
      oscs = [];
    }, (t - ctx.currentTime + 0.3) * 1000);
  }

  function arreter() {
    if (fin) { clearTimeout(fin); fin = null; }
    oscs.forEach(function (o) { try { o.stop(); } catch (err) {} });
    oscs = [];
    enCours = false;
  }

  var lance = false;
  function demarrer(e) {
    // Un appui sur le bouton est gere par son propre handler.
    if (e && e.target && e.target.closest && e.target.closest("#btnSon")) return;
    if (lance) return;
    var c = contexte();
    if (!c) return;
    lance = true;
    // Le contexte nait suspendu : il faut le reveiller dans le geste meme.
    if (c.state === "suspended" && c.resume) {
      c.resume().then(jouer).catch(function () { lance = false; });
    } else {
      jouer();
    }
  }
  // touchend / click / keydown sont les seuls gestes que Safari iOS accepte
  // comme activation valide pour l'audio.
  ["touchend", "click", "keydown", "pointerup", "scroll"].forEach(function (ev) {
    window.addEventListener(ev, demarrer, { passive: true });
  });

  bouton.addEventListener("click", function (e) {
    e.stopPropagation();
    lance = true;
    if (enCours) {
      arreter();
      bouton.classList.add("coupe");
      return;
    }
    var c = contexte();
    if (!c) return;
    if (c.state === "suspended" && c.resume) c.resume().then(jouer);
    else jouer();
  });
})();

(function () {
  var waypoints = ${JSON.stringify(WAYPOINTS)};
  var progressPath = document.getElementById("trailProgress");
  var marker = document.getElementById("hikerMarker");
  var waypointEls = document.querySelectorAll(".waypoint");
  var total = progressPath.getTotalLength();
  progressPath.style.strokeDasharray = total;

  // Fraction du tracé parcourue à chaque point clé (approx, basé sur l'ordre des points).
  var fractions = [0.02, 0.36, 0.68, 1];

  function setStep(idx) {
    var w = waypoints[idx];
    marker.setAttribute("transform", "translate(" + w.x + "," + w.y + ")");
    progressPath.style.strokeDashoffset = total * (1 - fractions[idx]);
    waypointEls.forEach(function (el) {
      el.classList.toggle("active", Number(el.dataset.idx) === idx);
    });
  }

  setStep(0);

  var steps = document.querySelectorAll(".route-step");
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        setStep(Number(entry.target.dataset.idx));
      }
    });
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });

  steps.forEach(function (s) { observer.observe(s); });
})();
</script>
</body>
</html>
`;
