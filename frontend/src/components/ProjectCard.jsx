// ==================== Composant ProjectCard ====================
// Affiche une carte pour un projet avec deux modes :
//   - mode lecture  : nom, description, statut, dates
//   - mode édition  : formulaire avec calendrier natif et select statut
//
// Props :
//   - project   : objet projet (id, name, description, status, started_at, finished_at)
//   - onRefresh : callback pour forcer le rechargement de la liste parente

import { useState } from "react";

// Couleurs associées aux statuts
const STATUS_COLORS = {
  "à_initier": "#F0ECD4",
  "en_cours":  "#D6E8F0",
  "terminé":   "#D4ECD2",
};

// Emojis associés aux statuts
const STATUS_EMOJI = {
  "à_initier": "#F0ECD4",
  "en_cours":  "#D6E8F0",
  "terminé":   "#D4ECD2",
};

function ProjectCard({ project, onRefresh }) {
  const [editMode, setEditMode] = useState(false);

  // Formulaire d'édition initialisé avec les valeurs du projet
  // Les dates sont converties de DD-MM-YYYY vers YYYY-MM-DD pour l'input type="date"
  const toInputDate = (str) => {
    if (!str) return "";
    const [d, m, y] = str.split("-");
    return `${y}-${m}-${d}`;
  };

  const [form, setForm] = useState({
    name:        project.name,
    description: project.description || "",
    status:      project.status,
    started_at:  toInputDate(project.started_at),
    finished_at: toInputDate(project.finished_at),
  });

  // Met à jour un champ du formulaire
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Enregistre les modifications via PUT
  const handleSave = async () => {
    try {
      await fetch(`http://localhost:3000/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setEditMode(false);
      onRefresh();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Supprime le projet via DELETE
  const handleDelete = async () => {
    try {
      await fetch(`http://localhost:3000/projects/${project.id}`, {
        method: "DELETE",
      });
      onRefresh();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const cardColor = STATUS_COLORS[project.status] || "#f9f7f3";

  // ── Mode édition ──
  if (editMode) {
    return (
      <div className="project-card" style={{ backgroundColor: cardColor }}>
        <div className="project-form">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nom du projet"
          />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="à_initier">à initier</option>
            <option value="en_cours">en cours</option>
            <option value="terminé">terminé</option>
          </select>
          <div className="form-dates">
            <label>
              Début
              <input type="date" name="started_at" value={form.started_at} onChange={handleChange} />
            </label>
            <label>
              Fin
              <input type="date" name="finished_at" value={form.finished_at} onChange={handleChange} />
            </label>
          </div>
          <div className="form-actions">
            <button className="btn-validate" onClick={handleSave}>Sauvegarder</button>
            <button className="btn-cancel" onClick={() => setEditMode(false)}>Annuler</button>
          </div>
        </div>
      </div>
    );
  }

  // ── Mode lecture ──
  return (
    <div className="project-card" style={{ backgroundColor: cardColor }}>
      <p className="project-name">{project.name}</p>
      {project.description && (
        <p className="project-description">{project.description}</p>
      )}
      <p className="project-status">
        {STATUS_EMOJI[project.status]} {project.status}
      </p>
      <div className="project-dates">
        <span>Début : {project.started_at || "—"}</span>
        <span>Fin : {project.finished_at || "—"}</span>
      </div>
      <div className="card-actions">
        <button className="btn-edit" onClick={() => setEditMode(true)}>
          ✏️ Modifier
        </button>
        <button
          className="btn-delete"
          onClick={handleDelete}
          aria-label={`Supprimer le projet ${project.name}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

export default ProjectCard;
