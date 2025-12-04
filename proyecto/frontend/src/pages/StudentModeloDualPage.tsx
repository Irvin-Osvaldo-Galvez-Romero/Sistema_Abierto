/**
 * Página de Modelo Dual (Estudiante)
 * Incluye: Formatos, Convenios, Pruebas Psicológicas y Proceso
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Chip,
  Stack,
  Paper,
  Divider,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Link,
  IconButton,
} from '@mui/material';
import {
  CloudUpload,
  Download,
  ArrowBack,
  CheckCircle,
  Info,
  Psychology,
  Description,
  Business,
  QrCode,
  OpenInNew,
  CheckCircleOutline,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import toast from 'react-hot-toast';
import ModeloDualService from '../services/modelo-dual.service';
import {
  PruebaModeloDual,
  EstatusPruebaModeloDual,
  TipoPruebaModeloDual,
  FormatoModeloDual,
  ConvenioModeloDual,
  EstudianteModeloDual,
  TipoFormatoModeloDual,
  TipoIngresoModeloDual,
  EstatusEstudianteModeloDual,
} from '../types/modelo-dual.types';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';

const ESTATUS_LABELS: Record<EstatusPruebaModeloDual, { label: string; color: 'default' | 'success' | 'warning' | 'error' }> = {
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

const TIPOS_DISPONIBLES: TipoPruebaModeloDual[] = [
  'PSICOLOGICA',
  'APTITUDES',
  'PERSONALIDAD',
  'INTERESES_VOCACIONALES',
  'ORIENTACION_PROFESIONAL',
  'OTRA',
];

const TIPO_FORMATO_LABELS: Record<TipoFormatoModeloDual, string> = {
  SOLICITUD_ADMISION: 'Solicitud de Admisión',
  RENOVACION: 'Renovación',
  CONVENIO: 'Convenio',
  CARTA_COMPROMISO: 'Carta Compromiso',
  FORMATO_EMPRESA: 'Formato Empresa',
  OTRO: 'Otro',
};

const ESTATUS_PROCESO_LABELS: Record<EstatusEstudianteModeloDual, { label: string; color: 'default' | 'success' | 'warning' | 'error' | 'info' }> = {
  EN_PROCESO: { label: 'En Proceso', color: 'info' },
  DOCUMENTOS_PENDIENTES: { label: 'Documentos Pendientes', color: 'warning' },
  PRUEBAS_PENDIENTES: { label: 'Pruebas Pendientes', color: 'warning' },
  CONVENIO_PENDIENTE: { label: 'Convenio Pendiente', color: 'warning' },
  APROBADO: { label: 'Aprobado', color: 'success' },
  RECHAZADO: { label: 'Rechazado', color: 'error' },
  FINALIZADO: { label: 'Finalizado', color: 'success' },
};

interface FormData {
  tipoPrueba: TipoPruebaModeloDual | '';
  nombrePrueba: string;
  descripcion: string;
  fechaAplicacion: string;
  fechaVencimiento: string;
  resultado: string;
  puntuacion: string;
  interpretacion: string;
  recomendaciones: string;
  archivo: File | null;
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

const StudentModeloDualPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loadUser } = useAuthStore();
  const [tabValue, setTabValue] = useState(0);
  const [pruebas, setPruebas] = useState<PruebaModeloDual[]>([]);
  const [formatos, setFormatos] = useState<FormatoModeloDual[]>([]);
  const [convenios, setConvenios] = useState<ConvenioModeloDual[]>([]);
  const [proceso, setProceso] = useState<EstudianteModeloDual | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [form, setForm] = useState<FormData>({
    tipoPrueba: '',
    nombrePrueba: '',
    descripcion: '',
    fechaAplicacion: '',
    fechaVencimiento: '',
    resultado: '',
    puntuacion: '',
    interpretacion: '',
    recomendaciones: '',
    archivo: null,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedPrueba, setSelectedPrueba] = useState<PruebaModeloDual | null>(null);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [showInscripcion, setShowInscripcion] = useState<boolean>(false);
  const [inscripcionForm, setInscripcionForm] = useState({
    tipoIngreso: '' as TipoIngresoModeloDual | '',
    periodo: '',
    convenioId: '',
  });

  const cargarDatos = useCallback(async () => {
    try {
      setLoading(true);
      const [pruebasData, formatosData, conveniosData, procesoData] = await Promise.all([
        ModeloDualService.obtenerMisPruebas().catch(() => []),
        ModeloDualService.obtenerFormatos().catch(() => []),
        ModeloDualService.obtenerConvenios(true).catch(() => []),
        ModeloDualService.obtenerMiProceso().catch(() => null),
      ]);
      setPruebas(pruebasData);
      setFormatos(formatosData);
      setConvenios(conveniosData);
      setProceso(procesoData);
    } catch (error: any) {
      toast.error('No fue posible cargar la información');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
    cargarDatos();
  }, [cargarDatos, loadUser]);

  useEffect(() => {
    if (user && user.rol !== 'ESTUDIANTE') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const updateForm = (field: keyof FormData, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.tipoPrueba) {
      newErrors.tipoPrueba = 'Debes seleccionar un tipo de prueba';
    }

    if (!form.nombrePrueba.trim()) {
      newErrors.nombrePrueba = 'El nombre de la prueba es requerido';
    }

    if (!form.archivo) {
      newErrors.archivo = 'Debes seleccionar un archivo PDF';
    } else if (form.archivo.type !== 'application/pdf') {
      newErrors.archivo = 'Solo se permiten archivos PDF';
    } else if (form.archivo.size > 10 * 1024 * 1024) {
      newErrors.archivo = 'El archivo no debe exceder 10MB';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    try {
      setUploading(true);
      await ModeloDualService.subirPrueba({
        tipoPrueba: form.tipoPrueba as TipoPruebaModeloDual,
        nombrePrueba: form.nombrePrueba.trim(),
        descripcion: form.descripcion.trim() || undefined,
        fechaAplicacion: form.fechaAplicacion || undefined,
        fechaVencimiento: form.fechaVencimiento || undefined,
        resultado: form.resultado.trim() || undefined,
        puntuacion: form.puntuacion ? Number(form.puntuacion) : undefined,
        interpretacion: form.interpretacion.trim() || undefined,
        recomendaciones: form.recomendaciones.trim() || undefined,
        archivo: form.archivo!,
      });

      toast.success('Prueba enviada correctamente');
      setForm({
        tipoPrueba: '',
        nombrePrueba: '',
        descripcion: '',
        fechaAplicacion: '',
        fechaVencimiento: '',
        resultado: '',
        puntuacion: '',
        interpretacion: '',
        recomendaciones: '',
        archivo: null,
      });
      setShowForm(false);
      cargarDatos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No fue posible enviar la prueba');
    } finally {
      setUploading(false);
    }
  };

  const handleInscripcion = async () => {
    if (!inscripcionForm.tipoIngreso || !inscripcionForm.periodo) {
      toast.error('Completa todos los campos requeridos');
      return;
    }

    try {
      await ModeloDualService.inscribirEstudiante({
        tipoIngreso: inscripcionForm.tipoIngreso as TipoIngresoModeloDual,
        periodo: inscripcionForm.periodo,
        convenioId: inscripcionForm.convenioId || undefined,
      });
      toast.success('Inscripción realizada correctamente');
      setShowInscripcion(false);
      cargarDatos();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No fue posible realizar la inscripción');
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

  // Obtener periodo actual (ej: 2025-2)
  const getCurrentPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const semester = month <= 6 ? '1' : '2';
    return `${year}-${semester}`;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      <PageHeader
        title="Modelo Dual - Pruebas Psicológicas"
        subtitle="Coordinación de Sistema Abierto · Modalidad Mixta"
        gradientFrom="#008000"
        gradientTo="#006000"
        actions={
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
            Volver
          </Button>
        }
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {!proceso && (
          <Alert severity="info" sx={{ mb: 3 }}>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Para participar en el Modelo Dual, primero debes inscribirte.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setInscripcionForm({ tipoIngreso: '', periodo: getCurrentPeriod(), convenioId: '' });
                setShowInscripcion(true);
              }}
            >
              Inscribirme al Modelo Dual
            </Button>
          </Alert>
        )}

        {proceso && (
          <Paper sx={{ p: 3, mb: 3, bgcolor: '#f0fff0', border: '2px solid #008000' }}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  Mi Proceso - Modelo Dual
                </Typography>
                <Chip
                  label={ESTATUS_PROCESO_LABELS[proceso.estatus].label}
                  color={ESTATUS_PROCESO_LABELS[proceso.estatus].color}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="body2">
                    <strong>Periodo:</strong> {proceso.periodo}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Tipo de Ingreso:</strong>{' '}
                    {proceso.tipoIngreso === 'NUEVO_INGRESO' ? 'Nuevo Ingreso' : 'Renovación'}
                  </Typography>
                  {proceso.convenio && (
                    <Typography variant="body2">
                      <strong>Convenio:</strong> {proceso.convenio.nombreEmpresa}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {proceso.solicitudSubida ? (
                        <CheckCircleOutline color="success" />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                      <Typography variant="body2">Solicitud Subida</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {proceso.solicitudAprobada ? (
                        <CheckCircleOutline color="success" />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                      <Typography variant="body2">Solicitud Aprobada</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {proceso.convenioFirmado ? (
                        <CheckCircleOutline color="success" />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                      <Typography variant="body2">Convenio Firmado</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {proceso.cartaCompromiso ? (
                        <CheckCircleOutline color="success" />
                      ) : (
                        <RadioButtonUnchecked color="disabled" />
                      )}
                      <Typography variant="body2">Carta Compromiso</Typography>
                    </Box>
                  </Stack>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        )}

        <Paper sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
            <Tab label="Formatos" icon={<Description />} iconPosition="start" />
            <Tab label="Convenios" icon={<Business />} iconPosition="start" />
            <Tab label="Pruebas Psicológicas" icon={<Psychology />} iconPosition="start" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Formatos Disponibles
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Descarga los formatos necesarios para el proceso del Modelo Dual
              </Typography>
              {formatos.length === 0 ? (
                <Alert severity="info">No hay formatos disponibles en este momento</Alert>
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
                                  variant="contained"
                                  startIcon={<OpenInNew />}
                                  href={formato.urlDescarga}
                                  target="_blank"
                                >
                                  Descargar
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

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Convenios Vigentes
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Empresas con convenios activos para el Modelo Dual
              </Typography>
              {convenios.length === 0 ? (
                <Alert severity="info">No hay convenios disponibles en este momento</Alert>
              ) : (
                <Grid container spacing={2}>
                  {convenios.map((convenio) => (
                    <Grid item xs={12} md={6} key={convenio.id}>
                      <Card>
                        <CardContent>
                          <Stack spacing={2}>
                            <Box>
                              <Typography variant="h6">{convenio.nombreEmpresa}</Typography>
                              {convenio.sector && (
                                <Chip label={convenio.sector} size="small" sx={{ mt: 1 }} />
                              )}
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

          <TabPanel value={tabValue} index={2}>
            <Box sx={{ p: 3 }}>
              <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">Mis Pruebas Psicológicas</Typography>
                <Button
                  variant="contained"
                  startIcon={<CloudUpload />}
                  onClick={() => setShowForm(true)}
                  disabled={uploading}
                >
                  Subir Nueva Prueba
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : pruebas.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                  <Typography variant="h6" color="text.secondary">
                    No has subido ninguna prueba aún
                  </Typography>
                </Paper>
              ) : (
                <Grid container spacing={3}>
                  {pruebas.map((prueba) => (
                    <Grid item xs={12} md={6} key={prueba.id}>
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
                                label={ESTATUS_LABELS[prueba.estatus].label}
                                color={ESTATUS_LABELS[prueba.estatus].color}
                                size="small"
                              />
                            </Box>

                            {prueba.descripcion && (
                              <Typography variant="body2" color="text.secondary">
                                {prueba.descripcion}
                              </Typography>
                            )}

                            {prueba.motivoRechazo && (
                              <Alert severity="error">
                                <Typography variant="body2">
                                  <strong>Motivo de rechazo:</strong> {prueba.motivoRechazo}
                                </Typography>
                              </Alert>
                            )}

                            <Divider />

                            <Stack direction="row" spacing={2}>
                              <Button
                                size="small"
                                startIcon={<Download />}
                                onClick={() => handleDownload(prueba, 'original')}
                              >
                                Descargar Original
                              </Button>
                              {prueba.estatus === 'APROBADA' && prueba.archivoValidado && (
                                <Button
                                  size="small"
                                  startIcon={<CheckCircle />}
                                  color="success"
                                  onClick={() => handleDownload(prueba, 'validado')}
                                >
                                  Descargar Validado
                                </Button>
                              )}
                              <Button
                                size="small"
                                startIcon={<Info />}
                                onClick={() => {
                                  setSelectedPrueba(prueba);
                                  setShowDetails(true);
                                }}
                              >
                                Ver Detalles
                              </Button>
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
        </Paper>

        {/* Dialog para subir nueva prueba */}
        <Dialog open={showForm} onClose={() => setShowForm(false)} maxWidth="md" fullWidth>
          <DialogTitle>Subir Nueva Prueba Psicológica</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControl fullWidth error={!!errors.tipoPrueba}>
                <InputLabel>Tipo de Prueba</InputLabel>
                <Select
                  value={form.tipoPrueba}
                  onChange={(e) => updateForm('tipoPrueba', e.target.value)}
                  label="Tipo de Prueba"
                >
                  {TIPOS_DISPONIBLES.map((tipo) => (
                    <MenuItem key={tipo} value={tipo}>
                      {TIPO_LABELS[tipo]}
                    </MenuItem>
                  ))}
                </Select>
                {errors.tipoPrueba && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                    {errors.tipoPrueba}
                  </Typography>
                )}
              </FormControl>

              <TextField
                label="Nombre de la Prueba"
                fullWidth
                required
                value={form.nombrePrueba}
                onChange={(e) => updateForm('nombrePrueba', e.target.value)}
                error={!!errors.nombrePrueba}
                helperText={errors.nombrePrueba}
              />

              <TextField
                label="Descripción (opcional)"
                fullWidth
                multiline
                rows={3}
                value={form.descripcion}
                onChange={(e) => updateForm('descripcion', e.target.value)}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Fecha de Aplicación"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={form.fechaAplicacion}
                    onChange={(e) => updateForm('fechaAplicacion', e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Fecha de Vencimiento"
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={form.fechaVencimiento}
                    onChange={(e) => updateForm('fechaVencimiento', e.target.value)}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Resultado (opcional)"
                fullWidth
                multiline
                rows={2}
                value={form.resultado}
                onChange={(e) => updateForm('resultado', e.target.value)}
              />

              <TextField
                label="Puntuación (opcional)"
                type="number"
                fullWidth
                value={form.puntuacion}
                onChange={(e) => updateForm('puntuacion', e.target.value)}
              />

              <TextField
                label="Interpretación (opcional)"
                fullWidth
                multiline
                rows={3}
                value={form.interpretacion}
                onChange={(e) => updateForm('interpretacion', e.target.value)}
              />

              <TextField
                label="Recomendaciones (opcional)"
                fullWidth
                multiline
                rows={3}
                value={form.recomendaciones}
                onChange={(e) => updateForm('recomendaciones', e.target.value)}
              />

              <Box>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ mb: 1 }}
                >
                  Seleccionar Archivo PDF
                  <input
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      updateForm('archivo', file);
                    }}
                  />
                </Button>
                {form.archivo && (
                  <Typography variant="body2" color="text.secondary">
                    {form.archivo.name} ({(form.archivo.size / 1024 / 1024).toFixed(2)} MB)
                  </Typography>
                )}
                {errors.archivo && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                    {errors.archivo}
                  </Typography>
                )}
              </Box>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowForm(false)}>Cancelar</Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={uploading}
              startIcon={uploading ? <CircularProgress size={20} /> : <CloudUpload />}
            >
              {uploading ? 'Enviando...' : 'Enviar Prueba'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para ver detalles */}
        <Dialog open={showDetails} onClose={() => setShowDetails(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Detalles de la Prueba</DialogTitle>
          <DialogContent>
            {selectedPrueba && (
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Nombre
                  </Typography>
                  <Typography variant="body1">{selectedPrueba.nombrePrueba}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Tipo
                  </Typography>
                  <Typography variant="body1">{TIPO_LABELS[selectedPrueba.tipoPrueba]}</Typography>
                </Box>
                {selectedPrueba.descripcion && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Descripción
                    </Typography>
                    <Typography variant="body1">{selectedPrueba.descripcion}</Typography>
                  </Box>
                )}
                {selectedPrueba.puntuacion && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Puntuación
                    </Typography>
                    <Typography variant="body1">{selectedPrueba.puntuacion}</Typography>
                  </Box>
                )}
                {selectedPrueba.interpretacion && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Interpretación
                    </Typography>
                    <Typography variant="body1">{selectedPrueba.interpretacion}</Typography>
                  </Box>
                )}
                {selectedPrueba.observaciones && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Observaciones
                    </Typography>
                    <Typography variant="body1">{selectedPrueba.observaciones}</Typography>
                  </Box>
                )}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de Envío
                  </Typography>
                  <Typography variant="body1">
                    {new Date(selectedPrueba.createdAt).toLocaleDateString('es-MX')}
                  </Typography>
                </Box>
              </Stack>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowDetails(false)}>Cerrar</Button>
          </DialogActions>
        </Dialog>

        {/* Dialog para inscripción */}
        <Dialog open={showInscripcion} onClose={() => setShowInscripcion(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Inscribirme al Modelo Dual</DialogTitle>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 1 }}>
              <FormControl fullWidth required>
                <InputLabel>Tipo de Ingreso</InputLabel>
                <Select
                  value={inscripcionForm.tipoIngreso}
                  onChange={(e) =>
                    setInscripcionForm({ ...inscripcionForm, tipoIngreso: e.target.value as TipoIngresoModeloDual })
                  }
                  label="Tipo de Ingreso"
                >
                  <MenuItem value="NUEVO_INGRESO">Nuevo Ingreso</MenuItem>
                  <MenuItem value="RENOVACION">Renovación</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Periodo"
                fullWidth
                required
                value={inscripcionForm.periodo}
                onChange={(e) => setInscripcionForm({ ...inscripcionForm, periodo: e.target.value })}
                placeholder="Ej: 2025-2"
                helperText="Formato: Año-Semestre (ej: 2025-2)"
              />

              <FormControl fullWidth>
                <InputLabel>Convenio (opcional)</InputLabel>
                <Select
                  value={inscripcionForm.convenioId}
                  onChange={(e) => setInscripcionForm({ ...inscripcionForm, convenioId: e.target.value })}
                  label="Convenio (opcional)"
                >
                  <MenuItem value="">Ninguno</MenuItem>
                  {convenios.map((convenio) => (
                    <MenuItem key={convenio.id} value={convenio.id}>
                      {convenio.nombreEmpresa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowInscripcion(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleInscripcion}>
              Inscribirme
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default StudentModeloDualPage;
