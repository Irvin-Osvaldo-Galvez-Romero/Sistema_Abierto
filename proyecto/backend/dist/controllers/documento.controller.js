"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentoController = void 0;
const documento_service_1 = require("../services/documento.service");
class DocumentoController {
    static async getAll(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const estudianteId = req.query.estudianteId;
            const result = await documento_service_1.DocumentoService.findAll(page, limit, estudianteId);
            res.status(200).json({
                success: true,
                data: result.documentos,
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
            const documento = await documento_service_1.DocumentoService.findById(req.params.id);
            res.status(200).json({ success: true, data: documento });
        }
        catch (error) {
            next(error);
        }
    }
    static async updateEstatus(req, res, next) {
        try {
            const { estatus } = req.body;
            const documento = await documento_service_1.DocumentoService.updateEstatus(req.params.id, estatus);
            res.status(200).json({ success: true, data: documento });
        }
        catch (error) {
            next(error);
        }
    }
    static async delete(req, res, next) {
        try {
            await documento_service_1.DocumentoService.delete(req.params.id);
            res.status(200).json({ success: true, message: 'Documento anulado' });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DocumentoController = DocumentoController;
exports.default = DocumentoController;
//# sourceMappingURL=documento.controller.js.map