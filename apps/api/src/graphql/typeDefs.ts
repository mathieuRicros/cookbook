// Définition du schéma GraphQL (le "contrat" entre l'API et le front).

export const typeDefs = /* GraphQL */ `
  type Recipe {
    id: ID!
    title: String!
    description: String!
  }

  input AddRecipeInput {
    title: String!
    description: String!
  }

  type Query {
    recipes: [Recipe!]!
  }

  type Mutation {
    addRecipe(input: AddRecipeInput!): Recipe!
  }
`;
