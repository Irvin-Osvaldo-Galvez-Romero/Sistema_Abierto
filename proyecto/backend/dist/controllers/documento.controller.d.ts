import { Request, Response, NextFunction } from 'express';
export declare class DocumentoController {
    static getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static updateEstatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    static delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default DocumentoController;
//# sourceMappingURL=documento.controller.d.ts.map