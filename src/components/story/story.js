// F-03 · Proposition ouverte · F-04 · Récapitulatif · F-05 · Vidéo optionnelle

// Deux sections d'enchaînement : l'invitation, puis la destination.
export const invitation = (separation, textes) => `
  <section class="panel p2">
    <h1>${textes.invitation.titre}</h1>
    <p>${textes.invitation.sous}</p>
    <p style="opacity:0.75; font-size:0.95rem;">${textes.invitation.note}</p>
    ${separation("var(--fond-3)")}
  </section>

  <section class="panel p3">
    <svg class="compass" viewBox="0 0 60 60" aria-hidden="true">
      <circle cx="30" cy="30" r="26" fill="none" stroke="currentColor" stroke-width="1.5"></circle>
      <path d="M30,6 L34,28 L30,54 L26,28 Z" fill="currentColor"></path>
      <path d="M6,30 L28,26 L54,30 L28,34 Z" fill="currentColor" opacity="0.5"></path>
    </svg>
    <div class="eyebrow">Destination</div>
    <div class="trek-title">${textes.destination.titre}</div>
    <div class="trek-sub">${textes.destination.sous}</div>
    <p style="margin-top:1rem">${textes.destination.format}</p>
    <p style="opacity:0.85; font-size:0.95rem;">${textes.destination.note}</p>
    <p style="opacity:0.7; font-size:0.9rem;">${textes.destination.invite}</p>
    ${separation("var(--fond)")}
  </section>`;

// Récapitulatif pratique, et la vidéo si elle a été renseignée.
export const conclusion = (textes, video) => `
  <section class="panel p7 no-arrow">
    <h2>${textes.conclusion.titre}</h2>
    <ul class="info-list">
${textes.conclusion.points.map((p) => `      <li>${p}</li>`).join("\n")}
    </ul>
    <p class="signature">${textes.conclusion.signature}</p>
  </section>
${video ? `
  <section class="panel p2 no-arrow">
    <div class="eyebrow">Un dernier mot</div>
    <video class="video" controls playsinline preload="metadata">
      <source src="/${video}" type="video/mp4">
    </video>
    <p style="opacity:0.75; font-size:0.9rem;">Appuie pour lancer</p>
  </section>` : ""}`;

export const css = `
  .compass { width: 44px; height: 44px; margin-bottom: 1rem; color: var(--accent-clair); }
  .trek-title {
    font-size: 2.3rem;
    font-weight: 700;
    margin: 0.2rem 0;
    letter-spacing: 0.02em;
  }
  .trek-sub { font-size: 1.1rem; opacity: 0.9; font-style: italic; }

  .info-list { max-width: 340px; text-align: left; margin-top: 1rem; }
  .info-list li { margin-bottom: 0.6rem; }
  .signature { margin-top: 2rem; font-size: 0.95rem; opacity: 0.75; font-style: italic; }

  .video {
    width: 100%;
    max-width: 340px;
    border-radius: 6px;
    border: 4px solid rgba(255,255,255,0.7);
    box-shadow: 0 4px 14px rgba(0,0,0,0.3);
    margin-bottom: 0.6rem;
  }
`;
