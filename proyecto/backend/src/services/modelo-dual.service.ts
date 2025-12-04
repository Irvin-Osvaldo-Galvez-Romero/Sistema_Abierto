/**
 * Servicio de Modelo Dual
 * Maneja la lógica de subida, validación y gestión de pruebas psicológicas
 */

import {
  EstatusPruebaModeloDual,
  TipoPruebaModeloDual,
  TipoNotificacion,
} from '@prisma/client';
import { prisma } from '../config/database';
import {
  ValidationError,
  NotFoundError,
  AuthorizationError,
} from '../utils/errors';
import { generateFileHash } from '../utils/crypto';
import logger from '../utils/logger';
import fs from 'fs/promises';
import path from 'path';

interface SubirPruebaData {
  estudianteId: string;
  tipoPrueba: TipoPruebaModeloDual;
  nombrePrueba: string;
  descripcion?: string;
  fechaAplicacion?: Date;
  fechaVencimiento?: Date;
  resultado?: string;
  puntuacion?: number;
  interpretacion?: string;
  recomendaciones?: string;
  file: Express.Multer.File;
}

interface RevisarPruebaData {
  pruebaId: string;
  administradorId: string;
  aprobado: boolean;
  motivoRechazo?: string;
  observaciones?: string;
  archivoFirmado?: Express.Multer.File;
}

export class ModeloDualService {
  private static readonly UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'modelo-dual');

  /**
   * Subir prueba psicológica del Modelo Dual
   */
  static async subirPrueba(data: SubirPruebaData) {
    if (!data.file) {
      throw new ValidationError('Debes adjuntar el archivo de la prueba');
    }

    if (data.file.mimetype !== 'application/pdf') {
      throw new ValidationError('La prueba debe estar en formato PDF');
    }

    if (data.file.size > 10 * 1024 * 1024) {
      throw new ValidationError('El archivo supera el tamaño máximo de 10MB');
    }

    if (!data.nombrePrueba || data.nombrePrueba.trim().length === 0) {
      throw new ValidationError('El nombre de la prueba es requerido');
    }

    const estudiante = await prisma.estudiante.findUnique({
      where: { id: data.estudianteId },
      include: { usuario: true },
    });

    if (!estudiante) {
      throw new NotFoundError('Perfil de estudiante no encontrado');
    }

    const hash = generateFileHash(data.file.buffer);
    const studentDir = path.join(this.UPLOAD_ROOT, estudiante.id);
    await fs.mkdir(studentDir, { recursive: true });

    const filename = `prueba-${data.tipoPrueba}-${Date.now()}.pdf`;
    const filepath = path.join(studentDir, filename);
    await fs.writeFile(filepath, data.file.buffer);

    const rutaRelativa = path.relative(process.cwd(), filepath).replace(/\\/g, '/');

    const prueba = await prisma.pruebaModeloDual.create({
      data: {
        estudianteId: estudiante.id,
        tipoPrueba: data.tipoPrueba,
        nombrePrueba: data.nombrePrueba.trim(),
        descripcion: data.descripcion?.trim() || null,
        fechaAplicacion: data.fechaAplicacion || null,
        fechaVencimiento: data.fechaVencimiento || null,
        resultado: data.resultado || null,
        puntuacion: data.puntuacion || null,
        interpretacion: data.interpretacion || null,
        recomendaciones: data.recomendaciones || null,
        archivoOriginal: rutaRelativa,
        mimeTypeOriginal: data.file.mimetype,
        tamanoOriginal: data.file.size,
        hashOriginal: hash,
        estatus: EstatusPruebaModeloDual.PENDIENTE,
      },
    });

    await prisma.notificacion.create({
      data: {
        estudianteId: estudiante.id,
        tipo: TipoNotificacion.PRUEBA_MODELO_DUAL_SUBIDA,
        titulo: 'Prueba psicológica enviada',
        mensaje: `Tu prueba "${data.nombrePrueba}" ha sido enviada y está pendiente de revisión.`,
      },
    });

    logger.info(`Prueba Modelo Dual "${data.nombrePrueba}" subida por ${estudiante.matricula}`);

    return prueba;
  }

  /**
   * Obtener pruebas del estudiante
   */
  static async obtenerPruebasEstudiante(estudianteId: string) {
    return prisma.pruebaModeloDual.findMany({
      where: { estudianteId },
      orderBy: { createdAt: 'desc' },
      include: {
        revisadoPor: {
          select: {
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true,
          },
        },
      },
    });
  }

  /**
   * Listado para administradores
   */
  static async listarPruebasAdmin(estatus?: EstatusPruebaModeloDual, tipoPrueba?: TipoPruebaModeloDual) {
    const where: any = {};
    
    if (estatus) {
      where.estatus = estatus;
    }
    
    if (tipoPrueba) {
      where.tipoPrueba = tipoPrueba;
    }

    return prisma.pruebaModeloDual.findMany({
      where,
      orderBy: [
        { createdAt: 'desc' },
      ],
      include: {
        estudiante: {
          include: {
            usuario: {
              select: {
                nombre: true,
                apellidoPaterno: true,
                apellidoMaterno: true,
                email: true,
              },
            },
            carrera: {
              select: {
                nombre: true,
                clave: true,
              },
            },
          },
        },
        revisadoPor: {
          select: {
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true,
          },
        },
      },
    });
  }

  /**
   * Revisar prueba: aprobar/rechazar y opcionalmente subir archivo firmado
   */
  static async revisarPrueba(data: RevisarPruebaData) {
    const prueba = await prisma.pruebaModeloDual.findUnique({
      where: { id: data.pruebaId },
      include: {
        estudiante: {
          include: { usuario: true },
        },
      },
    });

    if (!prueba) {
      throw new NotFoundError('Prueba no encontrada');
    }

    if (data.archivoFirmado && data.archivoFirmado.mimetype !== 'application/pdf') {
      throw new ValidationError('El archivo firmado debe estar en formato PDF');
    }

    const updates: any = {
      estatus: data.aprobado ? EstatusPruebaModeloDual.APROBADA : EstatusPruebaModeloDual.RECHAZADA,
      motivoRechazo: data.aprobado ? null : data.motivoRechazo ?? null,
      observaciones: data.observaciones ?? null,
      revisadoPorId: data.administradorId,
      fechaRevision: new Date(),
    };

    if (data.aprobado && data.archivoFirmado) {
      if (prueba.archivoValidado) {
        await this.eliminarArchivoSiExiste(prueba.archivoValidado);
      }

      const directorio = path.join(this.UPLOAD_ROOT, prueba.estudianteId, 'validados');
      await fs.mkdir(directorio, { recursive: true });
      
      const filename = `prueba-validada-${prueba.id}-${Date.now()}.pdf`;
      const fullpath = path.join(directorio, filename);
      await fs.writeFile(fullpath, data.archivoFirmado.buffer);

      const rutaRelativa = path.relative(process.cwd(), fullpath).replace(/\\/g, '/');
      updates.archivoValidado = rutaRelativa;
      updates.mimeTypeValidado = data.archivoFirmado.mimetype;
      updates.tamanoValidado = data.archivoFirmado.size;
      updates.hashValidado = generateFileHash(data.archivoFirmado.buffer);
    }

    if (!data.aprobado) {
      updates.archivoValidado = null;
      updates.mimeTypeValidado = null;
      updates.tamanoValidado = null;
      updates.hashValidado = null;
    }

    const actualizado = await prisma.pruebaModeloDual.update({
      where: { id: prueba.id },
      data: updates,
    });

    await prisma.notificacion.create({
      data: {
        estudianteId: prueba.estudianteId,
        tipo: data.aprobado ? TipoNotificacion.PRUEBA_MODELO_DUAL_APROBADA : TipoNotificacion.PRUEBA_MODELO_DUAL_RECHAZADA,
        titulo: data.aprobado ? 'Prueba psicológica aprobada' : 'Prueba psicológica rechazada',
        mensaje: data.aprobado
          ? `Tu prueba "${prueba.nombrePrueba}" ha sido aprobada. Puedes descargar el archivo validado.`
          : `Tu prueba "${prueba.nombrePrueba}" fue rechazada. Motivo: ${data.motivoRechazo ?? 'Sin información.'}`,
      },
    });

    logger.info(`Prueba Modelo Dual "${prueba.nombrePrueba}" ${data.aprobado ? 'aprobada' : 'rechazada'}`);

    return actualizado;
  }

  /**
   * Obtener archivo asociado a una prueba
   */
  static async obtenerArchivo(pruebaId: string, tipo: 'original' | 'validado') {
    const prueba = await prisma.pruebaModeloDual.findUnique({
      where: { id: pruebaId },
    });

    if (!prueba) {
      throw new NotFoundError('Prueba no encontrada');
    }

    let ruta: string | null = null;
    switch (tipo) {
      case 'original':
        ruta = prueba.archivoOriginal;
        break;
      case 'validado':
        ruta = prueba.archivoValidado ?? null;
        break;
    }

    if (!ruta) {
      throw new NotFoundError('Archivo no disponible');
    }

    const absoluta = path.join(process.cwd(), ruta);
    return absoluta;
  }

  /**
   * Eliminar archivo si existe
   */
  private static async eliminarArchivoSiExiste(rutaRelativa?: string | null) {
    if (!rutaRelativa) return;

    const absoluta = path.join(process.cwd(), rutaRelativa);
    try {
      await fs.unlink(absoluta);
    } catch (error: any) {
      if (error.code !== 'ENOENT') {
        logger.warn(`No se pudo eliminar archivo ${absoluta}: ${error.message}`);
      }
    }
  }

  /**
   * Obtener formatos disponibles para descarga
   */
  static async obtenerFormatos() {
    return prisma.formatoModeloDual.findMany({
      where: { activo: true },
      orderBy: { orden: 'asc' },
      include: {
        creadoPor: {
          select: {
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true,
          },
        },
      },
    });
  }

  /**
   * Crear o actualizar formato (administrador)
   */
  static async crearFormato(data: {
    nombre: string;
    descripcion?: string;
    tipo: string;
    urlDescarga?: string;
    qrCode?: string;
    archivoLocal?: Express.Multer.File;
    orden?: number;
    creadoPorId: string;
  }) {
    let rutaArchivo: string | null = null;
    let mimeType: string | null = null;
    let tamano: number | null = null;

    if (data.archivoLocal) {
      const hash = generateFileHash(data.archivoLocal.buffer);
      const formatosDir = path.join(process.cwd(), 'uploads', 'formatos-modelo-dual');
      await fs.mkdir(formatosDir, { recursive: true });

      const filename = `formato-${Date.now()}${path.extname(data.archivoLocal.originalname)}`;
      const filepath = path.join(formatosDir, filename);
      await fs.writeFile(filepath, data.archivoLocal.buffer);

      rutaArchivo = path.relative(process.cwd(), filepath).replace(/\\/g, '/');
      mimeType = data.archivoLocal.mimetype;
      tamano = data.archivoLocal.size;
    }

    return prisma.formatoModeloDual.create({
      data: {
        nombre: data.nombre.trim(),
        descripcion: data.descripcion?.trim() || null,
        tipo: data.tipo as any,
        urlDescarga: data.urlDescarga || null,
        qrCode: data.qrCode || null,
        archivoLocal: rutaArchivo,
        mimeType,
        tamano,
        orden: data.orden || 0,
        creadoPorId: data.creadoPorId,
      },
    });
  }

  /**
   * Obtener convenios vigentes
   */
  static async obtenerConvenios(vigentes: boolean = true) {
    return prisma.convenioModeloDual.findMany({
      where: vigentes ? { vigente: true } : undefined,
      orderBy: { nombreEmpresa: 'asc' },
      include: {
        creadoPor: {
          select: {
            nombre: true,
            apellidoPaterno: true,
            apellidoMaterno: true,
          },
        },
        estudiantes: {
          include: {
            estudiante: {
              include: {
                usuario: {
                  select: {
                    nombre: true,
                    apellidoPaterno: true,
                    apellidoMaterno: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Crear o actualizar convenio (administrador)
   */
  static async crearConvenio(data: {
    nombreEmpresa: string;
    razonSocial?: string;
    contacto?: string;
    email?: string;
    telefono?: string;
    direccion?: string;
    sector?: string;
    fechaInicio?: Date;
    fechaFin?: Date;
    descripcion?: string;
    condiciones?: string;
    urlConvenio?: string;
    qrCode?: string;
    creadoPorId: string;
  }) {
    return prisma.convenioModeloDual.create({
      data: {
        nombreEmpresa: data.nombreEmpresa.trim(),
        razonSocial: data.razonSocial?.trim() || null,
        contacto: data.contacto?.trim() || null,
        email: data.email?.trim() || null,
        telefono: data.telefono?.trim() || null,
        direccion: data.direccion?.trim() || null,
        sector: data.sector?.trim() || null,
        fechaInicio: data.fechaInicio || null,
        fechaFin: data.fechaFin || null,
        descripcion: data.descripcion?.trim() || null,
        condiciones: data.condiciones?.trim() || null,
        urlConvenio: data.urlConvenio || null,
        qrCode: data.qrCode || null,
        creadoPorId: data.creadoPorId,
      },
    });
  }

  /**
   * Inscribir estudiante al Modelo Dual
   */
  static async inscribirEstudiante(data: {
    estudianteId: string;
    tipoIngreso: string;
    periodo: string;
    convenioId?: string;
  }) {
    // Verificar si ya está inscrito
    const existente = await prisma.estudianteModeloDual.findUnique({
      where: { estudianteId: data.estudianteId },
    });

    if (existente) {
      throw new ValidationError('El estudiante ya está inscrito en el Modelo Dual');
    }

    return prisma.estudianteModeloDual.create({
      data: {
        estudianteId: data.estudianteId,
        tipoIngreso: data.tipoIngreso as any,
        periodo: data.periodo,
        convenioId: data.convenioId || null,
        estatus: 'EN_PROCESO',
      },
      include: {
        estudiante: {
          include: {
            usuario: true,
            carrera: true,
          },
        },
        convenio: true,
      },
    });
  }

  /**
   * Obtener información del Modelo Dual del estudiante
   */
  static async obtenerInfoEstudiante(estudianteId: string) {
    return prisma.estudianteModeloDual.findUnique({
      where: { estudianteId },
      include: {
        estudiante: {
          include: {
            usuario: true,
            carrera: true,
          },
        },
        convenio: true,
        pruebas: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  /**
   * Listar todos los estudiantes del Modelo Dual (administrador)
   */
  static async listarEstudiantes(filtro?: { estatus?: string; periodo?: string }) {
    const where: any = {};
    if (filtro?.estatus) {
      where.estatus = filtro.estatus;
    }
    if (filtro?.periodo) {
      where.periodo = filtro.periodo;
    }

    return prisma.estudianteModeloDual.findMany({
      where,
      include: {
        estudiante: {
          include: {
            usuario: true,
            carrera: true,
          },
        },
        convenio: true,
        pruebas: {
          where: { estatus: 'APROBADA' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}

export default ModeloDualService;

