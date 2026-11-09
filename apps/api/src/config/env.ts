// Lecture centralisée des variables d'environnement.
// Aucune autre partie du code ne doit lire process.env directement.

const isProduction = process.env.NODE_ENV === 'production';

function jwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (secret) return secret;
  if (isProduction) throw new Error('JWT_SECRET est obligatoire en production');
  return 'dev-secret-a-ne-pas-utiliser-en-production';
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  // Identifiant client OAuth créé dans la console Google Cloud
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
  // Clé qui signe les jetons de session de l'API
  jwtSecret: jwtSecret(),
} as const;
