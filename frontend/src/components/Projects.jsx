// ==================== Composant Projects ====================
// Vue de gestion des projets.
// Permet de :
//   - voir la liste de tous les projets existants sous forme de tags
//   - créer un nouveau projet via un formulaire inline

import { useState, useEffect } from "react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [inputProject, setInputProject] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Récupère tous les projets depuis l'API
  const fetchProjects = async () => {
    try {
      const response = await fetch("http://localhost:3000/projects");
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Crée un nouveau projet via POST
  const handleAddProject = async () => {
    if (!inputProject.trim()) return;
    try {
      await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: inputProject }),
      });
      setInputProject("");
      setShowForm(false);
      await fetchProjects();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Supprime un projet via DELETE
  const handleDeleteProject = async (id) => {
    try {
      await fetch(`http://localhost:3000/projects/${id}`, {
        method: "DELETE",
      });
      await fetchProjects();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return (
    <>
      <h3>Projets</h3>

      {/* Liste des projets sous forme de tags */}
      <div className="project-tags">
        {projects.map((project) => (
          <div key={project.id} className="project-tag">
            <span>{project.name}</span>
            <button
              className="tag-delete"
              onClick={() => handleDeleteProject(project.id)}
              aria-label={`Supprimer le projet ${project.name}`}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Bouton pour afficher/masquer le formulaire d'ajout */}
      <button className="btn-add" onClick={() => setShowForm(!showForm)}>
        + nouveau projet
      </button>

      {/* Formulaire d'ajout de projet (conditionnel) */}
      {showForm && (
        <div className="add-form">
          <input
            type="text"
            placeholder="Nom du projet..."
            value={inputProject}
            onChange={(e) => setInputProject(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddProject()}
          />
          <button className="btn-validate" onClick={handleAddProject}>
            OK
          </button>
        </div>
      )}
    </>
  );
}

export default Projects;
