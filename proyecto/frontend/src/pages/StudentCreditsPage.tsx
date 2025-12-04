/**
 * Página de Créditos Complementarios (Estudiante)
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  MenuItem,
  Select,
} from '@mui/material';
import { CloudUpload, Download, ArrowBack, CheckCircle, Info } from '@mui/icons-material';
import toast from 'react-hot-toast';
import CreditosService from '../services/creditos.service';
import { CreditoComplementario, EstatusCreditoComplementario, TipoCreditoComplementario } from '../types/creditos.types';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

const ESTATUS_LABELS: Record<EstatusCreditoComplementario, { label: string; color: 'default' | 'success' | 'warning' | 'error' }> = {
  PENDIENTE: { label: 'Pendiente', color: 'warning' },
  EN_REVISION: { label: 'En revisión', color: 'default' },
  VALIDADO: { label: 'Validado', color: 'success' },
  RECHAZADO: { label: 'Rechazado', color: 'error' },
};

const TIPO_LABELS: Record<TipoCreditoComplementario, string> = {
  ACTIVIDADES_EXTRACURRICULARES: 'Actividades Extracurriculares',
  CURSOS: 'Cursos',
  TUTORIAS: 'Tutorías',
  ACTIVIDADES_CULTURALES: 'Actividades Culturales',
};

const TIPOS_DISPONIBLES: TipoCreditoComplementario[] = [
  'ACTIVIDADES_EXTRACURRICULARES',
  'CURSOS',
  'TUTORIAS',
  'ACTIVIDADES_CULTURALES',
];

const REGLAS_CREDITOS = [
  'Debes subir 5 créditos complementarios en total.',
  'Puedes elegir cualquier combinación de tipos: Actividades Extracurriculares, Cursos, Tutorías y Actividades Culturales.',
  'Puedes tener varios créditos del mismo tipo (ej: 3 cursos y 2 actividades extracurriculares).',
  'Para CURSOS: Se requieren mínimo 60 horas de curso para completar 1 crédito complementario. Si tu curso tiene menos horas, puedes subir archivos adicionales hasta completar las 60 horas.',
  'Debes proporcionar una descripción detallada del crédito que estás subiendo.',
  'El archivo debe estar en formato PDF y no exceder 10MB.',
];

interface FormData {
  tipo: TipoCreditoComplementario | '';
  titulo: string;
  descripcion: string;
  horasCurso: string;
  archivo: File | null;
}

const TOTAL_CREDITOS = 5;

const StudentCreditsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, loadUser } = useAuthStore();
  const [creditos, setCreditos] = useState<CreditoComplementario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<number | null>(null);
  const [uploadingAdicional, setUploadingAdicional] = useState<string | null>(null);
  const [forms, setForms] = useState<Map<number, FormData>>(new Map());
  const [formsAdicionales, setFormsAdicionales] = useState<Map<string, { horasCurso: string; archivo: File | null }>>(new Map());
  const [errors, setErrors] = useState<Map<number, Record<string, string>>>(new Map());
  const [errorsAdicionales, setErrorsAdicionales] = useState<Map<string, Record<string, string>>>(new Map());
  const logoUrl = `${process.env.PUBLIC_URL}/logo-coordinacion.png`;

  const creditosPorNumero = useMemo(() => {
    const map = new Map<number, CreditoComplementario>();
    creditos.forEach((credito) => map.set(credito.numero, credito));
    return map;
  }, [creditos]);

  const cargarCreditos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await CreditosService.obtenerMisCreditos();
      setCreditos(data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'No fue posible obtener tus créditos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
    cargarCreditos();
  }, [cargarCreditos, loadUser]);

  useEffect(() => {
    if (user && user.rol !== 'ESTUDIANTE') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  // Prellenar formularios para créditos rechazados
  useEffect(() => {
    creditos.forEach((credito) => {
      if (credito.estatus === 'RECHAZADO' && !forms.has(credito.numero)) {
        setForms((prev) => {
          const newMap = new Map(prev);
          newMap.set(credito.numero, {
            tipo: credito.tipo,
            titulo: credito.titulo,
            descripcion: credito.descripcion,
            horasCurso: credito.horasCurso ? String(credito.horasCurso) : '',
            archivo: null,
          });
          return newMap;
        });
      }
    });
  }, [creditos, forms]);

  const updateForm = (numero: number, field: keyof FormData, value: string | File | null) => {
    setForms((prev) => {
      const newMap = new Map(prev);
      const currentForm = newMap.get(numero) || { tipo: '', titulo: '', descripcion: '', horasCurso: '', archivo: null };
      newMap.set(numero, { ...currentForm, [field]: value });
      return newMap;
    });

    // Limpiar error del campo
    setErrors((prev) => {
      const newMap = new Map(prev);
      const currentErrors = newMap.get(numero) || {};
      delete currentErrors[field];
      newMap.set(numero, currentErrors);
      return newMap;
    });
  };

  const validateForm = (numero: number): boolean => {
    const form = forms.get(numero) || { tipo: '', titulo: '', descripcion: '', horasCurso: '', archivo: null };
    const newErrors: Record<string, string> = {};

    if (!form.tipo) {
      newErrors.tipo = 'Debes seleccionar un tipo de crédito';
    }

    if (!form.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }

    if (!form.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (form.tipo === 'CURSOS') {
      if (!form.horasCurso || Number(form.horasCurso) <= 0) {
        newErrors.horasCurso = 'Debes indicar las horas del curso';
      }
    }

    if (!form.archivo) {
      newErrors.archivo = 'Debes seleccionar un archivo PDF';
    } else if (form.archivo.type !== 'application/pdf') {
      newErrors.archivo = 'Solo se permiten archivos PDF';
    } else if (form.archivo.size > 10 * 1024 * 1024) {
      newErrors.archivo = 'El archivo no debe exceder 10MB';
    }

    setErrors((prev) => {
      const newMap = new Map(prev);
      newMap.set(numero, newErrors);
      return newMap;
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (numero: number) => {
    if (!validateForm(numero)) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    const form = forms.get(numero);
    if (!form || !form.archivo || !form.tipo) return;

    try {
      setUploading(numero);
      const creditoExistente = creditosPorNumero.get(numero);
      const esActualizacion = creditoExistente && creditoExistente.estatus === 'RECHAZADO';
      
      await CreditosService.subirCredito({
        numero: esActualizacion ? numero : undefined,
        tipo: form.tipo as TipoCreditoComplementario,
        titulo: form.titulo.trim(),
        descripcion: form.descripcion.trim(),
        horasCurso: form.tipo === 'CURSOS' ? Number(form.horasCurso) : undefined,
        archivo: form.archivo,
      });
      toast.success(`Crédito ${numero} enviado correctamente`);
      
      // Limpiar formulario
      setForms((prev) => {
        const newMap = new Map(prev);
        newMap.delete(numero);
        return newMap;
      });
      setErrors((prev) => {
        const newMap = new Map(prev);
        newMap.delete(numero);
        return newMap;
      });
      
      cargarCreditos();
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.error?.message || 'Error al subir el crédito';
      toast.error(message);
    } finally {
      setUploading(null);
    }
  };

  const updateFormAdicional = (creditoId: string, field: 'horasCurso' | 'archivo', value: string | File | null) => {
    setFormsAdicionales((prev) => {
      const newMap = new Map(prev);
      const currentForm = newMap.get(creditoId) || { horasCurso: '', archivo: null };
      newMap.set(creditoId, { ...currentForm, [field]: value });
      return newMap;
    });

    // Limpiar error del campo
    setErrorsAdicionales((prev) => {
      const newMap = new Map(prev);
      const currentErrors = newMap.get(creditoId) || {};
      delete currentErrors[field];
      newMap.set(creditoId, currentErrors);
      return newMap;
    });
  };

  const validateFormAdicional = (creditoId: string): boolean => {
    const form = formsAdicionales.get(creditoId) || { horasCurso: '', archivo: null };
    const newErrors: Record<string, string> = {};

    if (!form.horasCurso || Number(form.horasCurso) <= 0) {
      newErrors.horasCurso = 'Debes indicar las horas de este archivo';
    }

    if (!form.archivo) {
      newErrors.archivo = 'Debes seleccionar un archivo PDF';
    } else if (form.archivo.type !== 'application/pdf') {
      newErrors.archivo = 'Solo se permiten archivos PDF';
    } else if (form.archivo.size > 10 * 1024 * 1024) {
      newErrors.archivo = 'El archivo no debe exceder 10MB';
    }

    setErrorsAdicionales((prev) => {
      const newMap = new Map(prev);
      newMap.set(creditoId, newErrors);
      return newMap;
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleAgregarArchivoAdicional = async (creditoId: string) => {
    if (!validateFormAdicional(creditoId)) {
      toast.error('Por favor completa todos los campos correctamente');
      return;
    }

    const form = formsAdicionales.get(creditoId);
    if (!form || !form.archivo) return;

    try {
      setUploadingAdicional(creditoId);
      await CreditosService.agregarArchivoAdicional(creditoId, Number(form.horasCurso), form.archivo);
      toast.success('Archivo adicional agregado correctamente');
      
      // Limpiar formulario
      setFormsAdicionales((prev) => {
        const newMap = new Map(prev);
        newMap.delete(creditoId);
        return newMap;
      });
      setErrorsAdicionales((prev) => {
        const newMap = new Map(prev);
        newMap.delete(creditoId);
        return newMap;
      });
      
      cargarCreditos();
    } catch (error: any) {
      const message = error.response?.data?.message || error.response?.data?.error?.message || 'Error al agregar archivo adicional';
      toast.error(message);
    } finally {
      setUploadingAdicional(null);
    }
  };

  const handleDescargar = async (creditoId: string, tipo: 'original' | 'firmado') => {
    try {
      const response = await CreditosService.descargarArchivo(creditoId, tipo);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = tipo === 'original' ? `credito-original-${Date.now()}.pdf` : `constancia-firmada-${Date.now()}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast.error('No fue posible descargar el archivo');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7f5' }}>
      <Box
        sx={{
          background: 'linear-gradient(135deg, #006000 0%, #009e60 100%)',
          color: '#FFFFFF',
          py: 4,
          mb: 5,
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component="img"
                src={logoUrl}
                alt="Coordinación Sistema Abierto"
                sx={{
                  width: { xs: 70, sm: 90 },
                  height: { xs: 70, sm: 90 },
                  objectFit: 'contain',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(255,255,255,0.15)',
                  p: 1,
                }}
              />
              <Box>
                <Typography variant="h4" fontWeight={700} lineHeight={1.2}>
                  Créditos Complementarios
                </Typography>
                <Typography variant="subtitle1" sx={{ opacity: 0.85 }}>
                  Coord. de Sistema Abierto · Modalidad Mixta
                </Typography>
              </Box>
            </Stack>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/dashboard')}
              sx={{
                borderColor: '#ffffff',
                color: '#ffffff',
                '&:hover': {
                  borderColor: '#ffffff',
                  backgroundColor: 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Regresar
            </Button>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 6 }}>
        {/* Reglas de los créditos */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            mb: 4,
            backgroundColor: '#f5f5f5',
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <Info color="primary" />
            <Typography variant="h6" fontWeight={600} sx={{ color: '#006000' }}>
              Reglas de los Créditos Complementarios
            </Typography>
          </Stack>
          <Stack spacing={1}>
            {REGLAS_CREDITOS.map((regla, index) => (
              <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                <CheckCircle sx={{ fontSize: 18, color: 'success.main', mt: 0.5 }} />
                <Typography variant="body2">{regla}</Typography>
              </Stack>
            ))}
          </Stack>
        </Paper>

        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            mb: 4,
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h5" fontWeight={600} sx={{ color: '#006000' }}>
              Estado de tus créditos ({creditos.length} / {TOTAL_CREDITOS})
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Sube tus 5 créditos complementarios en formato PDF. Puedes elegir cualquier combinación de tipos.
              Desde aquí puedes monitorear si los acreditó la coordinación, revisar los comentarios y descargar la constancia firmada cuando esté disponible.
            </Typography>
            <Divider />
            <Grid container spacing={3}>
              {Array.from({ length: TOTAL_CREDITOS }, (_, i) => i + 1).map((numero) => {
                const credito = creditosPorNumero.get(numero);
                const estatusConfig = credito ? ESTATUS_LABELS[credito.estatus] : null;
                const isUploading = uploading === numero;
                const form = forms.get(numero) || { tipo: '', titulo: '', descripcion: '', horasCurso: '', archivo: null };
                const formErrors = errors.get(numero) || {};

                return (
                  <Grid item xs={12} md={6} key={numero}>
                    <Card
                      elevation={2}
                      sx={{
                        borderRadius: 3,
                        border: '1px solid rgba(0,0,0,0.08)',
                        height: '100%',
                        display: 'flex',
                      }}
                    >
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6" fontWeight={700}>
                            Crédito {numero}
                          </Typography>
                          {estatusConfig && (
                            <Chip label={estatusConfig.label} color={estatusConfig.color} sx={{ fontWeight: 'bold' }} />
                          )}
                        </Box>

                        {credito && credito.estatus !== 'RECHAZADO' ? (
                          <>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Tipo:</strong> {TIPO_LABELS[credito.tipo]}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Título:</strong> {credito.titulo}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              <strong>Descripción:</strong> {credito.descripcion}
                            </Typography>
                            {credito.tipo === 'CURSOS' && (
                              <Box
                                sx={{
                                  p: 2,
                                  borderRadius: 2,
                                  backgroundColor: credito.horasTotales && credito.horasTotales >= 60 ? '#e8f5e9' : '#fff3e0',
                                  border: `1px solid ${credito.horasTotales && credito.horasTotales >= 60 ? '#4caf50' : '#ff9800'}`,
                                }}
                              >
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                                  Progreso de horas:
                                </Typography>
                                <Typography variant="body2">
                                  Horas del archivo original: {credito.horasCurso || 0}
                                </Typography>
                                {credito.archivosAdicionales && credito.archivosAdicionales.length > 0 && (
                                  <>
                                    <Typography variant="body2">
                                      Archivos adicionales: {credito.archivosAdicionales.length}
                                    </Typography>
                                    {credito.archivosAdicionales.map((arch, idx) => (
                                      <Typography key={arch.id} variant="caption" display="block" sx={{ ml: 2 }}>
                                        - Archivo {idx + 1}: {arch.horas} horas
                                      </Typography>
                                    ))}
                                  </>
                                )}
                                <Typography variant="body1" fontWeight="bold" sx={{ mt: 1 }}>
                                  Total: {credito.horasTotales || credito.horasCurso || 0} / 60 horas
                                </Typography>
                                {credito.horasTotales && credito.horasTotales < 60 && (
                                  <Alert severity="warning" sx={{ mt: 1 }}>
                                    Aún necesitas {60 - (credito.horasTotales || 0)} horas para completar el crédito. Sube archivos adicionales.
                                  </Alert>
                                )}
                                {credito.horasTotales && credito.horasTotales >= 60 && (
                                  <Alert severity="success" sx={{ mt: 1 }}>
                                    ¡Has completado las 60 horas requeridas!
                                  </Alert>
                                )}
                              </Box>
                            )}

                            {credito.tipo === 'CURSOS' && credito.horasTotales && credito.horasTotales < 60 && (
                              <Box sx={{ p: 2, borderRadius: 2, backgroundColor: '#f5f5f5', border: '1px dashed #ccc' }}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                                  Agregar archivo adicional:
                                </Typography>
                                {(() => {
                                  const formAdicional = formsAdicionales.get(credito.id) || { horasCurso: '', archivo: null };
                                  const errorsAdicional = errorsAdicionales.get(credito.id) || {};
                                  return (
                                    <Stack spacing={2}>
                                      <TextField
                                        label="Horas de este archivo *"
                                        type="number"
                                        value={formAdicional.horasCurso}
                                        onChange={(e) => updateFormAdicional(credito.id, 'horasCurso', e.target.value)}
                                        error={!!errorsAdicional.horasCurso}
                                        helperText={errorsAdicional.horasCurso}
                                        fullWidth
                                        size="small"
                                        inputProps={{ min: 1 }}
                                      />
                                      <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUpload />}
                                        fullWidth
                                        sx={{ borderColor: '#008000', color: '#008000' }}
                                      >
                                        {formAdicional.archivo ? formAdicional.archivo.name : 'Seleccionar archivo PDF adicional'}
                                        <input
                                          hidden
                                          accept="application/pdf"
                                          type="file"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0] || null;
                                            updateFormAdicional(credito.id, 'archivo', file);
                                          }}
                                        />
                                      </Button>
                                      {errorsAdicional.archivo && (
                                        <Typography variant="caption" color="error">
                                          {errorsAdicional.archivo}
                                        </Typography>
                                      )}
                                      <Button
                                        variant="contained"
                                        onClick={() => handleAgregarArchivoAdicional(credito.id)}
                                        disabled={uploadingAdicional === credito.id}
                                        startIcon={uploadingAdicional === credito.id ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                                        fullWidth
                                        sx={{
                                          backgroundColor: '#008000',
                                          '&:hover': { backgroundColor: '#006f40' },
                                        }}
                                      >
                                        {uploadingAdicional === credito.id ? 'Subiendo...' : 'Agregar archivo adicional'}
                                      </Button>
                                    </Stack>
                                  );
                                })()}
                              </Box>
                            )}

                            {credito.motivoRechazo && (
                              <Box
                                sx={{
                                  borderRadius: 2,
                                  border: '1px solid',
                                  borderColor: 'error.light',
                                  backgroundColor: 'rgba(244, 67, 54, 0.08)',
                                  p: 2,
                                }}
                              >
                                <Typography variant="subtitle2" color="error" fontWeight={600}>
                                  Motivo del rechazo
                                </Typography>
                                <Typography variant="body2" color="error.dark">
                                  {credito.motivoRechazo}
                                </Typography>
                              </Box>
                            )}

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                              {credito.archivoOriginal && (
                                <Button
                                  variant="outlined"
                                  startIcon={<Download />}
                                  onClick={() => handleDescargar(credito.id, 'original')}
                                  sx={{ borderColor: '#008000', color: '#008000' }}
                                >
                                  Ver original
                                </Button>
                              )}

                              {credito.estatus === 'VALIDADO' && credito.archivoValidado && (
                                <Button
                                  variant="outlined"
                                  startIcon={<Download />}
                                  onClick={() => handleDescargar(credito.id, 'firmado')}
                                  sx={{ borderColor: '#006000', color: '#006000' }}
                                >
                                  Constancia firmada
                                </Button>
                              )}
                            </Stack>
                          </>
                        ) : (
                          <Stack spacing={2}>
                            <FormControl fullWidth error={!!formErrors.tipo}>
                              <FormLabel>Tipo de Crédito *</FormLabel>
                              <Select
                                value={form.tipo}
                                onChange={(e) => updateForm(numero, 'tipo', e.target.value)}
                                size="small"
                              >
                                {TIPOS_DISPONIBLES.map((tipo) => (
                                  <MenuItem key={tipo} value={tipo}>
                                    {TIPO_LABELS[tipo]}
                                  </MenuItem>
                                ))}
                              </Select>
                              {formErrors.tipo && (
                                <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                                  {formErrors.tipo}
                                </Typography>
                              )}
                            </FormControl>

                            {form.tipo === 'CURSOS' && (
                              <Alert severity="info">
                                Para cursos, se requieren mínimo 60 horas para completar 1 crédito complementario. Si tu curso tiene menos horas, podrás agregar archivos adicionales después.
                              </Alert>
                            )}

                            <TextField
                              label="Título del Crédito *"
                              value={form.titulo}
                              onChange={(e) => updateForm(numero, 'titulo', e.target.value)}
                              error={!!formErrors.titulo}
                              helperText={formErrors.titulo}
                              fullWidth
                              size="small"
                            />

                            <TextField
                              label="Descripción del Crédito *"
                              value={form.descripcion}
                              onChange={(e) => updateForm(numero, 'descripcion', e.target.value)}
                              error={!!formErrors.descripcion}
                              helperText={formErrors.descripcion}
                              multiline
                              rows={3}
                              fullWidth
                              size="small"
                            />

                            {form.tipo === 'CURSOS' && (
                              <TextField
                                label="Horas del Curso *"
                                type="number"
                                value={form.horasCurso}
                                onChange={(e) => updateForm(numero, 'horasCurso', e.target.value)}
                                error={!!formErrors.horasCurso}
                                helperText={formErrors.horasCurso || 'Indica las horas de este archivo. Si no completas 60 horas, podrás agregar archivos adicionales después.'}
                                fullWidth
                                size="small"
                                inputProps={{ min: 1 }}
                              />
                            )}

                            <Button
                              variant="outlined"
                              component="label"
                              startIcon={<CloudUpload />}
                              fullWidth
                              sx={{ borderColor: '#008000', color: '#008000' }}
                            >
                              {form.archivo ? form.archivo.name : 'Seleccionar archivo PDF'}
                              <input
                                hidden
                                accept="application/pdf"
                                type="file"
                                onChange={(e) => {
                                  const file = e.target.files?.[0] || null;
                                  updateForm(numero, 'archivo', file);
                                }}
                              />
                            </Button>
                            {formErrors.archivo && (
                              <Typography variant="caption" color="error" sx={{ mt: -1 }}>
                                {formErrors.archivo}
                              </Typography>
                            )}

                            <Button
                              variant="contained"
                              onClick={() => handleSubmit(numero)}
                              disabled={isUploading}
                              startIcon={isUploading ? <CircularProgress size={20} color="inherit" /> : <CloudUpload />}
                              fullWidth
                              sx={{
                                backgroundColor: '#008000',
                                '&:hover': { backgroundColor: '#006f40' },
                              }}
                            >
                              {isUploading ? 'Subiendo...' : 'Subir crédito'}
                            </Button>
                          </Stack>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </Paper>

        {loading && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <CircularProgress sx={{ color: '#008000', mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              Cargando información de tus créditos...
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default StudentCreditsPage;
