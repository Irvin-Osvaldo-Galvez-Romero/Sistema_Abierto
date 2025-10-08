/**
 * Clases de errores personalizados
 * Para manejo estructurado de errores en la aplicación
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Error de validación') {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'No autenticado') {
    super(message, 401);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'No autorizado') {
    super(message, 403);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto con el estado actual') {
    super(message, 409);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = 'Demasiadas solicitudes') {
    super(message, 429);
    Object.setPrototypeOf(this, TooManyRequestsError.prototype);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Error de base de datos') {
    super(message, 500, false);
    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}

