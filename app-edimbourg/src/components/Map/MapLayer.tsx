import { useLayoutEffect, useRef } from "react";
import { initMap, refreshMapSize } from "../../map/journeyMap";

/**
 * Le calque de carte : posé une fois pour toutes derrière le récit, à
 * l'écran entier. Les scènes le font apparaître, le déplacent et le
 * cadrent ; personne ne le remonte ni ne le remplace.
 */
export function MapLayer() {
  const wrapper = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!wrapper.current || !canvas.current) return;
    initMap(canvas.current, wrapper.current);

    const surRedimensionnement = () => refreshMapSize();
    window.addEventListener("resize", surRedimensionnement);
    window.addEventListener("orientationchange", surRedimensionnement);
    return () => {
      window.removeEventListener("resize", surRedimensionnement);
      window.removeEventListener("orientationchange", surRedimensionnement);
    };
  }, []);

  return (
    <div className="map-layer" ref={wrapper} aria-hidden="true">
      <div className="map-layer__canvas" ref={canvas} />
    </div>
  );
}
