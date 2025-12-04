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
  Stack,
} from '@mui/material';
import {
  ArrowBack,
  Search,
  Visibility,
  PersonAdd,
  Logout,
  Delete,
  PersonOff,
  DeleteForever,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import ConfirmationDialog from '../components/ConfirmationDialog';
import api from '../services/api.service';
import PageHeader from '../components/PageHeader';

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
  const [bajaDialog, setBajaDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null);

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
      const response = await api.get('/students', {
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
      const response = await api.get('/students/search', {
        params: { q: searchTerm },
        headers: { Authorization: `Bearer ${token}` },
      });

      setEstudiantes(response.data.data);
    } catch (error) {
      toast.error('Error en la búsqueda');
    }
  };

  const handleBajaClick = (estudiante: Estudiante) => {
    setSelectedStudent(estudiante);
    setBajaDialog(true);
  };

  const handleDeleteClick = (estudiante: Estudiante) => {
    setSelectedStudent(estudiante);
    setDeleteDialog(true);
  };

  const handleBajaConfirm = async () => {
    if (!selectedStudent) return;

    try {
      const token = localStorage.getItem('accessToken');
      await api.patch(
        `/students/${selectedStudent.id}/baja`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Estudiante dado de baja exitosamente');
      setBajaDialog(false);
      setSelectedStudent(null);
      loadStudents(); // Recargar lista
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Error al dar de baja estudiante';
      toast.error(errorMsg);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedStudent) return;

    try {
      const token = localStorage.getItem('accessToken');
      await api.delete(
        `/students/${selectedStudent.id}/permanent`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success('Estudiante eliminado permanentemente de la base de datos');
      setDeleteDialog(false);
      setSelectedStudent(null);
      loadStudents(); // Recargar lista
    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || 'Error al eliminar estudiante';
      toast.error(errorMsg);
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
      <PageHeader
        title="Gestión de Estudiantes"
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
              onClick={() => navigate('/admin/nuevo-estudiante')}
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.1)' },
              }}
            >
              Nuevo Estudiante
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
                        title="Ver Detalles"
                      >
                        <Visibility />
                      </IconButton>
                      <IconButton
                        onClick={() => handleBajaClick(estudiante)}
                        sx={{ color: '#ff9800' }}
                        title="Dar de Baja (Marca como inactivo)"
                      >
                        <PersonOff />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(estudiante)}
                        sx={{ color: '#d32f2f' }}
                        title="Eliminar Permanentemente (Borra de BD)"
                      >
                        <DeleteForever />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Diálogo de Confirmación de Baja Definitiva */}
        <ConfirmationDialog
          open={bajaDialog}
          title="Dar de Baja Estudiante"
          message={
            selectedStudent
              ? `¿Estás seguro de que deseas dar de baja al estudiante ${selectedStudent.usuario.nombre} ${selectedStudent.usuario.apellidoPaterno} (${selectedStudent.matricula})?\n\nEsta acción marcará al estudiante como INACTIVO pero conservará sus datos en el sistema.`
              : ''
          }
          onConfirm={handleBajaConfirm}
          onClose={() => {
            setBajaDialog(false);
            setSelectedStudent(null);
          }}
          confirmText="Dar de Baja"
          cancelText="Cancelar"
          type="warning"
        />

        {/* Diálogo de Confirmación de Eliminación Permanente */}
        <ConfirmationDialog
          open={deleteDialog}
          title="⚠️ Eliminar Permanentemente"
          message={
            selectedStudent
              ? `¿Estás ABSOLUTAMENTE SEGURO de que deseas ELIMINAR PERMANENTEMENTE al estudiante ${selectedStudent.usuario.nombre} ${selectedStudent.usuario.apellidoPaterno} (${selectedStudent.matricula})?\n\n🚨 ADVERTENCIA: Esta acción eliminará COMPLETAMENTE:\n• El estudiante de la base de datos\n• Su usuario y credenciales\n• Todos sus documentos subidos\n• Todo su historial\n\n⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER`
              : ''
          }
          onConfirm={handleDeleteConfirm}
          onClose={() => {
            setDeleteDialog(false);
            setSelectedStudent(null);
          }}
          confirmText="Eliminar Permanentemente"
          cancelText="Cancelar"
          type="error"
        />
      </Container>
    </Box>
  );
};

export default AdminStudentsPage;

