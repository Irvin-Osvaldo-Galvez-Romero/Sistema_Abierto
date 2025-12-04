/**
 * Configuración principal de Express
 * Aplicación Express con middleware y rutas
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { stream } from './utils/logger';

// Crear aplicación Express
const app: Application = express();

// ==========================================
// MIDDLEWARE DE SEGURIDAD
// ==========================================

// Helmet - seguridad headers HTTP
app.use(helmet());

// CORS - Cross-Origin Resource Sharing
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting - prevenir ataques DDoS
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// ==========================================
// MIDDLEWARE GENERAL
// ==========================================

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Morgan - HTTP request logger
app.use(morgan('combined', { stream }));

// ==========================================
// RUTAS DE SALUD
// ==========================================

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Sistema Universitario API está funcionando',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando correctamente',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// ==========================================
// RUTAS DE LA API
// ==========================================

import authRoutes from './routes/auth.routes';
import studentRoutes from './routes/student.routes';
import carreraRoutes from './routes/carrera.routes';
import materiaRoutes from './routes/materia.routes';
import documentoRoutes from './routes/documento.routes';
import calificacionRoutes from './routes/calificacion.routes';
import uploadRoutes from './routes/upload.routes';
import notificacionRoutes from './routes/notificacion.routes';
import profesorRoutes from './routes/profesor.routes';
import passwordRoutes from './routes/password.routes';
import creditoRoutes from './routes/credito.routes';

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de cambio de contraseña
app.use('/api/password', passwordRoutes);

// Rutas de estudiantes
app.use('/api/students', studentRoutes);

// Rutas de profesores
app.use('/api/profesores', profesorRoutes);

// Rutas de carreras
app.use('/api/carreras', carreraRoutes);

// Rutas de materias
app.use('/api/materias', materiaRoutes);

// Rutas de documentos
app.use('/api/documentos', documentoRoutes);

// Rutas de calificaciones
app.use('/api/calificaciones', calificacionRoutes);

// Rutas de upload de archivos
app.use('/api/upload', uploadRoutes);

// Rutas de notificaciones
app.use('/api/notificaciones', notificacionRoutes);

// Rutas de créditos complementarios
app.use('/api/creditos', creditoRoutes);

// Endpoint raíz de la API
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API del Sistema Universitario funcionando. Consulta la documentación para los endpoints disponibles.',
    endpoints: {
      auth: '/api/auth',
      estudiantes: '/api/students',
      profesores: '/api/profesores',
      documentos: '/api/documentos',
      upload: '/api/upload',
      notificaciones: '/api/notificaciones',
      creditos: '/api/creditos',
      salud: ['/health', '/api/health'],
    },
  });
});

// ==========================================
// MANEJO DE ERRORES
// ==========================================

// 404 - Ruta no encontrada
app.use(notFoundHandler);

// Error handler global
app.use(errorHandler);

export default app;

