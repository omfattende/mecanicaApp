import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller';
import { authenticateToken, requireRole } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/async-handler';
import { TipoUsuario } from '../types';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// GET /api/usuarios
router.get('/', requireRole(TipoUsuario.ADMIN), asyncHandler(UsuarioController.getAll));

// GET /api/usuarios/stats
router.get('/stats', requireRole(TipoUsuario.ADMIN), asyncHandler(UsuarioController.getStats));

// GET /api/usuarios/profile (usuario actual)
router.get('/profile', asyncHandler(UsuarioController.getProfile));

// PUT /api/usuarios/profile
router.put('/profile', asyncHandler(UsuarioController.updateProfile));

// PUT /api/usuarios/change-password
router.put('/change-password', asyncHandler(UsuarioController.changePassword));

// GET /api/usuarios/:id
router.get('/:id', asyncHandler(UsuarioController.getById));

// PUT /api/usuarios/:id
router.put('/:id', asyncHandler(UsuarioController.update));

// DELETE /api/usuarios/:id
router.delete('/:id', requireRole(TipoUsuario.ADMIN), asyncHandler(UsuarioController.delete));

export default router;
