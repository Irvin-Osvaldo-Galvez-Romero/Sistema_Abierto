/**
 * Página de Subida de Documentos
 * Permite a los estudiantes subir sus 3 documentos requeridos
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  LinearProgress,
  IconButton,
  Badge,
} from '@mui/material';
import {
  CloudUpload,
  CheckCircle,
  Cancel,
  Pending,
  Notifications,
  School,
  Logout,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import axios from 'axios';

interface Documento {
  id: string;
  folio: string;
  tipo: string;
  titulo: string;
  estatus: string;
  createdAt: string;
  documentosEstudiante: Array<{
    escaneoVirus: boolean;
    virusDetectado: boolean;
    motivoRechazo?: string;
  }>;
}

export const UploadDocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [tiposFaltantes, setTiposFaltantes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingType, setUploadingType] = useState<string | null>(null);
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      loadDocuments();
      loadNotifications();
    }
  }, [isAuthenticated, navigate]);

  const loadDocuments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/upload/my-documents', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDocumentos(response.data.data.documentos);
      setTiposFaltantes(response.data.data.tiposFaltantes);
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/notificaciones/my-notifications?unread=true', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotificacionesCount(response.data.data.unreadCount || 0);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const handleFileUpload = async (tipo: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingType(tipo);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('archivo', file);
      formData.append('tipo', tipo);

      const token = localStorage.getItem('accessToken');
      
      await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Documento subido exitosamente. Está pendiente de revisión.');
      await loadDocuments();
      await loadNotifications();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Error al subir archivo';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setUploadingType(null);
    }
  };

  const getDocumentStatus = (tipo: string) => {
    const doc = documentos.find((d) => d.tipo === tipo);
    if (!doc) return { status: 'FALTANTE', color: 'default', icon: <Pending /> };

    switch (doc.estatus) {
      case 'APROBADO':
        return { status: 'APROBADO', color: 'success', icon: <CheckCircle /> };
      case 'RECHAZADO':
        return { status: 'RECHAZADO', color: 'error', icon: <Cancel />, motivo: doc.documentosEstudiante[0]?.motivoRechazo };
      default:
        return { status: 'PENDIENTE', color: 'warning', icon: <Pending /> };
    }
  };

  const documentTypes = [
    { tipo: 'KARDEX', nombre: 'Kardex', descripcion: 'Historial académico completo' },
    { tipo: 'FICHA_REINSCRIPCION', nombre: 'Ficha de Reinscripción', descripcion: 'Documento de reinscripción del semestre' },
    { tipo: 'COMPROBANTE_PAGO', nombre: 'Comprobante de Pago', descripcion: 'Comprobante de pago de reinscripción' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const allDocsApproved = documentos.length === 3 && documentos.every((d) => d.estatus === 'APROBADO');

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
                Mis Documentos
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton color="inherit" onClick={() => navigate('/notificaciones')}>
                <Badge badgeContent={notificacionesCount} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
              <IconButton color="inherit" onClick={() => navigate('/dashboard')}>
                <DashboardIcon />
              </IconButton>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<Logout />}
                onClick={handleLogout}
              >
                Salir
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container>
        {/* Mensaje de bienvenida */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            ¡Hola, {user?.nombre}!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Debes subir los siguientes 3 documentos para completar tu reinscripción:
          </Typography>
        </Paper>

        {/* Alerta de completitud */}
        {allDocsApproved && (
          <Alert severity="success" sx={{ mb: 3 }}>
            ¡Felicidades! Todos tus documentos han sido aprobados. Tu reinscripción está completa.
          </Alert>
        )}

        {/* Documentos requeridos */}
        <Grid container spacing={3}>
          {documentTypes.map((docType) => {
            const status = getDocumentStatus(docType.tipo);
            const isUploading = uploadingType === docType.tipo;

            return (
              <Grid item xs={12} md={4} key={docType.tipo}>
                <Card sx={{ height: '100%', borderRadius: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      {status.icon}
                      <Typography variant="h6" sx={{ ml: 1, flex: 1 }} fontWeight="bold">
                        {docType.nombre}
                      </Typography>
                      <Chip
                        label={status.status}
                        color={status.color as any}
                        size="small"
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {docType.descripcion}
                    </Typography>

                    {status.motivo && (
                      <Alert severity="error" sx={{ mb: 2, fontSize: '0.85rem' }}>
                        <strong>Motivo de rechazo:</strong><br />
                        {status.motivo}
                      </Alert>
                    )}

                    {status.status === 'APROBADO' ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        color="success"
                        disabled
                        startIcon={<CheckCircle />}
                      >
                        Aprobado
                      </Button>
                    ) : (
                      <>
                        <input
                          accept="application/pdf,image/jpeg,image/jpg,image/png"
                          style={{ display: 'none' }}
                          id={`upload-${docType.tipo}`}
                          type="file"
                          onChange={(e) => handleFileUpload(docType.tipo, e)}
                          disabled={loading}
                        />
                        <label htmlFor={`upload-${docType.tipo}`}>
                          <Button
                            fullWidth
                            variant="contained"
                            component="span"
                            startIcon={<CloudUpload />}
                            disabled={loading}
                          >
                            {status.status === 'RECHAZADO' ? 'Subir de Nuevo' : 'Subir Archivo'}
                          </Button>
                        </label>
                      </>
                    )}

                    {isUploading && (
                      <Box sx={{ mt: 2 }}>
                        <LinearProgress />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                          Subiendo y escaneando archivo...
                        </Typography>
                      </Box>
                    )}

                    <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                      Formatos permitidos: PDF, JPG, PNG (máx. 10MB)
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

        {/* Información de seguridad */}
        <Paper sx={{ p: 3, mt: 4, borderRadius: 2, bgcolor: '#f0f0f0', border: '2px solid #008000' }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ color: '#008000' }}>
            🛡️ Seguridad de Archivos
          </Typography>
          <Typography variant="body2" paragraph>
            • Todos los archivos son escaneados automáticamente para detectar virus
          </Typography>
          <Typography variant="body2" paragraph>
            • Solo se permiten archivos PDF e imágenes
          </Typography>
          <Typography variant="body2" paragraph>
            • Tamaño máximo: 10MB por archivo
          </Typography>
          <Typography variant="body2">
            • Recibirás una notificación cuando tus documentos sean revisados
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default UploadDocumentsPage;

