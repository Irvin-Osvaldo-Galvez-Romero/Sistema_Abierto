/**
 * Página de Detalles del Estudiante (Admin)
 * Ver información completa y documentos del estudiante
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  School,
  ArrowBack,
  CheckCircle,
  Cancel,
  Download,
  Logout,
  Visibility,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

interface Estudiante {
  id: string;
  matricula: string;
  estatus: string;
  usuario: {
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno?: string;
    email: string;
    telefono?: string;
  };
  carrera?: {
    nombre: string;
  };
  documentos?: Array<{
    documento: {
      id: string;
      folio: string;
      tipo: string;
      estatus: string;
      rutaArchivo: string;
      createdAt: string;
    };
  }>;
}

export const AdminStudentDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { logout } = useAuthStore();
  const [estudiante, setEstudiante] = useState<Estudiante | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<any>(null);

  useEffect(() => {
    if (id) {
      loadStudent();
    }
  }, [id]);

  const loadStudent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`http://localhost:3001/api/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEstudiante(response.data.data);
    } catch (error: any) {
      toast.error('Error al cargar estudiante');
      navigate('/admin/estudiantes');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleViewDocument = async (doc: any) => {
    console.log('Documento seleccionado para preview:', doc);
    
    try {
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('No se encontró el token de autenticación');
        return;
      }

      // Obtener el archivo como blob para previsualización
      const response = await axios.get(`http://localhost:3001/api/upload/view/${doc.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      // Crear URL del blob
      const blobUrl = window.URL.createObjectURL(response.data);
      
      // Agregar la URL del blob al documento
      const docWithPreview = {
        ...doc,
        previewUrl: blobUrl,
      };
      
      setSelectedDoc(docWithPreview);
      setPreviewDialog(true);
    } catch (error: any) {
      console.error('Error al cargar vista previa:', error);
      toast.error('No se pudo cargar la vista previa del documento');
    }
  };

  const handleDownloadDocument = async (docId: string, tipo: string) => {
    try {
      console.log('Iniciando descarga del documento:', docId);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        toast.error('No se encontró el token de autenticación');
        return;
      }

      const response = await axios.get(`http://localhost:3001/api/upload/download/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      console.log('Respuesta recibida:', response);

      // Crear blob y descargar
      const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Obtener nombre del archivo desde Content-Disposition o usar uno por defecto
      const contentDisposition = response.headers['content-disposition'];
      let fileName = `${tipo}_${Date.now()}.pdf`;
      
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (fileNameMatch && fileNameMatch[1]) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Documento descargado exitosamente');
    } catch (error: any) {
      console.error('Error al descargar documento:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Error al descargar documento';
      toast.error(errorMsg);
    }
  };

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'APROBADO': return 'success';
      case 'RECHAZADO': return 'error';
      case 'PENDIENTE': return 'warning';
      case 'ACTIVO': return 'success';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (!estudiante) {
    return null;
  }

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
              <IconButton color="inherit" onClick={() => navigate('/admin/estudiantes')}>
                <ArrowBack />
              </IconButton>
              <School sx={{ fontSize: 40 }} />
              <Typography variant="h4" fontWeight="bold">
                Detalles del Estudiante
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

      <Container>
        {/* Información Personal */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#008000' }}>
            📋 Información Personal
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888' }}>Nombre Completo:</Typography>
              <Typography variant="h6" sx={{ color: '#000000' }}>
                {estudiante.usuario.nombre} {estudiante.usuario.apellidoPaterno} {estudiante.usuario.apellidoMaterno}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888' }}>Matrícula:</Typography>
              <Typography variant="h6" sx={{ color: '#000000', fontFamily: 'monospace' }}>
                {estudiante.matricula}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888' }}>Email:</Typography>
              <Typography variant="body1" sx={{ color: '#000000' }}>
                {estudiante.usuario.email}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888' }}>Teléfono:</Typography>
              <Typography variant="body1" sx={{ color: '#000000' }}>
                {estudiante.usuario.telefono || 'Sin teléfono'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888' }}>Carrera:</Typography>
              <Typography variant="body1" sx={{ color: '#000000' }}>
                {estudiante.carrera?.nombre || 'Sin carrera asignada'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888' }}>Estatus:</Typography>
              <Chip
                label={estudiante.estatus}
                color={getEstatusColor(estudiante.estatus) as any}
                sx={{ mt: 1 }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Documentos del Estudiante */}
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#008000' }}>
            📄 Documentos Subidos
          </Typography>

          {!estudiante.documentos || estudiante.documentos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: '#888888' }}>
                Este estudiante no ha subido documentos
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#008000' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Folio</TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Tipo</TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Fecha</TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Estatus</TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estudiante.documentos.map((doc) => (
                    <TableRow key={doc.documento.id}>
                      <TableCell sx={{ fontFamily: 'monospace', color: '#000000' }}>
                        {doc.documento.folio}
                      </TableCell>
                      <TableCell sx={{ color: '#000000' }}>
                        {doc.documento.tipo.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell sx={{ color: '#333333' }}>
                        {new Date(doc.documento.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={doc.documento.estatus}
                          color={getEstatusColor(doc.documento.estatus) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            onClick={() => handleViewDocument(doc.documento)}
                            sx={{ color: '#008000' }}
                            title="Ver previsualización"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDownloadDocument(doc.documento.id, doc.documento.tipo)}
                            sx={{ color: '#008000' }}
                            title="Descargar"
                          >
                            <Download />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/admin/estudiantes')}
            sx={{
              borderColor: '#008000',
              color: '#008000',
            }}
          >
            Volver a la Lista
          </Button>
        </Box>
      </Container>

      {/* Dialog de Previsualización */}
      <Dialog
        open={previewDialog}
        onClose={() => setPreviewDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#008000', color: '#FFFFFF' }}>
          📄 Previsualización del Documento
        </DialogTitle>
        <DialogContent sx={{ mt: 2, minHeight: '500px' }}>
          {selectedDoc && (
            <Box>
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#888888' }}>Folio:</Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>{selectedDoc.folio}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#888888' }}>Tipo:</Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    {selectedDoc.tipo.replace(/_/g, ' ')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#888888' }}>Tamaño:</Typography>
                  <Typography variant="body1" sx={{ color: '#000000' }}>
                    {(selectedDoc.tamanoBytes / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" sx={{ color: '#888888' }}>Estatus:</Typography>
                  <Chip
                    label={selectedDoc.estatus}
                    color={getEstatusColor(selectedDoc.estatus) as any}
                    size="small"
                  />
                </Grid>
              </Grid>

              {/* Previsualización del PDF */}
              {selectedDoc.mimeType === 'application/pdf' ? (
                <Box
                  sx={{
                    width: '100%',
                    height: '500px',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  {selectedDoc.previewUrl ? (
                    <iframe
                      src={selectedDoc.previewUrl}
                      title="Vista previa del documento"
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                      <Typography>Cargando vista previa...</Typography>
                    </Box>
                  )}
                </Box>
              ) : (
                <Box
                  sx={{
                    width: '100%',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #ddd',
                    borderRadius: 1,
                    overflow: 'hidden',
                  }}
                >
                  {selectedDoc.previewUrl ? (
                    <img
                      src={selectedDoc.previewUrl}
                      alt="Vista previa"
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        console.error('Error al cargar imagen');
                        toast.error('No se puede cargar la vista previa de la imagen');
                      }}
                    />
                  ) : (
                    <Typography>Cargando vista previa...</Typography>
                  )}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            onClick={() => {
              // Limpiar URL del blob para evitar fugas de memoria
              if (selectedDoc?.previewUrl) {
                window.URL.revokeObjectURL(selectedDoc.previewUrl);
              }
              setPreviewDialog(false);
              setSelectedDoc(null);
            }} 
            sx={{ color: '#333333' }}
          >
            Cerrar
          </Button>
          {selectedDoc && (
            <Button
              variant="contained"
              startIcon={<Download />}
              onClick={() => {
                handleDownloadDocument(selectedDoc.id, selectedDoc.tipo);
                // Limpiar URL del blob
                if (selectedDoc.previewUrl) {
                  window.URL.revokeObjectURL(selectedDoc.previewUrl);
                }
                setPreviewDialog(false);
                setSelectedDoc(null);
              }}
              sx={{
                backgroundColor: '#008000',
                '&:hover': {
                  backgroundColor: '#006000',
                },
              }}
            >
              Descargar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStudentDetailPage;

