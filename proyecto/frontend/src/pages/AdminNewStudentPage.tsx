/**
 * Página de Alta de Estudiante (Admin)
 * Crear nuevos estudiantes en el sistema
 */

import React, { useState, useEffect } from 'react';
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

export const AdminNewStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState({
    // Usuario
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    emailUsername: '', // Parte antes del @
    password: 'Teschi123', // Contraseña por defecto
    telefono: '',
    // Estudiante
    matricula: '',
    estatus: 'ACTIVO',
    carreraId: '',
  });

  // Cargar carreras al montar el componente
  useEffect(() => {
    const loadCarreras = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('http://localhost:3001/api/carreras', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCarreras(response.data.data || []);
      } catch (error) {
        console.error('Error al cargar carreras:', error);
        toast.error('Error al cargar las carreras disponibles');
      }
    };

    loadCarreras();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.apellidoPaterno || !formData.apellidoMaterno || !formData.emailUsername || !formData.password || !formData.telefono || !formData.matricula || !formData.carreraId) {
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
          rol: 'ESTUDIANTE',
          matricula: formData.matricula, // Enviar matrícula para incluir en el correo
          sendEmail: true, // Enviar correo con credenciales
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const usuarioId = userResponse.data.data.user.id;

      // 2. Crear perfil de estudiante
      await axios.post(
        'http://localhost:3001/api/students',
        {
          usuarioId,
          matricula: formData.matricula,
          estatus: formData.estatus,
          carreraId: formData.carreraId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('¡Estudiante creado exitosamente! Se ha enviado un correo con las credenciales de acceso a ' + emailCompleto);
      setShowConfirmDialog(false);
      navigate('/admin/estudiantes');
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Error al crear estudiante';
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
                Dar de Alta Estudiante
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

            {/* Información Académica */}
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#008000' }}>
              🎓 Información Académica
            </Typography>
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Matrícula"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Ej: EST2024001"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Carrera *</InputLabel>
                  <Select
                    name="carreraId"
                    value={formData.carreraId}
                    onChange={handleChange as any}
                    disabled={loading}
                    label="Carrera *"
                    required
                  >
                    <MenuItem value="">
                      <em>Selecciona una carrera</em>
                    </MenuItem>
                    {carreras.map((carrera) => (
                      <MenuItem key={carrera.id} value={carrera.id}>
                        {carrera.nombre} {carrera.codigo ? `(${carrera.codigo})` : ''}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
                    <MenuItem value="EGRESADO">EGRESADO</MenuItem>
                  </Select>
                </FormControl>
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
                {loading ? 'Guardando...' : 'Guardar Estudiante'}
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
        title="Confirmar Creación de Estudiante"
        message={`¿Estás seguro de que deseas crear el estudiante con matrícula ${formData.matricula}?`}
        confirmText="Crear Estudiante"
        cancelText="Cancelar"
      />
    </Box>
  );
};

export default AdminNewStudentPage;

