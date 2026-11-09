// Définition du schéma GraphQL (le "contrat" entre l'API et le front).

export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    email: String!
    name: String!
    picture: String
  }

  type Recipe {
    id: ID!
    title: String!
    description: String!
    author: User
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input AddRecipeInput {
    title: String!
    description: String!
  }

  type Query {
    recipes: [Recipe!]!
    "Utilisateur connecté, ou null"
    me: User
  }

  type Mutation {
    "Connexion avec le jeton d'identité renvoyé par Google Sign-In"
    loginWithGoogle(credential: String!): AuthPayload!
    "Nécessite d'être connecté"
    addRecipe(input: AddRecipeInput!): Recipe!
  }
`;
