import prisma from '../config/database';
import { Tarea, CreateTareaInput, UpdateTareaInput } from '../types';

export const TareaRepository = {
  // Buscar todas las tareas
  async findAll(): Promise<Tarea[]> {
    return prisma.tarea.findMany({
      orderBy: { fecha_creacion: 'desc' },
    });
  },

  // Buscar por ID
  async findById(id: number): Promise<Tarea | null> {
    return prisma.tarea.findUnique({
      where: { id },
    });
  },

  // Buscar por cita
  async findByCita(citaId: number): Promise<Tarea[]> {
    return prisma.tarea.findMany({
      where: { cita_id: citaId },
      orderBy: [
        { completada: 'asc' },
        { fecha_creacion: 'asc' },
      ],
    });
  },

  // Crear tarea
  async create(data: CreateTareaInput): Promise<Tarea> {
    return prisma.tarea.create({
      data,
    });
  },

  // Crear múltiples tareas
  async createMany(citaId: number, descripciones: string[]): Promise<Tarea[]> {
    const data = descripciones.map(descripcion => ({
      cita_id: citaId,
      descripcion,
    }));

    await prisma.tarea.createMany({
      data,
    });

    return this.findByCita(citaId);
  },

  // Actualizar tarea
  async update(id: number, data: UpdateTareaInput): Promise<Tarea | null> {
    try {
      return prisma.tarea.update({
        where: { id },
        data,
      });
    } catch {
      return null;
    }
  },

  // Toggle completada
  async toggleCompletada(id: number): Promise<Tarea | null> {
    try {
      const tarea = await prisma.tarea.findUnique({
        where: { id },
      });

      if (!tarea) return null;

      return prisma.tarea.update({
        where: { id },
        data: { completada: !tarea.completada },
      });
    } catch {
      return null;
    }
  },

  // Eliminar tarea
  async delete(id: number): Promise<boolean> {
    try {
      await prisma.tarea.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  },

  // Eliminar todas las tareas de una cita
  async deleteByCita(citaId: number): Promise<number> {
    const result = await prisma.tarea.deleteMany({
      where: { cita_id: citaId },
    });
    return result.count;
  },

  // Estadísticas
  async getStatsByCita(citaId: number): Promise<{
    total: number;
    completadas: number;
    pendientes: number;
    progreso: number;
  }> {
    const [total, completadas] = await Promise.all([
      prisma.tarea.count({
        where: { cita_id: citaId },
      }),
      prisma.tarea.count({
        where: { cita_id: citaId, completada: true },
      }),
    ]);

    const pendientes = total - completadas;
    const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;

    return {
      total,
      completadas,
      pendientes,
      progreso,
    };
  },
};
