INSERT INTO projects (name, description, status, started_at, finished_at) VALUES
    ('adapage', 'site web', 'terminé', '2026-02-03', '2026-02-06'),
    ('trackada', 'outil CLI', 'terminé', '2026-02-23', '2026-02-27'),
    ('adaquiz', 'quiz interactif', 'terminé', '2026-03-09', '2026-03-20'),
    ('adalgo', 'tests unitaires', 'terminé', '2026-03-24', '2026-03-27'),
    ('adataviz', 'visualisation de données API', 'terminé', '2026-04-07', '2026-04-17'),
    ('adatabase', 'base de données de gestion de ressources pédagogiques', 'terminé', '2026-05-04', '2026-05-07'),
    ('adapi', 'API REST pour gérer DB adatabase', 'terminé', '2026-05-07', '2026-05-13'),
    ('adataviz 2.0', 'transformer Adataviz en projet React', 'terminé', '2026-05-13', '2026-05-18'),
    ('adashboard', 'création dashboard pour suivi projets école', 'en_cours', '2026-05-19', NULL);

INSERT INTO skills (description, validated, project_id) VALUES
('Je sais créer une structure HTML de base', true, 1),
('Je sais ajouter des images et du texte dans une page HTML', true, 1),
('Je sais styliser une page web avec CSS', true, 1),
('Je sais rendre une page web responsive pour différents appareils', false, 1),
('Je sais definir et appliquer des styles CSS aux éléments HTML', true, 1),
('Je sais adapter mes balises à une taille d''écran différente', false, 1),
('Je sais utiliser la majorité des balises HTML de base', true, 1),
('Je sais gérer les marges, paddings et alignements avec CSS', true, 1),
('Je sais gérer ma barre de navigation et le footer de ma page', true, 1);

INSERT INTO skills (description, validated, project_id) VALUES
('Je sais utiliser les boucles for', true, 2),
('Je sais utiliser les conditions', true, 2),
('Je sais exécuter un script avec Node', true, 2),
('Je sais importer et utiliser les fonctions natives des modules Node', true, 2),
('Je sais importer et parser un fichier JSON', true, 2),
('Je sais concevoir un algorithme pour répondre à des instructions précises', true, 2),
('Je sais expliquer comment fonctionnent les chemins de fichiers et dossiers (path)', true, 2);

INSERT INTO skills (description, validated, project_id) VALUES
('Je sais initialiser un projet avec Vite', true, 3),
('Je sais travailler en groupe avec Git', true, 3),
('Je sais créer une page HTML à partir d''un wireframe', true, 3),
('Je sais utiliser CSS pour positionner des éléments (Flexbox, Grid)', true, 3),
('Je sais utiliser CSS pour modifier le design de ma page', true, 3),
('Je sais récupérer des éléments du DOM en JavaScript', true, 3),
('Je sais utiliser les événements JavaScript', true, 3),
('Je sais utiliser les boucles et les conditions', true, 3),
('Je sais coder une logique à partir d''un énoncé', true, 3);

INSERT INTO skills (description, validated, project_id) VALUES
('Je sais utiliser créer un petit algorithme à partir d''instructions', true, 4),
('Je sais installer une bibliothèque de testing avec npm', true, 4),
('Je sais écrire des tests unitaires', true, 4),
('Je sais executer mes tests unitaires', true, 4),
('Je sais expliquer l''interet du TDD', false, 4),
('Je maîtrise les bases du js (conditions, boucles, tableaux, objets, callbacks)', true, 4);

INSERT INTO skills (description, validated, project_id) VALUES
('Je sais connecter mon HTML avec mon JS', true, 5),
('Je sais utiliser le CSS', true, 5),
('Je sais quand utiliser grid et flexbox', true, 5),
('Je sais rendre ma page responsive', true, 5),
('Je sais créer une balise HTML via mon JS', true, 5),
('Je sais rajouer des informations dans cette balise', true, 5),
('Je sais afficher les données récuperer par l''API', true, 5),
('Je comprends comment fonctionne une API et peut l''expliquer', true, 5),
('Je sais manipuler un évènement pour l''afficher ou non', true, 5),
('Je sais changer le CSS via mon évènement JS', true, 5),
('Je sais fetch des données', true, 5),
('Je comprends ce qu''est une fonction asynchrone', true, 5),
('Je sais passer des paramètres d''URL dans une requête HTTP', true, 5);

INSERT INTO skills (description, validated, project_id) VALUES
('Je sais créer des tables SQL avec des contraintes', true, 6),
('Je sais utiliser des clés étrangères et des relations entre tables', true, 6),
('Je sais insérer des données dans une base de données', true, 6),
('Je sais écrire des requêtes SELECT avec différents filtres', true, 6),
('Je sais utiliser les jointures SQL', true, 6);

INSERT INTO skills (description, validated, project_id) VALUES
('Je sais créer une API REST avec Express', true, 7),
('Je sais me connecter à une base de données PostgreSQL', true, 7),
('Je sais gérer les requêtes SQL avec pg', true, 7),
('Je sais utiliser dotenv pour gérer les variables d''environnement', true, 7),
('Je sais utiliser nodemon pour le développement', true, 7),
('Je sais structurer un projet Node.js avec Express', true, 7),
('Je sais créer des routes CRUD (Create, Read, Update, Delete) pour une API REST', true, 7),
('Je sais gérer les erreurs de connexion à la base de données', true, 7),
('Je sais utiliser les modules ES6 dans un projet Node.js', true, 7);

INSERT INTO skills (description, validated, project_id) VALUES
('Je comprends pourquoi class devient className', true, 8),
('Je sais ce que fait useState et à quoi sert setData', true, 8),
('Je comprends pourquoi on met [] à la fin de useEffect', false, 8),
('Je vois la différence : vanilla → manipulation DOM / React → setData', true, 8),
('Je comprends pourquoi key est obligatoire dans .map()', false, 8),
('Je comprends ce qu''est un composant', true, 8),
('Je comprends ce que sont les props et dans quel sens elles vont', true, 8),
('Je comprends pourquoi chaque Card a son propre isOpen', false, 8),
('Je comprends pourquoi search vit dans App et pas dans SearchBar', false, 8),
('Je comprends comment onSearch déclenche le fetch dans App', true, 8);

INSERT INTO skills (description, validated, project_id) VALUES
('Je comprends ce qu''est une base de données relationnelle', false, 9),
('Je sais configurer une base de données PostgreSQL avec Docker', false, 9),
('Je sais expliquer ce qu''est le CRUD', false, 9),
('Je sais expliquer le fonctionnement d''une API RESTful', false, 9),
('Je sais configurer une connexion à une base de données PostgreSQL depuis un backend Express', false, 9),
('Je sais comment intégrer du React avec un backend Express', false, 9),
('Je sais utiliser les useEffect et useState dans React', false, 9),
('Je sais ce qu''est une prop dans React', false, 9),
('Je sais ce qu''est un state dans React', false, 9),
('Je sais ce qu''est un component dans React', false, 9),
('Je sais utiliser des fetch pour récupérer des données API', false, 9),
('Je sais comment fonctionne les fonctions asynchrones', false, 9),
('Je sais manipuler du CRUD directement via mon front en utilisant fetch', false, 9),
('Je sais utiliser une progress bar pour afficher un pourcentage de progression', false, 9);

SELECT * FROM projects;
SELECT * FROM skills;
