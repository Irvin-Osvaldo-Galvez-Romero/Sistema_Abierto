/**
 * Página de Alta de Docente (Admin)
 * Crear nuevos docentes en el sistema
 */

import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  School,
  ArrowBack,
  Save,
  Visibility,
  VisibilityOff,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmationDialog from '../components/ConfirmationDialog';

export const AdminNewProfessorPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({
    // Usuario
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    emailUsername: '', // Parte antes del @
    password: 'Teschi123', // Contraseña por defecto
    telefono: '',
    // Profesor
    numeroEmpleado: '',
    especialidad: '',
    estatus: 'ACTIVO',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.apellidoPaterno || !formData.apellidoMaterno || !formData.emailUsername || !formData.password || !formData.telefono || !formData.numeroEmpleado || !formData.especialidad) {
      toast.error('Completa todos los campos obligatorios');
      return;
    }

    // Mostrar diálogo de confirmación
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');

      // Construir el email completo con el dominio del TESCHI
      const emailCompleto = `${formData.emailUsername}@teschi.edu.mx`;

      // 1. Crear usuario (el correo con credenciales se enviará automáticamente)
      const userResponse = await axios.post(
        'http://localhost:3001/api/auth/register',
        {
          nombre: formData.nombre,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          email: emailCompleto,
          password: formData.password,
          telefono: formData.telefono,
          rol: 'PROFESOR',
          sendEmail: true, // Enviar correo con credenciales
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const usuarioId = userResponse.data.data.user.id;

      // 2. Crear perfil de profesor
      await axios.post(
        'http://localhost:3001/api/profesores',
        {
          usuarioId,
          numeroEmpleado: formData.numeroEmpleado,
          especialidad: formData.especialidad,
          estatus: formData.estatus,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('¡Docente creado exitosamente! Se ha enviado un correo con las credenciales de acceso a ' + emailCompleto);
      setShowConfirmDialog(false);
      navigate('/admin/dashboard');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Error al crear docente';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #008000 0%, #006000 100%)',
          color: '#FFFFFF',
          py: 3,
          mb: 4,
        }}
      >
        <Container>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" onClick={() => navigate('/admin/dashboard')}>
                <ArrowBack />
              </IconButton>
              <School sx={{ fontSize: 40 }} />
              <Typography variant="h4" fontWeight="bold">
                Dar de Alta Docente
              </Typography>
            </Box>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
            >
              Salir
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Paper sx={{ p: 4, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            {/* Información del Usuario */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#008000' }}>
              📋 Información Personal
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre(s)"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Apellido Paterno"
                  name="apellidoPaterno"
                  value={formData.apellidoPaterno}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Apellido Materno"
                  name="apellidoMaterno"
                  value={formData.apellidoMaterno}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Teléfono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Grid>
            </Grid>

            {/* Información de Cuenta */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#008000' }}>
              🔐 Credenciales de Acceso
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Email (usuario TESCHI)"
                  name="emailUsername"
                  value={formData.emailUsername}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="ejemplo"
                  helperText="Solo ingresa el usuario, se agregará automáticamente @teschi.edu.mx"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <span style={{ color: '#666', fontWeight: 'bold' }}>@teschi.edu.mx</span>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  helperText="Contraseña por defecto: Teschi123 (puedes cambiarla)"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            {/* Información Profesional */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#008000' }}>
              👨‍🏫 Información Profesional
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Número de Empleado"
                  name="numeroEmpleado"
                  value={formData.numeroEmpleado}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Ej: PROF2024001"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Estatus *</InputLabel>
                  <Select
                    name="estatus"
                    value={formData.estatus}
                    onChange={handleChange as any}
                    disabled={loading}
                    label="Estatus *"
                    required
                  >
                    <MenuItem value="ACTIVO">ACTIVO</MenuItem>
                    <MenuItem value="INACTIVO">INACTIVO</MenuItem>
                    <MenuItem value="LICENCIA">LICENCIA</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Especialidad"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Ej: Matemáticas, Programación, Contabilidad"
                />
              </Grid>
            </Grid>

            {/* Botones */}
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/admin/dashboard')}
                disabled={loading}
                sx={{
                  borderColor: '#888888',
                  color: '#888888',
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={<Save />}
                disabled={loading}
                sx={{
                  backgroundColor: '#008000',
                  '&:hover': {
                    backgroundColor: '#006000',
                  },
                }}
              >
                {loading ? 'Guardando...' : 'Guardar Docente'}
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>

      {/* Diálogo de Confirmación */}
      <ConfirmationDialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmSubmit}
        title="Confirmar Creación de Docente"
        message={`¿Estás seguro de que deseas crear el docente con número de empleado ${formData.numeroEmpleado}?`}
        confirmText="Crear Docente"
        cancelText="Cancelar"
      />
    </Box>
  );
};

export default AdminNewProfessorPage;

