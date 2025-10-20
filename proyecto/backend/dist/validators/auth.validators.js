"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
exports.registerSchema = {
    body: joi_1.default.object({
        email: joi_1.default.string()
            .email()
            .required()
            .messages({
            'string.email': 'El correo electrónico debe ser válido',
            'any.required': 'El correo electrónico es requerido',
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
        nombre: joi_1.default.string()
            .min(2)
            .max(100)
            .required()
            .messages({
            'string.min': 'El nombre debe tener al menos 2 caracteres',
            'string.max': 'El nombre no puede exceder 100 caracteres',
            'any.required': 'El nombre es requerido',
        }),
        apellidoPaterno: joi_1.default.string()
            .min(2)
            .max(100)
            .required()
            .messages({
            'string.min': 'El apellido paterno debe tener al menos 2 caracteres',
            'string.max': 'El apellido paterno no puede exceder 100 caracteres',
            'any.required': 'El apellido paterno es requerido',
        }),
        apellidoMaterno: joi_1.default.string()
            .min(2)
            .max(100)
            .required()
            .messages({
            'string.min': 'El apellido materno debe tener al menos 2 caracteres',
            'string.max': 'El apellido materno no puede exceder 100 caracteres',
            'any.required': 'El apellido materno es requerido',
        }),
        telefono: joi_1.default.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
            'string.pattern.base': 'El teléfono debe ser un número de 10 dígitos',
            'any.required': 'El teléfono es requerido',
        }),
        rol: joi_1.default.string()
            .valid(...Object.values(client_1.Rol))
            .optional()
            .messages({
            'any.only': 'El rol debe ser uno de los valores permitidos',
        }),
    }),
};
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
exports.logoutSchema = {
    body: joi_1.default.object({
        refreshToken: joi_1.default.string()
            .required()
            .messages({
            'any.required': 'El refresh token es requerido',
        }),
    }),
};
//# sourceMappingURL=auth.validators.js.map