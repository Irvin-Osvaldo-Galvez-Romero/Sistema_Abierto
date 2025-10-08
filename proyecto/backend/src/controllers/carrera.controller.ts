/**
 * Controlador de Carreras
 * Gestión de carreras universitarias
 */

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

export class CarreraController {
  /**
   * GET /api/carreras
   * Obtener todas las carreras activas
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const carreras = await prisma.carrera.findMany({
        where: {
          activo: true,
        },
        select: {
          id: true,
          clave: true,
          nombre: true,
          descripcion: true,
          duracionSemestres: true,
          creditos: true,
          modalidad: true,
        },
        orderBy: {
          nombre: 'asc',
        },
      });

      res.status(200).json({
        success: true,
        data: carreras,
        total: carreras.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/carreras/:id
   * Obtener carrera por ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      const carrera = await prisma.carrera.findUnique({
        where: { id },
        select: {
          id: true,
          clave: true,
          nombre: true,
          descripcion: true,
          duracionSemestres: true,
          creditos: true,
          modalidad: true,
        },
      });

      if (!carrera) {
        res.status(404).json({
          success: false,
          message: 'Carrera no encontrada',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: carrera,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default CarreraController;