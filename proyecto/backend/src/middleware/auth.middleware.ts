/**
 * Middleware de autenticación
 * Verifica JWT y adjunta usuario a la request
 */

import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { AuthenticationError, AuthorizationError } from '../utils/errors';
import { Rol } from '@prisma/client';

// Extender Request de Express para incluir usuario
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware para verificar autenticación
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener token del header Authorization o query string
    const authHeader = req.headers.authorization;
    const tokenFromQuery = req.query.token as string;
    
    let token: string | undefined;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else if (tokenFromQuery) {
      token = tokenFromQuery;
    }
    
    if (!token) {
      throw new AuthenticationError('Token no proporcionado');
    }

    // Verificar y decodificar token
    const decoded = verifyToken(token);

    // Adjuntar usuario a la request
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      next(error);
    } else {
      next(new AuthenticationError('Token inválido o expirado'));
    }
  }
};

/**
 * Middleware para verificar roles específicos
 */
export const authorize = (...rolesPermitidos: Rol[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new AuthenticationError('Usuario no autenticado');
      }

      if (!rolesPermitidos.includes(req.user.rol as Rol)) {
        throw new AuthorizationError('No tienes permisos para realizar esta acción');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Middleware opcional de autenticación (no falla si no hay token)
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const decoded = verifyToken(token);
      req.user = decoded;
    }

    next();
  } catch (error) {
    // En caso de error, simplemente continuar sin usuario
    next();
  }
};

