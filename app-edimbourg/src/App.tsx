import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapLayer } from "./components/Map/MapLayer";
import { Intro } from "./components/Intro/Intro";
import { DestinationReveal } from "./components/DestinationReveal/DestinationReveal";
import { RoadTrip } from "./components/Journey/RoadTrip";

export default function App() {
  useEffect(() => {
    // Les polices changent la hauteur des textes : une fois chargées, les
    // scènes remesurent leur portée.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <MapLayer />

      <main className="story">
        <Intro />
        <DestinationReveal />
        <RoadTrip />
      </main>

      <span className="dev-badge">Dev</span>
    </>
  );
}
