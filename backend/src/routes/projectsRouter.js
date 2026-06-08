// ==================== Routes : projects ====================
// Ce routeur gère les opérations CRUD sur la table "projects".
// Il expose également une route imbriquée pour récupérer
// les skills associées à un projet donné.

import express from "express";
import pool from "../db.js";

export const projectsRouter = express.Router();

// GET /projects - Récupère tous les projets
// Inclut le nombre total de skills et le nombre de skills validées
// (utilisé pour calculer la barre de progression côté frontend)
projectsRouter.get("/", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT 
      projects.id, 
      projects.name, 
      projects.description, 
      projects.status, 
      TO_CHAR(started_at, 'DD-MM-YYYY') AS started_at, 
      TO_CHAR(finished_at, 'DD-MM-YYYY') AS finished_at, 
      TO_CHAR(projects.created_at, 'DD-MM-YYYY') AS created_at,
      COUNT(skills.id) AS total_skills,
      COUNT(skills.id) FILTER (WHERE skills.validated = true) AS validated_skills
    FROM projects 
    LEFT JOIN skills ON projects.id = skills.project_id 
    GROUP BY projects.id 
    ORDER BY projects.id`,
  );
  res.json(rows);
});

// GET /projects/:id - Récupère un projet par son id
projectsRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name, description, status, TO_CHAR(started_at, 'DD-MM-YYYY') AS started_at , TO_CHAR(finished_at, 'DD-MM-YYYY') AS finished_at , TO_CHAR(created_at, 'DD-MM-YYYY') AS created_at , TO_CHAR(updated_at, 'DD-MM-YYYY') AS updated_at FROM projects WHERE id = $1",
    [req.params.id],
  );
  res.json(rows[0]);
});

// GET /projects/:id/skills - Récupère toutes les skills d'un projet donné
projectsRouter.get("/:id/skills", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT skills.id, skills.description, skills.validated FROM skills WHERE skills.project_id = $1 ORDER BY skills.id",
    [req.params.id],
  );
  res.json(rows);
});

// POST /projects - Crée un nouveau projet
// Attend dans le body : { name, description }
projectsRouter.post("/", async (req, res) => {
  const insertNewProject = await pool.query(
    "INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
    [req.body.name, req.body.description],
  );
  res.status(201).json(insertNewProject.rows[0]);
});

// PUT /projects/:id - Met à jour un projet existant
// Attend dans le body : { name, description, status, started_at, finished_at }
projectsRouter.put("/:id", async (req, res) => {
  const updateProject = await pool.query(
    "UPDATE projects SET name = $1, description = $2, status = $3, started_at = $4, finished_at = $5, updated_at = NOW() WHERE id = $6 RETURNING *",
    [
      req.body.name,
      req.body.description,
      req.body.status,
      req.body.started_at,
      req.body.finished_at,
      req.params.id,
    ],
  );
  res.json(updateProject.rows[0]);
});

// DELETE /projects/:id - Supprime un projet par son id
projectsRouter.delete("/:id", async (req, res) => {
  const deleteProjects = await pool.query(
    "DELETE FROM projects WHERE id=$1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteProjects.rows[0]);
});
