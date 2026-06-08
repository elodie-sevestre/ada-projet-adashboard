// ==================== Routeur principal ====================
// Ce fichier centralise les routes de l'API.
// Il évite de surcharger server.js en déléguant chaque groupe
// de routes à un sous-routeur dédié (projects, skills).

import express from "express";
import { projectsRouter } from "./routes/projectsRouter.js";
import { skillsRouter } from "./routes/skillsRouter.js";

export const router = express.Router();

// Toutes les requêtes vers /skills sont gérées par skillsRouter
router.use("/skills", skillsRouter);

// Toutes les requêtes vers /projects sont gérées par projectsRouter
router.use("/projects", projectsRouter);
