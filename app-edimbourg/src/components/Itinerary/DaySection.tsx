import { useLayoutEffect, useRef } from "react";
import type L from "leaflet";
import type { Day } from "../../data/itinerary";
import { MARCHES } from "../../data/walks.generated";
import {
  camera,
  createDistanceMarker,
  createPlaceMarker,
  createRouteLine,
  setMapOpacity,
  setMapVeil,
  setMarkerLabel,
  setMarkerOpacity,
  setRoute,
} from "../../map/journeyMap";
import { useScrollScene } from "../../hooks/useScrollScene";
import {
  bearingAt,
  cumulativeLengths,
  pathBounds,
  pointAt,
  traveled,
} from "../../utils/geo";
import { easeInOut, lerp, range, showBeat } from "../../utils/beats";
import { ActivityCard } from "./ActivityCard";
import { BusIcon, StrollerIcon } from "../Journey/icons";

// La journée s'ouvre sur son titre, puis se marche. Le dernier dixième
// laisse la dernière étape à l'écran avant de passer à la suite.
const DEBUT_MARCHE = 0.12;
const FIN_MARCHE = 0.96;

// Part de chaque étape passée à l'arrêt, le reste étant le trajet vers la
// suivante. On s'arrête plus longtemps qu'on ne marche : c'est là qu'il y a
// quelque chose à lire.
const PART_ARRET = 0.62;

// Cadrages de la ville, en kilomètres visibles. On reste près du sol : la
// ville est ce qu'on est venu voir, et les noms de rue doivent se lire.
const ETENDUE_ARRET = 1.15;
const ETENDUE_TRAJET = 1.9;

// Au-delà, on ne traverse plus la ville à pied : le Britannia est à Leith,
// à quatre kilomètres et demi de Dean Village, ce qui ne se marche pas avec
// une poussette et un bébé de onze mois.
const SEUIL_BUS_KM = 2;

const enDistance = (km: number) =>
  km < 1
    ? `${Math.round((km * 1000) / 10) * 10} m`
    : `${km.toFixed(1).replace(".", ",")} km`;

interface Props {
  day: Day;
  /** Hauteur de la scène, en écrans. */
  ecrans: number;
}

/**
 * Une journée du séjour.
 *
 * Le scroll fait marcher : le tracé se dessine sur les vraies rues, la
 * caméra suit le pas, et chaque arrêt allume son repère puis sa carte. On
 * s'arrête à chaque étape, on repart vers la suivante — le rythme du
 * séjour, pas celui d'une liste.
 */
export function DaySection({ day, ecrans }: Props) {
  const section = useRef<HTMLElement>(null);
  const titre = useRef<HTMLDivElement>(null);
  const voile = useRef<HTMLDivElement>(null);
  const cartes = useRef<(HTMLElement | null)[]>([]);
  const poussette = useRef<HTMLDivElement>(null);
  const autobus = useRef<HTMLDivElement>(null);

  const ligne = useRef<L.Polyline | null>(null);
  const reperes = useRef<(L.Marker | null)[]>([]);
  const distances = useRef<(L.Marker | null)[]>([]);

  const marche = MARCHES[day.id];
  const cumul = useRef(cumulativeLengths(marche.chemin)).current;
  const cadre = useRef(pathBounds(marche.chemin)).current;

  // Chaque trajet entre deux étapes : sa longueur, son milieu — où se pose
  // l'étiquette — et la façon dont on le franchit.
  const trajets = useRef(
    day.activities.slice(0, -1).map((_, i) => {
      const km = (marche.arrets[i + 1] - marche.arrets[i]) * marche.km;
      return {
        km,
        bus: km > SEUIL_BUS_KM,
        milieu: pointAt(
          marche.chemin,
          cumul,
          (marche.arrets[i] + marche.arrets[i + 1]) / 2
        ),
      };
    })
  ).current;

  // De quoi tenir la journée entière à l'écran : l'écran est plus haut que
  // large, une journée étirée du nord au sud tient donc dans une étendue
  // plus étroite que sa hauteur. Plafonnée à ce que couvre le fond de ville.
  const etendueJour = Math.min(
    Math.max(cadre.largeurKm, cadre.hauteurKm / 2, 1.5) * 1.5,
    5
  );

  useLayoutEffect(() => {
    ligne.current = createRouteLine();
    reperes.current = day.activities.map((etape) =>
      // Une étape encore à choisir n'a pas de lieu : elle emprunte les
      // coordonnées de la précédente, et poser un repère dessus ferait deux
      // noms au même endroit.
      etape.toDecide
        ? null
        : createPlaceMarker({ name: etape.title, lat: etape.lat, lng: etape.lng })
    );
    distances.current = trajets.map((trajet) =>
      trajet.km > 0
        ? createDistanceMarker(
            trajet.milieu,
            `${enDistance(trajet.km)} · ${trajet.bus ? "en bus" : "à pied"}`
          )
        : null
    );
    return () => {
      ligne.current?.remove();
      reperes.current.forEach((repere) => repere?.remove());
      distances.current.forEach((etiquette) => etiquette?.remove());
    };
  }, [day, trajets]);

  useScrollScene(
    section,
    (p) => {
      setMapOpacity(1);
      setMapVeil(0);

      const nombre = day.activities.length;
      const creneau = (FIN_MARCHE - DEBUT_MARCHE) / nombre;

      // Où en est la marche, et quelle étape est à l'écran.
      let avancement = 0;
      let active = 0;
      let enTrajet = false;

      if (p > DEBUT_MARCHE) {
        const local = (Math.min(p, FIN_MARCHE) - DEBUT_MARCHE) / creneau;
        active = Math.min(Math.floor(local), nombre - 1);
        const dans = local - active;
        enTrajet = dans > PART_ARRET && active < nombre - 1;
        avancement = enTrajet
          ? lerp(
              marche.arrets[active],
              marche.arrets[active + 1],
              easeInOut((dans - PART_ARRET) / (1 - PART_ARRET))
            )
          : marche.arrets[active];
      }

      const [lat, lng] = pointAt(marche.chemin, cumul, avancement);

      // Au tout début, la journée est montrée en entier ; puis la caméra
      // descend au niveau de la rue et ne lâche plus le pas.
      const ouverture = easeInOut(range(p, 0, DEBUT_MARCHE));
      // On s'écarte un peu pendant qu'on marche, on se resserre à l'arrêt.
      const etendue = lerp(
        etendueJour,
        enTrajet ? ETENDUE_TRAJET : ETENDUE_ARRET,
        ouverture
      );
      camera(
        lerp(cadre.lat, lat, ouverture),
        lerp(cadre.lng, lng, ouverture),
        etendue
      );

      setRoute(ligne.current, traveled(marche.chemin, cumul, avancement));

      // Poussette ou bus, selon le trajet en cours. Tous deux sont de
      // profil : ils ne pivotent pas, ils se retournent selon le sens de la
      // marche.
      const trajet = enTrajet ? trajets[active] : null;
      const sens =
        trajet && bearingAt(marche.chemin, cumul, avancement) > 180 ? -1 : 1;
      [poussette.current, autobus.current].forEach((element, index) => {
        if (!element) return;
        const montre = trajet ? (index === 1) === trajet.bus : false;
        element.style.opacity = montre ? "1" : "0";
        element.style.transform = `translate(-50%, -50%) scaleX(${sens})`;
      });

      day.activities.forEach((_, i) => {
        // Un repère s'allume quand la marche l'atteint, et ne s'éteint plus.
        const atteint = avancement >= marche.arrets[i] - 0.001;
        setMarkerOpacity(reperes.current[i], atteint ? 1 : 0);
        // Une fois la journée finie, les repères restent mais se taisent : le
        // voyage s'accumule sur la carte sans que les noms s'empilent.
        setMarkerLabel(reperes.current[i], i === active && !enTrajet && p < 0.9);

        const debut = DEBUT_MARCHE + i * creneau;
        showBeat(
          cartes.current[i],
          p,
          debut + creneau * 0.06,
          debut + creneau * PART_ARRET,
          { fade: creneau * 0.12, rise: 12 }
        );
      });

      // L'étiquette d'un trajet apparaît quand on s'y engage, et reste.
      trajets.forEach((_, i) => {
        setMarkerOpacity(
          distances.current[i],
          range(avancement, marche.arrets[i], marche.arrets[i + 1])
        );
      });

      showBeat(titre.current, p, 0.01, DEBUT_MARCHE * 0.75, { fade: 0.04 });
      // Le titre s'annonce sur une ville assombrie, puis la ville revient.
      if (voile.current) {
        voile.current.style.opacity = String(
          0.8 * (1 - range(p, DEBUT_MARCHE * 0.6, DEBUT_MARCHE))
        );
      }
    },
    {
      // En remontant avant la journée, elle s'efface entièrement : le
      // voyage ne doit s'accumuler sur la carte que vers l'avant.
      onLeaveBack: () => {
        setRoute(ligne.current, []);
        reperes.current.forEach((repere) => setMarkerOpacity(repere, 0));
        distances.current.forEach((etiquette) => setMarkerOpacity(etiquette, 0));
      },
    }
  );

  return (
    <section
      className="act"
      ref={section}
      style={{ height: `${ecrans * 100}svh` }}
    >
      <div className="act__stage">
        <div className="scrim" ref={voile} />

        <div className="beat jour-titre" ref={titre}>
          <p className="eyebrow">{day.date}</p>
          <h2 className="display display--jour">{day.title}</h2>
          <p className="line line--small">{day.subtitle}</p>
        </div>

        {day.activities.map((activity, i) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            rang={i + 1}
            carte={(element) => {
              cartes.current[i] = element;
            }}
          />
        ))}
      </div>

      <div className="vehicle" ref={poussette}>
        <span className="vehicle__secousse">
          <StrollerIcon />
        </span>
      </div>
      <div className="vehicle" ref={autobus}>
        <BusIcon />
      </div>
    </section>
  );
}
