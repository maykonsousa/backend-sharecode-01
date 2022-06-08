import { PrismaClient } from '@prisma/client';

const prismaClient = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty',
});

export { prismaClient };
