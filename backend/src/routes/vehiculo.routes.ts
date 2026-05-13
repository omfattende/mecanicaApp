import { Router } from 'express';
import { VehiculoController } from '../controllers/vehiculo.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createVehiculoSchema, updateVehiculoSchema } from '../validators/vehiculo.validator';
import { asyncHandler } from '../utils/async-handler';
import { TipoUsuario } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/vehiculos
router.get('/', asyncHandler(VehiculoController.getAll));

// GET /api/vehiculos/stats
router.get('/stats', requireRole(TipoUsuario.ADMIN, TipoUsuario.MECANICO), asyncHandler(VehiculoController.getStats));

// GET /api/vehiculos/mis-vehiculos
router.get('/mis-vehiculos', asyncHandler(VehiculoController.getMisVehiculos));

// GET /api/vehiculos/usuario/:usuarioId
router.get('/usuario/:usuarioId', asyncHandler(VehiculoController.getByUsuario));

// GET /api/vehiculos/:id
router.get('/:id', asyncHandler(VehiculoController.getById));

// POST /api/vehiculos
router.post('/', validate(createVehiculoSchema), asyncHandler(VehiculoController.create));

// PUT /api/vehiculos/:id
router.put('/:id', validate(updateVehiculoSchema), asyncHandler(VehiculoController.update));

// DELETE /api/vehiculos/:id
router.delete('/:id', asyncHandler(VehiculoController.delete));

export default router;
