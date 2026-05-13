import { z } from 'zod';

// Validar placa (formato flexible para diferentes países)
const placaRegex = /^[A-Z0-9\-]+$/i;

export const createVehiculoSchema = z.object({
  usuario_id: z.number({
    required_error: 'El ID de usuario es requerido',
    invalid_type_error: 'El ID de usuario debe ser un número',
  }).int().positive('El ID de usuario debe ser positivo'),
  marca: z.string()
    .min(2, 'La marca debe tener al menos 2 caracteres')
    .max(50, 'La marca no puede tener más de 50 caracteres'),
  modelo: z.string()
    .min(1, 'El modelo es requerido')
    .max(50, 'El modelo no puede tener más de 50 caracteres'),
  anio: z.number({
    required_error: 'El año es requerido',
    invalid_type_error: 'El año debe ser un número',
  }).int()
    .min(1900, 'El año no puede ser menor a 1900')
    .max(new Date().getFullYear() + 1, 'El año no puede ser mayor al año siguiente'),
  placa: z.string()
    .min(3, 'La placa debe tener al menos 3 caracteres')
    .max(20, 'La placa no puede tener más de 20 caracteres')
    .regex(placaRegex, 'La placa solo puede contener letras, números y guiones')
    .toUpperCase(),
  color: z.string()
    .max(30, 'El color no puede tener más de 30 caracteres')
    .optional(),
  kilometraje: z.number({
    invalid_type_error: 'El kilometraje debe ser un número',
  }).int()
    .min(0, 'El kilometraje no puede ser negativo')
    .optional(),
});

export const updateVehiculoSchema = z.object({
  marca: z.string()
    .min(2, 'La marca debe tener al menos 2 caracteres')
    .max(50, 'La marca no puede tener más de 50 caracteres')
    .optional(),
  modelo: z.string()
    .min(1, 'El modelo es requerido')
    .max(50, 'El modelo no puede tener más de 50 caracteres')
    .optional(),
  anio: z.number({
    invalid_type_error: 'El año debe ser un número',
  }).int()
    .min(1900, 'El año no puede ser menor a 1900')
    .max(new Date().getFullYear() + 1, 'El año no puede ser mayor al año siguiente')
    .optional(),
  color: z.string()
    .max(30, 'El color no puede tener más de 30 caracteres')
    .optional(),
  kilometraje: z.number({
    invalid_type_error: 'El kilometraje debe ser un número',
  }).int()
    .min(0, 'El kilometraje no puede ser negativo')
    .optional(),
});

export type CreateVehiculoInput = z.infer<typeof createVehiculoSchema>;
export type UpdateVehiculoInput = z.infer<typeof updateVehiculoSchema>;
