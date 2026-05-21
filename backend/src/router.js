// Router : pour organiser les routes
// Pour éviter que app.js devienne trop gros, on utilise express.Router().

import express from "express";
import { projectsRouter } from "./routes/projectsRouter.js";
import { skillsRouter } from "./routes/skillsRouter.js";

export const router = express.Router();

router.use("/skills", skillsRouter);
router.use("/projects", projectsRouter);
