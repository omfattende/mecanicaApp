import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { AuthRequest, ApiResponse, parseParamId } from '../types';

export const UsuarioController = {
  // GET /api/usuarios
  async getAll(_req: Request, res: Response): Promise<void> {
    const usuarios = await UsuarioService.getAll();

    const response: ApiResponse = {
      success: true,
      data: { usuarios },
    };

    res.json(response);
  },

  // GET /api/usuarios/:id
  async getById(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const usuario = await UsuarioService.getById(id);

    const response: ApiResponse = {
      success: true,
      data: { usuario },
    };

    res.json(response);
  },

  // GET /api/usuarios/profile (usuario actual)
  async getProfile(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'No autenticado',
      };
      res.status(401).json(response);
      return;
    }

    const usuario = await UsuarioService.getById(req.user.id);

    const response: ApiResponse = {
      success: true,
      data: { usuario },
    };

    res.json(response);
  },

  // PUT /api/usuarios/:id
  async update(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const usuario = await UsuarioService.update(id, req.body);

    const response: ApiResponse = {
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: { usuario },
    };

    res.json(response);
  },

  // PUT /api/usuarios/profile (actualizar usuario actual)
  async updateProfile(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'No autenticado',
      };
      res.status(401).json(response);
      return;
    }

    const usuario = await UsuarioService.update(req.user.id, req.body);

    const response: ApiResponse = {
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: { usuario },
    };

    res.json(response);
  },

  // PUT /api/usuarios/change-password
  async changePassword(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'No autenticado',
      };
      res.status(401).json(response);
      return;
    }

    const { currentPassword, newPassword } = req.body;

    await UsuarioService.changePassword(req.user.id, currentPassword, newPassword);

    const response: ApiResponse = {
      success: true,
      message: 'Contraseña cambiada exitosamente',
    };

    res.json(response);
  },

  // DELETE /api/usuarios/:id
  async delete(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    await UsuarioService.delete(id);

    const response: ApiResponse = {
      success: true,
      message: 'Usuario eliminado exitosamente',
    };

    res.json(response);
  },

  // GET /api/usuarios/stats
  async getStats(_req: Request, res: Response): Promise<void> {
    const stats = await UsuarioService.getStats();

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.json(response);
  },
};
