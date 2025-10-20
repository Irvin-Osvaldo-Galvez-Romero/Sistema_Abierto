/**
 * Tipos TypeScript para Autenticación
 */

export enum Rol {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMINISTRADOR = 'ADMINISTRADOR',
  PROFESOR = 'PROFESOR',
  ESTUDIANTE = 'ESTUDIANTE',
  PERSONAL_ADMINISTRATIVO = 'PERSONAL_ADMINISTRATIVO',
}

export interface User {
  id: string;
  email: string;
  nombre: string;
  rol: Rol;
  primerLogin?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  telefono?: string;
  rol?: Rol;
}

export interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  telefono?: string;
  rol: Rol;
  activo: boolean;
  emailVerificado: boolean;
  ultimoAcceso?: string;
  createdAt: string;
  updatedAt: string;
}


