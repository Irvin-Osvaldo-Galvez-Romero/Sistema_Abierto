/**
 * Dashboard de Administrador
 * Panel de control para administradores
 */

import React, { useEffect, useState } from 'react';
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
  Stack,
} from '@mui/material';
import {
  School,
  People,
  Description,
  PersonAdd,
  Assignment,
  Logout,
  Notifications,
  Psychology,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../services/api.service';
import PageHeader from '../components/PageHeader';

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
    {
      icon: <Assignment sx={{ fontSize: 40 }} />,
      title: 'Créditos Pendientes',
      value: '0',
      color: '#ef4444',
      action: () => navigate('/admin/creditos'),
    },
    {
      icon: <Psychology sx={{ fontSize: 40 }} />,
      title: 'Pruebas Modelo Dual Pendientes',
      value: '0',
      color: '#9c27b0',
      action: () => navigate('/admin/modelo-dual'),
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
      const estudiantesRes = await api.get('/students', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Cargar docentes
      const docentesRes = await api.get('/profesores', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Cargar documentos
      const documentosRes = await api.get('/documentos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const creditosRes = await api.get('/creditos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      let pruebasModeloDual: any[] = [];
      try {
        const modeloDualRes = await api.get('/modelo-dual', {
          headers: { Authorization: `Bearer ${token}` },
        });
        pruebasModeloDual = modeloDualRes.data.data || [];
      } catch (error) {
        // Si la API aún no está disponible, simplemente usar array vacío
        console.warn('No se pudieron cargar las pruebas del Modelo Dual:', error);
      }

      const estudiantes = estudiantesRes.data.data || [];
      const docentes = docentesRes.data.data || [];
      const documentos = documentosRes.data.data || [];
      const creditosGrupos = creditosRes.data.data || [];

      const pendientes = documentos.filter((d: any) => d.estatus === 'PENDIENTE').length;
      const aprobados = documentos.filter((d: any) => d.estatus === 'APROBADO').length;
      const pruebasPendientes = pruebasModeloDual.filter((p: any) => p.estatus === 'PENDIENTE' || p.estatus === 'EN_REVISION').length;

      // Los créditos vienen agrupados por estudiante (array de arrays)
      // Cada elemento del array principal es un array de créditos de un estudiante
      // Necesitamos aplanar el array para obtener todos los créditos individuales
      let creditosPendientes = 0;
      if (Array.isArray(creditosGrupos) && creditosGrupos.length > 0) {
        try {
          // Aplanar el array de arrays para obtener todos los créditos
          const creditosPlano = creditosGrupos.flat();
          // Filtrar por estatus PENDIENTE y contar
          creditosPendientes = creditosPlano.filter((c: any) => c && c.estatus === 'PENDIENTE').length;
        } catch (error) {
          console.error('Error al procesar créditos:', error);
          creditosPendientes = 0;
        }
      }

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
        {
          icon: <Assignment sx={{ fontSize: 40 }} />,
          title: 'Créditos Pendientes',
          value: creditosPendientes.toString(),
          color: '#ef4444',
          action: () => navigate('/admin/creditos'),
        },
        {
          icon: <Psychology sx={{ fontSize: 40 }} />,
          title: 'Pruebas Modelo Dual Pendientes',
          value: pruebasPendientes.toString(),
          color: '#9c27b0',
          action: () => navigate('/admin/modelo-dual'),
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
      <PageHeader
        title="Panel de Administración"
        subtitle="Coordinación de Sistema Abierto · Modalidad Mixta"
        gradientFrom="#008000"
        gradientTo="#006000"
        maxWidth="xl"
        actions={
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton color="inherit" sx={{ color: '#FFFFFF' }}>
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
          </Stack>
        }
      />

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
          <Grid item xs={12} md={6} lg={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Assignment />}
              onClick={() => navigate('/admin/creditos')}
              sx={{
                height: 100,
                fontSize: '1.1rem',
                backgroundColor: '#008000',
                '&:hover': {
                  backgroundColor: '#006000',
                },
              }}
            >
              Validar Créditos
            </Button>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Psychology />}
              onClick={() => navigate('/admin/modelo-dual')}
              sx={{
                height: 100,
                fontSize: '1.1rem',
                backgroundColor: '#008000',
                '&:hover': {
                  backgroundColor: '#7b1fa2',
                },
              }}
            >
              Revisar Pruebas Modelo Dual
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

