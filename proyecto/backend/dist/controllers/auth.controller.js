"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
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
    static async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            await auth_service_1.AuthService.forgotPassword(email);
            res.status(200).json({
                success: true,
                message: 'Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async resetPassword(req, res, next) {
        try {
            const { token, password } = req.body;
            await auth_service_1.AuthService.resetPassword(token, password);
            res.status(200).json({
                success: true,
                message: 'Contraseña restablecida exitosamente',
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
    static async sendVerificationCode(req, res, next) {
        try {
            const { email } = req.body;
            await auth_service_1.AuthService.sendVerificationCode(email);
            res.status(200).json({
                success: true,
                message: 'Si el correo está registrado, recibirás un código de verificación',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async verifyCode(req, res, next) {
        try {
            const { email, code } = req.body;
            const result = await auth_service_1.AuthService.verifyCode(email, code);
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
        }
        catch (error) {
            next(error);
        }
    }
    static async resetPasswordWithCode(req, res, next) {
        try {
            const { email, code, password } = req.body;
            await auth_service_1.AuthService.resetPasswordWithCode(email, code, password);
            res.status(200).json({
                success: true,
                message: 'Contraseña restablecida exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map