// Requêtes GraphQL liées à l'authentification.

import { graphqlRequest } from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  picture: string | null;
}

const USER_FIELDS = 'id email name picture';

export async function loginWithGoogle(
  credential: string,
): Promise<{ token: string; user: User }> {
  const data = await graphqlRequest<{ loginWithGoogle: { token: string; user: User } }>(
    `mutation ($credential: String!) {
       loginWithGoogle(credential: $credential) { token user { ${USER_FIELDS} } }
     }`,
    { credential },
  );
  return data.loginWithGoogle;
}

export async function fetchMe(): Promise<User | null> {
  const data = await graphqlRequest<{ me: User | null }>(`query { me { ${USER_FIELDS} } }`);
  return data.me;
}
