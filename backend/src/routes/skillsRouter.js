// ==================== Routes : skills ====================
// Ce routeur gère les opérations CRUD sur la table "skills".
// Une skill est rattachée à une catégorie via category_id.

import express from "express";
import pool from "../db.js"; // connexion PostgreSQL

export const skillsRouter = express.Router();

// GET /skills - Récupère toutes les skills, triées par catégorie
skillsRouter.get("/", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT skills.id, skills.description, skills.validated, skills.category_id,
      categories.name AS category_name
    FROM skills
    JOIN categories ON skills.category_id = categories.id
    ORDER BY skills.category_id, skills.id`
  );
  res.json(rows);
});

// GET /skills/:id - Récupère une skill par son id
// Inclut les projets dans lesquels elle a été pratiquée
skillsRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT
      skills.id,
      skills.description,
      skills.validated,
      skills.category_id,
      COALESCE(
        JSON_AGG(projects.name ORDER BY projects.name) FILTER (WHERE projects.id IS NOT NULL),
        '[]'
      ) AS projects
    FROM skills
    LEFT JOIN projects_skills ON skills.id = projects_skills.skill_id
    LEFT JOIN projects ON projects_skills.project_id = projects.id
    WHERE skills.id = $1
    GROUP BY skills.id`,
    [req.params.id]
  );
  res.json(rows[0]);
});

// POST /skills - Crée une nouvelle skill
// Attend dans le body : { description, category_id }
skillsRouter.post("/", async (req, res) => {
  const { rows } = await pool.query(
    "INSERT INTO skills (description, category_id) VALUES ($1, $2) RETURNING *",
    [req.body.description, req.body.category_id]
  );
  res.status(201).json(rows[0]);
});

// PATCH /skills/:id - Bascule le statut "validé" d'une skill
// Attend dans le body : { validated: boolean }
skillsRouter.patch("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE skills SET validated = $1 WHERE id = $2 RETURNING *",
    [req.body.validated, req.params.id]
  );
  res.json(rows[0]);
});

// DELETE /skills/:id - Supprime une skill par son id
skillsRouter.delete("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "DELETE FROM skills WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  res.json(rows[0]);
});
