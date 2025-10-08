"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = env_1.config.port;
const startServer = async () => {
    try {
        await database_1.prisma.$connect();
        logger_1.default.info('✅ Conexión a PostgreSQL establecida');
        app_1.default.listen(PORT, () => {
            logger_1.default.info(`🚀 Servidor corriendo en http://${env_1.config.host}:${PORT}`);
            logger_1.default.info(`📝 Ambiente: ${env_1.config.env}`);
            logger_1.default.info(`🔍 Health check: http://${env_1.config.host}:${PORT}/health`);
            logger_1.default.info(`🔗 API: http://${env_1.config.host}:${PORT}/api`);
        });
    }
    catch (error) {
        logger_1.default.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};
const gracefulShutdown = async (signal) => {
    logger_1.default.info(`\n⚠️  Señal ${signal} recibida. Cerrando servidor gracefully...`);
    try {
        await database_1.prisma.$disconnect();
        logger_1.default.info('✅ Prisma desconectado');
        process.exit(0);
    }
    catch (error) {
        logger_1.default.error('❌ Error durante el cierre:', error);
        process.exit(1);
    }
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
    logger_1.default.error('❌ Unhandled Rejection:', reason);
    throw reason;
});
process.on('uncaughtException', (error) => {
    logger_1.default.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
startServer();
//# sourceMappingURL=server.js.map