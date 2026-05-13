import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload, ApiResponse } from '../types';
import logger from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Obtener token de la cookie HttpOnly o del header Authorization
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      logger.warn('Intento de acceso sin token', { 
        path: req.path, 
        ip: req.ip 
      });

      const response: ApiResponse = {
        success: false,
        message: 'Acceso no autorizado. Token no proporcionado.',
      };
      res.status(401).json(response);
      return;
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Agregar usuario al request
    req.user = decoded;
    
    logger.debug('Token verificado correctamente', { 
      userId: decoded.id, 
      path: req.path 
    });

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Token expirado', { path: req.path, ip: req.ip });
      
      const response: ApiResponse = {
        success: false,
        message: 'Token expirado. Por favor inicie sesión nuevamente.',
      };
      res.status(401).json(response);
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Token inválido', { path: req.path, ip: req.ip, error: error.message });
      
      const response: ApiResponse = {
        success: false,
        message: 'Token inválido.',
      };
      res.status(401).json(response);
      return;
    }

    logger.error('Error inesperado en autenticación', { error });
    
    const response: ApiResponse = {
      success: false,
      message: 'Error en autenticación.',
    };
    res.status(500).json(response);
  }
};

// Middleware para verificar roles
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'Usuario no autenticado.',
      };
      res.status(401).json(response);
      return;
    }

    if (!allowedRoles.includes(req.user.tipo)) {
      logger.warn('Acceso denegado por rol insuficiente', {
        userId: req.user.id,
        userRole: req.user.tipo,
        requiredRoles: allowedRoles,
        path: req.path,
      });

      const response: ApiResponse = {
        success: false,
        message: 'No tiene permisos para realizar esta acción.',
      };
      res.status(403).json(response);
      return;
    }

    next();
  };
};

// Middleware opcional (no requiere auth pero la usa si existe)
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    let token = req.cookies?.token;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.user = decoded;
    }
    
    next();
  } catch {
    // Si falla, continuar sin usuario
    next();
  }
};
