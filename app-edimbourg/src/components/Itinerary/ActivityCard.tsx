import type { Activity } from "../../data/itinerary";

interface Props {
  activity: Activity;
  rang: number;
  /** Le jour de l'étape : la fiche se lit seule, sans le titre de journée. */
  jour: string;
  carte: (element: HTMLElement | null) => void;
}

/**
 * Une étape du séjour, posée sous la carte.
 *
 * Elle ne porte jamais d'horaire : Hector est petit, il y a une poussette,
 * et le programme est une suite de grands moments, pas un emploi du temps.
 */
export function ActivityCard({ activity, rang, jour, carte }: Props) {
  return (
    <article className="beat beat--carte carte" ref={carte}>
      <p className="carte__entete">
        <span className="carte__rang">
          {String(rang).padStart(2, "0")}
        </span>
        <span className="eyebrow carte__quand">
          <span>{activity.time ? `${jour} ·` : jour}</span>{" "}
          {activity.time && <span>{activity.time}</span>}
        </span>
      </p>

      <h2 className="carte__titre">{activity.title}</h2>
      <p className="carte__texte">{activity.description}</p>

      {activity.aside && <p className="carte__aparte">{activity.aside}</p>}

      {activity.fallback && (
        <p className="carte__repli">
          <span className="carte__repli-mot">Si le temps s'en mêle</span>
          {activity.fallback}
        </p>
      )}
    </article>
  );
}
