import { Calificacion } from '@prisma/client';
interface CreateCalificacionData {
    calificacion: number;
    estatus: string;
    observaciones?: string;
    estudianteId: string;
    materiaId: string;
    inscripcionId: string;
}
export declare class CalificacionService {
    static create(data: CreateCalificacionData): Promise<Calificacion>;
    static findByEstudiante(estudianteId: string): Promise<Calificacion[]>;
    static update(id: string, calificacion: number, observaciones?: string): Promise<Calificacion>;
    static calculatePromedio(estudianteId: string): Promise<number>;
}
export default CalificacionService;
//# sourceMappingURL=calificacion.service.d.ts.map