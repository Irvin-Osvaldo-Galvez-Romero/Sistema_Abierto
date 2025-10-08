/**
 * Página de Dashboard
 * Dashboard principal del estudiante
 */

import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Chip,
  IconButton,
} from '@mui/material';
import {
  School,
  Description,
  Logout,
  Dashboard as DashboardIcon,
  Notifications,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, loadUser } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadUser();
    }
  }, [isAuthenticated, navigate, loadUser]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Estadísticas de ejemplo
  const stats = [
    {
      icon: <Description sx={{ fontSize: 40 }} />,
      title: 'Documentos Aprobados',
      value: '0/3',
      color: '#008000',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
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
                Sistema Universitario
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" onClick={() => navigate('/notificaciones')}>
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
                    backgroundColor: 'rgba(255,255,255,0.1)' 
                  } 
                }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container>
        {/* Información del Usuario */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
              }}
            >
              {user?.nombre?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                ¡Bienvenido, {user?.nombre || 'Usuario'}!
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                {user?.email}
              </Typography>
              <Chip
                label={user?.rol || 'ESTUDIANTE'}
                color="primary"
                size="small"
                sx={{ mt: 1 }}
              />
            </Box>
          </Box>
        </Paper>

        {/* Estadísticas */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          {stats.map((stat, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  borderRadius: 2,
                  border: '2px solid #008000',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
                    <Box
                      sx={{
                        backgroundColor: stat.color,
                        color: 'white',
                        borderRadius: 2,
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {stat.icon}
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography variant="h3" fontWeight="bold" sx={{ color: '#008000' }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="h6" color="text.secondary">
                        {stat.title}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Accesos Rápidos */}
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#000000' }}>
          Acciones Principales
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<Description />}
              onClick={() => navigate('/documentos')}
              sx={{ 
                height: 100, 
                borderRadius: 2, 
                fontSize: '1.2rem',
                backgroundColor: '#008000',
                '&:hover': {
                  backgroundColor: '#006000',
                },
              }}
            >
              Subir Documentos
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<Notifications />}
              onClick={() => navigate('/notificaciones')}
              sx={{ 
                height: 100, 
                borderRadius: 2, 
                fontSize: '1.2rem',
                borderColor: '#008000',
                color: '#008000',
                borderWidth: 2,
                '&:hover': {
                  borderColor: '#006000',
                  backgroundColor: 'rgba(0, 128, 0, 0.04)',
                  borderWidth: 2,
                },
              }}
            >
              Ver Notificaciones
            </Button>
          </Grid>
        </Grid>

        {/* Información Importante */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#000000' }}>
            Información Importante
          </Typography>
          <Paper sx={{ p: 4, borderRadius: 2, border: '1px solid #e0e0e0' }}>
            <Box sx={{ textAlign: 'center' }}>
              <School sx={{ fontSize: 80, color: '#008000', mb: 2 }} />
              <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: '#000000' }}>
                ¡Bienvenido al Sistema de Reinscripción!
              </Typography>
              <Typography variant="body1" sx={{ mb: 3, color: '#333333' }}>
                Para completar tu reinscripción, debes subir los 3 documentos requeridos.
              </Typography>
              <Box sx={{ 
                bgcolor: '#f0fff0', 
                p: 3, 
                borderRadius: 2, 
                border: '2px solid #008000',
                mb: 2 
              }}>
                <Typography variant="body1" fontWeight="bold" sx={{ color: '#008000', mb: 1 }}>
                  📄 Documentos Requeridos:
                </Typography>
                <Typography variant="body2" sx={{ color: '#333333' }}>
                  1. Kardex (Historial Académico)<br />
                  2. Ficha de Reinscripción<br />
                  3. Comprobante de Pago
                </Typography>
              </Box>
              <Button
                variant="contained"
                size="large"
                startIcon={<Description />}
                onClick={() => navigate('/documentos')}
                sx={{ 
                  mt: 2,
                  px: 4,
                  backgroundColor: '#008000',
                  '&:hover': {
                    backgroundColor: '#006000',
                  },
                }}
              >
                Ir a Subir Documentos
              </Button>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;


