export * from './user.model';
export * from './vehiculo.model';
export * from './cita.model';

// Respuesta genérica de API
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}
