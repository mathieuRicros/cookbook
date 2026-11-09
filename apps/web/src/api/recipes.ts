// Requêtes GraphQL liées aux recettes.

import { graphqlRequest } from './client';

export interface Recipe {
  id: string;
  title: string;
  description: string;
}

const RECIPE_FIELDS = 'id title description';

export async function fetchRecipes(): Promise<Recipe[]> {
  const data = await graphqlRequest<{ recipes: Recipe[] }>(
    `query { recipes { ${RECIPE_FIELDS} } }`,
  );
  return data.recipes;
}

export async function addRecipe(input: { title: string; description: string }): Promise<Recipe> {
  const data = await graphqlRequest<{ addRecipe: Recipe }>(
    `mutation ($input: AddRecipeInput!) {
       addRecipe(input: $input) { ${RECIPE_FIELDS} }
     }`,
    { input },
  );
  return data.addRecipe;
}
