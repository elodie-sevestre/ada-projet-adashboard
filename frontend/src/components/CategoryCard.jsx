// ==================== Composant CategoryCard ====================
// Affiche une carte pour une catégorie de compétences.
// Gère :
//   - l'affichage du nom et de la barre de progression
//   - l'ajout d'une nouvelle skill dans cette catégorie via un formulaire inline
//   - l'ouverture de la popup de détail des skills (SkillPopup)
//
// Props :
//   - category : objet catégorie (id, name, total_skills, validated_skills)
//   - onRefresh : callback pour forcer le rechargement de la liste parente

import { useState, useEffect } from "react";
import SkillPopup from "./SkillPopup";

// Palette de couleurs désaturées harmonisée avec le thème revue scientifique
const CARD_COLORS = [
  "#D6E8F0",
  "#F0DDE6",
  "#D4ECD2",
  "#F0ECD4",
  "#E4D8EE",
  "#EFE0C8",
];

function CategoryCard({ category, onRefresh }) {
  const [skills, setSkills] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [inputSkill, setInputSkill] = useState("");
  const [showForm, setShowForm] = useState(false);

  const cardColor = CARD_COLORS[category.id % CARD_COLORS.length];

  const percentage =
    category.total_skills === 0
      ? 0
      : (category.validated_skills / category.total_skills) * 100;

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/categories/${category.id}/skills`
      );
      const data = await response.json();
      setSkills(data);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, [category.id]);

  const handleAddSkill = async () => {
    if (!inputSkill.trim()) return;
    try {
      await fetch("http://localhost:3000/skills/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: inputSkill, category_id: category.id }),
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
    <article
      className="category-card"
      style={{ backgroundColor: cardColor }}
      aria-label={`Catégorie ${category.name}`}
    >
      <p className="category-name">{category.name}</p>

      {/* role="progressbar" avec valeurs min/max/now pour les lecteurs d'écran */}
      <div
        className="progress-wrap"
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progression ${category.name} : ${Math.round(percentage)}%`}
      >
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percentage}%` }} />
        </div>
        <span className="progress-pct" aria-hidden="true">
          {percentage.toFixed(0)}%
        </span>
      </div>

      <button
        className="btn-skills"
        onClick={() => setShowPopup(true)}
        aria-haspopup="dialog"
        aria-label={`Voir les compétences de la catégorie ${category.name}`}
      >
        Voir les compétences
      </button>

      {/* aria-expanded indique si le formulaire est ouvert ou fermé */}
      <button
        className="btn-add"
        onClick={() => setShowForm(!showForm)}
        aria-expanded={showForm}
        aria-controls={`add-form-${category.id}`}
      >
        + je sais...
      </button>

      {showForm && (
        <div className="add-form" id={`add-form-${category.id}`}>
          <input
            type="text"
            placeholder="Je sais..."
            value={inputSkill}
            onChange={(e) => setInputSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            aria-label="Décrire une nouvelle compétence"
          />
          <button className="btn-validate" onClick={handleAddSkill}>OK</button>
        </div>
      )}

      {showPopup && (
        <SkillPopup
          category={category}
          skills={skills}
          onClose={() => setShowPopup(false)}
          onChange={handleSkillChange}
        />
      )}
    </article>
  );
}

export default CategoryCard;
