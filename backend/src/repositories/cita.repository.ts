import prisma from '../config/database';
import { Cita, CreateCitaInput, UpdateCitaInput, EstadoCita } from '../types';

export const CitaRepository = {
  // Buscar todas las citas
  async findAll(): Promise<Cita[]> {
    return prisma.cita.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            telefono: true,
            email: true,
          },
        },
        vehiculo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            placa: true,
          },
        },
        _count: {
          select: { tareas: true },
        },
      },
      orderBy: [
        { fecha: 'asc' },
        { hora: 'asc' },
      ],
    });
  },

  // Buscar por ID
  async findById(id: number): Promise<Cita | null> {
    return prisma.cita.findUnique({
      where: { id },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            telefono: true,
            email: true,
          },
        },
        vehiculo: true,
        tareas: {
          orderBy: { fecha_creacion: 'asc' },
        },
      },
    });
  },

  // Buscar por usuario
  async findByUsuario(usuarioId: number): Promise<Cita[]> {
    return prisma.cita.findMany({
      where: { usuario_id: usuarioId },
      include: {
        vehiculo: {
          select: {
            id: true,
            marca: true,
            modelo: true,
            placa: true,
          },
        },
        _count: {
          select: { tareas: true },
        },
      },
      orderBy: [
        { fecha: 'desc' },
        { hora: 'desc' },
      ],
    });
  },

  // Buscar citas por fecha
  async findByFecha(fecha: Date): Promise<Cita[]> {
    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.cita.findMany({
      where: {
        fecha: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            telefono: true,
          },
        },
        vehiculo: {
          select: {
            marca: true,
            modelo: true,
            placa: true,
          },
        },
      },
      orderBy: { hora: 'asc' },
    });
  },

  // Buscar citas por rango de fechas
  async findByDateRange(start: Date, end: Date): Promise<Cita[]> {
    return prisma.cita.findMany({
      where: {
        fecha: {
          gte: start,
          lte: end,
        },
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            telefono: true,
          },
        },
        vehiculo: {
          select: {
            marca: true,
            modelo: true,
            placa: true,
          },
        },
      },
      orderBy: [
        { fecha: 'asc' },
        { hora: 'asc' },
      ],
    });
  },

  // Crear cita
  async create(data: CreateCitaInput): Promise<Cita> {
    const fechaHora = new Date(`${data.fecha}T${data.hora}:00`);
    return prisma.cita.create({
      data: {
        ...data,
        fecha: fechaHora,
        hora: fechaHora,
      },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            telefono: true,
          },
        },
        vehiculo: true,
      },
    });
  },

  // Actualizar cita
  async update(id: number, data: UpdateCitaInput): Promise<Cita | null> {
    try {
      const updateData: Record<string, unknown> = { ...data };
      if (data.fecha && data.hora) {
        const fechaHora = new Date(`${data.fecha}T${data.hora}:00`);
        updateData.fecha = fechaHora;
        updateData.hora = fechaHora;
      } else if (data.fecha) {
        updateData.fecha = new Date(data.fecha);
      } else if (data.hora) {
        const fechaHora = new Date(`1970-01-01T${data.hora}:00`);
        updateData.hora = fechaHora;
      }

      return prisma.cita.update({
        where: { id },
        data: updateData,
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              telefono: true,
            },
          },
          vehiculo: true,
        },
      });
    } catch {
      return null;
    }
  },

  // Actualizar estado
  async updateEstado(id: number, estado: EstadoCita): Promise<Cita | null> {
    try {
      return prisma.cita.update({
        where: { id },
        data: { estado },
      });
    } catch {
      return null;
    }
  },

  // Eliminar cita
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.cita.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  },

  // Estadísticas
  async getStats(): Promise<{
    total: number;
    porEstado: Record<EstadoCita, number>;
    hoy: number;
    semana: number;
  }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekFromNow = new Date(today);
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    const [total, porEstado, hoy, semana] = await Promise.all([
      prisma.cita.count(),
      prisma.cita.groupBy({
        by: ['estado'],
        _count: { estado: true },
      }),
      prisma.cita.count({
        where: {
          fecha: {
            gte: today,
            lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
          },
        },
      }),
      prisma.cita.count({
        where: {
          fecha: {
            gte: today,
            lte: weekFromNow,
          },
        },
      }),
    ]);

    const estadoCounts: Record<EstadoCita, number> = {
      [EstadoCita.PENDIENTE]: 0,
      [EstadoCita.EN_REVISION]: 0,
      [EstadoCita.ESPERANDO_REPUESTOS]: 0,
      [EstadoCita.EN_REPARACION]: 0,
      [EstadoCita.LISTO_PARA_ENTREGA]: 0,
      [EstadoCita.ENTREGADA]: 0,
      [EstadoCita.CANCELADA]: 0,
    };

    porEstado.forEach(e => {
      estadoCounts[e.estado] = e._count.estado;
    });

    return {
      total,
      porEstado: estadoCounts,
      hoy,
      semana,
    };
  },
};
