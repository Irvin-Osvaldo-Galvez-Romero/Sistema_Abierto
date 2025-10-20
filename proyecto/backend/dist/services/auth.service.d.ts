import { Usuario, Rol } from '@prisma/client';
interface RegisterData {
    email: string;
    password: string;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    telefono?: string;
    rol?: Rol;
    matricula?: string;
    sendEmail?: boolean;
}
interface LoginData {
    email: string;
    password: string;
}
interface AuthResponse {
    user: {
        id: string;
        email: string;
        nombre: string;
        rol: Rol;
        primerLogin?: boolean;
    };
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}
export declare class AuthService {
    static register(data: RegisterData): Promise<AuthResponse>;
    static login(data: LoginData, ipAddress?: string, userAgent?: string): Promise<AuthResponse>;
    static refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    static logout(refreshToken: string): Promise<void>;
    static getProfile(userId: string): Promise<Usuario>;
    private static logActivity;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map