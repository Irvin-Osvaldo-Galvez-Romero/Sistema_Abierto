/**
 * Componente de Diálogo de Confirmación
 * Reutilizable para confirmar acciones importantes
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Warning,
  Error,
  Info,
  CheckCircle,
  Close,
} from '@mui/icons-material';

export interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'error' | 'info' | 'success';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning',
  loading = false,
  icon,
}) => {
  const getTypeConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: <Error sx={{ color: '#d32f2f', fontSize: 40 }} />,
          confirmColor: '#d32f2f',
          titleColor: '#d32f2f',
        };
      case 'info':
        return {
          icon: <Info sx={{ color: '#1976d2', fontSize: 40 }} />,
          confirmColor: '#1976d2',
          titleColor: '#1976d2',
        };
      case 'success':
        return {
          icon: <CheckCircle sx={{ color: '#2e7d32', fontSize: 40 }} />,
          confirmColor: '#2e7d32',
          titleColor: '#2e7d32',
        };
      default: // warning
        return {
          icon: <Warning sx={{ color: '#ed6c02', fontSize: 40 }} />,
          confirmColor: '#ed6c02',
          titleColor: '#ed6c02',
        };
    }
  };

  const config = getTypeConfig();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '200px',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {icon || config.icon}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                color: config.titleColor,
              }}
            >
              {title}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            disabled={loading}
            sx={{ color: '#666' }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 0 }}>
        <DialogContentText
          sx={{
            fontSize: '1rem',
            color: '#333',
            lineHeight: 1.6,
          }}
        >
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: '#666',
            borderColor: '#ddd',
            '&:hover': {
              borderColor: '#999',
              backgroundColor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          sx={{
            backgroundColor: config.confirmColor,
            '&:hover': {
              backgroundColor: config.confirmColor,
              opacity: 0.9,
            },
            '&:disabled': {
              backgroundColor: '#ccc',
            },
          }}
        >
          {loading ? 'Procesando...' : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
