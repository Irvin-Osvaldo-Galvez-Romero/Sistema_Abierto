/**
 * Página de Cambio de Contraseña Obligatorio
 * Se muestra en el primer login
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Lock,
  Visibility,
  VisibilityOff,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import api from '../services/api.service';

export const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Verificar fortaleza de contraseña
    if (name === 'newPassword') {
      setPasswordStrength({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        lowercase: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Todos los campos son requeridos');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!passwordStrength.length || !passwordStrength.uppercase || !passwordStrength.lowercase || !passwordStrength.number) {
      toast.error('La contraseña debe cumplir con todos los requisitos de seguridad');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      await api.post(
        '/password/change-first-login',
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('¡Contraseña cambiada exitosamente!');
      
      // Esperar un momento y redirigir
      setTimeout(() => {
        if (user?.rol === 'ESTUDIANTE') {
          navigate('/student/dashboard');
        } else if (user?.rol === 'PROFESOR') {
          navigate('/professor/dashboard');
        } else {
          navigate('/admin/dashboard');
        }
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Error al cambiar contraseña';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const allRequirementsMet = passwordStrength.length && passwordStrength.uppercase && passwordStrength.lowercase && passwordStrength.number;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,rgb(6, 99, 63) 0%,rgb(83, 205, 91) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: 3,
            position: 'relative',
            overflow: 'visible',
          }}
        >
          {/* Icono superior */}
          <Box
            sx={{
              position: 'absolute',
              top: -40,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg,rgb(6, 99, 63) 0%,rgb(83, 205, 91) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}
          >
            <Lock sx={{ fontSize: 40, color: 'white' }} />
          </Box>

          {/* Título */}
          <Box sx={{ mt: 5, mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Cambio de Contraseña Obligatorio
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Por seguridad, debes cambiar tu contraseña temporal
            </Typography>
          </Box>

          {/* Alerta informativa */}
          <Alert severity="warning" sx={{ mb: 3 }} icon={<Warning />}>
            <strong>Primer inicio de sesión</strong>
            <br />
            Debes crear una contraseña segura antes de continuar
          </Alert>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            {/* Contraseña actual */}
            <TextField
              fullWidth
              required
              type={showCurrentPassword ? 'text' : 'password'}
              label="Contraseña Temporal (Actual)"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      edge="end"
                    >
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Nueva contraseña */}
            <TextField
              fullWidth
              required
              type={showNewPassword ? 'text' : 'password'}
              label="Nueva Contraseña"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Requisitos de contraseña */}
            {formData.newPassword && (
              <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
                  Requisitos de seguridad:
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 16, color: passwordStrength.length ? 'green' : 'gray' }} />
                    <Typography variant="caption" color={passwordStrength.length ? 'green' : 'text.secondary'}>
                      Mínimo 8 caracteres
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 16, color: passwordStrength.uppercase ? 'green' : 'gray' }} />
                    <Typography variant="caption" color={passwordStrength.uppercase ? 'green' : 'text.secondary'}>
                      Al menos una mayúscula (A-Z)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 16, color: passwordStrength.lowercase ? 'green' : 'gray' }} />
                    <Typography variant="caption" color={passwordStrength.lowercase ? 'green' : 'text.secondary'}>
                      Al menos una minúscula (a-z)
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle sx={{ fontSize: 16, color: passwordStrength.number ? 'green' : 'gray' }} />
                    <Typography variant="caption" color={passwordStrength.number ? 'green' : 'text.secondary'}>
                      Al menos un número (0-9)
                    </Typography>
                  </Box>
                </Box>
                {allRequirementsMet && (
                  <LinearProgress variant="determinate" value={100} color="success" sx={{ mt: 1 }} />
                )}
              </Box>
            )}

            {/* Confirmar contraseña */}
            <TextField
              fullWidth
              required
              type={showConfirmPassword ? 'text' : 'password'}
              label="Confirmar Nueva Contraseña"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              sx={{ mb: 3 }}
              error={formData.confirmPassword !== '' && formData.newPassword !== formData.confirmPassword}
              helperText={
                formData.confirmPassword !== '' && formData.newPassword !== formData.confirmPassword
                  ? 'Las contraseñas no coinciden'
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Botones */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !allRequirementsMet || formData.newPassword !== formData.confirmPassword}
              sx={{
                mb: 2,
                py: 1.5,
                background: 'linear-gradient(135deg,rgb(6, 99, 63) 0%,rgb(83, 205, 91) 100%)',
                '&:hover': {
                  background: 'linear-gradient(135deg,rgb(128, 125, 125) 0%,rgb(141, 141, 141) 100%)',
                },
              }}
            >
              {loading ? 'Cambiando contraseña...' : 'Cambiar Contraseña'}
            </Button>

            <Button
              fullWidth
              variant="outlined"
              onClick={handleLogout}
              disabled={loading}
              sx={{ py: 1.5 }}
            >
              Cancelar y Cerrar Sesión
            </Button>
          </form>

          {/* Nota de seguridad */}
          <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
            <Typography variant="caption" display="block" color="primary.main">
              <strong>Nota de seguridad:</strong>
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              • Nunca compartas tu contraseña con nadie
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              • Usa una contraseña única para esta cuenta
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary">
              • Cambia tu contraseña periódicamente
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ChangePasswordPage;

