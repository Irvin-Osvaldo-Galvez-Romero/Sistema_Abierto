import { Usuario, Rol } from '@prisma/client';
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
    static login(data: LoginData, ipAddress?: string, userAgent?: string): Promise<AuthResponse>;
    static refreshAccessToken(refreshToken: string): Promise<{
        accessToken: string;
    }>;
    static logout(refreshToken: string): Promise<void>;
    static getProfile(userId: string): Promise<Usuario>;
    static forgotPassword(email: string): Promise<void>;
    static resetPassword(token: string, newPassword: string): Promise<void>;
    static sendVerificationCode(email: string): Promise<void>;
    static verifyCode(email: string, code: string): Promise<{
        valid: boolean;
        token?: string;
    }>;
    static resetPasswordWithCode(email: string, code: string, newPassword: string): Promise<void>;
    private static logActivity;
}
export {};
//# sourceMappingURL=auth.service.d.ts.map