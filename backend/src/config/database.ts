import { Prisma, PrismaClient } from '@prisma/client';
import logger from './logger';

// Crear instancia de Prisma
const prisma = new PrismaClient({
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'error' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
  ],
});

// Logging de queries en desarrollo
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e: Prisma.QueryEvent) => {
    logger.debug('Prisma Query', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });
}

// Logging de errores
prisma.$on('error', (e: Prisma.LogEvent) => {
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
