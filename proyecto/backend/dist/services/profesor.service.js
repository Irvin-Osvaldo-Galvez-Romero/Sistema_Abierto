"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfesorService = void 0;
const database_1 = __importDefault(require("../config/database"));
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class ProfesorService {
    static async crearProfesor(data) {
        try {
            const usuario = await database_1.default.usuario.findUnique({
                where: { id: data.usuarioId },
            });
            if (!usuario) {
                throw new errors_1.AppError('Usuario no encontrado', 404);
            }
            if (usuario.rol !== 'PROFESOR') {
                throw new errors_1.AppError('El usuario no tiene rol de profesor', 400);
            }
            const existing = await database_1.default.profesor.findUnique({
                where: { numeroEmpleado: data.numeroEmpleado },
            });
            if (existing) {
                throw new errors_1.AppError('Ya existe un profesor con ese número de empleado', 400);
            }
            const profesor = await database_1.default.profesor.create({
                data: {
                    usuarioId: data.usuarioId,
                    numeroEmpleado: data.numeroEmpleado,
                    especialidad: data.especialidad,
                    activo: true,
                },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            apellidoPaterno: true,
                            apellidoMaterno: true,
                            email: true,
                            telefono: true,
                        },
                    },
                },
            });
            logger_1.default.info('Profesor creado exitosamente', { profesorId: profesor.id });
            return profesor;
        }
        catch (error) {
            if (error instanceof errors_1.AppError)
                throw error;
            logger_1.default.error('Error al crear profesor', { error });
            throw new errors_1.AppError('Error al crear el profesor', 500);
        }
    }
    static async obtenerProfesores() {
        try {
            const profesores = await database_1.default.profesor.findMany({
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            apellidoPaterno: true,
                            apellidoMaterno: true,
                            email: true,
                            telefono: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            return profesores;
        }
        catch (error) {
            logger_1.default.error('Error al obtener profesores', { error });
            throw new errors_1.AppError('Error al obtener los profesores', 500);
        }
    }
    static async obtenerProfesorPorId(id) {
        try {
            const profesor = await database_1.default.profesor.findUnique({
                where: { id },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            nombre: true,
                            apellidoPaterno: true,
                            apellidoMaterno: true,
                            email: true,
                            telefono: true,
                        },
                    },
                },
            });
            if (!profesor) {
                throw new errors_1.AppError('Profesor no encontrado', 404);
            }
            return profesor;
        }
        catch (error) {
            if (error instanceof errors_1.AppError)
                throw error;
            logger_1.default.error('Error al obtener profesor', { error, profesorId: id });
            throw new errors_1.AppError('Error al obtener el profesor', 500);
        }
    }
}
exports.ProfesorService = ProfesorService;
//# sourceMappingURL=profesor.service.js.map