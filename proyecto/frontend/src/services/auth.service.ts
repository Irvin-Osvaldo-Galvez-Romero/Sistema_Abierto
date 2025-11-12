/**
 * Servicio de Autenticación Frontend
 * Métodos para interactuar con la API de autenticación
 */

import api from './api.service';
import { LoginRequest, AuthResponse, UserProfile } from '../types/auth.types';

export class AuthService {

  /**
   * Iniciar sesión
   */
  static async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<{ success: boolean; data: AuthResponse }>('/auth/login', data);
    return response.data.data;
  }

  /**
   * Solicitar restablecimiento de contraseña
   */
  static async forgotPassword(email: string): Promise<void> {
    await api.post('/auth/forgot-password', { email });
  }

  /**
   * Restablecer contraseña con token
   */
  static async resetPassword(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
  }

  /**
   * Enviar código de verificación por correo
   */
  static async sendVerificationCode(email: string): Promise<void> {
    await api.post('/auth/send-verification-code', { email });
  }

  /**
   * Verificar código de verificación
   */
  static async verifyCode(email: string, code: string): Promise<{ token: string }> {
    const response = await api.post<{ success: boolean; data: { token: string } }>(
      '/auth/verify-code',
      { email, code }
    );
    return response.data.data;
  }

  /**
   * Restablecer contraseña con código de verificación
   */
  static async resetPasswordWithCode(email: string, code: string, password: string): Promise<void> {
    await api.post('/auth/reset-password-with-code', { email, code, password });
  }

  /**
   * Restablecer contraseña con token (después de verificar código)
   */
  static async resetPasswordWithToken(token: string, password: string): Promise<void> {
    await api.post('/auth/reset-password', { token, password });
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


