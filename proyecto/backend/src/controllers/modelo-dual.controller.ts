/**
 * Controlador de Modelo Dual
 */

import { Request, Response, NextFunction } from 'express';
import ModeloDualService from '../services/modelo-dual.service';
import { prisma } from '../config/database';
import { EstatusPruebaModeloDual, TipoPruebaModeloDual, Rol } from '@prisma/client';
import { AuthorizationError, ValidationError } from '../utils/errors';
import fs from 'fs';

export class ModeloDualController {
  /**
   * POST /api/modelo-dual
   * Subir prueba psicológica (estudiante)
   */
  static async subirPrueba(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      const estudiante = await prisma.estudiante.findUnique({
        where: { usuarioId: req.user.userId },
      });

      if (!estudiante) {
        res.status(404).json({ success: false, message: 'No se encontró el perfil de estudiante' });
        return;
      }

      const { tipoPrueba, nombrePrueba, descripcion, fechaAplicacion, fechaVencimiento, resultado, puntuacion, interpretacion, recomendaciones } = req.body;

      if (!tipoPrueba || !Object.values(TipoPruebaModeloDual).includes(tipoPrueba)) {
        throw new ValidationError('Debes indicar un tipo de prueba válido');
      }

      if (!nombrePrueba || nombrePrueba.trim().length === 0) {
        throw new ValidationError('El nombre de la prueba es requerido');
      }

      const prueba = await ModeloDualService.subirPrueba({
        estudianteId: estudiante.id,
        tipoPrueba: tipoPrueba as TipoPruebaModeloDual,
        nombrePrueba: nombrePrueba.trim(),
        descripcion: descripcion?.trim(),
        fechaAplicacion: fechaAplicacion ? new Date(fechaAplicacion) : undefined,
        fechaVencimiento: fechaVencimiento ? new Date(fechaVencimiento) : undefined,
        resultado: resultado || undefined,
        puntuacion: puntuacion ? Number(puntuacion) : undefined,
        interpretacion: interpretacion || undefined,
        recomendaciones: recomendaciones || undefined,
        file: req.file as Express.Multer.File,
      });

      res.status(201).json({
        success: true,
        message: 'Prueba enviada correctamente',
        data: prueba,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/modelo-dual/mis
   * Obtener las pruebas del estudiante autenticado
   */
  static async getMisPruebas(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      const estudiante = await prisma.estudiante.findUnique({
        where: { usuarioId: req.user.userId },
      });

      if (!estudiante) {
        res.status(404).json({ success: false, message: 'No se encontró el perfil de estudiante' });
        return;
      }

      const pruebas = await ModeloDualService.obtenerPruebasEstudiante(estudiante.id);

      res.status(200).json({
        success: true,
        data: pruebas,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/modelo-dual
   * Listado para administradores
   */
  static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { estatus, tipoPrueba } = req.query;
      let filtroEstatus: EstatusPruebaModeloDual | undefined;
      let filtroTipo: TipoPruebaModeloDual | undefined;

      if (estatus && typeof estatus === 'string') {
        if (!Object.values(EstatusPruebaModeloDual).includes(estatus as EstatusPruebaModeloDual)) {
          throw new ValidationError(`Estatus inválido: ${estatus}`);
        }
        filtroEstatus = estatus as EstatusPruebaModeloDual;
      }

      if (tipoPrueba && typeof tipoPrueba === 'string') {
        if (!Object.values(TipoPruebaModeloDual).includes(tipoPrueba as TipoPruebaModeloDual)) {
          throw new ValidationError(`Tipo de prueba inválido: ${tipoPrueba}`);
        }
        filtroTipo = tipoPrueba as TipoPruebaModeloDual;
      }

      const pruebas = await ModeloDualService.listarPruebasAdmin(filtroEstatus, filtroTipo);

      res.status(200).json({
        success: true,
        data: pruebas,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/modelo-dual/:id/revision
   * Aprobar/Rechazar prueba
   */
  static async revisar(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      const { aprobado, motivoRechazo, observaciones } = req.body;

      // Convertir string a booleano si es necesario (FormData envía strings)
      let aprobadoBoolean: boolean;
      if (typeof aprobado === 'string') {
        aprobadoBoolean = aprobado.toLowerCase() === 'true';
      } else if (typeof aprobado === 'boolean') {
        aprobadoBoolean = aprobado;
      } else {
        throw new ValidationError('El campo "aprobado" es requerido y debe ser booleano o string "true"/"false"');
      }

      if (!aprobadoBoolean && !motivoRechazo) {
        throw new ValidationError('Debes indicar el motivo de rechazo');
      }

      const prueba = await ModeloDualService.revisarPrueba({
        pruebaId: req.params.id,
        administradorId: req.user.userId,
        aprobado: aprobadoBoolean,
        motivoRechazo,
        observaciones,
        archivoFirmado: req.file as Express.Multer.File | undefined,
      });

      res.status(200).json({
        success: true,
        message: aprobadoBoolean
          ? 'Prueba aprobada y archivo validado actualizado'
          : 'Prueba rechazada correctamente',
        data: prueba,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/modelo-dual/:id/archivo?tipo=original|validado
   */
  static async descargarArchivo(req: Request, res: Response, next: NextFunction) {
    try {
      const tipo = req.query.tipo;

      if (!tipo || typeof tipo !== 'string') {
        throw new ValidationError('Debes indicar el tipo de archivo a descargar');
      }

      if (!['original', 'validado'].includes(tipo)) {
        throw new ValidationError('Tipo de archivo inválido');
      }

      const prueba = await prisma.pruebaModeloDual.findUnique({
        where: { id: req.params.id },
        include: {
          estudiante: {
            include: {
              usuario: {
                select: {
                  nombre: true,
                  apellidoPaterno: true,
                  apellidoMaterno: true,
                },
              },
            },
          },
        },
      });

      if (!prueba) {
        res.status(404).send('Prueba no encontrada');
        return;
      }

      if (!req.user) {
        throw new AuthorizationError('No autenticado');
      }

      const rolesAdministrativos: Rol[] = [Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO];
      let esAdministrador = false;

      if (req.user.rol === 'ESTUDIANTE') {
        const estudiante = await prisma.estudiante.findUnique({
          where: { usuarioId: req.user.userId },
          select: { id: true },
        });

        if (!estudiante || estudiante.id !== prueba.estudianteId) {
          throw new AuthorizationError('No puedes acceder a este archivo');
        }

        if (tipo === 'validado' && prueba.estatus !== 'APROBADA') {
          throw new AuthorizationError('Solo puedes descargar archivos validados de pruebas aprobadas');
        }
      } else {
        if (!rolesAdministrativos.includes(req.user.rol as Rol)) {
          throw new AuthorizationError('No tienes permisos para acceder a este archivo');
        }
        esAdministrador = true;
      }

      const ruta = await ModeloDualService.obtenerArchivo(req.params.id, tipo as 'original' | 'validado');

      if (!fs.existsSync(ruta)) {
        res.status(404).send('Archivo no encontrado');
        return;
      }

      // Generar nombre de archivo personalizado
      const estudiante = prueba.estudiante;
      const matricula = estudiante.matricula;
      
      const iniciales = 
        (estudiante.usuario.nombre?.charAt(0).toUpperCase() || '') +
        (estudiante.usuario.apellidoPaterno?.charAt(0).toUpperCase() || '') +
        (estudiante.usuario.apellidoMaterno?.charAt(0).toUpperCase() || '');

      const tipoArchivo = tipo === 'validado' ? 'Prueba_Validada' : 'Prueba_Original';
      const nombreArchivo = `${tipoArchivo}_${prueba.nombrePrueba.replace(/[^a-zA-Z0-9]/g, '_')}_${matricula}_${iniciales}.pdf`;
      
      res.download(ruta, nombreArchivo);
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/modelo-dual/formatos
   * Obtener formatos disponibles
   */
  static async obtenerFormatos(req: Request, res: Response, next: NextFunction) {
    try {
      const formatos = await ModeloDualService.obtenerFormatos();
      res.status(200).json({
        success: true,
        data: formatos,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/modelo-dual/formatos
   * Crear formato (administrador)
   */
  static async crearFormato(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      const { nombre, descripcion, tipo, urlDescarga, qrCode, orden } = req.body;

      if (!nombre || nombre.trim().length === 0) {
        throw new ValidationError('El nombre del formato es requerido');
      }

      const formato = await ModeloDualService.crearFormato({
        nombre: nombre.trim(),
        descripcion: descripcion?.trim(),
        tipo,
        urlDescarga: urlDescarga || undefined,
        qrCode: qrCode || undefined,
        archivoLocal: req.file as Express.Multer.File | undefined,
        orden: orden ? Number(orden) : undefined,
        creadoPorId: req.user.userId,
      });

      res.status(201).json({
        success: true,
        message: 'Formato creado correctamente',
        data: formato,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/modelo-dual/convenios
   * Obtener convenios vigentes
   */
  static async obtenerConvenios(req: Request, res: Response, next: NextFunction) {
    try {
      const { vigentes } = req.query;
      const soloVigentes = vigentes === 'false' ? false : true;
      const convenios = await ModeloDualService.obtenerConvenios(soloVigentes);
      res.status(200).json({
        success: true,
        data: convenios,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/modelo-dual/convenios
   * Crear convenio (administrador)
   */
  static async crearConvenio(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      const { nombreEmpresa, razonSocial, contacto, email, telefono, direccion, sector, fechaInicio, fechaFin, descripcion, condiciones, urlConvenio, qrCode } = req.body;

      if (!nombreEmpresa || nombreEmpresa.trim().length === 0) {
        throw new ValidationError('El nombre de la empresa es requerido');
      }

      const convenio = await ModeloDualService.crearConvenio({
        nombreEmpresa: nombreEmpresa.trim(),
        razonSocial: razonSocial?.trim(),
        contacto: contacto?.trim(),
        email: email?.trim(),
        telefono: telefono?.trim(),
        direccion: direccion?.trim(),
        sector: sector?.trim(),
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
        fechaFin: fechaFin ? new Date(fechaFin) : undefined,
        descripcion: descripcion?.trim(),
        condiciones: condiciones?.trim(),
        urlConvenio: urlConvenio || undefined,
        qrCode: qrCode || undefined,
        creadoPorId: req.user.userId,
      });

      res.status(201).json({
        success: true,
        message: 'Convenio creado correctamente',
        data: convenio,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/modelo-dual/inscribir
   * Inscribir estudiante al Modelo Dual
   */
  static async inscribirEstudiante(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      const estudiante = await prisma.estudiante.findUnique({
        where: { usuarioId: req.user.userId },
      });

      if (!estudiante) {
        res.status(404).json({ success: false, message: 'No se encontró el perfil de estudiante' });
        return;
      }

      const { tipoIngreso, periodo, convenioId } = req.body;

      if (!tipoIngreso || !['NUEVO_INGRESO', 'RENOVACION'].includes(tipoIngreso)) {
        throw new ValidationError('Tipo de ingreso inválido');
      }

      if (!periodo || periodo.trim().length === 0) {
        throw new ValidationError('El periodo es requerido');
      }

      const inscripcion = await ModeloDualService.inscribirEstudiante({
        estudianteId: estudiante.id,
        tipoIngreso,
        periodo: periodo.trim(),
        convenioId: convenioId || undefined,
      });

      res.status(201).json({
        success: true,
        message: 'Inscripción al Modelo Dual realizada correctamente',
        data: inscripcion,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/modelo-dual/mi-proceso
   * Obtener información del proceso del estudiante
   */
  static async getMiProceso(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      const estudiante = await prisma.estudiante.findUnique({
        where: { usuarioId: req.user.userId },
      });

      if (!estudiante) {
        res.status(404).json({ success: false, message: 'No se encontró el perfil de estudiante' });
        return;
      }

      const proceso = await ModeloDualService.obtenerInfoEstudiante(estudiante.id);

      res.status(200).json({
        success: true,
        data: proceso,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/modelo-dual/estudiantes
   * Listar estudiantes del Modelo Dual (administrador)
   */
  static async listarEstudiantes(req: Request, res: Response, next: NextFunction) {
    try {
      const { estatus, periodo } = req.query;
      const estudiantes = await ModeloDualService.listarEstudiantes({
        estatus: estatus as string | undefined,
        periodo: periodo as string | undefined,
      });

      res.status(200).json({
        success: true,
        data: estudiantes,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/modelo-dual/convenios/importar
   * Importar convenios desde archivo Excel (administrador)
   */
  static async importarConvenios(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      if (!req.file) {
        throw new ValidationError('Debes proporcionar un archivo Excel');
      }

      const resultado = await ModeloDualService.importarConveniosDesdeExcel({
        archivo: req.file,
        creadoPorId: req.user.userId,
      });

      res.status(200).json({
        success: true,
        message: `Se importaron ${resultado.importados} de ${resultado.total} convenios correctamente${resultado.errores > 0 ? `. ${resultado.errores} errores.` : ''}`,
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ModeloDualController;

