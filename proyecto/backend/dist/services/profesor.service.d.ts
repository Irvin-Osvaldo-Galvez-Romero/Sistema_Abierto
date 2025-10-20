export declare class ProfesorService {
    static crearProfesor(data: {
        usuarioId: string;
        numeroEmpleado: string;
        especialidad: string;
        estatus?: string;
    }): Promise<{
        usuario: {
            id: string;
            email: string;
            nombre: string;
            apellidoPaterno: string;
            apellidoMaterno: string;
            telefono: string;
        };
    } & {
        id: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string;
        numeroEmpleado: string;
        especialidad: string | null;
        grado: string | null;
        departamento: string | null;
    }>;
    static obtenerProfesores(): Promise<({
        usuario: {
            id: string;
            email: string;
            nombre: string;
            apellidoPaterno: string;
            apellidoMaterno: string;
            telefono: string;
        };
    } & {
        id: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string;
        numeroEmpleado: string;
        especialidad: string | null;
        grado: string | null;
        departamento: string | null;
    })[]>;
    static obtenerProfesorPorId(id: string): Promise<{
        usuario: {
            id: string;
            email: string;
            nombre: string;
            apellidoPaterno: string;
            apellidoMaterno: string;
            telefono: string;
        };
    } & {
        id: string;
        activo: boolean;
        createdAt: Date;
        updatedAt: Date;
        usuarioId: string;
        numeroEmpleado: string;
        especialidad: string | null;
        grado: string | null;
        departamento: string | null;
    }>;
}
//# sourceMappingURL=profesor.service.d.ts.map