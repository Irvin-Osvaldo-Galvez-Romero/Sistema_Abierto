/**
 * Controlador de Cambio de Contraseña
 * Maneja el cambio de contraseña en primer login
 */

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { hashPassword, verifyPassword } from '../utils/crypto';
import { AuthenticationError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';

export class PasswordController {
  /**
   * POST /api/password/change-first-login
   * Cambiar contraseña en primer login
   */
  static async changeFirstLogin(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('No autenticado');
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new ValidationError('Contraseña actual y nueva contraseña son requeridas');
      }

      if (newPassword.length < 8) {
        throw new ValidationError('La nueva contraseña debe tener al menos 8 caracteres');
      }

      // Buscar usuario
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.user.userId },
      });

      if (!usuario) {
        throw new AuthenticationError('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isValidPassword = await verifyPassword(currentPassword, usuario.password);
      if (!isValidPassword) {
        throw new AuthenticationError('Contraseña actual incorrecta');
      }

      // Verificar que la nueva contraseña sea diferente
      const isSamePassword = await verifyPassword(newPassword, usuario.password);
      if (isSamePassword) {
        throw new ValidationError('La nueva contraseña debe ser diferente a la actual');
      }

      // Hashear nueva contraseña
      const hashedPassword = await hashPassword(newPassword);

      // Actualizar contraseña y marcar que ya no es primer login
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          password: hashedPassword,
          primerLogin: false,
          updatedAt: new Date(),
        },
      });

      // Registrar actividad
      await prisma.actividadUsuario.create({
        data: {
          usuarioId: usuario.id,
          accion: 'CAMBIO_CONTRASEÑA',
          descripcion: 'Cambio de contraseña en primer login',
        },
      });

      logger.info(`🔐 Usuario cambió contraseña en primer login: ${usuario.email}`);

      res.status(200).json({
        success: true,
        message: 'Contraseña cambiada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/password/change
   * Cambiar contraseña (login normal)
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new AuthenticationError('No autenticado');
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new ValidationError('Contraseña actual y nueva contraseña son requeridas');
      }

      if (newPassword.length < 8) {
        throw new ValidationError('La nueva contraseña debe tener al menos 8 caracteres');
      }

      // Buscar usuario
      const usuario = await prisma.usuario.findUnique({
        where: { id: req.user.userId },
      });

      if (!usuario) {
        throw new AuthenticationError('Usuario no encontrado');
      }

      // Verificar contraseña actual
      const isValidPassword = await verifyPassword(currentPassword, usuario.password);
      if (!isValidPassword) {
        throw new AuthenticationError('Contraseña actual incorrecta');
      }

      // Verificar que la nueva contraseña sea diferente
      const isSamePassword = await verifyPassword(newPassword, usuario.password);
      if (isSamePassword) {
        throw new ValidationError('La nueva contraseña debe ser diferente a la actual');
      }

      // Hashear nueva contraseña
      const hashedPassword = await hashPassword(newPassword);

      // Actualizar contraseña
      await prisma.usuario.update({
        where: { id: usuario.id },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });

      // Registrar actividad
      await prisma.actividadUsuario.create({
        data: {
          usuarioId: usuario.id,
          accion: 'CAMBIO_CONTRASEÑA',
          descripcion: 'Cambio de contraseña',
        },
      });

      logger.info(`🔐 Usuario cambió contraseña: ${usuario.email}`);

      res.status(200).json({
        success: true,
        message: 'Contraseña cambiada exitosamente',
      });
    } catch (error) {
      next(error);
    }
  }
}

