/**
 * Dashboard de Administrador
 * Panel de control para administradores
 */

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
} from '@mui/material';
import {
  School,
  People,
  Description,
  PersonAdd,
  Assignment,
  Logout,
  Notifications,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState([
    {
      icon: <People sx={{ fontSize: 40 }} />,
      title: 'Total Estudiantes',
      value: '0',
      color: '#008000',
      action: () => navigate('/admin/estudiantes'),
    },
    {
      icon: <School sx={{ fontSize: 40 }} />,
      title: 'Total Docentes',
      value: '0',
      color: '#008000',
      action: () => navigate('/admin/docentes'),
    },
    {
      icon: <Description sx={{ fontSize: 40 }} />,
      title: 'Documentos Pendientes',
      value: '0',
      color: '#FFA500',
      action: () => navigate('/admin/documentos'),
    },
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: 'Documentos Aprobados',
      value: '0',
      color: '#008000',
      action: () => navigate('/admin/documentos'),
    },
  ]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadStats();
    }
  }, [isAuthenticated, navigate]);

  const loadStats = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      
      // Cargar estudiantes
      const estudiantesRes = await axios.get('http://localhost:3001/api/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Cargar docentes
      const docentesRes = await axios.get('http://localhost:3001/api/profesores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Cargar documentos
      const documentosRes = await axios.get('http://localhost:3001/api/documentos', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const estudiantes = estudiantesRes.data.data || [];
      const docentes = docentesRes.data.data || [];
      const documentos = documentosRes.data.data || [];

      const pendientes = documentos.filter((d: any) => d.estatus === 'PENDIENTE').length;
      const aprobados = documentos.filter((d: any) => d.estatus === 'APROBADO').length;

      setStats([
        {
          icon: <People sx={{ fontSize: 40 }} />,
          title: 'Total Estudiantes',
          value: estudiantes.length.toString(),
          color: '#008000',
          action: () => navigate('/admin/estudiantes'),
        },
        {
          icon: <School sx={{ fontSize: 40 }} />,
          title: 'Total Docentes',
          value: docentes.length.toString(),
          color: '#008000',
          action: () => navigate('/admin/docentes'),
        },
        {
          icon: <Description sx={{ fontSize: 40 }} />,
          title: 'Documentos Pendientes',
          value: pendientes.toString(),
          color: '#FFA500',
          action: () => navigate('/admin/documentos'),
        },
        {
          icon: <Assignment sx={{ fontSize: 40 }} />,
          title: 'Documentos Aprobados',
          value: aprobados.toString(),
          color: '#008000',
          action: () => navigate('/admin/documentos'),
        },
      ]);
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
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
              <School sx={{ fontSize: 40 }} />
              <Typography variant="h4" fontWeight="bold">
                Panel de Administración
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit">
                <Notifications />
              </IconButton>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ 
                  borderColor: '#FFFFFF',
                  color: '#FFFFFF',
                  '&:hover': {
                    borderColor: '#FFFFFF',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container>
        {/* Bienvenida */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#000000' }}>
            Bienvenido, {user?.nombre || 'Administrador'}
          </Typography>
          <Typography variant="body1" sx={{ color: '#333333' }}>
            Panel de control para gestión de estudiantes y documentos
          </Typography>
        </Paper>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} md={6} lg={3} key={index}>
              <Card
                onClick={stat.action}
                sx={{
                  cursor: 'pointer',
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box
                      sx={{
                        backgroundColor: stat.color,
                        color: '#FFFFFF',
                        borderRadius: 2,
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {stat.icon}
                    </Box>
                  </Box>
                  <Typography variant="h3" fontWeight="bold" sx={{ color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#333333' }}>
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Acciones Rápidas */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#000000' }}>
          Acciones Principales
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<People />}
              onClick={() => navigate('/admin/estudiantes')}
              sx={{
                height: 100,
                fontSize: '1.1rem',
                backgroundColor: '#008000',
                '&:hover': {
                  backgroundColor: '#006000',
                },
              }}
            >
              Ver Estudiantes
            </Button>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<School />}
              onClick={() => navigate('/admin/docentes')}
              sx={{
                height: 100,
                fontSize: '1.1rem',
                backgroundColor: '#008000',
                '&:hover': {
                  backgroundColor: '#006000',
                },
              }}
            >
              Ver Docentes
            </Button>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Description />}
              onClick={() => navigate('/admin/documentos')}
              sx={{
                height: 100,
                fontSize: '1.1rem',
                backgroundColor: '#008000',
                '&:hover': {
                  backgroundColor: '#006000',
                },
              }}
            >
              Revisar Documentos
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/admin/nuevo-estudiante')}
              sx={{
                height: 80,
                fontSize: '1.1rem',
                borderColor: '#008000',
                color: '#008000',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#006000',
                  backgroundColor: 'rgba(0,128,0,0.04)',
                  borderWidth: 2,
                },
              }}
            >
              Dar de Alta Estudiante
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/admin/nuevo-docente')}
              sx={{
                height: 80,
                fontSize: '1.1rem',
                borderColor: '#008000',
                color: '#008000',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#006000',
                  backgroundColor: 'rgba(0,128,0,0.04)',
                  borderWidth: 2,
                },
              }}
            >
              Dar de Alta Docente
            </Button>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AdminDashboardPage;

