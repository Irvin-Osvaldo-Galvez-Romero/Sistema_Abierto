/**
 * Servicio API
 * Configuración de Axios para comunicación con el backend
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

// Obtener la URL de la API
// En desarrollo, React Scripts usa el proxy configurado en package.json
// En producción, usa la variable de entorno o la URL por defecto
const getApiUrl = () => {
  // Si estamos en desarrollo y hay un proxy configurado, usar ruta relativa
  if (process.env.NODE_ENV === 'development') {
    // El proxy en package.json redirige /api a http://localhost:4000/api
    return '/api';
  }
  
  // En producción, usar variable de entorno o URL por defecto
  return process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
};

const API_URL = getApiUrl();

// Crear instancia de Axios
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 segundos
});

// Interceptor de request - agregar token de autenticación
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - manejar errores y renovar token
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si el error es 401 y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Intentar renovar el token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;
        
        // Guardar nuevo token
        localStorage.setItem('accessToken', accessToken);

        // Reintentar request original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return api(originalRequest);
      } catch (refreshError) {
        // Si falla la renovación, limpiar storage y redirigir a login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;


