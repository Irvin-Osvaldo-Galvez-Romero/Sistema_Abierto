/**
 * Punto de entrada del servidor
 * Inicializa Express y la conexión a la base de datos
 */

import app from './app';
import { config } from './config/env';
import { prisma } from './config/database';
import logger from './utils/logger';

// Puerto del servidor
const PORT = config.port;

/**
 * Iniciar servidor
 */
const startServer = async (): Promise<void> => {
  try {
    // Verificar conexión a la base de datos
    await prisma.$connect();
    logger.info('✅ Conexión a PostgreSQL establecida');

    // Iniciar servidor HTTP
    app.listen(PORT, () => {
      logger.info(`🚀 Servidor corriendo en http://${config.host}:${PORT}`);
      logger.info(`📝 Ambiente: ${config.env}`);
      logger.info(`🔍 Health check: http://${config.host}:${PORT}/health`);
      logger.info(`🔗 API: http://${config.host}:${PORT}/api`);
    });
  } catch (error) {
    logger.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

/**
 * Manejo de cierre graceful
 */
const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`\n⚠️  Señal ${signal} recibida. Cerrando servidor gracefully...`);
  
  try {
    // Desconectar Prisma
    await prisma.$disconnect();
    logger.info('✅ Prisma desconectado');
    
    // Salir del proceso
    process.exit(0);
  } catch (error) {
    logger.error('❌ Error durante el cierre:', error);
    process.exit(1);
  }
};

// Capturar señales de terminación
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Capturar errores no manejados
process.on('unhandledRejection', (reason: any) => {
  logger.error('❌ Unhandled Rejection:', reason);
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  logger.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar servidor
startServer();

