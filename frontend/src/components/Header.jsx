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
      {/* aria-label identifie la zone de navigation pour les lecteurs d'écran */}
      <nav className="nav-tabs" aria-label="Navigation principale">
        <button
          className={`nav-tab ${activeView === "categories" ? "active" : ""}`}
          onClick={() => onNavigate("categories")}
          aria-current={activeView === "categories" ? "page" : undefined}
        >
          Compétences
        </button>
        <button
          className={`nav-tab ${activeView === "projects" ? "active" : ""}`}
          onClick={() => onNavigate("projects")}
          aria-current={activeView === "projects" ? "page" : undefined}
        >
          Projets
        </button>
      </nav>
    </header>
  );
}

export default Header;
