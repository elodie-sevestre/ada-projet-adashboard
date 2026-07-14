# adashboard

Projet réalisé pendant ma formation à Ada Tech School.

C'est un petit dashboard qui me permet de suivre mes compétences en code et mes projets. Je peux voir où j'en suis par catégorie de compétence, et gérer mes projets sous forme de kanban (à faire / en cours / terminé).

## Technologies utilisées

- **Front** (`frontend/`) : React + Vite, CSS classique, @dnd-kit pour le drag & drop
- **Back** (`backend/`) : Node.js + Express
- **Base de données** : PostgreSQL (avec Docker)

## Installation

Il faut avoir installé avant :
- Node.js
- Docker
- pnpm (pour le frontend)

### 1. Cloner le projet

```bash
git clone https://github.com/elodie-sevestre/ada-projet-adashboard.git
cd ada-projet-adashboard
```

### 2. Créer le fichier .env

Copier le fichier d'exemple :

```bash
cp .env.example .env
```

Et mettre ses propres infos dedans (utilisateur, mot de passe, etc.)

### 3. Démarrer la base de données

```bash
docker compose up -d
```

### 4. Créer les tables et ajouter des données de test

```bash
docker exec -i <nom_du_conteneur> psql -U ton_user -d adashboard -f /dev/stdin < db/migration_up.sql
docker exec -i <nom_du_conteneur> psql -U ton_user -d adashboard -f /dev/stdin < db/seed.sql
```

### 5. Lancer le serveur

```bash
cd backend
npm install
npm start
```

Le serveur tourne sur `http://localhost:3000`

### 6. Lancer le frontend

```bash
cd frontend
pnpm install
pnpm dev
```

Le site est accessible sur `http://localhost:5173`

## Ce que le projet permet de faire

**Côté compétences**
- Voir sa progression globale et par catégorie
- Ajouter une compétence (et créer une catégorie en même temps si besoin)
- Modifier le nom d'une catégorie ou la description d'une compétence directement dans la page
- Supprimer une catégorie
- Lier ou délier une compétence à un projet
- Cocher une compétence comme validée

**Côté projets**
- Vue kanban avec 3 colonnes (à faire / en cours / terminé)
- Déplacer les cartes avec la souris (drag & drop) pour changer leur statut
- Créer, modifier et supprimer un projet

## Organisation du code

```
adashboard/
├── backend/
│   └── src/
│       ├── server.js          → démarre le serveur
│       ├── router.js          → rassemble toutes les routes
│       ├── db.js              → connexion à PostgreSQL
│       ├── middlewares/
│       │   └── errorHandler.js → gère les erreurs (404, erreurs de la BDD, etc.)
│       └── routes/
│           ├── categoriesRouter.js
│           ├── skillsRouter.js
│           └── projectsRouter.js
├── db/
│   ├── migration_up.sql       → crée les tables
│   ├── migration_down.sql     → supprime les tables
│   └── seed.sql                → données de test
└── frontend/
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api.js              → adresse de l'API
        ├── constants.js
        ├── components/
        │   ├── Header.jsx
        │   ├── Categories.jsx
        │   ├── CategoryCard.jsx
        │   ├── SkillPopup.jsx
        │   ├── SkillItem.jsx
        │   ├── AddSkillForm.jsx
        │   ├── Projects.jsx
        │   ├── ProjectCard.jsx
        │   └── Toast.jsx       → messages de confirmation/erreur
        └── hooks/
            └── useToast.js
```

## Les routes de l'API

| Méthode | Route | Ce que ça fait |
|---|---|---|
| GET | /categories | Récupère toutes les catégories |
| GET | /categories/:id/skills | Récupère les compétences d'une catégorie |
| POST | /categories | Crée une catégorie |
| PATCH | /categories/:id | Modifie le nom d'une catégorie |
| DELETE | /categories/:id | Supprime une catégorie |
| GET | /skills | Récupère toutes les compétences |
| POST | /skills | Crée une compétence |
| PUT | /skills/:id | Modifie une compétence |
| PATCH | /skills/:id | Change le statut validé/non validé |
| DELETE | /skills/:id | Supprime une compétence |
| GET | /projects | Récupère tous les projets |
| POST | /projects | Crée un projet |
| PUT | /projects/:id | Modifie un projet |
| DELETE | /projects/:id | Supprime un projet |
| GET | /projects/:id/skills | Récupère les compétences liées à un projet |
| POST | /projects/:id/skills | Lie une compétence à un projet |
| DELETE | /projects/:id/skills/:skillId | Délie une compétence d'un projet |

## Gestion des erreurs

Quand il y a un problème, l'API renvoie une réponse au format `{ "error": "message" }` avec le bon code HTTP (400 si une donnée est manquante ou incorrecte, 404 si la ressource n'existe pas, 409 en cas de doublon, 500 pour une erreur côté serveur).

## Pour repartir de zéro avec la base de données

```bash
docker compose down -v
docker compose up -d
```

## Déploiement (Render + Neon)

- Base de données : créer un projet sur [Neon](https://neon.tech), récupérer la connection string, puis y exécuter `db/migration_up.sql` et `db/seed.sql`.
- Backend + frontend : sur [Render](https://render.com), utiliser "New > Blueprint" et pointer vers ce dépôt (le fichier `render.yaml` à la racine configure les deux services).
- Variables à renseigner manuellement dans le dashboard Render :
  - `adashboard-backend` → `DATABASE_URL` (connection string Neon, avec `?sslmode=require`)
  - `learning-tracking-dashboard` → `VITE_API_URL` (URL publique du service backend Render)

## Pistes d'amélioration

- Ajouter de l'authentification (JWT)
- Écrire des tests
- Passer le projet en TypeScript
