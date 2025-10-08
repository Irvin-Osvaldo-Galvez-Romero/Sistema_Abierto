import { TipoDocumento } from '@prisma/client';
interface UploadDocumentData {
    estudianteId: string;
    tipo: TipoDocumento;
    file: Express.Multer.File;
}
export declare class UploadService {
    static uploadDocument(data: UploadDocumentData): Promise<any>;
    static getStudentDocuments(estudianteId: string): Promise<any>;
    static reviewDocument(documentoId: string, aprobado: boolean, revisadoPor: string, motivoRechazo?: string): Promise<void>;
    private static getTituloByTipo;
}
export default UploadService;
//# sourceMappingURL=upload.service.d.ts.map