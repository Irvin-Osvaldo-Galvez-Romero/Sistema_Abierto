/**
 * Middleware de Upload
 * Configuración de Multer para subida de archivos
 */

import multer from 'multer';
import { ValidationError } from '../utils/errors';

// Configurar almacenamiento en memoria
const storage = multer.memoryStorage();

// Filtro de archivos
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Tipos MIME permitidos
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new ValidationError('Solo se permiten archivos PDF o imágenes (JPG, PNG)'));
  }
};

// Configuración de Multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export default upload;

