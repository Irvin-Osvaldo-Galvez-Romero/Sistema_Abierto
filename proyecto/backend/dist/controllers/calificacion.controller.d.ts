import { Request, Response, NextFunction } from 'express';
export declare class CalificacionController {
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getByEstudiante(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMyCalificaciones(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getPromedio(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default CalificacionController;
//# sourceMappingURL=calificacion.controller.d.ts.map