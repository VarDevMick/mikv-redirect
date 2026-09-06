// F-17 · Plan interactif des étapes, collé en haut de la section.
// `trace` et `reperes` decrivent le parcours ; `fond` est un fond de plan
// facultatif fourni par le theme, dessine sous le trace ; `cartes` est le
// HTML des etapes.
export const html = (trace, reperes, cartes, fond = "") => `
  <section class="route-section">
    <div class="route-map-sticky">
      <svg class="route-svg" viewBox="-30 -5 370 175" id="routeSvg">
${fond}
        <path class="trail-bg" d="${trace}"></path>
        <path class="trail-progress" id="trailProgress" d="${trace}"></path>
        ${reperes.map((r, i) => `
        <g class="waypoint" data-idx="${i}" transform="translate(${r.x},${r.y})">
          <circle r="5"></circle>
          <text x="0" y="${i % 2 === 0 ? -12 : 20}" text-anchor="middle">${r.label}</text>
        </g>`).join("")}
        <g class="hiker-marker" id="hikerMarker" transform="translate(${reperes[0].x},${reperes[0].y})">
          <circle r="6"></circle>
        </g>
      </svg>
    </div>

${cartes}
  </section>`;

// Variante par journée : chaque jour a son propre parcours sur le plan,
// et seul celui de l'étape en cours s'allume. Convient à une ville, où
// les journées sont des boucles distinctes plutôt qu'un chemin continu.
//
// `marcheur` (facultatif) est le SVG d'un personnage du thème : s'il est
// fourni, il est incorporé au plan et suit le tracé du jour actif au fil
// du défilement, plutôt que d'exister sur un tracé séparé indépendant de
// la géographie réelle — voir specs/trail.md pour la raison de ce choix.
export const htmlJours = (jours, cartes, fond = "", vue = "-30 -5 370 178", marcheur = "") => {
  const depart = jours[0].reperes[0];
  // Le contenu du marcheur est ré-échelonné : dessiné pour une colonne de
  // 52 px, il doit tenir dans un plan large de moins de 400 unités.
  const contenuMarcheur = marcheur.trim().replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  return `
  <section class="route-section">
    <div class="route-map-sticky">
      <div class="jour-titres">
${jours.map((j, i) => `        <div class="jour-titre" data-jour="${i + 1}">${j.titre}</div>`).join("\n")}
      </div>
      <svg class="route-svg" viewBox="${vue}" id="routeSvg">
${fond}
${jours.map((j, i) => `
        <g class="jour" data-jour="${i + 1}">
          <path class="jour-trace" d="${j.d}"></path>
${j.reperes.map((p, n) => `
          <g class="jour-point" transform="translate(${p.x},${p.y})">
            <circle r="8"></circle>
            <text class="jour-num" y="3.4" text-anchor="middle">${n + 1}</text>
            <text class="jour-label" y="${p.dessous ? 22 : -13}" text-anchor="middle">${p.label}</text>
          </g>`).join("")}
        </g>`).join("")}
${contenuMarcheur ? `
        <g class="marcheuse-plan" id="marcheusePlan" transform="translate(${depart.x},${depart.y}) scale(0.3)">
          <g transform="translate(-41,-40)">${contenuMarcheur}</g>
        </g>` : ""}
      </svg>
    </div>

${cartes}
  </section>`;
};

// Variante « plan dominant » : la carte occupe l'essentiel de l'écran, les
// informations de la journée s'incorporent directement dedans — un bandeau
// en bas du plan, mis à jour par script, plutôt qu'une carte séparée plus
// bas qu'il fallait faire défiler pour l'atteindre.
//
// `etapes` porte les données (trajet, astuce, chiffres, photo) : contrairement
// à `htmlJours`, cette variante ne prend plus de HTML de carte pré-rendu en
// paramètre, elle génère elle-même le bandeau et le peuple en JS.
//
// Fond de plan : une image raster (vraies tuiles OpenStreetMap, voir
// scripts/fetch-map-edimbourg.py), pas un décor dessiné à la main — les
// distances et proportions entre repères sont donc réelles. Le viewBox
// du SVG est calé en pixels sur cette image (imageWidth×imageHeight),
// et les tracés/repères sont directement dans ce même repère de pixels.
export const htmlPlein = (jours, etapes, image = "", imageWidth = 0, imageHeight = 0, marcheur = "") => {
  const depart = jours[0].reperes[0];
  const contenuMarcheur = marcheur.trim().replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");
  return `
  <section class="route-section plein">
    <div class="route-map-sticky plein">
      <div class="jour-titres">
${jours.map((j, i) => `        <div class="jour-titre" data-jour="${i + 1}">${j.titre}</div>`).join("\n")}
      </div>
      <svg class="route-svg" viewBox="0 0 ${imageWidth} ${imageHeight}" id="routeSvg">
        <image href="${image}" x="0" y="0" width="${imageWidth}" height="${imageHeight}" preserveAspectRatio="xMidYMid slice"></image>
        <!-- Licence ODbL des données OpenStreetMap : attribution requise
             sur la carte elle-même, pas seulement dans le code. Décalée
             du bas (pas juste -5) : le bandeau d'info se pose par-dessus
             le bas de la carte (voir .plan-info, margin-top négatif) et
             la cacherait complètement collée au bord. -->
        <text class="plan-credit" x="${imageWidth - 4}" y="${imageHeight - 95}" text-anchor="end">© OpenStreetMap contributors</text>
${jours.map((j, i) => `
        <g class="jour" data-jour="${i + 1}">
          <path class="jour-trace-halo" d="${j.d}"></path>
          <path class="jour-trace" d="${j.d}"></path>
${j.reperes.map((p, n) => `
          <g class="jour-point" transform="translate(${p.x},${p.y})">
            <circle r="8"></circle>
            <text class="jour-num" y="3.4" text-anchor="middle">${n + 1}</text>
            <text class="jour-label" y="${p.dessous ? 22 : -13}" text-anchor="middle">${p.label}</text>
          </g>`).join("")}
        </g>`).join("")}
${contenuMarcheur ? `
        <g class="marcheuse-plan" id="marcheusePlan" transform="translate(${depart.x},${depart.y}) scale(0.46)">
          <g transform="translate(-41,-40)">${contenuMarcheur}</g>
        </g>` : ""}
      </svg>
      <!-- Bloc normal en flux, tiré sur la carte par une marge négative :
           pas de position absolute ni de grille, donc pas d'ambiguïté de
           largeur pour le texte qu'il contient. -->
      <div class="plan-info" id="planInfo">
        <img class="plan-info-photo" id="planInfoPhoto" src="" alt="">
        <!-- Le trajet et les horaires sont déjà lisibles sur le plan
             (titre de journée, pastilles numérotées) : le bandeau ne
             répète pas cette information, il n'ajoute que l'astuce. -->
        <p class="day-astuce" id="planInfoAstuce"></p>
      </div>
    </div>

${etapes.map((e, i) => `    <div class="route-step" data-idx="${i + 1}">
      <div class="jour-detail">
        <div class="day-route">${e.trajet}</div>
        <p class="day-note">${e.note}</p>
        <div class="stats">
${e.chiffres.map((c) => `          <div class="stat"><b>${c.valeur}</b><span>${c.libelle}</span></div>`).join("\n")}
        </div>
${e.credit ? `        <p class="jour-detail-credit">Photo — ${e.credit}</p>` : ""}
      </div>
    </div>`).join("\n")}
  </section>`;
};

export const jsPlein = (etapesData) => `
(function () {
  var jours = document.querySelectorAll(".jour");
  var etapes = document.querySelectorAll(".route-step");
  if (!jours.length || !etapes.length) return;

  var titres = document.querySelectorAll(".jour-titre");
  var marcheusePlan = document.getElementById("marcheusePlan");
  var infoPhoto = document.getElementById("planInfoPhoto");
  var infoAstuce = document.getElementById("planInfoAstuce");
  var donnees = ${JSON.stringify(etapesData)};
  var jourActif = 1;

  function activer(n) {
    jourActif = n;
    jours.forEach(function (g) {
      g.classList.toggle("actif", Number(g.dataset.jour) === n);
    });
    titres.forEach(function (t) {
      t.classList.toggle("actif", Number(t.dataset.jour) === n);
    });
    var e = donnees[n - 1];
    if (!e || !infoAstuce) return;
    infoPhoto.src = e.photo;
    infoPhoto.alt = e.trajet;
    infoAstuce.textContent = e.astuce || "";
  }
  activer(1);

  // Fait avancer le marcheur le long du tracé du jour actif, à la fraction
  // de défilement de sa zone.
  function positionner() {
    if (!marcheusePlan) return;
    var path = document.querySelector('.jour[data-jour="' + jourActif + '"] .jour-trace');
    var etape = document.querySelector('.route-step[data-idx="' + jourActif + '"]');
    if (!path || !etape) return;
    var r = etape.getBoundingClientRect();
    var vh = window.innerHeight;
    var f = (vh - r.top) / (vh + r.height);
    f = Math.max(0, Math.min(1, f));
    var len = path.getTotalLength();
    var p = path.getPointAtLength(f * len);
    var suivant = path.getPointAtLength(Math.min(len, (f + 0.02) * len));
    var sens = suivant.x >= p.x ? 1 : -1;
    marcheusePlan.setAttribute("transform",
      "translate(" + p.x + "," + p.y + ") scale(" + (0.46 * sens) + ",0.46)");
  }

  var observer = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (e.isIntersecting) activer(Number(e.target.dataset.idx));
    });
    positionner();
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });
  etapes.forEach(function (e) { observer.observe(e); });

  window.addEventListener("scroll", positionner, { passive: true });
  positionner();
})();
`;

export const jsJours = `
(function () {
  var jours = document.querySelectorAll(".jour");
  var etapes = document.querySelectorAll(".route-step");
  if (!jours.length || !etapes.length) return;

  var titres = document.querySelectorAll(".jour-titre");
  var marcheusePlan = document.getElementById("marcheusePlan");
  var jourActif = 1;

  function activer(n) {
    jourActif = n;
    jours.forEach(function (g) {
      g.classList.toggle("actif", Number(g.dataset.jour) === n);
    });
    titres.forEach(function (t) {
      t.classList.toggle("actif", Number(t.dataset.jour) === n);
    });
  }
  activer(1);

  // Fait avancer le marcheur le long du tracé du jour actif, à la fraction
  // de défilement de son étape — plutôt qu'un chemin séparé sans rapport
  // avec la géographie affichée.
  function positionner() {
    if (!marcheusePlan) return;
    var path = document.querySelector('.jour[data-jour="' + jourActif + '"] .jour-trace');
    var etape = document.querySelector('.route-step[data-idx="' + jourActif + '"]');
    if (!path || !etape) return;
    var r = etape.getBoundingClientRect();
    var vh = window.innerHeight;
    var f = (vh - r.top) / (vh + r.height);
    f = Math.max(0, Math.min(1, f));
    var len = path.getTotalLength();
    var p = path.getPointAtLength(f * len);
    var suivant = path.getPointAtLength(Math.min(len, (f + 0.02) * len));
    var sens = suivant.x >= p.x ? 1 : -1;
    marcheusePlan.setAttribute("transform",
      "translate(" + p.x + "," + p.y + ") scale(" + (0.3 * sens) + ",0.3)");
  }

  var observer = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (e.isIntersecting) activer(Number(e.target.dataset.idx));
    });
    positionner();
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });
  etapes.forEach(function (e) { observer.observe(e); });

  window.addEventListener("scroll", positionner, { passive: true });
  positionner();
})();
`;

export const css = (fondEtapes) => `
  /* F-09 · Les étapes ont leur propre fond : teinte plus soutenue et courbes
     de niveau, pour qu'on les distingue au premier coup d'œil. */
  .route-section {
${fondEtapes}
    color: var(--encre);
  }
  .route-map-sticky {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--fond-2);
    padding: 0.8rem 1rem 0.6rem;
  }
  .route-svg { width: 100%; height: auto; display: block; }
  .trail-bg, .trail-progress {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .trail-bg { stroke: rgba(var(--plan-rgb), 0.45); stroke-width: 4; stroke-dasharray: 3 7; }
  .trail-progress {
    stroke: var(--accent);
    stroke-width: 5;
    transition: stroke-dashoffset 0.5s ease;
  }
  .waypoint circle { fill: var(--fond-2); stroke: rgba(var(--plan-rgb), 0.55); stroke-width: 2.5; transition: all 0.3s ease; }
  .waypoint.active circle { fill: var(--accent); stroke: var(--accent); r: 7; }
  .waypoint text {
    font-family: Georgia, serif;
    font-size: 13px;
    fill: var(--encre);
    opacity: 0.65;
    transition: opacity 0.3s ease;
  }
  .waypoint.active text { opacity: 1; font-weight: 700; }
  /* Fond de plan : rues, parcs et reliefs, sous le tracé. */
  .plan-rue { fill: none; stroke: rgba(var(--plan-rgb), 0.5); stroke-width: 1.6; stroke-linecap: round; }
  .plan-rue-fine { fill: none; stroke: rgba(var(--plan-rgb), 0.3); stroke-width: 1; stroke-linecap: round; }
  .plan-parc { fill: rgba(var(--plan-rgb), 0.14); stroke: rgba(var(--plan-rgb), 0.3); stroke-width: 1; }
  .plan-eau { fill: none; stroke: rgba(var(--eau-rgb), 0.55); stroke-width: 2; stroke-linecap: round; }
  .plan-relief { fill: rgba(var(--plan-rgb), 0.13); stroke: rgba(var(--plan-rgb), 0.3); stroke-width: 1; }
  .plan-legende {
    font-family: Georgia, serif;
    font-size: 9.5px;
    fill: var(--encre);
    opacity: 0.55;
  }

  /* Le titre de la journée en cours, au-dessus du plan. */
  .jour-titres { position: relative; height: 1.5rem; margin-bottom: 0.2rem; }
  .jour-titre {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    /* Le bouton son est fixe en haut à droite : on lui laisse sa place,
       sinon les titres les plus longs passent dessous. */
    right: 3.2rem;
    text-align: center;
    font-size: 0.82rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent);
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  .jour-titre.actif { opacity: 1; }

  /* Parcours par journée : seul le jour en cours est lisible, les autres
     restent en trace légère pour situer le reste du séjour. */
  .jour { transition: opacity 0.45s ease; opacity: 0.14; }
  .jour.actif { opacity: 1; }
  /* Sur un fond de plan réel (tuiles OSM), le tracé a besoin d'un liseré
     sombre pour rester lisible quel que soit ce qu'il traverse (rue
     claire, parc vert, bâti). Le halo suit le même « d » que le tracé. */
  .jour-trace-halo {
    fill: none;
    stroke: var(--fond);
    stroke-width: 7;
    stroke-linecap: round;
    opacity: 0.85;
    transition: stroke-width 0.4s ease;
  }
  .jour.actif .jour-trace-halo { stroke-width: 10; }
  .jour-trace {
    fill: none;
    stroke: var(--accent);
    stroke-width: 3;
    stroke-linecap: round;
    stroke-dasharray: 3 7;
    transition: stroke-width 0.4s ease;
  }
  .jour.actif .jour-trace { stroke-width: 6; stroke-dasharray: none; }
  .jour-point circle {
    fill: var(--fond-2);
    stroke: var(--accent);
    stroke-width: 2.4;
  }
  .jour.actif .jour-point circle { fill: var(--accent); stroke: var(--fond); }
  .jour-num {
    font-family: Georgia, serif;
    font-size: 10px;
    font-weight: 700;
    fill: var(--accent);
    opacity: 0;
  }
  .jour.actif .jour-num { fill: var(--fond); opacity: 1; }
  /* Seule la journée en cours nomme ses arrêts : afficher les trois
     séries de libellés rendait le plan illisible. */
  .jour-label {
    font-family: Georgia, serif;
    font-size: 12.5px;
    fill: var(--encre);
    opacity: 0;
    transition: opacity 0.4s ease;
    /* Liseré clair derrière le texte : lisible sur les tuiles OSM,
       quelle que soit la couleur du sol à cet endroit. */
    paint-order: stroke;
    stroke: var(--fond-2);
    stroke-width: 3px;
    stroke-linejoin: round;
  }
  .jour.actif .jour-label { font-weight: 700; opacity: 1; }

  .plan-credit {
    font-family: Georgia, serif;
    font-size: 7px;
    fill: var(--encre);
    opacity: 0.75;
    paint-order: stroke;
    stroke: var(--fond-2);
    stroke-width: 2.5px;
    stroke-linejoin: round;
  }

  .hiker-marker { transition: transform 0.5s ease; }
  .hiker-marker circle { fill: var(--accent-clair); stroke: var(--encre); stroke-width: 1.5; }

  /* Le duo, incorporé au plan : il suit le tracé du jour actif. */
  .marcheuse-plan {
    transition: transform 0.5s ease-out;
    filter: drop-shadow(0 1px 2px rgba(0,0,0,0.35));
  }

  /* Variante « plan dominant » : le bandeau d'info se pose directement sur
     le plan plutôt que d'exister comme carte séparée à faire défiler. */
  .route-map-sticky.plein { padding: 0; }
  .route-map-sticky.plein .jour-titres {
    margin: 0;
    padding: 0.7rem 1rem 0.3rem;
  }
  /* Bandeau en flux normal, tiré sur le bas de la carte par une marge
     négative : pas de position absolute ni de grille superposant deux
     éléments, donc pas d'ambiguïté de largeur pour le texte qu'il contient. */
  .route-svg { width: 100%; height: auto; display: block; }
  .plan-info {
    position: relative;
    z-index: 1;
    margin-top: -78px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 1.1rem 0.9rem 0.7rem;
    background: linear-gradient(180deg,
      rgba(0,0,0,0) 0%,
      var(--fond-2) 46%);
  }
  .plan-info-photo {
    width: 44px;
    height: 44px;
    border-radius: 6px;
    object-fit: cover;
    flex: none;
    box-shadow: 0 3px 8px rgba(0,0,0,0.35);
  }
  /* Le trajet et les horaires sont déjà lisibles sur le plan (titre de
     journée, pastilles numérotées) : une seule ligne suffit ici. */
  .plan-info .day-astuce {
    flex: 1 1 0%;
    min-width: 0;
    max-width: 100%;
    overflow-wrap: break-word;
    font-size: 0.76rem;
    line-height: 1.35;
    text-align: left;
    opacity: 0.9;
    margin: 0;
    padding-left: 0.55rem;
    border-left: 2px solid var(--accent);
  }

  /* Variante « plan dominant » seulement (.route-section.plein) : chaque
     .route-step porte le descriptif de sa journée, sous le plan collé. Il
     défile sur un fond plein (donc lisible, contrairement à un texte posé
     sur l'image) et sert en même temps de déclencheur pour le changement
     de journée. Calé en bas de la zone pour apparaître sous le plan, pas
     derrière lui. La variante /60 (htmlJours, sans .plein) garde ci-après
     sa règle .route-section .route-step d'origine, intacte. */
  .route-section.plein .route-step {
    min-height: 82vh;
    padding: 0 0.9rem 1.6rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-sizing: border-box;
  }
  .route-section.plein .jour-detail {
    width: 100%;
    max-width: 460px;
    margin: 0 auto;
    background: var(--fond);
    border-radius: 12px;
    padding: 1.15rem 1.3rem 1.3rem;
    box-shadow: 0 12px 28px rgba(0,0,0,0.32);
    text-align: center;
  }
  .route-section.plein .jour-detail .day-note { margin-top: 0; }
  .route-section.plein .jour-detail-credit {
    margin: 0.9rem 0 0;
    font-size: 0.62rem;
    letter-spacing: 0.02em;
    opacity: 0.55;
  }

  /* Variante /60 (htmlJours) : les .route-step ne portent qu'une carte
     compacte, le déclenchement du changement de journée se fait au
     défilement. Règle d'origine, inchangée. */
  .route-section .route-step {
    min-height: 62vh;
    padding: 0;
    display: block;
  }
`;

export const js = (reperes, fractions = [0.02, 0.36, 0.68, 1]) => `
(function () {
  var waypoints = ${JSON.stringify(reperes)};
  var progressPath = document.getElementById("trailProgress");
  var marker = document.getElementById("hikerMarker");
  var waypointEls = document.querySelectorAll(".waypoint");
  var total = progressPath.getTotalLength();
  progressPath.style.strokeDasharray = total;

  // Fraction du tracé parcourue à chaque point clé.
  var fractions = ${JSON.stringify(fractions)};

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
`;
