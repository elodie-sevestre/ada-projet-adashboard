-- migration_down.sql contient le SQL qui permet de supprimer toutes les tables (l'inverse de migration_up)

DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS projects;
DROP TYPE IF EXISTS status_type;