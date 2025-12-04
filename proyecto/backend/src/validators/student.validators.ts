/**
 * Validadores de Estudiantes
 * Esquemas Joi para validación de datos de estudiantes
 */

import Joi from 'joi';
import { EstatusEstudiante } from '@prisma/client';

/**
 * Validador para crear estudiante
 */
export const createStudentSchema = {
  body: Joi.object({
    usuarioId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': 'El ID de usuario debe ser un UUID válido',
        'any.required': 'El ID de usuario es requerido',
      }),
    
    matricula: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        'string.pattern.base': 'La matrícula debe ser de 10 dígitos',
        'any.required': 'La matrícula es requerida',
      }),
    
    fechaNacimiento: Joi.date()
      .max('now')
      .optional()
      .allow(null)
      .messages({
        'date.max': 'La fecha de nacimiento debe ser anterior a hoy',
      }),
    
    curp: Joi.string()
      .pattern(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/)
      .optional()
      .allow('')
      .messages({
        'string.pattern.base': 'El CURP no tiene un formato válido',
      }),
    
    nss: Joi.string()
      .pattern(/^[0-9]{11}$/)
      .optional()
      .allow('')
      .messages({
        'string.pattern.base': 'El NSS debe ser de 11 dígitos',
      }),
    
    direccion: Joi.string()
      .max(200)
      .optional()
      .allow(''),
    
    ciudad: Joi.string()
      .max(100)
      .optional()
      .allow(''),
    
    estado: Joi.string()
      .max(100)
      .optional()
      .allow(''),
    
    codigoPostal: Joi.string()
      .pattern(/^[0-9]{5}$/)
      .optional()
      .allow('')
      .messages({
        'string.pattern.base': 'El código postal debe ser de 5 dígitos',
      }),
    
    tutorNombre: Joi.string()
      .max(200)
      .optional()
      .allow(''),
    
    tutorTelefono: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .allow('')
      .messages({
        'string.pattern.base': 'El teléfono del tutor debe ser de 10 dígitos',
      }),
    
    tutorEmail: Joi.string()
      .email()
      .optional()
      .allow('')
      .messages({
        'string.email': 'El correo del tutor debe ser válido',
      }),
    
    carreraId: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': 'El ID de carrera debe ser un UUID válido',
        'any.required': 'La carrera es requerida',
      }),
    
    estatus: Joi.string()
      .valid(...Object.values(EstatusEstudiante))
      .optional(),
  }),
};

/**
 * Validador para actualizar estudiante
 */
export const updateStudentSchema = {
  params: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': 'El ID debe ser un UUID válido',
        'any.required': 'El ID es requerido',
      }),
  }),
  
  body: Joi.object({
    // Campos del Usuario
    nombre: Joi.string()
      .min(2)
      .max(100)
      .optional(),
    
    apellidoPaterno: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .allow(''),
    
    apellidoMaterno: Joi.string()
      .min(2)
      .max(100)
      .optional()
      .allow(''),
    
    email: Joi.string()
      .email()
      .optional(),
    
    telefono: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .allow(''),
    
    // Campos del Estudiante
    matricula: Joi.string()
      .min(5)
      .max(20)
      .optional(),
    
    fechaNacimiento: Joi.date()
      .max('now')
      .optional(),
    
    curp: Joi.string()
      .pattern(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/)
      .optional()
      .allow(''),
    
    nss: Joi.string()
      .pattern(/^[0-9]{11}$/)
      .optional()
      .allow(''),
    
    direccion: Joi.string()
      .max(200)
      .optional()
      .allow(''),
    
    ciudad: Joi.string()
      .max(100)
      .optional()
      .allow(''),
    
    estado: Joi.string()
      .max(100)
      .optional()
      .allow(''),
    
    codigoPostal: Joi.string()
      .pattern(/^[0-9]{5}$/)
      .optional()
      .allow(''),
    
    tutorNombre: Joi.string()
      .max(200)
      .optional()
      .allow(''),
    
    tutorTelefono: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional()
      .allow(''),
    
    tutorEmail: Joi.string()
      .email()
      .optional()
      .allow(''),
    
    estatus: Joi.string()
      .valid(...Object.values(EstatusEstudiante))
      .optional(),
    
    carreraId: Joi.string()
      .uuid()
      .optional(),
  }).min(1),
};

/**
 * Validador para obtener estudiante por ID
 */
export const getStudentByIdSchema = {
  params: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.uuid': 'El ID debe ser un UUID válido',
        'any.required': 'El ID es requerido',
      }),
  }),
};

/**
 * Validador para obtener estudiante por matrícula
 */
export const getStudentByMatriculaSchema = {
  params: Joi.object({
    matricula: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        'string.pattern.base': 'La matrícula debe ser de 10 dígitos',
        'any.required': 'La matrícula es requerida',
      }),
  }),
};

/**
 * Validador para búsqueda de estudiantes
 */
export const searchStudentsSchema = {
  query: Joi.object({
    q: Joi.string()
      .min(2)
      .required()
      .messages({
        'string.min': 'La búsqueda debe tener al menos 2 caracteres',
        'any.required': 'El parámetro de búsqueda es requerido',
      }),
  }),
};

/**
 * Validador para paginación
 */
export const paginationSchema = {
  query: Joi.object({
    page: Joi.number()
      .integer()
      .min(1)
      .optional()
      .default(1),
    
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .optional()
      .default(10),
    
    estatus: Joi.string()
      .valid(...Object.values(EstatusEstudiante))
      .optional(),
  }),
};


