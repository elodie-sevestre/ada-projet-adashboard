// ==================== Serveur Express ====================
// Point d'entrée de l'API. Configure et démarre le serveur HTTP.

import express from "express";
import cors from "cors";
import pool from "./db.js"; // connexion PostgreSQL (importé pour déclencher le test de connexion au démarrage)
import { router } from "./router.js";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler.js";

const app = express();

// Port configurable via .env, avec valeur par défaut pour le dev local
const PORT = process.env.PORT || 3000;

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

// Toute requête qui n'a matché aucune route ci-dessus renvoie un 404 JSON
app.use(notFoundHandler);

// Middleware d'erreur : doit être monté en dernier.
// Express 5 y redirige automatiquement les promesses rejetées des handlers async.
app.use(errorHandler);

// Démarre le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé : http://localhost:${PORT}`);
});
