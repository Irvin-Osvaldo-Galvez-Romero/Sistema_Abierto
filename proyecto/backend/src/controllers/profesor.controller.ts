/**
 * Controlador de Profesores
 * Manejo de peticiones HTTP para profesores
 */

import { Request, Response, NextFunction } from 'express';
import { ProfesorService } from '../services/profesor.service';
import { AppError } from '../utils/errors';

export class ProfesorController {
  /**
   * Crear un nuevo profesor
   */
  static async crearProfesor(req: Request, res: Response, next: NextFunction) {
    try {
      const profesor = await ProfesorService.crearProfesor(req.body);

      res.status(201).json({
        success: true,
        message: 'Profesor creado exitosamente',
        data: profesor,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener todos los profesores
   */
  static async obtenerProfesores(req: Request, res: Response, next: NextFunction) {
    try {
      const profesores = await ProfesorService.obtenerProfesores();

      res.status(200).json({
        success: true,
        data: profesores,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Obtener un profesor por ID
   */
  static async obtenerProfesorPorId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const profesor = await ProfesorService.obtenerProfesorPorId(id);

      res.status(200).json({
        success: true,
        data: profesor,
      });
    } catch (error) {
      next(error);
    }
  }
}

