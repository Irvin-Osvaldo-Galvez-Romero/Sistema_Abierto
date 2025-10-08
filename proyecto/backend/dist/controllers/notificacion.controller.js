"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificacionController = void 0;
const notificacion_service_1 = require("../services/notificacion.service");
const database_1 = require("../config/database");
class NotificacionController {
    static async getMyNotifications(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'No autenticado' });
                return;
            }
            const estudiante = await database_1.prisma.estudiante.findUnique({
                where: { usuarioId: req.user.userId },
            });
            if (!estudiante) {
                res.status(404).json({ success: false, message: 'Perfil de estudiante no encontrado' });
                return;
            }
            const soloNoLeidas = req.query.unread === 'true';
            const notificaciones = await notificacion_service_1.NotificacionService.getByEstudiante(estudiante.id, soloNoLeidas);
            const unreadCount = await notificacion_service_1.NotificacionService.countUnread(estudiante.id);
            res.status(200).json({
                success: true,
                data: {
                    notificaciones,
                    unreadCount,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async markAsRead(req, res, next) {
        try {
            await notificacion_service_1.NotificacionService.markAsRead(req.params.id);
            res.status(200).json({ success: true, message: 'Notificación marcada como leída' });
        }
        catch (error) {
            next(error);
        }
    }
    static async markAllAsRead(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'No autenticado' });
                return;
            }
            const estudiante = await database_1.prisma.estudiante.findUnique({
                where: { usuarioId: req.user.userId },
            });
            if (!estudiante) {
                res.status(404).json({ success: false, message: 'Perfil de estudiante no encontrado' });
                return;
            }
            await notificacion_service_1.NotificacionService.markAllAsRead(estudiante.id);
            res.status(200).json({ success: true, message: 'Todas las notificaciones marcadas como leídas' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.NotificacionController = NotificacionController;
exports.default = NotificacionController;
//# sourceMappingURL=notificacion.controller.js.map