export interface JwtPayload {
    userId: string;
    email: string;
    rol: string;
}
export declare const generateAccessToken: (payload: JwtPayload) => string;
export declare const generateRefreshToken: (payload: JwtPayload) => string;
export declare const verifyToken: (token: string) => JwtPayload;
export declare const decodeToken: (token: string) => JwtPayload | null;
export declare const isTokenExpired: (token: string) => boolean;
//# sourceMappingURL=jwt.d.ts.map