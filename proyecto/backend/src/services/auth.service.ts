/**
 * Servicio de Autenticación
 * Lógica de negocio para registro, login y gestión de tokens
 */

import { Usuario, Rol, TipoToken } from '@prisma/client';
import { prisma } from '../config/database';
import { hashPassword, verifyPassword, generateRandomToken } from '../utils/crypto';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { 
  AuthenticationError, 
  ConflictError, 
  ValidationError,
  TooManyRequestsError 
} from '../utils/errors';
import { config } from '../config/env';
import logger from '../utils/logger';

interface RegisterData {
  email: string;
  password: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  telefono?: string;
  rol?: Rol;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    nombre: string;
    rol: Rol;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthService {
  /**
   * Registrar nuevo usuario
   */
  static async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // Verificar si el email ya existe
      const existingUser = await prisma.usuario.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        throw new ConflictError('El correo electrónico ya está registrado');
      }

      // Hashear contraseña
      const hashedPassword = await hashPassword(data.password);

      // Crear usuario
      const usuario = await prisma.usuario.create({
        data: {
          email: data.email,
          password: hashedPassword,
          nombre: data.nombre,
          apellidoPaterno: data.apellidoPaterno,
          apellidoMaterno: data.apellidoMaterno,
          telefono: data.telefono,
          rol: data.rol || Rol.ESTUDIANTE,
        },
      });

      // Generar tokens
      const accessToken = generateAccessToken({
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      });

      const refreshToken = generateRefreshToken({
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      });

      // Guardar refresh token en base de datos
      await prisma.tokenSesion.create({
        data: {
          token: refreshToken,
          tipo: TipoToken.REFRESH,
          usuarioId: usuario.id,
          expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 días
        },
      });

      // Registrar actividad
      await this.logActivity(usuario.id, 'REGISTRO', 'Usuario registrado exitosamente');

      logger.info(`Usuario registrado: ${usuario.email}`);

      return {
        user: {
          id: usuario.id,
          email: usuario.email,
          nombre: `${usuario.nombre} ${usuario.apellidoPaterno}`,
          rol: usuario.rol,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      logger.error('Error en registro:', error);
      throw error;
    }
  }

  /**
   * Iniciar sesión
   */
  static async login(data: LoginData, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    try {
      // Buscar usuario
      const usuario = await prisma.usuario.findUnique({
        where: { email: data.email },
      });

      if (!usuario) {
        throw new AuthenticationError('Credenciales inválidas');
      }

      // Verificar si la cuenta está activa
      if (!usuario.activo) {
        throw new AuthenticationError('Cuenta desactivada');
      }

      // Verificar si está bloqueado
      if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
        const minutosRestantes = Math.ceil(
          (usuario.bloqueadoHasta.getTime() - Date.now()) / 60000
        );
        throw new TooManyRequestsError(
          `Cuenta bloqueada. Intenta de nuevo en ${minutosRestantes} minutos`
        );
      }

      // Verificar contraseña
      const isPasswordValid = await verifyPassword(data.password, usuario.password);

      if (!isPasswordValid) {
        // Incrementar intentos fallidos
        const nuevoIntentos = usuario.intentosFallidos + 1;
        const updateData: any = {
          intentosFallidos: nuevoIntentos,
        };

        // Bloquear si alcanza el máximo de intentos
        if (nuevoIntentos >= config.security.maxLoginAttempts) {
          updateData.bloqueadoHasta = new Date(
            Date.now() + config.security.lockoutDuration * 1000
          );
          logger.warn(`Usuario bloqueado por múltiples intentos: ${usuario.email}`);
        }

        await prisma.usuario.update({
          where: { id: usuario.id },
          data: updateData,
        });

        throw new AuthenticationError('Credenciales inválidas');
      }

      // Resetear intentos fallidos
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          intentosFallidos: 0,
          bloqueadoHasta: null,
          ultimoAcceso: new Date(),
        },
      });

      // Generar tokens
      const accessToken = generateAccessToken({
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      });

      const refreshToken = generateRefreshToken({
        userId: usuario.id,
        email: usuario.email,
        rol: usuario.rol,
      });

      // Guardar refresh token
      await prisma.tokenSesion.create({
        data: {
          token: refreshToken,
          tipo: TipoToken.REFRESH,
          usuarioId: usuario.id,
          expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          ipAddress,
          userAgent,
        },
      });

      // Registrar actividad
      await this.logActivity(
        usuario.id,
        'LOGIN',
        'Inicio de sesión exitoso',
        ipAddress,
        userAgent
      );

      logger.info(`Login exitoso: ${usuario.email}`);

      return {
        user: {
          id: usuario.id,
          email: usuario.email,
          nombre: `${usuario.nombre} ${usuario.apellidoPaterno}`,
          rol: usuario.rol,
        },
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      logger.error('Error en login:', error);
      throw error;
    }
  }

  /**
   * Renovar token de acceso
   */
  static async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      // Buscar token en base de datos
      const tokenRecord = await prisma.tokenSesion.findUnique({
        where: { token: refreshToken },
        include: { usuario: true },
      });

      if (!tokenRecord) {
        throw new AuthenticationError('Token inválido');
      }

      // Verificar si el token está revocado
      if (tokenRecord.revocado) {
        throw new AuthenticationError('Token revocado');
      }

      // Verificar si el token ha expirado
      if (tokenRecord.expiraEn < new Date()) {
        throw new AuthenticationError('Token expirado');
      }

      // Generar nuevo access token
      const accessToken = generateAccessToken({
        userId: tokenRecord.usuario.id,
        email: tokenRecord.usuario.email,
        rol: tokenRecord.usuario.rol,
      });

      logger.info(`Token renovado para usuario: ${tokenRecord.usuario.email}`);

      return { accessToken };
    } catch (error) {
      logger.error('Error al renovar token:', error);
      throw error;
    }
  }

  /**
   * Cerrar sesión
   */
  static async logout(refreshToken: string): Promise<void> {
    try {
      // Revocar refresh token
      await prisma.tokenSesion.updateMany({
        where: { token: refreshToken },
        data: { revocado: true },
      });

      logger.info('Sesión cerrada exitosamente');
    } catch (error) {
      logger.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  /**
   * Obtener perfil del usuario
   */
  static async getProfile(userId: string): Promise<Usuario> {
    try {
      const usuario = await prisma.usuario.findUnique({
        where: { id: userId },
        include: {
          estudiante: true,
          profesor: true,
          administrador: true,
        },
      });

      if (!usuario) {
        throw new AuthenticationError('Usuario no encontrado');
      }

      return usuario;
    } catch (error) {
      logger.error('Error al obtener perfil:', error);
      throw error;
    }
  }

  /**
   * Registrar actividad del usuario
   */
  private static async logActivity(
    usuarioId: string,
    accion: string,
    descripcion?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await prisma.actividadUsuario.create({
        data: {
          usuarioId,
          accion,
          descripcion,
          ipAddress,
          userAgent,
        },
      });
    } catch (error) {
      logger.error('Error al registrar actividad:', error);
      // No lanzar error, solo logear
    }
  }
}


