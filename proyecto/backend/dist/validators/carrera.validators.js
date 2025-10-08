"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCarreraByIdSchema = exports.updateCarreraSchema = exports.createCarreraSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const client_1 = require("@prisma/client");
exports.createCarreraSchema = {
    body: joi_1.default.object({
        clave: joi_1.default.string().required().max(20),
        nombre: joi_1.default.string().required().max(200),
        descripcion: joi_1.default.string().optional().allow(''),
        duracionSemestres: joi_1.default.number().integer().min(1).max(20).required(),
        creditos: joi_1.default.number().integer().min(1).required(),
        modalidad: joi_1.default.string().valid(...Object.values(client_1.Modalidad)).required(),
    }),
};
exports.updateCarreraSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string().uuid().required(),
    }),
    body: joi_1.default.object({
        clave: joi_1.default.string().max(20).optional(),
        nombre: joi_1.default.string().max(200).optional(),
        descripcion: joi_1.default.string().optional().allow(''),
        duracionSemestres: joi_1.default.number().integer().min(1).max(20).optional(),
        creditos: joi_1.default.number().integer().min(1).optional(),
        modalidad: joi_1.default.string().valid(...Object.values(client_1.Modalidad)).optional(),
        activo: joi_1.default.boolean().optional(),
    }).min(1),
};
exports.getCarreraByIdSchema = {
    params: joi_1.default.object({
        id: joi_1.default.string().uuid().required(),
    }),
};
//# sourceMappingURL=carrera.validators.js.map