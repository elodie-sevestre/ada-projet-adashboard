import React from "react";
import { useState, useEffect } from "react";

function Skills({ refresh, setRefresh }) {
  // state
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch("http://localhost:3000/skills");
        const data = await response.json();
        setSkills(data);
      } catch (err) {
        console.error("Erreur :", err);
      }
    };
    fetchSkills();
  }, [refresh]);

  const handleValidated = async (idSkill, validatedSkill) => {
    try {
      await fetch(`http://localhost:3000/skills/${idSkill}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validated: !validatedSkill }),
      });
      setSkills(
        skills.map((skill) =>
          skill.id === idSkill
            ? { ...skill, validated: !validatedSkill }
            : skill,
        ),
      );
      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const handleDelete = async (idSkill) => {
    // fetch DELETE ici
    try {
      await fetch(`http://localhost:3000/skills/${idSkill}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      setSkills(skills.filter((skill) => skill.id !== idSkill));
      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return (
    <>
      <h3>Compétences à acquérir</h3>
      {skills.map((skill) => (
        <React.Fragment key={skill.id}>
          <input
            type="checkbox"
            onChange={() => handleValidated(skill.id, skill.validated)}
            checked={skill.validated}
          />
          <p className="skill-row">
            {skill.description}, {skill.validated}
          </p>
          <button onClick={() => handleDelete(skill.id)}>Supprimer</button>
        </React.Fragment>
      ))}
    </>
  );
}

export default Skills;
