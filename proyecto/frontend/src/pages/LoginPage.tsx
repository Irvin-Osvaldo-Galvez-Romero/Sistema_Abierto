/**
 * Página de Login
 * Interfaz de inicio de sesión para el Sistema Universitario
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  School,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated, user } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirigir según el rol del usuario
      if (user.rol === 'ADMINISTRADOR') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);

  // Limpiar errores al desmontar
  useEffect(() => {
    return () => clearError();
  }, [clearError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(formData);
      // La redirección se manejará en el useEffect
    } catch (error) {
      // El error ya se maneja en el store
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #008000 0%, #006000 100%)',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Logo y Título */}
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <School sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Sistema Universitario
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Gestión Documental Digital
            </Typography>
          </Box>

          {/* Mensaje de Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={clearError}>
              {error}
            </Alert>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              autoFocus
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="primary" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ textAlign: 'right', mb: 2 }}>
              <Link
                href="/forgot-password"
                variant="body2"
                sx={{ textDecoration: 'none' }}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              sx={{
                mt: 2,
                mb: 2,
                height: 50,
                fontSize: '1.1rem',
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Iniciar Sesión'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿No tienes una cuenta?{' '}
                <Link
                  href="/register"
                  sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Regístrate aquí
                </Link>
              </Typography>
            </Box>
          </form>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="caption" sx={{ color: '#888888' }}>
              © 2024 Sistema Universitario. Todos los derechos reservados.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;


