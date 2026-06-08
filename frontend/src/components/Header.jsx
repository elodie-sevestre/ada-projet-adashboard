// ==================== Composant Header ====================
// Affiche le titre du dashboard et la navigation entre les deux vues.
//
// Props :
//   - activeView : vue actuellement active ("categories" ou "projects")
//   - onNavigate : callback pour changer de vue

function Header({ activeView, onNavigate }) {
  return (
    <header className="app-header">
      <h1>Mon Dashboard</h1>
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeView === "categories" ? "active" : ""}`}
          onClick={() => onNavigate("categories")}
        >
          Compétences
        </button>
        <button
          className={`nav-tab ${activeView === "projects" ? "active" : ""}`}
          onClick={() => onNavigate("projects")}
        >
          Projets
        </button>
      </nav>
    </header>
  );
}

export default Header;
