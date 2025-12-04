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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle,
  Cancel,
  Download,
  Logout,
  Visibility,
  School,
  PictureAsPdf,
  Edit,
  Save,
  Close,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import api from '../services/api.service';
import CreditosService from '../services/creditos.service';

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
    id: string;
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
  creditos?: Array<{
    id: string;
    numero: number;
    tipo: string;
    titulo: string;
    descripcion: string;
    horasCurso?: number | null;
    horasTotales?: number | null;
    estatus: string;
    motivoRechazo?: string | null;
    archivoOriginal: string;
    archivoCombinado?: string | null;
    archivoValidacionGenerada?: string | null;
    archivoValidado?: string | null;
    fechaEnvio: string;
    fechaRevision?: string | null;
    archivosAdicionales?: Array<{
      id: string;
      horas: number | null;
      rutaArchivo: string;
      createdAt: string;
    }>;
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
  const [reviewDialog, setReviewDialog] = useState(false);
  const [approving, setApproving] = useState(true);
  const [motivoRechazo, setMotivoRechazo] = useState('');
  const [creditoDialogValidar, setCreditoDialogValidar] = useState<{ open: boolean; credito?: any; observaciones?: string; archivo?: File | null }>({ open: false });
  const [creditoDialogRechazo, setCreditoDialogRechazo] = useState<{ open: boolean; credito?: any; motivo: string }>({ open: false, motivo: '' });
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [carreras, setCarreras] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    telefono: '',
    matricula: '',
    carreraId: '',
    estatus: '',
  });

  useEffect(() => {
    if (id) {
      loadStudent();
      loadCarreras();
    }
  }, [id]);

  const loadCarreras = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await api.get('/carreras', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarreras(response.data.data || []);
    } catch (error) {
      console.error('Error al cargar carreras:', error);
      toast.error('Error al cargar las carreras disponibles');
    }
  };

  const loadStudent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await api.get(`/students/${id}`, {
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
      const response = await api.get(`/upload/view/${doc.id}`, {
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

      const response = await api.get(`/upload/download/${docId}`, {
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

  const handleReviewDocument = async () => {
    if (!selectedDoc) return;

    if (!approving && !motivoRechazo.trim()) {
      toast.error('Debes proporcionar un motivo de rechazo');
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      await api.patch(
        `/upload/${selectedDoc.id}/review`,
        {
          aprobado: approving,
          motivoRechazo: approving ? undefined : motivoRechazo,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(approving ? 'Documento aprobado' : 'Documento rechazado');
      setReviewDialog(false);
      setMotivoRechazo('');
      setSelectedDoc(null);
      loadStudent();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || 'Error al revisar documento');
    }
  };

  const openReviewDialog = (doc: any, approve: boolean) => {
    setSelectedDoc(doc);
    setApproving(approve);
    setReviewDialog(true);
  };

  const handleValidarCredito = async () => {
    if (!creditoDialogValidar.credito) {
      toast.error('No se seleccionó un crédito');
      return;
    }

    try {
      await CreditosService.revisarCredito({
        id: creditoDialogValidar.credito.id,
        aprobado: true,
        observaciones: creditoDialogValidar.observaciones,
        archivoFirmado: creditoDialogValidar.archivo || undefined,
      });
      toast.success(`Crédito ${creditoDialogValidar.credito.numero} validado correctamente`);
      setCreditoDialogValidar({ open: false });
      loadStudent();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No se pudo validar el crédito');
    }
  };

  const handleRechazarCredito = async () => {
    if (!creditoDialogRechazo.credito) return;
    if (!creditoDialogRechazo.motivo.trim()) {
      toast.error('Debes indicar el motivo de rechazo');
      return;
    }

    try {
      await CreditosService.revisarCredito({
        id: creditoDialogRechazo.credito.id,
        aprobado: false,
        motivoRechazo: creditoDialogRechazo.motivo.trim(),
      });
      toast.success(`Crédito ${creditoDialogRechazo.credito.numero} rechazado`);
      setCreditoDialogRechazo({ open: false, motivo: '' });
      loadStudent();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No se pudo rechazar el crédito');
    }
  };

  const handleSaveStudent = async () => {
    if (!id) return;

    // Validaciones básicas
    if (!formData.nombre.trim()) {
      toast.error('El nombre es requerido');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('El email es requerido');
      return;
    }
    if (!formData.matricula.trim()) {
      toast.error('La matrícula es requerida');
      return;
    }
    if (formData.telefono && formData.telefono.length !== 10) {
      toast.error('El teléfono debe tener 10 dígitos');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('accessToken');
      
      const updateData: any = {};
      
      // Campos del Usuario
      if (formData.nombre) updateData.nombre = formData.nombre.trim();
      if (formData.apellidoPaterno !== undefined) updateData.apellidoPaterno = formData.apellidoPaterno.trim() || '';
      if (formData.apellidoMaterno !== undefined) updateData.apellidoMaterno = formData.apellidoMaterno.trim() || '';
      if (formData.email) updateData.email = formData.email.trim();
      if (formData.telefono !== undefined) updateData.telefono = formData.telefono.trim() || null;
      
      // Campos del Estudiante
      if (formData.matricula) updateData.matricula = formData.matricula.trim();
      
      // Incluir carreraId si está presente (incluso si está vacío, para permitir remover la carrera)
      if (formData.carreraId !== undefined) {
        updateData.carreraId = formData.carreraId || null;
      }
      
      // Incluir estatus si está presente
      if (formData.estatus) {
        updateData.estatus = formData.estatus;
      }

      await api.put(`/students/${id}`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Información del estudiante actualizada correctamente');
      setEditMode(false);
      setFormData({ nombre: '', apellidoPaterno: '', apellidoMaterno: '', email: '', telefono: '', matricula: '', carreraId: '', estatus: '' });
      loadStudent();
    } catch (error: any) {
      toast.error(error.response?.data?.error?.message || error.response?.data?.message || 'Error al actualizar la información del estudiante');
    } finally {
      setSaving(false);
    }
  };

  const getEstatusColor = (estatus: string) => {
    switch (estatus) {
      case 'APROBADO':
      case 'VALIDADO': return 'success';
      case 'RECHAZADO': return 'error';
      case 'PENDIENTE': return 'warning';
      case 'EN_REVISION': return 'info';
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
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: '#008000' }}>
            📋 Información Personal
          </Typography>
            {!editMode ? (
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={() => {
                  setEditMode(true);
                  setFormData({
                    nombre: estudiante.usuario.nombre || '',
                    apellidoPaterno: estudiante.usuario.apellidoPaterno || '',
                    apellidoMaterno: estudiante.usuario.apellidoMaterno || '',
                    email: estudiante.usuario.email || '',
                    telefono: estudiante.usuario.telefono || '',
                    matricula: estudiante.matricula || '',
                    carreraId: estudiante.carrera?.id || '',
                    estatus: estudiante.estatus || 'ACTIVO',
                  });
                }}
                sx={{ borderColor: '#008000', color: '#008000' }}
              >
                Editar
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<Close />}
                  onClick={() => {
                    setEditMode(false);
                    setFormData({ nombre: '', apellidoPaterno: '', apellidoMaterno: '', email: '', telefono: '', matricula: '', carreraId: '', estatus: '' });
                  }}
                  sx={{ borderColor: '#666', color: '#666' }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={16} sx={{ color: 'inherit' }} /> : <Save />}
                  onClick={handleSaveStudent}
                  disabled={saving}
                  sx={{ backgroundColor: '#008000', '&:hover': { backgroundColor: '#006000' } }}
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </Button>
              </Box>
            )}
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: '#888888', mb: 1 }}>Nombre:</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  size="small"
                  required
                />
              ) : (
                <Typography variant="h6" sx={{ color: '#000000' }}>
                  {estudiante.usuario.nombre}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: '#888888', mb: 1 }}>Apellido Paterno:</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  value={formData.apellidoPaterno}
                  onChange={(e) => setFormData({ ...formData, apellidoPaterno: e.target.value })}
                  size="small"
                />
              ) : (
                <Typography variant="h6" sx={{ color: '#000000' }}>
                  {estudiante.usuario.apellidoPaterno || ''}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="body2" sx={{ color: '#888888', mb: 1 }}>Apellido Materno:</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  value={formData.apellidoMaterno}
                  onChange={(e) => setFormData({ ...formData, apellidoMaterno: e.target.value })}
                  size="small"
                />
              ) : (
              <Typography variant="h6" sx={{ color: '#000000' }}>
                  {estudiante.usuario.apellidoMaterno || ''}
              </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888', mb: 1 }}>Matrícula:</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  value={formData.matricula}
                  onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  size="small"
                  required
                  sx={{ fontFamily: 'monospace' }}
                />
              ) : (
              <Typography variant="h6" sx={{ color: '#000000', fontFamily: 'monospace' }}>
                {estudiante.matricula}
              </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888', mb: 1 }}>Email:</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  size="small"
                  required
                />
              ) : (
              <Typography variant="body1" sx={{ color: '#000000' }}>
                {estudiante.usuario.email}
              </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888', mb: 1 }}>Teléfono:</Typography>
              {editMode ? (
                <TextField
                  fullWidth
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  size="small"
                  placeholder="10 dígitos"
                  inputProps={{ maxLength: 10 }}
                />
              ) : (
              <Typography variant="body1" sx={{ color: '#000000' }}>
                {estudiante.usuario.telefono || 'Sin teléfono'}
              </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888', mb: 1 }}>Carrera:</Typography>
              {editMode ? (
                <FormControl fullWidth>
                  <InputLabel>Carrera</InputLabel>
                  <Select
                    value={formData.carreraId}
                    onChange={(e: any) => setFormData({ ...formData, carreraId: e.target.value })}
                    label="Carrera"
                  >
                    <MenuItem value="">
                      <em>Sin carrera asignada</em>
                    </MenuItem>
                    {carreras.map((carrera) => (
                      <MenuItem key={carrera.id} value={carrera.id}>
                        {carrera.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
              <Typography variant="body1" sx={{ color: '#000000' }}>
                {estudiante.carrera?.nombre || 'Sin carrera asignada'}
              </Typography>
              )}
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: '#888888', mb: 1 }}>Estatus:</Typography>
              {editMode ? (
                <FormControl fullWidth>
                  <InputLabel>Estatus</InputLabel>
                  <Select
                    value={formData.estatus}
                    onChange={(e: any) => setFormData({ ...formData, estatus: e.target.value })}
                    label="Estatus"
                  >
                    <MenuItem value="ACTIVO">Activo</MenuItem>
                    <MenuItem value="INACTIVO">Inactivo</MenuItem>
                    <MenuItem value="BAJA">Baja</MenuItem>
                    <MenuItem value="EGRESADO">Egresado</MenuItem>
                  </Select>
                </FormControl>
              ) : (
              <Chip
                label={estudiante.estatus}
                color={getEstatusColor(estudiante.estatus) as any}
                sx={{ mt: 1 }}
              />
              )}
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
                          {doc.documento.estatus === 'PENDIENTE' && (
                            <>
                              <IconButton
                                onClick={() => openReviewDialog(doc.documento, true)}
                                sx={{ color: '#008000' }}
                                title="Aprobar"
                              >
                                <CheckCircle />
                              </IconButton>
                              <IconButton
                                onClick={() => openReviewDialog(doc.documento, false)}
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
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Créditos Complementarios del Estudiante */}
        <Paper sx={{ p: 3, borderRadius: 2, mt: 3 }}>
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: '#008000' }}>
            🎓 Créditos Complementarios
          </Typography>

          {!estudiante.creditos || estudiante.creditos.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography sx={{ color: '#888888' }}>
                Este estudiante no ha subido créditos complementarios
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead sx={{ backgroundColor: '#008000' }}>
                  <TableRow>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>#</TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Tipo</TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Título</TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Descripción</TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Fecha</TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold' }}>Estatus</TableCell>
                    <TableCell sx={{ color: '#FFFFFF', fontWeight: 'bold', textAlign: 'center' }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {estudiante.creditos.map((credito) => (
                    <TableRow key={credito.id}>
                      <TableCell sx={{ color: '#000000', fontWeight: 'bold' }}>
                        {credito.numero}
                      </TableCell>
                      <TableCell sx={{ color: '#000000' }}>
                        {credito.tipo.replace(/_/g, ' ')}
                      </TableCell>
                      <TableCell sx={{ color: '#000000', maxWidth: 200 }}>
                        <Typography variant="body2" noWrap title={credito.titulo}>
                          {credito.titulo}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#333333', maxWidth: 200 }}>
                        <Typography variant="body2" noWrap title={credito.descripcion}>
                          {credito.descripcion}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ color: '#333333' }}>
                        {new Date(credito.fechaEnvio).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={credito.estatus}
                          color={getEstatusColor(credito.estatus) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                          <IconButton
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('accessToken');
                                const response = await api.get(`/creditos/${credito.id}/archivo?tipo=original`, {
                                  headers: { Authorization: `Bearer ${token}` },
                                  responseType: 'blob',
                                });
                                const blobUrl = window.URL.createObjectURL(response.data);
                                setSelectedDoc({
                                  ...credito,
                                  previewUrl: blobUrl,
                                  mimeType: 'application/pdf',
                                });
                                setPreviewDialog(true);
                              } catch (error: any) {
                                toast.error('No se pudo cargar la previsualización');
                              }
                            }}
                            sx={{ color: '#008000' }}
                            title="Ver previsualización"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            onClick={async () => {
                              try {
                                const token = localStorage.getItem('accessToken');
                                const response = await api.get(`/creditos/${credito.id}/archivo?tipo=original`, {
                                  headers: { Authorization: `Bearer ${token}` },
                                  responseType: 'blob',
                                });
                                
                                // El backend ya genera el nombre con formato correcto (Kardex_matricula_iniciales.pdf)
                                // Extraerlo del header Content-Disposition si está disponible
                                const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'];
                                let filename = `Credito_Complementario_${estudiante.matricula}.pdf`;
                                
                                if (contentDisposition) {
                                  const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                                  if (filenameMatch && filenameMatch[1]) {
                                    filename = decodeURIComponent(filenameMatch[1].replace(/['"]/g, ''));
                                  }
                                }
                                
                                const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
                                const link = document.createElement('a');
                                link.href = url;
                                link.setAttribute('download', filename);
                                document.body.appendChild(link);
                                link.click();
                                link.parentNode?.removeChild(link);
                                window.URL.revokeObjectURL(url);
                                toast.success('Archivo descargado');
                              } catch (error: any) {
                                toast.error('No se pudo descargar el archivo');
                              }
                            }}
                            sx={{ color: '#008000' }}
                            title="Descargar"
                          >
                            <Download />
                          </IconButton>
                          {credito.estatus === 'PENDIENTE' && (
                            <>
                              <IconButton
                                onClick={() => setCreditoDialogValidar({ open: true, credito, observaciones: '', archivo: null })}
                                sx={{ color: '#008000' }}
                                title="Validar"
                              >
                                <CheckCircle />
                              </IconButton>
                              <IconButton
                                onClick={() => setCreditoDialogRechazo({ open: true, credito, motivo: '' })}
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

      {/* Diálogo de Revisión de Documento */}
      <Dialog
        open={reviewDialog}
        onClose={() => {
          setReviewDialog(false);
          setMotivoRechazo('');
          setSelectedDoc(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{approving ? 'Aprobar Documento' : 'Rechazar Documento'}</DialogTitle>
        <DialogContent>
          {!approving && (
            <TextField
              label="Motivo de rechazo"
              multiline
              rows={4}
              fullWidth
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              sx={{ mt: 2 }}
              required
            />
          )}
          {approving && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              ¿Estás seguro de que deseas aprobar este documento?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setReviewDialog(false);
              setMotivoRechazo('');
              setSelectedDoc(null);
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            color={approving ? 'success' : 'error'}
            onClick={handleReviewDocument}
            disabled={!approving && !motivoRechazo.trim()}
          >
            {approving ? 'Aprobar' : 'Rechazar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Validación de Crédito */}
      <Dialog
        open={creditoDialogValidar.open}
        onClose={() => setCreditoDialogValidar({ open: false })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Validar crédito</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            El crédito será marcado como validado. Opcionalmente puedes adjuntar la constancia firmada y agregar observaciones.
          </Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<PictureAsPdf />}
          >
            Seleccionar PDF firmado (opcional)
            <input
              hidden
              type="file"
              accept="application/pdf"
              onChange={(event) =>
                setCreditoDialogValidar((prev) => ({
                  ...prev,
                  archivo: event.target.files ? event.target.files[0] : null,
                }))
              }
            />
          </Button>
          {creditoDialogValidar.archivo && (
            <Typography variant="body2">
              Archivo seleccionado: <strong>{creditoDialogValidar.archivo.name}</strong>
            </Typography>
          )}
          <TextField
            label="Observaciones (opcional)"
            multiline
            minRows={3}
            value={creditoDialogValidar.observaciones ?? ''}
            onChange={(event) =>
              setCreditoDialogValidar((prev) => ({
                ...prev,
                observaciones: event.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreditoDialogValidar({ open: false })}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={handleValidarCredito}>
            Validar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo de Rechazo de Crédito */}
      <Dialog
        open={creditoDialogRechazo.open}
        onClose={() => setCreditoDialogRechazo({ open: false, motivo: '' })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Rechazar crédito</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Describe el motivo del rechazo que recibirá el estudiante.
          </Typography>
          <TextField
            label="Motivo de rechazo"
            multiline
            minRows={3}
            fullWidth
            value={creditoDialogRechazo.motivo}
            onChange={(event) =>
              setCreditoDialogRechazo((prev) => ({
                ...prev,
                motivo: event.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreditoDialogRechazo({ open: false, motivo: '' })}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleRechazarCredito}>
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStudentDetailPage;

