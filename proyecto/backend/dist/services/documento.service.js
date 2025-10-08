"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentoService = void 0;
const client_1 = require("@prisma/client");
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const crypto_1 = require("../utils/crypto");
const logger_1 = __importDefault(require("../utils/logger"));
const uuid_1 = require("uuid");
class DocumentoService {
    static async create(data, buffer) {
        try {
            const folio = `DOC-${new Date().getFullYear()}-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
            const hashArchivo = (0, crypto_1.generateFileHash)(buffer);
            const documento = await database_1.prisma.documento.create({
                data: {
                    folio,
                    tipo: data.tipo,
                    titulo: data.titulo,
                    descripcion: data.descripcion,
                    rutaArchivo: data.rutaArchivo,
                    hashArchivo,
                    tamanoBytes: data.tamanoBytes,
                    mimeType: data.mimeType,
                    creadoPorId: data.creadoPorId,
                },
            });
            if (data.estudianteIds && data.estudianteIds.length > 0) {
                await Promise.all(data.estudianteIds.map((estudianteId) => database_1.prisma.documentoEstudiante.create({
                    data: {
                        documentoId: documento.id,
                        estudianteId,
                    },
                })));
            }
            logger_1.default.info(`Documento creado: ${documento.folio}`);
            return documento;
        }
        catch (error) {
            logger_1.default.error('Error al crear documento:', error);
            throw error;
        }
    }
    static async findAll(page = 1, limit = 10, estudianteId) {
        try {
            const skip = (page - 1) * limit;
            const where = estudianteId
                ? { documentosEstudiante: { some: { estudianteId } } }
                : {};
            const [documentos, total] = await Promise.all([
                database_1.prisma.documento.findMany({
                    where,
                    skip,
                    take: limit,
                    include: {
                        creadoPor: {
                            select: {
                                nombre: true,
                                apellidoPaterno: true,
                                email: true,
                            },
                        },
                        documentosEstudiante: {
                            include: {
                                estudiante: {
                                    select: {
                                        matricula: true,
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
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                database_1.prisma.documento.count({ where }),
            ]);
            const pages = Math.ceil(total / limit);
            return { documentos, total, pages };
        }
        catch (error) {
            logger_1.default.error('Error al obtener documentos:', error);
            throw error;
        }
    }
    static async findById(id) {
        try {
            const documento = await database_1.prisma.documento.findUnique({
                where: { id },
                include: {
                    creadoPor: true,
                    documentosEstudiante: {
                        include: {
                            estudiante: {
                                include: {
                                    usuario: true,
                                },
                            },
                        },
                    },
                },
            });
            if (!documento) {
                throw new errors_1.NotFoundError('Documento no encontrado');
            }
            return documento;
        }
        catch (error) {
            logger_1.default.error('Error al obtener documento:', error);
            throw error;
        }
    }
    static async updateEstatus(id, estatus) {
        try {
            const documento = await database_1.prisma.documento.update({
                where: { id },
                data: { estatus },
            });
            logger_1.default.info(`Documento ${documento.folio} actualizado a estatus: ${estatus}`);
            return documento;
        }
        catch (error) {
            logger_1.default.error('Error al actualizar estatus:', error);
            throw error;
        }
    }
    static async delete(id) {
        try {
            await database_1.prisma.documento.update({
                where: { id },
                data: { estatus: client_1.EstatusDocumento.ANULADO },
            });
            logger_1.default.info(`Documento anulado: ${id}`);
        }
        catch (error) {
            logger_1.default.error('Error al eliminar documento:', error);
            throw error;
        }
    }
}
exports.DocumentoService = DocumentoService;
exports.default = DocumentoService;
//# sourceMappingURL=documento.service.js.map