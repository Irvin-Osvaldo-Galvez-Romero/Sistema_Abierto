/**
 * Componente principal de la aplicación
 * Configuración de rutas y providers
 */

import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CircularProgress, Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Loading component
const LoadingSpinner = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5',
    }}
  >
    <CircularProgress sx={{ color: '#008000' }} />
  </Box>
);

// Lazy loading de páginas para mejor performance
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const ChangePasswordPage = lazy(() => import('./pages/ChangePasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const UploadDocumentsPage = lazy(() => import('./pages/UploadDocumentsPage'));
const NotificationsPage = lazy(() => import('./pages/NotificationsPage'));
const AdminDashboardPage = lazy(() => import('./pages/AdminDashboardPage'));
const AdminStudentsPage = lazy(() => import('./pages/AdminStudentsPage'));
const AdminStudentDetailPage = lazy(() => import('./pages/AdminStudentDetailPage'));
const AdminProfessorsPage = lazy(() => import('./pages/AdminProfessorsPage'));
const AdminDocumentsPage = lazy(() => import('./pages/AdminDocumentsPage'));
const AdminNewStudentPage = lazy(() => import('./pages/AdminNewStudentPage'));
const AdminNewProfessorPage = lazy(() => import('./pages/AdminNewProfessorPage'));
const StudentCreditsPage = lazy(() => import('./pages/StudentCreditsPage'));
const AdminCreditsPage = lazy(() => import('./pages/AdminCreditsPage'));
const StudentModeloDualPage = lazy(() => import('./pages/StudentModeloDualPage'));
const AdminModeloDualPage = lazy(() => import('./pages/AdminModeloDualPage'));

// Tema personalizado con colores de la universidad
const theme = createTheme({
  palette: {
    primary: {
      main: '#008000',      // Verde
      light: '#00A000',     // Verde claro
      dark: '#006000',      // Verde oscuro
      contrastText: '#FFFFFF', // Blanco
    },
    secondary: {
      main: '#333333',      // Gris oscuro
      light: '#888888',     // Gris medio
      dark: '#000000',      // Negro
      contrastText: '#FFFFFF', // Blanco
    },
    background: {
      default: '#FFFFFF',   // Blanco
      paper: '#FFFFFF',     // Blanco
    },
    text: {
      primary: '#000000',   // Negro
      secondary: '#333333', // Gris oscuro
    },
    success: {
      main: '#008000',      // Verde
    },
    error: {
      main: '#CC0000',      // Rojo para errores
    },
    warning: {
      main: '#FFA500',      // Naranja para advertencias
    },
    info: {
      main: '#333333',      // Gris oscuro
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
      },
    },
  },
});

// Componente de ruta protegida
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { loadUser, isAuthenticated } = useAuthStore();

  // Cargar usuario al iniciar la aplicación
  useEffect(() => {
    if (isAuthenticated) {
      loadUser();
    }
  }, [isAuthenticated, loadUser]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            
            {/* Cambio de contraseña (requiere auth) */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePasswordPage />
                </ProtectedRoute>
              }
            />
          
          {/* Rutas protegidas */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/documentos"
            element={
              <ProtectedRoute>
                <UploadDocumentsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/creditos"
            element={
              <ProtectedRoute>
                <StudentCreditsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/notificaciones"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          
          {/* Rutas de Administrador */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/estudiantes"
            element={
              <ProtectedRoute>
                <AdminStudentsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/estudiante/:id"
            element={
              <ProtectedRoute>
                <AdminStudentDetailPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/docentes"
            element={
              <ProtectedRoute>
                <AdminProfessorsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/documentos"
            element={
              <ProtectedRoute>
                <AdminDocumentsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/creditos"
            element={
              <ProtectedRoute>
                <AdminCreditsPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/modelo-dual"
            element={
              <ProtectedRoute>
                <StudentModeloDualPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/modelo-dual"
            element={
              <ProtectedRoute>
                <AdminModeloDualPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/nuevo-estudiante"
            element={
              <ProtectedRoute>
                <AdminNewStudentPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/admin/nuevo-docente"
            element={
              <ProtectedRoute>
                <AdminNewProfessorPage />
              </ProtectedRoute>
            }
          />
          
            {/* Ruta por defecto */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4caf50',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#f44336',
              secondary: '#fff',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}

export default App;


