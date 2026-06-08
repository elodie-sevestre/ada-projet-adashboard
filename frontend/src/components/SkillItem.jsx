// ==================== Composant SkillItem ====================
// Affiche une skill sous forme de ligne avec :
//   - une checkbox pour basculer son statut validé/non validé (PATCH)
//   - son libellé via un label associé (accessibilité)
//   - les projets associés sous forme de tags avec × pour dissocier
//   - un select pour associer un nouveau projet
//   - un bouton de suppression (DELETE)
//
// Props :
//   - skill : objet skill (id, description, validated, projects)
//   - allProjects : liste de tous les projets disponibles (pour le select)
//   - onChange : callback appelé après chaque modification pour rafraîchir l'affichage

function SkillItem({ skill, allProjects = [], onChange }) {

  // Bascule le champ "validated" de la skill (true → false ou false → true)
  const handleValidated = async () => {
    try {
      await fetch(`http://localhost:3000/skills/${skill.id}`, {
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
      await fetch(`http://localhost:3000/skills/${skill.id}`, {
        method: "DELETE",
      });
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
      await fetch(`http://localhost:3000/projects/${projectId}/skills`, {
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
  const handleRemoveProject = async (projectName) => {
    // Retrouve l'id du projet depuis son nom
    const project = allProjects.find((p) => p.name === projectName);
    if (!project) return;
    try {
      await fetch(`http://localhost:3000/projects/${project.id}/skills/${skill.id}`, {
        method: "DELETE",
      });
      onChange();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Projets déjà associés à cette skill
  const associatedNames = skill.projects || [];

  // Projets disponibles = tous les projets moins ceux déjà associés
  const availableProjects = allProjects.filter(
    (p) => !associatedNames.includes(p.name)
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
        <label htmlFor={`skill-${skill.id}`} className="skill-label">
          {skill.description}
        </label>

        {/* Tags des projets associés */}
        {associatedNames.length > 0 && (
          <div className="skill-project-tags">
            {associatedNames.map((name) => (
              <span key={name} className="skill-project-tag">
                {name}
                <button
                  className="tag-remove"
                  onClick={() => handleRemoveProject(name)}
                  aria-label={`Dissocier le projet ${name}`}
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

      <button
        className="btn-delete"
        onClick={handleDelete}
        aria-label="Supprimer la compétence"
      >
        🗑️
      </button>
    </div>
  );
}

export default SkillItem;
