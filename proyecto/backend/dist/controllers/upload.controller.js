"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const upload_service_1 = require("../services/upload.service");
const client_1 = require("@prisma/client");
const errors_1 = require("../utils/errors");
class UploadController {
    static async uploadDocument(req, res, next) {
        try {
            if (!req.file) {
                throw new errors_1.ValidationError('No se proporcionó ningún archivo');
            }
            if (!req.user) {
                res.status(401).json({ success: false, message: 'No autenticado' });
                return;
            }
            const estudiante = await database_1.prisma.estudiante.findUnique({
                where: { usuarioId: req.user.userId },
            });
            if (!estudiante) {
                res.status(404).json({ success: false, message: 'Perfil de estudiante no encontrado' });
                return;
            }
            const tipo = req.body.tipo;
            if (!tipo || !Object.values(client_1.TipoDocumento).includes(tipo)) {
                throw new errors_1.ValidationError('Tipo de documento inválido. Debe ser: KARDEX, FICHA_REINSCRIPCION o COMPROBANTE_PAGO');
            }
            const result = await upload_service_1.UploadService.uploadDocument({
                estudianteId: estudiante.id,
                tipo,
                file: req.file,
            });
            res.status(201).json({
                success: true,
                message: result.message,
                data: result.documento,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async getMyDocuments(req, res, next) {
        try {
            if (!req.user) {
                res.status(401).json({ success: false, message: 'No autenticado' });
                return;
            }
            const estudiante = await database_1.prisma.estudiante.findUnique({
                where: { usuarioId: req.user.userId },
            });
            if (!estudiante) {
                res.status(404).json({ success: false, message: 'Perfil de estudiante no encontrado' });
                return;
            }
            const result = await upload_service_1.UploadService.getStudentDocuments(estudiante.id);
            res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async reviewDocument(req, res, next) {
        try {
            const { id } = req.params;
            const { aprobado, motivoRechazo } = req.body;
            if (typeof aprobado !== 'boolean') {
                throw new errors_1.ValidationError('El campo "aprobado" es requerido y debe ser boolean');
            }
            if (!aprobado && !motivoRechazo) {
                throw new errors_1.ValidationError('Debes proporcionar un motivo de rechazo');
            }
            await upload_service_1.UploadService.reviewDocument(id, aprobado, req.user?.userId || 'admin', motivoRechazo);
            res.status(200).json({
                success: true,
                message: aprobado ? 'Documento aprobado exitosamente' : 'Documento rechazado',
            });
        }
        catch (error) {
            next(error);
        }
    }
    static async downloadDocument(req, res, next) {
        try {
            const { id } = req.params;
            const documento = await database_1.prisma.documento.findUnique({
                where: { id },
            });
            if (!documento) {
                res.status(404).send('Documento no encontrado');
                return;
            }
            const path = require('path');
            const fs = require('fs');
            const filePath = path.join(process.cwd(), documento.rutaArchivo);
            if (!fs.existsSync(filePath)) {
                res.status(404).send('Archivo no encontrado');
                return;
            }
            const extension = documento.mimeType.split('/')[1] || 'pdf';
            const filename = `${documento.folio}_${documento.tipo}.${extension}`;
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Type', documento.mimeType);
            fs.createReadStream(filePath).pipe(res);
        }
        catch (error) {
            res.status(500).send('Error al descargar el documento');
        }
    }
    static async viewDocument(req, res, next) {
        try {
            const { id } = req.params;
            const documento = await database_1.prisma.documento.findUnique({
                where: { id },
            });
            if (!documento) {
                res.status(404).send('Documento no encontrado');
                return;
            }
            const path = require('path');
            const fs = require('fs');
            const filePath = path.join(process.cwd(), documento.rutaArchivo);
            if (!fs.existsSync(filePath)) {
                res.status(404).send('Archivo no encontrado');
                return;
            }
            res.setHeader('Content-Type', documento.mimeType);
            res.setHeader('Content-Disposition', 'inline');
            fs.createReadStream(filePath).pipe(res);
        }
        catch (error) {
            res.status(500).send('Error al cargar el documento');
        }
    }
}
exports.UploadController = UploadController;
const database_1 = require("../config/database");
exports.default = UploadController;
//# sourceMappingURL=upload.controller.js.map