// ==================== Composant Projects ====================
// Vue de gestion des projets.
// Affiche les projets sous forme de cartes et permet d'en créer de nouveaux.
//
// Le state "refresh" force le rechargement de la liste
// après une création, modification ou suppression.

import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);

  // Formulaire de création — champs contrôlés
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "à_initier",
    started_at: "",
    finished_at: "",
  });

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
  }, [refresh]); // se relance à chaque changement de "refresh"

  // Met à jour un champ du formulaire de création
  const handleNewChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // Crée un nouveau projet via POST
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

      {/* Grille de cartes projets */}
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onRefresh={() => setRefresh((prev) => prev + 1)}
          />
        ))}
      </div>

      {/* Bouton pour afficher/masquer le formulaire de création */}
      <button className="btn-add" onClick={() => setShowForm(!showForm)}>
        + nouveau projet
      </button>

      {/* Formulaire de création (conditionnel) */}
      {showForm && (
        <div className="project-form">
          <input
            type="text"
            name="name"
            placeholder="Nom du projet"
            value={newProject.name}
            onChange={handleNewChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={newProject.description}
            onChange={handleNewChange}
          />
          <select name="status" value={newProject.status} onChange={handleNewChange}>
            <option value="à_initier">à initier</option>
            <option value="en_cours">en cours</option>
            <option value="terminé">terminé</option>
          </select>
          <div className="form-dates">
            <label>
              Début
              <input type="date" name="started_at" value={newProject.started_at} onChange={handleNewChange} />
            </label>
            <label>
              Fin
              <input type="date" name="finished_at" value={newProject.finished_at} onChange={handleNewChange} />
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
