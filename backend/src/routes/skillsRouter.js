// ==================== Table : skills ====================

import express from "express";
import pool from "../db.js"; // connexion PostgreSQL

export const skillsRouter = express.Router();

// GET - récupérer toutes les skills
skillsRouter.get("/", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, description, validated, project_id, TO_CHAR(created_at, 'DD-MM-YYYY') AS created_at FROM skills ORDER BY project_id",
  );
  res.json(rows);
});

// GET /:id - récupérer une skill par son id
skillsRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, description, validated, project_id, TO_CHAR(created_at, 'DD-MM-YYYY') AS created_at FROM skills WHERE id = $1",
    [req.params.id],
  );
  res.json(rows[0]);
});

// POST - insérer une nouvelle skill
skillsRouter.post("/", async (req, res) => {
  const insertNewSkill = await pool.query(
    "INSERT INTO skills (description, project_id) VALUES ($1, $2) RETURNING *",
    [req.body.description, req.body.project_id],
  );
  res.status(201).json(insertNewSkill.rows[0]);
});

// PATCH /:id - modifier le statut validé d'une skill
skillsRouter.patch("/:id", async (req, res) => {
  const updateSkill = await pool.query(
    "UPDATE skills SET validated = $1 WHERE id = $2 RETURNING *",
    [req.body.validated, req.params.id],
  );
  res.json(updateSkill.rows[0]);
});

// DELETE /:id - supprimer une skill par son id
skillsRouter.delete("/:id", async (req, res) => {
  const deleteSkill = await pool.query(
    "DELETE FROM skills WHERE id = $1 RETURNING *",
    [req.params.id],
  );
  res.json(deleteSkill.rows[0]);
});
