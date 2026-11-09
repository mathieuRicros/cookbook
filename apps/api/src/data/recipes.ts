// Couche d'accès aux données des recettes (PostgreSQL via Prisma).

import { prisma } from './prisma.js';

export interface Recipe {
  id: string;
  title: string;
  description: string;
}

const select = { id: true, title: true, description: true } as const;

export function listRecipes(): Promise<Recipe[]> {
  return prisma.recipe.findMany({ select, orderBy: { createdAt: 'asc' } });
}

export function addRecipe(input: Omit<Recipe, 'id'>): Promise<Recipe> {
  return prisma.recipe.create({ data: input, select });
}
