import { Request, Response, NextFunction } from 'express';
export declare class MateriaController {
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Request, res: Response, next: NextFunction): Promise<void>;
    static delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default MateriaController;
//# sourceMappingURL=materia.controller.d.ts.map