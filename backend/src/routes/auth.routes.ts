import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../validators/auth.validator';
import { asyncHandler } from '../utils/async-handler';

const router = Router();

// POST /api/auth/login
router.post('/login', validate(loginSchema), asyncHandler(AuthController.login));

// POST /api/auth/register
router.post('/register', validate(registerSchema), asyncHandler(AuthController.register));

// POST /api/auth/logout
router.post('/logout', asyncHandler(AuthController.logout));

// GET /api/auth/me
router.get('/me', asyncHandler(AuthController.me));

// GET /api/auth/verify (para compatibilidad)
router.get('/verify', asyncHandler(AuthController.verify));

export default router;
