// ==================== Composant Projects ====================
// Récupère la liste de tous les projets depuis l'API
// et les affiche sous forme de grille de cartes.

// Le state "refresh" est un compteur incrémenté par les composants enfants
// pour forcer un rechargement de la liste (ex : après ajout d'une skill).

import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);

  // Compteur utilisé comme déclencheur de rechargement :
  // chaque fois qu'un enfant appelle onRefresh(), refresh s'incrémente
  // ce qui relance le useEffect
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3000/projects");
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        console.error("Erreur :", err);
      }
    };
    fetchProjects();
  }, [refresh]); // se relance à chaque changement de "refresh"

  return (
    <>
      <h3>Projets</h3>
      <div className="projects-grid">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onRefresh={() => setRefresh((prev) => prev + 1)}
          />
        ))}
      </div>
    </>
  );
}

export default Projects;
