# Cookbook

Monorepo : API Node.js + GraphQL et front React.

## Structure

```
cookbook/
├── apps/
│   ├── api/                  API Node.js / GraphQL (graphql-yoga)
│   │   └── src/
│   │       ├── config/       variables d'environnement
│   │       ├── data/         accès aux données (Prisma / PostgreSQL)
│   │       ├── graphql/      schéma, types et résolveurs
│   │       └── index.ts      point d'entrée
│   │   ├── prisma/           schéma de la base et migrations
│   │   └── Dockerfile
│   └── web/                  Front React (Vite + TypeScript)
│       └── src/
│           ├── api/          appels GraphQL
│           ├── components/   composants React
│           ├── styles/       CSS
│           ├── App.tsx
│           └── main.tsx
│       ├── Dockerfile  nginx.conf
├── docker-compose.yml        base PostgreSQL + (profil "app") API et front
├── package.json              workspaces npm + scripts racine
├── .nvmrc                    version de Node (20)
└── README.md
```

## Démarrage en local (dev)

Prérequis : Node 20 (`nvm use`) et Docker Desktop lancé.

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
npm run db:up          # PostgreSQL dans Docker
npm run db:migrate     # crée les tables
npm run dev            # API + front
```

- Front : http://localhost:5173
- API GraphQL : http://localhost:4000/graphql
- Base : `postgresql://cookbook:cookbook@localhost:5432/cookbook`

## Stack complète en conteneurs

```bash
npm run docker:up      # base + API + front
npm run docker:down
```

Front sur http://localhost:8080, API sur http://localhost:4000/graphql.
Les ports se changent avec `DB_PORT`, `API_PORT`, `WEB_PORT`.
Les migrations sont appliquées automatiquement au démarrage de l'API.

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | lance l'API et le front |
| `npm run build` | compile l'API et le front |
| `npm run typecheck` | vérifie les types |
| `npm run db:up` / `db:down` | démarre / arrête la base Docker |
| `npm run db:migrate` | crée / applique une migration (dev) |
| `npm run docker:up` / `docker:down` | stack complète en conteneurs |

## Prochaine étape

Hébergement gratuit (front, API, base).

## Connexion avec Google (SSO)

**Le site demande d'être connecté** : chaque utilisateur voit et ajoute uniquement ses propres recettes.
La connexion utilise Google Sign-In : le navigateur obtient un jeton d'identité de Google,
l'API le vérifie, crée l'utilisateur à la première connexion et renvoie un jeton de session
(JWT, 7 jours). La déconnexion supprime ce jeton côté navigateur.

### Créer l'identifiant Google (une fois)

1. [Console Google Cloud](https://console.cloud.google.com) → créer un projet.
2. **API et services → Écran de consentement OAuth** : type « Externe », nom de l'app, votre e-mail.
3. **Identifiants → Créer des identifiants → ID client OAuth** : type « Application Web ».
4. **Origines JavaScript autorisées** : `http://localhost:5173` et l'URL du site en ligne
   (par ex. `https://cookbook-web-xxxx.onrender.com`, sans `/` final).
5. Copier l'**ID client** (`xxxx.apps.googleusercontent.com`). Il n'y a pas de secret à gérer.

### Configurer

| Où | Variable | Valeur |
|---|---|---|
| `apps/api/.env` | `GOOGLE_CLIENT_ID` | l'ID client |
| `apps/web/.env` | `VITE_GOOGLE_CLIENT_ID` | le même ID client |
| `apps/api/.env` | `JWT_SECRET` | une valeur aléatoire (`openssl rand -base64 32`) |

## Déploiement (offres gratuites)

| Brique | Service | Dossier |
|---|---|---|
| Base PostgreSQL | [Neon](https://neon.com) | – |
| API | [Render](https://render.com) Web Service (Docker) | `apps/api` + `render.yaml` |
| Front | [Render](https://render.com) Static Site | `apps/web` |

Limites à connaître : l'API Render gratuite s'endort après 15 min sans trafic
(le premier appel suivant prend environ une minute) ; Neon met aussi la base en
veille après 5 min.

### 1. Base de données (Neon)

Créer un projet Neon et récupérer l'URL de connexion **directe** (non « pooled »).
Les tables sont créées automatiquement par l'API au démarrage (`prisma migrate deploy`).

### 2. API (Render, Web Service)

- Language **Docker**, branche `main`, Dockerfile `./apps/api/Dockerfile`, Health Check `/health`.
- Variables d'environnement :

| Clé | Valeur |
|---|---|
| `DATABASE_URL` | URL Neon directe |
| `CORS_ORIGIN` | URL du site statique, sans `/` final |
| `GOOGLE_CLIENT_ID` | ID client Google |
| `JWT_SECRET` | valeur aléatoire longue (obligatoire en production) |

### 3. Front (Render, Static Site)

- Branche `main`, Root Directory `apps/web`.
- Build Command : `cd ../.. && npm ci && npm run build -w @cookbook/web`
- Publish Directory : `dist`
- Variables d'environnement :

| Clé | Valeur |
|---|---|
| `VITE_API_URL` | `https://<url-api>/graphql` |
| `VITE_GOOGLE_CLIENT_ID` | ID client Google |

Les variables `VITE_*` sont intégrées au moment du build : après les avoir modifiées,
relancer un déploiement du site.

### Redéploiement

Chaque `git push` sur `main` redéploie automatiquement l'API et le site.
