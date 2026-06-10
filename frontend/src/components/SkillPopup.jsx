// ==================== Composant SkillPopup ====================
// Affiche une popup modale listant toutes les skills d'une catégorie.
// La popup se ferme en cliquant sur le bouton ✕ ou sur l'overlay.
//
// allProjects et onError sont reçus via props depuis CategoryCard.
//
// Props :
//   - category    : objet catégorie (id, name)
//   - skills      : tableau de skills à afficher
//   - allProjects : liste de tous les projets (pour le sélecteur dans SkillItem)
//   - onClose     : callback pour fermer la popup
//   - onChange    : callback passé à chaque SkillItem pour rafraîchir après modification
//   - onError     : callback(message) pour afficher un toast d'erreur

import { CARD_COLORS } from "../constants";
import SkillItem from "./SkillItem";

function SkillPopup({ category, skills, allProjects = [], onClose, onChange, onError }) {
  return (
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
          <span className="popup-title" id={`popup-title-${category.id}`}>
            {category.name}
          </span>
          <button className="btn-close" onClick={onClose} aria-label="Fermer la popup">
            ✕
          </button>
        </div>

        {skills.length === 0 && (
          <p style={{ color: "#888", fontSize: "14px" }}>
            Aucune compétence pour l'instant.
          </p>
        )}

        {skills.map((skill) => (
          <SkillItem
            key={skill.id}
            skill={skill}
            allProjects={allProjects}
            onChange={onChange}
            onError={onError}
          />
        ))}
      </div>
    </div>
  );
}

export default SkillPopup;
