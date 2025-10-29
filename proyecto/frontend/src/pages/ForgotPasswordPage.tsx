/**
 * Página de Olvidé mi Contraseña
 * Formulario para solicitar restablecimiento de contraseña
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
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Email,
  School,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import toast from 'react-hot-toast';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('El correo electrónico es requerido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.forgotPassword(email);
      setIsSubmitted(true);
      toast.success('Si el correo está registrado, recibirás instrucciones para restablecer tu contraseña');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al enviar solicitud de restablecimiento';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
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
              ¿Olvidaste tu contraseña?
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ingresa tu correo electrónico para recibir instrucciones de restablecimiento
            </Typography>
          </Box>

          {/* Mensaje de Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Mensaje de Éxito */}
          {isSubmitted ? (
            <Box sx={{ textAlign: 'center' }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  ¡Solicitud enviada!
                </Typography>
                <Typography variant="body2">
                  Si el correo <strong>{email}</strong> está registrado en nuestro sistema, 
                  recibirás un correo con instrucciones para restablecer tu contraseña.
                </Typography>
              </Alert>

              <Box sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  ¿No recibiste el correo? Revisa tu carpeta de spam o intenta nuevamente.
                </Typography>
                
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  sx={{ mr: 2 }}
                >
                  Intentar con otro correo
                </Button>
                
                <Button
                  variant="contained"
                  onClick={handleBackToLogin}
                  startIcon={<ArrowBack />}
                >
                  Volver al Login
                </Button>
              </Box>
            </Box>
          ) : (
            /* Formulario */
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={email}
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
                helperText="Ingresa el correo electrónico asociado a tu cuenta"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading || !email}
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
                  'Enviar Instrucciones'
                )}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Recordaste tu contraseña?{' '}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={handleBackToLogin}
                    sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                  >
                    Inicia sesión
                  </Link>
                </Typography>
              </Box>
            </form>
          )}

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

export default ForgotPasswordPage;
