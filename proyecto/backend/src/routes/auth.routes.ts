/**
 * Rutas de Autenticación
 * Define los endpoints de autenticación
 */

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import {
  loginSchema,
  refreshTokenSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/auth.validators';

const router = Router();


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
 * @route   POST /api/auth/forgot-password
 * @desc    Solicitar restablecimiento de contraseña
 * @access  Public
 */
router.post('/forgot-password', validate(forgotPasswordSchema), AuthController.forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Restablecer contraseña con token
 * @access  Public
 */
router.post('/reset-password', validate(resetPasswordSchema), AuthController.resetPassword);

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


