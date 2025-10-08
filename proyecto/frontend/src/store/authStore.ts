/**
 * Store de Autenticación
 * Gestión global del estado de autenticación con Zustand
 */

import { create } from 'zustand';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '../types/auth.types';
import AuthService from '../services/auth.service';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: AuthService.isAuthenticated(),
  isLoading: false,
  error: null,

  /**
   * Iniciar sesión
   */
  login: async (credentials: LoginRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response: AuthResponse = await AuthService.login(credentials);
      
      // Guardar tokens
      AuthService.saveTokens(response.tokens.accessToken, response.tokens.refreshToken);
      
      // Actualizar estado
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      toast.success('¡Bienvenido! Sesión iniciada exitosamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Error al iniciar sesión';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        user: null,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Registrar usuario
   */
  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    
    try {
      const response: AuthResponse = await AuthService.register(data);
      
      // Guardar tokens
      AuthService.saveTokens(response.tokens.accessToken, response.tokens.refreshToken);
      
      // Actualizar estado
      set({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      
      toast.success('¡Cuenta creada exitosamente!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Error al registrar usuario';
      set({
        isLoading: false,
        error: errorMessage,
      });
      toast.error(errorMessage);
      throw error;
    }
  },

  /**
   * Cerrar sesión
   */
  logout: async () => {
    try {
      const refreshToken = AuthService.getRefreshToken();
      
      if (refreshToken) {
        await AuthService.logout(refreshToken);
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      // Limpiar tokens y estado
      AuthService.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
        error: null,
      });
      toast.success('Sesión cerrada exitosamente');
    }
  },

  /**
   * Cargar información del usuario
   */
  loadUser: async () => {
    if (!AuthService.isAuthenticated()) {
      set({ isAuthenticated: false, user: null });
      return;
    }

    set({ isLoading: true });
    
    try {
      const userData = await AuthService.getMe();
      
      set({
        user: {
          id: userData.userId,
          email: userData.email,
          nombre: userData.email.split('@')[0], // Temporal
          rol: userData.rol,
        },
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      AuthService.clearTokens();
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  /**
   * Limpiar error
   */
  clearError: () => {
    set({ error: null });
  },
}));

export default useAuthStore;


