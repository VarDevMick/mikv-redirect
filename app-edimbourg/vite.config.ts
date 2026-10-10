import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Le site est servi par GitHub Pages depuis docs/, à deux adresses :
//
// - https://mikv.io/61, la copie de travail, reconstruite à chaque build ;
// - https://mikv.io/birthday/60, la page offerte, sans bandeau de travail.
//   Elle ne se reconstruit que par `npm run build:offert` : un build
//   ordinaire ne la touche jamais, elle reste figée entre deux publications.
export default defineConfig(({ mode }) => {
  const offert = mode === "offert";
  return {
    plugins: [react()],
    base: offert ? "/birthday/60/" : "/61/",
    build: {
      outDir: offert ? "../docs/birthday/60" : "../docs/61",
      emptyOutDir: true,
    },
  };
});
