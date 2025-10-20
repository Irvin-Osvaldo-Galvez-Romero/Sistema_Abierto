"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarreraController = void 0;
const database_1 = require("../config/database");
class CarreraController {
    static async getAll(req, res, next) {
        try {
            const carreras = await database_1.prisma.carrera.findMany({
                where: {
                    activo: true,
                },
                select: {
                    id: true,
                    clave: true,
                    nombre: true,
                    descripcion: true,
                    duracionSemestres: true,
                    creditos: true,
                    modalidad: true,
                },
                orderBy: {
                    nombre: 'asc',
                },
            });
            res.status(200).json({
                success: true,
                data: carreras,
                total: carreras.length,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const carrera = await database_1.prisma.carrera.findUnique({
                where: { id },
                select: {
                    id: true,
                    clave: true,
                    nombre: true,
                    descripcion: true,
                    duracionSemestres: true,
                    creditos: true,
                    modalidad: true,
                },
            });
            if (!carrera) {
                res.status(404).json({
                    success: false,
                    message: 'Carrera no encontrada',
                });
                return;
            }
            res.status(200).json({
                success: true,
                data: carrera,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CarreraController = CarreraController;
exports.default = CarreraController;
//# sourceMappingURL=carrera.controller.js.map