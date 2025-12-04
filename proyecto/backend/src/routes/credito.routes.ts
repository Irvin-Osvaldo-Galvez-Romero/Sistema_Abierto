/**
 * Rutas de Créditos Complementarios
 */

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Rol } from '@prisma/client';
import { upload } from '../middleware/upload.middleware';
import { CreditoController } from '../controllers/credito.controller';

const router = Router();

router.use(authenticate);

// Estudiante
router.post(
  '/',
  authorize(Rol.ESTUDIANTE),
  upload.single('archivo'),
  CreditoController.uploadCredito
);

router.get(
  '/mis',
  authorize(Rol.ESTUDIANTE),
  CreditoController.getMisCreditos
);

router.post(
  '/:id/archivo-adicional',
  authorize(Rol.ESTUDIANTE),
  upload.single('archivo'),
  CreditoController.agregarArchivoAdicional
);

// Administrador
router.get(
  '/',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  CreditoController.listar
);

router.post(
  '/estudiante/:estudianteId/generar-acta',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  CreditoController.generarActa
);

router.patch(
  '/:id/revision',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  upload.single('archivo'),
  CreditoController.revisar
);

// Descarga para estudiantes/admin
router.get(
  '/:id/archivo',
  CreditoController.descargarArchivo
);

export default router;

