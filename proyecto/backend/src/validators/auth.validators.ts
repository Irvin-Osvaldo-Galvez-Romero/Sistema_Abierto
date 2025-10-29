/**
 * Validadores de Autenticación
 * Esquemas Joi para validación de datos de autenticación
 */

import Joi from 'joi';
import { Rol } from '@prisma/client';


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
 * Validador para solicitar restablecimiento de contraseña
 */
export const forgotPasswordSchema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.email': 'El correo electrónico debe ser válido',
        'any.required': 'El correo electrónico es requerido',
      }),
  }),
};

/**
 * Validador para restablecer contraseña
 */
export const resetPasswordSchema = {
  body: Joi.object({
    token: Joi.string()
      .required()
      .messages({
        'any.required': 'El token es requerido',
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


