// ==================== Composant ProjectCard ====================
// Affiche une carte projet en deux niveaux :
//   - toujours visible : nom, description, statut
//   - déplié via bouton ▾ : dates, modifier, supprimer
//
// Le mode édition remplace la carte entière.
//
// Props :
//   - project    : objet projet (id, name, description, status, started_at, finished_at)
//   - onRefresh  : callback pour forcer le rechargement de la liste parente
//   - onError    : callback(message) pour afficher un toast d'erreur
//   - isDragging : booléen optionnel (true quand la carte est dans le DragOverlay)

import { useState } from "react";
import { API_URL } from "../api";

const STATUS_COLORS = {
  "TODO":        "#F0ECD4",
  "IN_PROGRESS": "#D6E8F0",
  "DONE":        "#D4ECD2",
};

const STATUS_EMOJI = {
  "TODO":        "⚪",
  "IN_PROGRESS": "🔵",
  "DONE":        "🟢",
};

const STATUS_LABEL = {
  "TODO":        "À faire",
  "IN_PROGRESS": "En cours",
  "DONE":        "Terminé",
};

const toInputDate = (str) => {
  if (!str) return "";
  return str.slice(0, 10);
};

const formatDate = (str) => {
  if (!str) return "—";
  const [y, m, d] = toInputDate(str).split("-");
  return `${d}/${m}/${y}`;
};

function ProjectCard({ project, onRefresh, onError, isDragging = false }) {
  const [editMode, setEditMode] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const [form, setForm] = useState({
    name:        project.name,
    description: project.description || "",
    status:      project.status,
    started_at:  toInputDate(project.started_at),
    finished_at: toInputDate(project.finished_at),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await fetch(`${API_URL}/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          started_at:  form.started_at  || null,
          finished_at: form.finished_at || null,
        }),
      });
      setEditMode(false);
      onRefresh();
    } catch (err) {
      console.error("Erreur :", err);
      onError("Impossible de modifier le projet.");
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/projects/${project.id}`, { method: "DELETE" });
      onRefresh();
    } catch (err) {
      console.error("Erreur :", err);
      onError("Impossible de supprimer le projet.");
    }
  };

  const cardColor = STATUS_COLORS[project.status] || "#F7F4EE";

  if (editMode) {
    return (
      <article
        className="project-card"
        style={{ backgroundColor: cardColor }}
        aria-label={`Modifier le projet ${project.name}`}
      >
        <div className="project-form">
          <label htmlFor={`name-${project.id}`} className="sr-only">Nom</label>
          <input id={`name-${project.id}`} type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nom du projet" />
          <label htmlFor={`desc-${project.id}`} className="sr-only">Description</label>
          <textarea id={`desc-${project.id}`} name="description" value={form.description} onChange={handleChange} placeholder="Description" />
          <label htmlFor={`status-${project.id}`} className="sr-only">Statut</label>
          <select id={`status-${project.id}`} name="status" value={form.status} onChange={handleChange}>
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="DONE">Terminé</option>
          </select>
          <div className="form-dates">
            <label htmlFor={`start-${project.id}`}>
              Début
              <input id={`start-${project.id}`} type="date" name="started_at" value={form.started_at} onChange={handleChange} />
            </label>
            <label htmlFor={`end-${project.id}`}>
              Fin
              <input id={`end-${project.id}`} type="date" name="finished_at" value={form.finished_at} onChange={handleChange} />
            </label>
          </div>
          <div className="form-actions">
            <button className="btn-validate" onClick={handleSave}>Sauvegarder</button>
            <button className="btn-cancel" onClick={() => setEditMode(false)}>Annuler</button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className={`project-card${isDragging ? " project-card--dragging" : ""}`}
      style={{ backgroundColor: cardColor }}
      aria-label={`Projet ${project.name}`}
    >
      <p className="project-name">{project.name}</p>
      {project.description && (
        <p className="project-description">{project.description}</p>
      )}
      <p className="project-status" aria-label={`Statut : ${STATUS_LABEL[project.status]}`}>
        <span aria-hidden="true">{STATUS_EMOJI[project.status]}</span>{" "}
        {STATUS_LABEL[project.status]}
      </p>

      <button
        className={`btn-expand${expanded ? " btn-expand--open" : ""}`}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-label={expanded ? "Réduire les détails" : "Voir les détails"}
      >
        {expanded ? "▴" : "▾"}
      </button>

      {expanded && (
        <div className="project-card-details">
          <div className="project-dates">
            <span>Début : {formatDate(project.started_at)}</span>
            <span>Fin : {formatDate(project.finished_at)}</span>
          </div>
          <div className="card-actions">
            <button className="btn-edit" onClick={() => setEditMode(true)} aria-label={`Modifier le projet ${project.name}`}>
              ✏️ Modifier
            </button>
            <button className="btn-delete" onClick={handleDelete} aria-label={`Supprimer le projet ${project.name}`}>
              🗑️
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default ProjectCard;
