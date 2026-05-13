import { Request, Response } from 'express';
import { TareaService } from '../services/tarea.service';
import { ApiResponse, CreateTareaInput, parseParamId } from '../types';

export const TareaController = {
  // GET /api/tareas
  async getAll(_req: Request, res: Response): Promise<void> {
    const tareas = await TareaService.getAll();

    const response: ApiResponse = {
      success: true,
      data: { tareas },
    };

    res.json(response);
  },

  // GET /api/tareas/:id
  async getById(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const tarea = await TareaService.getById(id);

    const response: ApiResponse = {
      success: true,
      data: { tarea },
    };

    res.json(response);
  },

  // GET /api/tareas/cita/:citaId
  async getByCita(req: Request, res: Response): Promise<void> {
    const citaId = parseParamId(req.params.citaId);
    const tareas = await TareaService.getByCita(citaId);

    const response: ApiResponse = {
      success: true,
      data: { tareas },
    };

    res.json(response);
  },

  // POST /api/tareas
  async create(req: Request, res: Response): Promise<void> {
    const data = req.body as CreateTareaInput;
    const tarea = await TareaService.create(data);

    const response: ApiResponse = {
      success: true,
      message: 'Tarea creada exitosamente',
      data: { tarea },
    };

    res.status(201).json(response);
  },

  // POST /api/tareas/batch
  async createMany(req: Request, res: Response): Promise<void> {
    const { citaId, descripciones } = req.body as { 
      citaId: number; 
      descripciones: string[];
    };
    
    const tareas = await TareaService.createMany(citaId, descripciones);

    const response: ApiResponse = {
      success: true,
      message: `${tareas.length} tareas creadas exitosamente`,
      data: { tareas },
    };

    res.status(201).json(response);
  },

  // PUT /api/tareas/:id
  async update(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const tarea = await TareaService.update(id, req.body);

    const response: ApiResponse = {
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: { tarea },
    };

    res.json(response);
  },

  // PATCH /api/tareas/:id/toggle
  async toggleCompletada(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    const tarea = await TareaService.toggleCompletada(id);

    const response: ApiResponse = {
      success: true,
      message: 'Estado de tarea actualizado',
      data: { tarea },
    };

    res.json(response);
  },

  // DELETE /api/tareas/:id
  async delete(req: Request, res: Response): Promise<void> {
    const id = parseParamId(req.params.id);
    await TareaService.delete(id);

    const response: ApiResponse = {
      success: true,
      message: 'Tarea eliminada exitosamente',
    };

    res.json(response);
  },

  // DELETE /api/tareas/cita/:citaId
  async deleteByCita(req: Request, res: Response): Promise<void> {
    const citaId = parseParamId(req.params.citaId);
    const count = await TareaService.deleteByCita(citaId);

    const response: ApiResponse = {
      success: true,
      message: `${count} tareas eliminadas exitosamente`,
    };

    res.json(response);
  },

  // GET /api/tareas/cita/:citaId/stats
  async getStatsByCita(req: Request, res: Response): Promise<void> {
    const citaId = parseParamId(req.params.citaId);
    const stats = await TareaService.getStatsByCita(citaId);

    const response: ApiResponse = {
      success: true,
      data: { stats },
    };

    res.json(response);
  },
};
