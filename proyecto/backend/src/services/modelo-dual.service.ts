/**
 * Servicio de Modelo Dual
 * Maneja la lógica de subida, validación y gestión de pruebas psicológicas
 */

import {
  EstatusPruebaModeloDual,
  TipoPruebaModeloDual,
  TipoNotificacion,
  EstatusEstudianteModeloDual,
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

export class ModeloDualService {
  private static readonly UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'modelo-dual');

  /**
   * Subir prueba psicológica (estudiante)
   */
  static async subirPrueba(data: {
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
    file?: Express.Multer.File;
  }) {
    if (!data.file) {
      throw new ValidationError('Debes adjuntar el archivo de la prueba');
    }

    if (data.file.mimetype !== 'application/pdf') {
      throw new ValidationError('La prueba debe estar en formato PDF');
    }

    if (data.file.size > 10 * 1024 * 1024) {
      throw new ValidationError('El archivo supera el tamaño máximo de 10MB');
    }

    const estudiante = await prisma.estudiante.findUnique({
      where: { id: data.estudianteId },
      include: { usuario: true },
    });

    if (!estudiante) {
      throw new NotFoundError('Estudiante no encontrado');
    }

    const hash = generateFileHash(data.file.buffer);
    const directorio = path.join(this.UPLOAD_ROOT, data.estudianteId, 'originales');
    await fs.mkdir(directorio, { recursive: true });

    const filename = `prueba-${Date.now()}.pdf`;
    const fullpath = path.join(directorio, filename);
    await fs.writeFile(fullpath, data.file.buffer);

    const rutaRelativa = path.relative(process.cwd(), fullpath).replace(/\\/g, '/');

    const prueba = await prisma.pruebaModeloDual.create({
      data: {
        estudianteId: data.estudianteId,
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
        estudianteId: data.estudianteId,
        tipo: TipoNotificacion.PRUEBA_MODELO_DUAL_SUBIDA,
        titulo: 'Prueba psicológica subida',
        mensaje: `Tu prueba "${data.nombrePrueba}" ha sido recibida y está pendiente de revisión.`,
      },
    });

    logger.info(`Prueba Modelo Dual subida: ${data.nombrePrueba} por estudiante ${estudiante.matricula}`);

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
   * Listar pruebas para administrador
   */
  static async listarPruebasAdmin(
    estatus?: EstatusPruebaModeloDual,
    tipoPrueba?: TipoPruebaModeloDual
  ) {
    const where: any = {};

    if (estatus) {
      where.estatus = estatus;
    }

    if (tipoPrueba) {
      where.tipoPrueba = tipoPrueba;
    }

    return prisma.pruebaModeloDual.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
   * Revisar prueba (aprobar/rechazar)
   */
  static async revisarPrueba(data: {
    pruebaId: string;
    administradorId: string;
    aprobado: boolean;
    motivoRechazo?: string;
    observaciones?: string;
    archivoFirmado?: Express.Multer.File;
  }) {
    const prueba = await prisma.pruebaModeloDual.findUnique({
      where: { id: data.pruebaId },
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
      // Validar tipo de archivo
      const allowedMimeTypes = [
        'application/pdf',
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      ];
      
      if (!allowedMimeTypes.includes(data.archivoLocal.mimetype)) {
        throw new ValidationError('Solo se permiten archivos PDF o Word (.doc, .docx)');
      }
      
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
    const estudiante = await prisma.estudiante.findUnique({
      where: { id: data.estudianteId },
    });

    if (!estudiante) {
      throw new NotFoundError('Estudiante no encontrado');
    }

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
        periodo: data.periodo.trim(),
        convenioId: data.convenioId || null,
        estatus: EstatusEstudianteModeloDual.EN_PROCESO,
      },
    });
  }

  /**
   * Obtener información del proceso del estudiante
   */
  static async obtenerInfoEstudiante(estudianteId: string) {
    const proceso = await prisma.estudianteModeloDual.findUnique({
      where: { estudianteId },
      include: {
        convenio: true,
        pruebas: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!proceso) {
      return null;
    }

    return proceso;
  }

  /**
   * Listar estudiantes del Modelo Dual (administrador)
   */
  static async listarEstudiantes(filtros?: {
    estatus?: string;
    periodo?: string;
  }) {
    const where: any = {};

    if (filtros?.estatus) {
      where.estatus = filtros.estatus;
    }

    if (filtros?.periodo) {
      where.periodo = filtros.periodo;
    }

    return prisma.estudianteModeloDual.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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
        convenio: {
          select: {
            id: true,
            nombreEmpresa: true,
          },
        },
      },
    });
  }

  /**
   * Importar convenios desde archivo Excel
   */
  static async importarConveniosDesdeExcel(data: {
    archivo: Express.Multer.File;
    creadoPorId: string;
  }) {
    // Validar que es un archivo Excel
    const allowedMimeTypes = [
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];
    
    if (!allowedMimeTypes.includes(data.archivo.mimetype)) {
      throw new ValidationError('Solo se permiten archivos Excel (.xls, .xlsx)');
    }

    try {
      // Importar exceljs
      const ExcelJS = require('exceljs');
      
      // Crear workbook y leer el archivo
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data.archivo.buffer);
      
      // Obtener la primera hoja
      const worksheet = workbook.worksheets[0];
      
      if (!worksheet) {
        throw new ValidationError('El archivo Excel no contiene hojas');
      }
      
      // Convertir a JSON
      const datos: any[] = [];
      const headers: string[] = [];
      
      // Leer encabezados de la primera fila
      const headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, colNumber) => {
        if (cell.value) {
          headers[colNumber - 1] = String(cell.value).trim();
        }
      });
      
      // Leer datos de las filas siguientes
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Saltar encabezados
        
        const fila: any = {};
        let tieneDatos = false;
        
        row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
          const header = headers[colNumber - 1];
          if (header) {
            let valor: any = cell.value;
            
            // Convertir fechas a string
            if (valor instanceof Date) {
              valor = valor.toISOString().split('T')[0];
            } else if (valor && typeof valor === 'object' && valor.text) {
              // Para celdas con formato rico
              valor = valor.text;
            } else if (valor !== null && valor !== undefined) {
              valor = String(valor);
            } else {
              valor = '';
            }
            
            fila[header] = valor.trim();
            if (valor.trim()) {
              tieneDatos = true;
            }
          }
        });
        
        // Solo agregar filas que tengan datos
        if (tieneDatos) {
          datos.push(fila);
        }
      });

      if (!datos || datos.length === 0) {
        throw new ValidationError('El archivo Excel está vacío o no tiene datos');
      }

      // Validar estructura esperada
      // Columnas esperadas: nombreEmpresa, razonSocial, contacto, email, telefono, direccion, sector, fechaInicio, fechaFin, descripcion, condiciones, urlConvenio, qrCode
      const conveniosCreados = [];
      const errores = [];

      for (let i = 0; i < datos.length; i++) {
        const fila = datos[i] as any;
        const numeroFila = i + 2; // +2 porque la fila 1 es el encabezado y empezamos desde 0

        try {
          // Validar que tenga nombreEmpresa (requerido)
          if (!fila.nombreEmpresa || fila.nombreEmpresa.trim() === '') {
            errores.push(`Fila ${numeroFila}: El nombre de la empresa es requerido`);
            continue;
          }

          // Parsear fechas si existen
          let fechaInicio: Date | null = null;
          let fechaFin: Date | null = null;

          if (fila.fechaInicio) {
            const fechaInicioParsed = new Date(fila.fechaInicio);
            if (!isNaN(fechaInicioParsed.getTime())) {
              fechaInicio = fechaInicioParsed;
            }
          }

          if (fila.fechaFin) {
            const fechaFinParsed = new Date(fila.fechaFin);
            if (!isNaN(fechaFinParsed.getTime())) {
              fechaFin = fechaFinParsed;
            }
          }

          // Crear el convenio
          const convenio = await prisma.convenioModeloDual.create({
            data: {
              nombreEmpresa: String(fila.nombreEmpresa || '').trim(),
              razonSocial: fila.razonSocial ? String(fila.razonSocial).trim() : null,
              contacto: fila.contacto ? String(fila.contacto).trim() : null,
              email: fila.email ? String(fila.email).trim() : null,
              telefono: fila.telefono ? String(fila.telefono).trim() : null,
              direccion: fila.direccion ? String(fila.direccion).trim() : null,
              sector: fila.sector ? String(fila.sector).trim() : null,
              fechaInicio,
              fechaFin,
              descripcion: fila.descripcion ? String(fila.descripcion).trim() : null,
              condiciones: fila.condiciones ? String(fila.condiciones).trim() : null,
              urlConvenio: fila.urlConvenio ? String(fila.urlConvenio).trim() : null,
              qrCode: fila.qrCode ? String(fila.qrCode).trim() : null,
              creadoPorId: data.creadoPorId,
            },
          });

          conveniosCreados.push(convenio);
        } catch (error: any) {
          errores.push(`Fila ${numeroFila}: ${error.message || 'Error al crear convenio'}`);
          logger.error(`Error al importar convenio en fila ${numeroFila}:`, error);
        }
      }

      logger.info(`Importación de convenios completada: ${conveniosCreados.length} creados, ${errores.length} errores`);

      return {
        importados: conveniosCreados.length,
        total: datos.length,
        errores: errores.length,
        detallesErrores: errores,
        convenios: conveniosCreados,
      };
    } catch (error: any) {
      logger.error('Error al importar convenios desde Excel:', error);
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new ValidationError(`Error al procesar el archivo Excel: ${error.message || 'Error desconocido'}`);
    }
  }
}

export default ModeloDualService;
