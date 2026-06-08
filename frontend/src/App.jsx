// ==================== Composant racine ====================
// App est le composant principal de l'application.
// Il assemble les blocs de haut niveau : le header et la liste des projets.

import Header from "./components/Header";
import Projects from "./components/Projects";

function App() {
  return (
    <>
      <Header />
      <Projects />
    </>
  );
}

export default App;
