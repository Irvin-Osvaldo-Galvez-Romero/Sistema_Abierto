import { Estudiante, EstatusEstudiante } from '@prisma/client';
interface CreateStudentData {
    usuarioId: string;
    matricula: string;
    fechaNacimiento?: Date;
    curp?: string;
    nss?: string;
    direccion?: string;
    ciudad?: string;
    estado?: string;
    codigoPostal?: string;
    tutorNombre?: string;
    tutorTelefono?: string;
    tutorEmail?: string;
    carreraId?: string;
    estatus?: EstatusEstudiante;
}
interface UpdateStudentData {
    fechaNacimiento?: Date;
    curp?: string;
    nss?: string;
    direccion?: string;
    ciudad?: string;
    estado?: string;
    codigoPostal?: string;
    tutorNombre?: string;
    tutorTelefono?: string;
    tutorEmail?: string;
    estatus?: EstatusEstudiante;
    carreraId?: string;
}
export declare class StudentService {
    static create(data: CreateStudentData): Promise<Estudiante>;
    static findAll(page?: number, limit?: number, estatus?: EstatusEstudiante): Promise<{
        estudiantes: Estudiante[];
        total: number;
        pages: number;
    }>;
    static findById(id: string): Promise<Estudiante>;
    static findByMatricula(matricula: string): Promise<Estudiante>;
    static findByUserId(usuarioId: string): Promise<Estudiante>;
    static update(id: string, data: UpdateStudentData): Promise<Estudiante>;
    static darDeBaja(id: string): Promise<void>;
    static deletePermanently(id: string): Promise<void>;
    static delete(id: string): Promise<void>;
    static generateMatricula(): Promise<string>;
    static search(query: string): Promise<Estudiante[]>;
}
export default StudentService;
//# sourceMappingURL=student.service.d.ts.map