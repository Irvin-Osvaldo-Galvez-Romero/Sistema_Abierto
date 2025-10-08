/**
 * Componentes Memoizados para Optimización
 * Evita re-renders innecesarios mejorando performance
 */

import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';

// Memoizado Card para estadísticas
export const MemoizedStatCard = memo(({ 
  title, 
  value, 
  icon, 
  color = '#008000',
  onClick 
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
  onClick?: () => void;
}) => (
  <Card
    sx={{
      cursor: onClick ? 'pointer' : 'default',
      transition: 'all 0.3s ease',
      '&:hover': onClick ? {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
      } : {},
    }}
    onClick={onClick}
  >
    <CardContent sx={{ textAlign: 'center', p: 3 }}>
      <Box sx={{ color, mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h4" fontWeight="bold" sx={{ color, mb: 1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </CardContent>
  </Card>
));

// Memoizado Botón de Acción
export const MemoizedActionButton = memo(({
  onClick,
  loading = false,
  variant = 'contained',
  color = 'primary',
  startIcon,
  children,
  disabled = false,
  sx = {},
}: {
  onClick: () => void;
  loading?: boolean;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  startIcon?: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  sx?: any;
}) => (
  <Button
    variant={variant}
    color={color}
    onClick={onClick}
    disabled={disabled || loading}
    startIcon={startIcon}
    sx={sx}
  >
    {loading ? 'Cargando...' : children}
  </Button>
));

// Memoizado Campo de Búsqueda
export const MemoizedSearchField = memo(({
  value,
  onChange,
  placeholder = 'Buscar...',
  loading = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}) => (
  <TextField
    fullWidth
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    disabled={loading}
    sx={{ mb: 2 }}
  />
));

// Memoizado Selector
export const MemoizedSelect = memo(({
  value,
  onChange,
  options,
  label,
  loading = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  label: string;
  loading?: boolean;
}) => (
  <FormControl fullWidth disabled={loading}>
    <InputLabel>{label}</InputLabel>
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      label={label}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
));

// Memoizado Tabla de Datos
export const MemoizedDataTable = memo(({
  columns,
  data,
  loading = false,
  onRowClick,
}: {
  columns: Array<{ key: string; label: string; width?: string }>;
  data: any[];
  loading?: boolean;
  onRowClick?: (row: any) => void;
}) => (
  <TableContainer component={Paper}>
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.key}
              sx={{ 
                fontWeight: 'bold',
                width: column.width,
                backgroundColor: '#f5f5f5',
              }}
            >
              {column.label}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 4 }}>
              Cargando datos...
            </TableCell>
          </TableRow>
        ) : data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 4 }}>
              No hay datos disponibles
            </TableCell>
          </TableRow>
        ) : (
          data.map((row, index) => (
            <TableRow
              key={row.id || index}
              hover
              onClick={() => onRowClick?.(row)}
              sx={{ 
                cursor: onRowClick ? 'pointer' : 'default',
                '&:hover': onRowClick ? {
                  backgroundColor: 'rgba(0, 128, 0, 0.04)',
                } : {},
              }}
            >
              {columns.map((column) => (
                <TableCell key={column.key}>
                  {row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  </TableContainer>
));

// Memoizado Chip de Estado
export const MemoizedStatusChip = memo(({
  status,
  variant = 'outlined',
}: {
  status: string;
  variant?: 'filled' | 'outlined';
}) => {
  const getStatusConfig = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVO':
      case 'APROBADO':
        return { color: 'success' as const, label: status };
      case 'INACTIVO':
      case 'PENDIENTE':
        return { color: 'warning' as const, label: status };
      case 'RECHAZADO':
      case 'BLOQUEADO':
        return { color: 'error' as const, label: status };
      default:
        return { color: 'default' as const, label: status };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Chip
      label={config.label}
      color={config.color}
      variant={variant}
      size="small"
    />
  );
});

// Memoizado Botón de Icono
export const MemoizedIconButton = memo(({
  onClick,
  icon,
  color = 'primary',
  disabled = false,
  loading = false,
  tooltip,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  disabled?: boolean;
  loading?: boolean;
  tooltip?: string;
}) => (
  <IconButton
    onClick={onClick}
    disabled={disabled || loading}
    color={color}
    title={tooltip}
    sx={{
      transition: 'all 0.2s ease',
      '&:hover': {
        transform: 'scale(1.1)',
      },
    }}
  >
    {icon}
  </IconButton>
));
