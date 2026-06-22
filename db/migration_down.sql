-- ==================== Migration DOWN ====================
-- Supprime toutes les tables dans l'ordre inverse des dépendances

DROP TABLE IF EXISTS projects_skills;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS categories;
DROP TYPE IF EXISTS status_type;
