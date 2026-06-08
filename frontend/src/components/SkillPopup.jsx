// ==================== Composant SkillPopup ====================
// Affiche une popup modale listant toutes les skills d'un projet.
// La popup se ferme en cliquant sur le bouton ✕ ou sur l'overlay.
//
// Props :
//   - project : objet projet (id, name)
//   - skills : tableau de skills à afficher
//   - onClose : callback pour fermer la popup
//   - onChange : callback passé à chaque SkillItem pour rafraîchir après modification

import SkillItem from "./SkillItem";

// Même palette que ProjectCard pour cohérence visuelle
const CARD_COLORS = [
  "#AEE2FF",
  "#FFD6E7",
  "#C8F7C5",
  "#FFF3AE",
  "#E8C9FF",
  "#FFD9A0",
];

function SkillPopup({ project, skills, onClose, onChange }) {
  return (
    // Clic sur l'overlay (fond sombre) ferme la popup
    // e.target === e.currentTarget vérifie qu'on clique bien sur l'overlay et pas sur son contenu
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="popup"
        style={{
          borderTop: `6px solid ${CARD_COLORS[project.id % CARD_COLORS.length]}`,
        }}
      >
        <div className="popup-header">
          <span className="popup-title">{project.name}</span>
          <button className="btn-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Message affiché si le projet n'a pas encore de skills */}
        {skills.length === 0 && (
          <p style={{ color: "#888", fontSize: "14px" }}>
            Aucune compétence pour l'instant.
          </p>
        )}

        {/* Liste des skills */}
        {skills.map((skill) => (
          <SkillItem key={skill.id} skill={skill} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}

export default SkillPopup;
