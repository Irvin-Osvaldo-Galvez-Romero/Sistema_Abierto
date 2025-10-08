/**
 * Rutas de Estudiantes
 * Define los endpoints de gestión de estudiantes
 */

import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Rol } from '@prisma/client';
import {
  createStudentSchema,
  updateStudentSchema,
  getStudentByIdSchema,
  getStudentByMatriculaSchema,
  searchStudentsSchema,
  paginationSchema,
} from '../validators/student.validators';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

/**
 * @route   GET /api/students/my-profile
 * @desc    Obtener perfil del estudiante autenticado
 * @access  Private (Estudiante)
 */
router.get(
  '/my-profile',
  authorize(Rol.ESTUDIANTE),
  StudentController.getMyProfile
);

/**
 * @route   GET /api/students/generate-matricula
 * @desc    Generar nueva matrícula
 * @access  Private (Admin, Personal)
 */
router.get(
  '/generate-matricula',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  StudentController.generateMatricula
);

/**
 * @route   GET /api/students/search
 * @desc    Buscar estudiantes
 * @access  Private (Admin, Personal, Profesor)
 */
router.get(
  '/search',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO, Rol.PROFESOR),
  validate(searchStudentsSchema),
  StudentController.search
);

/**
 * @route   GET /api/students
 * @desc    Obtener lista de estudiantes
 * @access  Private (Admin, Personal, Profesor)
 */
router.get(
  '/',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO, Rol.PROFESOR),
  validate(paginationSchema),
  StudentController.getAll
);

/**
 * @route   POST /api/students
 * @desc    Crear nuevo estudiante
 * @access  Private (Admin, Personal)
 */
router.post(
  '/',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  validate(createStudentSchema),
  StudentController.create
);

/**
 * @route   GET /api/students/matricula/:matricula
 * @desc    Obtener estudiante por matrícula
 * @access  Private (Admin, Personal, Profesor)
 */
router.get(
  '/matricula/:matricula',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO, Rol.PROFESOR),
  validate(getStudentByMatriculaSchema),
  StudentController.getByMatricula
);

/**
 * @route   GET /api/students/:id
 * @desc    Obtener estudiante por ID
 * @access  Private (Admin, Personal, Profesor)
 */
router.get(
  '/:id',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO, Rol.PROFESOR),
  validate(getStudentByIdSchema),
  StudentController.getById
);

/**
 * @route   PUT /api/students/:id
 * @desc    Actualizar estudiante
 * @access  Private (Admin, Personal)
 */
router.put(
  '/:id',
  authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO),
  validate(updateStudentSchema),
  StudentController.update
);

/**
 * @route   DELETE /api/students/:id
 * @desc    Eliminar estudiante (soft delete)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  authorize(Rol.SUPER_ADMIN, Rol.ADMINISTRADOR),
  validate(getStudentByIdSchema),
  StudentController.delete
);

export default router;


