// Requêtes GraphQL liées aux recettes.

import { graphqlRequest } from './client';

export interface Recipe {
  id: string;
  title: string;
  description: string;
}

export async function fetchRecipes(): Promise<Recipe[]> {
  const data = await graphqlRequest<{ recipes: Recipe[] }>(
    `query { recipes { id title description } }`,
  );
  return data.recipes;
}

export async function addRecipe(input: Omit<Recipe, 'id'>): Promise<Recipe> {
  const data = await graphqlRequest<{ addRecipe: Recipe }>(
    `mutation ($input: AddRecipeInput!) {
       addRecipe(input: $input) { id title description }
     }`,
    { input },
  );
  return data.addRecipe;
}
