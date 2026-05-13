import { VehiculoRepository } from '../repositories/vehiculo.repository';
import { Vehiculo, CreateVehiculoInput, UpdateVehiculoInput } from '../types';
import { ApiError } from '../middlewares/error.middleware';
import logger from '../config/logger';

export const VehiculoService = {
  // Obtener todos los vehículos
  async getAll(): Promise<Vehiculo[]> {
    return VehiculoRepository.findAll();
  },

  // Obtener vehículo por ID
  async getById(id: number): Promise<Vehiculo> {
    const vehiculo = await VehiculoRepository.findById(id);
    
    if (!vehiculo) {
      throw new ApiError(404, 'Vehículo no encontrado');
    }

    return vehiculo;
  },

  // Obtener vehículos por usuario
  async getByUsuario(usuarioId: number): Promise<Vehiculo[]> {
    return VehiculoRepository.findByUsuario(usuarioId);
  },

  // Crear vehículo
  async create(data: CreateVehiculoInput): Promise<Vehiculo> {
    // Verificar que no exista la placa
    const exists = await VehiculoRepository.existsPlaca(data.placa);
    
    if (exists) {
      throw new ApiError(400, 'Ya existe un vehículo con esa placa');
    }

    const vehiculo = await VehiculoRepository.create(data);

    logger.info('Vehículo creado', { 
      vehiculoId: vehiculo.id, 
      placa: vehiculo.placa,
      usuarioId: data.usuario_id 
    });

    return vehiculo;
  },

  // Actualizar vehículo
  async update(id: number, data: UpdateVehiculoInput): Promise<Vehiculo> {
    // Verificar que el vehículo existe
    const existing = await VehiculoRepository.findById(id);
    
    if (!existing) {
      throw new ApiError(404, 'Vehículo no encontrado');
    }

    // Si se está actualizando la placa, verificar que no exista
    if (data.placa) {
      const exists = await VehiculoRepository.existsPlaca(data.placa, id);
      if (exists) {
        throw new ApiError(400, 'Ya existe otro vehículo con esa placa');
      }
    }

    const vehiculo = await VehiculoRepository.update(id, data);
    
    if (!vehiculo) {
      throw new ApiError(500, 'Error al actualizar vehículo');
    }

    logger.info('Vehículo actualizado', { vehiculoId: id });

    return vehiculo;
  },

  // Eliminar vehículo
  async delete(id: number): Promise<void> {
    const vehiculo = await VehiculoRepository.findById(id);
    
    if (!vehiculo) {
      throw new ApiError(404, 'Vehículo no encontrado');
    }

    const deleted = await VehiculoRepository.delete(id);
    
    if (!deleted) {
      throw new ApiError(500, 'Error al eliminar vehículo');
    }

    logger.info('Vehículo eliminado', { vehiculoId: id, placa: vehiculo.placa });
  },

  // Estadísticas
  async getStats(): Promise<{
    total: number;
    porMarca: Record<string, number>;
    promedioAnio: number;
  }> {
    return VehiculoRepository.getStats();
  },
};
