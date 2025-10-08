/**
 * Controlador de Upload
 * Maneja la subida de archivos de estudiantes
 */

import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service';
import { NotificacionService } from '../services/notificacion.service';
import { TipoDocumento } from '@prisma/client';
import { ValidationError } from '../utils/errors';

export class UploadController {
  /**
   * POST /api/upload
   * Subir documento del estudiante
   */
  static async uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new ValidationError('No se proporcionó ningún archivo');
      }

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

      const tipo = req.body.tipo as TipoDocumento;

      if (!tipo || !Object.values(TipoDocumento).includes(tipo)) {
        throw new ValidationError('Tipo de documento inválido. Debe ser: KARDEX, FICHA_REINSCRIPCION o COMPROBANTE_PAGO');
      }

      const result = await UploadService.uploadDocument({
        estudianteId: estudiante.id,
        tipo,
        file: req.file,
      });

      res.status(201).json({
        success: true,
        message: result.message,
        data: result.documento,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/upload/my-documents
   * Obtener documentos del estudiante autenticado
   */
  static async getMyDocuments(req: Request, res: Response, next: NextFunction): Promise<void> {
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

      const result = await UploadService.getStudentDocuments(estudiante.id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/upload/:id/review
   * Aprobar o rechazar documento (Admin)
   */
  static async reviewDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { aprobado, motivoRechazo } = req.body;

      if (typeof aprobado !== 'boolean') {
        throw new ValidationError('El campo "aprobado" es requerido y debe ser boolean');
      }

      if (!aprobado && !motivoRechazo) {
        throw new ValidationError('Debes proporcionar un motivo de rechazo');
      }

      await UploadService.reviewDocument(
        id,
        aprobado,
        req.user?.userId || 'admin',
        motivoRechazo
      );

      res.status(200).json({
        success: true,
        message: aprobado ? 'Documento aprobado exitosamente' : 'Documento rechazado',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/upload/download/:id
   * Descargar documento
   */
  static async downloadDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const documento = await prisma.documento.findUnique({
        where: { id },
      });

      if (!documento) {
        res.status(404).send('Documento no encontrado');
        return;
      }

      const path = require('path');
      const fs = require('fs');
      const filePath = path.join(process.cwd(), documento.rutaArchivo);

      if (!fs.existsSync(filePath)) {
        res.status(404).send('Archivo no encontrado');
        return;
      }

      const extension = documento.mimeType.split('/')[1] || 'pdf';
      const filename = `${documento.folio}_${documento.tipo}.${extension}`;
      
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Type', documento.mimeType);
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      res.status(500).send('Error al descargar el documento');
    }
  }

  /**
   * GET /api/upload/view/:id
   * Ver documento (previsualización)
   */
  static async viewDocument(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      const documento = await prisma.documento.findUnique({
        where: { id },
      });

      if (!documento) {
        res.status(404).send('Documento no encontrado');
        return;
      }

      const path = require('path');
      const fs = require('fs');
      const filePath = path.join(process.cwd(), documento.rutaArchivo);

      if (!fs.existsSync(filePath)) {
        res.status(404).send('Archivo no encontrado');
        return;
      }

      res.setHeader('Content-Type', documento.mimeType);
      res.setHeader('Content-Disposition', 'inline');
      fs.createReadStream(filePath).pipe(res);
    } catch (error) {
      res.status(500).send('Error al cargar el documento');
    }
  }
}

// Importar prisma
import { prisma } from '../config/database';

export default UploadController;

