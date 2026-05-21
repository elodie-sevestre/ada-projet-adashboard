import SkillItem from "./SkillItem";

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
    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="popup" style={{ borderTop: `6px solid ${CARD_COLORS[project.id % CARD_COLORS.length]}` }}>
        <div className="popup-header">
          <span className="popup-title">{project.name}</span>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {skills.length === 0 && (
          <p style={{ color: "#888", fontSize: "14px" }}>Aucune compétence pour l'instant.</p>
        )}

        {skills.map((skill) => (
          <SkillItem key={skill.id} skill={skill} onChange={onChange} />
        ))}
      </div>
    </div>
  );
}

export default SkillPopup;
