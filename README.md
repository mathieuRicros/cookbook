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
│   │   ├── prisma/           schéma de la base, migrations, seed
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
npm run db:seed        # données de départ
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
| `npm run db:seed` | insère les données de départ |
| `npm run docker:up` / `docker:down` | stack complète en conteneurs |

## Prochaine étape

Hébergement gratuit (front, API, base).

## Déploiement (offres gratuites)

| Brique | Service | Dossier |
|---|---|---|
| Base PostgreSQL | [Neon](https://neon.com) | – |
| API | [Render](https://render.com) (Docker) | `apps/api` + `render.yaml` |
| Front | [Vercel](https://vercel.com) | `apps/web` |

Limites à connaître : l'API Render gratuite s'endort après 15 min sans trafic
(le premier appel suivant prend environ une minute) ; Neon met aussi la base en
veille après 5 min ; Vercel Hobby est réservé aux usages non commerciaux.

### 1. Base de données (Neon)

1. Créer un projet Neon, région Europe.
2. Copier l'URL de connexion **directe** (non « pooled »), du type
   `postgresql://user:motdepasse@ep-xxx.neon.tech/neondb?sslmode=require`.
3. Insérer les données de départ une fois, depuis votre machine :

```bash
DATABASE_URL="<url neon>" npm run db:seed
```

Les tables sont créées automatiquement par l'API au démarrage (`prisma migrate deploy`).

### 2. API (Render)

1. Render → New → **Blueprint** → choisir le dépôt GitHub (le fichier `render.yaml` est détecté).
2. Renseigner `DATABASE_URL` (URL Neon). Laisser `CORS_ORIGIN` vide pour l'instant.
3. Une fois déployée, noter l'URL de l'API, par ex. `https://cookbook-api.onrender.com`.

### 3. Front (Vercel)

1. Vercel → Add New Project → choisir le dépôt.
2. **Root Directory** : `apps/web`. Framework : Vite.
3. Variable d'environnement : `VITE_API_URL=https://<url-api-render>/graphql`.
4. Déployer et noter l'URL du site.

### 4. Boucler

Dans Render, renseigner `CORS_ORIGIN` avec l'URL Vercel (sans `/` final) : l'API
redémarre et le site peut l'appeler.

Chaque `git push` sur la branche déployée redéploie automatiquement.
