import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Middleware para loggear requests HTTP
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Función que se ejecuta al terminar la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      contentLength: res.get('content-length'),
    };

    // Log según el nivel de severidad
    if (res.statusCode >= 500) {
      logger.error('Request completado con error servidor', logData);
    } else if (res.statusCode >= 400) {
      logger.warn('Request completado con error cliente', logData);
    } else {
      logger.info('Request completado', logData);
    }
  });

  next();
};

// Middleware para loggear errores
export const errorLogger = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  logger.error('Error en request', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
  });

  next(err);
};
