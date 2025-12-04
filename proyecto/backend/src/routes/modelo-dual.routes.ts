/**
 * Rutas de Modelo Dual
 */

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Rol } from '@prisma/client';
import { upload } from '../middleware/upload.middleware';
import { ModeloDualController } from '../controllers/modelo-dual.controller';

const router = Router();

router.use(authenticate);

// Estudiante
router.post(
  '/',
  authorize(Rol.ESTUDIANTE),
  upload.single('archivo'),
  ModeloDualController.subirPrueba
);

router.get(
  '/mis',
  authorize(Rol.ESTUDIANTE),
  ModeloDualController.getMisPruebas
);

// Administrador
router.get(
  '/',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  ModeloDualController.listar
);

router.patch(
  '/:id/revision',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  upload.single('archivo'),
  ModeloDualController.revisar
);

// Descarga para estudiantes/admin
router.get(
  '/:id/archivo',
  ModeloDualController.descargarArchivo
);

// Formatos (público para estudiantes, admin puede crear)
router.get(
  '/formatos',
  ModeloDualController.obtenerFormatos
);

router.post(
  '/formatos',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  upload.single('archivo'),
  ModeloDualController.crearFormato
);

// Convenios (público para estudiantes, admin puede crear)
router.get(
  '/convenios',
  ModeloDualController.obtenerConvenios
);

router.post(
  '/convenios',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  ModeloDualController.crearConvenio
);

router.post(
  '/convenios/importar',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  upload.single('archivo'),
  ModeloDualController.importarConvenios
);

// Proceso del estudiante
router.post(
  '/inscribir',
  authorize(Rol.ESTUDIANTE),
  ModeloDualController.inscribirEstudiante
);

router.get(
  '/mi-proceso',
  authorize(Rol.ESTUDIANTE),
  ModeloDualController.getMiProceso
);

// Listado de estudiantes (admin)
router.get(
  '/estudiantes',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  ModeloDualController.listarEstudiantes
);

export default router;

