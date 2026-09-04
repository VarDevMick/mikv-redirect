// F-13 · Sentier vertical · F-14 · Randonneuse · F-15 · Bivouacs · F-16 · Couchage

// Tracé du sentier : lacets réguliers sur 1000 unités de haut. La randonneuse
// suit exactement cette courbe, et la portion parcourue se dessine derrière.
export const SENTIER_D = (() => {
  let d = "M34,0";
  const lobes = 8, pas = 1000 / lobes;
  for (let i = 0; i < lobes; i++) {
    const y = i * pas;
    const a = i % 2 ? 14 : 54;
    const b = i % 2 ? 54 : 14;
    d += ` C${a},${y + pas * 0.32} ${b},${y + pas * 0.68} 34,${y + pas}`;
  }
  return d;
})();

// `figures` vient du thème : qui marche, où il s'arrête, où il se repose.
export const html = (figures) => `
  <div class="sentier" aria-hidden="true">
    <svg class="trace" viewBox="0 0 68 1000" preserveAspectRatio="none">
      <path class="trace-avenir" d="${SENTIER_D}"></path>
      <path class="trace-passe" id="tracePasse" d="${SENTIER_D}"></path>
    </svg>
  </div>
  <div class="camp" id="camp" aria-hidden="true">${figures.etape}</div>
  <div class="dodo" id="dodo" aria-hidden="true">${figures.repos}</div>
  <div class="marcheuse" id="marcheuse" aria-hidden="true">${figures.marcheur}</div>`;

export const css = `
  /* Aucun fond : le sentier passe simplement au-dessus des sections. */
  .sentier {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 68px;
    z-index: 4;
    pointer-events: none;
  }
  .trace { width: 68px; height: 100%; display: block; }
  .trace-avenir {
    fill: none;
    stroke: var(--trait);
    opacity: 0.55;
    stroke-width: 2;
    stroke-dasharray: 5 9;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }
  .trace-passe {
    fill: none;
    stroke: var(--parcouru);
    stroke-width: 2.8;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }

  .marcheuse {
    position: fixed;
    left: 0;
    top: 0;
    width: 52px;
    z-index: 5;
    pointer-events: none;
    will-change: transform;
    opacity: 0; /* cachée tant que le défilement n'a pas commencé */
    transition: transform 0.15s ease-out, opacity 0.25s ease;
    filter: drop-shadow(0 2px 3px rgba(51,48,44,0.18));
  }
  .marcheuse svg { width: 100%; height: auto; display: block; }

  /* La démarche : le buste tangue, les membres alternent. */
  .buste { animation: tangage 0.62s ease-in-out infinite alternate; }
  @keyframes tangage {
    from { transform: translateY(0.6px) rotate(-1.4deg); }
    to { transform: translateY(-0.6px) rotate(1.4deg); }
  }
  .jambe, .bras, .meche { transform-box: fill-box; }
  .jambe { transform-origin: 50% 0%; }
  .bras { transform-origin: 10% 10%; }
  .meche { transform-origin: 60% 0%; }
  .jambe-avant { animation: pas 0.62s ease-in-out infinite alternate; }
  .jambe-arriere { animation: pas 0.62s ease-in-out infinite alternate-reverse; }
  .bras { animation: balancier 0.62s ease-in-out infinite alternate-reverse; }
  .meche { animation: meche 1.5s ease-in-out infinite alternate; }
  @keyframes pas {
    from { transform: rotate(-19deg); }
    to { transform: rotate(19deg); }
  }
  @keyframes balancier {
    from { transform: rotate(-10deg); }
    to { transform: rotate(12deg); }
  }
  @keyframes meche {
    from { transform: rotate(-5deg); }
    to { transform: rotate(6deg); }
  }
  /* À l'arrêt au bivouac, elle cesse de marcher. */
  .marcheuse.campe .jambe-avant,
  .marcheuse.campe .jambe-arriere,
  .marcheuse.campe .bras,
  .marcheuse.campe .buste { animation: none; }

  .camp {
    position: fixed;
    left: 0;
    top: 0;
    width: 34px;
    z-index: 5;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.4s ease;
    filter: drop-shadow(0 2px 3px rgba(51,48,44,0.16));
  }
  .camp svg { width: 100%; height: auto; display: block; }
  .camp.plante { opacity: 1; }

  /* Fin de parcours : le couchage, au milieu bas de la page. */
  .dodo {
    position: fixed;
    left: calc(50% + 34px);   /* centré sur le contenu, hors colonne */
    bottom: 7%;
    width: 160px;
    margin-left: -80px;
    z-index: 5;
    pointer-events: none;
    opacity: 0;
    transform: translateY(12px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    filter: drop-shadow(0 2px 4px rgba(51,48,44,0.18));
  }
  .dodo.dort { opacity: 1; transform: translateY(0); }
  .dodo svg { width: 100%; height: auto; display: block; }
  .souffle {
    transform-box: fill-box;
    transform-origin: 50% 100%;
    animation: souffle 3.4s ease-in-out infinite alternate;
  }
  @keyframes souffle {
    from { transform: scaleY(0.985); }
    to { transform: scaleY(1.025); }
  }
  .zzz { opacity: 0; animation: monte 3.6s ease-in-out infinite; }
  .zzz2 { animation-delay: 1.2s; }
  .zzz3 { animation-delay: 2.4s; }
  @keyframes monte {
    0% { opacity: 0; transform: translate(0, 4px); }
    30% { opacity: 0.9; }
    100% { opacity: 0; transform: translate(5px, -12px); }
  }

  @media (prefers-reduced-motion: reduce) {
    .jambe-avant, .jambe-arriere, .bras, .meche, .buste, .souffle, .zzz { animation: none; }
  }
`;

export const js = `
// La randonneuse descend le sentier au rythme du défilement, plante sa tente
// aux étapes, puis rejoint le bas de page pour dormir.
(function () {
  var marcheuse = document.getElementById("marcheuse");
  var camp = document.getElementById("camp");
  if (!marcheuse || !camp) return;

  var SORTIE = 0.07;   // fraction de scroll pendant laquelle elle sort du "30"
  var APPROCHE = 0.88; // à partir d'ici, elle converge vers le bas de page
  var COUCHEE = 0.985; // au-delà, elle est dans son duvet
  var etapes = [];
  var depart = null;   // position du "30", son point d'apparition
  var dodo = document.getElementById("dodo");
  var trace = document.getElementById("tracePasse");
  var longueurTrace = 0;

  // Convertit une fraction de parcours en position à l'écran, en suivant
  // la courbe du sentier. Le viewBox fait 1000 de haut, étiré sur la fenêtre.
  function pointSur(f) {
    if (!trace || !longueurTrace) {
      return { x: 34, y: 0.1 * window.innerHeight + f * window.innerHeight * 0.72 };
    }
    var p = trace.getPointAtLength(Math.max(0, Math.min(1, f)) * longueurTrace);
    return { x: p.x, y: p.y * (window.innerHeight / 1000) };
  }

  function defilement() {
    var doc = document.documentElement;
    var total = doc.scrollHeight - window.innerHeight;
    var y = window.scrollY || doc.scrollTop || 0;
    return total > 0 ? Math.min(1, Math.max(0, y / total)) : 0;
  }

  function mesurer() {
    if (trace) {
      longueurTrace = trace.getTotalLength();
      trace.style.strokeDasharray = longueurTrace;
      trace.style.strokeDashoffset = longueurTrace;
    }
    // Point de départ : le "30", mesuré page en haut.
    var trente = document.getElementById("grosTrente");
    if (trente) {
      var r = trente.getBoundingClientRect();
      depart = {
        x: r.left + r.width / 2 - 26 + window.scrollX,
        y: r.top + r.height * 0.55 + window.scrollY
      };
    }
    var total = document.documentElement.scrollHeight - window.innerHeight;
    etapes = [].slice.call(document.querySelectorAll(".route-step")).map(function (el) {
      var r = el.getBoundingClientRect();
      var centre = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
      return total > 0 ? Math.min(1, Math.max(0, centre / total)) : 0;
    });
    placer();
  }

  function placer() {
    var f = defilement();
    var largeur = window.innerWidth;
    var hauteur = window.innerHeight;
    var taille = marcheuse.offsetWidth || 52;

    // Elle se place exactement sur le tracé, et le chemin parcouru se dessine.
    var pos = pointSur(f);
    var suivant = pointSur(Math.min(1, f + 0.012));
    var x = pos.x - taille / 2;
    var yy = pos.y - 56;
    var sens = suivant.x >= pos.x ? 1 : -1;
    if (trace && longueurTrace) {
      trace.style.strokeDashoffset = longueurTrace * (1 - f);
    }

    // Bivouac : au niveau d'une étape, elle s'arrête près de sa tente.
    var proche = etapes.some(function (p) { return Math.abs(f - p) < 0.035; });
    if (proche) {
      var surSentier = Math.max(2, Math.min(34, pos.x - 17));
      camp.style.transform = "translate(" + surSentier + "px," + (pos.y - 6) + "px)";
      x = surSentier + 30;
      sens = -1; // tournée vers la tente
    }

    // Apparition : invisible en haut de page, elle émerge du "30".
    var echelle = 1;
    var opacite = 1;
    if (f < SORTIE && depart) {
      var t = f / SORTIE;              // 0 = dans le "30", 1 = sur le sentier
      var doux = t * t * (3 - 2 * t);  // adoucit le trajet
      x = depart.x + (x - depart.x) * doux;
      yy = depart.y + (yy - depart.y) * doux;
      echelle = 0.25 + 0.75 * doux;
      opacite = Math.min(1, t * 2.2);
    }

    // Fin : elle rejoint le milieu bas puis cède la place au couchage.
    var dort = f >= COUCHEE;
    if (f > APPROCHE && depart) {
      var ta = Math.min(1, (f - APPROCHE) / (COUCHEE - APPROCHE));
      var lisse = ta * ta * (3 - 2 * ta);
      var cible = largeur / 2 + 29 - taille / 2;
      x = x + (cible - x) * lisse;
      yy = yy + (hauteur * 0.8 - yy) * lisse;
      sens = 1;
      opacite = Math.min(opacite, 1 - lisse); // elle s'efface en se couchant
      proche = false;
    }
    if (dodo) dodo.classList.toggle("dort", dort);
    if (dort) { camp.classList.remove("plante"); }

    marcheuse.style.opacity = opacite;
    marcheuse.style.transform =
      "translate(" + x + "px," + yy + "px) scale(" + echelle + ") scaleX(" + sens + ")";
    marcheuse.classList.toggle("campe", proche);
    camp.classList.toggle("plante", proche);
  }

  window.addEventListener("scroll", placer, { passive: true });
  window.addEventListener("resize", mesurer);
  window.addEventListener("load", mesurer);
  mesurer();
})();
`;
