// ==================== Composant SkillItem ====================
// Affiche une skill sous forme de ligne avec :
//   - une checkbox pour basculer son statut validé/non validé (PATCH)
//   - son libellé via un label associé (accessibilité)
//   - les projets dans lesquels elle a été pratiquée
//   - un bouton de suppression (DELETE)
//
// Props :
//   - skill : objet skill (id, description, validated, projects)
//   - onChange : callback appelé après chaque modification pour rafraîchir l'affichage

function SkillItem({ skill, onChange }) {

  // Bascule le champ "validated" de la skill (true → false ou false → true)
  const handleValidated = async () => {
    try {
      await fetch(`http://localhost:3000/skills/${skill.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ validated: !skill.validated }),
      });
      onChange(); // notifie le parent pour recharger la liste
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
      onChange(); // notifie le parent pour recharger la liste
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return (
    <div className="skill-row">
      {/* id dynamique pour lier la checkbox à son label (accessibilité) */}
      <input
        type="checkbox"
        id={`skill-${skill.id}`}
        checked={skill.validated}
        onChange={handleValidated}
      />
      <label htmlFor={`skill-${skill.id}`}>
        {skill.description}
        {/* Affiche les projets associés si la skill a été pratiquée quelque part */}
        {skill.projects && skill.projects.length > 0 && (
          <span className="skill-projects">
            {skill.projects.join(", ")}
          </span>
        )}
      </label>
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
