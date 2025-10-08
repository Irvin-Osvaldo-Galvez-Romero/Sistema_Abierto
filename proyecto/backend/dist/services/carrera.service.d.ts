import { Carrera, Modalidad } from '@prisma/client';
interface CreateCarreraData {
    clave: string;
    nombre: string;
    descripcion?: string;
    duracionSemestres: number;
    creditos: number;
    modalidad: Modalidad;
}
interface UpdateCarreraData {
    clave?: string;
    nombre?: string;
    descripcion?: string;
    duracionSemestres?: number;
    creditos?: number;
    modalidad?: Modalidad;
    activo?: boolean;
}
export declare class CarreraService {
    static create(data: CreateCarreraData): Promise<Carrera>;
    static findAll(includeInactive?: boolean): Promise<Carrera[]>;
    static findById(id: string): Promise<Carrera>;
    static update(id: string, data: UpdateCarreraData): Promise<Carrera>;
    static delete(id: string): Promise<void>;
}
export default CarreraService;
//# sourceMappingURL=carrera.service.d.ts.map