/**
 * Controlador de Materias
 */

import { Request, Response, NextFunction } from 'express';
import { MateriaService } from '../services/materia.service';

export class MateriaController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const materia = await MateriaService.create(req.body);
      res.status(201).json({ success: true, data: materia });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const carreraId = req.query.carreraId as string | undefined;
      const materias = await MateriaService.findAll(carreraId);
      res.status(200).json({ success: true, data: materias });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const materia = await MateriaService.findById(req.params.id);
      res.status(200).json({ success: true, data: materia });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const materia = await MateriaService.update(req.params.id, req.body);
      res.status(200).json({ success: true, data: materia });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await MateriaService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Materia eliminada' });
    } catch (error) {
      next(error);
    }
  }
}

export default MateriaController;


