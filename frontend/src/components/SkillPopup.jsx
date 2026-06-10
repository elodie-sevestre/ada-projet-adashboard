// ==================== Composant SkillPopup ====================
// Affiche une popup modale listant toutes les skills d'une catégorie.
// La popup se ferme en cliquant sur le bouton ✕ ou sur l'overlay.
//
// Récupère la liste de tous les projets au montage pour alimenter
// le sélecteur d'association dans chaque SkillItem.
//
// Props :
//   - category : objet catégorie (id, name)
//   - skills : tableau de skills à afficher
//   - onClose : callback pour fermer la popup
//   - onChange : callback passé à chaque SkillItem pour rafraîchir après modification

import { useState, useEffect } from "react";
import { API_URL } from "../api";
import SkillItem from "./SkillItem";

// Même palette que CategoryCard pour cohérence visuelle
const CARD_COLORS = [
  "#D6E8F0",
  "#F0DDE6",
  "#D4ECD2",
  "#F0ECD4",
  "#E4D8EE",
  "#EFE0C8",
];

function SkillPopup({ category, skills, onClose, onChange }) {
  const [allProjects, setAllProjects] = useState([]);

  // Récupère tous les projets au montage pour les passer aux SkillItems
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${API_URL}/projects`);
        const data = await response.json();
        setAllProjects(data);
      } catch (err) {
        console.error("Erreur :", err);
      }
    };
    fetchProjects();
  }, []);

  return (
    // Clic sur l'overlay (fond sombre) ferme la popup
    // e.target === e.currentTarget vérifie qu'on clique bien sur l'overlay et pas sur son contenu
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="popup"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`popup-title-${category.id}`}
        style={{
          borderTop: `6px solid ${CARD_COLORS[category.id % CARD_COLORS.length]}`,
        }}
      >
        <div className="popup-header">
          <span
            className="popup-title"
            id={`popup-title-${category.id}`}
          >
            {category.name}
          </span>
          <button
            className="btn-close"
            onClick={onClose}
            aria-label="Fermer la popup"
          >
            ✕
          </button>
        </div>

        {/* Message affiché si la catégorie n'a pas encore de skills */}
        {skills.length === 0 && (
          <p style={{ color: "#888", fontSize: "14px" }}>
            Aucune compétence pour l'instant.
          </p>
        )}

        {/* Liste des skills — allProjects est passé pour alimenter le sélecteur */}
        {skills.map((skill) => (
          <SkillItem
            key={skill.id}
            skill={skill}
            allProjects={allProjects}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}

export default SkillPopup;
