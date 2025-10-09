/**
 * Servicio de Upload de Archivos
 * Manejo de subida de archivos con escaneo antivirus
 */

import { TipoDocumento, EstatusDocumento, TipoNotificacion } from '@prisma/client';
import { prisma } from '../config/database';
import { ValidationError, NotFoundError } from '../utils/errors';
import { generateFileHash } from '../utils/crypto';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';

// Simulación de escaneo antivirus (en producción usar ClamAV, VirusTotal API, etc.)
const scanForVirus = async (buffer: Buffer, filename: string): Promise<{ clean: boolean; virusName?: string }> => {
  logger.info(`Escaneando archivo: ${filename}`);
  
  // Simulación de escaneo
  // En producción, integrar con:
  // - ClamAV (antivirus open source)
  // - VirusTotal API
  // - Windows Defender API
  
  // Verificar extensiones peligrosas
  const dangerousExtensions = ['.exe', '.bat', '.cmd', '.com', '.scr', '.vbs', '.js', '.jar'];
  const ext = path.extname(filename).toLowerCase();
  
  if (dangerousExtensions.includes(ext)) {
    return {
      clean: false,
      virusName: 'Extensión de archivo no permitida',
    };
  }
  
  // Verificar firmas de virus conocidos (básico)
  const bufferString = buffer.toString('hex', 0, Math.min(1000, buffer.length));
  
  // Firma MZ (ejecutables Windows)
  if (bufferString.startsWith('4d5a')) {
    return {
      clean: false,
      virusName: 'Archivo ejecutable detectado',
    };
  }
  
  // Archivo limpio
  return { clean: true };
};

interface UploadDocumentData {
  estudianteId: string;
  tipo: TipoDocumento;
  file: Express.Multer.File;
}

export class UploadService {
  /**
   * Subir documento del estudiante
   */
  static async uploadDocument(data: UploadDocumentData): Promise<any> {
    try {
      // Validar que el estudiante existe
      const estudiante = await prisma.estudiante.findUnique({
        where: { id: data.estudianteId },
        include: {
          usuario: true,
        },
      });

      if (!estudiante) {
        throw new NotFoundError('Estudiante no encontrado');
      }

      // Validar tipo de archivo
      const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
      ];

      if (!allowedMimeTypes.includes(data.file.mimetype)) {
        throw new ValidationError('Solo se permiten archivos PDF o imágenes (JPG, PNG)');
      }

      // Validar tamaño (máximo 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (data.file.size > maxSize) {
        throw new ValidationError('El archivo no debe exceder 10MB');
      }

      // Escanear archivo por virus
      const scanResult = await scanForVirus(data.file.buffer, data.file.originalname);

      if (!scanResult.clean) {
        logger.warn(`Virus detectado en archivo de ${estudiante.usuario.email}: ${scanResult.virusName}`);
        
        // Crear notificación de virus
        await prisma.notificacion.create({
          data: {
            tipo: TipoNotificacion.DOCUMENTO_RECHAZADO,
            titulo: 'Archivo Rechazado - Virus Detectado',
            mensaje: `Tu archivo "${data.file.originalname}" fue rechazado porque contiene malware: ${scanResult.virusName}. Por favor, verifica tu archivo y sube uno limpio.`,
            estudianteId: data.estudianteId,
          },
        });

        throw new ValidationError(`Archivo rechazado: ${scanResult.virusName}`);
      }

      // Generar hash del archivo
      const hashArchivo = generateFileHash(data.file.buffer);

      // Verificar si ya existe un documento del mismo tipo
      const existingDoc = await prisma.documento.findFirst({
        where: {
          documentosEstudiante: {
            some: {
              estudianteId: data.estudianteId,
            },
          },
          tipo: data.tipo,
        },
      });

      // Si existe, actualizar su estatus a ANULADO
      if (existingDoc) {
        await prisma.documento.update({
          where: { id: existingDoc.id },
          data: { estatus: EstatusDocumento.ANULADO },
        });
      }

      // Guardar archivo en disco
      const uploadDir = path.join(process.cwd(), 'uploads', data.estudianteId);
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${data.tipo}_${Date.now()}${path.extname(data.file.originalname)}`;
      const filepath = path.join(uploadDir, filename);
      await fs.writeFile(filepath, data.file.buffer);

      // Generar ruta relativa para guardar en BD
      const rutaRelativa = path.join('uploads', data.estudianteId, filename);

      // Generar folio único
      const folio = `DOC-${new Date().getFullYear()}-${uuidv4().slice(0, 8).toUpperCase()}`;

      // Crear documento en base de datos
      const documento = await prisma.documento.create({
        data: {
          folio,
          tipo: data.tipo,
          titulo: this.getTituloByTipo(data.tipo),
          rutaArchivo: rutaRelativa,
          hashArchivo,
          tamanoBytes: data.file.size,
          mimeType: data.file.mimetype,
          estatus: EstatusDocumento.PENDIENTE,
          creadoPorId: estudiante.usuarioId,
        },
      });

      // Asociar documento con estudiante
      const docEstudiante = await prisma.documentoEstudiante.create({
        data: {
          documentoId: documento.id,
          estudianteId: data.estudianteId,
          escaneoVirus: true,
          virusDetectado: false,
        },
      });

      // Crear notificación de documento subido
      await prisma.notificacion.create({
        data: {
          tipo: TipoNotificacion.DOCUMENTO_PENDIENTE,
          titulo: 'Documento Subido Exitosamente',
          mensaje: `Tu ${this.getTituloByTipo(data.tipo)} ha sido subido y está pendiente de revisión.`,
          documentoId: documento.id,
          estudianteId: data.estudianteId,
        },
      });

      logger.info(`Documento subido: ${folio} - Estudiante: ${estudiante.matricula}`);

      return {
        documento,
        docEstudiante,
        message: 'Documento subido exitosamente y está pendiente de revisión',
      };
    } catch (error) {
      logger.error('Error al subir documento:', error);
      throw error;
    }
  }

  /**
   * Obtener documentos del estudiante
   */
  static async getStudentDocuments(estudianteId: string): Promise<any> {
    try {
      const documentos = await prisma.documento.findMany({
        where: {
          documentosEstudiante: {
            some: {
              estudianteId,
            },
          },
          estatus: {
            not: EstatusDocumento.ANULADO,
          },
        },
        include: {
          documentosEstudiante: {
            where: {
              estudianteId,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Verificar qué documentos faltan
      const tiposRequeridos = [
        TipoDocumento.KARDEX,
        TipoDocumento.FICHA_REINSCRIPCION,
        TipoDocumento.COMPROBANTE_PAGO,
      ];

      const tiposSubidos = documentos.map((doc) => doc.tipo);
      const tiposFaltantes = tiposRequeridos.filter((tipo) => !tiposSubidos.includes(tipo));

      return {
        documentos,
        tiposFaltantes,
        completo: tiposFaltantes.length === 0,
      };
    } catch (error) {
      logger.error('Error al obtener documentos del estudiante:', error);
      throw error;
    }
  }

  /**
   * Aprobar o rechazar documento
   */
  static async reviewDocument(
    documentoId: string,
    aprobado: boolean,
    revisadoPor: string,
    motivoRechazo?: string
  ): Promise<void> {
    try {
      const documento = await prisma.documento.findUnique({
        where: { id: documentoId },
        include: {
          documentosEstudiante: {
            include: {
              estudiante: true,
            },
          },
        },
      });

      if (!documento) {
        throw new NotFoundError('Documento no encontrado');
      }

      const nuevoEstatus = aprobado ? EstatusDocumento.APROBADO : EstatusDocumento.RECHAZADO;

      // Actualizar documento
      await prisma.documento.update({
        where: { id: documentoId },
        data: {
          estatus: nuevoEstatus,
          validado: aprobado,
        },
      });

      // Actualizar DocumentoEstudiante
      await prisma.documentoEstudiante.updateMany({
        where: { documentoId },
        data: {
          revisadoPor,
          fechaRevision: new Date(),
          motivoRechazo: aprobado ? null : motivoRechazo,
        },
      });

      // Crear notificación para el estudiante
      const estudianteId = documento.documentosEstudiante[0]?.estudianteId;
      
      if (estudianteId) {
        await prisma.notificacion.create({
          data: {
            tipo: aprobado ? TipoNotificacion.DOCUMENTO_APROBADO : TipoNotificacion.DOCUMENTO_RECHAZADO,
            titulo: aprobado ? 'Documento Aprobado' : 'Documento Rechazado',
            mensaje: aprobado
              ? `Tu ${documento.titulo} ha sido aprobado exitosamente.`
              : `Tu ${documento.titulo} ha sido rechazado. Motivo: ${motivoRechazo}. Por favor, sube un nuevo archivo.`,
            documentoId,
            estudianteId,
          },
        });
      }

      logger.info(`Documento ${documento.folio} ${aprobado ? 'aprobado' : 'rechazado'}`);
    } catch (error) {
      logger.error('Error al revisar documento:', error);
      throw error;
    }
  }

  /**
   * Obtener título según tipo de documento
   */
  private static getTituloByTipo(tipo: TipoDocumento): string {
    const titulos: Record<TipoDocumento, string> = {
      KARDEX: 'Kardex',
      FICHA_REINSCRIPCION: 'Ficha de Reinscripción',
      COMPROBANTE_PAGO: 'Comprobante de Pago',
    };

    return titulos[tipo] || 'Documento';
  }
}

export default UploadService;

