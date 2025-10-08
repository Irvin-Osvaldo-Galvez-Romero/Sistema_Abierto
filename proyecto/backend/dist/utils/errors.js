"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseError = exports.TooManyRequestsError = exports.ConflictError = exports.NotFoundError = exports.AuthorizationError = exports.AuthenticationError = exports.ValidationError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message = 'Error de validación') {
        super(message, 400);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
exports.ValidationError = ValidationError;
class AuthenticationError extends AppError {
    constructor(message = 'No autenticado') {
        super(message, 401);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
exports.AuthenticationError = AuthenticationError;
class AuthorizationError extends AppError {
    constructor(message = 'No autorizado') {
        super(message, 403);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}
exports.AuthorizationError = AuthorizationError;
class NotFoundError extends AppError {
    constructor(message = 'Recurso no encontrado') {
        super(message, 404);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
exports.NotFoundError = NotFoundError;
class ConflictError extends AppError {
    constructor(message = 'Conflicto con el estado actual') {
        super(message, 409);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
exports.ConflictError = ConflictError;
class TooManyRequestsError extends AppError {
    constructor(message = 'Demasiadas solicitudes') {
        super(message, 429);
        Object.setPrototypeOf(this, TooManyRequestsError.prototype);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
class DatabaseError extends AppError {
    constructor(message = 'Error de base de datos') {
        super(message, 500, false);
        Object.setPrototypeOf(this, DatabaseError.prototype);
    }
}
exports.DatabaseError = DatabaseError;
//# sourceMappingURL=errors.js.map