// ==================== Configuration API ====================
// URL de base du server, centralisée ici pour éviter de la dupliquer
// dans chaque composant.
//
// En dev, la valeur par défaut pointe vers le serveur Express local.
// Pour un autre environnement (déploiement, port différent...),
// définir VITE_API_URL dans un fichier .env à la racine de client/ :
//   VITE_API_URL=https://mon-api.example.com

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
