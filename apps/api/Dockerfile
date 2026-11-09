# Image de l'API. Contexte de build : la racine du monorepo.

FROM node:20-slim AS build
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci
COPY apps/api apps/api
RUN npm run build -w @cookbook/api

FROM node:20-slim
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/node_modules node_modules
COPY --from=build /app/apps/api apps/api
WORKDIR /app/apps/api
EXPOSE 4000
# Applique les migrations puis démarre l'API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
