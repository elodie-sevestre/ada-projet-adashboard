// ==================== Connexion à la base de données ====================
// Ce module crée et exporte un pool de connexions PostgreSQL.
// Un "pool" permet de réutiliser plusieurs connexions simultanées
// plutôt que d'en ouvrir une nouvelle à chaque requête.

import { Pool } from "pg";

// Initialise et charge les variables d'environnement depuis le fichier .env
import dotenv from "dotenv";
dotenv.config();

// Création du pool avec les paramètres de connexion issus du .env
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: "localhost",
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: process.env.POSTGRES_PORT,
});

// Test de connexion au démarrage : affiche un message selon le résultat
pool
  .connect()
  .then(() => {
    console.log("🟢 Connected to the database");
  })
  .catch((err) => {
    console.error("🔴 Error connecting to the database", err);
  });

export default pool;
