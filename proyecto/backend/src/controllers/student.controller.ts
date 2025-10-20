/**
 * Controlador de Estudiantes
 * Maneja las peticiones HTTP relacionadas con estudiantes
 */

import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';
import { EstatusEstudiante } from '@prisma/client';
import logger from '../utils/logger';

export class StudentController {
  /**
   * POST /api/students
   * Crear nuevo estudiante
   */
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const estudiante = await StudentService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Estudiante creado exitosamente',
        data: estudiante,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students
   * Obtener lista de estudiantes
   */
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 1000; // Aumentar para mostrar todos
      const estatus = req.query.estatus as EstatusEstudiante | undefined;

      const result = await StudentService.findAll(page, limit, estatus);

      res.status(200).json({
        success: true,
        data: result.estudiantes,
        total: result.total,
        pagination: {
          page,
          limit,
          total: result.total,
          pages: result.pages,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/:id
   * Obtener estudiante por ID
   */
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const estudiante = await StudentService.findById(id);

      res.status(200).json({
        success: true,
        data: estudiante,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/matricula/:matricula
   * Obtener estudiante por matrícula
   */
  static async getByMatricula(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { matricula } = req.params;
      const estudiante = await StudentService.findByMatricula(matricula);

      res.status(200).json({
        success: true,
        data: estudiante,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/my-profile
   * Obtener perfil del estudiante autenticado
   */
  static async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const estudiante = await StudentService.findByUserId(req.user.userId);

      res.status(200).json({
        success: true,
        data: estudiante,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/students/:id
   * Actualizar estudiante
   */
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const estudiante = await StudentService.update(id, req.body);

      res.status(200).json({
        success: true,
        message: 'Estudiante actualizado exitosamente',
        data: estudiante,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/students/:id/baja
   * Dar de baja estudiante (soft delete)
   */
  static async darDeBaja(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await StudentService.darDeBaja(id);

      res.status(200).json({
        success: true,
        message: 'Estudiante dado de baja exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/students/:id/permanent
   * Eliminar estudiante permanentemente (hard delete)
   */
  static async deletePermanently(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await StudentService.deletePermanently(id);

      res.status(200).json({
        success: true,
        message: 'Estudiante eliminado permanentemente de la base de datos',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/students/:id
   * Eliminar estudiante (soft delete) - mantener compatibilidad
   */
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await StudentService.delete(id);

      res.status(200).json({
        success: true,
        message: 'Estudiante dado de baja exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/generate-matricula
   * Generar nueva matrícula
   */
  static async generateMatricula(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const matricula = await StudentService.generateMatricula();

      res.status(200).json({
        success: true,
        data: { matricula },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/students/search?q=query
   * Buscar estudiantes
   */
  static async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query.q as string;

      if (!query || query.length < 2) {
        res.status(400).json({
          success: false,
          message: 'La búsqueda debe tener al menos 2 caracteres',
        });
        return;
      }

      const estudiantes = await StudentService.search(query);

      res.status(200).json({
        success: true,
        data: estudiantes,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default StudentController;


