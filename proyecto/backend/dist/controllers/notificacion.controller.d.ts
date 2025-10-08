import { Request, Response, NextFunction } from 'express';
export declare class NotificacionController {
    static getMyNotifications(req: Request, res: Response, next: NextFunction): Promise<void>;
    static markAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
    static markAllAsRead(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export default NotificacionController;
//# sourceMappingURL=notificacion.controller.d.ts.map