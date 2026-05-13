import { Router } from 'express';
import { CitaController } from '../controllers/cita.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createCitaSchema, updateCitaSchema, updateEstadoSchema } from '../validators/cita.validator';
import { asyncHandler } from '../utils/async-handler';
import { TipoUsuario } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/citas
router.get('/', asyncHandler(CitaController.getAll));

// GET /api/citas/stats
router.get('/stats', requireRole(TipoUsuario.ADMIN, TipoUsuario.MECANICO), asyncHandler(CitaController.getStats));

// GET /api/citas/mis-citas
router.get('/mis-citas', asyncHandler(CitaController.getMisCitas));

// GET /api/citas/rango
router.get('/rango', asyncHandler(CitaController.getByDateRange));

// GET /api/citas/fecha/:fecha
router.get('/fecha/:fecha', asyncHandler(CitaController.getByFecha));

// GET /api/citas/cliente/:usuarioId
router.get('/cliente/:usuarioId', asyncHandler(CitaController.getByUsuario));

// GET /api/citas/:id
router.get('/:id', asyncHandler(CitaController.getById));

// POST /api/citas
router.post('/', validate(createCitaSchema), asyncHandler(CitaController.create));

// PUT /api/citas/:id
router.put('/:id', validate(updateCitaSchema), asyncHandler(CitaController.update));

// PUT /api/citas/:id/estado
router.put('/:id/estado', validate(updateEstadoSchema), asyncHandler(CitaController.updateEstado));

// POST /api/citas/:id/cancelar
router.post('/:id/cancelar', asyncHandler(CitaController.cancelar));

// POST /api/citas/:id/completar
router.post('/:id/completar', requireRole(TipoUsuario.ADMIN, TipoUsuario.MECANICO), asyncHandler(CitaController.completar));

// POST /api/citas/:id/iniciar
router.post('/:id/iniciar', requireRole(TipoUsuario.ADMIN, TipoUsuario.MECANICO), asyncHandler(CitaController.iniciarServicio));

// DELETE /api/citas/:id
router.delete('/:id', asyncHandler(CitaController.delete));

export default router;
