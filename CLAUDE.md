# Cookbook — contexte du projet

Ce fichier est lu automatiquement par Claude Code au début de chaque session. Il résume le
contexte, l'architecture et les décisions. Le `README.md` détaille l'installation et le
déploiement pas à pas.

## Résumé

Mini site vitrine (POC) en monorepo : un front React, une API Node.js GraphQL, une base
PostgreSQL. Les utilisateurs se connectent avec Google (SSO) et gèrent **leurs propres
recettes** : chaque utilisateur ne voit que les siennes.

- Dépôt : `git@github.com:mathieuRicros/cookbook.git`, branche principale `main`.
- Auteur : Mathieu Ricros. Langue de travail : français.
- Objectif d'hébergement : offres **gratuites**, pas d'architecture type AWS.

## Stack

| Couche | Technologie |
|---|---|
| Front | React 18, Vite 6, TypeScript, CSS simple (pas de framework UI) |
| API | Node.js 20, TypeScript (ESM), graphql-yoga, `jose` (JWT + vérification Google) |
| Base | PostgreSQL 16, ORM Prisma 6 |
| Monorepo | npm workspaces (`apps/*`), pas de Turborepo |
| Conteneurs | Docker + docker-compose (base locale, stack complète optionnelle) |

Node 20 obligatoire (`.nvmrc`). Le Node par défaut de la machine est v16 : toujours lancer
`nvm use` d'abord.

## Environnements et URLs

| Élément | Local | En ligne |
|---|---|---|
| Front | http://localhost:5173 | https://cookbook-web-ndau.onrender.com (Render Static Site) |
| API GraphQL | http://localhost:4000/graphql | https://cookbook-api-rins.onrender.com/graphql (Render Web Service, Docker) |
| Base | Docker, `localhost:5432`, base/user/mot de passe `cookbook` | Neon, projet `wild-forest-15289711`, région Francfort |

Offres gratuites : l'API Render s'endort après 15 min sans trafic (premier appel ≈ 1 min),
Neon met la base en veille après 5 min.

## Structure des fichiers

```
cookbook/
├── CLAUDE.md                 ce fichier
├── README.md                 installation, scripts, déploiement
├── package.json              workspaces + scripts racine
├── docker-compose.yml        service db ; profil "app" = api + web en conteneurs
├── render.yaml               blueprint Render de l'API (le service a été créé à la main)
├── neon.ts                   config Neon CLI (ajoutée par `neon init`)
├── .nvmrc  .editorconfig  .dockerignore  .gitignore
└── apps/
    ├── api/                  API GraphQL
    │   ├── Dockerfile        build multi-étapes ; au démarrage : prisma migrate deploy
    │   ├── prisma/
    │   │   ├── schema.prisma     modèles User et Recipe
    │   │   └── migrations/       init, add_users_and_recipe_author
    │   └── src/
    │       ├── index.ts          point d'entrée (serveur HTTP + yoga + CORS)
    │       ├── config/env.ts     seul endroit qui lit process.env
    │       ├── auth/google.ts    vérifie l'ID token Google (JWKS Google)
    │       ├── auth/token.ts     signe / lit le JWT de session (HS256, 7 jours)
    │       ├── data/prisma.ts    client Prisma unique
    │       ├── data/users.ts     findUser, upsertGoogleUser
    │       ├── data/recipes.ts   listRecipesByAuthor, addRecipe
    │       └── graphql/
    │           ├── typeDefs.ts   schéma GraphQL
    │           ├── resolvers.ts  résolveurs (requireUser pour les routes protégées)
    │           ├── context.ts    lit l'en-tête Authorization → ctx.user
    │           └── schema.ts     assemble typeDefs + resolvers
    └── web/                  Front React
        ├── Dockerfile  nginx.conf
        ├── index.html  vite.config.ts
        └── src/
            ├── main.tsx          monte <AuthProvider><App/>
            ├── App.tsx           écran déconnecté / liste + formulaire si connecté
            ├── api/client.ts     fetch GraphQL, ajoute `Authorization: Bearer`
            ├── api/auth.ts       loginWithGoogle, fetchMe
            ├── api/recipes.ts    fetchRecipes, addRecipe
            ├── auth/AuthContext.tsx   état user, login, logout
            ├── auth/tokenStorage.ts   jeton dans localStorage (try/catch)
            ├── auth/google.d.ts       types de Google Identity Services
            ├── components/       Header, GoogleSignInButton, RecipeList, AddRecipeForm
            └── styles/index.css
```

## Modèle de données

- `User` : `id`, `googleId` (unique), `email` (unique), `name`, `picture`, `createdAt`.
- `Recipe` : `id`, `title`, `description`, `createdAt`, `authorId` → `User` (nullable).
- Les recettes sans auteur (Crêpes, Ratatouille, créées avant l'authentification) existent
  encore sur Neon mais ne sont visibles de personne.

## Authentification (comment ça marche)

1. Le front charge Google Identity Services et affiche le bouton Google.
2. Google renvoie un **ID token** au navigateur → mutation `loginWithGoogle(credential)`.
3. L'API vérifie le token (signature, `iss`, `aud` = `GOOGLE_CLIENT_ID`, e-mail vérifié),
   crée ou met à jour l'utilisateur, et renvoie un **JWT de session** signé avec `JWT_SECRET`.
4. Le front stocke le JWT dans `localStorage` et l'envoie en `Authorization: Bearer`.
5. Déconnexion = suppression du JWT côté navigateur (sessions sans état, pas de révocation).

API GraphQL :
- `Query.me` : utilisateur connecté ou `null`.
- `Query.recipes` : recettes de l'utilisateur connecté (erreur `UNAUTHENTICATED` sinon).
- `Mutation.addRecipe(input)` : crée une recette pour l'utilisateur connecté.
- `Mutation.loginWithGoogle(credential)` : renvoie `{ token, user }`.

Google Cloud : projet `cookbook-514216`, client OAuth « Application Web », ID client
`491955290295-0og9mg96883v7u376674ielt5078k345.apps.googleusercontent.com` (public).
Origines autorisées : `http://localhost:5173` et `https://cookbook-web-ndau.onrender.com`
(sans `/` final). L'écran de consentement est en mode « Test » : seuls les utilisateurs
test déclarés dans Google Auth Platform → Audience peuvent se connecter.

## Variables d'environnement

Jamais de secret dans git : les `.env*` sont ignorés (seuls les `.env.example` sont versionnés).

| Variable | Où | Rôle |
|---|---|---|
| `PORT` | API | port d'écoute (Render le fournit) |
| `CORS_ORIGIN` | API | origine du front, **sans `/` final** (une seule valeur) |
| `DATABASE_URL` | API | URL PostgreSQL. Sur Neon : l'URL **directe**, pas « pooled » |
| `GOOGLE_CLIENT_ID` | API | ID client OAuth Google |
| `JWT_SECRET` | API | clé de signature ; obligatoire en production (l'API refuse de démarrer sans) |
| `VITE_API_URL` | Front | URL de l'API GraphQL, intégrée au build |
| `VITE_GOOGLE_CLIENT_ID` | Front | même ID client, intégré au build |

Fichiers locaux : `apps/api/.env`, `apps/web/.env` (copiés depuis les `.env.example`) et
`.env.local` à la racine (écrit par `neon init`, contient les URLs Neon). Les variables `VITE_*`
sont figées au build : après changement, redéployer le site.

## Commandes

```bash
nvm use                 # Node 20
npm install
npm run db:up           # PostgreSQL local (Docker)
npm run db:migrate      # crée/applique une migration en dev (prisma migrate dev)
npm run dev             # API + front
npm run typecheck       # types API + front
npm run build           # build API + front
npm run docker:up       # stack complète en conteneurs (ports : DB_PORT, API_PORT, WEB_PORT)
```

## Déploiement

- Les deux services Render déploient automatiquement la branche `main` à chaque push
  (Auto-Deploy), l'API et le site se reconstruisent ensemble.
- API : Web Service Docker, `Dockerfile Path ./apps/api/Dockerfile`, contexte = racine,
  Health Check `/health`. Au démarrage elle exécute `prisma migrate deploy` : **les
  migrations s'appliquent toutes seules en production**.
- Site : Static Site, Root Directory `apps/web`, Build Command
  `cd ../.. && npm ci && npm run build -w @cookbook/web`, Publish Directory `dist`
  (relatif au Root Directory).
- Workflow conseillé : branche de travail → test en local → fusion dans `main` (= déploiement).

## Pièges déjà rencontrés

- Node 16 par défaut : sans `nvm use`, Vite et Prisma échouent.
- Le `/` final dans `CORS_ORIGIN` fait échouer la correspondance CORS.
- `npx prisma …` dans le monorepo peut échouer (`ENOWORKSPACES`) : utiliser
  `../../node_modules/.bin/prisma` depuis `apps/api`.
- Vercel a été écarté (numéro de téléphone déjà lié à un autre compte) : le front est sur
  Render.
- Les imports de l'API en ESM NodeNext doivent se terminer par `.js`.
- Ne jamais afficher ni commiter les secrets (mot de passe Neon, `JWT_SECRET`, client secret
  Google). Le client secret Google n'est pas utilisé par le projet.

## Idées pour la suite

- Modifier et supprimer une recette ; ingrédients, étapes, photos.
- Rattacher ou supprimer les recettes sans auteur sur Neon.
- Tests automatisés (API : résolveurs et auth ; front : composants) et CI GitHub Actions.
- Déconnexion plus robuste : cookie httpOnly à la place du JWT en `localStorage`.
- Passer l'écran de consentement Google en « Production » pour ouvrir à tout le monde.
- Build Filters Render pour ne reconstruire que le service concerné.
- Domaine personnalisé, supervision pour éviter la mise en veille de l'API.
