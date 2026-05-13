import prisma from '../config/database';
import { Vehiculo, CreateVehiculoInput, UpdateVehiculoInput } from '../types';

export const VehiculoRepository = {
  // Buscar todos los vehículos
  async findAll(): Promise<Vehiculo[]> {
    return prisma.vehiculo.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
        _count: {
          select: { citas: true },
        },
      },
      orderBy: { created_at: 'desc' },
    });
  },

  // Buscar por ID
  async findById(id: number): Promise<Vehiculo | null> {
    return prisma.vehiculo.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
            telefono: true,
          },
        },
      },
    });
  },

  // Buscar por placa
  async findByPlaca(placa: string): Promise<Vehiculo | null> {
    return prisma.vehiculo.findUnique({
      where: { placa: placa.toUpperCase() },
    });
  },

  // Buscar por usuario
  async findByUsuario(usuarioId: number): Promise<Vehiculo[]> {
    return prisma.vehiculo.findMany({
      where: { usuario_id: usuarioId },
      orderBy: { created_at: 'desc' },
    });
  },

  // Crear vehículo
  async create(data: CreateVehiculoInput): Promise<Vehiculo> {
    return prisma.vehiculo.create({
      data: {
        ...data,
        placa: data.placa.toUpperCase(),
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
      },
    });
  },

  // Actualizar vehículo
  async update(id: number, data: UpdateVehiculoInput): Promise<Vehiculo | null> {
    try {
      return prisma.vehiculo.update({
        where: { id },
        data,
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              email: true,
            },
          },
        },
      });
    } catch {
      return null;
    }
  },

  // Eliminar vehículo
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.vehiculo.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  },

  // Verificar si existe placa
  async existsPlaca(placa: string, excludeId?: number): Promise<boolean> {
    const where: { placa: string; id?: { not: number } } = {
      placa: placa.toUpperCase(),
    };
    
    if (excludeId) {
      where.id = { not: excludeId };
    }

    const count = await prisma.vehiculo.count({ where });
    return count > 0;
  },

  // Estadísticas
  async getStats(): Promise<{
    total: number;
    porMarca: Record<string, number>;
    promedioAnio: number;
  }> {
    const [total, porMarca, promedioAnio] = await Promise.all([
      prisma.vehiculo.count(),
      prisma.vehiculo.groupBy({
        by: ['marca'],
        _count: { id: true },
      }),
      prisma.vehiculo.aggregate({
        _avg: { anio: true },
      }),
    ]);

    const marcaCounts: Record<string, number> = {};
    porMarca.forEach(m => {
      marcaCounts[m.marca] = m._count.id;
    });

    return {
      total,
      porMarca: marcaCounts,
      promedioAnio: Math.round(promedioAnio._avg?.anio || 0),
    };
  },
};
