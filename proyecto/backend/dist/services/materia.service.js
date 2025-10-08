"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MateriaService = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class MateriaService {
    static async create(data) {
        try {
            const existing = await database_1.prisma.materia.findUnique({
                where: { clave: data.clave },
            });
            if (existing) {
                throw new errors_1.ConflictError('La clave de materia ya existe');
            }
            const carrera = await database_1.prisma.carrera.findUnique({
                where: { id: data.carreraId },
            });
            if (!carrera) {
                throw new errors_1.NotFoundError('La carrera no existe');
            }
            const materia = await database_1.prisma.materia.create({
                data,
                include: {
                    carrera: true,
                },
            });
            logger_1.default.info(`Materia creada: ${materia.nombre}`);
            return materia;
        }
        catch (error) {
            logger_1.default.error('Error al crear materia:', error);
            throw error;
        }
    }
    static async findAll(carreraId) {
        try {
            const where = carreraId ? { carreraId, activo: true } : { activo: true };
            return await database_1.prisma.materia.findMany({
                where,
                include: {
                    carrera: true,
                    _count: {
                        select: {
                            grupos: true,
                        },
                    },
                },
                orderBy: [
                    { semestre: 'asc' },
                    { nombre: 'asc' },
                ],
            });
        }
        catch (error) {
            logger_1.default.error('Error al obtener materias:', error);
            throw error;
        }
    }
    static async findById(id) {
        try {
            const materia = await database_1.prisma.materia.findUnique({
                where: { id },
                include: {
                    carrera: true,
                    grupos: {
                        include: {
                            profesor: {
                                include: {
                                    usuario: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!materia) {
                throw new errors_1.NotFoundError('Materia no encontrada');
            }
            return materia;
        }
        catch (error) {
            logger_1.default.error('Error al obtener materia:', error);
            throw error;
        }
    }
    static async update(id, data) {
        try {
            const existing = await database_1.prisma.materia.findUnique({
                where: { id },
            });
            if (!existing) {
                throw new errors_1.NotFoundError('Materia no encontrada');
            }
            const materia = await database_1.prisma.materia.update({
                where: { id },
                data,
                include: {
                    carrera: true,
                },
            });
            logger_1.default.info(`Materia actualizada: ${materia.nombre}`);
            return materia;
        }
        catch (error) {
            logger_1.default.error('Error al actualizar materia:', error);
            throw error;
        }
    }
    static async delete(id) {
        try {
            await database_1.prisma.materia.update({
                where: { id },
                data: { activo: false },
            });
            logger_1.default.info(`Materia desactivada: ${id}`);
        }
        catch (error) {
            logger_1.default.error('Error al eliminar materia:', error);
            throw error;
        }
    }
}
exports.MateriaService = MateriaService;
exports.default = MateriaService;
//# sourceMappingURL=materia.service.js.map