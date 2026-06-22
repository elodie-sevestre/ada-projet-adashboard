# adashboard

Dashboard de suivi de compétences et de projets réalisé dans le cadre de la formation Ada Tech School.

Permet de visualiser sa progression par catégorie de compétences, d'associer des compétences à des projets, et de gérer sa liste de projets sous forme de kanban.

---

## Stack technique

**Client** — React 19 / Vite / CSS vanilla / @dnd-kit (drag & drop)
**Server** — Node.js / Express 5
**Base de données** — PostgreSQL 17 (via Docker)
**ORM** — pg (driver natif PostgreSQL)

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- [Docker](https://www.docker.com/) et Docker Compose
- [pnpm](https://pnpm.io/) (client)

---

## Installation

### 1. Cloner le repo

```bash
git clone https://github.com/elodie-sevestre/ada-projet-adashboard.git
cd ada-projet-adashboard
```

### 2. Configurer les variables d'environnement

Créer un fichier `.env` à la racine en s'appuyant sur `.env.example` :

```bash
cp .env.example .env
```

Renseigner les valeurs :

```
POSTGRES_USER=ton_user
POSTGRES_PASSWORD=ton_mot_de_passe
POSTGRES_DB=adashboard
POSTGRES_PORT=5432
POSTGRES_HOST=localhost
PORT=3000
```

### 3. Lancer la base de données

```bash
docker compose up -d
```

### 4. Créer les tables et insérer les données

Via Docker (recommandé sur Windows) :

```bash
docker exec -i <nom_du_conteneur> psql -U ton_user -d adashboard -f /dev/stdin < db/migration_up.sql
docker exec -i <nom_du_conteneur> psql -U ton_user -d adashboard -f /dev/stdin < db/seed.sql
```

Ou directement si `psql` est installé :

```bash
psql -h localhost -U ton_user -d adashboard -f db/migration_up.sql
psql -h localhost -U ton_user -d adashboard -f db/seed.sql
```

### 5. Lancer le server

```bash
cd server
npm install
npm start
```

Le serveur écoute sur `http://localhost:3000`.

### 6. Lancer le client

```bash
cd client
pnpm install
pnpm dev
```

L'application est accessible sur `http://localhost:5173`.

---

## Structure du projet

```
ada-projet-adashboard/
├── server/
│   └── src/
│       ├── server.js               # Point d'entrée Express
│       ├── router.js               # Routeur principal
│       ├── db.js                   # Connexion PostgreSQL (pool)
│       ├── middlewares/
│       │   └── errorHandler.js     # Gestion centralisée des erreurs (404, 500, erreurs pg)
│       └── routes/
│           ├── categoriesRouter.js # Routes /categories
│           ├── skillsRouter.js     # Routes /skills
│           └── projectsRouter.js   # Routes /projects
├── db/
│   ├── migration_up.sql            # Création des tables
│   ├── migration_down.sql          # Suppression des tables
│   └── seed.sql                    # Données initiales
├── client/
│   └── src/
│       ├── App.jsx                 # Composant racine + navigation
│       ├── main.jsx                # Point d'entrée React
│       ├── api.js                  # URL de base de l'API (configurable via VITE_API_URL)
│       ├── index.css               # Styles globaux
│       └── components/
│           ├── Header.jsx          # Navigation entre les vues
│           ├── AddSkillForm.jsx    # Formulaire global d'ajout de compétence
│           ├── Categories.jsx      # Vue compétences
│           ├── CategoryCard.jsx    # Carte catégorie + barre de progression + édition
│           ├── SkillPopup.jsx      # Popup liste des skills
│           ├── SkillItem.jsx       # Ligne skill + édition inline + association projets
│           ├── Projects.jsx        # Vue kanban (drag & drop par statut)
│           └── ProjectCard.jsx     # Carte projet repliable (lecture + édition)
└── docker-compose.yml
```

---

## Fonctionnalités

### Vue Compétences

- Progression globale et par catégorie (barres de progression)
- Ajout d'une compétence depuis la vue globale (catégorie existante ou nouvelle créée à la volée)
- Ajout d'une compétence depuis une carte catégorie
- Modification inline du nom de catégorie et de la description de compétence
- Suppression de catégorie (avec confirmation, cascade sur les skills)
- Association / dissociation de projets sur chaque compétence
- Validation / invalidation d'une compétence via checkbox

### Vue Projets

- Kanban trois colonnes : **À faire** / **En cours** / **Terminé**
- Déplacement des cartes par drag & drop (mise à jour du statut en base)
- Carte repliable : titre, description et statut toujours visibles ; dates et actions accessibles via `▾`
- Création, modification et suppression de projets

---

## Modèle de données

```
categories          skills                  projects
──────────          ──────────              ──────────
id                  id                      id
name                description             name
created_at          validated               description
                    category_id ──────────> id  status (TODO / IN_PROGRESS / DONE)
                    created_at              started_at
                                            finished_at
                                            created_at
                                            updated_at

                    projects_skills
                    ──────────────
                    project_id ──────────> projects.id
                    skill_id   ──────────> skills.id
```

---

## API

| Méthode | Route                           | Description                                  |
| ------- | ------------------------------- | -------------------------------------------- |
| GET     | `/categories`                   | Toutes les catégories avec progression       |
| GET     | `/categories/:id/skills`        | Skills d'une catégorie avec projets associés |
| POST    | `/categories`                   | Créer une catégorie                          |
| PATCH   | `/categories/:id`               | Modifier le nom d'une catégorie              |
| DELETE  | `/categories/:id`               | Supprimer une catégorie                      |
| GET     | `/skills`                       | Toutes les skills                            |
| POST    | `/skills`                       | Créer une skill                              |
| PUT     | `/skills/:id`                   | Modifier la description d'une skill          |
| PATCH   | `/skills/:id`                   | Basculer le statut validé                    |
| DELETE  | `/skills/:id`                   | Supprimer une skill                          |
| GET     | `/projects`                     | Tous les projets (dates en ISO YYYY-MM-DD)   |
| POST    | `/projects`                     | Créer un projet                              |
| PUT     | `/projects/:id`                 | Modifier un projet                           |
| DELETE  | `/projects/:id`                 | Supprimer un projet                          |
| GET     | `/projects/:id/skills`          | Skills pratiquées dans un projet             |
| POST    | `/projects/:id/skills`          | Associer une skill à un projet               |
| DELETE  | `/projects/:id/skills/:skillId` | Dissocier une skill d'un projet              |

---

## Gestion des erreurs

L'API renvoie des erreurs au format JSON `{ "error": "message" }` :

| Code | Cas                                                                        |
| ---- | -------------------------------------------------------------------------- |
| 400  | Champ requis manquant, format de paramètre invalide, référence inexistante |
| 404  | Ressource ou route introuvable                                             |
| 409  | Doublon (ex : skill déjà associée au projet)                               |
| 500  | Erreur interne (détails loggés côté serveur uniquement)                    |

Les promesses rejetées des handlers async sont transmises automatiquement
par Express 5 au middleware `errorHandler`, qui traduit les codes d'erreur
PostgreSQL courants en réponses HTTP explicites.

---

## Réinitialiser la base de données

```bash
# Via Docker (recommandé sur Windows)
docker exec -i <nom_du_conteneur> psql -U ton_user -d adashboard -f /dev/stdin < db/migration_down.sql
docker exec -i <nom_du_conteneur> psql -U ton_user -d adashboard -f /dev/stdin < db/migration_up.sql
docker exec -i <nom_du_conteneur> psql -U ton_user -d adashboard -f /dev/stdin < db/seed.sql
```

Ou via Docker pour tout repartir de zéro :

```bash
docker compose down -v
docker compose up -d
```
