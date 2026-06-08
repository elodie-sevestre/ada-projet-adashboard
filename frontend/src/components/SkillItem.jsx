// ==================== Composant SkillItem ====================
// Affiche une skill sous forme de ligne avec :
//   - une checkbox pour basculer son statut validé/non validé (PATCH)
//   - son libellé
//   - un bouton de suppression (DELETE)
//
// Props :
//   - skill : objet skill (id, description, validated)
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
      <input
        type="checkbox"
        checked={skill.validated}
        onChange={handleValidated}
      />
      <span>{skill.description}</span>
      <button onClick={handleDelete}>Supprimer</button>
    </div>
  );
}

export default SkillItem;
