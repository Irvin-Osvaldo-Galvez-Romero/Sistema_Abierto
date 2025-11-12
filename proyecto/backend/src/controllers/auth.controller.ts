/**
 * Controlador de Autenticación
 * Maneja las peticiones HTTP relacionadas con autenticación
 */

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import logger from '../utils/logger';

export class AuthController {

  /**
   * POST /api/auth/login
   * Iniciar sesión
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ipAddress = req.ip || req.socket.remoteAddress;
      const userAgent = req.headers['user-agent'];

      const result = await AuthService.login(req.body, ipAddress, userAgent);

      res.status(200).json({
        success: true,
        message: 'Inicio de sesión exitoso',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   * Renovar token de acceso
   */
  static async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token es requerido',
        });
        return;
      }

      const result = await AuthService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token renovado exitosamente',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   * Cerrar sesión
   */
  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token es requerido',
        });
        return;
      }

      await AuthService.logout(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/forgot-password
   * Solicitar restablecimiento de contraseña
   */
  static async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      await AuthService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   * Restablecer contraseña con token
   */
  static async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, password } = req.body;

      await AuthService.resetPassword(token, password);

      res.status(200).json({
        success: true,
        message: 'Contraseña restablecida exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/profile
   * Obtener perfil del usuario autenticado
   */
  static async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      const profile = await AuthService.getProfile(req.user.userId);

      // Remover contraseña del response
      const { password, ...profileWithoutPassword } = profile;

      res.status(200).json({
        success: true,
        data: profileWithoutPassword,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   * Obtener información básica del usuario autenticado
   */
  static async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'No autenticado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/send-verification-code
   * Enviar código de verificación por correo
   */
  static async sendVerificationCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email } = req.body;

      await AuthService.sendVerificationCode(email);

      res.status(200).json({
        success: true,
        message: 'Si el correo está registrado, recibirás un código de verificación',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/verify-code
   * Verificar código de verificación
   */
  static async verifyCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, code } = req.body;

      const result = await AuthService.verifyCode(email, code);

      if (!result.valid) {
        res.status(400).json({
          success: false,
          message: 'Código de verificación inválido o expirado',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Código verificado exitosamente',
        data: {
          token: result.token,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password-with-code
   * Restablecer contraseña con código de verificación
   */
  static async resetPasswordWithCode(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, code, password } = req.body;

      await AuthService.resetPasswordWithCode(email, code, password);

      res.status(200).json({
        success: true,
        message: 'Contraseña restablecida exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

