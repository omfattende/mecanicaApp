import { Request, Response } from 'express';
import { VehiculoService } from '../services/vehiculo.service';
import { AuthRequest, ApiResponse, CreateVehiculoInput, parseParamId } from '../types';

export const VehiculoController = {
  // GET /api/vehiculos
  async getAll(_req: Request, res: Response): Promise<void> {
    const vehiculos = await VehiculoService.getAll();

    const response: ApiResponse = {
      success: true,
      data: { vehiculos },
    };

    res.json(response);
  },

  // GET /api/vehiculos/:id
  async getById(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const vehiculo = await VehiculoService.getById(id);

    const response: ApiResponse = {
      success: true,
      data: { vehiculo },
    };

    res.json(response);
  },

  // GET /api/vehiculos/usuario/:usuarioId
  async getByUsuario(req: Request, res: Response): Promise<void> {
    const usuarioId = parseParamId(req.params.usuarioId);
    const vehiculos = await VehiculoService.getByUsuario(usuarioId);

    const response: ApiResponse = {
      success: true,
      data: { vehiculos },
    };

    res.json(response);
  },

  // GET /api/vehiculos/mis-vehiculos
  async getMisVehiculos(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'No autenticado',
      };
      res.status(401).json(response);
      return;
    }

    const vehiculos = await VehiculoService.getByUsuario(req.user.id);

    const response: ApiResponse = {
      success: true,
      data: { vehiculos },
    };

    res.json(response);
  },

  // POST /api/vehiculos
  async create(req: Request, res: Response): Promise<void> {
    const data = req.body as CreateVehiculoInput;
    const vehiculo = await VehiculoService.create(data);

    const response: ApiResponse = {
      success: true,
      message: 'Vehículo creado exitosamente',
      data: { vehiculo },
    };

    res.status(201).json(response);
  },

  // PUT /api/vehiculos/:id
  async update(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const vehiculo = await VehiculoService.update(id, req.body);

    const response: ApiResponse = {
      success: true,
      message: 'Vehículo actualizado exitosamente',
      data: { vehiculo },
    };

    res.json(response);
  },

  // DELETE /api/vehiculos/:id
  async delete(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    await VehiculoService.delete(id);

    const response: ApiResponse = {
      success: true,
      message: 'Vehículo eliminado exitosamente',
    };

    res.json(response);
  },

  // GET /api/vehiculos/stats
  async getStats(_req: Request, res: Response): Promise<void> {
    const stats = await VehiculoService.getStats();

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.json(response);
  },
};
