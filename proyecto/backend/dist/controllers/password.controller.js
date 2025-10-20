"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordController = void 0;
const database_1 = require("../config/database");
const crypto_1 = require("../utils/crypto");
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class PasswordController {
    static async changeFirstLogin(req, res, next) {
        try {
            if (!req.user) {
                throw new errors_1.AuthenticationError('No autenticado');
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                throw new errors_1.ValidationError('Contraseña actual y nueva contraseña son requeridas');
            }
            if (newPassword.length < 8) {
                throw new errors_1.ValidationError('La nueva contraseña debe tener al menos 8 caracteres');
            }
            const usuario = await database_1.prisma.usuario.findUnique({
                where: { id: req.user.userId },
            });
            if (!usuario) {
                throw new errors_1.AuthenticationError('Usuario no encontrado');
            }
            const isValidPassword = await (0, crypto_1.verifyPassword)(currentPassword, usuario.password);
            if (!isValidPassword) {
                throw new errors_1.AuthenticationError('Contraseña actual incorrecta');
            }
            const isSamePassword = await (0, crypto_1.verifyPassword)(newPassword, usuario.password);
            if (isSamePassword) {
                throw new errors_1.ValidationError('La nueva contraseña debe ser diferente a la actual');
            }
            const hashedPassword = await (0, crypto_1.hashPassword)(newPassword);
            await database_1.prisma.usuario.update({
                where: { id: usuario.id },
                data: {
                    password: hashedPassword,
                    primerLogin: false,
                    updatedAt: new Date(),
                },
            });
            await database_1.prisma.actividadUsuario.create({
                data: {
                    usuarioId: usuario.id,
                    accion: 'CAMBIO_CONTRASEÑA',
                    descripcion: 'Cambio de contraseña en primer login',
                },
            });
            logger_1.default.info(`🔐 Usuario cambió contraseña en primer login: ${usuario.email}`);
            res.status(200).json({
                success: true,
                message: 'Contraseña cambiada exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async changePassword(req, res, next) {
        try {
            if (!req.user) {
                throw new errors_1.AuthenticationError('No autenticado');
            }
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                throw new errors_1.ValidationError('Contraseña actual y nueva contraseña son requeridas');
            }
            if (newPassword.length < 8) {
                throw new errors_1.ValidationError('La nueva contraseña debe tener al menos 8 caracteres');
            }
            const usuario = await database_1.prisma.usuario.findUnique({
                where: { id: req.user.userId },
            });
            if (!usuario) {
                throw new errors_1.AuthenticationError('Usuario no encontrado');
            }
            const isValidPassword = await (0, crypto_1.verifyPassword)(currentPassword, usuario.password);
            if (!isValidPassword) {
                throw new errors_1.AuthenticationError('Contraseña actual incorrecta');
            }
            const isSamePassword = await (0, crypto_1.verifyPassword)(newPassword, usuario.password);
            if (isSamePassword) {
                throw new errors_1.ValidationError('La nueva contraseña debe ser diferente a la actual');
            }
            const hashedPassword = await (0, crypto_1.hashPassword)(newPassword);
            await database_1.prisma.usuario.update({
                where: { id: usuario.id },
                data: {
                    password: hashedPassword,
                    updatedAt: new Date(),
                },
            });
            await database_1.prisma.actividadUsuario.create({
                data: {
                    usuarioId: usuario.id,
                    accion: 'CAMBIO_CONTRASEÑA',
                    descripcion: 'Cambio de contraseña',
                },
            });
            logger_1.default.info(`🔐 Usuario cambió contraseña: ${usuario.email}`);
            res.status(200).json({
                success: true,
                message: 'Contraseña cambiada exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.PasswordController = PasswordController;
//# sourceMappingURL=password.controller.js.map