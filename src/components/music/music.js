// F-18 · Musique d'anniversaire, synthétisée par l'API Web Audio.
//
// La mélodie est du domaine public et générée à la volée : aucun fichier à
// héberger, aucun droit à acquitter, zéro octet transféré.
//
// Contrainte navigateur : le son est interdit sans geste utilisateur, et un
// simple défilement n'en est pas un. Le code déverrouille donc la sortie
// audio par un tampon muet joué pendant le geste lui-même, et réessaie à
// chaque geste suivant si le navigateur a refusé.

export const html = `
  <button class="son" id="btnSon" type="button" aria-label="Couper ou relancer la musique">&#9835;</button>
  <div class="son-astuce" id="astuceSon">Appuie pour la musique</div>`;

export const css = `
  .son {
    position: fixed;
    top: 14px;
    right: 14px;
    z-index: 10;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1.5px solid rgba(51,48,44,0.35);
    background: rgba(253,251,246,0.85);
    color: var(--encre);
    font-size: 1.1rem;
    line-height: 1;
    cursor: pointer;
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px);
  }
  .son.coupe { opacity: 0.45; }
  .son-astuce {
    position: fixed;
    top: 22px;
    right: 66px;
    z-index: 10;
    font-size: 0.72rem;
    letter-spacing: 0.04em;
    color: var(--fond);
    background: rgba(51,48,44,0.8);
    padding: 5px 9px;
    border-radius: 12px;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease;
  }
  .son-astuce.visible { opacity: 0.9; }

  /* Repli visible : tant que la musique n'a pas pu démarrer, le bouton se
     signale, puis une mention apparaît si le défilement a commencé sans son. */
  .son.attente { animation: pulse 1.8s ease-in-out infinite; }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(226,181,59,0.5); }
    50% { box-shadow: 0 0 0 9px rgba(226,181,59,0); }
  }
`;

export const js = `
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
  var astuce = document.getElementById("astuceSon");
  bouton.classList.add("attente");

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

  // iOS n'ouvre vraiment la sortie audio que si un son, meme muet, part
  // pendant le geste utilisateur lui-meme.
  function debloquer(c) {
    try {
      var tampon = c.createBuffer(1, 1, 22050);
      var source = c.createBufferSource();
      source.buffer = tampon;
      source.connect(c.destination);
      if (source.start) source.start(0); else source.noteOn(0);
    } catch (err) {}
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
    bouton.classList.remove("attente");
    if (astuce) astuce.classList.remove("visible");
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
    debloquer(c);
    // Le contexte nait suspendu : il faut le reveiller dans le geste meme.
    if (c.state !== "running" && c.resume) {
      c.resume().then(function () {
        // Si le reveil echoue, on laisse le prochain geste retenter.
        if (c.state === "running") { lance = true; jouer(); }
      }).catch(function () {});
    } else {
      lance = true;
      jouer();
    }
  }
  // Chrome comme Safari n'acceptent que des gestes "discrets" (appui, clic,
  // touche) comme activation valide : un simple defilement ne suffit pas.
  ["touchend", "click", "keydown", "pointerup", "pointerdown", "scroll"].forEach(function (ev) {
    window.addEventListener(ev, demarrer, { passive: true });
    document.addEventListener(ev, demarrer, { passive: true });
  });

  // Si le defilement a commence sans que le son ait pu demarrer, on le dit.
  window.addEventListener("scroll", function () {
    setTimeout(function () {
      if (!enCours && astuce) astuce.classList.add("visible");
    }, 1200);
  }, { passive: true, once: true });

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

`;
