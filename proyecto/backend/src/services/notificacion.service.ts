/**
 * Servicio de Notificaciones
 * Gestión de notificaciones para estudiantes
 */

import { Notificacion, TipoNotificacion } from '@prisma/client';
import { prisma } from '../config/database';
import logger from '../utils/logger';

export class NotificacionService {
  /**
   * Obtener notificaciones del estudiante
   */
  static async getByEstudiante(
    estudianteId: string,
    soloNoLeidas: boolean = false
  ): Promise<Notificacion[]> {
    try {
      const where: any = { estudianteId };
      
      if (soloNoLeidas) {
        where.leida = false;
      }

      return await prisma.notificacion.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      logger.error('Error al obtener notificaciones:', error);
      throw error;
    }
  }

  /**
   * Marcar notificación como leída
   */
  static async markAsRead(id: string): Promise<void> {
    try {
      await prisma.notificacion.update({
        where: { id },
        data: { leida: true },
      });
    } catch (error) {
      logger.error('Error al marcar notificación:', error);
      throw error;
    }
  }

  /**
   * Marcar todas como leídas
   */
  static async markAllAsRead(estudianteId: string): Promise<void> {
    try {
      await prisma.notificacion.updateMany({
        where: {
          estudianteId,
          leida: false,
        },
        data: {
          leida: true,
        },
      });
    } catch (error) {
      logger.error('Error al marcar todas las notificaciones:', error);
      throw error;
    }
  }

  /**
   * Contar notificaciones no leídas
   */
  static async countUnread(estudianteId: string): Promise<number> {
    try {
      return await prisma.notificacion.count({
        where: {
          estudianteId,
          leida: false,
        },
      });
    } catch (error) {
      logger.error('Error al contar notificaciones:', error);
      throw error;
    }
  }
}

export default NotificacionService;

