// Client GraphQL minimal basé sur fetch (aucune dépendance supplémentaire).

import { getToken } from '../auth/tokenStorage';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/graphql';

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const token = getToken();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const { data, errors } = (await response.json()) as {
    data?: T;
    errors?: { message: string }[];
  };

  if (errors?.length || !data) {
    throw new Error(errors?.[0]?.message ?? 'Réponse invalide de l’API');
  }
  return data;
}
