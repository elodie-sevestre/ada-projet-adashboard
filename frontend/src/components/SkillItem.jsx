// ==================== Composant SkillItem ====================
// Affiche une skill sous forme de ligne avec :
//   - une checkbox pour basculer son statut validé/non validé (PATCH)
//   - son libellé via un label associé (accessibilité)
//   - un mode édition inline pour corriger la description (PATCH)
//   - les projets associés sous forme de tags avec × pour dissocier
//   - un select pour associer un nouveau projet
//   - des boutons modifier (✏️) et supprimer (🗑️)
//
// Props :
//   - skill : objet skill (id, description, validated, projects)
//   - allProjects : liste de tous les projets disponibles (pour le select)
//   - onChange : callback appelé après chaque modification pour rafraîchir l'affichage

import { useState } from "react";
import { API_URL } from "../api";

function SkillItem({ skill, allProjects = [], onChange }) {
  const [editMode, setEditMode] = useState(false);
  const [editDescription, setEditDescription] = useState(skill.description);

  // Bascule le champ "validated" de la skill (true → false ou false → true)
  const handleValidated = async () => {
    try {
      await fetch(`${API_URL}/skills/${skill.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validated: !skill.validated }),
      });
      onChange();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Supprime la skill via DELETE
  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/skills/${skill.id}`, {
        method: "DELETE",
      });
      onChange();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Sauvegarde la nouvelle description via PUT /skills/:id
  const handleSaveDescription = async () => {
    if (!editDescription.trim() || editDescription.trim() === skill.description) {
      setEditMode(false);
      setEditDescription(skill.description);
      return;
    }
    try {
      await fetch(`${API_URL}/skills/${skill.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: editDescription.trim() }),
      });
      setEditMode(false);
      onChange();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Associe un projet à la skill via POST /projects/:id/skills
  const handleAddProject = async (e) => {
    const projectId = e.target.value;
    if (!projectId) return;
    try {
      await fetch(`${API_URL}/projects/${projectId}/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skill_id: skill.id }),
      });
      e.target.value = ""; // remet le select à l'état initial
      onChange();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Dissocie un projet de la skill via DELETE /projects/:id/skills/:skillId
  const handleRemoveProject = async (projectId) => {
    try {
      await fetch(`${API_URL}/projects/${projectId}/skills/${skill.id}`, {
        method: "DELETE",
      });
      onChange();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Projets déjà associés à cette skill : tableau d'objets {id, name}
  const associatedProjects = skill.projects || [];
  const associatedIds = associatedProjects.map((p) => p.id);

  // Projets disponibles = tous les projets moins ceux déjà associés
  const availableProjects = allProjects.filter(
    (p) => !associatedIds.includes(p.id)
  );

  return (
    <div className="skill-row">
      {/* Checkbox liée au label pour l'accessibilité */}
      <input
        type="checkbox"
        id={`skill-${skill.id}`}
        checked={skill.validated}
        onChange={handleValidated}
      />
      <div className="skill-content">
        {/* Mode édition inline ou affichage normal */}
        {editMode ? (
          <div className="skill-edit">
            <input
              type="text"
              className="skill-edit-input"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveDescription();
                if (e.key === "Escape") { setEditMode(false); setEditDescription(skill.description); }
              }}
              aria-label="Modifier la description de la compétence"
              autoFocus
            />
            <button className="btn-validate" onClick={handleSaveDescription}>OK</button>
            <button className="btn-cancel" onClick={() => { setEditMode(false); setEditDescription(skill.description); }}>✕</button>
          </div>
        ) : (
          <label htmlFor={`skill-${skill.id}`} className="skill-label">
            {skill.description}
          </label>
        )}

        {/* Tags des projets associés */}
        {associatedProjects.length > 0 && (
          <div className="skill-project-tags">
            {associatedProjects.map((project) => (
              <span key={project.id} className="skill-project-tag">
                {project.name}
                <button
                  className="tag-remove"
                  onClick={() => handleRemoveProject(project.id)}
                  aria-label={`Dissocier le projet ${project.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Select pour associer un nouveau projet */}
        {availableProjects.length > 0 && (
          <select
            className="skill-project-select"
            defaultValue=""
            onChange={handleAddProject}
            aria-label="Associer un projet"
          >
            <option value="" disabled>+ projet...</option>
            {availableProjects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Boutons modifier et supprimer */}
      <div className="skill-actions">
        <button
          className="btn-edit-skill"
          onClick={() => setEditMode(true)}
          aria-label="Modifier la compétence"
        >
          ✏️
        </button>
        <button
          className="btn-delete"
          onClick={handleDelete}
          aria-label="Supprimer la compétence"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default SkillItem;
