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
