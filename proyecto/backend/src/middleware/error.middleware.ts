/**
 * Middleware de manejo de errores
 * Captura y formatea todos los errores de la aplicación
 */

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import { config } from '../config/env';
import { Prisma } from '@prisma/client';

/**
 * Manejar errores de Prisma
 */
const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError): AppError => {
  switch (error.code) {
    case 'P2002':
      return new AppError('Ya existe un registro con estos datos únicos', 409);
    case 'P2025':
      return new AppError('Registro no encontrado', 404);
    case 'P2003':
      return new AppError('Violación de clave foránea', 400);
    case 'P2014':
      return new AppError('Violación de restricción', 400);
    default:
      return new AppError('Error de base de datos', 500);
  }
};

/**
 * Middleware de manejo de errores
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let error = err;

  // Convertir errores de Prisma a AppError
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    error = handlePrismaError(err);
  }

  // Si no es un AppError, crear uno genérico
  if (!(error instanceof AppError)) {
    error = new AppError(
      config.isDevelopment ? err.message : 'Error interno del servidor',
      500,
      false
    );
  }

  const appError = error as AppError;

  // Log del error
  if (!appError.isOperational || appError.statusCode >= 500) {
    logger.error('Error:', {
      message: appError.message,
      stack: appError.stack,
      url: req.url,
      method: req.method,
      ip: req.ip,
      userId: req.user?.userId,
    });
  }

  // Respuesta al cliente
  const errorResponse: any = {
    success: false,
    error: {
      message: appError.message,
      statusCode: appError.statusCode,
    },
  };

  // En desarrollo, incluir stack trace
  if (config.isDevelopment) {
    errorResponse.error.stack = appError.stack;
  }

  res.status(appError.statusCode).json(errorResponse);
};

/**
 * Middleware para rutas no encontradas
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: {
      message: `Ruta ${req.originalUrl} no encontrada`,
      statusCode: 404,
    },
  });
};

