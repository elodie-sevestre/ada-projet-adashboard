-- ==================== Migration UP ====================
-- Crée toutes les tables du schéma adashboard v2
-- Nouveau modèle : skills organisées par catégorie,
-- liées aux projets via une table de liaison projects_skills

CREATE TYPE status_type AS ENUM (
    'à_initier',
    'en_cours',
    'terminé'
);

-- Catégories de compétences (HTML/CSS, JavaScript, React, SQL...)
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Compétences, chacune rattachée à une catégorie
-- validated : true si la compétence est acquise, indépendamment des projets
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    validated BOOLEAN DEFAULT false,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projets réalisés
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status status_type DEFAULT 'à_initier',
    started_at DATE,
    finished_at DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Table de liaison : une skill peut être pratiquée dans plusieurs projets
-- et un projet mobilise plusieurs skills
CREATE TABLE projects_skills (
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, skill_id)
);
