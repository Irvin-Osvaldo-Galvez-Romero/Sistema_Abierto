/**
 * Rutas de Cambio de Contraseña
 */

import { Router } from 'express';
import { PasswordController } from '../controllers/password.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/password/change-first-login
 * @desc    Cambiar contraseña en primer login
 * @access  Private
 */
router.post('/change-first-login', authenticate, PasswordController.changeFirstLogin);

/**
 * @route   POST /api/password/change
 * @desc    Cambiar contraseña
 * @access  Private
 */
router.post('/change', authenticate, PasswordController.changePassword);

export default router;

