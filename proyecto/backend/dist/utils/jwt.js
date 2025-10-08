"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTokenExpired = exports.decodeToken = exports.verifyToken = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const generateAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.config.jwt.secret, {
        expiresIn: env_1.config.jwt.expiresIn,
        issuer: 'sistema-universitario',
        audience: 'api',
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, env_1.config.jwt.secret, {
        expiresIn: env_1.config.jwt.refreshExpiresIn,
        issuer: 'sistema-universitario',
        audience: 'api',
    });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwt.secret, {
            issuer: 'sistema-universitario',
            audience: 'api',
        });
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('Token expirado');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error('Token inválido');
        }
        throw new Error('Error al verificar token');
    }
};
exports.verifyToken = verifyToken;
const decodeToken = (token) => {
    try {
        return jsonwebtoken_1.default.decode(token);
    }
    catch {
        return null;
    }
};
exports.decodeToken = decodeToken;
const isTokenExpired = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.decode(token);
        if (!decoded || !decoded.exp)
            return true;
        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    }
    catch {
        return true;
    }
};
exports.isTokenExpired = isTokenExpired;
//# sourceMappingURL=jwt.js.map