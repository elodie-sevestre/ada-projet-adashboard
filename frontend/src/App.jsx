// ==================== Composant racine ====================
// App gère la navigation entre les deux vues principales :
//   - "categories" : vue des compétences par catégorie
//   - "projects"   : vue de gestion des projets
//
// Le state "activeView" détermine quelle vue est affichée.
// La clé sur le wrapper force React à remonter le composant
// à chaque changement de vue, ce qui déclenche l'animation CSS.

import { useState } from "react";
import Header from "./components/Header";
import Categories from "./components/Categories";
import Projects from "./components/Projects";

function App() {
  const [activeView, setActiveView] = useState("categories");

  return (
    <>
      <Header activeView={activeView} onNavigate={setActiveView} />
      <main key={activeView} className="view-container">
        {activeView === "categories" && <Categories />}
        {activeView === "projects" && <Projects />}
      </main>
    </>
  );
}

export default App;
