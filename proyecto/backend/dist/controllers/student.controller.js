"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
const student_service_1 = require("../services/student.service");
class StudentController {
    static async create(req, res, next) {
        try {
            const estudiante = await student_service_1.StudentService.create(req.body);
            res.status(201).json({
                success: true,
                message: 'Estudiante creado exitosamente',
                data: estudiante,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 1000;
            const estatus = req.query.estatus;
            const result = await student_service_1.StudentService.findAll(page, limit, estatus);
            res.status(200).json({
                success: true,
                data: result.estudiantes,
                total: result.total,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    pages: result.pages,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getById(req, res, next) {
        try {
            const { id } = req.params;
            const estudiante = await student_service_1.StudentService.findById(id);
            res.status(200).json({
                success: true,
                data: estudiante,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getByMatricula(req, res, next) {
        try {
            const { matricula } = req.params;
            const estudiante = await student_service_1.StudentService.findByMatricula(matricula);
            res.status(200).json({
                success: true,
                data: estudiante,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyProfile(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({
                    success: false,
                    message: 'No autenticado',
                });
                return;
            }
            const estudiante = await student_service_1.StudentService.findByUserId(req.user.userId);
            res.status(200).json({
                success: true,
                data: estudiante,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async update(req, res, next) {
        try {
            const { id } = req.params;
            const estudiante = await student_service_1.StudentService.update(id, req.body);
            res.status(200).json({
                success: true,
                message: 'Estudiante actualizado exitosamente',
                data: estudiante,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            const { id } = req.params;
            await student_service_1.StudentService.delete(id);
            res.status(200).json({
                success: true,
                message: 'Estudiante dado de baja exitosamente',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async generateMatricula(req, res, next) {
        try {
            const matricula = await student_service_1.StudentService.generateMatricula();
            res.status(200).json({
                success: true,
                data: { matricula },
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async search(req, res, next) {
        try {
            const query = req.query.q;
            if (!query || query.length < 2) {
                res.status(400).json({
                    success: false,
                    message: 'La búsqueda debe tener al menos 2 caracteres',
                });
                return;
            }
            const estudiantes = await student_service_1.StudentService.search(query);
            res.status(200).json({
                success: true,
                data: estudiantes,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.StudentController = StudentController;
exports.default = StudentController;
//# sourceMappingURL=student.controller.js.map