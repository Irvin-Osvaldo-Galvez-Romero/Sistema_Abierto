/**
 * Rutas de Carreras
 * Endpoints para gestión de carreras universitarias
 */

import { Router } from 'express';
import { CarreraController } from '../controllers/carrera.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Aplicar autenticación a todas las rutas
router.use(authenticate);

/**
 * GET /api/carreras
 * Obtener todas las carreras activas
 */
router.get('/', CarreraController.getAll);

/**
 * GET /api/carreras/:id
 * Obtener carrera por ID
 */
router.get('/:id', CarreraController.getById);

export default router;