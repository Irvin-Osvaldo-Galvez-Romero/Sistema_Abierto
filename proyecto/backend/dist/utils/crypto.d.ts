export declare const hashPassword: (password: string) => Promise<string>;
export declare const verifyPassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const generateRandomToken: (length?: number) => string;
export declare const encrypt: (text: string) => string;
export declare const decrypt: (encryptedText: string) => string;
export declare const generateFileHash: (buffer: Buffer) => string;
export declare const generateVerificationCode: (length?: number) => string;
//# sourceMappingURL=crypto.d.ts.map