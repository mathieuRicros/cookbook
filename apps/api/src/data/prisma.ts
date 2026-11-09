// Client Prisma unique, partagé par toute l'API.

import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
