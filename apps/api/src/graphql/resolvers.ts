// Résolveurs : la logique qui répond aux requêtes du schéma.

import { GraphQLError } from 'graphql';
import { verifyGoogleCredential } from '../auth/google.js';
import { signSessionToken } from '../auth/token.js';
import { addRecipe, listRecipesByAuthor } from '../data/recipes.js';
import { upsertGoogleUser } from '../data/users.js';
import type { GraphQLContext } from './context.js';

function requireUser(ctx: GraphQLContext) {
  if (!ctx.user) {
    throw new GraphQLError('Connexion requise', { extensions: { code: 'UNAUTHENTICATED' } });
  }
  return ctx.user;
}

export const resolvers = {
  Query: {
    recipes: (_: unknown, __: unknown, ctx: GraphQLContext) =>
      listRecipesByAuthor(requireUser(ctx).id),
    me: (_: unknown, __: unknown, ctx: GraphQLContext) => ctx.user,
  },
  Mutation: {
    loginWithGoogle: async (_: unknown, args: { credential: string }) => {
      let profile;
      try {
        profile = await verifyGoogleCredential(args.credential);
      } catch (error) {
        console.error('Échec de la vérification Google :', (error as Error).message);
        throw new GraphQLError('Connexion Google refusée', {
          extensions: { code: 'UNAUTHENTICATED' },
        });
      }
      const user = await upsertGoogleUser(profile);
      return { token: await signSessionToken(user.id), user };
    },
    addRecipe: (
      _: unknown,
      args: { input: { title: string; description: string } },
      ctx: GraphQLContext,
    ) => {
      return addRecipe(args.input, requireUser(ctx).id);
    },
  },
};
