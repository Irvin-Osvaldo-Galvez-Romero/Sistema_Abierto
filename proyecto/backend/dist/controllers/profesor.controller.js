"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfesorController = void 0;
const profesor_service_1 = require("../services/profesor.service");
class ProfesorController {
    static async crearProfesor(req, res, next) {
        try {
            const profesor = await profesor_service_1.ProfesorService.crearProfesor(req.body);
            res.status(201).json({
                success: true,
                message: 'Profesor creado exitosamente',
                data: profesor,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async obtenerProfesores(req, res, next) {
        try {
            const profesores = await profesor_service_1.ProfesorService.obtenerProfesores();
            res.status(200).json({
                success: true,
                data: profesores,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async obtenerProfesorPorId(req, res, next) {
        try {
            const { id } = req.params;
            const profesor = await profesor_service_1.ProfesorService.obtenerProfesorPorId(id);
            res.status(200).json({
                success: true,
                data: profesor,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.ProfesorController = ProfesorController;
//# sourceMappingURL=profesor.controller.js.map