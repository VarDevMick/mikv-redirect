import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// Leaflet d'abord : la feuille du site la corrige ensuite, sans !important.
import "leaflet/dist/leaflet.css";
import "./styles/global.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
