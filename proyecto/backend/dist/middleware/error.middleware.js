"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
const env_1 = require("../config/env");
const client_1 = require("@prisma/client");
const handlePrismaError = (error) => {
    switch (error.code) {
        case 'P2002':
            return new errors_1.AppError('Ya existe un registro con estos datos únicos', 409);
        case 'P2025':
            return new errors_1.AppError('Registro no encontrado', 404);
        case 'P2003':
            return new errors_1.AppError('Violación de clave foránea', 400);
        case 'P2014':
            return new errors_1.AppError('Violación de restricción', 400);
        default:
            return new errors_1.AppError('Error de base de datos', 500);
    }
};
const errorHandler = (err, req, res, next) => {
    let error = err;
    if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        error = handlePrismaError(err);
    }
    if (!(error instanceof errors_1.AppError)) {
        error = new errors_1.AppError(env_1.config.isDevelopment ? err.message : 'Error interno del servidor', 500, false);
    }
    const appError = error;
    if (!appError.isOperational || appError.statusCode >= 500) {
        logger_1.default.error('Error:', {
            message: appError.message,
            stack: appError.stack,
            url: req.url,
            method: req.method,
            ip: req.ip,
            userId: req.user?.userId,
        });
    }
    const errorResponse = {
        success: false,
        error: {
            message: appError.message,
            statusCode: appError.statusCode,
        },
    };
    if (env_1.config.isDevelopment) {
        errorResponse.error.stack = appError.stack;
    }
    res.status(appError.statusCode).json(errorResponse);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Ruta ${req.originalUrl} no encontrada`,
            statusCode: 404,
        },
    });
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=error.middleware.js.map