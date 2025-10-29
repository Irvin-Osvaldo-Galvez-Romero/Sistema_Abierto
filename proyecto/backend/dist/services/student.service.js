"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
const client_1 = require("@prisma/client");
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const logger_1 = __importDefault(require("../utils/logger"));
class StudentService {
    static async create(data) {
        try {
            const existingStudent = await database_1.prisma.estudiante.findUnique({
                where: { matricula: data.matricula },
            });
            if (existingStudent) {
                throw new errors_1.ConflictError('La matrícula ya está registrada');
            }
            const existingProfile = await database_1.prisma.estudiante.findUnique({
                where: { usuarioId: data.usuarioId },
            });
            if (existingProfile) {
                throw new errors_1.ConflictError('El usuario ya tiene un perfil de estudiante');
            }
            if (data.carreraId) {
                const carrera = await database_1.prisma.carrera.findUnique({
                    where: { id: data.carreraId },
                });
                if (!carrera) {
                    throw new errors_1.NotFoundError('La carrera no existe');
                }
            }
            const createData = {
                usuarioId: data.usuarioId,
                matricula: data.matricula,
                estatus: data.estatus || client_1.EstatusEstudiante.ACTIVO,
            };
            if (data.fechaNacimiento) {
                createData.fechaNacimiento = new Date(data.fechaNacimiento);
            }
            if (data.carreraId) {
                createData.carreraId = data.carreraId;
            }
            if (data.curp)
                createData.curp = data.curp;
            if (data.nss)
                createData.nss = data.nss;
            if (data.direccion)
                createData.direccion = data.direccion;
            if (data.ciudad)
                createData.ciudad = data.ciudad;
            if (data.estado)
                createData.estado = data.estado;
            if (data.codigoPostal)
                createData.codigoPostal = data.codigoPostal;
            if (data.tutorNombre)
                createData.tutorNombre = data.tutorNombre;
            if (data.tutorTelefono)
                createData.tutorTelefono = data.tutorTelefono;
            if (data.tutorEmail)
                createData.tutorEmail = data.tutorEmail;
            const estudiante = await database_1.prisma.estudiante.create({
                data: createData,
                include: {
                    usuario: {
                        select: {
                            id: true,
                            email: true,
                            nombre: true,
                            apellidoPaterno: true,
                            apellidoMaterno: true,
                        },
                    },
                    carrera: true,
                },
            });
            logger_1.default.info(`Estudiante creado: ${estudiante.matricula}`);
            return estudiante;
        }
        catch (error) {
            logger_1.default.error('Error al crear estudiante:', error);
            throw error;
        }
    }
    static async findAll(page = 1, limit = 10, estatus) {
        try {
            const skip = (page - 1) * limit;
            const where = estatus ? { estatus } : {};
            const [estudiantes, total] = await Promise.all([
                database_1.prisma.estudiante.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        usuario: {
                            select: {
                                id: true,
                                email: true,
                                nombre: true,
                                apellidoPaterno: true,
                                apellidoMaterno: true,
                                telefono: true,
                            },
                        },
                        carrera: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                database_1.prisma.estudiante.count({ where }),
            ]);
            const pages = Math.ceil(total / limit);
            return { estudiantes, total, pages };
        }
        catch (error) {
            logger_1.default.error('Error al obtener estudiantes:', error);
            throw error;
        }
    }
    static async findById(id) {
        try {
            const estudiante = await database_1.prisma.estudiante.findUnique({
                where: { id },
                include: {
                    usuario: {
                        select: {
                            id: true,
                            email: true,
                            nombre: true,
                            apellidoPaterno: true,
                            apellidoMaterno: true,
                            telefono: true,
                        },
                    },
                    carrera: true,
                    documentos: {
                        include: {
                            documento: {
                                select: {
                                    id: true,
                                    folio: true,
                                    tipo: true,
                                    titulo: true,
                                    estatus: true,
                                    rutaArchivo: true,
                                    mimeType: true,
                                    tamanoBytes: true,
                                    createdAt: true,
                                    updatedAt: true,
                                },
                            },
                        },
                        orderBy: {
                            documento: {
                                createdAt: 'desc',
                            },
                        },
                    },
                    inscripciones: {
                        include: {
                            grupo: {
                                include: {
                                    materia: true,
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
                    calificaciones: {
                        include: {
                            materia: true,
                        },
                    },
                },
            });
            if (!estudiante) {
                throw new errors_1.NotFoundError('Estudiante no encontrado');
            }
            return estudiante;
        }
        catch (error) {
            logger_1.default.error('Error al obtener estudiante:', error);
            throw error;
        }
    }
    static async findByMatricula(matricula) {
        try {
            const estudiante = await database_1.prisma.estudiante.findUnique({
                where: { matricula },
                include: {
                    usuario: true,
                    carrera: true,
                },
            });
            if (!estudiante) {
                throw new errors_1.NotFoundError('Estudiante no encontrado');
            }
            return estudiante;
        }
        catch (error) {
            logger_1.default.error('Error al obtener estudiante por matrícula:', error);
            throw error;
        }
    }
    static async findByUserId(usuarioId) {
        try {
            const estudiante = await database_1.prisma.estudiante.findUnique({
                where: { usuarioId },
                include: {
                    usuario: true,
                    carrera: true,
                },
            });
            if (!estudiante) {
                throw new errors_1.NotFoundError('Perfil de estudiante no encontrado');
            }
            return estudiante;
        }
        catch (error) {
            logger_1.default.error('Error al obtener estudiante por usuario:', error);
            throw error;
        }
    }
    static async update(id, data) {
        try {
            const existing = await database_1.prisma.estudiante.findUnique({
                where: { id },
            });
            if (!existing) {
                throw new errors_1.NotFoundError('Estudiante no encontrado');
            }
            if (data.carreraId) {
                const carrera = await database_1.prisma.carrera.findUnique({
                    where: { id: data.carreraId },
                });
                if (!carrera) {
                    throw new errors_1.NotFoundError('La carrera no existe');
                }
            }
            const estudiante = await database_1.prisma.estudiante.update({
                where: { id },
                data: {
                    ...data,
                    fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
                },
                include: {
                    usuario: true,
                    carrera: true,
                },
            });
            logger_1.default.info(`Estudiante actualizado: ${estudiante.matricula}`);
            return estudiante;
        }
        catch (error) {
            logger_1.default.error('Error al actualizar estudiante:', error);
            throw error;
        }
    }
    static async darDeBaja(id) {
        try {
            const estudiante = await database_1.prisma.estudiante.findUnique({
                where: { id },
            });
            if (!estudiante) {
                throw new errors_1.NotFoundError('Estudiante no encontrado');
            }
            await database_1.prisma.estudiante.update({
                where: { id },
                data: {
                    estatus: client_1.EstatusEstudiante.BAJA_DEFINITIVA,
                },
            });
            logger_1.default.info(`Estudiante dado de baja: ${estudiante.matricula}`);
        }
        catch (error) {
            logger_1.default.error('Error al dar de baja estudiante:', error);
            throw error;
        }
    }
    static async deletePermanently(id) {
        try {
            const estudiante = await database_1.prisma.estudiante.findUnique({
                where: { id },
                include: {
                    usuario: true,
                },
            });
            if (!estudiante) {
                throw new errors_1.NotFoundError('Estudiante no encontrado');
            }
            const usuarioId = estudiante.usuarioId;
            await database_1.prisma.documentoEstudiante.deleteMany({
                where: { estudianteId: id },
            });
            await database_1.prisma.documento.deleteMany({
                where: {
                    documentosEstudiante: {
                        some: { estudianteId: id },
                    },
                },
            });
            await database_1.prisma.estudiante.delete({
                where: { id },
            });
            await database_1.prisma.tokenSesion.deleteMany({
                where: { usuarioId },
            });
            await database_1.prisma.actividadUsuario.deleteMany({
                where: { usuarioId },
            });
            await database_1.prisma.usuario.delete({
                where: { id: usuarioId },
            });
            logger_1.default.info(`Estudiante eliminado permanentemente: ${estudiante.matricula}`);
        }
        catch (error) {
            logger_1.default.error('Error al eliminar estudiante permanentemente:', error);
            throw error;
        }
    }
    static async delete(id) {
        return this.darDeBaja(id);
    }
    static async generateMatricula() {
        try {
            const year = new Date().getFullYear();
            const lastStudent = await database_1.prisma.estudiante.findFirst({
                where: {
                    matricula: {
                        startsWith: year.toString(),
                    },
                },
                orderBy: {
                    matricula: 'desc',
                },
            });
            let nextNumber = 1;
            if (lastStudent) {
                const lastNumber = parseInt(lastStudent.matricula.slice(-6));
                nextNumber = lastNumber + 1;
            }
            const matricula = `${year}${nextNumber.toString().padStart(6, '0')}`;
            return matricula;
        }
        catch (error) {
            logger_1.default.error('Error al generar matrícula:', error);
            throw error;
        }
    }
    static async search(query) {
        try {
            const estudiantes = await database_1.prisma.estudiante.findMany({
                where: {
                    OR: [
                        { matricula: { contains: query } },
                        { usuario: { nombre: { contains: query } } },
                        { usuario: { apellidoPaterno: { contains: query } } },
                        { usuario: { email: { contains: query } } },
                    ],
                },
                include: {
                    usuario: true,
                    carrera: true,
                },
                take: 20,
            });
            return estudiantes;
        }
        catch (error) {
            logger_1.default.error('Error al buscar estudiantes:', error);
            throw error;
        }
    }
}
exports.StudentService = StudentService;
exports.default = StudentService;
//# sourceMappingURL=student.service.js.map