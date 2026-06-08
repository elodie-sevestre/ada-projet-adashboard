// ==================== Serveur Express ====================
// Point d'entrée de l'API. Configure et démarre le serveur HTTP.

import express from "express";
import cors from "cors";
import pool from "./db.js"; // connexion PostgreSQL (importé pour déclencher le test de connexion au démarrage)
import { router } from "./router.js";

const app = express();

// Autorise les requêtes cross-origin (nécessaire pour le frontend React sur un port différent)
app.use(cors());

// Permet de lire le corps des requêtes au format JSON
app.use(express.json());

// Route de test pour vérifier que le serveur répond
app.get("/", function (req, res) {
  res.send("Hello Ada!\n");
});

// Monte le routeur principal sur la racine "/"
app.use("/", router);

// Démarre le serveur sur le port 3000
app.listen(3000, () => {
  console.log("🚀 Serveur lancé : http://localhost:3000");
});
