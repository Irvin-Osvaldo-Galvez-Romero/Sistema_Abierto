/**
 * Servicio de Créditos Complementarios
 * Maneja la lógica de subida, validación y generación de constancias
 */

import {
  EstatusCreditoComplementario,
  TipoNotificacion,
  TipoCreditoComplementario,
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
import { PDFDocument, StandardFonts, rgb, PDFFont, PDFPage } from 'pdf-lib';

interface UploadCreditoData {
  estudianteId: string;
  numero?: number; // Para actualizar un crédito rechazado existente
  tipo: TipoCreditoComplementario;
  titulo: string;
  descripcion: string;
  horasCurso?: number;
  file: Express.Multer.File;
  creditoId?: string; // Si se proporciona, es un archivo adicional para un crédito existente
}

interface GenerarConstanciaData {
  estudianteId: string;
  administradorId: string;
  fechaEmision?: string;
}

interface RevisarCreditoData {
  creditoId: string;
  administradorId: string;
  aprobado: boolean;
  motivoRechazo?: string;
  observaciones?: string;
  archivoFirmado?: Express.Multer.File;
}

export class CreditoService {
  private static readonly UPLOAD_ROOT = path.join(process.cwd(), 'uploads', 'creditos');

  /**
   * Subir crédito complementario por un estudiante
   */
  static async subirCredito(data: UploadCreditoData) {
    if (!data.file) {
      throw new ValidationError('Debes adjuntar el archivo del crédito');
    }

    if (data.file.mimetype !== 'application/pdf') {
      throw new ValidationError('El crédito debe estar en formato PDF');
    }

    if (data.file.size > 10 * 1024 * 1024) {
      throw new ValidationError('El archivo supera el tamaño máximo de 10MB');
    }

    if (!data.descripcion || data.descripcion.trim().length === 0) {
      throw new ValidationError('La descripción del crédito es requerida');
    }

    if (data.tipo !== 'CURSOS' && data.horasCurso) {
      throw new ValidationError('Las horas del curso solo aplican para créditos de tipo CURSOS');
    }

    // Si es un archivo adicional para un crédito existente
    if (data.creditoId) {
      return await this.agregarArchivoAdicional(data);
    }

    const estudiante = await prisma.estudiante.findUnique({
      where: { id: data.estudianteId },
      include: { usuario: true },
    });

    if (!estudiante) {
      throw new NotFoundError('Perfil de estudiante no encontrado');
    }

    // Si se proporciona un número de crédito, intentar actualizar ese crédito (para reemplazar rechazados)
    let numeroCredito: number;
    if (data.numero) {
      numeroCredito = data.numero;
      // Verificar si existe y si está rechazado o es el mismo número
      const existente = await prisma.creditoComplementario.findUnique({
        where: {
          estudianteId_numero: {
            estudianteId: estudiante.id,
            numero: numeroCredito,
          },
        },
        include: {
          archivosAdicionales: true,
        },
      });

      if (existente && existente.estatus !== 'RECHAZADO') {
        throw new ValidationError('Solo puedes actualizar créditos rechazados');
      }

      if (existente) {
        await this.eliminarArchivoSiExiste(existente.archivoOriginal);
        if (existente.archivoCombinado) {
          await this.eliminarArchivoSiExiste(existente.archivoCombinado);
        }
        // Eliminar archivos adicionales si existen
        if (existente.archivosAdicionales && existente.archivosAdicionales.length > 0) {
          for (const archivo of existente.archivosAdicionales) {
            await this.eliminarArchivoSiExiste(archivo.rutaArchivo);
          }
          await prisma.archivoCredito.deleteMany({
            where: { creditoId: existente.id },
          });
        }
      }
    } else {
      // Obtener el siguiente número de crédito para este estudiante
      const creditosExistentes = await prisma.creditoComplementario.findMany({
        where: { estudianteId: estudiante.id },
        orderBy: { numero: 'desc' },
        take: 1,
      });

      numeroCredito = creditosExistentes.length > 0 ? creditosExistentes[0].numero + 1 : 1;

      if (numeroCredito > 5) {
        throw new ValidationError('Ya has subido el máximo de 5 créditos complementarios');
      }
    }

    const hash = generateFileHash(data.file.buffer);
    const studentDir = path.join(this.UPLOAD_ROOT, estudiante.id);
    await fs.mkdir(studentDir, { recursive: true });

    const filename = `credito-${numeroCredito}-${data.tipo}-${Date.now()}.pdf`;
    const filepath = path.join(studentDir, filename);
    await fs.writeFile(filepath, data.file.buffer);

    const rutaRelativa = path.relative(process.cwd(), filepath).replace(/\\/g, '/');

    const credito = await prisma.creditoComplementario.upsert({
      where: {
        estudianteId_numero: {
          estudianteId: estudiante.id,
          numero: numeroCredito,
        },
      },
      update: {
        tipo: data.tipo,
        titulo: data.titulo,
        descripcion: data.descripcion,
        horasCurso: data.horasCurso ?? null,
        horasTotales: data.tipo === 'CURSOS' ? (data.horasCurso ?? 0) : null,
        archivoOriginal: rutaRelativa,
        mimeTypeOriginal: data.file.mimetype,
        tamanoOriginal: data.file.size,
        hashOriginal: hash,
        estatus: EstatusCreditoComplementario.PENDIENTE,
        motivoRechazo: null,
        observaciones: null,
        archivoValidado: null,
        archivoValidacionGenerada: null,
        mimeTypeValidado: null,
        tamanoValidado: null,
        hashValidado: null,
        revisadoPorId: null,
        fechaRevision: null,
      },
      create: {
        estudianteId: estudiante.id,
        numero: numeroCredito,
        tipo: data.tipo,
        titulo: data.titulo,
        descripcion: data.descripcion,
        horasCurso: data.horasCurso ?? null,
        horasTotales: data.tipo === 'CURSOS' ? (data.horasCurso ?? 0) : null,
        archivoOriginal: rutaRelativa,
        mimeTypeOriginal: data.file.mimetype,
        tamanoOriginal: data.file.size,
        hashOriginal: hash,
      },
    });

    await prisma.notificacion.create({
      data: {
        estudianteId: estudiante.id,
        tipo: TipoNotificacion.CREDITO_SUBIDO,
        titulo: 'Crédito complementario enviado',
        mensaje: `Tu crédito de tipo ${data.tipo} ha sido enviado y está pendiente de revisión.`,
      },
    });

    logger.info(`Crédito ${credito.numero} (${data.tipo}) subido por ${estudiante.matricula}`);

    return credito;
  }

  /**
   * Agregar archivo adicional a un crédito existente (para cursos que no cumplen 60 horas)
   */
  static async agregarArchivoAdicional(data: UploadCreditoData) {
    if (!data.creditoId) {
      throw new ValidationError('Se requiere el ID del crédito para agregar archivos adicionales');
    }

    if (!data.file) {
      throw new ValidationError('Debes adjuntar el archivo');
    }

    if (data.file.mimetype !== 'application/pdf') {
      throw new ValidationError('El archivo debe estar en formato PDF');
    }

    if (data.file.size > 10 * 1024 * 1024) {
      throw new ValidationError('El archivo supera el tamaño máximo de 10MB');
    }

    const credito = await prisma.creditoComplementario.findUnique({
      where: { id: data.creditoId },
      include: {
        estudiante: true,
        archivosAdicionales: true,
      },
    });

    if (!credito) {
      throw new NotFoundError('Crédito no encontrado');
    }

    if (credito.tipo !== 'CURSOS') {
      throw new ValidationError('Solo se pueden agregar archivos adicionales a créditos de tipo CURSOS');
    }

    if (!data.horasCurso || data.horasCurso <= 0) {
      throw new ValidationError('Debes indicar las horas de este archivo');
    }

    const hash = generateFileHash(data.file.buffer);
    const studentDir = path.join(this.UPLOAD_ROOT, credito.estudianteId);
    await fs.mkdir(studentDir, { recursive: true });

    const filename = `credito-${credito.numero}-adicional-${Date.now()}.pdf`;
    const filepath = path.join(studentDir, filename);
    await fs.writeFile(filepath, data.file.buffer);

    const rutaRelativa = path.relative(process.cwd(), filepath).replace(/\\/g, '/');

    // Crear el archivo adicional
    await prisma.archivoCredito.create({
      data: {
        creditoId: credito.id,
        horas: data.horasCurso,
        rutaArchivo: rutaRelativa,
        mimeType: data.file.mimetype,
        tamano: data.file.size,
        hash: hash,
        nombreOriginal: data.file.originalname,
      },
    });

    // Calcular horas totales (archivo original + archivos adicionales)
    const horasArchivoOriginal = credito.horasCurso || 0;
    const horasArchivosAdicionales = credito.archivosAdicionales.reduce((sum, arch) => sum + (arch.horas || 0), 0);
    const horasTotales = horasArchivoOriginal + horasArchivosAdicionales + data.horasCurso;

    // Si se alcanzan o superan las 60 horas, combinar los PDFs
    // Primero actualizar el crédito para incluir el nuevo archivo adicional
    const creditoConNuevoArchivo = await prisma.creditoComplementario.findUnique({
      where: { id: credito.id },
      include: {
        archivosAdicionales: {
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    let archivoCombinadoData: { ruta: string; mimeType: string; tamano: number; hash: string } | null = null;
    if (horasTotales >= 60 && creditoConNuevoArchivo) {
      archivoCombinadoData = await this.combinarPDFsCredito(creditoConNuevoArchivo);
    }

    // Actualizar el crédito con las horas totales y el archivo combinado si existe
    const updateData: any = {
      horasTotales: horasTotales,
    };

    if (archivoCombinadoData) {
      updateData.archivoCombinado = archivoCombinadoData.ruta;
      updateData.mimeTypeCombinado = archivoCombinadoData.mimeType;
      updateData.tamanoCombinado = archivoCombinadoData.tamano;
      updateData.hashCombinado = archivoCombinadoData.hash;
    }

    const creditoActualizado = await prisma.creditoComplementario.update({
      where: { id: credito.id },
      data: updateData,
      include: {
        archivosAdicionales: true,
      },
    });

    logger.info(`Archivo adicional agregado al crédito ${credito.numero}. Horas totales: ${horasTotales}${archivoCombinadoData ? ' - PDF combinado generado' : ''}`);

    return creditoActualizado;
  }

  /**
   * Combinar múltiples PDFs de un crédito en uno solo (solo para CURSOS)
   */
  private static async combinarPDFsCredito(credito: any): Promise<{ ruta: string; mimeType: string; tamano: number; hash: string }> {
    if (!credito) {
      throw new NotFoundError('Crédito no encontrado');
    }

    if (credito.tipo !== 'CURSOS') {
      throw new ValidationError('Solo se pueden combinar PDFs de créditos de tipo CURSOS');
    }

    const pdfCombinado = await PDFDocument.create();

    // Agregar el archivo original
    const rutaOriginal = path.join(process.cwd(), credito.archivoOriginal);
    const archivoOriginalBytes = await fs.readFile(rutaOriginal);
    const pdfOriginal = await PDFDocument.load(archivoOriginalBytes);
    const paginasOriginal = await pdfCombinado.copyPages(pdfOriginal, pdfOriginal.getPageIndices());
    paginasOriginal.forEach((pagina) => pdfCombinado.addPage(pagina));

    // Agregar los archivos adicionales
    for (const archivoAdicional of credito.archivosAdicionales) {
      const rutaAdicional = path.join(process.cwd(), archivoAdicional.rutaArchivo);
      const archivoAdicionalBytes = await fs.readFile(rutaAdicional);
      const pdfAdicional = await PDFDocument.load(archivoAdicionalBytes);
      const paginasAdicional = await pdfCombinado.copyPages(pdfAdicional, pdfAdicional.getPageIndices());
      paginasAdicional.forEach((pagina) => pdfCombinado.addPage(pagina));
    }

    // Guardar el PDF combinado
    const pdfBytes = await pdfCombinado.save();
    const hash = generateFileHash(Buffer.from(pdfBytes));

    const studentDir = path.join(this.UPLOAD_ROOT, credito.estudianteId);
    await fs.mkdir(studentDir, { recursive: true });

    const filename = `credito-${credito.numero}-combinado-${Date.now()}.pdf`;
    const filepath = path.join(studentDir, filename);
    await fs.writeFile(filepath, pdfBytes);

    const rutaRelativa = path.relative(process.cwd(), filepath).replace(/\\/g, '/');

    // Eliminar archivo combinado anterior si existe
    if (credito.archivoCombinado) {
      await this.eliminarArchivoSiExiste(credito.archivoCombinado);
    }

    return {
      ruta: rutaRelativa,
      mimeType: 'application/pdf',
      tamano: pdfBytes.length,
      hash: hash,
    };
  }

  /**
   * Obtener créditos del estudiante
   */
  static async obtenerCreditosEstudiante(estudianteId: string) {
    return prisma.creditoComplementario.findMany({
      where: { estudianteId },
      include: {
        archivosAdicionales: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { numero: 'asc' },
    });
  }

  /**
   * Listado para administradores agrupado por estudiante
   */
  static async listarCreditosAdmin(estatus?: EstatusCreditoComplementario) {
    const creditos = await prisma.creditoComplementario.findMany({
      where: estatus ? { estatus } : undefined,
      orderBy: [
        { estudianteId: 'asc' },
        { numero: 'asc' },
      ],
      include: {
        estudiante: {
          include: {
            usuario: true,
            carrera: true,
          },
        },
      },
    });

    // Agrupar por estudiante
    const agrupados = new Map<string, typeof creditos>();
    creditos.forEach((credito) => {
      const estudianteId = credito.estudianteId;
      if (!agrupados.has(estudianteId)) {
        agrupados.set(estudianteId, []);
      }
      agrupados.get(estudianteId)!.push(credito);
    });

    return Array.from(agrupados.values());
  }

  /**
   * Generar constancia en PDF para todos los créditos de un estudiante
   */
  static async generarConstancia(data: GenerarConstanciaData) {
    const estudiante = await prisma.estudiante.findUnique({
      where: { id: data.estudianteId },
      include: {
        usuario: true,
        carrera: true,
        creditos: {
          orderBy: { numero: 'asc' },
        },
      },
    });

    if (!estudiante) {
      throw new NotFoundError('Estudiante no encontrado');
    }

    if (estudiante.creditos.length === 0) {
      throw new ValidationError('El estudiante no tiene créditos registrados');
    }

    const admin = await prisma.usuario.findUnique({
      where: { id: data.administradorId },
      include: {
        administrador: true,
      },
    });

    if (!admin || (!admin.administrador && admin.rol !== 'SUPER_ADMIN')) {
      throw new AuthorizationError('Solo administradores pueden generar constancias');
    }

    // Eliminar constancias anteriores si existen
    for (const credito of estudiante.creditos) {
      if (credito.archivoValidacionGenerada) {
        await this.eliminarArchivoSiExiste(credito.archivoValidacionGenerada);
      }
    }

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 portrait
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSize = 12;
    const margin = 50;
    let cursorY = page.getHeight() - margin;

    const drawCentered = (text: string, y: number, size = fontSize, bold = false) => {
      const textWidth = (bold ? boldFont : font).widthOfTextAtSize(text, size);
      const x = (page.getWidth() - textWidth) / 2;
      page.drawText(text, {
        x,
        y,
        size,
        font: bold ? boldFont : font,
        color: rgb(0, 0, 0),
      });
    };

    drawCentered('CONSTANCIA DE ACREDITACIÓN TOTAL', cursorY, 18, true);
    cursorY -= 25;
    drawCentered('DE ACTIVIDADES COMPLEMENTARIAS', cursorY, 16, true);

    cursorY -= 40;
    const header = [
      'M. EN G.E. MIRNA MOLINA GARCÍA',
      'JEFA DEL DEPARTAMENTO DE CONTROL ESCOLAR',
    ];
    header.forEach((line) => {
      drawCentered(line, cursorY, 12, true);
      cursorY -= 18;
    });

    cursorY -= 10;
    const contenido = [
      'Sirva este medio para hacer de su conocimiento que el estudiante',
      `${estudiante.usuario.nombre} ${estudiante.usuario.apellidoPaterno ?? ''} ${estudiante.usuario.apellidoMaterno ?? ''}`.trim(),
      `con número de matrícula ${estudiante.matricula}`,
      `de la carrera de ${estudiante.carrera?.nombre ?? '---'}`,
      'ha cubierto TOTALMENTE los 5 créditos extracurriculares',
      'correspondientes a las Actividades Complementarias.',
    ];

    contenido.forEach((line) => {
      cursorY = this.drawParagraph(page, line, margin, cursorY, font, fontSize, 20) - 5;
    });

    cursorY -= 10;
    const fechaTexto = data.fechaEmision
      ? new Date(data.fechaEmision).toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('es-MX', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

    const parrafoFecha = `Se extiende la presente constancia para los fines legales y administrativos que al interesado convengan, a los ${fechaTexto}.`;
    cursorY = this.drawParagraph(page, parrafoFecha, margin, cursorY, font, fontSize, 20) - 40;

    drawCentered('ATENTAMENTE', cursorY, 12, true);
    cursorY -= 20;
    drawCentered('"TECNOLOGÍA Y CULTURA PARA EL PROGRESO"', cursorY, 12);

    cursorY -= 60;
    drawCentered('M. EN ISC. MARTHA AMPARO SOTO RODRÍGUEZ', cursorY, 12, true);
    cursorY -= 18;
    drawCentered('JEFA DE LA DIVISIÓN DE INGENIERÍA EN', cursorY, 12, true);
    cursorY -= 18;
    drawCentered('SISTEMAS COMPUTACIONALES', cursorY, 12, true);

    const pdfBytes = await pdfDoc.save();

    const validacionesDir = path.join(this.UPLOAD_ROOT, estudiante.id, 'validaciones');
    await fs.mkdir(validacionesDir, { recursive: true });

    // Generar iniciales: primera letra del nombre + primera letra del apellido paterno + (opcional) primera letra del apellido materno
    const iniciales = 
      (estudiante.usuario.nombre?.charAt(0).toUpperCase() || '') +
      (estudiante.usuario.apellidoPaterno?.charAt(0).toUpperCase() || '') +
      (estudiante.usuario.apellidoMaterno?.charAt(0).toUpperCase() || '');

    const fileName = `Kardex_${estudiante.matricula}_${iniciales}.pdf`;
    const fullPath = path.join(validacionesDir, fileName);
    await fs.writeFile(fullPath, pdfBytes);

    const rutaRelativa = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');

    // Actualizar todos los créditos del estudiante con la misma constancia
    await prisma.creditoComplementario.updateMany({
      where: { estudianteId: estudiante.id },
      data: {
        archivoValidacionGenerada: rutaRelativa,
        estatus: EstatusCreditoComplementario.EN_REVISION,
      },
    });

    await prisma.notificacion.create({
      data: {
        estudianteId: estudiante.id,
        tipo: TipoNotificacion.CREDITO_VALIDACION_GENERADA,
        titulo: 'Constancia generada',
        mensaje: 'Se ha generado la constancia de acreditación total de tus créditos complementarios. El administrador la revisará y firmará.',
      },
    });

    logger.info(`Constancia generada para estudiante ${estudiante.matricula} con ${estudiante.creditos.length} créditos`);

    return {
      estudianteId: estudiante.id,
      archivoValidacionGenerada: rutaRelativa,
      creditos: estudiante.creditos,
    };
  }

  /**
   * Revisar crédito: aprobar/rechazar y opcionalmente subir constancia firmada
   */
  static async revisarCredito(data: RevisarCreditoData) {
    const credito = await prisma.creditoComplementario.findUnique({
      where: { id: data.creditoId },
      include: {
        estudiante: {
          include: { usuario: true },
        },
      },
    });

    if (!credito) {
      throw new NotFoundError('Crédito no encontrado');
    }

    if (data.archivoFirmado && data.archivoFirmado.mimetype !== 'application/pdf') {
      throw new ValidationError('La constancia firmada debe estar en PDF');
    }

    const updates: any = {
      estatus: data.aprobado ? EstatusCreditoComplementario.VALIDADO : EstatusCreditoComplementario.RECHAZADO,
      motivoRechazo: data.aprobado ? null : data.motivoRechazo ?? null,
      observaciones: data.observaciones ?? null,
      revisadoPorId: data.administradorId,
      fechaRevision: new Date(),
    };

    if (data.aprobado && data.archivoFirmado) {
      if (credito.archivoValidado) {
        await this.eliminarArchivoSiExiste(credito.archivoValidado);
      }

      const directorio = path.join(this.UPLOAD_ROOT, credito.estudianteId, 'validaciones');
      await fs.mkdir(directorio, { recursive: true });
      
      // Generar iniciales: primera letra del nombre + primera letra del apellido paterno + (opcional) primera letra del apellido materno
      const iniciales = 
        (credito.estudiante.usuario.nombre?.charAt(0).toUpperCase() || '') +
        (credito.estudiante.usuario.apellidoPaterno?.charAt(0).toUpperCase() || '') +
        (credito.estudiante.usuario.apellidoMaterno?.charAt(0).toUpperCase() || '');
      
      const filename = `Kardex_${credito.estudiante.matricula}_${iniciales}.pdf`;
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

    const actualizado = await prisma.creditoComplementario.update({
      where: { id: credito.id },
      data: updates,
    });

    await prisma.notificacion.create({
      data: {
        estudianteId: credito.estudianteId,
        tipo: data.aprobado ? TipoNotificacion.CREDITO_VALIDADO : TipoNotificacion.CREDITO_RECHAZADO,
        titulo: data.aprobado ? 'Crédito complementario validado' : 'Crédito complementario rechazado',
        mensaje: data.aprobado
          ? `Tu crédito ${credito.numero} ha sido validado. Puedes descargar la constancia firmada.`
          : `Tu crédito ${credito.numero} fue rechazado. Motivo: ${data.motivoRechazo ?? 'Sin información.'}`,
      },
    });

    logger.info(`Crédito ${credito.numero} ${data.aprobado ? 'validado' : 'rechazado'}`);

    return actualizado;
  }

  /**
   * Obtener archivo asociado a un crédito
   * Para administradores: si hay archivoCombinado (CURSOS con múltiples PDFs), devuelve ese
   * Para estudiantes: siempre devuelve el archivo original
   */
  static async obtenerArchivo(creditoId: string, tipo: 'original' | 'generado' | 'firmado', esAdministrador: boolean = false) {
    const credito = await prisma.creditoComplementario.findUnique({
      where: { id: creditoId },
    });

    if (!credito) {
      throw new NotFoundError('Crédito no encontrado');
    }

    let ruta: string | null = null;
    switch (tipo) {
      case 'original':
        // Si es administrador y hay archivo combinado (solo para CURSOS), devolver ese
        if (esAdministrador && credito.archivoCombinado && credito.tipo === 'CURSOS') {
          ruta = credito.archivoCombinado;
        } else {
          ruta = credito.archivoOriginal;
        }
        break;
      case 'generado':
        ruta = credito.archivoValidacionGenerada ?? null;
        break;
      case 'firmado':
        ruta = credito.archivoValidado ?? null;
        break;
    }

    if (!ruta) {
      throw new NotFoundError('Archivo no disponible');
    }

    const absoluta = path.join(process.cwd(), ruta);
    return absoluta;
  }

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

  private static drawParagraph(
    page: PDFPage,
    text: string,
    margin: number,
    cursorY: number,
    font: PDFFont,
    fontSize: number,
    leading: number
  ): number {
    const maxWidth = page.getWidth() - margin * 2;
    const words = text.split(' ');
    let line = '';
    let y = cursorY;

    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const lineWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (lineWidth > maxWidth) {
        page.drawText(line, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        line = word;
        y -= leading;
      } else {
        line = testLine;
      }
    }

    if (line) {
      page.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= leading;
    }

    return y;
  }
}

export default CreditoService;

