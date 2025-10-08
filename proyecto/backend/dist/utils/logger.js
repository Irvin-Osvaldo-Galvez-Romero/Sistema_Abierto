"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const env_1 = require("../config/env");
const customFormat = winston_1.default.format.combine(winston_1.default.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.splat(), winston_1.default.format.json());
const consoleFormat = winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: 'HH:mm:ss' }), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
        msg += `\n${JSON.stringify(meta, null, 2)}`;
    }
    return msg;
}));
const transports = [];
if (env_1.config.isDevelopment) {
    transports.push(new winston_1.default.transports.Console({
        format: consoleFormat,
    }));
}
if (env_1.config.isProduction) {
    transports.push(new winston_1.default.transports.File({
        filename: path_1.default.join(env_1.config.logs.filePath, '../error.log'),
        level: 'error',
        format: customFormat,
        maxsize: 5242880,
        maxFiles: 5,
    }));
    transports.push(new winston_1.default.transports.File({
        filename: path_1.default.join(env_1.config.logs.filePath),
        format: customFormat,
        maxsize: 5242880,
        maxFiles: 5,
    }));
    transports.push(new winston_1.default.transports.Console({
        format: customFormat,
    }));
}
const logger = winston_1.default.createLogger({
    level: env_1.config.logs.level,
    format: customFormat,
    defaultMeta: { service: 'sistema-universitario-api' },
    transports,
    exitOnError: false,
});
exports.stream = {
    write: (message) => {
        logger.http(message.trim());
    },
};
exports.default = logger;
//# sourceMappingURL=logger.js.map