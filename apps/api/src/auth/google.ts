// Vérifie le jeton d'identité (ID token) fourni par Google Sign-In.

import { createRemoteJWKSet, jwtVerify } from 'jose';
import { env } from '../config/env.js';

const googleKeys = createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
  picture: string | null;
}

export async function verifyGoogleCredential(credential: string): Promise<GoogleProfile> {
  if (!env.googleClientId) throw new Error('GOOGLE_CLIENT_ID n’est pas configuré');

  const { payload } = await jwtVerify(credential, googleKeys, {
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: env.googleClientId,
  });

  if (!payload.sub || typeof payload.email !== 'string' || payload.email_verified !== true) {
    throw new Error('Compte Google sans e-mail vérifié');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: typeof payload.name === 'string' ? payload.name : payload.email,
    picture: typeof payload.picture === 'string' ? payload.picture : null,
  };
}
