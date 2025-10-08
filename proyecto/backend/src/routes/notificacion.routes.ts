/**
 * Rutas de Notificaciones
 */

import { Router } from 'express';
import { NotificacionController } from '../controllers/notificacion.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Rol } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/my-notifications', authorize(Rol.ESTUDIANTE), NotificacionController.getMyNotifications);
router.patch('/:id/read', authorize(Rol.ESTUDIANTE), NotificacionController.markAsRead);
router.patch('/mark-all-read', authorize(Rol.ESTUDIANTE), NotificacionController.markAllAsRead);

export default router;

