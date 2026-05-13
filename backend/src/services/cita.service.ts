import { CitaRepository } from '../repositories/cita.repository';
import { Cita, CreateCitaInput, UpdateCitaInput, EstadoCita } from '../types';
import { ApiError } from '../middlewares/error.middleware';
import logger from '../config/logger';

export const CitaService = {
  // Obtener todas las citas
  async getAll(): Promise<Cita[]> {
    return CitaRepository.findAll();
  },

  // Obtener cita por ID
  async getById(id: number): Promise<Cita> {
    const cita = await CitaRepository.findById(id);
    
    if (!cita) {
      throw new ApiError(404, 'Cita no encontrada');
    }

    return cita;
  },

  // Obtener citas por usuario
  async getByUsuario(usuarioId: number): Promise<Cita[]> {
    return CitaRepository.findByUsuario(usuarioId);
  },

  // Obtener citas por fecha
  async getByFecha(fecha: string): Promise<Cita[]> {
    const date = new Date(fecha);
    if (isNaN(date.getTime())) {
      throw new ApiError(400, 'Fecha inválida');
    }
    return CitaRepository.findByFecha(date);
  },

  // Obtener citas por rango de fechas
  async getByDateRange(start: string, end: string): Promise<Cita[]> {
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      throw new ApiError(400, 'Fechas inválidas');
    }

    return CitaRepository.findByDateRange(startDate, endDate);
  },

  // Crear cita
  async create(data: CreateCitaInput): Promise<Cita> {
    // Validar que la fecha no sea en el pasado
    const fechaCita = new Date(data.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaCita < hoy) {
      throw new ApiError(400, 'No se pueden crear citas en fechas pasadas');
    }

    const cita = await CitaRepository.create(data);

    logger.info('Cita creada', { 
      citaId: cita.id, 
      usuarioId: data.usuario_id,
      fecha: data.fecha,
      hora: data.hora 
    });

    return cita;
  },

  // Actualizar cita
  async update(id: number, data: UpdateCitaInput): Promise<Cita> {
    // Verificar que la cita existe
    const existing = await CitaRepository.findById(id);
    
    if (!existing) {
      throw new ApiError(404, 'Cita no encontrada');
    }

    // Si se está actualizando la fecha, validar que no sea en el pasado
    if (data.fecha) {
      const fechaCita = new Date(data.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      // Solo validar si es diferente a la fecha actual de la cita
      const fechaActual = new Date(existing.fecha);
      if (fechaCita < hoy && fechaCita.getTime() !== fechaActual.getTime()) {
        throw new ApiError(400, 'No se pueden asignar citas a fechas pasadas');
      }
    }

    const cita = await CitaRepository.update(id, data);
    
    if (!cita) {
      throw new ApiError(500, 'Error al actualizar cita');
    }

    logger.info('Cita actualizada', { citaId: id, updates: Object.keys(data) });

    return cita;
  },

  // Actualizar estado
  async updateEstado(id: number, estado: EstadoCita): Promise<Cita> {
    const cita = await CitaRepository.updateEstado(id, estado);
    
    if (!cita) {
      throw new ApiError(404, 'Cita no encontrada');
    }

    logger.info('Estado de cita actualizado', { citaId: id, nuevoEstado: estado });

    return cita;
  },

  // Cancelar cita
  async cancelar(id: number): Promise<Cita> {
    return this.updateEstado(id, EstadoCita.CANCELADA);
  },

  // Completar cita (Listo para entrega)
  async completar(id: number): Promise<Cita> {
    return this.updateEstado(id, EstadoCita.LISTO_PARA_ENTREGA);
  },

  // Iniciar servicio (mover a En revisión)
  async iniciarServicio(id: number): Promise<Cita> {
    const cita = await CitaRepository.findById(id);
    
    if (!cita) {
      throw new ApiError(404, 'Cita no encontrada');
    }

    if (cita.estado !== EstadoCita.PENDIENTE) {
      throw new ApiError(400, 'Solo se pueden iniciar citas pendientes');
    }

    return this.updateEstado(id, EstadoCita.EN_REVISION);
  },

  // Eliminar cita
  async delete(id: number): Promise<void> {
    const cita = await CitaRepository.findById(id);
    
    if (!cita) {
      throw new ApiError(404, 'Cita no encontrada');
    }

    // Solo permitir eliminar citas pendientes o canceladas
    const estadosBloqueados: EstadoCita[] = [
      EstadoCita.EN_REVISION,
      EstadoCita.ESPERANDO_REPUESTOS,
      EstadoCita.EN_REPARACION,
      EstadoCita.LISTO_PARA_ENTREGA,
      EstadoCita.ENTREGADA,
    ];
    if (estadosBloqueados.includes(cita.estado as EstadoCita)) {
      throw new ApiError(400, 'No se pueden eliminar citas que ya están en proceso o finalizadas');
    }

    const deleted = await CitaRepository.delete(id);
    
    if (!deleted) {
      throw new ApiError(500, 'Error al eliminar cita');
    }

    logger.info('Cita eliminada', { citaId: id });
  },

  // Estadísticas
  async getStats(): Promise<{
    total: number;
    porEstado: Record<EstadoCita, number>;
    hoy: number;
    semana: number;
  }> {
    return CitaRepository.getStats();
  },
};
