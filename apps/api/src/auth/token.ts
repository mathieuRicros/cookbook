// Jetons de session de l'API (JWT signé, valable 7 jours).

import { SignJWT, jwtVerify } from 'jose';
import { env } from '../config/env.js';

const secret = new TextEncoder().encode(env.jwtSecret);

export function signSessionToken(userId: string): Promise<string> {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

// Retourne l'id de l'utilisateur, ou null si le jeton est absent ou invalide.
export async function readSessionToken(header: string | null): Promise<string | null> {
  if (!header?.startsWith('Bearer ')) return null;
  try {
    const { payload } = await jwtVerify(header.slice('Bearer '.length), secret, {
      algorithms: ['HS256'],
    });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}
