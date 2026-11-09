// Point d'entrée de l'API : démarre le serveur HTTP GraphQL.

import { createServer } from 'node:http';
import { createYoga } from 'graphql-yoga';
import { env } from './config/env.js';
import { schema } from './graphql/schema.js';

const yoga = createYoga({
  schema,
  graphqlEndpoint: '/graphql',
  cors: { origin: env.corsOrigin },
});

createServer(yoga).listen(env.port, () => {
  console.log(`API GraphQL prête sur http://localhost:${env.port}/graphql`);
});
