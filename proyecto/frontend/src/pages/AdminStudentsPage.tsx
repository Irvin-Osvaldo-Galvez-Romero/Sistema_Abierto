/**
 * Página de Lista de Estudiantes (Admin)
 * Ver todos los estudiantes y sus documentos
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  School,
  ArrowBack,
  Search,
  Visibility,
  PersonAdd,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Estudiante {
  id: string;
  matricula: string;
  usuario: {
    nombre: string;
    apellidoPaterno: string;
    email: string;
  };
  carrera?: {
    nombre: string;
  };
  estatus: string;
}

export const AdminStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadStudents();
    }
  }, [isAuthenticated, navigate]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEstudiantes(response.data.data);
    } catch (error: any) {
      toast.error('Error al cargar estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.length < 2) {
      loadStudents();
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:3001/api/students/search?q=${searchTerm}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEstudiantes(response.data.data);
    } catch (error) {
      toast.error('Error en la búsqueda');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'ACTIVO': return 'success';
      case 'INACTIVO': return 'default';
      case 'EGRESADO': return 'info';
      default: return 'default';
    }
  };

  const filteredEstudiantes = estudiantes;

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
                Gestión de Estudiantes
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/admin/nuevo-estudiante')}
                sx={{ borderColor: '#FFFFFF', color: '#FFFFFF' }}
              >
                Nuevo Estudiante
              </Button>
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
          </Box>
        </Container>
      </Box>

      <Container>
        {/* Búsqueda */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre, matrícula o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              sx={{
                minWidth: 120,
                backgroundColor: '#008000',
                '&:hover': {
                  backgroundColor: '#006000',
                },
              }}
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              onClick={loadStudents}
              sx={{
                minWidth: 100,
                borderColor: '#008000',
                color: '#008000',
              }}
            >
              Ver Todos
            </Button>
          </Box>
        </Paper>

        {/* Tabla de Estudiantes */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#008000' }}>
              <TableRow>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Matrícula</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Nombre Completo</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Carrera</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Estatus</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: '#888888' }}>Cargando estudiantes...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredEstudiantes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: '#888888' }}>No se encontraron estudiantes</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredEstudiantes.map((estudiante) => (
                  <TableRow
                    key={estudiante.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f0fff0',
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: '#000000' }}>
                      {estudiante.matricula || 'Sin matrícula'}
                    </TableCell>
                    <TableCell sx={{ color: '#000000' }}>
                      {estudiante.usuario.nombre} {estudiante.usuario.apellidoPaterno}
                    </TableCell>
                    <TableCell sx={{ color: '#333333' }}>
                      {estudiante.usuario.email}
                    </TableCell>
                    <TableCell sx={{ color: '#333333' }}>
                      {estudiante.carrera?.nombre || 'Sin carrera'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={estudiante.estatus}
                        color={getEstatusColor(estudiante.estatus) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        onClick={() => navigate(`/admin/estudiante/${estudiante.id}`)}
                        sx={{ color: '#008000' }}
                      >
                        <Visibility />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Box>
  );
};

export default AdminStudentsPage;

