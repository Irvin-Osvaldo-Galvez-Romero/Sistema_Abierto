/**
 * Página de Restablecer Contraseña
 * Formulario para restablecer contraseña con token
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Lock,
  School,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthService from '../services/auth.service';
import toast from 'react-hot-toast';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token de restablecimiento no válido');
    }
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Token de restablecimiento no válido');
      return;
    }

    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validación de contraseña fuerte
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.resetPassword(token, formData.password);
      setIsSuccess(true);
      toast.success('¡Contraseña restablecida exitosamente!');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al restablecer contraseña';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  if (isSuccess) {
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
            <Box sx={{ textAlign: 'center' }}>
              <School sx={{ fontSize: 60, color: 'success.main', mb: 2 }} />
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="success.main">
                ¡Contraseña Restablecida!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Tu contraseña ha sido restablecida exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={handleBackToLogin}
                sx={{
                  height: 50,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                Ir al Login
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    );
  }

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
              Restablecer Contraseña
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ingresa tu nueva contraseña segura
            </Typography>
          </Box>

          {/* Mensaje de Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nueva Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              autoFocus
              disabled={isLoading || !token}
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
              helperText="Mínimo 8 caracteres, mayúscula, minúscula y número"
            />

            <TextField
              fullWidth
              label="Confirmar Nueva Contraseña"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              margin="normal"
              disabled={isLoading || !token}
              error={formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0}
              helperText={
                formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0
                  ? 'Las contraseñas no coinciden'
                  : ''
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || !token || !formData.password || !formData.confirmPassword}
              sx={{
                mt: 3,
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
                'Restablecer Contraseña'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Button
                variant="text"
                onClick={handleBackToLogin}
                startIcon={<ArrowBack />}
                disabled={isLoading}
              >
                Volver al Login
              </Button>
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

export default ResetPasswordPage;
