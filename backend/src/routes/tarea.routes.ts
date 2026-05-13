import { Router } from 'express';
import { TareaController } from '../controllers/tarea.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';
import { TipoUsuario } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/tareas
router.get('/', asyncHandler(TareaController.getAll));

// GET /api/tareas/cita/:citaId/stats
router.get('/cita/:citaId/stats', asyncHandler(TareaController.getStatsByCita));

// GET /api/tareas/cita/:citaId
router.get('/cita/:citaId', asyncHandler(TareaController.getByCita));

// GET /api/tareas/:id
router.get('/:id', asyncHandler(TareaController.getById));

// POST /api/tareas
router.post('/', asyncHandler(TareaController.create));

// POST /api/tareas/batch
router.post('/batch', requireRole(TipoUsuario.ADMIN, TipoUsuario.MECANICO), asyncHandler(TareaController.createMany));

// PUT /api/tareas/:id
router.put('/:id', asyncHandler(TareaController.update));

// PATCH /api/tareas/:id/toggle
router.patch('/:id/toggle', asyncHandler(TareaController.toggleCompletada));

// DELETE /api/tareas/cita/:citaId
router.delete('/cita/:citaId', requireRole(TipoUsuario.ADMIN, TipoUsuario.MECANICO), asyncHandler(TareaController.deleteByCita));

// DELETE /api/tareas/:id
router.delete('/:id', asyncHandler(TareaController.delete));

export default router;
