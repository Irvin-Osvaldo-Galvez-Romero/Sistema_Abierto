"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const tokenFromQuery = req.query.token;
        let token;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);
        }
        else if (tokenFromQuery) {
            token = tokenFromQuery;
        }
        if (!token) {
            throw new errors_1.AuthenticationError('Token no proporcionado');
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof errors_1.AuthenticationError) {
            next(error);
        }
        else {
            next(new errors_1.AuthenticationError('Token inválido o expirado'));
        }
    }
};
exports.authenticate = authenticate;
const authorize = (...rolesPermitidos) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                throw new errors_1.AuthenticationError('Usuario no autenticado');
            }
            if (!rolesPermitidos.includes(req.user.rol)) {
                throw new errors_1.AuthorizationError('No tienes permisos para realizar esta acción');
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorize = authorize;
const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);
            const decoded = (0, jwt_1.verifyToken)(token);
            req.user = decoded;
        }
        next();
    }
    catch (error) {
        next();
    }
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=auth.middleware.js.map