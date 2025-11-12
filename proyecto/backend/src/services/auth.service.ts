/**
 * Servicio de Autenticación
 * Lógica de negocio para registro, login y gestión de tokens
 */

import { Usuario, Rol, TipoToken } from '@prisma/client';
import { prisma } from '../config/database';
import { hashPassword, verifyPassword, generateRandomToken, generateVerificationCode } from '../utils/crypto';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';
import { 
  AuthenticationError, 
  ConflictError, 
  ValidationError,
  TooManyRequestsError 
} from '../utils/errors';
import { config } from '../config/env';
import logger from '../utils/logger';
import { EmailService } from './email.service';


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
    primerLogin?: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export class AuthService {

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

      // Construir nombre completo
      const nombreCompleto = `${usuario.nombre} ${usuario.apellidoPaterno}${usuario.apellidoMaterno ? ' ' + usuario.apellidoMaterno : ''}`;

      return {
        user: {
          id: usuario.id,
          email: usuario.email,
          nombre: nombreCompleto.trim(),
          rol: usuario.rol,
          primerLogin: usuario.primerLogin,
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
   * Solicitar restablecimiento de contraseña
   */
  static async forgotPassword(email: string): Promise<void> {
    try {
      // Buscar usuario por email
      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        // Por seguridad, no revelamos si el email existe o no
        logger.info(`Solicitud de restablecimiento para email no registrado: ${email}`);
        return;
      }

      // Verificar si la cuenta está activa
      if (!usuario.activo) {
        logger.info(`Solicitud de restablecimiento para cuenta inactiva: ${email}`);
        return;
      }

      // Generar token de restablecimiento
      const resetToken = generateRandomToken(32);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

      // Guardar token en base de datos
      await prisma.tokenSesion.create({
        data: {
          token: resetToken,
          tipo: TipoToken.RESET_PASSWORD,
          usuarioId: usuario.id,
          expiraEn: expiresAt,
        },
      });

      // Enviar correo de restablecimiento
      try {
        await EmailService.sendPasswordReset({
          nombre: usuario.nombre,
          apellidoPaterno: usuario.apellidoPaterno,
          apellidoMaterno: usuario.apellidoMaterno || '',
          email: usuario.email,
          resetToken,
          rol: usuario.rol,
        });
        logger.info(`📧 Correo de restablecimiento enviado a: ${email}`);
      } catch (emailError) {
        // No fallar el proceso si falla el correo, solo registrar el error
        logger.warn(`⚠️ Error al enviar correo de restablecimiento a ${email}:`, emailError);
        // Continuar con el proceso aunque falle el correo
      }

      // Registrar actividad
      await this.logActivity(
        usuario.id,
        'FORGOT_PASSWORD',
        'Solicitud de restablecimiento de contraseña',
      );

      logger.info(`Solicitud de restablecimiento procesada para: ${email}`);
    } catch (error) {
      logger.error('Error en forgotPassword:', error);
      throw error;
    }
  }

  /**
   * Restablecer contraseña con token
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      // Buscar token en base de datos
      const tokenRecord = await prisma.tokenSesion.findUnique({
        where: { token },
        include: { usuario: true },
      });

      if (!tokenRecord) {
        throw new AuthenticationError('Token inválido');
      }

      // Verificar si el token está revocado
      if (tokenRecord.revocado) {
        throw new AuthenticationError('Token ya utilizado');
      }

      // Verificar si el token ha expirado
      if (tokenRecord.expiraEn < new Date()) {
        throw new AuthenticationError('Token expirado');
      }

      // Verificar que sea un token de restablecimiento
      if (tokenRecord.tipo !== TipoToken.RESET_PASSWORD) {
        throw new AuthenticationError('Token inválido');
      }

      // Verificar que la cuenta esté activa
      if (!tokenRecord.usuario.activo) {
        throw new AuthenticationError('Cuenta desactivada');
      }

      // Hashear nueva contraseña
      const hashedPassword = await hashPassword(newPassword);

      // Actualizar contraseña del usuario
      await prisma.usuario.update({
        where: { id: tokenRecord.usuario.id },
        data: {
          password: hashedPassword,
          primerLogin: false, // Ya no es primer login
        },
      });

      // Revocar token usado
      await prisma.tokenSesion.update({
        where: { id: tokenRecord.id },
        data: { revocado: true },
      });

      // Revocar todos los tokens de sesión del usuario
      await prisma.tokenSesion.updateMany({
        where: { 
          usuarioId: tokenRecord.usuario.id,
          tipo: TipoToken.REFRESH,
        },
        data: { revocado: true },
      });

      // Registrar actividad
      await this.logActivity(
        tokenRecord.usuario.id,
        'RESET_PASSWORD',
        'Contraseña restablecida exitosamente',
      );

      logger.info(`Contraseña restablecida para usuario: ${tokenRecord.usuario.email}`);
    } catch (error) {
      logger.error('Error en resetPassword:', error);
      throw error;
    }
  }

  /**
   * Enviar código de verificación para restablecer contraseña
   */
  static async sendVerificationCode(email: string): Promise<void> {
    try {
      // Buscar usuario por email
      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario) {
        // Por seguridad, no revelamos si el email existe o no
        logger.info(`Solicitud de código de verificación para email no registrado: ${email}`);
        return;
      }

      // Verificar si la cuenta está activa
      if (!usuario.activo) {
        logger.info(`Solicitud de código de verificación para cuenta inactiva: ${email}`);
        return;
      }

      // Generar código de verificación de 6 dígitos
      const verificationCode = generateVerificationCode(6);
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos

      // Revocar códigos anteriores del mismo tipo para este usuario
      await prisma.tokenSesion.updateMany({
        where: {
          usuarioId: usuario.id,
          tipo: TipoToken.VERIFICATION_CODE,
          revocado: false,
        },
        data: { revocado: true },
      });

      // Guardar código en base de datos (hasheado por seguridad)
      const hashedCode = await hashPassword(verificationCode);
      await prisma.tokenSesion.create({
        data: {
          token: hashedCode,
          tipo: TipoToken.VERIFICATION_CODE,
          usuarioId: usuario.id,
          expiraEn: expiresAt,
        },
      });

      // Enviar correo con el código
      await EmailService.sendVerificationCode({
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno || '',
        email: usuario.email,
        code: verificationCode,
        rol: usuario.rol,
      });
      logger.info(`📧 Código de verificación enviado a: ${email}`);

      // Registrar actividad
      await this.logActivity(
        usuario.id,
        'SEND_VERIFICATION_CODE',
        'Código de verificación enviado para restablecimiento de contraseña',
      );

      logger.info(`Código de verificación procesado para: ${email}`);
    } catch (error) {
      logger.error('Error en sendVerificationCode:', error);
      throw error;
    }
  }

  /**
   * Verificar código de verificación
   */
  static async verifyCode(email: string, code: string): Promise<{ valid: boolean; token?: string }> {
    try {
      // Buscar usuario por email
      const usuario = await prisma.usuario.findUnique({
        where: { email },
      });

      if (!usuario || !usuario.activo) {
        return { valid: false };
      }

      // Buscar códigos de verificación activos del usuario
      const activeCodes = await prisma.tokenSesion.findMany({
        where: {
          usuarioId: usuario.id,
          tipo: TipoToken.VERIFICATION_CODE,
          revocado: false,
          expiraEn: {
            gt: new Date(),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Verificar el código contra todos los códigos activos
      for (const codeRecord of activeCodes) {
        const isValid = await verifyPassword(code, codeRecord.token);
        if (isValid) {
          // Generar token temporal para el cambio de contraseña
          const resetToken = generateRandomToken(32);
          const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

          // Crear token de restablecimiento
          await prisma.tokenSesion.create({
            data: {
              token: resetToken,
              tipo: TipoToken.RESET_PASSWORD,
              usuarioId: usuario.id,
              expiraEn: expiresAt,
            },
          });

          // Revocar el código usado
          await prisma.tokenSesion.update({
            where: { id: codeRecord.id },
            data: { revocado: true },
          });

          // Registrar actividad
          await this.logActivity(
            usuario.id,
            'VERIFY_CODE',
            'Código de verificación validado exitosamente',
          );

          logger.info(`Código de verificación validado para usuario: ${email}`);

          return { valid: true, token: resetToken };
        }
      }

      // Si no se encontró un código válido
      logger.warn(`Intento de verificación con código inválido para: ${email}`);
      return { valid: false };
    } catch (error) {
      logger.error('Error en verifyCode:', error);
      throw error;
    }
  }

  /**
   * Restablecer contraseña con código de verificación
   */
  static async resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<void> {
    try {
      // Primero verificar el código
      const verification = await this.verifyCode(email, code);

      if (!verification.valid || !verification.token) {
        throw new AuthenticationError('Código de verificación inválido o expirado');
      }

      // Buscar el token de restablecimiento generado
      const tokenRecord = await prisma.tokenSesion.findUnique({
        where: { token: verification.token },
        include: { usuario: true },
      });

      if (!tokenRecord || tokenRecord.tipo !== TipoToken.RESET_PASSWORD) {
        throw new AuthenticationError('Token de restablecimiento inválido');
      }

      // Verificar que el token no haya expirado
      if (tokenRecord.expiraEn < new Date()) {
        throw new AuthenticationError('Token expirado');
      }

      // Verificar que la cuenta esté activa
      if (!tokenRecord.usuario.activo) {
        throw new AuthenticationError('Cuenta desactivada');
      }

      // Hashear nueva contraseña
      const hashedPassword = await hashPassword(newPassword);

      // Actualizar contraseña del usuario
      await prisma.usuario.update({
        where: { id: tokenRecord.usuario.id },
        data: {
          password: hashedPassword,
          primerLogin: false,
        },
      });

      // Revocar token usado
      await prisma.tokenSesion.update({
        where: { id: tokenRecord.id },
        data: { revocado: true },
      });

      // Revocar todos los tokens de sesión del usuario
      await prisma.tokenSesion.updateMany({
        where: {
          usuarioId: tokenRecord.usuario.id,
          tipo: TipoToken.REFRESH,
        },
        data: { revocado: true },
      });

      // Registrar actividad
      await this.logActivity(
        tokenRecord.usuario.id,
        'RESET_PASSWORD_WITH_CODE',
        'Contraseña restablecida exitosamente con código de verificación',
      );

      logger.info(`Contraseña restablecida con código para usuario: ${email}`);
    } catch (error) {
      logger.error('Error en resetPasswordWithCode:', error);
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


