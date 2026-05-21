CREATE TYPE status_type AS ENUM (
    'à_initier',
    'en_cours',
    'terminé'
);

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

CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    validated BOOLEAN DEFAULT false,
    project_id INT REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);