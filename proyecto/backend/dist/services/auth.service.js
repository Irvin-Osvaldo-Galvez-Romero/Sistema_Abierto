"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const client_1 = require("@prisma/client");
const database_1 = require("../config/database");
const crypto_1 = require("../utils/crypto");
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const env_1 = require("../config/env");
const logger_1 = __importDefault(require("../utils/logger"));
const email_service_1 = require("./email.service");
class AuthService {
    static async login(data, ipAddress, userAgent) {
        try {
            const usuario = await database_1.prisma.usuario.findUnique({
                where: { email: data.email },
            });
            if (!usuario) {
                throw new errors_1.AuthenticationError('Credenciales inválidas');
            }
            if (!usuario.activo) {
                throw new errors_1.AuthenticationError('Cuenta desactivada');
            }
            if (usuario.bloqueadoHasta && usuario.bloqueadoHasta > new Date()) {
                const minutosRestantes = Math.ceil((usuario.bloqueadoHasta.getTime() - Date.now()) / 60000);
                throw new errors_1.TooManyRequestsError(`Cuenta bloqueada. Intenta de nuevo en ${minutosRestantes} minutos`);
            }
            const isPasswordValid = await (0, crypto_1.verifyPassword)(data.password, usuario.password);
            if (!isPasswordValid) {
                const nuevoIntentos = usuario.intentosFallidos + 1;
                const updateData = {
                    intentosFallidos: nuevoIntentos,
                };
                if (nuevoIntentos >= env_1.config.security.maxLoginAttempts) {
                    updateData.bloqueadoHasta = new Date(Date.now() + env_1.config.security.lockoutDuration * 1000);
                    logger_1.default.warn(`Usuario bloqueado por múltiples intentos: ${usuario.email}`);
                }
                await database_1.prisma.usuario.update({
                    where: { id: usuario.id },
                    data: updateData,
                });
                throw new errors_1.AuthenticationError('Credenciales inválidas');
            }
            await database_1.prisma.usuario.update({
                where: { id: usuario.id },
                data: {
                    intentosFallidos: 0,
                    bloqueadoHasta: null,
                    ultimoAcceso: new Date(),
                },
            });
            const accessToken = (0, jwt_1.generateAccessToken)({
                userId: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
            });
            const refreshToken = (0, jwt_1.generateRefreshToken)({
                userId: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
            });
            await database_1.prisma.tokenSesion.create({
                data: {
                    token: refreshToken,
                    tipo: client_1.TipoToken.REFRESH,
                    usuarioId: usuario.id,
                    expiraEn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    ipAddress,
                    userAgent,
                },
            });
            await this.logActivity(usuario.id, 'LOGIN', 'Inicio de sesión exitoso', ipAddress, userAgent);
            logger_1.default.info(`Login exitoso: ${usuario.email}`);
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
        }
        catch (error) {
            logger_1.default.error('Error en login:', error);
            throw error;
        }
    }
    static async refreshAccessToken(refreshToken) {
        try {
            const tokenRecord = await database_1.prisma.tokenSesion.findUnique({
                where: { token: refreshToken },
                include: { usuario: true },
            });
            if (!tokenRecord) {
                throw new errors_1.AuthenticationError('Token inválido');
            }
            if (tokenRecord.revocado) {
                throw new errors_1.AuthenticationError('Token revocado');
            }
            if (tokenRecord.expiraEn < new Date()) {
                throw new errors_1.AuthenticationError('Token expirado');
            }
            const accessToken = (0, jwt_1.generateAccessToken)({
                userId: tokenRecord.usuario.id,
                email: tokenRecord.usuario.email,
                rol: tokenRecord.usuario.rol,
            });
            logger_1.default.info(`Token renovado para usuario: ${tokenRecord.usuario.email}`);
            return { accessToken };
        }
        catch (error) {
            logger_1.default.error('Error al renovar token:', error);
            throw error;
        }
    }
    static async logout(refreshToken) {
        try {
            await database_1.prisma.tokenSesion.updateMany({
                where: { token: refreshToken },
                data: { revocado: true },
            });
            logger_1.default.info('Sesión cerrada exitosamente');
        }
        catch (error) {
            logger_1.default.error('Error al cerrar sesión:', error);
            throw error;
        }
    }
    static async getProfile(userId) {
        try {
            const usuario = await database_1.prisma.usuario.findUnique({
                where: { id: userId },
                include: {
                    estudiante: true,
                    profesor: true,
                    administrador: true,
                },
            });
            if (!usuario) {
                throw new errors_1.AuthenticationError('Usuario no encontrado');
            }
            return usuario;
        }
        catch (error) {
            logger_1.default.error('Error al obtener perfil:', error);
            throw error;
        }
    }
    static async forgotPassword(email) {
        try {
            const usuario = await database_1.prisma.usuario.findUnique({
                where: { email },
            });
            if (!usuario) {
                logger_1.default.info(`Solicitud de restablecimiento para email no registrado: ${email}`);
                return;
            }
            if (!usuario.activo) {
                logger_1.default.info(`Solicitud de restablecimiento para cuenta inactiva: ${email}`);
                return;
            }
            const resetToken = (0, crypto_1.generateRandomToken)(32);
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
            await database_1.prisma.tokenSesion.create({
                data: {
                    token: resetToken,
                    tipo: client_1.TipoToken.RESET_PASSWORD,
                    usuarioId: usuario.id,
                    expiraEn: expiresAt,
                },
            });
            try {
                await email_service_1.EmailService.sendPasswordReset({
                    nombre: usuario.nombre,
                    apellidoPaterno: usuario.apellidoPaterno,
                    apellidoMaterno: usuario.apellidoMaterno || '',
                    email: usuario.email,
                    resetToken,
                    rol: usuario.rol,
                });
                logger_1.default.info(`📧 Correo de restablecimiento enviado a: ${email}`);
            }
            catch (emailError) {
                logger_1.default.warn(`⚠️ Error al enviar correo de restablecimiento a ${email}:`, emailError);
            }
            await this.logActivity(usuario.id, 'FORGOT_PASSWORD', 'Solicitud de restablecimiento de contraseña');
            logger_1.default.info(`Solicitud de restablecimiento procesada para: ${email}`);
        }
        catch (error) {
            logger_1.default.error('Error en forgotPassword:', error);
            throw error;
        }
    }
    static async resetPassword(token, newPassword) {
        try {
            const tokenRecord = await database_1.prisma.tokenSesion.findUnique({
                where: { token },
                include: { usuario: true },
            });
            if (!tokenRecord) {
                throw new errors_1.AuthenticationError('Token inválido');
            }
            if (tokenRecord.revocado) {
                throw new errors_1.AuthenticationError('Token ya utilizado');
            }
            if (tokenRecord.expiraEn < new Date()) {
                throw new errors_1.AuthenticationError('Token expirado');
            }
            if (tokenRecord.tipo !== client_1.TipoToken.RESET_PASSWORD) {
                throw new errors_1.AuthenticationError('Token inválido');
            }
            if (!tokenRecord.usuario.activo) {
                throw new errors_1.AuthenticationError('Cuenta desactivada');
            }
            const hashedPassword = await (0, crypto_1.hashPassword)(newPassword);
            await database_1.prisma.usuario.update({
                where: { id: tokenRecord.usuario.id },
                data: {
                    password: hashedPassword,
                    primerLogin: false,
                },
            });
            await database_1.prisma.tokenSesion.update({
                where: { id: tokenRecord.id },
                data: { revocado: true },
            });
            await database_1.prisma.tokenSesion.updateMany({
                where: {
                    usuarioId: tokenRecord.usuario.id,
                    tipo: client_1.TipoToken.REFRESH,
                },
                data: { revocado: true },
            });
            await this.logActivity(tokenRecord.usuario.id, 'RESET_PASSWORD', 'Contraseña restablecida exitosamente');
            logger_1.default.info(`Contraseña restablecida para usuario: ${tokenRecord.usuario.email}`);
        }
        catch (error) {
            logger_1.default.error('Error en resetPassword:', error);
            throw error;
        }
    }
    static async sendVerificationCode(email) {
        try {
            const usuario = await database_1.prisma.usuario.findUnique({
                where: { email },
            });
            if (!usuario) {
                logger_1.default.info(`Solicitud de código de verificación para email no registrado: ${email}`);
                return;
            }
            if (!usuario.activo) {
                logger_1.default.info(`Solicitud de código de verificación para cuenta inactiva: ${email}`);
                return;
            }
            const verificationCode = (0, crypto_1.generateVerificationCode)(6);
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            await database_1.prisma.tokenSesion.updateMany({
                where: {
                    usuarioId: usuario.id,
                    tipo: client_1.TipoToken.VERIFICATION_CODE,
                    revocado: false,
                },
                data: { revocado: true },
            });
            const hashedCode = await (0, crypto_1.hashPassword)(verificationCode);
            await database_1.prisma.tokenSesion.create({
                data: {
                    token: hashedCode,
                    tipo: client_1.TipoToken.VERIFICATION_CODE,
                    usuarioId: usuario.id,
                    expiraEn: expiresAt,
                },
            });
            await email_service_1.EmailService.sendVerificationCode({
                nombre: usuario.nombre,
                apellidoPaterno: usuario.apellidoPaterno,
                apellidoMaterno: usuario.apellidoMaterno || '',
                email: usuario.email,
                code: verificationCode,
                rol: usuario.rol,
            });
            logger_1.default.info(`📧 Código de verificación enviado a: ${email}`);
            await this.logActivity(usuario.id, 'SEND_VERIFICATION_CODE', 'Código de verificación enviado para restablecimiento de contraseña');
            logger_1.default.info(`Código de verificación procesado para: ${email}`);
        }
        catch (error) {
            logger_1.default.error('Error en sendVerificationCode:', error);
            throw error;
        }
    }
    static async verifyCode(email, code) {
        try {
            const usuario = await database_1.prisma.usuario.findUnique({
                where: { email },
            });
            if (!usuario || !usuario.activo) {
                return { valid: false };
            }
            const activeCodes = await database_1.prisma.tokenSesion.findMany({
                where: {
                    usuarioId: usuario.id,
                    tipo: client_1.TipoToken.VERIFICATION_CODE,
                    revocado: false,
                    expiraEn: {
                        gt: new Date(),
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            for (const codeRecord of activeCodes) {
                const isValid = await (0, crypto_1.verifyPassword)(code, codeRecord.token);
                if (isValid) {
                    const resetToken = (0, crypto_1.generateRandomToken)(32);
                    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
                    await database_1.prisma.tokenSesion.create({
                        data: {
                            token: resetToken,
                            tipo: client_1.TipoToken.RESET_PASSWORD,
                            usuarioId: usuario.id,
                            expiraEn: expiresAt,
                        },
                    });
                    await database_1.prisma.tokenSesion.update({
                        where: { id: codeRecord.id },
                        data: { revocado: true },
                    });
                    await this.logActivity(usuario.id, 'VERIFY_CODE', 'Código de verificación validado exitosamente');
                    logger_1.default.info(`Código de verificación validado para usuario: ${email}`);
                    return { valid: true, token: resetToken };
                }
            }
            logger_1.default.warn(`Intento de verificación con código inválido para: ${email}`);
            return { valid: false };
        }
        catch (error) {
            logger_1.default.error('Error en verifyCode:', error);
            throw error;
        }
    }
    static async resetPasswordWithCode(email, code, newPassword) {
        try {
            const verification = await this.verifyCode(email, code);
            if (!verification.valid || !verification.token) {
                throw new errors_1.AuthenticationError('Código de verificación inválido o expirado');
            }
            const tokenRecord = await database_1.prisma.tokenSesion.findUnique({
                where: { token: verification.token },
                include: { usuario: true },
            });
            if (!tokenRecord || tokenRecord.tipo !== client_1.TipoToken.RESET_PASSWORD) {
                throw new errors_1.AuthenticationError('Token de restablecimiento inválido');
            }
            if (tokenRecord.expiraEn < new Date()) {
                throw new errors_1.AuthenticationError('Token expirado');
            }
            if (!tokenRecord.usuario.activo) {
                throw new errors_1.AuthenticationError('Cuenta desactivada');
            }
            const hashedPassword = await (0, crypto_1.hashPassword)(newPassword);
            await database_1.prisma.usuario.update({
                where: { id: tokenRecord.usuario.id },
                data: {
                    password: hashedPassword,
                    primerLogin: false,
                },
            });
            await database_1.prisma.tokenSesion.update({
                where: { id: tokenRecord.id },
                data: { revocado: true },
            });
            await database_1.prisma.tokenSesion.updateMany({
                where: {
                    usuarioId: tokenRecord.usuario.id,
                    tipo: client_1.TipoToken.REFRESH,
                },
                data: { revocado: true },
            });
            await this.logActivity(tokenRecord.usuario.id, 'RESET_PASSWORD_WITH_CODE', 'Contraseña restablecida exitosamente con código de verificación');
            logger_1.default.info(`Contraseña restablecida con código para usuario: ${email}`);
        }
        catch (error) {
            logger_1.default.error('Error en resetPasswordWithCode:', error);
            throw error;
        }
    }
    static async logActivity(usuarioId, accion, descripcion, ipAddress, userAgent) {
        try {
            await database_1.prisma.actividadUsuario.create({
                data: {
                    usuarioId,
                    accion,
                    descripcion,
                    ipAddress,
                    userAgent,
                },
            });
        }
        catch (error) {
            logger_1.default.error('Error al registrar actividad:', error);
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map