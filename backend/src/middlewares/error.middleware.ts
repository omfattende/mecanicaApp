import { Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AuthRequest, ApiResponse } from '../types';
import logger from '../config/logger';

// Error personalizado de API
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// Manejador de errores de Prisma
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): ApiResponse => {
  switch (error.code) {
    case 'P2002': {
      // Unique constraint violation
      const field = (error.meta?.target as string[])?.[0] || 'campo';
      return {
        success: false,
        message: `Ya existe un registro con ese ${field}.`,
      };
    }
    case 'P2003': {
      // Foreign key constraint
      return {
        success: false,
        message: 'El registro relacionado no existe.',
      };
    }
    case 'P2025': {
      // Record not found
      return {
        success: false,
        message: 'Registro no encontrado.',
      };
    }
    case 'P2014': {
      // Invalid relation
      return {
        success: false,
        message: 'Relación inválida entre registros.',
      };
    }
    default:
      return {
        success: false,
        message: 'Error en la base de datos.',
      };
  }
};

// Middleware de manejo de errores global
export const errorHandler = (
  error: Error,
  req: AuthRequest,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Log del error
  logger.error('Error en request', {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Error operacional (conocido)
  if (error instanceof ApiError) {
    const response: ApiResponse = {
      success: false,
      message: error.message,
    };
    res.status(error.statusCode).json(response);
    return;
  }

  // Error de Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const response = handlePrismaError(error);
    res.status(400).json(response);
    return;
  }

  // Error de validación de Prisma
  if (error instanceof Prisma.PrismaClientValidationError) {
    const response: ApiResponse = {
      success: false,
      message: 'Datos inválidos proporcionados.',
    };
    res.status(400).json(response);
    return;
  }

  // Error de conexión a DB
  if (error instanceof Prisma.PrismaClientInitializationError) {
    const response: ApiResponse = {
      success: false,
      message: 'Error de conexión a la base de datos.',
    };
    res.status(503).json(response);
    return;
  }

  // Error genérico (no mostrar detalles en producción)
  const isDev = process.env.NODE_ENV === 'development';
  const response: ApiResponse = {
    success: false,
    message: 'Error interno del servidor.',
    ...(isDev && { stack: error.stack }),
  };

  res.status(500).json(response);
};

// Manejador de rutas no encontradas
export const notFoundHandler = (
  req: AuthRequest,
  res: Response
): void => {
  logger.warn('Ruta no encontrada', { path: req.path, method: req.method });

  const response: ApiResponse = {
    success: false,
    message: `Ruta ${req.method} ${req.path} no encontrada.`,
  };

  res.status(404).json(response);
};
