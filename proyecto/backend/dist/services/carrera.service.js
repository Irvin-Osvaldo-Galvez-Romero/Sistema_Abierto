"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarreraService = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class CarreraService {
    static async create(data) {
        try {
            const existing = await database_1.prisma.carrera.findUnique({
                where: { clave: data.clave },
            });
            if (existing) {
                throw new errors_1.ConflictError('La clave de carrera ya existe');
            }
            const carrera = await database_1.prisma.carrera.create({
                data,
            });
            logger_1.default.info(`Carrera creada: ${carrera.nombre}`);
            return carrera;
        }
        catch (error) {
            logger_1.default.error('Error al crear carrera:', error);
            throw error;
        }
    }
    static async findAll(includeInactive = false) {
        try {
            const where = includeInactive ? {} : { activo: true };
            const carreras = await database_1.prisma.carrera.findMany({
                where,
                include: {
                    _count: {
                        select: {
                            estudiantes: true,
                            materias: true,
                        },
                    },
                },
                orderBy: {
                    nombre: 'asc',
                },
            });
            return carreras;
        }
        catch (error) {
            logger_1.default.error('Error al obtener carreras:', error);
            throw error;
        }
    }
    static async findById(id) {
        try {
            const carrera = await database_1.prisma.carrera.findUnique({
                where: { id },
                include: {
                    estudiantes: {
                        take: 10,
                        include: {
                            usuario: {
                                select: {
                                    nombre: true,
                                    apellidoPaterno: true,
                                    email: true,
                                },
                            },
                        },
                    },
                    materias: {
                        orderBy: {
                            semestre: 'asc',
                        },
                    },
                    _count: {
                        select: {
                            estudiantes: true,
                            materias: true,
                        },
                    },
                },
            });
            if (!carrera) {
                throw new errors_1.NotFoundError('Carrera no encontrada');
            }
            return carrera;
        }
        catch (error) {
            logger_1.default.error('Error al obtener carrera:', error);
            throw error;
        }
    }
    static async update(id, data) {
        try {
            const existing = await database_1.prisma.carrera.findUnique({
                where: { id },
            });
            if (!existing) {
                throw new errors_1.NotFoundError('Carrera no encontrada');
            }
            if (data.clave && data.clave !== existing.clave) {
                const claveExists = await database_1.prisma.carrera.findUnique({
                    where: { clave: data.clave },
                });
                if (claveExists) {
                    throw new errors_1.ConflictError('La clave de carrera ya existe');
                }
            }
            const carrera = await database_1.prisma.carrera.update({
                where: { id },
                data,
            });
            logger_1.default.info(`Carrera actualizada: ${carrera.nombre}`);
            return carrera;
        }
        catch (error) {
            logger_1.default.error('Error al actualizar carrera:', error);
            throw error;
        }
    }
    static async delete(id) {
        try {
            const carrera = await database_1.prisma.carrera.findUnique({
                where: { id },
                include: {
                    _count: {
                        select: {
                            estudiantes: true,
                        },
                    },
                },
            });
            if (!carrera) {
                throw new errors_1.NotFoundError('Carrera no encontrada');
            }
            if (carrera._count.estudiantes > 0) {
                throw new errors_1.ConflictError('No se puede eliminar una carrera con estudiantes inscritos');
            }
            await database_1.prisma.carrera.update({
                where: { id },
                data: { activo: false },
            });
            logger_1.default.info(`Carrera desactivada: ${carrera.nombre}`);
        }
        catch (error) {
            logger_1.default.error('Error al eliminar carrera:', error);
            throw error;
        }
    }
}
exports.CarreraService = CarreraService;
exports.default = CarreraService;
//# sourceMappingURL=carrera.service.js.map