"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const env_1 = require("./config/env");
const error_middleware_1 = require("./middleware/error.middleware");
const logger_1 = require("./utils/logger");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: env_1.config.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: env_1.config.rateLimit.windowMs,
    max: env_1.config.rateLimit.maxRequests,
    message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined', { stream: logger_1.stream }));
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Sistema Universitario API está funcionando',
        timestamp: new Date().toISOString(),
        environment: env_1.config.env,
    });
});
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API funcionando correctamente',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const student_routes_1 = __importDefault(require("./routes/student.routes"));
const carrera_routes_1 = __importDefault(require("./routes/carrera.routes"));
const materia_routes_1 = __importDefault(require("./routes/materia.routes"));
const documento_routes_1 = __importDefault(require("./routes/documento.routes"));
const calificacion_routes_1 = __importDefault(require("./routes/calificacion.routes"));
const upload_routes_1 = __importDefault(require("./routes/upload.routes"));
const notificacion_routes_1 = __importDefault(require("./routes/notificacion.routes"));
const profesor_routes_1 = __importDefault(require("./routes/profesor.routes"));
const password_routes_1 = __importDefault(require("./routes/password.routes"));
app.use('/api/auth', auth_routes_1.default);
app.use('/api/password', password_routes_1.default);
app.use('/api/students', student_routes_1.default);
app.use('/api/profesores', profesor_routes_1.default);
app.use('/api/carreras', carrera_routes_1.default);
app.use('/api/materias', materia_routes_1.default);
app.use('/api/documentos', documento_routes_1.default);
app.use('/api/calificaciones', calificacion_routes_1.default);
app.use('/api/upload', upload_routes_1.default);
app.use('/api/notificaciones', notificacion_routes_1.default);
app.use(error_middleware_1.notFoundHandler);
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map