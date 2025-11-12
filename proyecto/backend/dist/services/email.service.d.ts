interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
interface CredentialsData {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    password: string;
    matricula?: string;
    tipo: 'ESTUDIANTE' | 'PROFESOR';
}
interface PasswordResetData {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    resetToken: string;
    rol: string;
}
interface VerificationCodeData {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    email: string;
    code: string;
    rol: string;
}
export declare class EmailService {
    private static transporter;
    static sendEmail({ to, subject, html }: EmailOptions): Promise<void>;
    static sendStudentCredentials(data: CredentialsData): Promise<void>;
    static sendProfessorCredentials(data: CredentialsData): Promise<void>;
    static sendPasswordReset(data: PasswordResetData): Promise<void>;
    static sendVerificationCode(data: VerificationCodeData): Promise<void>;
    static verifyConnection(): Promise<boolean>;
}
export {};
//# sourceMappingURL=email.service.d.ts.map