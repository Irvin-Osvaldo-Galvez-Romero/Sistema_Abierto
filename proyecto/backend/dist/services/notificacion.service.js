"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionService = void 0;
const database_1 = require("../config/database");
const logger_1 = __importDefault(require("../utils/logger"));
class NotificacionService {
    static async getByEstudiante(estudianteId, soloNoLeidas = false) {
        try {
            const where = { estudianteId };
            if (soloNoLeidas) {
                where.leida = false;
            }
            return await database_1.prisma.notificacion.findMany({
                where,
                orderBy: {
                    createdAt: 'desc',
                },
            });
        }
        catch (error) {
            logger_1.default.error('Error al obtener notificaciones:', error);
            throw error;
        }
    }
    static async markAsRead(id) {
        try {
            await database_1.prisma.notificacion.update({
                where: { id },
                data: { leida: true },
            });
        }
        catch (error) {
            logger_1.default.error('Error al marcar notificación:', error);
            throw error;
        }
    }
    static async markAllAsRead(estudianteId) {
        try {
            await database_1.prisma.notificacion.updateMany({
                where: {
                    estudianteId,
                    leida: false,
                },
                data: {
                    leida: true,
                },
            });
        }
        catch (error) {
            logger_1.default.error('Error al marcar todas las notificaciones:', error);
            throw error;
        }
    }
    static async countUnread(estudianteId) {
        try {
            return await database_1.prisma.notificacion.count({
                where: {
                    estudianteId,
                    leida: false,
                },
            });
        }
        catch (error) {
            logger_1.default.error('Error al contar notificaciones:', error);
            throw error;
        }
    }
}
exports.NotificacionService = NotificacionService;
exports.default = NotificacionService;
//# sourceMappingURL=notificacion.service.js.map