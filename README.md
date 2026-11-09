# Cookbook

Monorepo : API Node.js + GraphQL et front React.

## Structure

```
cookbook/
├── apps/
│   ├── api/                  API Node.js / GraphQL (graphql-yoga)
│   │   └── src/
│   │       ├── config/       variables d'environnement
│   │       ├── data/         accès aux données (en mémoire pour l'instant)
│   │       ├── graphql/      schéma, types et résolveurs
│   │       └── index.ts      point d'entrée
│   └── web/                  Front React (Vite + TypeScript)
│       └── src/
│           ├── api/          appels GraphQL
│           ├── components/   composants React
│           ├── styles/       CSS
│           ├── App.tsx
│           └── main.tsx
├── package.json              workspaces npm + scripts racine
├── .nvmrc                    version de Node (20)
└── README.md
```

## Démarrage

Prérequis : Node 20 (`nvm use`).

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
npm run dev
```

- Front : http://localhost:5173
- API GraphQL : http://localhost:4000/graphql

## Scripts

| Commande | Effet |
|---|---|
| `npm run dev` | lance l'API et le front |
| `npm run dev:api` / `dev:web` | lance l'un des deux |
| `npm run build` | compile l'API et le front |
| `npm run typecheck` | vérifie les types |

## Prochaines étapes

1. Docker + PostgreSQL en local (Prisma)
2. Hébergement gratuit (front, API, base)
