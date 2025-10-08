import { Request, Response, NextFunction } from 'express';
export declare class UploadController {
    static uploadDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMyDocuments(req: Request, res: Response, next: NextFunction): Promise<void>;
    static reviewDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
    static downloadDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
    static viewDocument(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default UploadController;
//# sourceMappingURL=upload.controller.d.ts.map