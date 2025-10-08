/**
 * Configuración de conexión a la base de datos
 * Prisma Client Singleton
 */

import { PrismaClient } from '@prisma/client';

// Extender el objeto global para TypeScript
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Crear instancia de Prisma Client con configuración
export const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'info', 'warn', 'error'] 
    : ['error'],
  errorFormat: 'pretty',
});

// En desarrollo, almacenar en global para evitar múltiples instancias
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Manejar cierre graceful
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

