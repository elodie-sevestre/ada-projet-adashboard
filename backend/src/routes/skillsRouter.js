// ==================== Routes : skills ====================
// Ce routeur gère les opérations CRUD sur la table "skills".
// Une skill est toujours rattachée à un projet via project_id.

import express from "express";
import pool from "../db.js"; // connexion PostgreSQL

export const skillsRouter = express.Router();

// GET /skills - Récupère toutes les skills, triées par projet
skillsRouter.get("/", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, description, validated, project_id, TO_CHAR(created_at, 'DD-MM-YYYY') AS created_at FROM skills ORDER BY project_id",
  );
  res.json(rows);
});

// GET /skills/:id - Récupère une skill par son id
skillsRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, description, validated, project_id, TO_CHAR(created_at, 'DD-MM-YYYY') AS created_at FROM skills WHERE id = $1",
    [req.params.id],
  );
  res.json(rows[0]);
});

// POST /skills - Crée une nouvelle skill
// Attend dans le body : { description, project_id }
skillsRouter.post("/", async (req, res) => {
  const insertNewSkill = await pool.query(
    "INSERT INTO skills (description, project_id) VALUES ($1, $2) RETURNING *",
    [req.body.description, req.body.project_id],
  );
  res.status(201).json(insertNewSkill.rows[0]);
});

// PATCH /skills/:id - Bascule le statut "validé" d'une skill
// Attend dans le body : { validated: boolean }
skillsRouter.patch("/:id", async (req, res) => {
  const updateSkill = await pool.query(
    "UPDATE skills SET validated = $1 WHERE id = $2 RETURNING *",
    [req.body.validated, req.params.id],
  );
  res.json(updateSkill.rows[0]);
});

// DELETE /skills/:id - Supprime une skill par son id
skillsRouter.delete("/:id", async (req, res) => {
  const deleteSkill = await pool.query(
    "DELETE FROM skills WHERE id = $1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteSkill.rows[0]);
});
