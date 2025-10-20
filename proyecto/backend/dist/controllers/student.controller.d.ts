import { Request, Response, NextFunction } from 'express';
export declare class StudentController {
    static create(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getById(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getByMatricula(req: Request, res: Response, next: NextFunction): Promise<void>;
    static getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
    static update(req: Request, res: Response, next: NextFunction): Promise<void>;
    static darDeBaja(req: Request, res: Response, next: NextFunction): Promise<void>;
    static deletePermanently(req: Request, res: Response, next: NextFunction): Promise<void>;
    static delete(req: Request, res: Response, next: NextFunction): Promise<void>;
    static generateMatricula(req: Request, res: Response, next: NextFunction): Promise<void>;
    static search(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default StudentController;
//# sourceMappingURL=student.controller.d.ts.map