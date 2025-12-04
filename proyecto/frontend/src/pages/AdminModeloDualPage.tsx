/**
 * Página de gestión de Modelo Dual (Administrador)
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
  FormControl,
  InputLabel,
  Tabs,
  Tab,
} from '@mui/material';
import { Download, TaskAlt, WarningAmber, ArrowBack, Psychology, CloudUpload, Description, Business, Add, QrCode, OpenInNew } from '@mui/icons-material';
import toast from 'react-hot-toast';
import ModeloDualService from '../services/modelo-dual.service';
import {
  PruebaModeloDual,
  EstatusPruebaModeloDual,
  TipoPruebaModeloDual,
  FormatoModeloDual,
  ConvenioModeloDual,
  TipoFormatoModeloDual,
  EstudianteModeloDual,
} from '../types/modelo-dual.types';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

type FiltroEstatus = 'TODOS' | EstatusPruebaModeloDual;
type FiltroTipo = 'TODOS' | TipoPruebaModeloDual;

const estatusOptions: { value: FiltroEstatus; label: string }[] = [
  { value: 'TODOS', label: 'Todos' },
  { value: 'PENDIENTE', label: 'Pendientes' },
  { value: 'EN_REVISION', label: 'En revisión' },
  { value: 'APROBADA', label: 'Aprobadas' },
  { value: 'RECHAZADA', label: 'Rechazadas' },
];

const tipoOptions: { value: FiltroTipo; label: string }[] = [
  { value: 'TODOS', label: 'Todos los tipos' },
  { value: 'PSICOLOGICA', label: 'Prueba Psicológica' },
  { value: 'APTITUDES', label: 'Prueba de Aptitudes' },
  { value: 'PERSONALIDAD', label: 'Prueba de Personalidad' },
  { value: 'INTERESES_VOCACIONALES', label: 'Intereses Vocacionales' },
  { value: 'ORIENTACION_PROFESIONAL', label: 'Orientación Profesional' },
  { value: 'OTRA', label: 'Otra' },
];

const ESTATUS_CHIP: Record<EstatusPruebaModeloDual, { label: string; color: 'default' | 'success' | 'warning' | 'error' }> = {
  PENDIENTE: { label: 'Pendiente', color: 'warning' },
  EN_REVISION: { label: 'En revisión', color: 'default' },
  APROBADA: { label: 'Aprobada', color: 'success' },
  RECHAZADA: { label: 'Rechazada', color: 'error' },
  VENCIDA: { label: 'Vencida', color: 'error' },
};

const TIPO_LABELS: Record<TipoPruebaModeloDual, string> = {
  PSICOLOGICA: 'Prueba Psicológica',
  APTITUDES: 'Prueba de Aptitudes',
  PERSONALIDAD: 'Prueba de Personalidad',
  INTERESES_VOCACIONALES: 'Intereses Vocacionales',
  ORIENTACION_PROFESIONAL: 'Orientación Profesional',
  OTRA: 'Otra',
};

interface DialogRevisionState {
  open: boolean;
  prueba?: PruebaModeloDual;
  aprobado: boolean;
  motivoRechazo: string;
  observaciones: string;
  archivoFirmado: File | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const TIPO_FORMATO_LABELS: Record<TipoFormatoModeloDual, string> = {
  SOLICITUD_ADMISION: 'Solicitud de Admisión',
  RENOVACION: 'Renovación',
  CONVENIO: 'Convenio',
  CARTA_COMPROMISO: 'Carta Compromiso',
  FORMATO_EMPRESA: 'Formato Empresa',
  OTRO: 'Otro',
};

const AdminModeloDualPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [pruebas, setPruebas] = useState<PruebaModeloDual[]>([]);
  const [formatos, setFormatos] = useState<FormatoModeloDual[]>([]);
  const [convenios, setConvenios] = useState<ConvenioModeloDual[]>([]);
  const [estudiantes, setEstudiantes] = useState<EstudianteModeloDual[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [accionando, setAccionando] = useState<string | null>(null);
  const [filtroEstatus, setFiltroEstatus] = useState<FiltroEstatus>('TODOS');
  const [filtroTipo, setFiltroTipo] = useState<FiltroTipo>('TODOS');
  const [busqueda, setBusqueda] = useState<string>('');
  const [showFormatoDialog, setShowFormatoDialog] = useState(false);
  const [showConvenioDialog, setShowConvenioDialog] = useState(false);
  const [formatoForm, setFormatoForm] = useState({
    nombre: '',
    descripcion: '',
    tipo: '' as TipoFormatoModeloDual | '',
    urlDescarga: '',
    qrCode: '',
    orden: '0',
    archivo: null as File | null,
  });
  const [convenioForm, setConvenioForm] = useState({
    nombreEmpresa: '',
    razonSocial: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    sector: '',
    fechaInicio: '',
    fechaFin: '',
    descripcion: '',
    condiciones: '',
    urlConvenio: '',
    qrCode: '',
  });

  const [dialogRevision, setDialogRevision] = useState<DialogRevisionState>({
    open: false,
    aprobado: true,
    motivoRechazo: '',
    observaciones: '',
    archivoFirmado: null,
  });

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const [pruebasData, formatosData, conveniosData, estudiantesData] = await Promise.all([
        ModeloDualService.listar(
          filtroEstatus === 'TODOS' ? undefined : filtroEstatus,
          filtroTipo === 'TODOS' ? undefined : filtroTipo
        ).catch(() => []),
        ModeloDualService.obtenerFormatos().catch(() => []),
        ModeloDualService.obtenerConvenios(false).catch(() => []),
        ModeloDualService.listarEstudiantes().catch(() => []),
      ]);
      setPruebas(pruebasData);
      setFormatos(formatosData);
      setConvenios(conveniosData);
      setEstudiantes(estudiantesData);
    } catch (error: any) {
      toast.error('No se pudieron obtener los datos');
    } finally {
      setLoading(false);
    }
  }, [filtroEstatus, filtroTipo]);

  useEffect(() => {
    if (user && !['ADMINISTRADOR', 'SUPER_ADMIN', 'PERSONAL_ADMINISTRATIVO'].includes(user.rol)) {
      navigate('/dashboard');
      return;
    }
    cargarDatos();
  }, [cargarDatos, user, navigate]);

  const resumen = useMemo(() => {
    const conteo: Record<EstatusPruebaModeloDual, number> = {
      PENDIENTE: 0,
      EN_REVISION: 0,
      APROBADA: 0,
      RECHAZADA: 0,
      VENCIDA: 0,
    };
    pruebas.forEach((p) => {
      conteo[p.estatus] += 1;
    });
    return conteo;
  }, [pruebas]);

  // Filtrar pruebas por búsqueda
  const pruebasFiltradas = useMemo(() => {
    let filtradas = pruebas;

    if (busqueda.trim()) {
      const terminoBusqueda = busqueda.toLowerCase().trim();
      filtradas = filtradas.filter((prueba) => {
        const estudiante = prueba.estudiante;
        if (!estudiante) return false;

        const nombreCompleto = `${estudiante.usuario.nombre} ${estudiante.usuario.apellidoPaterno ?? ''} ${estudiante.usuario.apellidoMaterno ?? ''}`.toLowerCase();
        const matricula = estudiante.matricula.toLowerCase();
        const nombrePrueba = prueba.nombrePrueba.toLowerCase();

        return nombreCompleto.includes(terminoBusqueda) || matricula.includes(terminoBusqueda) || nombrePrueba.includes(terminoBusqueda);
      });
    }

    return filtradas;
  }, [pruebas, busqueda]);

  const handleAbrirDialogRevision = (prueba: PruebaModeloDual, aprobado: boolean) => {
    setDialogRevision({
      open: true,
      prueba,
      aprobado,
      motivoRechazo: '',
      observaciones: '',
      archivoFirmado: null,
    });
  };

  const handleCerrarDialogRevision = () => {
    setDialogRevision({
      open: false,
      aprobado: true,
      motivoRechazo: '',
      observaciones: '',
      archivoFirmado: null,
    });
  };

  const handleRevisar = async () => {
    if (!dialogRevision.prueba) return;

    if (!dialogRevision.aprobado && !dialogRevision.motivoRechazo.trim()) {
      toast.error('Debes indicar el motivo de rechazo');
      return;
    }

    try {
      setAccionando(dialogRevision.prueba.id);
      await ModeloDualService.revisarPrueba({
        id: dialogRevision.prueba.id,
        aprobado: dialogRevision.aprobado,
        motivoRechazo: dialogRevision.motivoRechazo || undefined,
        observaciones: dialogRevision.observaciones || undefined,
        archivoFirmado: dialogRevision.archivoFirmado || undefined,
      });

      toast.success(dialogRevision.aprobado ? 'Prueba aprobada correctamente' : 'Prueba rechazada correctamente');
      handleCerrarDialogRevision();
      cargarDatos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No fue posible procesar la revisión');
    } finally {
      setAccionando(null);
    }
  };

  const handleDownload = async (prueba: PruebaModeloDual, tipo: 'original' | 'validado') => {
    try {
      const response = await ModeloDualService.descargarArchivo(prueba.id, tipo);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${prueba.nombrePrueba}-${tipo}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error('No fue posible descargar el archivo');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <PageHeader
        title="Gestión de Pruebas - Modelo Dual"
        subtitle="Coordinación de Sistema Abierto · Modalidad Mixta"
        gradientFrom="#008000"
        gradientTo="#006000"
        maxWidth="xl"
        actions={
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
            Volver
          </Button>
        }
      />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Pruebas Psicológicas" icon={<Psychology />} iconPosition="start" />
            <Tab label="Formatos" icon={<Description />} iconPosition="start" />
            <Tab label="Convenios" icon={<Business />} iconPosition="start" />
            <Tab label="Estudiantes" icon={<Psychology />} iconPosition="start" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              {/* Resumen */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="warning.main">
              {resumen.PENDIENTE}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pendientes
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="info.main">
              {resumen.EN_REVISION}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              En Revisión
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="success.main">
              {resumen.APROBADA}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Aprobadas
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4" color="error.main">
              {resumen.RECHAZADA}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rechazadas
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">
              {pruebas.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Buscar"
              placeholder="Nombre, matrícula o prueba..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Estatus</InputLabel>
              <Select
                value={filtroEstatus}
                onChange={(e) => setFiltroEstatus(e.target.value as FiltroEstatus)}
                label="Estatus"
              >
                {estatusOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Tipo de Prueba</InputLabel>
              <Select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as FiltroTipo)}
                label="Tipo de Prueba"
              >
                {tipoOptions.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : pruebasFiltradas.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No se encontraron pruebas
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {pruebasFiltradas.map((prueba) => (
            <Grid item xs={12} md={6} lg={4} key={prueba.id}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box>
                        <Typography variant="h6">{prueba.nombrePrueba}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {TIPO_LABELS[prueba.tipoPrueba]}
                        </Typography>
                      </Box>
                      <Chip
                        label={ESTATUS_CHIP[prueba.estatus].label}
                        color={ESTATUS_CHIP[prueba.estatus].color}
                        size="small"
                      />
                    </Box>

                    {prueba.estudiante && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Estudiante:</strong> {prueba.estudiante.usuario.nombre}{' '}
                          {prueba.estudiante.usuario.apellidoPaterno} {prueba.estudiante.usuario.apellidoMaterno}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Matrícula:</strong> {prueba.estudiante.matricula}
                        </Typography>
                        {prueba.estudiante.carrera && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Carrera:</strong> {prueba.estudiante.carrera.nombre}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {prueba.descripcion && (
                      <Typography variant="body2" color="text.secondary">
                        {prueba.descripcion}
                      </Typography>
                    )}

                    <Divider />

                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      <Button
                        size="small"
                        startIcon={<Download />}
                        onClick={() => handleDownload(prueba, 'original')}
                      >
                        Ver Original
                      </Button>
                      {prueba.estatus === 'PENDIENTE' || prueba.estatus === 'EN_REVISION' ? (
                        <>
                          <Button
                            size="small"
                            color="success"
                            startIcon={<TaskAlt />}
                            onClick={() => handleAbrirDialogRevision(prueba, true)}
                            disabled={accionando === prueba.id}
                          >
                            Aprobar
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            startIcon={<WarningAmber />}
                            onClick={() => handleAbrirDialogRevision(prueba, false)}
                            disabled={accionando === prueba.id}
                          >
                            Rechazar
                          </Button>
                        </>
                      ) : null}
                      {prueba.estatus === 'APROBADA' && prueba.archivoValidado && (
                        <Button
                          size="small"
                          color="success"
                          startIcon={<Download />}
                          onClick={() => handleDownload(prueba, 'validado')}
                        >
                          Ver Validado
                        </Button>
                      )}
                    </Stack>

                    {prueba.motivoRechazo && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        <Typography variant="body2">
                          <strong>Motivo de rechazo:</strong> {prueba.motivoRechazo}
                        </Typography>
                      </Alert>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Formatos Disponibles</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    setFormatoForm({
                      nombre: '',
                      descripcion: '',
                      tipo: '' as TipoFormatoModeloDual | '',
                      urlDescarga: '',
                      qrCode: '',
                      orden: '0',
                      archivo: null,
                    });
                    setShowFormatoDialog(true);
                  }}
                >
                  Crear Formato
                </Button>
              </Box>
              {formatos.length === 0 ? (
                <Alert severity="info">No hay formatos creados</Alert>
              ) : (
                <Grid container spacing={2}>
                  {formatos.map((formato) => (
                    <Grid item xs={12} md={6} key={formato.id}>
                      <Card>
                        <CardContent>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="h6">{formato.nombre}</Typography>
                              <Chip
                                label={TIPO_FORMATO_LABELS[formato.tipo]}
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                            {formato.descripcion && (
                              <Typography variant="body2" color="text.secondary">
                                {formato.descripcion}
                              </Typography>
                            )}
                            <Stack direction="row" spacing={2}>
                              {formato.urlDescarga && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<OpenInNew />}
                                  href={formato.urlDescarga}
                                  target="_blank"
                                >
                                  Ver Enlace
                                </Button>
                              )}
                              {formato.qrCode && (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<QrCode />}
                                  onClick={() => window.open(formato.qrCode || '', '_blank')}
                                >
                                  Ver QR
                                </Button>
                              )}
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Convenios</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => {
                    setConvenioForm({
                      nombreEmpresa: '',
                      razonSocial: '',
                      contacto: '',
                      email: '',
                      telefono: '',
                      direccion: '',
                      sector: '',
                      fechaInicio: '',
                      fechaFin: '',
                      descripcion: '',
                      condiciones: '',
                      urlConvenio: '',
                      qrCode: '',
                    });
                    setShowConvenioDialog(true);
                  }}
                >
                  Crear Convenio
                </Button>
              </Box>
              {convenios.length === 0 ? (
                <Alert severity="info">No hay convenios creados</Alert>
              ) : (
                <Grid container spacing={2}>
                  {convenios.map((convenio) => (
                    <Grid item xs={12} md={6} key={convenio.id}>
                      <Card>
                        <CardContent>
                          <Stack spacing={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                              <Box>
                                <Typography variant="h6">{convenio.nombreEmpresa}</Typography>
                                {convenio.sector && (
                                  <Chip label={convenio.sector} size="small" sx={{ mt: 1 }} />
                                )}
                                <Chip
                                  label={convenio.vigente ? 'Vigente' : 'No Vigente'}
                                  color={convenio.vigente ? 'success' : 'default'}
                                  size="small"
                                  sx={{ mt: 1, ml: 1 }}
                                />
                              </Box>
                            </Box>
                            {convenio.descripcion && (
                              <Typography variant="body2" color="text.secondary">
                                {convenio.descripcion}
                              </Typography>
                            )}
                            {convenio.contacto && (
                              <Typography variant="body2">
                                <strong>Contacto:</strong> {convenio.contacto}
                              </Typography>
                            )}
                            {convenio.email && (
                              <Typography variant="body2">
                                <strong>Email:</strong> {convenio.email}
                              </Typography>
                            )}
                            {convenio.urlConvenio && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<OpenInNew />}
                                href={convenio.urlConvenio}
                                target="_blank"
                              >
                                Ver Convenio
                              </Button>
                            )}
                            {convenio.qrCode && (
                              <Button
                                size="small"
                                variant="outlined"
                                startIcon={<QrCode />}
                                onClick={() => window.open(convenio.qrCode || '', '_blank')}
                              >
                                Ver QR
                              </Button>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Estudiantes Inscritos
              </Typography>
              {estudiantes.length === 0 ? (
                <Alert severity="info">No hay estudiantes inscritos</Alert>
              ) : (
                <Grid container spacing={2}>
                  {estudiantes.map((estudiante) => (
                    <Grid item xs={12} md={6} key={estudiante.id}>
                      <Card>
                        <CardContent>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="h6">
                                {estudiante.estudiante?.usuario.nombre}{' '}
                                {estudiante.estudiante?.usuario.apellidoPaterno}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Matrícula: {estudiante.estudiante?.matricula}
                              </Typography>
                              <Chip
                                label={estudiante.estatus}
                                color="primary"
                                size="small"
                                sx={{ mt: 1 }}
                              />
                            </Box>
                            <Typography variant="body2">
                              <strong>Periodo:</strong> {estudiante.periodo}
                            </Typography>
                            {estudiante.convenio && (
                              <Typography variant="body2">
                                <strong>Convenio:</strong> {estudiante.convenio.nombreEmpresa}
                              </Typography>
                            )}
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </TabPanel>
        </Paper>

      {/* Dialog de revisión */}
      <Dialog open={dialogRevision.open} onClose={handleCerrarDialogRevision} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogRevision.aprobado ? 'Aprobar Prueba' : 'Rechazar Prueba'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {dialogRevision.prueba && (
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Prueba
                </Typography>
                <Typography variant="body1">{dialogRevision.prueba.nombrePrueba}</Typography>
              </Box>
            )}

            {!dialogRevision.aprobado && (
              <TextField
                label="Motivo de Rechazo"
                fullWidth
                required
                multiline
                rows={3}
                value={dialogRevision.motivoRechazo}
                onChange={(e) =>
                  setDialogRevision((prev) => ({ ...prev, motivoRechazo: e.target.value }))
                }
              />
            )}

            <TextField
              label="Observaciones (opcional)"
              fullWidth
              multiline
              rows={3}
              value={dialogRevision.observaciones}
              onChange={(e) =>
                setDialogRevision((prev) => ({ ...prev, observaciones: e.target.value }))
              }
            />

            {dialogRevision.aprobado && (
              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Subir Archivo Firmado (opcional)
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setDialogRevision((prev) => ({ ...prev, archivoFirmado: file }));
                    }}
                  />
                </Button>
                {dialogRevision.archivoFirmado && (
                  <Typography variant="body2" color="text.secondary">
                    {dialogRevision.archivoFirmado.name} ({(dialogRevision.archivoFirmado.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCerrarDialogRevision}>Cancelar</Button>
          <Button
            variant="contained"
            color={dialogRevision.aprobado ? 'success' : 'error'}
            onClick={handleRevisar}
            disabled={accionando !== null}
            startIcon={accionando ? <CircularProgress size={20} /> : undefined}
          >
            {accionando ? 'Procesando...' : dialogRevision.aprobado ? 'Aprobar' : 'Rechazar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para crear formato */}
      <Dialog open={showFormatoDialog} onClose={() => setShowFormatoDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Formato</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nombre del Formato"
              fullWidth
              required
              value={formatoForm.nombre}
              onChange={(e) => setFormatoForm({ ...formatoForm, nombre: e.target.value })}
            />
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              value={formatoForm.descripcion}
              onChange={(e) => setFormatoForm({ ...formatoForm, descripcion: e.target.value })}
            />
            <FormControl fullWidth required>
              <InputLabel>Tipo</InputLabel>
              <Select
                value={formatoForm.tipo}
                onChange={(e) => setFormatoForm({ ...formatoForm, tipo: e.target.value as TipoFormatoModeloDual })}
                label="Tipo"
              >
                {Object.entries(TIPO_FORMATO_LABELS).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="URL de Descarga (OneDrive)"
              fullWidth
              value={formatoForm.urlDescarga}
              onChange={(e) => setFormatoForm({ ...formatoForm, urlDescarga: e.target.value })}
              placeholder="https://..."
            />
            <TextField
              label="Código QR (URL)"
              fullWidth
              value={formatoForm.qrCode}
              onChange={(e) => setFormatoForm({ ...formatoForm, qrCode: e.target.value })}
              placeholder="https://..."
            />
            <TextField
              label="Orden"
              type="number"
              fullWidth
              value={formatoForm.orden}
              onChange={(e) => setFormatoForm({ ...formatoForm, orden: e.target.value })}
            />
            <Box>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
              >
                Subir Archivo (opcional)
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setFormatoForm({ ...formatoForm, archivo: file });
                  }}
                />
              </Button>
              {formatoForm.archivo && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {formatoForm.archivo.name}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFormatoDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await ModeloDualService.crearFormato({
                  nombre: formatoForm.nombre,
                  descripcion: formatoForm.descripcion || undefined,
                  tipo: formatoForm.tipo,
                  urlDescarga: formatoForm.urlDescarga || undefined,
                  qrCode: formatoForm.qrCode || undefined,
                  orden: Number(formatoForm.orden),
                  archivo: formatoForm.archivo || undefined,
                });
                toast.success('Formato creado correctamente');
                setShowFormatoDialog(false);
                cargarDatos();
              } catch (error: any) {
                toast.error(error.response?.data?.message || 'Error al crear el formato');
              }
            }}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para crear convenio */}
      <Dialog open={showConvenioDialog} onClose={() => setShowConvenioDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Crear Convenio</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Nombre de la Empresa"
              fullWidth
              required
              value={convenioForm.nombreEmpresa}
              onChange={(e) => setConvenioForm({ ...convenioForm, nombreEmpresa: e.target.value })}
            />
            <TextField
              label="Razón Social"
              fullWidth
              value={convenioForm.razonSocial}
              onChange={(e) => setConvenioForm({ ...convenioForm, razonSocial: e.target.value })}
            />
            <TextField
              label="Contacto"
              fullWidth
              value={convenioForm.contacto}
              onChange={(e) => setConvenioForm({ ...convenioForm, contacto: e.target.value })}
            />
            <TextField
              label="Email"
              fullWidth
              type="email"
              value={convenioForm.email}
              onChange={(e) => setConvenioForm({ ...convenioForm, email: e.target.value })}
            />
            <TextField
              label="Teléfono"
              fullWidth
              value={convenioForm.telefono}
              onChange={(e) => setConvenioForm({ ...convenioForm, telefono: e.target.value })}
            />
            <TextField
              label="Dirección"
              fullWidth
              multiline
              rows={2}
              value={convenioForm.direccion}
              onChange={(e) => setConvenioForm({ ...convenioForm, direccion: e.target.value })}
            />
            <TextField
              label="Sector"
              fullWidth
              value={convenioForm.sector}
              onChange={(e) => setConvenioForm({ ...convenioForm, sector: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Fecha Inicio"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={convenioForm.fechaInicio}
                  onChange={(e) => setConvenioForm({ ...convenioForm, fechaInicio: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Fecha Fin"
                  type="date"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={convenioForm.fechaFin}
                  onChange={(e) => setConvenioForm({ ...convenioForm, fechaFin: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              label="Descripción"
              fullWidth
              multiline
              rows={3}
              value={convenioForm.descripcion}
              onChange={(e) => setConvenioForm({ ...convenioForm, descripcion: e.target.value })}
            />
            <TextField
              label="Condiciones"
              fullWidth
              multiline
              rows={3}
              value={convenioForm.condiciones}
              onChange={(e) => setConvenioForm({ ...convenioForm, condiciones: e.target.value })}
            />
            <TextField
              label="URL del Convenio"
              fullWidth
              value={convenioForm.urlConvenio}
              onChange={(e) => setConvenioForm({ ...convenioForm, urlConvenio: e.target.value })}
              placeholder="https://..."
            />
            <TextField
              label="Código QR (URL)"
              fullWidth
              value={convenioForm.qrCode}
              onChange={(e) => setConvenioForm({ ...convenioForm, qrCode: e.target.value })}
              placeholder="https://..."
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConvenioDialog(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                await ModeloDualService.crearConvenio({
                  nombreEmpresa: convenioForm.nombreEmpresa,
                  razonSocial: convenioForm.razonSocial || undefined,
                  contacto: convenioForm.contacto || undefined,
                  email: convenioForm.email || undefined,
                  telefono: convenioForm.telefono || undefined,
                  direccion: convenioForm.direccion || undefined,
                  sector: convenioForm.sector || undefined,
                  fechaInicio: convenioForm.fechaInicio || undefined,
                  fechaFin: convenioForm.fechaFin || undefined,
                  descripcion: convenioForm.descripcion || undefined,
                  condiciones: convenioForm.condiciones || undefined,
                  urlConvenio: convenioForm.urlConvenio || undefined,
                  qrCode: convenioForm.qrCode || undefined,
                });
                toast.success('Convenio creado correctamente');
                setShowConvenioDialog(false);
                cargarDatos();
              } catch (error: any) {
                toast.error(error.response?.data?.message || 'Error al crear el convenio');
              }
            }}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
      </Container>
    </Box>
  );
};

export default AdminModeloDualPage;

