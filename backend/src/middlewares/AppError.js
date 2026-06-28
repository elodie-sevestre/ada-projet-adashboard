// ==================== Erreur applicative custom ====================
// Permet de throw une erreur métier avec un status HTTP explicite,
// reconnue par errorHandler.js au même titre que les erreurs PostgreSQL.
// Usage : throw new AppError(404, "Projet introuvable");

export class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
