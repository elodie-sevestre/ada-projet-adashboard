import { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);
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
  }, [refresh]);

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
