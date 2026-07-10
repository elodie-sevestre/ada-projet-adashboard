// ==================== Connexion à la base de données ====================
// Ce module crée et exporte un pool de connexions PostgreSQL.
// Un "pool" permet de réutiliser plusieurs connexions simultanées
// plutôt que d'en ouvrir une nouvelle à chaque requête.

import { Pool } from "pg";

// Initialise et charge les variables d'environnement depuis le fichier .env
import dotenv from "dotenv";
dotenv.config();

// Création du pool avec les paramètres de connexion issus du .env
// L'hôte est configurable (utile si la base tourne ailleurs qu'en local,
// par exemple dans un conteneur Docker sur un autre réseau)
//
// Si DATABASE_URL est défini (ex: Neon en production), on l'utilise directement
// avec SSL activé. Sinon on retombe sur les paramètres séparés (Docker en local).
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : new Pool({
      user: process.env.POSTGRES_USER,
      host: process.env.POSTGRES_HOST || "localhost",
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
      port: process.env.POSTGRES_PORT || 5432,
    });

// Test de connexion au démarrage : affiche un message selon le résultat
pool
  .connect()
  .then((frontend) => {
    console.log("🟢 Connected to the db");
    frontend.release(); // rend la connexion au pool au lieu de la garder occupée
  })
  .catch((err) => {
    console.error("🔴 Error connecting to the db", err);
  });

export default pool;
