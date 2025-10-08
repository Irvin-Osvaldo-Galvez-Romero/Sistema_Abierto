/**
 * Middleware de validación
 * Validación de datos de entrada usando Joi
 */

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '../utils/errors';

export interface ValidationSchema {
  body?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
}

/**
 * Middleware de validación usando Joi
 */
export const validate = (schema: ValidationSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const validationOptions = {
        abortEarly: false, // Retornar todos los errores
        stripUnknown: true, // Remover campos no definidos
        errors: {
          wrap: {
            label: '', // No incluir el nombre del campo en ""
          },
        },
      };

      // Validar body
      if (schema.body) {
        const { error, value } = schema.body.validate(req.body, validationOptions);
        if (error) {
          const messages = error.details.map(detail => detail.message).join(', ');
          throw new ValidationError(messages);
        }
        req.body = value;
      }

      // Validar params
      if (schema.params) {
        const { error, value } = schema.params.validate(req.params, validationOptions);
        if (error) {
          const messages = error.details.map(detail => detail.message).join(', ');
          throw new ValidationError(messages);
        }
        req.params = value;
      }

      // Validar query
      if (schema.query) {
        const { error, value } = schema.query.validate(req.query, validationOptions);
        if (error) {
          const messages = error.details.map(detail => detail.message).join(', ');
          throw new ValidationError(messages);
        }
        req.query = value;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

