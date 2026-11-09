// Données de départ : npm run db:seed -w @cookbook/api

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  if ((await prisma.recipe.count()) > 0) return;
  await prisma.recipe.createMany({
    data: [
      { title: 'Crêpes', description: 'Farine, œufs, lait, une pincée de sel.' },
      { title: 'Ratatouille', description: 'Légumes du soleil mijotés à feu doux.' },
    ],
  });
}

main().finally(() => prisma.$disconnect());
