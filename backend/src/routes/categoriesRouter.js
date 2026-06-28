// ==================== Routes : categories ====================
// Ce routeur gère les opérations sur la table "categories".
// Il expose également une route imbriquée pour récupérer
// les skills d'une catégorie avec leur progression.
//
// Gestion d'erreurs : les promesses rejetées (erreurs SQL...) sont
// transmises automatiquement par Express 5 au middleware errorHandler.
// Ici on ne gère que les cas métier : 400 (entrée invalide) et 404 (introuvable).

import express from "express";
import pool from "../db.js";
import { AppError } from "../middlewares/AppError.js";

export const categoriesRouter = express.Router();

// GET /categories - Récupère toutes les catégories
// Inclut le nombre total de skills et le nombre de skills validées
// (utilisé pour calculer la barre de progression par catégorie)
categoriesRouter.get("/", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT
      categories.id,
      categories.name,
      COUNT(skills.id) AS total_skills,
      COUNT(skills.id) FILTER (WHERE skills.validated = true) AS validated_skills
    FROM categories
    LEFT JOIN skills ON categories.id = skills.category_id
    GROUP BY categories.id
    ORDER BY categories.id`
  );
  res.json(rows);
});

// GET /categories/:id - Récupère une catégorie par son id
categoriesRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "SELECT id, name FROM categories WHERE id = $1",
    [req.params.id]
  );
  if (!rows[0]) {
    throw new AppError(404, "Catégorie introuvable");
  }
  res.json(rows[0]);
});

// GET /categories/:id/skills - Récupère les skills d'une catégorie
// Inclut les projets (id + nom) dans lesquels chaque skill a été pratiquée
categoriesRouter.get("/:id/skills", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT
      skills.id,
      skills.description,
      skills.validated,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT('id', projects.id, 'name', projects.name)
          ORDER BY projects.name
        ) FILTER (WHERE projects.id IS NOT NULL),
        '[]'
      ) AS projects
    FROM skills
    LEFT JOIN projects_skills ON skills.id = projects_skills.skill_id
    LEFT JOIN projects ON projects_skills.project_id = projects.id
    WHERE skills.category_id = $1
    GROUP BY skills.id
    ORDER BY skills.id`,
    [req.params.id]
  );
  res.json(rows);
});

// POST /categories - Crée une nouvelle catégorie
// Attend dans le body : { name }
categoriesRouter.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    throw new AppError(400, "Le champ name est requis");
  }
  const { rows } = await pool.query(
    "INSERT INTO categories (name) VALUES ($1) RETURNING *",
    [name.trim()]
  );
  res.status(201).json(rows[0]);
});

// PATCH /categories/:id - Modifie le nom d'une catégorie
// Attend dans le body : { name }
categoriesRouter.patch("/:id", async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) {
    throw new AppError(400, "Le champ name est requis");
  }
  const { rows } = await pool.query(
    "UPDATE categories SET name = $1 WHERE id = $2 RETURNING *",
    [name.trim(), req.params.id]
  );
  if (!rows[0]) {
    throw new AppError(404, "Catégorie introuvable");
  }
  res.json(rows[0]);
});

// DELETE /categories/:id - Supprime une catégorie par son id
// (les skills associées sont supprimées en cascade côté base)
categoriesRouter.delete("/:id", async (req, res) => {
  const { rows } = await pool.query(
    "DELETE FROM categories WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (!rows[0]) {
    throw new AppError(404, "Catégorie introuvable");
  }
  res.json(rows[0]);
});
