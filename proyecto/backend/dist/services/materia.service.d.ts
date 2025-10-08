import { Materia } from '@prisma/client';
interface CreateMateriaData {
    clave: string;
    nombre: string;
    descripcion?: string;
    creditos: number;
    semestre: number;
    horasTeoria: number;
    horasPractica: number;
    carreraId: string;
}
export declare class MateriaService {
    static create(data: CreateMateriaData): Promise<Materia>;
    static findAll(carreraId?: string): Promise<Materia[]>;
    static findById(id: string): Promise<Materia>;
    static update(id: string, data: Partial<CreateMateriaData>): Promise<Materia>;
    static delete(id: string): Promise<void>;
}
export default MateriaService;
//# sourceMappingURL=materia.service.d.ts.map