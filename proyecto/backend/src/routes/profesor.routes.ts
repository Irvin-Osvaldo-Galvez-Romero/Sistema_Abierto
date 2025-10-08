/**
 * Rutas de Profesores
 * Endpoints para gestión de profesores
 */

import { Router } from 'express';
import { ProfesorController } from '../controllers/profesor.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * POST /api/profesores
 * Crear un nuevo profesor
 */
router.post('/', ProfesorController.crearProfesor);

/**
 * GET /api/profesores
 * Obtener todos los profesores
 */
router.get('/', ProfesorController.obtenerProfesores);

/**
 * GET /api/profesores/:id
 * Obtener un profesor por ID
 */
router.get('/:id', ProfesorController.obtenerProfesorPorId);

export default router;

