/**
 * Servicio de Autenticación Frontend
 * Métodos para interactuar con la API de autenticación
 */

import api from './api.service';
import { LoginRequest, RegisterRequest, AuthResponse, UserProfile } from '../types/auth.types';

export class AuthService {
  /**
   * Registrar nuevo usuario
   */
  static async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/register', data);
    return response.data.data;
  }

  /**
   * Iniciar sesión
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data);
    return response.data.data;
  }

  /**
   * Renovar token de acceso
   */
  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await api.post<{ success: boolean; data: { accessToken: string } }>(
      '/auth/refresh',
      { refreshToken }
    );
    return response.data.data;
  }

  /**
   * Cerrar sesión
   */
  static async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken });
  }

  /**
   * Obtener perfil del usuario
   */
  static async getProfile(): Promise<UserProfile> {
    const response = await api.get<{ success: boolean; data: UserProfile }>('/auth/profile');
    return response.data.data;
  }

  /**
   * Obtener información básica del usuario
   */
  static async getMe(): Promise<any> {
    const response = await api.get<{ success: boolean; data: any }>('/auth/me');
    return response.data.data;
  }

  /**
   * Guardar tokens en localStorage
   */
  static saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  /**
   * Obtener access token del localStorage
   */
  static getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Obtener refresh token del localStorage
   */
  static getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  /**
   * Limpiar tokens del localStorage
   */
  static clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  /**
   * Verificar si el usuario está autenticado
   */
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export default AuthService;


