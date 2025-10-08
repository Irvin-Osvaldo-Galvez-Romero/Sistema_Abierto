/**
 * Rutas de Autenticación
 * Define los endpoints de autenticación
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
} from '../validators/auth.validators';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post('/register', validate(registerSchema), AuthController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', validate(loginSchema), AuthController.login);

/**
 * @route   POST /api/auth/refresh
 * @desc    Renovar token de acceso
 * @access  Public
 */
router.post('/refresh', validate(refreshTokenSchema), AuthController.refreshToken);

/**
 * @route   POST /api/auth/logout
 * @desc    Cerrar sesión
 * @access  Public
 */
router.post('/logout', validate(logoutSchema), AuthController.logout);

/**
 * @route   GET /api/auth/profile
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/profile', authenticate, AuthController.getProfile);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener información básica del usuario
 * @access  Private
 */
router.get('/me', authenticate, AuthController.getMe);

export default router;


