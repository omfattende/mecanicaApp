import { Request, Response } from 'express';
import { AuthService, cookieOptions } from '../services/auth.service';
import { LoginInput, RegisterInput, ApiResponse } from '../types';
import logger from '../config/logger';

export const AuthController = {
  // POST /api/auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as LoginInput;
      const { token, user } = await AuthService.login(data);

      // Setear cookie HttpOnly
      res.cookie('token', token, cookieOptions);

      const response: ApiResponse = {
        success: true,
        message: 'Login exitoso',
        data: { token, user },
      };

      res.json(response);
    } catch (error) {
      throw error; // Dejar que el error handler se encargue
    }
  },

  // POST /api/auth/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body as RegisterInput;
      const user = await AuthService.register(data);

      const response: ApiResponse = {
        success: true,
        message: 'Usuario registrado exitosamente',
        data: { user },
      };

      res.status(201).json(response);
    } catch (error) {
      throw error;
    }
  },

  // POST /api/auth/logout
  async logout(req: Request, res: Response): Promise<void> {
    try {
      // Limpiar cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      const response: ApiResponse = {
        success: true,
        message: 'Logout exitoso',
      };

      res.json(response);
    } catch (error) {
      throw error;
    }
  },

  // GET /api/auth/me
  async me(req: Request, res: Response): Promise<void> {
    try {
      // Leer token de cookie o del header Authorization
      let token = req.cookies?.token;
      if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
          token = authHeader.substring(7);
        }
      }

      if (!token) {
        const response: ApiResponse = {
          success: false,
          message: 'No autenticado',
        };
        res.status(401).json(response);
        return;
      }

      const user = await AuthService.verifyToken(token);

      const response: ApiResponse = {
        success: true,
        data: { user },
      };

      res.json(response);
    } catch (error) {
      // Limpiar cookie si el token es inválido
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      throw error;
    }
  },

  // GET /api/auth/verify (para compatibilidad con frontend actual)
  async verify(req: Request, res: Response): Promise<void> {
    // Alias de /me para compatibilidad
    await AuthController.me(req, res);
  },
};
