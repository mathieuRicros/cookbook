// Couche d'accès aux données.
// Pour l'instant : stockage en mémoire. Sera remplacée par PostgreSQL (Prisma)
// à l'étape Docker, sans changer les résolveurs.

export interface Recipe {
  id: string;
  title: string;
  description: string;
}

const recipes: Recipe[] = [
  { id: '1', title: 'Crêpes', description: 'Farine, œufs, lait, une pincée de sel.' },
  { id: '2', title: 'Ratatouille', description: 'Légumes du soleil mijotés à feu doux.' },
];

export function listRecipes(): Recipe[] {
  return recipes;
}

export function addRecipe(input: Omit<Recipe, 'id'>): Recipe {
  const recipe: Recipe = { id: String(recipes.length + 1), ...input };
  recipes.push(recipe);
  return recipe;
}
