"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    static async register(req, res, next) {
        try {
            const result = await auth_service_1.AuthService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'Usuario registrado exitosamente',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async login(req, res, next) {
        try {
            const ipAddress = req.ip || req.socket.remoteAddress;
            const userAgent = req.headers['user-agent'];
            const result = await auth_service_1.AuthService.login(req.body, ipAddress, userAgent);
            res.status(200).json({
                success: true,
                message: 'Inicio de sesión exitoso',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async refreshToken(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({
                    success: false,
                    message: 'Refresh token es requerido',
                });
                return;
            }
            const result = await auth_service_1.AuthService.refreshAccessToken(refreshToken);
            res.status(200).json({
                success: true,
                message: 'Token renovado exitosamente',
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async logout(req, res, next) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                res.status(400).json({
                    success: false,
                    message: 'Refresh token es requerido',
                });
                return;
            }
            await auth_service_1.AuthService.logout(refreshToken);
            res.status(200).json({
                success: true,
                message: 'Sesión cerrada exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getProfile(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'No autenticado',
                });
                return;
            }
            const profile = await auth_service_1.AuthService.getProfile(req.user.userId);
            const { password, ...profileWithoutPassword } = profile;
            res.status(200).json({
                success: true,
                data: profileWithoutPassword,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMe(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map