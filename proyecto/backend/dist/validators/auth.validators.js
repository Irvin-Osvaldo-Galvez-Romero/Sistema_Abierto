"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordWithCodeSchema = exports.verifyCodeSchema = exports.sendVerificationCodeSchema = exports.logoutSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = {
    body: joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .required()
            .messages({
            'string.email': 'El correo electrónico debe ser válido',
            'any.required': 'El correo electrónico es requerido',
        }),
        password: joi_1.default.string()
            .required()
            .messages({
            'any.required': 'La contraseña es requerida',
        }),
    }),
};
exports.refreshTokenSchema = {
    body: joi_1.default.object({
        refreshToken: joi_1.default.string()
            .required()
            .messages({
            'any.required': 'El refresh token es requerido',
        }),
    }),
};
exports.forgotPasswordSchema = {
    body: joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .required()
            .messages({
            'string.email': 'El correo electrónico debe ser válido',
            'any.required': 'El correo electrónico es requerido',
        }),
    }),
};
exports.resetPasswordSchema = {
    body: joi_1.default.object({
        token: joi_1.default.string()
            .required()
            .messages({
            'any.required': 'El token es requerido',
        }),
        password: joi_1.default.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .required()
            .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres',
            'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
            'any.required': 'La contraseña es requerida',
        }),
    }),
};
exports.logoutSchema = {
    body: joi_1.default.object({
        refreshToken: joi_1.default.string()
            .required()
            .messages({
            'any.required': 'El refresh token es requerido',
        }),
    }),
};
exports.sendVerificationCodeSchema = {
    body: joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .required()
            .messages({
            'string.email': 'El correo electrónico debe ser válido',
            'any.required': 'El correo electrónico es requerido',
        }),
    }),
};
exports.verifyCodeSchema = {
    body: joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .required()
            .messages({
            'string.email': 'El correo electrónico debe ser válido',
            'any.required': 'El correo electrónico es requerido',
        }),
        code: joi_1.default.string()
            .pattern(/^\d{6}$/)
            .required()
            .messages({
            'string.pattern.base': 'El código debe ser de 6 dígitos',
            'any.required': 'El código es requerido',
        }),
    }),
};
exports.resetPasswordWithCodeSchema = {
    body: joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .required()
            .messages({
            'string.email': 'El correo electrónico debe ser válido',
            'any.required': 'El correo electrónico es requerido',
        }),
        code: joi_1.default.string()
            .pattern(/^\d{6}$/)
            .required()
            .messages({
            'string.pattern.base': 'El código debe ser de 6 dígitos',
            'any.required': 'El código es requerido',
        }),
        password: joi_1.default.string()
            .min(8)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
            .required()
            .messages({
            'string.min': 'La contraseña debe tener al menos 8 caracteres',
            'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número',
            'any.required': 'La contraseña es requerida',
        }),
    }),
};
//# sourceMappingURL=auth.validators.js.map