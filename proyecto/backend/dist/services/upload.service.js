"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const client_1 = require("@prisma/client");
const database_1 = require("../config/database");
const errors_1 = require("../utils/errors");
const crypto_1 = require("../utils/crypto");
const logger_1 = __importDefault(require("../utils/logger"));
const uuid_1 = require("uuid");
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const scanForVirus = async (buffer, filename) => {
    logger_1.default.info(`Escaneando archivo: ${filename}`);
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.scr', '.vbs', '.js', '.jar'];
    const ext = path_1.default.extname(filename).toLowerCase();
    if (dangerousExtensions.includes(ext)) {
        return {
            clean: false,
            virusName: 'Extensión de archivo no permitida',
        };
    }
    const bufferString = buffer.toString('hex', 0, Math.min(1000, buffer.length));
    if (bufferString.startsWith('4d5a')) {
        return {
            clean: false,
            virusName: 'Archivo ejecutable detectado',
        };
    }
    return { clean: true };
};
class UploadService {
    static async uploadDocument(data) {
        try {
            const estudiante = await database_1.prisma.estudiante.findUnique({
                where: { id: data.estudianteId },
                include: {
                    usuario: true,
                },
            });
            if (!estudiante) {
                throw new errors_1.NotFoundError('Estudiante no encontrado');
            }
            const allowedMimeTypes = [
                'application/pdf',
                'image/jpeg',
                'image/jpg',
                'image/png',
            ];
            if (!allowedMimeTypes.includes(data.file.mimetype)) {
                throw new errors_1.ValidationError('Solo se permiten archivos PDF o imágenes (JPG, PNG)');
            }
            const maxSize = 10 * 1024 * 1024;
            if (data.file.size > maxSize) {
                throw new errors_1.ValidationError('El archivo no debe exceder 10MB');
            }
            const scanResult = await scanForVirus(data.file.buffer, data.file.originalname);
            if (!scanResult.clean) {
                logger_1.default.warn(`Virus detectado en archivo de ${estudiante.usuario.email}: ${scanResult.virusName}`);
                await database_1.prisma.notificacion.create({
                    data: {
                        tipo: client_1.TipoNotificacion.DOCUMENTO_RECHAZADO,
                        titulo: 'Archivo Rechazado - Virus Detectado',
                        mensaje: `Tu archivo "${data.file.originalname}" fue rechazado porque contiene malware: ${scanResult.virusName}. Por favor, verifica tu archivo y sube uno limpio.`,
                        estudianteId: data.estudianteId,
                    },
                });
                throw new errors_1.ValidationError(`Archivo rechazado: ${scanResult.virusName}`);
            }
            const hashArchivo = (0, crypto_1.generateFileHash)(data.file.buffer);
            const existingDoc = await database_1.prisma.documento.findFirst({
                where: {
                    documentosEstudiante: {
                        some: {
                            estudianteId: data.estudianteId,
                        },
                    },
                    tipo: data.tipo,
                },
            });
            if (existingDoc) {
                await database_1.prisma.documento.update({
                    where: { id: existingDoc.id },
                    data: { estatus: client_1.EstatusDocumento.ANULADO },
                });
            }
            const uploadDir = path_1.default.join(process.cwd(), 'uploads', data.estudianteId);
            await promises_1.default.mkdir(uploadDir, { recursive: true });
            const filename = `${data.tipo}_${Date.now()}${path_1.default.extname(data.file.originalname)}`;
            const filepath = path_1.default.join(uploadDir, filename);
            await promises_1.default.writeFile(filepath, data.file.buffer);
            const rutaRelativa = path_1.default.join('uploads', data.estudianteId, filename);
            const folio = `DOC-${new Date().getFullYear()}-${(0, uuid_1.v4)().slice(0, 8).toUpperCase()}`;
            const documento = await database_1.prisma.documento.create({
                data: {
                    folio,
                    tipo: data.tipo,
                    titulo: this.getTituloByTipo(data.tipo),
                    rutaArchivo: rutaRelativa,
                    hashArchivo,
                    tamanoBytes: data.file.size,
                    mimeType: data.file.mimetype,
                    estatus: client_1.EstatusDocumento.PENDIENTE,
                    creadoPorId: estudiante.usuarioId,
                },
            });
            const docEstudiante = await database_1.prisma.documentoEstudiante.create({
                data: {
                    documentoId: documento.id,
                    estudianteId: data.estudianteId,
                    escaneoVirus: true,
                    virusDetectado: false,
                },
            });
            await database_1.prisma.notificacion.create({
                data: {
                    tipo: client_1.TipoNotificacion.DOCUMENTO_PENDIENTE,
                    titulo: 'Documento Subido Exitosamente',
                    mensaje: `Tu ${this.getTituloByTipo(data.tipo)} ha sido subido y está pendiente de revisión.`,
                    documentoId: documento.id,
                    estudianteId: data.estudianteId,
                },
            });
            logger_1.default.info(`Documento subido: ${folio} - Estudiante: ${estudiante.matricula}`);
            return {
                documento,
                docEstudiante,
                message: 'Documento subido exitosamente y está pendiente de revisión',
            };
        }
        catch (error) {
            logger_1.default.error('Error al subir documento:', error);
            throw error;
        }
    }
    static async getStudentDocuments(estudianteId) {
        try {
            const documentos = await database_1.prisma.documento.findMany({
                where: {
                    documentosEstudiante: {
                        some: {
                            estudianteId,
                        },
                    },
                    estatus: {
                        not: client_1.EstatusDocumento.ANULADO,
                    },
                },
                include: {
                    documentosEstudiante: {
                        where: {
                            estudianteId,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
                },
            });
            const tiposRequeridos = [
                client_1.TipoDocumento.KARDEX,
                client_1.TipoDocumento.FICHA_REINSCRIPCION,
                client_1.TipoDocumento.COMPROBANTE_PAGO,
            ];
            const tiposSubidos = documentos.map((doc) => doc.tipo);
            const tiposFaltantes = tiposRequeridos.filter((tipo) => !tiposSubidos.includes(tipo));
            return {
                documentos,
                tiposFaltantes,
                completo: tiposFaltantes.length === 0,
            };
        }
        catch (error) {
            logger_1.default.error('Error al obtener documentos del estudiante:', error);
            throw error;
        }
    }
    static async reviewDocument(documentoId, aprobado, revisadoPor, motivoRechazo) {
        try {
            const documento = await database_1.prisma.documento.findUnique({
                where: { id: documentoId },
                include: {
                    documentosEstudiante: {
                        include: {
                            estudiante: true,
                        },
                    },
                },
            });
            if (!documento) {
                throw new errors_1.NotFoundError('Documento no encontrado');
            }
            const nuevoEstatus = aprobado ? client_1.EstatusDocumento.APROBADO : client_1.EstatusDocumento.RECHAZADO;
            await database_1.prisma.documento.update({
                where: { id: documentoId },
                data: {
                    estatus: nuevoEstatus,
                    validado: aprobado,
                },
            });
            await database_1.prisma.documentoEstudiante.updateMany({
                where: { documentoId },
                data: {
                    revisadoPor,
                    fechaRevision: new Date(),
                    motivoRechazo: aprobado ? null : motivoRechazo,
                },
            });
            const estudianteId = documento.documentosEstudiante[0]?.estudianteId;
            if (estudianteId) {
                await database_1.prisma.notificacion.create({
                    data: {
                        tipo: aprobado ? client_1.TipoNotificacion.DOCUMENTO_APROBADO : client_1.TipoNotificacion.DOCUMENTO_RECHAZADO,
                        titulo: aprobado ? 'Documento Aprobado' : 'Documento Rechazado',
                        mensaje: aprobado
                            ? `Tu ${documento.titulo} ha sido aprobado exitosamente.`
                            : `Tu ${documento.titulo} ha sido rechazado. Motivo: ${motivoRechazo}. Por favor, sube un nuevo archivo.`,
                        documentoId,
                        estudianteId,
                    },
                });
            }
            logger_1.default.info(`Documento ${documento.folio} ${aprobado ? 'aprobado' : 'rechazado'}`);
        }
        catch (error) {
            logger_1.default.error('Error al revisar documento:', error);
            throw error;
        }
    }
    static getTituloByTipo(tipo) {
        const titulos = {
            KARDEX: 'Kardex',
            FICHA_REINSCRIPCION: 'Ficha de Reinscripción',
            COMPROBANTE_PAGO: 'Comprobante de Pago',
        };
        return titulos[tipo] || 'Documento';
    }
}
exports.UploadService = UploadService;
exports.default = UploadService;
//# sourceMappingURL=upload.service.js.map