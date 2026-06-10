// ==================== Composant Projects ====================
// Vue kanban des projets organisés en trois colonnes par statut.
// Le drag & drop (via @dnd-kit) permet de déplacer une carte
// d'une colonne à l'autre, ce qui met à jour le statut en base via PUT.

import { useState, useEffect } from "react";
import { API_URL } from "../api";
import ProjectCard from "./ProjectCard";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
} from "@dnd-kit/core";

// Définition des colonnes : valeur ENUM → label affiché
const COLUMNS = [
  { id: "TODO",        label: "À faire" },
  { id: "IN_PROGRESS", label: "En cours" },
  { id: "DONE",        label: "Terminé" },
];

function Projects() {
  const [projects, setProjects] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [activeProject, setActiveProject] = useState(null); // carte en cours de drag

  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "TODO",
    started_at: "",
    finished_at: "",
  });

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/projects`);
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [refresh]);

  const handleNewChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async () => {
    if (!newProject.name.trim()) return;
    try {
      await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      setNewProject({ name: "", description: "", status: "TODO", started_at: "", finished_at: "" });
      setShowForm(false);
      setRefresh((prev) => prev + 1);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  // Configure le capteur pointeur avec une distance minimale
  // pour éviter de déclencher le drag sur un simple clic
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event) => {
    const project = projects.find((p) => String(p.id) === String(event.active.id));
    setActiveProject(project || null);
  };

  // Au drop : si la carte atterrit sur une colonne différente de son statut actuel,
  // on met à jour le statut optimistement en local puis on persiste en base
  const handleDragEnd = async (event) => {
    setActiveProject(null);
    const { active, over } = event;
    if (!over) return;

    const projectId = String(active.id);
    const newStatus = String(over.id);

    // over.id peut être l'id d'une colonne ou d'une autre carte
    // on ne gère que les drops sur les colonnes (TODO / IN_PROGRESS / DONE)
    if (!COLUMNS.find((c) => c.id === newStatus)) return;

    const project = projects.find((p) => String(p.id) === projectId);
    if (!project || project.status === newStatus) return;

    // Mise à jour optimiste
    setProjects((prev) =>
      prev.map((p) => (String(p.id) === projectId ? { ...p, status: newStatus } : p))
    );

    try {
      await fetch(`${API_URL}/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: project.name,
          description: project.description,
          status: newStatus,
          started_at: project.started_at,
          finished_at: project.finished_at,
        }),
      });
    } catch (err) {
      console.error("Erreur :", err);
      // Rollback si l'appel échoue
      setRefresh((prev) => prev + 1);
    }
  };

  return (
    <>
      <h3>Projets</h3>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="kanban-board" aria-label="Tableau kanban des projets">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              column={col}
              projects={projects.filter((p) => p.status === col.id)}
              onRefresh={() => setRefresh((prev) => prev + 1)}
            />
          ))}
        </div>

        {/* Carte fantôme affichée sous le curseur pendant le drag */}
        <DragOverlay>
          {activeProject ? (
            <ProjectCard
              project={activeProject}
              onRefresh={() => {}}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <button
        className="btn-add"
        onClick={() => setShowForm(!showForm)}
        aria-expanded={showForm}
        aria-controls="new-project-form"
      >
        + nouveau projet
      </button>

      {showForm && (
        <div className="project-form" id="new-project-form" role="form" aria-label="Créer un nouveau projet">
          <label htmlFor="new-name">Nom du projet</label>
          <input id="new-name" type="text" name="name" placeholder="Nom du projet" value={newProject.name} onChange={handleNewChange} />
          <label htmlFor="new-description">Description</label>
          <textarea id="new-description" name="description" placeholder="Description" value={newProject.description} onChange={handleNewChange} />
          <label htmlFor="new-status">Statut</label>
          <select id="new-status" name="status" value={newProject.status} onChange={handleNewChange}>
            <option value="TODO">À faire</option>
            <option value="IN_PROGRESS">En cours</option>
            <option value="DONE">Terminé</option>
          </select>
          <div className="form-dates">
            <label htmlFor="new-start">
              Début
              <input id="new-start" type="date" name="started_at" value={newProject.started_at} onChange={handleNewChange} />
            </label>
            <label htmlFor="new-end">
              Fin
              <input id="new-end" type="date" name="finished_at" value={newProject.finished_at} onChange={handleNewChange} />
            </label>
          </div>
          <div className="form-actions">
            <button className="btn-validate" onClick={handleAddProject}>Créer</button>
            <button className="btn-cancel" onClick={() => setShowForm(false)}>Annuler</button>
          </div>
        </div>
      )}
    </>
  );
}

// ── Composant colonne kanban ──
// Wrappé dans useDroppable pour recevoir les cartes draguées

import { useDroppable } from "@dnd-kit/core";

function KanbanColumn({ column, projects, onRefresh }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <section
      ref={setNodeRef}
      className={`kanban-column${isOver ? " kanban-column--over" : ""}`}
      aria-label={`Colonne ${column.label}`}
    >
      <h4 className="kanban-column-title">
        {column.label}
        <span className="kanban-column-count">{projects.length}</span>
      </h4>
      <div className="kanban-column-cards">
        {projects.map((project) => (
          <DraggableCard key={project.id} project={project} onRefresh={onRefresh} />
        ))}
      </div>
    </section>
  );
}

// ── Composant carte draggable ──

import { useDraggable } from "@dnd-kit/core";

function DraggableCard({ project, onRefresh }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: String(project.id),
  });

  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`draggable-card${isDragging ? " draggable-card--dragging" : ""}`}
      {...listeners}
      {...attributes}
    >
      <ProjectCard project={project} onRefresh={onRefresh} />
    </div>
  );
}

export default Projects;
