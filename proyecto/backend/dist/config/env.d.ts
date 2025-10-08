export declare const config: {
    readonly env: string;
    readonly port: number;
    readonly host: string;
    readonly database: {
        readonly url: string;
    };
    readonly redis: {
        readonly url: string;
        readonly host: string;
        readonly port: number;
        readonly password: string;
    };
    readonly jwt: {
        readonly secret: string;
        readonly expiresIn: string;
        readonly refreshExpiresIn: string;
    };
    readonly security: {
        readonly encryptionKey: string;
        readonly sessionTimeout: number;
        readonly maxLoginAttempts: number;
        readonly lockoutDuration: number;
    };
    readonly cors: {
        readonly origin: string;
    };
    readonly rateLimit: {
        readonly windowMs: number;
        readonly maxRequests: number;
    };
    readonly email: {
        readonly host: string;
        readonly port: number;
        readonly secure: boolean;
        readonly user: string;
        readonly password: string;
        readonly from: string;
    };
    readonly files: {
        readonly uploadDir: string;
        readonly maxFileSize: number;
        readonly allowedTypes: string[];
    };
    readonly logs: {
        readonly level: string;
        readonly filePath: string;
    };
    readonly isDevelopment: boolean;
    readonly isProduction: boolean;
    readonly isTest: boolean;
    readonly debug: boolean;
};
export default config;
//# sourceMappingURL=env.d.ts.map