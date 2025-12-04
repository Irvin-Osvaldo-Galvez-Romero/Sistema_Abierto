/**
 * Página de Notificaciones
 * Muestra las notificaciones del estudiante
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Chip,
  Alert,
  Stack,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  Info,
  MarkEmailRead,
  Delete,
  ArrowBack,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import api from '../services/api.service';
import PageHeader from '../components/PageHeader';

interface Notificacion {
  id: string;
  tipo: string;
  titulo: string;
  mensaje: string;
  leida: boolean;
  createdAt: string;
}

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadNotifications();
    }
  }, [isAuthenticated, navigate]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/notificaciones/my-notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotificaciones(response.data.data.notificaciones);
    } catch (error) {
      toast.error('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await api.patch(
        `/notificaciones/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotificaciones((prev) =>
        prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
      );

      toast.success('Notificación marcada como leída');
    } catch (error) {
      toast.error('Error al marcar notificación');
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      await api.patch(
        '/notificaciones/mark-all-read',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
      toast.success('Todas las notificaciones marcadas como leídas');
    } catch (error) {
      toast.error('Error al marcar notificaciones');
    }
  };

  const getIcon = (tipo: string) => {
    switch (tipo) {
      case 'DOCUMENTO_APROBADO':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'DOCUMENTO_RECHAZADO':
        return <Cancel sx={{ color: 'error.main' }} />;
      case 'DOCUMENTO_PENDIENTE':
        return <Info sx={{ color: 'warning.main' }} />;
      default:
        return <Info sx={{ color: 'info.main' }} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const unreadCount = notificaciones.filter((n) => !n.leida).length;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <PageHeader
        title="Notificaciones"
        subtitle="Resumen de movimientos y avisos del sistema"
        gradientFrom="#008000"
        gradientTo="#006000"
        actions={
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/dashboard')}
              sx={{
                borderColor: '#FFFFFF',
                color: '#FFFFFF',
                '&:hover': {
                  borderColor: '#FFFFFF',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Regresar
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<MarkEmailRead />}
                onClick={markAllAsRead}
                sx={{
                  borderColor: '#FFFFFF',
                  color: '#FFFFFF',
                  '&:hover': {
                    borderColor: '#FFFFFF',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                Marcar todas como leídas ({unreadCount})
              </Button>
            )}
          </Stack>
        }
      />

      <Container>
        {loading ? (
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Typography>Cargando notificaciones...</Typography>
          </Paper>
        ) : notificaciones.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Info sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No tienes notificaciones
            </Typography>
          </Paper>
        ) : (
          <Paper sx={{ borderRadius: 2 }}>
            <List>
              {notificaciones.map((notif, index) => (
                <React.Fragment key={notif.id}>
                  <ListItem
                    sx={{
                      bgcolor: notif.leida ? 'transparent' : '#f0fff0',
                      '&:hover': { bgcolor: notif.leida ? '#f5f5f5' : '#e0ffe0' },
                    }}
                    secondaryAction={
                      !notif.leida && (
                        <IconButton edge="end" onClick={() => markAsRead(notif.id)}>
                          <MarkEmailRead />
                        </IconButton>
                      )
                    }
                  >
                    <ListItemIcon>{getIcon(notif.tipo)}</ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" fontWeight={notif.leida ? 'normal' : 'bold'}>
                            {notif.titulo}
                          </Typography>
                          {!notif.leida && (
                            <Chip label="Nueva" size="small" color="primary" />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.primary" sx={{ mt: 0.5 }}>
                            {notif.mensaje}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                            {formatDate(notif.createdAt)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                  {index < notificaciones.length - 1 && <Box sx={{ borderBottom: 1, borderColor: 'divider' }} />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default NotificationsPage;

