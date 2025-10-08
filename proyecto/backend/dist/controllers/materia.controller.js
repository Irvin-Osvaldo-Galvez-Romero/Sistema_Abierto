"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MateriaController = void 0;
const materia_service_1 = require("../services/materia.service");
class MateriaController {
    static async create(req, res, next) {
        try {
            const materia = await materia_service_1.MateriaService.create(req.body);
            res.status(201).json({ success: true, data: materia });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            const carreraId = req.query.carreraId;
            const materias = await materia_service_1.MateriaService.findAll(carreraId);
            res.status(200).json({ success: true, data: materias });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const materia = await materia_service_1.MateriaService.findById(req.params.id);
            res.status(200).json({ success: true, data: materia });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const materia = await materia_service_1.MateriaService.update(req.params.id, req.body);
            res.status(200).json({ success: true, data: materia });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await materia_service_1.MateriaService.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Materia eliminada' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.MateriaController = MateriaController;
exports.default = MateriaController;
//# sourceMappingURL=materia.controller.js.map