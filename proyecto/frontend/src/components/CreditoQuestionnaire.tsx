/**
 * Componente de Cuestionario para Créditos Complementarios
 * Muestra las reglas y permite seleccionar el tipo de crédito antes de subir el PDF
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Typography,
  Box,
  Paper,
  Alert,
  Stack,
} from '@mui/material';
import { CheckCircle, Info } from '@mui/icons-material';
import { TipoCreditoComplementario } from '../types/creditos.types';

interface CreditoQuestionnaireProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    tipo: TipoCreditoComplementario;
    titulo: string;
    descripcion: string;
    horasCurso?: number;
  }) => void;
  tiposDisponibles: TipoCreditoComplementario[];
}

const TIPO_LABELS: Record<TipoCreditoComplementario, string> = {
  ACTIVIDADES_EXTRACURRICULARES: 'Actividades Extracurriculares',
  CURSOS: 'Cursos',
  TUTORIAS: 'Tutorías',
  ACTIVIDADES_CULTURALES: 'Actividades Culturales',
};

const REGLAS_CREDITOS = [
  'Solo puedes subir 1 crédito por cada tipo de actividad.',
  'Los tipos disponibles son: Actividades Extracurriculares, Cursos, Tutorías y Actividades Culturales.',
  'Para CURSOS: Se requieren mínimo 60 horas de curso para completar 1 hora de crédito complementario.',
  'Debes proporcionar una descripción detallada del crédito que estás subiendo.',
  'El archivo debe estar en formato PDF y no exceder 10MB.',
];

const CreditoQuestionnaire: React.FC<CreditoQuestionnaireProps> = ({
  open,
  onClose,
  onSubmit,
  tiposDisponibles,
}) => {
  const [tipo, setTipo] = useState<TipoCreditoComplementario | ''>('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [horasCurso, setHorasCurso] = useState<number | ''>('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!tipo) {
      newErrors.tipo = 'Debes seleccionar un tipo de crédito';
    }

    if (!titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }

    if (!descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (tipo === 'CURSOS') {
      if (!horasCurso || Number(horasCurso) < 60) {
        newErrors.horasCurso = 'Para cursos, se requieren mínimo 60 horas';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      tipo: tipo as TipoCreditoComplementario,
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      horasCurso: tipo === 'CURSOS' ? Number(horasCurso) : undefined,
    });

    // Reset form
    setTipo('');
    setTitulo('');
    setDescripcion('');
    setHorasCurso('');
    setErrors({});
  };

  const handleClose = () => {
    setTipo('');
    setTitulo('');
    setDescripcion('');
    setHorasCurso('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <Info color="primary" />
          <Typography variant="h6">Reglas y Cuestionario de Créditos Complementarios</Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {/* Reglas */}
          <Paper elevation={0} sx={{ p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Reglas de los Créditos Complementarios:
            </Typography>
            <Stack spacing={1}>
              {REGLAS_CREDITOS.map((regla, index) => (
                <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
                  <CheckCircle sx={{ fontSize: 18, color: 'success.main', mt: 0.5 }} />
                  <Typography variant="body2">{regla}</Typography>
                </Stack>
              ))}
            </Stack>
          </Paper>

          {/* Tipo de crédito */}
          <FormControl error={!!errors.tipo} fullWidth>
            <FormLabel component="legend" sx={{ mb: 1, fontWeight: 'bold' }}>
              Tipo de Crédito *
            </FormLabel>
            <RadioGroup value={tipo} onChange={(e) => setTipo(e.target.value as TipoCreditoComplementario)}>
              {Object.entries(TIPO_LABELS).map(([key, label]) => {
                const tipoKey = key as TipoCreditoComplementario;
                const disponible = tiposDisponibles.includes(tipoKey);
                return (
                  <FormControlLabel
                    key={key}
                    value={key}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography>{label}</Typography>
                        {!disponible && (
                          <Typography variant="caption" color="text.secondary">
                            (Ya tienes un crédito de este tipo)
                          </Typography>
                        )}
                      </Box>
                    }
                    disabled={!disponible}
                  />
                );
              })}
            </RadioGroup>
            {errors.tipo && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                {errors.tipo}
              </Typography>
            )}
          </FormControl>

          {/* Título */}
          <TextField
            label="Título del Crédito *"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            error={!!errors.titulo}
            helperText={errors.titulo}
            fullWidth
          />

          {/* Descripción */}
          <TextField
            label="Descripción del Crédito *"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            error={!!errors.descripcion}
            helperText={errors.descripcion}
            multiline
            rows={4}
            fullWidth
          />

          {/* Horas del curso (solo si es CURSOS) */}
          {tipo === 'CURSOS' && (
            <Box>
              <TextField
                label="Horas del Curso *"
                type="number"
                value={horasCurso}
                onChange={(e) => setHorasCurso(e.target.value ? Number(e.target.value) : '')}
                error={!!errors.horasCurso}
                helperText={errors.horasCurso || 'Mínimo 60 horas para completar 1 hora de crédito'}
                fullWidth
                inputProps={{ min: 60 }}
              />
              <Alert severity="info" sx={{ mt: 1 }}>
                Para cursos, se requieren mínimo 60 horas para completar 1 hora de crédito complementario.
              </Alert>
            </Box>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button variant="contained" onClick={handleSubmit} disabled={!tipo || !titulo.trim() || !descripcion.trim()}>
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreditoQuestionnaire;

