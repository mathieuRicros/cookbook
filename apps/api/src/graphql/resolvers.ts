// Résolveurs : la logique qui répond aux requêtes du schéma.

import { addRecipe, listRecipes } from '../data/recipes.js';

export const resolvers = {
  Query: {
    recipes: () => listRecipes(),
  },
  Mutation: {
    addRecipe: (_: unknown, args: { input: { title: string; description: string } }) =>
      addRecipe(args.input),
  },
};
