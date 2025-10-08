"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalificacionController = void 0;
const calificacion_service_1 = require("../services/calificacion.service");
class CalificacionController {
    static async create(req, res, next) {
        try {
            const calificacion = await calificacion_service_1.CalificacionService.create(req.body);
            res.status(201).json({ success: true, data: calificacion });
        }
        catch (error) {
            next(error);
        }
    }
    static async getByEstudiante(req, res, next) {
        try {
            const { estudianteId } = req.params;
            const calificaciones = await calificacion_service_1.CalificacionService.findByEstudiante(estudianteId);
            res.status(200).json({ success: true, data: calificaciones });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyCalificaciones(req, res, next) {
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
            const calificaciones = await calificacion_service_1.CalificacionService.findByEstudiante(estudiante.id);
            const promedio = await calificacion_service_1.CalificacionService.calculatePromedio(estudiante.id);
            res.status(200).json({
                success: true,
                data: {
                    calificaciones,
                    promedio,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { calificacion, observaciones } = req.body;
            const updated = await calificacion_service_1.CalificacionService.update(req.params.id, calificacion, observaciones);
            res.status(200).json({ success: true, data: updated });
        }
        catch (error) {
            next(error);
        }
    }
    static async getPromedio(req, res, next) {
        try {
            const { estudianteId } = req.params;
            const promedio = await calificacion_service_1.CalificacionService.calculatePromedio(estudianteId);
            res.status(200).json({ success: true, data: { promedio } });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CalificacionController = CalificacionController;
const database_1 = require("../config/database");
exports.default = CalificacionController;
//# sourceMappingURL=calificacion.controller.js.map