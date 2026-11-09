// Lecture centralisée des variables d'environnement.
// Aucune autre partie du code ne doit lire process.env directement.

export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
} as const;
