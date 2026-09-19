import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Le site est servi par GitHub Pages depuis docs/, sur https://mikv.io/61.
// La sortie du build atterrit donc directement dans docs/61/, à côté des
// pages /30, /31 et /60 que scripts/build-static.mjs génère encore.
export default defineConfig({
  plugins: [react()],
  base: "/61/",
  build: {
    outDir: "../docs/61",
    emptyOutDir: true,
  },
});
