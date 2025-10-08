/**
 * Utilidad de logging
 * Winston logger configurado para desarrollo y producción
 */

import winston from 'winston';
import path from 'path';
import { config } from '../config/env';

// Formato personalizado para logs
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Formato para consola en desarrollo
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
  })
);

// Crear transports
const transports: winston.transport[] = [];

// Console transport (siempre activo en desarrollo)
if (config.isDevelopment) {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// File transports para producción
if (config.isProduction) {
  // Log de errores
  transports.push(
    new winston.transports.File({
      filename: path.join(config.logs.filePath, '../error.log'),
      level: 'error',
      format: customFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // Log combinado
  transports.push(
    new winston.transports.File({
      filename: path.join(config.logs.filePath),
      format: customFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );

  // También console en producción
  transports.push(
    new winston.transports.Console({
      format: customFormat,
    })
  );
}

// Crear logger
const logger = winston.createLogger({
  level: config.logs.level,
  format: customFormat,
  defaultMeta: { service: 'sistema-universitario-api' },
  transports,
  exitOnError: false,
});

// Stream para Morgan
export const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export default logger;

