// ==================== Middleware de gestion d'erreurs ====================
// Express 5 transmet automatiquement les promesses rejetées des handlers
// async à ce middleware (pas besoin de try/catch dans chaque route).
//
// On traduit ici les codes d'erreur PostgreSQL les plus courants
// en réponses HTTP explicites, et tout le reste en 500 générique
// (sans exposer les détails internes au frontend).

// Codes d'erreur PostgreSQL : https://www.postgresql.org/docs/current/errcodes-appendix.html
const PG_ERROR_MAP = {
  "22P02": { status: 400, message: "Format de paramètre invalide" }, // ex : id non numérique
  23502: { status: 400, message: "Champ obligatoire manquant" }, // violation NOT NULL
  23503: { status: 400, message: "Référence inexistante (clé étrangère)" }, // FK violation
  23505: { status: 409, message: "Cette ressource existe déjà" }, // doublon (clé unique)
  22001: { status: 400, message: "Valeur trop longue" }, // dépasse VARCHAR(n)
};

export function errorHandler(err, req, res, next) {
  // Log complet côté serveur pour le débogage
  console.error(`🔴 [${req.method} ${req.originalUrl}]`, err.message);

  const mapped = PG_ERROR_MAP[err.code];
  if (mapped) {
    return res.status(mapped.status).json({ error: mapped.message });
  }

  // Erreur inattendue : 500 générique, sans stack trace côté frontend
  res.status(500).json({ error: "Erreur interne du serveur" });
}

// Middleware pour les routes inexistantes (monté après le routeur principal)
export function notFoundHandler(req, res) {
  res
    .status(404)
    .json({ error: `Route ${req.method} ${req.originalUrl} introuvable` });
}
