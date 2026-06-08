// ==================== Composant Projects ====================
// Vue de gestion des projets.
// Affiche les projets sous forme de cartes et permet d'en créer de nouveaux.

import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "à_initier",
    started_at: "",
    finished_at: "",
  });

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
  }, [refresh]);

  const handleNewChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async () => {
    if (!newProject.name.trim()) return;
    try {
      await fetch("http://localhost:3000/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      setNewProject({ name: "", description: "", status: "à_initier", started_at: "", finished_at: "" });
      setShowForm(false);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return (
    <>
      <h3>Projets</h3>

      {/* aria-live annonce les ajouts/suppressions au lecteur d'écran */}
      <div
        className="projects-grid"
        aria-live="polite"
        aria-label="Liste des projets"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onRefresh={() => setRefresh((prev) => prev + 1)}
          />
        ))}
      </div>

      <button
        className="btn-add"
        onClick={() => setShowForm(!showForm)}
        aria-expanded={showForm}
        aria-controls="new-project-form"
      >
        + nouveau projet
      </button>

      {showForm && (
        <div className="project-form" id="new-project-form" role="form" aria-label="Créer un nouveau projet">
          <label htmlFor="new-name">Nom du projet</label>
          <input id="new-name" type="text" name="name" placeholder="Nom du projet" value={newProject.name} onChange={handleNewChange} />
          <label htmlFor="new-description">Description</label>
          <textarea id="new-description" name="description" placeholder="Description" value={newProject.description} onChange={handleNewChange} />
          <label htmlFor="new-status">Statut</label>
          <select id="new-status" name="status" value={newProject.status} onChange={handleNewChange}>
            <option value="à_initier">à initier</option>
            <option value="en_cours">en cours</option>
            <option value="terminé">terminé</option>
          </select>
          <div className="form-dates">
            <label htmlFor="new-start">
              Début
              <input id="new-start" type="date" name="started_at" value={newProject.started_at} onChange={handleNewChange} />
            </label>
            <label htmlFor="new-end">
              Fin
              <input id="new-end" type="date" name="finished_at" value={newProject.finished_at} onChange={handleNewChange} />
            </label>
          </div>
          <div className="form-actions">
            <button className="btn-validate" onClick={handleAddProject}>Créer</button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </div>
      )}
    </>
  );
}

export default Projects;
