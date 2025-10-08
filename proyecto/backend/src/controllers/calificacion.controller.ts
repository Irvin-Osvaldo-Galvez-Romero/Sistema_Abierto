/**
 * Controlador de Calificaciones
 */

import { Request, Response, NextFunction } from 'express';
import { CalificacionService } from '../services/calificacion.service';

export class CalificacionController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const calificacion = await CalificacionService.create(req.body);
      res.status(201).json({ success: true, data: calificacion });
    } catch (error) {
      next(error);
    }
  }

  static async getByEstudiante(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { estudianteId } = req.params;
      const calificaciones = await CalificacionService.findByEstudiante(estudianteId);
      res.status(200).json({ success: true, data: calificaciones });
    } catch (error) {
      next(error);
    }
  }

  static async getMyCalificaciones(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      // Obtener estudiante del usuario autenticado
      const estudiante = await prisma.estudiante.findUnique({
        where: { usuarioId: req.user.userId },
      });

      if (!estudiante) {
        res.status(404).json({ success: false, message: 'Perfil de estudiante no encontrado' });
        return;
      }

      const calificaciones = await CalificacionService.findByEstudiante(estudiante.id);
      const promedio = await CalificacionService.calculatePromedio(estudiante.id);

      res.status(200).json({
        success: true,
        data: {
          calificaciones,
          promedio,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { calificacion, observaciones } = req.body;
      const updated = await CalificacionService.update(req.params.id, calificacion, observaciones);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async getPromedio(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { estudianteId } = req.params;
      const promedio = await CalificacionService.calculatePromedio(estudianteId);
      res.status(200).json({ success: true, data: { promedio } });
    } catch (error) {
      next(error);
    }
  }
}

// Importar prisma para el método getMyCalificaciones
import { prisma } from '../config/database';

export default CalificacionController;


