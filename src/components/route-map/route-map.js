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
export const htmlJours = (jours, cartes, fond = "", vue = "-30 -5 370 178") => `
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
      </svg>
    </div>

${cartes}
  </section>`;

export const jsJours = `
(function () {
  var jours = document.querySelectorAll(".jour");
  var etapes = document.querySelectorAll(".route-step");
  if (!jours.length || !etapes.length) return;

  var titres = document.querySelectorAll(".jour-titre");
  function activer(n) {
    jours.forEach(function (g) {
      g.classList.toggle("actif", Number(g.dataset.jour) === n);
    });
    titres.forEach(function (t) {
      t.classList.toggle("actif", Number(t.dataset.jour) === n);
    });
  }
  activer(1);

  var observer = new IntersectionObserver(function (entrees) {
    entrees.forEach(function (e) {
      if (e.isIntersecting) activer(Number(e.target.dataset.idx));
    });
  }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });
  etapes.forEach(function (e) { observer.observe(e); });
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
    inset: 0;
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
  }
  .jour.actif .jour-label { font-weight: 700; opacity: 1; }

  .hiker-marker { transition: transform 0.5s ease; }
  .hiker-marker circle { fill: var(--accent-clair); stroke: var(--encre); stroke-width: 1.5; }
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
