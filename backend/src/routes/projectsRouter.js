// ==================== Routes : projects ====================
// Ce routeur gère les opérations CRUD sur la table "projects".
// Il expose également des routes pour gérer les liaisons projects_skills.

import express from "express";
import pool from "../db.js";

export const projectsRouter = express.Router();

// GET /projects - Récupère tous les projets
projectsRouter.get("/", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT
      id, name, description, status,
      TO_CHAR(started_at, 'DD-MM-YYYY') AS started_at,
      TO_CHAR(finished_at, 'DD-MM-YYYY') AS finished_at,
      TO_CHAR(created_at, 'DD-MM-YYYY') AS created_at
    FROM projects
    ORDER BY id`
  );
  res.json(rows);
});

// GET /projects/:id - Récupère un projet par son id
projectsRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, name, description, status,
      TO_CHAR(started_at, 'DD-MM-YYYY') AS started_at,
      TO_CHAR(finished_at, 'DD-MM-YYYY') AS finished_at,
      TO_CHAR(created_at, 'DD-MM-YYYY') AS created_at
    FROM projects WHERE id = $1`,
    [req.params.id]
  );
  res.json(rows[0]);
});

// GET /projects/:id/skills - Récupère les skills pratiquées dans un projet
projectsRouter.get("/:id/skills", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT skills.id, skills.description, skills.validated, categories.name AS category
    FROM skills
    JOIN projects_skills ON skills.id = projects_skills.skill_id
    JOIN categories ON skills.category_id = categories.id
    WHERE projects_skills.project_id = $1
    ORDER BY categories.id, skills.id`,
    [req.params.id]
  );
  res.json(rows);
});

// POST /projects - Crée un nouveau projet
// Attend dans le body : { name, description }
projectsRouter.post("/", async (req, res) => {
  const { rows } = await pool.query(
    "INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
    [req.body.name, req.body.description]
  );
  res.status(201).json(rows[0]);
});

// POST /projects/:id/skills - Associe une skill à un projet
// Attend dans le body : { skill_id }
projectsRouter.post("/:id/skills", async (req, res) => {
  const { rows } = await pool.query(
    "INSERT INTO projects_skills (project_id, skill_id) VALUES ($1, $2) RETURNING *",
    [req.params.id, req.body.skill_id]
  );
  res.status(201).json(rows[0]);
});

// DELETE /projects/:id/skills/:skillId - Dissocie une skill d'un projet
projectsRouter.delete("/:id/skills/:skillId", async (req, res) => {
  const { rows } = await pool.query(
    "DELETE FROM projects_skills WHERE project_id = $1 AND skill_id = $2 RETURNING *",
    [req.params.id, req.params.skillId]
  );
  res.json(rows[0]);
});

// PUT /projects/:id - Met à jour un projet existant
// Attend dans le body : { name, description, status, started_at, finished_at }
projectsRouter.put("/:id", async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE projects SET name = $1, description = $2, status = $3,
      started_at = $4, finished_at = $5, updated_at = NOW()
    WHERE id = $6 RETURNING *`,
    [
      req.body.name,
      req.body.description,
      req.body.status,
      req.body.started_at,
      req.body.finished_at,
      req.params.id,
    ]
  );
  res.json(rows[0]);
});

// DELETE /projects/:id - Supprime un projet par son id
projectsRouter.delete("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "DELETE FROM projects WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  res.json(rows[0]);
});
