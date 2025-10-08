/**
 * Validadores de Autenticación
 * Esquemas Joi para validación de datos de autenticación
 */

import Joi from 'joi';
import { Rol } from '@prisma/client';

/**
 * Validador para registro de usuario
 */
export const registerSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El correo electrónico debe ser válido',
        'any.required': 'El correo electrónico es requerido',
      }),
    
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .required()
      .messages({
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
        'any.required': 'La contraseña es requerida',
      }),
    
    nombre: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El nombre debe tener al menos 2 caracteres',
        'string.max': 'El nombre no puede exceder 100 caracteres',
        'any.required': 'El nombre es requerido',
      }),
    
    apellidoPaterno: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El apellido paterno debe tener al menos 2 caracteres',
        'string.max': 'El apellido paterno no puede exceder 100 caracteres',
        'any.required': 'El apellido paterno es requerido',
      }),
    
    apellidoMaterno: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.min': 'El apellido materno debe tener al menos 2 caracteres',
        'string.max': 'El apellido materno no puede exceder 100 caracteres',
        'any.required': 'El apellido materno es requerido',
      }),
    
    telefono: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .required()
      .messages({
        'string.pattern.base': 'El teléfono debe ser un número de 10 dígitos',
        'any.required': 'El teléfono es requerido',
      }),
    
    rol: Joi.string()
      .valid(...Object.values(Rol))
      .optional()
      .messages({
        'any.only': 'El rol debe ser uno de los valores permitidos',
      }),
  }),
};

/**
 * Validador para inicio de sesión
 */
export const loginSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El correo electrónico debe ser válido',
        'any.required': 'El correo electrónico es requerido',
      }),
    
    password: Joi.string()
      .required()
      .messages({
        'any.required': 'La contraseña es requerida',
      }),
  }),
};

/**
 * Validador para renovar token
 */
export const refreshTokenSchema = {
  body: Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': 'El refresh token es requerido',
      }),
  }),
};

/**
 * Validador para cerrar sesión
 */
export const logoutSchema = {
  body: Joi.object({
    refreshToken: Joi.string()
      .required()
      .messages({
        'any.required': 'El refresh token es requerido',
      }),
  }),
};


