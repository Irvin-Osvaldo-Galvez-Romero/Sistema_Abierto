/**
 * Página de Olvidé mi Contraseña
 * Formulario para restablecer contraseña con código de verificación
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
  Stepper,
  Step,
  StepLabel,
  IconButton,
} from '@mui/material';
import {
  ArrowBack,
  Email,
  LockReset,
  MarkEmailRead,
  NotificationsActive,
  VpnKey,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/auth.service';
import toast from 'react-hot-toast';

const steps = ['Ingresa tu correo', 'Verifica el código', 'Nueva contraseña'];

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setError(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(null);
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setError(null);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('El correo electrónico es requerido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.sendVerificationCode(email);
      setActiveStep(1);
      toast.success('Código de verificación enviado a tu correo');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al enviar código de verificación';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      setError('El código debe tener 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await AuthService.verifyCode(email, code);
      setResetToken(result.token);
      setActiveStep(2);
      toast.success('Código verificado correctamente');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Código de verificación inválido o expirado';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password || password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      setError('La contraseña debe contener al menos una mayúscula, una minúscula y un número');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!resetToken) {
      setError('Token de verificación no encontrado. Por favor, verifica el código nuevamente.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await AuthService.resetPasswordWithToken(resetToken, password);
      toast.success('Contraseña restablecida exitosamente');
      navigate('/login');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Error al restablecer la contraseña';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
      setError(null);
    }
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <form onSubmit={handleSendCode}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
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
                'Enviar Código'
              )}
            </Button>
          </form>
        );

      case 1:
        return (
          <form onSubmit={handleVerifyCode}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                Hemos enviado un código de 6 dígitos a <strong>{email}</strong>.
                Revisa tu bandeja de entrada y tu carpeta de spam.
              </Typography>
            </Alert>

            <TextField
              fullWidth
              label="Código de Verificación"
              name="code"
              type="text"
              value={code}
              onChange={handleCodeChange}
              required
              margin="normal"
              autoFocus
              disabled={isLoading}
              inputProps={{
                maxLength: 6,
                pattern: '[0-9]*',
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <VpnKey color="primary" />
                  </InputAdornment>
                ),
              }}
              helperText="Ingresa el código de 6 dígitos que recibiste por correo"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={isLoading}
                sx={{ flex: 1 }}
              >
                Atrás
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading || code.length !== 6}
                sx={{
                  flex: 2,
                  height: 50,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Verificar Código'
                )}
              </Button>
            </Box>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                ¿No recibiste el código?{' '}
                <Link
                  component="button"
                  variant="body2"
                  onClick={handleSendCode}
                  sx={{ textDecoration: 'none', fontWeight: 'bold' }}
                  disabled={isLoading}
                >
                  Reenviar código
                </Link>
              </Typography>
            </Box>
          </form>
        );

      case 2:
        return (
          <form onSubmit={handleResetPassword}>
            <TextField
              fullWidth
              label="Nueva Contraseña"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              required
              margin="normal"
              autoFocus
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
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Mínimo 8 caracteres, debe incluir mayúscula, minúscula y número"
            />

            <TextField
              fullWidth
              label="Confirmar Contraseña"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
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
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Confirma tu nueva contraseña"
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={isLoading}
                sx={{ flex: 1 }}
              >
                Atrás
              </Button>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading || !password || !confirmPassword}
                sx={{
                  flex: 2,
                  height: 50,
                  fontSize: '1.1rem',
                  textTransform: 'none',
                  borderRadius: 2,
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Cambiar Contraseña'
                )}
              </Button>
            </Box>
          </form>
        );

      default:
        return null;
    }
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
      <Container maxWidth="md">
        <Paper
          elevation={10}
          sx={{
            padding: 4,
            borderRadius: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.96)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Título */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
            <IconButton color="inherit" onClick={() => navigate('/login')}>
              <ArrowBack />
            </IconButton>
            <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
              <Box
                component="img"
                src={`${process.env.PUBLIC_URL}/logo-coordinacion.png`}
                alt="Coordinación Sistema Abierto"
                sx={{ width: 80, height: 80, objectFit: 'contain', mb: 1 }}
              />
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Restablecer contraseña
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recupera tu acceso al sistema de reinscripción
              </Typography>
            </Box>
          </Box>

          {/* Stepper */}
          <Box sx={{ mb: 4 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Mensaje de Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Contenido del paso actual */}
          {renderStepContent()}

          {/* Botón para volver al login */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
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
