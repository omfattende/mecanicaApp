import { PrismaClient } from '@prisma/client';
import logger from './logger';

// Opciones de Prisma según el entorno
const prismaOptions = {
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ] as const,
};

// Crear instancia de Prisma
const prisma = new PrismaClient(prismaOptions);

// Logging de queries en desarrollo
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: { query: string; params: string; duration: number }) => {
    logger.debug('Prisma Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });
}

// Logging de errores
prisma.$on('error', (e: { message: string }) => {
  logger.error('Prisma Error', { error: e.message });
});

// Conexión y desconexión gracefully
export const connectDB = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info('✅ Conectado a PostgreSQL via Prisma');
  } catch (error) {
    logger.error('❌ Error conectando a la base de datos', { error });
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info('🔌 Desconectado de la base de datos');
};

export default prisma;
