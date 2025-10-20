/**
 * Página de Revisión de Documentos (Admin)
 * Ver y aprobar/rechazar documentos de estudiantes
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
} from '@mui/material';
import {
  School,
  ArrowBack,
  CheckCircle,
  Cancel,
  Visibility,
  Logout,
  Download,
  ViewInAr,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import ConfirmationDialog from '../components/ConfirmationDialog';

interface Documento {
  id: string;
  folio: string;
  tipo: string;
  titulo: string;
  estatus: string;
  tamanoBytes: number;
  mimeType: string;
  createdAt: string;
  documentosEstudiante: Array<{
    estudiante: {
      matricula: string;
      usuario: {
        nombre: string;
        apellidoPaterno: string;
      };
    };
  }>;
}

export const AdminDocumentsPage: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [documentos, setDocumentos] = useState<Documento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<Documento | null>(null);
  const [reviewDialog, setReviewDialog] = useState(false);
  const [approving, setApproving] = useState(true);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('http://localhost:3001/api/documentos', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDocumentos(response.data.data);
    } catch (error) {
      toast.error('Error al cargar documentos');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async () => {
    if (!selectedDoc) return;

    if (!approving && !motivoRechazo.trim()) {
      toast.error('Debes proporcionar un motivo de rechazo');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await axios.patch(
        `http://localhost:3001/api/upload/${selectedDoc.id}/review`,
        {
          aprobado: approving,
          motivoRechazo: approving ? undefined : motivoRechazo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(approving ? 'Documento aprobado' : 'Documento rechazado');
      setReviewDialog(false);
      setMotivoRechazo('');
      loadDocuments();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Error al revisar documento');
    }
  };

  const openReviewDialog = (doc: Documento, approve: boolean) => {
    setSelectedDoc(doc);
    setApproving(approve);
    setConfirmDialog(true);
  };

  const handleConfirmReview = () => {
    setConfirmDialog(false);
    setReviewDialog(true);
  };

  const handleViewDocument = async (doc: Documento) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:3001/api/upload/view/${doc.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      const blobUrl = window.URL.createObjectURL(response.data);
      const docWithPreview = { ...doc, previewUrl: blobUrl };
      setSelectedDoc(docWithPreview as any);
      setPreviewDialog(true);
    } catch (error: any) {
      console.error('Error al cargar vista previa:', error);
      toast.error('No se pudo cargar la vista previa del documento');
    }
  };

  const handleDownloadDocument = async (doc: Documento) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(
        `http://localhost:3001/api/upload/download/${doc.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.folio}_${doc.tipo}.${doc.mimeType.split('/')[1]}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Documento descargado exitosamente');
    } catch (error: any) {
      console.error('Error al descargar:', error);
      toast.error('No se pudo descargar el documento');
    }
  };

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'APROBADO': return 'success';
      case 'RECHAZADO': return 'error';
      case 'PENDIENTE': return 'warning';
      default: return 'default';
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const filteredDocs = documentos.filter((doc) => {
    if (tabValue === 0) return doc.estatus === 'PENDIENTE';
    if (tabValue === 1) return doc.estatus === 'APROBADO';
    if (tabValue === 2) return doc.estatus === 'RECHAZADO';
    return true;
  });

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
                Revisión de Documentos
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
        {/* Tabs de filtros */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              '& .MuiTab-root': { color: '#333333' },
              '& .Mui-selected': { color: '#008000' },
              '& .MuiTabs-indicator': { backgroundColor: '#008000' },
            }}
          >
            <Tab label="Pendientes" />
            <Tab label="Aprobados" />
            <Tab label="Rechazados" />
            <Tab label="Todos" />
          </Tabs>
        </Paper>

        {/* Tabla de Documentos */}
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#008000' }}>
              <TableRow>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Folio</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Tipo</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Estudiante</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Matrícula</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Tamaño</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Estatus</TableCell>
                <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: '#888888' }}>Cargando documentos...</Typography>
                  </TableCell>
                </TableRow>
              ) : filteredDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography sx={{ color: '#888888' }}>No hay documentos en esta categoría</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocs.map((doc) => (
                  <TableRow
                    key={doc.id}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f0fff0',
                      },
                    }}
                  >
                    <TableCell sx={{ fontFamily: 'monospace', color: '#000000' }}>{doc.folio}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>{doc.tipo.replace(/_/g, ' ')}</TableCell>
                    <TableCell sx={{ color: '#000000' }}>
                      {doc.documentosEstudiante[0]?.estudiante.usuario.nombre}{' '}
                      {doc.documentosEstudiante[0]?.estudiante.usuario.apellidoPaterno}
                    </TableCell>
                    <TableCell sx={{ color: '#333333' }}>
                      {doc.documentosEstudiante[0]?.estudiante.matricula || 'N/A'}
                    </TableCell>
                    <TableCell sx={{ color: '#333333' }}>
                      {(doc.tamanoBytes / 1024 / 1024).toFixed(2)} MB
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doc.estatus}
                        color={getEstatusColor(doc.estatus) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <IconButton
                          onClick={() => handleViewDocument(doc)}
                          sx={{ color: '#1976d2' }}
                          title="Ver Documento"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDownloadDocument(doc)}
                          sx={{ color: '#757575' }}
                          title="Descargar"
                        >
                          <Download />
                        </IconButton>
                        {doc.estatus === 'PENDIENTE' && (
                          <>
                            <IconButton
                              onClick={() => openReviewDialog(doc, true)}
                              sx={{ color: '#008000' }}
                              title="Aprobar"
                            >
                              <CheckCircle />
                            </IconButton>
                            <IconButton
                              onClick={() => openReviewDialog(doc, false)}
                              sx={{ color: '#CC0000' }}
                              title="Rechazar"
                            >
                              <Cancel />
                            </IconButton>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Diálogo de Confirmación antes de Revisar */}
      <ConfirmationDialog
        open={confirmDialog}
        title={approving ? 'Aprobar Documento' : 'Rechazar Documento'}
        message={
          selectedDoc
            ? `¿Estás seguro de que deseas ${approving ? 'APROBAR' : 'RECHAZAR'} el documento ${selectedDoc.tipo} del estudiante ${selectedDoc.documentosEstudiante[0]?.estudiante.usuario.nombre} ${selectedDoc.documentosEstudiante[0]?.estudiante.usuario.apellidoPaterno}?`
            : ''
        }
        onConfirm={handleConfirmReview}
        onClose={() => setConfirmDialog(false)}
        confirmText="Continuar"
        cancelText="Cancelar"
        type={approving ? 'success' : 'error'}
      />

      {/* Dialog de Revisión (Motivo de rechazo) */}
      <Dialog open={reviewDialog} onClose={() => setReviewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ backgroundColor: approving ? '#008000' : '#CC0000', color: '#FFFFFF' }}>
          {approving ? '✅ Aprobar Documento' : '❌ Rechazar Documento'}
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body1" gutterBottom sx={{ color: '#000000' }}>
            <strong>Folio:</strong> {selectedDoc?.folio}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: '#000000' }}>
            <strong>Tipo:</strong> {selectedDoc?.tipo.replace(/_/g, ' ')}
          </Typography>
          <Typography variant="body1" gutterBottom sx={{ color: '#000000' }}>
            <strong>Estudiante:</strong>{' '}
            {selectedDoc?.documentosEstudiante[0]?.estudiante.usuario.nombre}{' '}
            {selectedDoc?.documentosEstudiante[0]?.estudiante.usuario.apellidoPaterno}
          </Typography>

          {!approving && (
            <TextField
              fullWidth
              label="Motivo del Rechazo"
              multiline
              rows={4}
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              required
              sx={{ mt: 2 }}
              placeholder="Ejemplo: El documento está borroso y no se puede leer"
            />
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setReviewDialog(false)} sx={{ color: '#333333' }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleReview}
            sx={{
              backgroundColor: approving ? '#008000' : '#CC0000',
              '&:hover': {
                backgroundColor: approving ? '#006000' : '#AA0000',
              },
            }}
          >
            {approving ? 'Aprobar' : 'Rechazar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de Vista Previa */}
      <Dialog 
        open={previewDialog} 
        onClose={() => {
          if ((selectedDoc as any)?.previewUrl) {
            window.URL.revokeObjectURL((selectedDoc as any).previewUrl);
          }
          setPreviewDialog(false);
        }} 
        maxWidth="lg" 
        fullWidth
      >
        <DialogTitle sx={{ backgroundColor: '#1976d2', color: '#FFFFFF' }}>
          👁️ Previsualización del Documento
        </DialogTitle>
        <DialogContent sx={{ mt: 2, minHeight: '500px' }}>
          {selectedDoc && (
            <>
              <Typography variant="body2" gutterBottom>
                <strong>Folio:</strong> {selectedDoc.folio}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Tipo:</strong> {selectedDoc.tipo.replace(/_/g, ' ')}
              </Typography>
              <Typography variant="body2" gutterBottom sx={{ mb: 2 }}>
                <strong>Estudiante:</strong>{' '}
                {selectedDoc.documentosEstudiante[0]?.estudiante.usuario.nombre}{' '}
                {selectedDoc.documentosEstudiante[0]?.estudiante.usuario.apellidoPaterno}
              </Typography>

              {selectedDoc.mimeType === 'application/pdf' ? (
                <Box sx={{ width: '100%', height: '500px', border: '1px solid #ddd', borderRadius: 1, overflow: 'hidden' }}>
                  {(selectedDoc as any).previewUrl ? (
                    <iframe
                      src={(selectedDoc as any).previewUrl}
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
                <Box sx={{ textAlign: 'center' }}>
                  {(selectedDoc as any).previewUrl ? (
                    <img
                      src={(selectedDoc as any).previewUrl}
                      alt="Vista previa"
                      style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '4px' }}
                    />
                  ) : (
                    <Typography>Cargando vista previa...</Typography>
                  )}
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              if ((selectedDoc as any)?.previewUrl) {
                window.URL.revokeObjectURL((selectedDoc as any).previewUrl);
              }
              setPreviewDialog(false);
              setSelectedDoc(null);
            }}
            sx={{ color: '#333333' }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDocumentsPage;

