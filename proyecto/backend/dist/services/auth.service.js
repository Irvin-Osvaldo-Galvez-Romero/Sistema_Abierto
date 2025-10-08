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
class AuthService {
    static async register(data) {
        try {
            const existingUser = await database_1.prisma.usuario.findUnique({
                where: { email: data.email },
            });
            if (existingUser) {
                throw new errors_1.ConflictError('El correo electrónico ya está registrado');
            }
            const hashedPassword = await (0, crypto_1.hashPassword)(data.password);
            const usuario = await database_1.prisma.usuario.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    nombre: data.nombre,
                    apellidoPaterno: data.apellidoPaterno,
                    apellidoMaterno: data.apellidoMaterno,
                    telefono: data.telefono,
                    rol: data.rol || client_1.Rol.ESTUDIANTE,
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
                },
            });
            await this.logActivity(usuario.id, 'REGISTRO', 'Usuario registrado exitosamente');
            logger_1.default.info(`Usuario registrado: ${usuario.email}`);
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
        }
        catch (error) {
            logger_1.default.error('Error en registro:', error);
            throw error;
        }
    }
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