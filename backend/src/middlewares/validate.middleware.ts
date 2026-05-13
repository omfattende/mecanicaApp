import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ApiResponse } from '../types';
import logger from '../config/logger';

export const validate = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const errors = result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        logger.warn('Validación fallida', { 
          path: req.path, 
          errors,
          body: req.body 
        });

        const response: ApiResponse = {
          success: false,
          message: 'Error de validación',
          errors,
        };

        res.status(400).json(response);
        return;
      }

      // Reemplazar body con datos validados y tipados
      req.body = result.data;
      next();
    } catch (error) {
      logger.error('Error inesperado en validación', { error });
      const response: ApiResponse = {
        success: false,
        message: 'Error interno en validación',
      };
      res.status(500).json(response);
    }
  };
};

// Validador de parámetros de ruta
export const validateParams = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.params);
      
      if (!result.success) {
        const errors = result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        const response: ApiResponse = {
          success: false,
          message: 'Error en parámetros de URL',
          errors,
        };

        res.status(400).json(response);
        return;
      }

      next();
    } catch (error) {
      logger.error('Error inesperado en validación de params', { error });
      const response: ApiResponse = {
        success: false,
        message: 'Error interno en validación',
      };
      res.status(500).json(response);
    }
  };
};

// Validador de query strings
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        const errors = result.error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        const response: ApiResponse = {
          success: false,
          message: 'Error en parámetros de query',
          errors,
        };

        res.status(400).json(response);
        return;
      }

      next();
    } catch (error) {
      logger.error('Error inesperado en validación de query', { error });
      const response: ApiResponse = {
        success: false,
        message: 'Error interno en validación',
      };
      res.status(500).json(response);
    }
  };
};
