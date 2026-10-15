import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapLayer } from "./components/Map/MapLayer";
import { Intro } from "./components/Intro/Intro";
import { Buildup } from "./components/Buildup/Buildup";
import { RoadTrip } from "./components/Journey/RoadTrip";
import { Flight } from "./components/Journey/Flight";
import { DestinationReveal } from "./components/DestinationReveal/DestinationReveal";
import { CityTransition } from "./components/CityTransition/CityTransition";
import { DaySection } from "./components/Itinerary/DaySection";
import { Final } from "./components/Final/Final";
import { ScrollGuide } from "./components/ScrollGuide/ScrollGuide";
import { Music } from "./components/Music/Music";
import { DAYS } from "./data/itinerary";

export default function App() {
  useEffect(() => {
    // Les polices changent la hauteur des textes : une fois chargées, les
    // scènes remesurent leur portée.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <MapLayer />

      {/* L'ordre du récit : on part sans savoir où, et la ville ne se nomme
          qu'une fois l'avion posé. Les trois journées s'enchaînent sans
          rien entre elles — le voyage ne doit pas être interrompu. */}
      <main className="story">
        <Intro />
        <Buildup />
        <RoadTrip />
        <Flight />
        <DestinationReveal />

        <CityTransition />
        <DaySection day={DAYS[0]} ecrans={9} />
        <DaySection day={DAYS[1]} ecrans={9} />
        <DaySection day={DAYS[2]} ecrans={9} />
        <Final />
      </main>

      <ScrollGuide />
      <Music />

      {/* La page offerte ne porte pas le bandeau de travail. */}
      {import.meta.env.MODE !== "offert" && (
        <span className="dev-badge">Dev</span>
      )}
    </>
  );
}
