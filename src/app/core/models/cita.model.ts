export type EstadoCita = 'Pendiente' | 'En progreso' | 'Completada' | 'Cancelada' | 'Entregado';

export interface Cita {
  id: number;
  usuario_id: number;
  vehiculo_id?: number;
  fecha: string;
  hora: string;
  servicio: string;
  descripcion?: string;
  estado: EstadoCita;
  repuestos_solicitados?: string;
  repuestos_propios?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relaciones
  usuario?: {
    id: number;
    nombre: string;
    telefono: string;
    email: string;
  };
  vehiculo?: {
    id: number;
    marca: string;
    modelo: string;
    placa: string;
  };
  tareas?: Tarea[];
  _count?: {
    tareas: number;
  };
}

export interface Tarea {
  id: number;
  cita_id: number;
  descripcion: string;
  completada: boolean;
  fecha_creacion: string;
}

export interface CreateCitaRequest {
  usuario_id: number;
  vehiculo_id?: number;
  fecha: string;
  hora: string;
  servicio: string;
  descripcion?: string;
  repuestos_solicitados?: string;
  repuestos_propios?: string;
}

export interface UpdateCitaRequest {
  fecha?: string;
  hora?: string;
  servicio?: string;
  descripcion?: string;
  estado?: EstadoCita;
  repuestos_solicitados?: string;
  repuestos_propios?: string;
}

export interface CitaStats {
  total: number;
  porEstado: Record<EstadoCita, number>;
  hoy: number;
  semana: number;
}
