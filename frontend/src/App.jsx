// ==================== Composant racine ====================
// App est le composant principal de l'application.
// Il assemble les blocs de haut niveau : le header et la liste des catégories.

import Header from "./components/Header";
import Categories from "./components/Categories";

function App() {
  return (
    <>
      <Header />
      <Categories />
    </>
  );
}

export default App;
