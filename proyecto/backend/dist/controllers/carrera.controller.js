"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarreraController = void 0;
const carrera_service_1 = require("../services/carrera.service");
class CarreraController {
    static async create(req, res, next) {
        try {
            const carrera = await carrera_service_1.CarreraService.create(req.body);
            res.status(201).json({ success: true, data: carrera });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            const includeInactive = req.query.includeInactive === 'true';
            const carreras = await carrera_service_1.CarreraService.findAll(includeInactive);
            res.status(200).json({ success: true, data: carreras });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const carrera = await carrera_service_1.CarreraService.findById(req.params.id);
            res.status(200).json({ success: true, data: carrera });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const carrera = await carrera_service_1.CarreraService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: carrera });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await carrera_service_1.CarreraService.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Carrera eliminada' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.CarreraController = CarreraController;
exports.default = CarreraController;
//# sourceMappingURL=carrera.controller.js.map