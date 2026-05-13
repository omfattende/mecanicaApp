import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { connectDB, disconnectDB } from './config/database';
import logger, { morganStream } from './config/logger';
import { requestLogger } from './middlewares/logging.middleware';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

// Importar rutas
import authRoutes from './routes/auth.routes';
import usuarioRoutes from './routes/usuario.routes';
import vehiculoRoutes from './routes/vehiculo.routes';
import citaRoutes from './routes/cita.routes';
import tareaRoutes from './routes/tarea.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

// CORS primero para evitar errores CORS en preflight y rate limiting
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true, // Permitir cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate Limiting (más permisivo en desarrollo)
const isDev = process.env.NODE_ENV !== 'production';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isDev ? 1000 : 100, // límite por IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Demasiadas solicitudes, por favor intente más tarde.',
  },
  skip: (req) => req.method === 'OPTIONS', // No contar preflight
});
app.use(limiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie Parsing
app.use(cookieParser());

// Request Logging
app.use(requestLogger);

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'tallerpro-api',
    version: '2.0.0',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/citas', citaRoutes);
app.use('/api/tareas', tareaRoutes);

// Root endpoint
app.get('/', (_req, res) => {
  res.json({
    message: 'API TallerPro v2.0.0',
    status: 'running',
    documentation: '/health',
  });
});

// 404 Handler
app.use(notFoundHandler);

// Error Handler (debe ir al final)
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async (signal: string) => {
  logger.info(`Señal ${signal} recibida. Cerrando servidor gracefully...`);
  
  await disconnectDB();
  
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server (solo en entorno no-serverless)
const startServer = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();

    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      logger.info(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔒 CORS habilitado para: ${CORS_ORIGIN}`);
    });
  } catch (error) {
    logger.error('Error al iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
