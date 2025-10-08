/**
 * Rutas de Calificaciones
 */

import { Router } from 'express';
import { CalificacionController } from '../controllers/calificacion.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Rol } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/my-calificaciones', authorize(Rol.ESTUDIANTE), CalificacionController.getMyCalificaciones);
router.post('/', authorize(Rol.PROFESOR, Rol.ADMINISTRADOR, Rol.SUPER_ADMIN), CalificacionController.create);
router.get('/estudiante/:estudianteId', authorize(Rol.PROFESOR, Rol.ADMINISTRADOR, Rol.SUPER_ADMIN), CalificacionController.getByEstudiante);
router.get('/promedio/:estudianteId', CalificacionController.getPromedio);
router.put('/:id', authorize(Rol.PROFESOR, Rol.ADMINISTRADOR, Rol.SUPER_ADMIN), CalificacionController.update);

export default router;


