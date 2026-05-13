import { Request } from 'express';
import { Usuario, Vehiculo, Cita, Tarea } from '@prisma/client';

// Re-exportar tipos de Prisma
export type { Usuario, Vehiculo, Cita, Tarea };

// Enums manuales (la base de datos usa strings, no enums de PostgreSQL)
export const TipoUsuario = {
  ADMIN: 'admin',
  CLIENTE: 'cliente',
  MECANICO: 'mecanico',
} as const;
export type TipoUsuario = typeof TipoUsuario[keyof typeof TipoUsuario];

export const EstadoCita = {
  PENDIENTE: 'Pendiente',
  EN_REVISION: 'En revisión',
  ESPERANDO_REPUESTOS: 'Esperando repuestos',
  EN_REPARACION: 'En reparación',
  LISTO_PARA_ENTREGA: 'Listo para entrega',
  ENTREGADA: 'Entregada',
  CANCELADA: 'Cancelada',
} as const;
export type EstadoCita = typeof EstadoCita[keyof typeof EstadoCita];

// Tipo de usuario sin password
export type UsuarioSafe = Omit<Usuario, 'password'>;

// Payload del JWT
export interface JwtPayload {
  id: number;
  username: string;
  tipo: TipoUsuario;
}

// Request extendido con usuario
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

// Respuesta estándar de API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Login y Register
export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  nombre: string;
  telefono: string;
}

// Inputs de Cita
export interface CreateCitaInput {
  usuario_id: number;
  vehiculo_id?: number;
  fecha: string;
  hora: string;
  servicio: string;
  descripcion?: string;
  repuestos_solicitados?: string;
  repuestos_propios?: string;
}

export interface UpdateCitaInput {
  fecha?: string;
  hora?: string;
  servicio?: string;
  descripcion?: string;
  estado?: EstadoCita;
  repuestos_solicitados?: string;
  repuestos_propios?: string;
}

// Inputs de Vehiculo
export interface CreateVehiculoInput {
  usuario_id: number;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  color?: string;
  kilometraje?: number;
}

export interface UpdateVehiculoInput {
  marca?: string;
  modelo?: string;
  anio?: number;
  color?: string;
  kilometraje?: number;
}

// Helper para parsear IDs de params
export const parseParamId = (param: string | undefined): number => {
  if (!param) throw new Error('ID no proporcionado');
  return parseInt(param, 10);
};

// Inputs de Tarea
export interface CreateTareaInput {
  cita_id: number;
  descripcion: string;
}

export interface UpdateTareaInput {
  descripcion?: string;
  completada?: boolean;
}
