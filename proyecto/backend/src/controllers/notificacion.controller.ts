/**
 * Controlador de Notificaciones
 */

import { Request, Response, NextFunction } from 'express';
import { NotificacionService } from '../services/notificacion.service';
import { prisma } from '../config/database';

export class NotificacionController {
  /**
   * GET /api/notificaciones/my-notifications
   * Obtener mis notificaciones
   */
  static async getMyNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      const estudiante = await prisma.estudiante.findUnique({
        where: { usuarioId: req.user.userId },
      });

      if (!estudiante) {
        res.status(404).json({ success: false, message: 'Perfil de estudiante no encontrado' });
        return;
      }

      const soloNoLeidas = req.query.unread === 'true';
      const notificaciones = await NotificacionService.getByEstudiante(estudiante.id, soloNoLeidas);
      const unreadCount = await NotificacionService.countUnread(estudiante.id);

      res.status(200).json({
        success: true,
        data: {
          notificaciones,
          unreadCount,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/notificaciones/:id/read
   * Marcar como leída
   */
  static async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await NotificacionService.markAsRead(req.params.id);
      res.status(200).json({ success: true, message: 'Notificación marcada como leída' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/notificaciones/mark-all-read
   * Marcar todas como leídas
   */
  static async markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      const estudiante = await prisma.estudiante.findUnique({
        where: { usuarioId: req.user.userId },
      });

      if (!estudiante) {
        res.status(404).json({ success: false, message: 'Perfil de estudiante no encontrado' });
        return;
      }

      await NotificacionService.markAllAsRead(estudiante.id);
      res.status(200).json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
    } catch (error) {
      next(error);
    }
  }
}

export default NotificacionController;

