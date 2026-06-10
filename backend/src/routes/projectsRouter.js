// ==================== Routes : projects ====================
// Ce routeur gère les opérations CRUD sur la table "projects".
// Il expose également des routes pour gérer les liaisons projects_skills.
//
// Les dates sont renvoyées au format ISO (YYYY-MM-DD) directement depuis PostgreSQL.
// La mise en forme pour l'affichage (DD/MM/YYYY) est faite côté front uniquement.
// Cela évite toute conversion aller-retour et garantit que les PUT reçoivent
// toujours des dates dans le format attendu par PostgreSQL.
//
// Gestion d'erreurs : les promesses rejetées sont transmises automatiquement
// par Express 5 au middleware errorHandler.

import express from "express";
import pool from "../db.js";

export const projectsRouter = express.Router();

// GET /projects - Récupère tous les projets (dates en ISO YYYY-MM-DD)
projectsRouter.get("/", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, name, description, status,
      started_at, finished_at, created_at
    FROM projects
    ORDER BY id`
  );
  res.json(rows);
});

// GET /projects/:id - Récupère un projet par son id
projectsRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT id, name, description, status,
      started_at, finished_at, created_at
    FROM projects WHERE id = $1`,
    [req.params.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: "Projet introuvable" });
  }
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
// Attend dans le body : { name, description, status, started_at, finished_at }
projectsRouter.post("/", async (req, res) => {
  const { name, description, status, started_at, finished_at } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ error: "Le champ name est requis" });
  }
  const { rows } = await pool.query(
    `INSERT INTO projects (name, description, status, started_at, finished_at)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name.trim(), description, status || "TODO", started_at || null, finished_at || null]
  );
  res.status(201).json(rows[0]);
});

// POST /projects/:id/skills - Associe une skill à un projet
projectsRouter.post("/:id/skills", async (req, res) => {
  if (!req.body.skill_id) {
    return res.status(400).json({ error: "Le champ skill_id est requis" });
  }
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
  if (!rows[0]) {
    return res.status(404).json({ error: "Liaison projet-skill introuvable" });
  }
  res.json(rows[0]);
});

// PUT /projects/:id - Met à jour un projet existant
// Attend dans le body : { name, description, status, started_at, finished_at }
// Les dates doivent être au format YYYY-MM-DD ou null
projectsRouter.put("/:id", async (req, res) => {
  const { name, description, status, started_at, finished_at } = req.body;
  if (!name?.trim()) {
    return res.status(400).json({ error: "Le champ name est requis" });
  }
  const { rows } = await pool.query(
    `UPDATE projects SET name = $1, description = $2, status = $3,
      started_at = $4, finished_at = $5, updated_at = NOW()
    WHERE id = $6 RETURNING *`,
    [
      name.trim(),
      description,
      status,
      started_at || null,
      finished_at || null,
      req.params.id,
    ]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: "Projet introuvable" });
  }
  res.json(rows[0]);
});

// DELETE /projects/:id - Supprime un projet par son id
projectsRouter.delete("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "DELETE FROM projects WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (!rows[0]) {
    return res.status(404).json({ error: "Projet introuvable" });
  }
  res.json(rows[0]);
});
