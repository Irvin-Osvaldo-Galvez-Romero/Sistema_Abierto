/**
 * Página de gestión de Créditos Complementarios (Administrador)
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Select,
  Stack,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Paper,
  Divider,
  Alert,
  InputAdornment,
} from '@mui/material';
import { Download, PictureAsPdf, TaskAlt, WarningAmber, ArrowBack, Visibility, Search } from '@mui/icons-material';
import toast from 'react-hot-toast';
import CreditosService from '../services/creditos.service';
import { CreditoComplementario, EstatusCreditoComplementario } from '../types/creditos.types';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

type FiltroEstatus = 'TODOS' | EstatusCreditoComplementario;

const estatusOptions: { value: FiltroEstatus; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'EN_REVISION', label: 'En revisión' },
  { value: 'VALIDADO', label: 'Validados' },
  { value: 'RECHAZADO', label: 'Rechazados' },
];

const ESTATUS_CHIP: Record<EstatusCreditoComplementario, { label: string; color: 'default' | 'success' | 'warning' | 'error' }> = {
  PENDIENTE: { label: 'Pendiente', color: 'warning' },
  EN_REVISION: { label: 'En revisión', color: 'default' },
  VALIDADO: { label: 'Validado', color: 'success' },
  RECHAZADO: { label: 'Rechazado', color: 'error' },
};

interface DialogValidarState {
  open: boolean;
  credito?: CreditoComplementario;
  archivo?: File | null;
  observaciones?: string;
}

interface DialogRechazoState {
  open: boolean;
  credito?: CreditoComplementario;
  motivo: string;
}

const AdminCreditsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [creditos, setCreditos] = useState<CreditoComplementario[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [accionando, setAccionando] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<FiltroEstatus>('TODOS');
  const [busqueda, setBusqueda] = useState<string>('');

  const [dialogValidar, setDialogValidar] = useState<DialogValidarState>({ open: false });
  const [dialogRechazo, setDialogRechazo] = useState<DialogRechazoState>({ open: false, motivo: '' });
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; url: string | null }>({ open: false, url: null });

  const cargarCreditos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CreditosService.listar(filtro === 'TODOS' ? undefined : filtro);
      setCreditos(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No se pudieron obtener los créditos');
    } finally {
      setLoading(false);
    }
  }, [filtro]);

  useEffect(() => {
    if (user && !['ADMINISTRADOR', 'SUPER_ADMIN', 'PERSONAL_ADMINISTRATIVO'].includes(user.rol)) {
      navigate('/dashboard');
      return;
    }
    cargarCreditos();
  }, [cargarCreditos, user, navigate]);

  const resumen = useMemo(() => {
    const conteo: Record<EstatusCreditoComplementario, number> = {
      PENDIENTE: 0,
      EN_REVISION: 0,
      VALIDADO: 0,
      RECHAZADO: 0,
    };
    creditos.flat().forEach((c) => {
      conteo[c.estatus] += 1;
    });
    return conteo;
  }, [creditos]);

  // Filtrar créditos por búsqueda (nombre o matrícula)
  const creditosFiltrados = useMemo(() => {
    if (!busqueda.trim()) {
      return creditos;
    }

    const terminoBusqueda = busqueda.toLowerCase().trim();
    return creditos.filter((grupoEstudiante) => {
      if (grupoEstudiante.length === 0) return false;
      const estudiante = grupoEstudiante[0].estudiante;
      if (!estudiante) return false;

      const nombreCompleto = `${estudiante.usuario.nombre} ${estudiante.usuario.apellidoPaterno ?? ''} ${estudiante.usuario.apellidoMaterno ?? ''}`.toLowerCase();
      const matricula = estudiante.matricula.toLowerCase();

      return nombreCompleto.includes(terminoBusqueda) || matricula.includes(terminoBusqueda);
    });
  }, [creditos, busqueda]);

  // Clasificar créditos por tipo (agrupados por estudiante dentro de cada tipo)
  const creditosPorTipo = useMemo(() => {
    const tipos: Record<string, CreditoComplementario[][]> = {
      CURSOS: [],
      ACTIVIDADES_EXTRACURRICULARES: [],
      TUTORIAS: [],
      ACTIVIDADES_CULTURALES: [],
    };

    // Iterar sobre los grupos de estudiantes filtrados
    creditosFiltrados.forEach((grupoEstudiante) => {
      // Crear un mapa de tipos para este estudiante
      const creditosPorTipoEstudiante: Record<string, CreditoComplementario[]> = {
        CURSOS: [],
        ACTIVIDADES_EXTRACURRICULARES: [],
        TUTORIAS: [],
        ACTIVIDADES_CULTURALES: [],
      };

      // Separar créditos del estudiante por tipo
      grupoEstudiante.forEach((credito) => {
        if (creditosPorTipoEstudiante[credito.tipo]) {
          creditosPorTipoEstudiante[credito.tipo].push(credito);
        }
      });

      // Agregar grupos no vacíos a cada tipo
      Object.keys(tipos).forEach((tipo) => {
        if (creditosPorTipoEstudiante[tipo].length > 0) {
          tipos[tipo].push(creditosPorTipoEstudiante[tipo]);
        }
      });
    });

    return tipos;
  }, [creditosFiltrados]);

  const TIPO_LABELS: Record<string, string> = {
    CURSOS: 'Cursos',
    ACTIVIDADES_EXTRACURRICULARES: 'Actividades Extracurriculares',
    TUTORIAS: 'Tutorías',
    ACTIVIDADES_CULTURALES: 'Actividades Culturales',
  };

  const TIPO_COLORS: Record<string, string> = {
    CURSOS: '#1976d2',
    ACTIVIDADES_EXTRACURRICULARES: '#ed6c02',
    TUTORIAS: '#9c27b0',
    ACTIVIDADES_CULTURALES: '#2e7d32',
  };

  const handleDownload = async (id: string, tipo: 'original' | 'generado' | 'firmado') => {
    try {
      const response = await CreditosService.descargarArchivo(id, tipo);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${tipo}-${Date.now()}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error('No fue posible descargar el archivo solicitado');
    }
  };

  const handleGenerarConstancia = async (estudianteId: string) => {
    try {
      setAccionando(estudianteId);
      await CreditosService.generarConstancia(estudianteId);
      toast.success('Constancia generada para todos los créditos del estudiante');
      cargarCreditos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No se pudo generar la constancia');
    } finally {
      setAccionando(null);
    }
  };

  const handleValidar = async () => {
    if (!dialogValidar.credito) {
      toast.error('No se seleccionó un crédito');
      return;
    }

    try {
      setAccionando(dialogValidar.credito.id);
      await CreditosService.revisarCredito({
        id: dialogValidar.credito.id,
        aprobado: true,
        observaciones: dialogValidar.observaciones,
        archivoFirmado: dialogValidar.archivo || undefined, // Archivo opcional
      });
      toast.success(`Crédito ${dialogValidar.credito.numero} validado correctamente`);
      setDialogValidar({ open: false });
      cargarCreditos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No se pudo validar el crédito');
    } finally {
      setAccionando(null);
    }
  };

  const handleRechazar = async () => {
    if (!dialogRechazo.credito) return;
    if (!dialogRechazo.motivo.trim()) {
      toast.error('Debes indicar el motivo de rechazo');
      return;
    }

    try {
      setAccionando(dialogRechazo.credito.id);
      await CreditosService.revisarCredito({
        id: dialogRechazo.credito.id,
        aprobado: false,
        motivoRechazo: dialogRechazo.motivo.trim(),
      });
      toast.success(`Crédito ${dialogRechazo.credito.numero} rechazado`);
      setDialogRechazo({ open: false, motivo: '' });
      cargarCreditos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No se pudo rechazar el crédito');
    } finally {
      setAccionando(null);
    }
  };

  const logoUrl = `${process.env.PUBLIC_URL}/logo-coordinacion.png`;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7f5' }}>
      <PageHeader
        title="Validación de Créditos Complementarios"
        subtitle="Coord. de Sistema Abierto · Modalidad Mixta"
        gradientFrom="#004d40"
        gradientTo="#009e60"
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
                '&:hover': {
                  borderColor: '#FFFFFF',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Regresar
            </Button>
          </Stack>
        }
      />

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            mb: 4,
          }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" fontWeight={600} sx={{ color: '#006000', mb: 1 }}>
                Panel de seguimiento
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Gestiona los créditos complementarios enviados por los estudiantes. Puedes generar la constancia, adjuntar el documento firmado
                y comunicar el resultado a la coordinación académica.
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={6} md={3}>
                <Card sx={{ borderLeft: '4px solid #f59e0b', borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Pendientes</Typography>
                    <Typography variant="h5" fontWeight="bold">{resumen.PENDIENTE}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ borderLeft: '4px solid #6366f1', borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">En revisión</Typography>
                    <Typography variant="h5" fontWeight="bold">{resumen.EN_REVISION}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ borderLeft: '4px solid #16a34a', borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Validados</Typography>
                    <Typography variant="h5" fontWeight="bold">{resumen.VALIDADO}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                <Card sx={{ borderLeft: '4px solid #ef4444', borderRadius: 3 }}>
                  <CardContent>
                    <Typography variant="body2" color="text.secondary">Rechazados</Typography>
                    <Typography variant="h5" fontWeight="bold">{resumen.RECHAZADO}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        <Paper elevation={1} sx={{ borderRadius: 3 }}>
          <Box sx={{ px: { xs: 3, md: 4 }, py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Créditos registrados ({creditosFiltrados.flat().length})
              </Typography>
              <Select
                value={filtro}
                onChange={(e) => setFiltro(e.target.value as FiltroEstatus)}
                size="small"
                sx={{ minWidth: 120 }}
              >
                {estatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Box>
            <TextField
              fullWidth
              placeholder="Buscar por nombre o matrícula..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{ maxWidth: 400 }}
            />
          </Box>

        {loading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
            <CircularProgress />
          </Box>
        ) : creditos.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10, backgroundColor: 'white', borderRadius: 3, mx: { xs: 2, md: 4 }, mb: 4 }}>
            <PictureAsPdf sx={{ fontSize: 64, color: '#cbd5f5', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No hay créditos en este estado.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={4} sx={{ px: { xs: 2, md: 4 }, pb: 4 }}>
            {Object.keys(creditosPorTipo).map((tipo) => {
              const gruposPorTipo = creditosPorTipo[tipo];
              if (gruposPorTipo.length === 0) return null;

              return (
                <Box key={tipo}>
                  <Paper elevation={1} sx={{ mb: 3, p: 2, backgroundColor: TIPO_COLORS[tipo], color: 'white' }}>
                    <Typography variant="h5" fontWeight="bold">
                      {TIPO_LABELS[tipo]} ({gruposPorTipo.flat().length} crédito{gruposPorTipo.flat().length !== 1 ? 's' : ''})
                    </Typography>
                  </Paper>

                  <Stack spacing={3}>
                    {gruposPorTipo.map((grupoCreditos, index) => {
              if (grupoCreditos.length === 0) return null;

              const primerCredito = grupoCreditos[0];
              const estudiante = primerCredito.estudiante;
              const estudianteId = primerCredito.estudiante?.id;
              const nombreCompleto = estudiante
                ? `${estudiante.usuario.nombre} ${estudiante.usuario.apellidoPaterno ?? ''} ${estudiante.usuario.apellidoMaterno ?? ''}`.replace(/\s+/g, ' ').trim()
                : 'Sin información';

              const tieneConstanciaGenerada = grupoCreditos.some((c) => c.archivoValidacionGenerada);
              const todosValidados = grupoCreditos.every((c) => c.estatus === 'VALIDADO');

              return (
                <Paper key={estudianteId || index} elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                  <Stack spacing={3}>
                    {/* Información del estudiante */}
                    <Box sx={{ backgroundColor: '#f8fafc', p: 2, borderRadius: 2 }}>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {nombreCompleto}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Matrícula: {estudiante?.matricula ?? '---'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Carrera: {estudiante?.carrera?.nombre ?? '---'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Créditos registrados: {grupoCreditos.length}
                      </Typography>
                    </Box>

                    {/* Botón para generar constancia (una sola por estudiante) */}
                    {estudianteId && (
                      <Box>
                        <Button
                          variant="contained"
                          startIcon={accionando === estudianteId ? <CircularProgress size={18} color="inherit" /> : <TaskAlt />}
                          disabled={accionando === estudianteId || todosValidados}
                          onClick={() => handleGenerarConstancia(estudianteId)}
                          sx={{ backgroundColor: '#008000', '&:hover': { backgroundColor: '#006000' } }}
                        >
                          {tieneConstanciaGenerada ? 'Regenerar constancia' : 'Generar constancia'}
                        </Button>
                        {tieneConstanciaGenerada && primerCredito.archivoValidacionGenerada && (
                          <Button
                            variant="outlined"
                            startIcon={<Download />}
                            onClick={() => handleDownload(primerCredito.id, 'generado')}
                            sx={{ ml: 2 }}
                          >
                            Descargar constancia generada
                          </Button>
                        )}
                      </Box>
                    )}

                    {/* Lista de créditos del estudiante */}
                    <Grid container spacing={2}>
                      {grupoCreditos.map((credito) => (
                        <Grid item xs={12} md={6} key={credito.id}>
                          <Card sx={{ borderRadius: 2, border: '1px solid #e2e8f0' }}>
                            <CardContent>
                              <Stack spacing={2}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {credito.titulo}
                                  </Typography>
                                  <Chip
                                    label={ESTATUS_CHIP[credito.estatus].label}
                                    color={ESTATUS_CHIP[credito.estatus].color}
                                    size="small"
                                  />
                                </Box>

                                <Typography variant="body2" color="text.secondary">
                                  <strong>Tipo:</strong> {credito.tipo.replace(/_/g, ' ')}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Descripción:</strong> {credito.descripcion}
                                </Typography>
                                {credito.tipo === 'CURSOS' && (
                                  <Box sx={{ p: 1.5, borderRadius: 1, backgroundColor: '#f5f5f5' }}>
                                    <Typography variant="body2" color="text.secondary">
                                      <strong>Horas del archivo original:</strong> {credito.horasCurso || 0}
                                    </Typography>
                                    {credito.archivosAdicionales && credito.archivosAdicionales.length > 0 && (
                                      <Typography variant="body2" color="text.secondary">
                                        <strong>Archivos adicionales:</strong> {credito.archivosAdicionales.length}
                                      </Typography>
                                    )}
                                    <Typography variant="body2" fontWeight="bold" color="primary">
                                      <strong>Total de horas:</strong> {credito.horasTotales || credito.horasCurso || 0} / 60
                                    </Typography>
                                    {credito.archivoCombinado && (
                                      <Alert severity="info" sx={{ mt: 1 }}>
                                        Este crédito tiene un PDF combinado con todos los archivos (solo visible para administradores).
                                      </Alert>
                                    )}
                                  </Box>
                                )}

                                {credito.motivoRechazo && (
                                  <Box sx={{ backgroundColor: '#fef2f2', p: 1.5, borderRadius: 1, border: '1px solid #fecaca' }}>
                                    <Typography variant="caption" color="error" fontWeight="bold">
                                      Motivo de rechazo:
                                    </Typography>
                                    <Typography variant="body2" color="error">
                                      {credito.motivoRechazo}
                                    </Typography>
                                  </Box>
                                )}

                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Visibility />}
                                    onClick={async () => {
                                      try {
                                        const response = await CreditosService.descargarArchivo(credito.id, 'original');
                                        // Crear Blob con el tipo MIME correcto para PDF
                                        const blob = new Blob([response.data], { type: 'application/pdf' });
                                        const url = window.URL.createObjectURL(blob);
                                        setPreviewDialog({ open: true, url });
                                      } catch (error: any) {
                                        toast.error('No se pudo cargar el archivo para previsualización');
                                      }
                                    }}
                                  >
                                    Previsualizar
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<Download />}
                                    onClick={() => handleDownload(credito.id, 'original')}
                                  >
                                    {credito.archivoCombinado ? 'Ver PDF combinado' : 'Ver evidencia'}
                                  </Button>

                                  {credito.archivoValidado && (
                                    <Button
                                      variant="outlined"
                                      size="small"
                                      color="success"
                                      startIcon={<Download />}
                                      onClick={() => handleDownload(credito.id, 'firmado')}
                                    >
                                      Constancia firmada
                                    </Button>
                                  )}

                                  {credito.estatus !== 'VALIDADO' && (
                                    <>
                                      <Button
                                        variant="contained"
                                        size="small"
                                        color="success"
                                        startIcon={<TaskAlt />}
                                        onClick={() => setDialogValidar({ open: true, credito })}
                                      >
                                        Validar
                                      </Button>

                                      <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        startIcon={<WarningAmber />}
                                        onClick={() => setDialogRechazo({ open: true, credito, motivo: '' })}
                                      >
                                        Rechazar
                                      </Button>
                                    </>
                                  )}
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Stack>
                </Paper>
              );
            })}
                  </Stack>
                </Box>
              );
            })}
          </Stack>
        )}
        </Paper>
      </Container>

      {/* Dialogo validar */}
      <Dialog
        open={dialogValidar.open}
        onClose={() => setDialogValidar({ open: false })}
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
                setDialogValidar((prev) => ({
                  ...prev,
                  archivo: event.target.files ? event.target.files[0] : null,
                }))
              }
            />
          </Button>
          {dialogValidar.archivo && (
            <Typography variant="body2">
              Archivo seleccionado: <strong>{dialogValidar.archivo.name}</strong>
            </Typography>
          )}
          <TextField
            label="Observaciones (opcional)"
            multiline
            minRows={3}
            value={dialogValidar.observaciones ?? ''}
            onChange={(event) =>
              setDialogValidar((prev) => ({
                ...prev,
                observaciones: event.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogValidar({ open: false })}>Cancelar</Button>
          <Button variant="contained" color="success" onClick={handleValidar}>
            Validar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo rechazo */}
      <Dialog
        open={dialogRechazo.open}
        onClose={() => setDialogRechazo({ open: false, motivo: '' })}
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
            value={dialogRechazo.motivo}
            onChange={(event) =>
              setDialogRechazo((prev) => ({
                ...prev,
                motivo: event.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogRechazo({ open: false, motivo: '' })}>Cancelar</Button>
          <Button variant="contained" color="error" onClick={handleRechazar}>
            Rechazar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialogo de previsualización */}
      <Dialog
        open={previewDialog.open}
        onClose={() => {
          if (previewDialog.url) {
            window.URL.revokeObjectURL(previewDialog.url);
          }
          setPreviewDialog({ open: false, url: null });
        }}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: { height: '90vh' },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">Previsualización del Documento</Typography>
            <Button 
              onClick={() => {
                if (previewDialog.url) {
                  window.URL.revokeObjectURL(previewDialog.url);
                }
                setPreviewDialog({ open: false, url: null });
              }}
            >
              Cerrar
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: 'calc(100% - 64px)', position: 'relative', overflow: 'hidden' }}>
          {previewDialog.url && (
            <Box
              component="embed"
              src={`${previewDialog.url}#toolbar=1&navpanes=1&scrollbar=1`}
              type="application/pdf"
              sx={{
                width: '100%',
                height: '100%',
                minHeight: '600px',
                border: 'none',
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminCreditsPage;

