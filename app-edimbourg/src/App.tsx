import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapLayer } from "./components/Map/MapLayer";
import { Intro } from "./components/Intro/Intro";
import { Buildup } from "./components/Buildup/Buildup";
import { RoadTrip } from "./components/Journey/RoadTrip";
import { Flight } from "./components/Journey/Flight";
import { DestinationReveal } from "./components/DestinationReveal/DestinationReveal";

export default function App() {
  useEffect(() => {
    // Les polices changent la hauteur des textes : une fois chargées, les
    // scènes remesurent leur portée.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <MapLayer />

      {/* L'ordre du récit : on part sans savoir où, et la ville ne se
          nomme qu'une fois l'avion posé. */}
      <main className="story">
        <Intro />
        <Buildup />
        <RoadTrip />
        <Flight />
        <DestinationReveal />
      </main>

      <span className="dev-badge">Dev</span>
    </>
  );
}
