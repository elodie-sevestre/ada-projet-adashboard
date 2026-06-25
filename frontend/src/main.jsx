// ==================== Point d'entrée React ====================
// Ce fichier monte l'application React dans le DOM.
// StrictMode : outil de développement uniquement, sans effet en production

import { StrictMode } from "react";
import { createRoot } from "react-dom/frontend";
import "./index.css";
import App from "./App.jsx";

// Attache le composant racine <App> à l'élément HTML avec l'id "root"
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
