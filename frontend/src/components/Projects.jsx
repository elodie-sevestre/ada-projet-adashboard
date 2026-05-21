import React from "react";
import { useState, useEffect } from "react";

function Projects({ refresh, setRefresh }) {
  // state
  const [projects, setProjects] = useState([]);
  const [inputSkill, setInputSkill] = useState("");
  const [form, setForm] = useState(null);

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

  const handleSubmit = async (inputSkill, projectId) => {
    try {
      await fetch(`http://localhost:3000/skills/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: inputSkill,
          project_id: projectId,
        }),
      });
      setInputSkill("");
      setForm(null);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return (
    <>
      <h3>Projets</h3>
      {projects.map((project) => {
        const percentage =
          project.total_skills === 0
            ? 0
            : (project.validated_skills / project.total_skills) * 100;
        return (
          <React.Fragment key={project.id}>
            <p className="project-card">
              {project.name} <br /> {project.description} <br />
              <progress max="100" value={percentage} />{" "}
              <span>{percentage.toFixed(0)}%</span>
            </p>
            <button onClick={() => setForm(project.id)}>
              Ajouter une compétence
            </button>

            {form === project.id && (
              <>
                <input
                  type="text"
                  placeholder="Je sais..."
                  value={inputSkill}
                  onChange={(e) => setInputSkill(e.target.value)}
                />
                <button onClick={() => handleSubmit(inputSkill, project.id)}>
                  Valider
                </button>
              </>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

export default Projects;
