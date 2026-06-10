// ==================== Composant CategoryCard ====================
// Affiche une carte pour une catégorie de compétences.
// Gère :
//   - l'affichage du nom et de la barre de progression
//   - l'ajout d'une nouvelle skill dans cette catégorie via un formulaire inline
//   - l'ouverture de la popup de détail des skills (SkillPopup)
//   - la modification du nom de la catégorie (édition inline)
//   - la suppression de la catégorie (avec confirmation, cascade sur les skills)
//
// Props :
//   - category : objet catégorie (id, name, total_skills, validated_skills)
//   - onRefresh : callback pour forcer le rechargement de la liste parente

import { useState, useEffect } from "react";
import { API_URL } from "../api";
import { CARD_COLORS } from "../constants";
import SkillPopup from "./SkillPopup";

function CategoryCard({ category, onRefresh }) {
  const [skills, setSkills] = useState([]);
  const [allProjects, setAllProjects] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [inputSkill, setInputSkill] = useState("");
  const [showForm, setShowForm] = useState(false);

  // État édition du nom de la catégorie
  const [editMode, setEditMode] = useState(false);
  const [editName, setEditName] = useState(category.name);

  const cardColor = CARD_COLORS[category.id % CARD_COLORS.length];

  const percentage =
    category.total_skills === 0
      ? 0
      : (category.validated_skills / category.total_skills) * 100;

  const fetchSkills = async () => {
    try {
      const response = await fetch(
        `${API_URL}/categories/${category.id}/skills`
      );
      const data = await response.json();
      setSkills(data);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Charge les projets une seule fois au montage pour les passer à SkillPopup
  // (évite un fetch redondant à chaque ouverture de popup)
  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`);
      const data = await response.json();
      setAllProjects(data);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchProjects();
  }, [category.id]);

  const handleAddSkill = async () => {
    if (!inputSkill.trim()) return;
    try {
      await fetch(`${API_URL}/skills/`, {
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

  // Sauvegarde le nouveau nom de la catégorie via PATCH /categories/:id
  const handleSaveName = async () => {
    if (!editName.trim() || editName.trim() === category.name) {
      setEditMode(false);
      setEditName(category.name);
      return;
    }
    try {
      await fetch(`${API_URL}/categories/${category.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName.trim() }),
      });
      setEditMode(false);
      onRefresh();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Supprime la catégorie après confirmation
  // Toutes les skills associées sont supprimées en cascade (ON DELETE CASCADE)
  const handleDelete = async () => {
    const skillCount = parseInt(category.total_skills);
    const message =
      skillCount > 0
        ? `Supprimer la catégorie "${category.name}" et ses ${skillCount} compétence(s) ?`
        : `Supprimer la catégorie "${category.name}" ?`;
    if (!window.confirm(message)) return;
    try {
      await fetch(`${API_URL}/categories/${category.id}`, {
        method: "DELETE",
      });
      onRefresh();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  return (
    <article
      className="category-card"
      style={{ backgroundColor: cardColor }}
      aria-label={`Catégorie ${category.name}`}
    >
      {/* Nom : mode lecture ou mode édition inline */}
      {editMode ? (
        <div className="category-edit-name">
          <input
            type="text"
            className="category-name-input"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveName();
              if (e.key === "Escape") { setEditMode(false); setEditName(category.name); }
            }}
            aria-label="Modifier le nom de la catégorie"
            autoFocus
          />
          <button className="btn-validate" onClick={handleSaveName}>OK</button>
          <button className="btn-cancel" onClick={() => { setEditMode(false); setEditName(category.name); }}>✕</button>
        </div>
      ) : (
        <p className="category-name">{category.name}</p>
      )}

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

      {/* Actions en bas de carte : modifier le nom, supprimer la catégorie */}
      <div className="category-card-actions">
        <button
          className="btn-category-edit"
          onClick={() => setEditMode(true)}
          aria-label={`Modifier le nom de la catégorie ${category.name}`}
        >
          ✏️
        </button>
        <button
          className="btn-category-delete"
          onClick={handleDelete}
          aria-label={`Supprimer la catégorie ${category.name}`}
        >
          🗑️
        </button>
      </div>

      {showPopup && (
        <SkillPopup
          category={category}
          skills={skills}
          allProjects={allProjects}
          onClose={() => setShowPopup(false)}
          onChange={handleSkillChange}
        />
      )}
    </article>
  );
}

export default CategoryCard;
