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

// Palette de couleurs cycliques pour différencier visuellement les cartes
const CARD_COLORS = [
  "#AEE2FF",
  "#FFD6E7",
  "#C8F7C5",
  "#FFF3AE",
  "#E8C9FF",
  "#FFD9A0",
];

function CategoryCard({ category, onRefresh }) {
  const [skills, setSkills] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [inputSkill, setInputSkill] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Couleur de la carte déterminée par l'id de la catégorie (modulo pour cyclage)
  const cardColor = CARD_COLORS[category.id % CARD_COLORS.length];

  // Calcul du pourcentage de complétion (0 si aucune skill)
  const percentage =
    category.total_skills === 0
      ? 0
      : (category.validated_skills / category.total_skills) * 100;

  // Récupère les skills de la catégorie depuis l'API
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

  // Chargement des skills au montage du composant et si l'id de la catégorie change
  useEffect(() => {
    fetchSkills();
  }, [category.id]);

  // Ajoute une nouvelle skill via POST, puis recharge les skills et la liste parente
  const handleAddSkill = async () => {
    if (!inputSkill.trim()) return; // on n'envoie pas si le champ est vide
    try {
      await fetch("http://localhost:3000/skills/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: inputSkill,
          category_id: category.id,
        }),
      });
      setInputSkill("");
      setShowForm(false);
      await fetchSkills();
      onRefresh(); // met à jour la progression dans la carte (total_skills / validated_skills)
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Callback passé à SkillPopup : recharge les skills locales et la liste parente
  const handleSkillChange = async () => {
    await fetchSkills();
    onRefresh();
  };

  return (
    <div className="category-card" style={{ backgroundColor: cardColor }}>
      <p className="category-name">{category.name}</p>

      {/* Barre de progression */}
      <div className="progress-wrap">
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${percentage}%` }} />
        </div>
        <span className="progress-pct">{percentage.toFixed(0)}%</span>
      </div>

      {/* Bouton d'ouverture de la popup des skills */}
      <button className="btn-skills" onClick={() => setShowPopup(true)}>
        Voir les compétences
      </button>

      {/* Bouton pour afficher/masquer le formulaire d'ajout de skill */}
      <button className="btn-add" onClick={() => setShowForm(!showForm)}>
        + je sais...
      </button>

      {/* Formulaire d'ajout de skill (conditionnel) */}
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

      {/* Popup de détail des skills (conditionnelle) */}
      {showPopup && (
        <SkillPopup
          category={category}
          skills={skills}
          onClose={() => setShowPopup(false)}
          onChange={handleSkillChange}
        />
      )}
    </div>
  );
}

export default CategoryCard;
