// Assemble le schéma exécutable à partir des types et des résolveurs.

import { createSchema } from 'graphql-yoga';
import { resolvers } from './resolvers.js';
import { typeDefs } from './typeDefs.js';

export const schema = createSchema({ typeDefs, resolvers });
