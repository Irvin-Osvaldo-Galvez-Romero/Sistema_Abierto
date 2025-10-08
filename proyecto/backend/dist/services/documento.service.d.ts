import { Documento, TipoDocumento, EstatusDocumento } from '@prisma/client';
interface CreateDocumentoData {
    tipo: TipoDocumento;
    titulo: string;
    descripcion?: string;
    rutaArchivo: string;
    tamanoBytes: number;
    mimeType: string;
    creadoPorId: string;
    estudianteIds?: string[];
}
export declare class DocumentoService {
    static create(data: CreateDocumentoData, buffer: Buffer): Promise<Documento>;
    static findAll(page?: number, limit?: number, estudianteId?: string): Promise<{
        documentos: any[];
        total: number;
        pages: number;
    }>;
    static findById(id: string): Promise<Documento>;
    static updateEstatus(id: string, estatus: EstatusDocumento): Promise<Documento>;
    static delete(id: string): Promise<void>;
}
export default DocumentoService;
//# sourceMappingURL=documento.service.d.ts.map