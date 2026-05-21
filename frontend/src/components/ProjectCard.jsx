import { useState, useEffect } from "react";
import SkillPopup from "./SkillPopup";

const CARD_COLORS = [
  "#AEE2FF",
  "#FFD6E7",
  "#C8F7C5",
  "#FFF3AE",
  "#E8C9FF",
  "#FFD9A0",
];

function ProjectCard({ project, onRefresh }) {
  const [skills, setSkills] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [inputSkill, setInputSkill] = useState("");
  const [showForm, setShowForm] = useState(false);

  const cardColor = CARD_COLORS[project.id % CARD_COLORS.length];

  const percentage =
    project.total_skills === 0
      ? 0
      : (project.validated_skills / project.total_skills) * 100;

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/projects/${project.id}/skills`,
      );
      const data = await response.json();
      setSkills(data);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [project.id]);

  const handleAddSkill = async () => {
    if (!inputSkill.trim()) return;
    try {
      await fetch("http://localhost:3000/skills/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: inputSkill,
          project_id: project.id,
        }),
      });
      setInputSkill("");
      setShowForm(false);
      await fetchSkills();
      onRefresh();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const handleSkillChange = async () => {
    await fetchSkills();
    onRefresh();
  };

  return (
    <div className="project-card" style={{ backgroundColor: cardColor }}>
      <p className="project-name">{project.name}</p>
      <p className="project-description">{project.description}</p>

      <div className="progress-wrap">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percentage}%` }} />
        </div>
        <span className="progress-pct">{percentage.toFixed(0)}%</span>
      </div>

      <button className="btn-skills" onClick={() => setShowPopup(true)}>
        Voir les compétences
      </button>

      <button className="btn-add" onClick={() => setShowForm(!showForm)}>
        + je sais...
      </button>

      {showForm && (
        <div className="add-form">
          <input
            type="text"
            placeholder="Je sais..."
            value={inputSkill}
            onChange={(e) => setInputSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
          />
          <button className="btn-validate" onClick={handleAddSkill}>
            OK
          </button>
        </div>
      )}

      {showPopup && (
        <SkillPopup
          project={project}
          skills={skills}
          onClose={() => setShowPopup(false)}
          onChange={handleSkillChange}
        />
      )}
    </div>
  );
}

export default ProjectCard;
