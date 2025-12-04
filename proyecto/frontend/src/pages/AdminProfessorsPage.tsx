/**
 * Página de Lista de Docentes (Admin)
 * Ver todos los docentes y sus detalles
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
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Search,
  Visibility,
  PersonAdd,
  Logout,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import api from '../services/api.service';
import { PageHeader } from '../components/PageHeader';

interface Docente {
  id: string;
  numeroEmpleado: string;
  especialidad?: string;
  activo: boolean;
  usuario: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    email: string;
    telefono?: string;
  };
}

export const AdminProfessorsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();
  const [docentes, setDocentes] = useState<Docente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadProfessors();
    }
  }, [isAuthenticated, navigate]);

  const loadProfessors = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/profesores', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDocentes(response.data.data || []);
    } catch (error: any) {
      toast.error('Error al cargar docentes');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredDocentes = docentes.filter((doc) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const nombreCompleto = `${doc.usuario.nombre} ${doc.usuario.apellidoPaterno}`.toLowerCase();
    const email = doc.usuario.email.toLowerCase();
    const numeroEmpleado = doc.numeroEmpleado.toLowerCase();
    
    return nombreCompleto.includes(searchLower) || 
           email.includes(searchLower) || 
           numeroEmpleado.includes(searchLower);
  });

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <PageHeader
        title="Gestión de Docentes"
        subtitle="Coordinación académica · Sistema abierto"
        gradientFrom="#008000"
        gradientTo="#006000"
        maxWidth="xl"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/admin/dashboard')}
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Regresar
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/admin/nuevo-docente')}
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Nuevo Docente
            </Button>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Logout />}
              onClick={handleLogout}
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Salir
            </Button>
          </Stack>
        }
      />

      <Container>
        {/* Búsqueda */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Buscar por nombre, número de empleado o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              onClick={() => setSearchTerm('')}
              sx={{
                minWidth: 100,
                borderColor: '#008000',
                color: '#008000',
              }}
            >
              Limpiar
            </Button>
          </Box>
        </Paper>

        {/* Estadísticas */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#008000' }}>
                {docentes.length}
              </Typography>
              <Typography variant="body1" sx={{ color: '#333333' }}>
                Total de Docentes
              </Typography>
            </Box>
            <Box>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#008000' }}>
                {docentes.filter(d => d.activo).length}
              </Typography>
              <Typography variant="body1" sx={{ color: '#333333' }}>
                Docentes Activos
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Tabla de Docentes */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#008000' }}>
              <TableRow>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Número de Empleado</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Nombre Completo</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Especialidad</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Teléfono</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Estatus</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: '#888888' }}>Cargando docentes...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredDocentes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: '#888888' }}>
                      {searchTerm ? 'No se encontraron docentes con ese criterio' : 'No hay docentes registrados'}
                    </Typography>
                    {!searchTerm && (
                      <Button
                        variant="contained"
                        startIcon={<PersonAdd />}
                        onClick={() => navigate('/admin/nuevo-docente')}
                        sx={{
                          mt: 2,
                          backgroundColor: '#008000',
                          '&:hover': {
                            backgroundColor: '#006000',
                          },
                        }}
                      >
                        Dar de Alta Primer Docente
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocentes.map((docente) => (
                  <TableRow
                    key={docente.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f0fff0',
                      },
                    }}
                  >
                    <TableCell sx={{ fontWeight: 600, color: '#000000' }}>
                      {docente.numeroEmpleado}
                    </TableCell>
                    <TableCell sx={{ color: '#000000' }}>
                      {docente.usuario.nombre} {docente.usuario.apellidoPaterno}
                      {docente.usuario.apellidoMaterno && ` ${docente.usuario.apellidoMaterno}`}
                    </TableCell>
                    <TableCell sx={{ color: '#333333' }}>
                      {docente.usuario.email}
                    </TableCell>
                    <TableCell sx={{ color: '#333333' }}>
                      {docente.especialidad || 'Sin especialidad'}
                    </TableCell>
                    <TableCell sx={{ color: '#333333' }}>
                      {docente.usuario.telefono || 'Sin teléfono'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={docente.activo ? 'ACTIVO' : 'INACTIVO'}
                        color={docente.activo ? 'success' : 'default'}
                        size="small"
                      />
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

export default AdminProfessorsPage;

