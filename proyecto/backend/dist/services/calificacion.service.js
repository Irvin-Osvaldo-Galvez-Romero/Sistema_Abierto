"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalificacionService = void 0;
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
const library_1 = require("@prisma/client/runtime/library");
class CalificacionService {
    static async create(data) {
        try {
            if (data.calificacion < 0 || data.calificacion > 10) {
                throw new errors_1.ValidationError('La calificación debe estar entre 0 y 10');
            }
            const inscripcion = await database_1.prisma.inscripcion.findUnique({
                where: { id: data.inscripcionId },
            });
            if (!inscripcion) {
                throw new errors_1.NotFoundError('Inscripción no encontrada');
            }
            const existing = await database_1.prisma.calificacion.findUnique({
                where: { inscripcionId: data.inscripcionId },
            });
            if (existing) {
                throw new errors_1.ValidationError('Ya existe una calificación para esta inscripción');
            }
            const calificacion = await database_1.prisma.calificacion.create({
                data: {
                    calificacion: new library_1.Decimal(data.calificacion),
                    estatus: data.estatus,
                    observaciones: data.observaciones,
                    estudianteId: data.estudianteId,
                    materiaId: data.materiaId,
                    inscripcionId: data.inscripcionId,
                },
                include: {
                    materia: true,
                    estudiante: {
                        include: {
                            usuario: {
                                select: {
                                    nombre: true,
                                    apellidoPaterno: true,
                                },
                            },
                        },
                    },
                },
            });
            logger_1.default.info(`Calificación creada para estudiante ${data.estudianteId}`);
            return calificacion;
        }
        catch (error) {
            logger_1.default.error('Error al crear calificación:', error);
            throw error;
        }
    }
    static async findByEstudiante(estudianteId) {
        try {
            const calificaciones = await database_1.prisma.calificacion.findMany({
                where: { estudianteId },
                include: {
                    materia: {
                        include: {
                            carrera: true,
                        },
                    },
                    inscripcion: {
                        include: {
                            grupo: {
                                include: {
                                    profesor: {
                                        include: {
                                            usuario: {
                                                select: {
                                                    nombre: true,
                                                    apellidoPaterno: true,
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return calificaciones;
        }
        catch (error) {
            logger_1.default.error('Error al obtener calificaciones:', error);
            throw error;
        }
    }
    static async update(id, calificacion, observaciones) {
        try {
            if (calificacion < 0 || calificacion > 10) {
                throw new errors_1.ValidationError('La calificación debe estar entre 0 y 10');
            }
            const updated = await database_1.prisma.calificacion.update({
                where: { id },
                data: {
                    calificacion: new library_1.Decimal(calificacion),
                    observaciones,
                },
                include: {
                    materia: true,
                    estudiante: {
                        include: {
                            usuario: true,
                        },
                    },
                },
            });
            logger_1.default.info(`Calificación actualizada: ${id}`);
            return updated;
        }
        catch (error) {
            logger_1.default.error('Error al actualizar calificación:', error);
            throw error;
        }
    }
    static async calculatePromedio(estudianteId) {
        try {
            const calificaciones = await database_1.prisma.calificacion.findMany({
                where: {
                    estudianteId,
                    estatus: 'APROBADO',
                },
            });
            if (calificaciones.length === 0) {
                return 0;
            }
            const sum = calificaciones.reduce((acc, cal) => acc + parseFloat(cal.calificacion.toString()), 0);
            return parseFloat((sum / calificaciones.length).toFixed(2));
        }
        catch (error) {
            logger_1.default.error('Error al calcular promedio:', error);
            throw error;
        }
    }
}
exports.CalificacionService = CalificacionService;
exports.default = CalificacionService;
//# sourceMappingURL=calificacion.service.js.map