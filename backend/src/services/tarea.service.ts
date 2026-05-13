import { TareaRepository } from '../repositories/tarea.repository';
import { CitaRepository } from '../repositories/cita.repository';
import { Tarea, CreateTareaInput, UpdateTareaInput } from '../types';
import { ApiError } from '../middlewares/error.middleware';
import logger from '../config/logger';

export const TareaService = {
  // Obtener todas las tareas
  async getAll(): Promise<Tarea[]> {
    return TareaRepository.findAll();
  },

  // Obtener tarea por ID
  async getById(id: number): Promise<Tarea> {
    const tarea = await TareaRepository.findById(id);
    
    if (!tarea) {
      throw new ApiError(404, 'Tarea no encontrada');
    }

    return tarea;
  },

  // Obtener tareas por cita
  async getByCita(citaId: number): Promise<Tarea[]> {
    // Verificar que la cita existe
    const cita = await CitaRepository.findById(citaId);
    
    if (!cita) {
      throw new ApiError(404, 'Cita no encontrada');
    }

    return TareaRepository.findByCita(citaId);
  },

  // Crear tarea
  async create(data: CreateTareaInput): Promise<Tarea> {
    // Verificar que la cita existe
    const cita = await CitaRepository.findById(data.cita_id);
    
    if (!cita) {
      throw new ApiError(404, 'Cita no encontrada');
    }

    const tarea = await TareaRepository.create(data);

    logger.info('Tarea creada', { 
      tareaId: tarea.id, 
      citaId: data.cita_id 
    });

    return tarea;
  },

  // Crear múltiples tareas
  async createMany(citaId: number, descripciones: string[]): Promise<Tarea[]> {
    if (!descripciones.length) {
      throw new ApiError(400, 'Debe proporcionar al menos una tarea');
    }

    // Verificar que la cita existe
    const cita = await CitaRepository.findById(citaId);
    
    if (!cita) {
      throw new ApiError(404, 'Cita no encontrada');
    }

    const tareas = await TareaRepository.createMany(citaId, descripciones);

    logger.info('Múltiples tareas creadas', { 
      citaId, 
      cantidad: descripciones.length 
    });

    return tareas;
  },

  // Actualizar tarea
  async update(id: number, data: UpdateTareaInput): Promise<Tarea> {
    const tarea = await TareaRepository.update(id, data);
    
    if (!tarea) {
      throw new ApiError(404, 'Tarea no encontrada');
    }

    logger.info('Tarea actualizada', { tareaId: id });

    return tarea;
  },

  // Toggle completada
  async toggleCompletada(id: number): Promise<Tarea> {
    const tarea = await TareaRepository.toggleCompletada(id);
    
    if (!tarea) {
      throw new ApiError(404, 'Tarea no encontrada');
    }

    logger.info('Tarea toggle completada', { 
      tareaId: id, 
      completada: tarea.completada 
    });

    return tarea;
  },

  // Eliminar tarea
  async delete(id: number): Promise<void> {
    const tarea = await TareaRepository.findById(id);
    
    if (!tarea) {
      throw new ApiError(404, 'Tarea no encontrada');
    }

    const deleted = await TareaRepository.delete(id);
    
    if (!deleted) {
      throw new ApiError(500, 'Error al eliminar tarea');
    }

    logger.info('Tarea eliminada', { tareaId: id });
  },

  // Eliminar todas las tareas de una cita
  async deleteByCita(citaId: number): Promise<number> {
    // Verificar que la cita existe
    const cita = await CitaRepository.findById(citaId);
    
    if (!cita) {
      throw new ApiError(404, 'Cita no encontrada');
    }

    const count = await TareaRepository.deleteByCita(citaId);

    logger.info('Tareas eliminadas por cita', { citaId, count });

    return count;
  },

  // Estadísticas
  async getStatsByCita(citaId: number): Promise<{
    total: number;
    completadas: number;
    pendientes: number;
    progreso: number;
  }> {
    return TareaRepository.getStatsByCita(citaId);
  },
};
