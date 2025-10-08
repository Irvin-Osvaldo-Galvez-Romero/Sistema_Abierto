/**
 * Controlador de Documentos
 */

import { Request, Response, NextFunction } from 'express';
import { DocumentoService } from '../services/documento.service';

export class DocumentoController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const estudianteId = req.query.estudianteId as string | undefined;

      const result = await DocumentoService.findAll(page, limit, estudianteId);

      res.status(200).json({
        success: true,
        data: result.documentos,
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

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const documento = await DocumentoService.findById(req.params.id);
      res.status(200).json({ success: true, data: documento });
    } catch (error) {
      next(error);
    }
  }

  static async updateEstatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { estatus } = req.body;
      const documento = await DocumentoService.updateEstatus(req.params.id, estatus);
      res.status(200).json({ success: true, data: documento });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await DocumentoService.delete(req.params.id);
      res.status(200).json({ success: true, message: 'Documento anulado' });
    } catch (error) {
      next(error);
    }
  }
}

export default DocumentoController;


