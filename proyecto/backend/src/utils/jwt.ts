/**
 * Utilidades de JWT
 * Funciones para generación y verificación de tokens JWT
 */

import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface JwtPayload {
  userId: string;
  email: string;
  rol: string;
}

/**
 * Generar token de acceso JWT
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn as string,
    issuer: 'sistema-universitario',
    audience: 'api',
  } as jwt.SignOptions);
};

/**
 * Generar token de refresh JWT
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshExpiresIn as string,
    issuer: 'sistema-universitario',
    audience: 'api',
  } as jwt.SignOptions);
};

/**
 * Verificar y decodificar token JWT
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret, {
      issuer: 'sistema-universitario',
      audience: 'api',
    }) as JwtPayload;
    
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token expirado');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Token inválido');
    }
    throw new Error('Error al verificar token');
  }
};

/**
 * Decodificar token sin verificar (útil para debugging)
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Verificar si un token ha expirado
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as any;
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};

