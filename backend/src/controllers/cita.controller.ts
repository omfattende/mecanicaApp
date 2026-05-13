import { Request, Response } from 'express';
import { CitaService } from '../services/cita.service';
import { AuthRequest, ApiResponse, CreateCitaInput, EstadoCita, parseParamId } from '../types';

export const CitaController = {
  // GET /api/citas
  async getAll(_req: Request, res: Response): Promise<void> {
    const citas = await CitaService.getAll();

    const response: ApiResponse = {
      success: true,
      data: { citas },
    };

    res.json(response);
  },

  // GET /api/citas/:id
  async getById(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const cita = await CitaService.getById(id);

    const response: ApiResponse = {
      success: true,
      data: { cita },
    };

    res.json(response);
  },

  // GET /api/citas/cliente/:usuarioId
  async getByUsuario(req: Request, res: Response): Promise<void> {
    const usuarioId = parseParamId(req.params.usuarioId);
    const citas = await CitaService.getByUsuario(usuarioId);

    const response: ApiResponse = {
      success: true,
      data: { citas },
    };

    res.json(response);
  },

  // GET /api/citas/mis-citas
  async getMisCitas(req: AuthRequest, res: Response): Promise<void> {
    if (!req.user) {
      const response: ApiResponse = {
        success: false,
        message: 'No autenticado',
      };
      res.status(401).json(response);
      return;
    }

    const citas = await CitaService.getByUsuario(req.user.id);

    const response: ApiResponse = {
      success: true,
      data: { citas },
    };

    res.json(response);
  },

  // GET /api/citas/fecha/:fecha
  async getByFecha(req: Request, res: Response): Promise<void> {
    const { fecha } = req.params;
    const citas = await CitaService.getByFecha(fecha);

    const response: ApiResponse = {
      success: true,
      data: { citas },
    };

    res.json(response);
  },

  // GET /api/citas/rango
  async getByDateRange(req: Request, res: Response): Promise<void> {
    const { start, end } = req.query;
    
    if (!start || !end) {
      const response: ApiResponse = {
        success: false,
        message: 'Se requieren los parámetros start y end',
      };
      res.status(400).json(response);
      return;
    }

    const citas = await CitaService.getByDateRange(start as string, end as string);

    const response: ApiResponse = {
      success: true,
      data: { citas },
    };

    res.json(response);
  },

  // POST /api/citas
  async create(req: Request, res: Response): Promise<void> {
    const data = req.body as CreateCitaInput;
    const cita = await CitaService.create(data);

    const response: ApiResponse = {
      success: true,
      message: 'Cita creada exitosamente',
      data: { cita },
    };

    res.status(201).json(response);
  },

  // PUT /api/citas/:id
  async update(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const cita = await CitaService.update(id, req.body);

    const response: ApiResponse = {
      success: true,
      message: 'Cita actualizada exitosamente',
      data: { cita },
    };

    res.json(response);
  },

  // PUT /api/citas/:id/estado
  async updateEstado(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const { estado } = req.body as { estado: EstadoCita };
    
    const cita = await CitaService.updateEstado(id, estado);

    const response: ApiResponse = {
      success: true,
      message: 'Estado actualizado exitosamente',
      data: { cita },
    };

    res.json(response);
  },

  // POST /api/citas/:id/cancelar
  async cancelar(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const cita = await CitaService.cancelar(id);

    const response: ApiResponse = {
      success: true,
      message: 'Cita cancelada exitosamente',
      data: { cita },
    };

    res.json(response);
  },

  // POST /api/citas/:id/completar
  async completar(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const cita = await CitaService.completar(id);

    const response: ApiResponse = {
      success: true,
      message: 'Cita completada exitosamente',
      data: { cita },
    };

    res.json(response);
  },

  // POST /api/citas/:id/iniciar
  async iniciarServicio(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const cita = await CitaService.iniciarServicio(id);

    const response: ApiResponse = {
      success: true,
      message: 'Servicio iniciado exitosamente',
      data: { cita },
    };

    res.json(response);
  },

  // DELETE /api/citas/:id
  async delete(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    await CitaService.delete(id);

    const response: ApiResponse = {
      success: true,
      message: 'Cita eliminada exitosamente',
    };

    res.json(response);
  },

  // GET /api/citas/stats
  async getStats(_req: Request, res: Response): Promise<void> {
    const stats = await CitaService.getStats();

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.json(response);
  },
};
