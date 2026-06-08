// ==================== Composant racine ====================
// App gère la navigation entre les deux vues principales :
//   - "categories" : vue des compétences par catégorie
//   - "projects"   : vue de gestion des projets
//
// Le state "activeView" détermine quelle vue est affichée.
// Il est passé à Header pour mettre en évidence l'onglet actif.

import { useState } from "react";
import Header from "./components/Header";
import Categories from "./components/Categories";
import Projects from "./components/Projects";

function App() {
  // Vue active : "categories" par défaut
  const [activeView, setActiveView] = useState("categories");

  return (
    <>
      <Header activeView={activeView} onNavigate={setActiveView} />
      {activeView === "categories" && <Categories />}
      {activeView === "projects" && <Projects />}
    </>
  );
}

export default App;
