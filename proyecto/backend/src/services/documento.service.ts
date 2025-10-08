/**
 * Servicio de Gestión de Documentos
 */

import { Documento, TipoDocumento, EstatusDocumento } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';
import { generateFileHash } from '../utils/crypto';
import logger from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';

interface CreateDocumentoData {
  tipo: TipoDocumento;
  titulo: string;
  descripcion?: string;
  rutaArchivo: string;
  tamanoBytes: number;
  mimeType: string;
  creadoPorId: string;
  estudianteIds?: string[];
}

export class DocumentoService {
  static async create(data: CreateDocumentoData, buffer: Buffer): Promise<Documento> {
    try {
      const folio = `DOC-${new Date().getFullYear()}-${uuidv4().slice(0, 8).toUpperCase()}`;
      const hashArchivo = generateFileHash(buffer);

      const documento = await prisma.documento.create({
        data: {
          folio,
          tipo: data.tipo,
          titulo: data.titulo,
          descripcion: data.descripcion,
          rutaArchivo: data.rutaArchivo,
          hashArchivo,
          tamanoBytes: data.tamanoBytes,
          mimeType: data.mimeType,
          creadoPorId: data.creadoPorId,
        },
      });

      // Asociar con estudiantes si se proporcionan
      if (data.estudianteIds && data.estudianteIds.length > 0) {
        await Promise.all(
          data.estudianteIds.map((estudianteId) =>
            prisma.documentoEstudiante.create({
              data: {
                documentoId: documento.id,
                estudianteId,
              },
            })
          )
        );
      }

      logger.info(`Documento creado: ${documento.folio}`);
      return documento;
    } catch (error) {
      logger.error('Error al crear documento:', error);
      throw error;
    }
  }

  static async findAll(
    page: number = 1,
    limit: number = 10,
    estudianteId?: string
  ): Promise<{ documentos: any[]; total: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;
      const where = estudianteId
        ? { documentosEstudiante: { some: { estudianteId } } }
        : {};

      const [documentos, total] = await Promise.all([
        prisma.documento.findMany({
          where,
          skip,
          take: limit,
          include: {
            creadoPor: {
              select: {
                nombre: true,
                apellidoPaterno: true,
                email: true,
              },
            },
            documentosEstudiante: {
              include: {
                estudiante: {
                  select: {
                    matricula: true,
                    usuario: {
                      select: {
                        nombre: true,
                        apellidoPaterno: true,
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.documento.count({ where }),
      ]);

      const pages = Math.ceil(total / limit);
      return { documentos, total, pages };
    } catch (error) {
      logger.error('Error al obtener documentos:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Documento> {
    try {
      const documento = await prisma.documento.findUnique({
        where: { id },
        include: {
          creadoPor: true,
          documentosEstudiante: {
            include: {
              estudiante: {
                include: {
                  usuario: true,
                },
              },
            },
          },
        },
      });

      if (!documento) {
        throw new NotFoundError('Documento no encontrado');
      }

      return documento as any;
    } catch (error) {
      logger.error('Error al obtener documento:', error);
      throw error;
    }
  }

  static async updateEstatus(id: string, estatus: EstatusDocumento): Promise<Documento> {
    try {
      const documento = await prisma.documento.update({
        where: { id },
        data: { estatus },
      });

      logger.info(`Documento ${documento.folio} actualizado a estatus: ${estatus}`);
      return documento;
    } catch (error) {
      logger.error('Error al actualizar estatus:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await prisma.documento.update({
        where: { id },
        data: { estatus: EstatusDocumento.ANULADO },
      });

      logger.info(`Documento anulado: ${id}`);
    } catch (error) {
      logger.error('Error al eliminar documento:', error);
      throw error;
    }
  }
}

export default DocumentoService;


