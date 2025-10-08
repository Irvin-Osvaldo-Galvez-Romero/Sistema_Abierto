/**
 * Página de Registro
 * Formulario de registro para nuevos usuarios
 */

import React, { useState } from 'react';
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
  Grid,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  School,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    clearError();
    setLocalError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación de contraseñas
    if (formData.password !== formData.confirmPassword) {
      setLocalError('Las contraseñas no coinciden');
      return;
    }

    // Validación de contraseña fuerte
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      setLocalError('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número');
      return;
    }

    // Validar campos requeridos
    if (!formData.nombre || !formData.apellidoPaterno || !formData.apellidoMaterno || !formData.email || !formData.telefono) {
      setLocalError('Todos los campos son obligatorios');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        telefono: formData.telefono,
      });
      navigate('/dashboard');
    } catch (error) {
      // El error ya se maneja en el store
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const displayError = localError || error;

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
      <Container maxWidth="md">
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
              Crear Cuenta
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Regístrate en el Sistema Universitario
            </Typography>
          </Box>

          {/* Mensaje de Error */}
          {displayError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => { clearError(); setLocalError(null); }}>
              {displayError}
            </Alert>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Nombre */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="primary" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Apellido Paterno */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido Paterno"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </Grid>

              {/* Apellido Materno */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Apellido Materno"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </Grid>

              {/* Teléfono */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  inputProps={{
                    maxLength: 10,
                    pattern: '[0-9]*',
                  }}
                />
              </Grid>

              {/* Email */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  helperText="Usa tu correo institucional"
                />
              </Grid>

              {/* Contraseña */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  required
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
                  helperText="Mínimo 8 caracteres, mayúscula, minúscula y número"
                />
              </Grid>

              {/* Confirmar Contraseña */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirmar Contraseña"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  error={formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0}
                  helperText={
                    formData.password !== formData.confirmPassword && formData.confirmPassword.length > 0
                      ? 'Las contraseñas no coinciden'
                      : ''
                  }
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
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
                'Crear Cuenta'
              )}
            </Button>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href="/login"
                  sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                >
                  Inicia sesión
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

export default RegisterPage;


