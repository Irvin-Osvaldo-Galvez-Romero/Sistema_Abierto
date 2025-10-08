/**
 * Rutas de Upload
 * Endpoints para subir y gestionar documentos de estudiantes
 */

import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { Rol } from '@prisma/client';

const router = Router();

/**
 * @route   GET /api/upload/view/:id
 * @desc    Ver documento (previsualización)
 * @access  Private (Autenticado)
 */
router.get(
  '/view/:id',
  authenticate,
  UploadController.viewDocument
);

/**
 * @route   GET /api/upload/download/:id
 * @desc    Descargar documento
 * @access  Private (Autenticado)
 */
router.get(
  '/download/:id',
  authenticate,
  UploadController.downloadDocument
);

/**
 * @route   GET /api/upload/my-documents
 * @desc    Obtener mis documentos (Estudiante)
 * @access  Private (Estudiante)
 */
router.get(
  '/my-documents',
  authenticate,
  authorize(Rol.ESTUDIANTE),
  UploadController.getMyDocuments
);

/**
 * @route   POST /api/upload
 * @desc    Subir documento (Estudiante)
 * @access  Private (Estudiante)
 */
router.post(
  '/',
  authenticate,
  authorize(Rol.ESTUDIANTE),
  upload.single('archivo'),
  UploadController.uploadDocument
);

/**
 * @route   PATCH /api/upload/:id/review
 * @desc    Revisar documento (Admin)
 * @access  Private (Admin, Personal)
 */
router.patch(
  '/:id/review',
  authenticate,
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  UploadController.reviewDocument
);

export default router;

