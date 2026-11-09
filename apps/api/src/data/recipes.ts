// Couche d'accès aux données des recettes (PostgreSQL via Prisma).

import { prisma } from './prisma.js';
import type { User } from './users.js';

export interface Recipe {
  id: string;
  title: string;
  description: string;
  author: User | null;
}

const select = {
  id: true,
  title: true,
  description: true,
  author: { select: { id: true, email: true, name: true, picture: true } },
} as const;

export function listRecipes(): Promise<Recipe[]> {
  return prisma.recipe.findMany({ select, orderBy: { createdAt: 'asc' } });
}

export function addRecipe(
  input: { title: string; description: string },
  authorId: string,
): Promise<Recipe> {
  return prisma.recipe.create({ data: { ...input, authorId }, select });
}
