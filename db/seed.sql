-- ==================== Seed ====================
-- Données initiales pour adashboard v2

-- Catégories
INSERT INTO categories (name) VALUES
    ('HTML / CSS'),
    ('JavaScript'),
    ('Node.js / Express'),
    ('SQL'),
    ('React'),
    ('Git'),
    ('Outils & Environnement');

-- Projets
INSERT INTO projects (name, description, status, started_at, finished_at) VALUES
    ('adapage',      'site web',                                                   'DONE',  '2026-02-03', '2026-02-06'),
    ('trackada',     'outil CLI',                                                  'DONE',  '2026-02-23', '2026-02-27'),
    ('adaquiz',      'quiz interactif',                                            'DONE',  '2026-03-09', '2026-03-20'),
    ('adalgo',       'tests unitaires',                                            'DONE',  '2026-03-24', '2026-03-27'),
    ('adataviz',     'visualisation de données API',                               'DONE',  '2026-04-07', '2026-04-17'),
    ('adb',    'base de données de gestion de ressources pédagogiques',      'DONE',  '2026-05-04', '2026-05-07'),
    ('adapi',        'API REST pour gérer DB adb',                           'DONE',  '2026-05-07', '2026-05-13'),
    ('adataviz 2.0', 'transformer Adataviz en projet React',                       'DONE',  '2026-05-13', '2026-05-18'),
    ('adashboard',   'création dashboard pour suivi projets école',                'IN_PROGRESS', '2026-05-19', NULL);

-- Skills HTML / CSS (category_id = 1)
INSERT INTO skills (description, validated, category_id) VALUES
    ('Je sais créer une structure HTML de base',                               ,  1),
    ('Je sais utiliser la majorité des balises HTML de base',                  ,  1),
    ('Je sais ajouter des images et du texte dans une page HTML',              ,  1),
    ('Je sais styliser une page avec CSS',                                     ,  1),
    ('Je sais gérer les marges, paddings et alignements avec CSS',             ,  1),
    ('Je sais utiliser Flexbox et Grid pour positionner des éléments',         ,  1),
    ('Je sais gérer une barre de navigation et un footer',                     ,  1),
    ('Je sais rendre une page responsive pour différents appareils',            , 1),
    ('Je sais adapter mes balises à une taille d''écran différente',            , 1);

-- Skills JavaScript (category_id = 2)
INSERT INTO skills (description, validated, category_id) VALUES
    ('Je sais utiliser les boucles et les conditions',                         ,  2),
    ('Je maîtrise les tableaux et les objets en JS',                           ,  2),
    ('Je sais utiliser les callbacks',                                         ,  2),
    ('Je comprends ce qu''est une fonction asynchrone',                        ,  2),
    ('Je sais fetch des données depuis une API',                               ,  2),
    ('Je sais passer des paramètres d''URL dans une requête HTTP',             ,  2),
    ('Je sais manipuler le DOM',                                               ,  2),
    ('Je sais utiliser les événements JavaScript',                             ,  2),
    ('Je sais créer une balise HTML via JavaScript',                           ,  2),
    ('Je sais concevoir un algorithme pour répondre à des instructions',       ,  2),
    ('Je sais écrire des tests unitaires',                                     ,  2),
    ('Je sais expliquer l''intérêt du TDD',                                     , 2);

-- Skills Node.js / Express (category_id = 3)
INSERT INTO skills (description, validated, category_id) VALUES
    ('Je sais exécuter un script avec Node',                                   ,  3),
    ('Je sais importer et utiliser les modules natifs Node',                   ,  3),
    ('Je sais importer et parser un fichier JSON',                             ,  3),
    ('Je sais créer une API REST avec Express',                                ,  3),
    ('Je sais structurer un projet Node.js avec Express',                      ,  3),
    ('Je sais créer des routes CRUD',                                          ,  3),
    ('Je sais utiliser dotenv pour les variables d''environnement',            ,  3),
    ('Je sais utiliser nodemon pour le développement',                         ,  3),
    ('Je sais utiliser les modules ES6 dans Node.js',                          ,  3);

-- Skills SQL (category_id = 4)
INSERT INTO skills (description, validated, category_id) VALUES
    ('Je sais créer des tables SQL avec des contraintes',                      ,  4),
    ('Je sais utiliser des clés étrangères et des relations entre tables',     ,  4),
    ('Je sais insérer des données dans une base de données',                   ,  4),
    ('Je sais écrire des requêtes SELECT avec différents filtres',             ,  4),
    ('Je sais utiliser les jointures SQL',                                     ,  4),
    ('Je sais me connecter à PostgreSQL depuis un server Express',            ,  4),
    ('Je sais gérer les requêtes SQL avec pg',                                 ,  4);

-- Skills React (category_id = 5)
INSERT INTO skills (description, validated, category_id) VALUES
    ('Je comprends ce qu''est un composant',                                   ,  5),
    ('Je comprends ce que sont les props et dans quel sens elles vont',        ,  5),
    ('Je sais ce que fait useState',                                           ,  5),
    ('Je comprends pourquoi on met [] à la fin de useEffect',                   , 5),
    ('Je comprends pourquoi key est obligatoire dans .map()',                   , 5),
    ('Je comprends pourquoi class devient className',                          ,  5),
    ('Je vois la différence entre manipulation DOM vanilla et React',          ,  5),
    ('Je comprends pourquoi chaque composant a son propre state',               , 5),
    ('Je comprends comment un callback remonte une action vers le parent',     ,  5),
    ('Je sais initialiser un projet avec Vite',                                ,  5);

-- Skills Git (category_id = 6)
INSERT INTO skills (description, validated, category_id) VALUES
    ('Je sais travailler en groupe avec Git',                                  ,  6),
    ('Je sais créer et fusionner des branches',                                ,  6),
    ('Je sais résoudre un conflit de merge',                                   ,  6),
    ('Je sais écrire des messages de commit conventionnels',                    , 6);

-- Skills Outils & Environnement (category_id = 7)
INSERT INTO skills (description, validated, category_id) VALUES
    ('Je sais installer une bibliothèque avec npm',                            ,  7),
    ('Je sais configurer une base de données PostgreSQL avec Docker',          ,  7),
    ('Je sais utiliser les chemins de fichiers et dossiers',                   ,  7),
    ('Je sais expliquer ce qu''est le CRUD',                                   ,  7),
    ('Je sais expliquer le fonctionnement d''une API RESTful',                 ,  7);

-- Liaisons projects_skills
-- adapage (1) : HTML/CSS
INSERT INTO projects_skills (project_id, skill_id) VALUES
    (1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9);

-- trackada (2) : JS, Outils
INSERT INTO projects_skills (project_id, skill_id) VALUES
    (2, 10), (2, 11), (2, 12), (2, 20), (2, 22), (2, 23), (2, 24), (2, 49);

-- adaquiz (3) : HTML/CSS, JS, Git
INSERT INTO projects_skills (project_id, skill_id) VALUES
    (3, 1), (3, 4), (3, 5), (3, 6), (3, 10), (3, 11), (3, 17), (3, 18), (3, 46), (3, 47);

-- adalgo (4) : JS
INSERT INTO projects_skills (project_id, skill_id) VALUES
    (4, 10), (4, 11), (4, 12), (4, 19), (4, 20), (4, 21), (4, 50);

-- adataviz (5) : HTML/CSS, JS
INSERT INTO projects_skills (project_id, skill_id) VALUES
    (5, 4), (5, 6), (5, 8), (5, 13), (5, 14), (5, 15), (5, 16), (5, 17), (5, 18), (5, 19);

-- adb (6) : SQL
INSERT INTO projects_skills (project_id, skill_id) VALUES
    (6, 30), (6, 31), (6, 32), (6, 33), (6, 34);

-- adapi (7) : Node.js, SQL
INSERT INTO projects_skills (project_id, skill_id) VALUES
    (7, 25), (7, 26), (7, 27), (7, 28), (7, 29), (7, 35), (7, 36);

-- adataviz 2.0 (8) : React, JS
INSERT INTO projects_skills (project_id, skill_id) VALUES
    (8, 13), (8, 14), (8, 37), (8, 38), (8, 39), (8, 40), (8, 41), (8, 42), (8, 43), (8, 44), (8, 45);

-- adashboard (9) : React, Node.js, SQL, Git
INSERT INTO projects_skills (project_id, skill_id) VALUES
    (9, 25), (9, 28), (9, 30), (9, 34), (9, 35), (9, 36), (9, 37), (9, 38), (9, 39), (9, 40), (9, 43), (9, 46), (9, 47);

SELECT * FROM categories;
SELECT * FROM skills;
SELECT * FROM projects;
SELECT * FROM projects_skills;
