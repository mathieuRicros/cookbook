// Contexte fourni à chaque requête GraphQL : l'utilisateur connecté, s'il y en a un.

import { readSessionToken } from '../auth/token.js';
import { findUser, type User } from '../data/users.js';

export interface GraphQLContext {
  user: User | null;
}

export async function buildContext({ request }: { request: Request }): Promise<GraphQLContext> {
  const userId = await readSessionToken(request.headers.get('authorization'));
  return { user: userId ? await findUser(userId) : null };
}
