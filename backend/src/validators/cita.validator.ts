import { z } from 'zod';
import { EstadoCita } from '../types';

// Validar fecha en formato YYYY-MM-DD
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
// Validar hora en formato HH:mm
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const createCitaSchema = z.object({
  usuario_id: z.number({
    required_error: 'El ID de usuario es requerido',
    invalid_type_error: 'El ID de usuario debe ser un número',
  }).int().positive('El ID de usuario debe ser positivo'),
  vehiculo_id: z.number({
    invalid_type_error: 'El ID de vehículo debe ser un número',
  }).int().positive('El ID de vehículo debe ser positivo').optional(),
  fecha: z.string()
    .regex(dateRegex, 'La fecha debe tener el formato YYYY-MM-DD'),
  hora: z.string()
    .regex(timeRegex, 'La hora debe tener el formato HH:mm'),
  servicio: z.string()
    .min(3, 'El servicio debe tener al menos 3 caracteres')
    .max(200, 'El servicio no puede tener más de 200 caracteres'),
  descripcion: z.string()
    .max(1000, 'La descripción no puede tener más de 1000 caracteres')
    .optional(),
  repuestos_solicitados: z.string()
    .max(500, 'Los repuestos solicitados no pueden tener más de 500 caracteres')
    .optional(),
  repuestos_propios: z.string()
    .max(500, 'Los repuestos propios no pueden tener más de 500 caracteres')
    .optional(),
});

export const updateCitaSchema = z.object({
  fecha: z.string()
    .regex(dateRegex, 'La fecha debe tener el formato YYYY-MM-DD')
    .optional(),
  hora: z.string()
    .regex(timeRegex, 'La hora debe tener el formato HH:mm')
    .optional(),
  servicio: z.string()
    .min(3, 'El servicio debe tener al menos 3 caracteres')
    .max(200, 'El servicio no puede tener más de 200 caracteres')
    .optional(),
  descripcion: z.string()
    .max(1000, 'La descripción no puede tener más de 1000 caracteres')
    .optional(),
  estado: z.enum([EstadoCita.PENDIENTE, EstadoCita.EN_REVISION, EstadoCita.ESPERANDO_REPUESTOS, EstadoCita.EN_REPARACION, EstadoCita.LISTO_PARA_ENTREGA, EstadoCita.ENTREGADA, EstadoCita.CANCELADA], {
    errorMap: () => ({ message: 'El estado no es válido' }),
  }).optional(),
  repuestos_solicitados: z.string()
    .max(500, 'Los repuestos solicitados no pueden tener más de 500 caracteres')
    .optional(),
  repuestos_propios: z.string()
    .max(500, 'Los repuestos propios no pueden tener más de 500 caracteres')
    .optional(),
});

export const updateEstadoSchema = z.object({
  estado: z.enum([EstadoCita.PENDIENTE, EstadoCita.EN_REVISION, EstadoCita.ESPERANDO_REPUESTOS, EstadoCita.EN_REPARACION, EstadoCita.LISTO_PARA_ENTREGA, EstadoCita.ENTREGADA, EstadoCita.CANCELADA], {
    errorMap: () => ({ message: 'El estado no es válido' }),
  }),
});

export type CreateCitaInput = z.infer<typeof createCitaSchema>;
export type UpdateCitaInput = z.infer<typeof updateCitaSchema>;
export type UpdateEstadoInput = z.infer<typeof updateEstadoSchema>;
