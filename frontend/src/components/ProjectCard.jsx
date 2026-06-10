// ==================== Composant ProjectCard ====================
// Affiche une carte pour un projet avec deux modes :
//   - mode lecture  : nom, description, statut, dates
//   - mode édition  : formulaire avec calendrier natif et select statut
//
// Les dates arrivent de l'API au format ISO YYYY-MM-DD (ou YYYY-MM-DDTHH:mm:ss.sssZ).
// - Pour l'input type="date" : on tronque à YYYY-MM-DD, c'est le bon format natif.
// - Pour l'affichage : on formate en DD/MM/YYYY via formatDate().
// Pas de conversion aller-retour : on renvoie toujours YYYY-MM-DD au PUT.
//
// Props :
//   - project    : objet projet (id, name, description, status, started_at, finished_at)
//   - onRefresh  : callback pour forcer le rechargement de la liste parente
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

// Tronque une date ISO (YYYY-MM-DDTHH:… ou YYYY-MM-DD) à YYYY-MM-DD
// pour l'utiliser dans un input type="date"
const toInputDate = (str) => {
  if (!str) return "";
  return str.slice(0, 10); // "2026-05-19T00:00:00.000Z" → "2026-05-19"
};

// Formate YYYY-MM-DD en DD/MM/YYYY pour l'affichage
const formatDate = (str) => {
  if (!str) return "—";
  const d = toInputDate(str); // normalise si besoin
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
};

function ProjectCard({ project, onRefresh, isDragging = false }) {
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    name:        project.name,
    description: project.description || "",
    status:      project.status,
    started_at:  toInputDate(project.started_at),  // YYYY-MM-DD pour l'input
    finished_at: toInputDate(project.finished_at),
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Le form contient déjà des dates en YYYY-MM-DD : on envoie tel quel
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
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${API_URL}/projects/${project.id}`, { method: "DELETE" });
      onRefresh();
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const cardColor = STATUS_COLORS[project.status] || "#F7F4EE";

  // ── Mode édition ──
  if (editMode) {
    return (
      <article
        className="project-card"
        style={{ backgroundColor: cardColor }}
        aria-label={`Modifier le projet ${project.name}`}
      >
        <div className="project-form">
          <label htmlFor={`name-${project.id}`} className="sr-only">Nom du projet</label>
          <input
            id={`name-${project.id}`}
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nom du projet"
          />
          <label htmlFor={`desc-${project.id}`} className="sr-only">Description</label>
          <textarea
            id={`desc-${project.id}`}
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
          />
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

  // ── Mode lecture ──
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
      <div className="project-dates">
        <span>Début : {formatDate(project.started_at)}</span>
        <span>Fin : {formatDate(project.finished_at)}</span>
      </div>
      <div className="card-actions">
        <button
          className="btn-edit"
          onClick={() => setEditMode(true)}
          aria-label={`Modifier le projet ${project.name}`}
        >
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
    </article>
  );
}

export default ProjectCard;
