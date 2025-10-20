"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationSchema = exports.searchStudentsSchema = exports.getStudentByMatriculaSchema = exports.getStudentByIdSchema = exports.updateStudentSchema = exports.createStudentSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
exports.createStudentSchema = {
    body: joi_1.default.object({
        usuarioId: joi_1.default.string()
            .uuid()
            .required()
            .messages({
            'string.uuid': 'El ID de usuario debe ser un UUID válido',
            'any.required': 'El ID de usuario es requerido',
        }),
        matricula: joi_1.default.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
            'string.pattern.base': 'La matrícula debe ser de 10 dígitos',
            'any.required': 'La matrícula es requerida',
        }),
        fechaNacimiento: joi_1.default.date()
            .max('now')
            .optional()
            .allow(null)
            .messages({
            'date.max': 'La fecha de nacimiento debe ser anterior a hoy',
        }),
        curp: joi_1.default.string()
            .pattern(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/)
            .optional()
            .allow('')
            .messages({
            'string.pattern.base': 'El CURP no tiene un formato válido',
        }),
        nss: joi_1.default.string()
            .pattern(/^[0-9]{11}$/)
            .optional()
            .allow('')
            .messages({
            'string.pattern.base': 'El NSS debe ser de 11 dígitos',
        }),
        direccion: joi_1.default.string()
            .max(200)
            .optional()
            .allow(''),
        ciudad: joi_1.default.string()
            .max(100)
            .optional()
            .allow(''),
        estado: joi_1.default.string()
            .max(100)
            .optional()
            .allow(''),
        codigoPostal: joi_1.default.string()
            .pattern(/^[0-9]{5}$/)
            .optional()
            .allow('')
            .messages({
            'string.pattern.base': 'El código postal debe ser de 5 dígitos',
        }),
        tutorNombre: joi_1.default.string()
            .max(200)
            .optional()
            .allow(''),
        tutorTelefono: joi_1.default.string()
            .pattern(/^[0-9]{10}$/)
            .optional()
            .allow('')
            .messages({
            'string.pattern.base': 'El teléfono del tutor debe ser de 10 dígitos',
        }),
        tutorEmail: joi_1.default.string()
            .email()
            .optional()
            .allow('')
            .messages({
            'string.email': 'El correo del tutor debe ser válido',
        }),
        carreraId: joi_1.default.string()
            .uuid()
            .required()
            .messages({
            'string.uuid': 'El ID de carrera debe ser un UUID válido',
            'any.required': 'La carrera es requerida',
        }),
        estatus: joi_1.default.string()
            .valid(...Object.values(client_1.EstatusEstudiante))
            .optional(),
    }),
};
exports.updateStudentSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string()
            .uuid()
            .required()
            .messages({
            'string.uuid': 'El ID debe ser un UUID válido',
            'any.required': 'El ID es requerido',
        }),
    }),
    body: joi_1.default.object({
        fechaNacimiento: joi_1.default.date()
            .max('now')
            .optional(),
        curp: joi_1.default.string()
            .pattern(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/)
            .optional()
            .allow(''),
        nss: joi_1.default.string()
            .pattern(/^[0-9]{11}$/)
            .optional()
            .allow(''),
        direccion: joi_1.default.string()
            .max(200)
            .optional()
            .allow(''),
        ciudad: joi_1.default.string()
            .max(100)
            .optional()
            .allow(''),
        estado: joi_1.default.string()
            .max(100)
            .optional()
            .allow(''),
        codigoPostal: joi_1.default.string()
            .pattern(/^[0-9]{5}$/)
            .optional()
            .allow(''),
        tutorNombre: joi_1.default.string()
            .max(200)
            .optional()
            .allow(''),
        tutorTelefono: joi_1.default.string()
            .pattern(/^[0-9]{10}$/)
            .optional()
            .allow(''),
        tutorEmail: joi_1.default.string()
            .email()
            .optional()
            .allow(''),
        estatus: joi_1.default.string()
            .valid(...Object.values(client_1.EstatusEstudiante))
            .optional(),
        carreraId: joi_1.default.string()
            .uuid()
            .optional(),
    }).min(1),
};
exports.getStudentByIdSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string()
            .uuid()
            .required()
            .messages({
            'string.uuid': 'El ID debe ser un UUID válido',
            'any.required': 'El ID es requerido',
        }),
    }),
};
exports.getStudentByMatriculaSchema = {
    params: joi_1.default.object({
        matricula: joi_1.default.string()
            .pattern(/^[0-9]{10}$/)
            .required()
            .messages({
            'string.pattern.base': 'La matrícula debe ser de 10 dígitos',
            'any.required': 'La matrícula es requerida',
        }),
    }),
};
exports.searchStudentsSchema = {
    query: joi_1.default.object({
        q: joi_1.default.string()
            .min(2)
            .required()
            .messages({
            'string.min': 'La búsqueda debe tener al menos 2 caracteres',
            'any.required': 'El parámetro de búsqueda es requerido',
        }),
    }),
};
exports.paginationSchema = {
    query: joi_1.default.object({
        page: joi_1.default.number()
            .integer()
            .min(1)
            .optional()
            .default(1),
        limit: joi_1.default.number()
            .integer()
            .min(1)
            .max(100)
            .optional()
            .default(10),
        estatus: joi_1.default.string()
            .valid(...Object.values(client_1.EstatusEstudiante))
            .optional(),
    }),
};
//# sourceMappingURL=student.validators.js.map