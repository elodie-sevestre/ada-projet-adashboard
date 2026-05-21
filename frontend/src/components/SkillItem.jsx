function SkillItem({ skill, onChange }) {
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
