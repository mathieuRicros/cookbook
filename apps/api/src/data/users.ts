// Couche d'accès aux données des utilisateurs.

import type { GoogleProfile } from '../auth/google.js';
import { prisma } from './prisma.js';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string | null;
}

const select = { id: true, email: true, name: true, picture: true } as const;

export function findUser(id: string): Promise<User | null> {
  return prisma.user.findUnique({ where: { id }, select });
}

// Crée l'utilisateur à la première connexion, met à jour son profil ensuite.
export function upsertGoogleUser(profile: GoogleProfile): Promise<User> {
  const { googleId, ...fields } = profile;
  return prisma.user.upsert({
    where: { googleId },
    create: { googleId, ...fields },
    update: fields,
    select,
  });
}
