// F-17 · Plan interactif des étapes, collé en haut de la section.
import { TRACE_PLAN, REPERES } from "../../data/steps.js";
import { html as etapes } from "../step-card/step-card.js";

export const html = `
  <section class="route-section">
    <div class="route-map-sticky">
      <svg class="route-svg" viewBox="-30 -5 370 175" id="routeSvg">
        <path class="trail-bg" d="${TRACE_PLAN}"></path>
        <path class="trail-progress" id="trailProgress" d="${TRACE_PLAN}"></path>
        ${REPERES.map((r, i) => `
        <g class="waypoint" data-idx="${i}" transform="translate(${r.x},${r.y})">
          <circle r="5"></circle>
          <text x="0" y="${i % 2 === 0 ? -12 : 20}" text-anchor="middle">${r.label}</text>
        </g>`).join("")}
        <g class="hiker-marker" id="hikerMarker" transform="translate(${REPERES[0].x},${REPERES[0].y})">
          <circle r="6"></circle>
        </g>
      </svg>
    </div>

${etapes}
  </section>`;

export const css = `
  /* F-09 · Les étapes ont leur propre fond : teinte plus soutenue et courbes
     de niveau, pour qu'on les distingue au premier coup d'œil. */
  .route-section {
    background-color: #efe3ca;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'%3E%3Cg fill='none' stroke='%23c2ab7e' stroke-width='1.1' opacity='0.55'%3E%3Cpath d='M-10,24 C30,8 74,40 160,18'/%3E%3Cpath d='M-10,52 C34,34 78,68 160,44'/%3E%3Cpath d='M-10,80 C28,64 82,96 160,72'/%3E%3Cpath d='M-10,108 C36,92 76,124 160,100'/%3E%3Cpath d='M-10,136 C30,120 80,150 160,128'/%3E%3C/g%3E%3C/svg%3E");
    color: var(--encre);
  }
  .route-map-sticky {
    position: sticky;
    top: 0;
    z-index: 2;
    background: var(--papier2);
    padding: 0.8rem 1rem 0.6rem;
  }
  .route-svg { width: 100%; height: auto; display: block; }
  .trail-bg, .trail-progress {
    fill: none;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .trail-bg { stroke: rgba(43,32,24,0.45); stroke-width: 4; stroke-dasharray: 3 7; }
  .trail-progress {
    stroke: var(--soleil);
    stroke-width: 5;
    transition: stroke-dashoffset 0.5s ease;
  }
  .waypoint circle { fill: var(--papier2); stroke: rgba(43,32,24,0.55); stroke-width: 2.5; transition: all 0.3s ease; }
  .waypoint.active circle { fill: var(--soleil); stroke: var(--soleil); r: 7; }
  .waypoint text {
    font-family: Georgia, serif;
    font-size: 13px;
    fill: var(--encre);
    opacity: 0.65;
    transition: opacity 0.3s ease;
  }
  .waypoint.active text { opacity: 1; font-weight: 700; }
  .hiker-marker { transition: transform 0.5s ease; }
  .hiker-marker circle { fill: var(--mustard); stroke: var(--encre); stroke-width: 1.5; }
`;

export const js = `
(function () {
  var waypoints = ${JSON.stringify(REPERES)};
  var progressPath = document.getElementById("trailProgress");
  var marker = document.getElementById("hikerMarker");
  var waypointEls = document.querySelectorAll(".waypoint");
  var total = progressPath.getTotalLength();
  progressPath.style.strokeDasharray = total;

  // Fraction du tracé parcourue à chaque point clé.
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
`;
