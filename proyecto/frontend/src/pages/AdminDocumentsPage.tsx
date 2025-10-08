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
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

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
    setReviewDialog(true);
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
                      {doc.estatus === 'PENDIENTE' && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
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
                        </Box>
                      )}
                      {doc.estatus !== 'PENDIENTE' && (
                        <Typography variant="caption" sx={{ color: '#888888' }}>
                          Revisado
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Dialog de Revisión */}
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
    </Box>
  );
};

export default AdminDocumentsPage;

