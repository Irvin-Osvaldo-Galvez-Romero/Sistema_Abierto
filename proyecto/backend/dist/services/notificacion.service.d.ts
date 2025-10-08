import { Notificacion } from '@prisma/client';
export declare class NotificacionService {
    static getByEstudiante(estudianteId: string, soloNoLeidas?: boolean): Promise<Notificacion[]>;
    static markAsRead(id: string): Promise<void>;
    static markAllAsRead(estudianteId: string): Promise<void>;
    static countUnread(estudianteId: string): Promise<number>;
}
export default NotificacionService;
//# sourceMappingURL=notificacion.service.d.ts.map