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
import { BirthdayBeat } from "./components/BirthdayBeat/BirthdayBeat";
import { Final } from "./components/Final/Final";
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

      {/* L'ordre du récit : on part sans savoir où, la ville ne se nomme
          qu'une fois l'avion posé, et le rappel des 60 ans tombe entre la
          première et la deuxième journée. */}
      <main className="story">
        <Intro />
        <Buildup />
        <RoadTrip />
        <Flight />
        <DestinationReveal />

        <CityTransition />
        <DaySection day={DAYS[0]} ecrans={9} />
        <BirthdayBeat />
        <DaySection day={DAYS[1]} ecrans={9} />
        <DaySection day={DAYS[2]} ecrans={9} />
        <Final />
      </main>

      <span className="dev-badge">Dev</span>
    </>
  );
}
