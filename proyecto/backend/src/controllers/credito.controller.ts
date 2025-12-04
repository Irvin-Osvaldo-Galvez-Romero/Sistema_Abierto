/**
 * Controlador de Créditos Complementarios
 */

import { Request, Response, NextFunction } from 'express';
import CreditoService from '../services/credito.service';
import { prisma } from '../config/database';
import { EstatusCreditoComplementario, Rol } from '@prisma/client';
import { AuthorizationError, ValidationError } from '../utils/errors';
import fs from 'fs';

export class CreditoController {
  /**
   * POST /api/creditos
   * Subir crédito complementario (estudiante)
   */
  static async uploadCredito(req: Request, res: Response, next: NextFunction) {
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

      const { numero, tipo, titulo, descripcion, horasCurso } = req.body;

      if (!tipo || !['ACTIVIDADES_EXTRACURRICULARES', 'CURSOS', 'TUTORIAS', 'ACTIVIDADES_CULTURALES'].includes(tipo)) {
        throw new ValidationError('Debes indicar un tipo de crédito válido');
      }

      if (!titulo || titulo.trim().length === 0) {
        throw new ValidationError('El título es requerido');
      }

      if (!descripcion || descripcion.trim().length === 0) {
        throw new ValidationError('La descripción es requerida');
      }

      const credito = await CreditoService.subirCredito({
        estudianteId: estudiante.id,
        numero: numero ? Number(numero) : undefined,
        tipo: tipo as 'ACTIVIDADES_EXTRACURRICULARES' | 'CURSOS' | 'TUTORIAS' | 'ACTIVIDADES_CULTURALES',
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        horasCurso: horasCurso ? Number(horasCurso) : undefined,
        file: req.file as Express.Multer.File,
      });

      res.status(201).json({
        success: true,
        message: 'Crédito enviado correctamente',
        data: credito,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/creditos/:id/archivo-adicional
   * Agregar archivo adicional a un crédito existente (para cursos)
   */
  static async agregarArchivoAdicional(req: Request, res: Response, next: NextFunction) {
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

      const { horasCurso } = req.body;

      if (!horasCurso || Number(horasCurso) <= 0) {
        throw new ValidationError('Debes indicar las horas de este archivo');
      }

      const credito = await CreditoService.agregarArchivoAdicional({
        estudianteId: estudiante.id,
        tipo: 'CURSOS', // Solo para cursos
        titulo: '',
        descripcion: '',
        horasCurso: Number(horasCurso),
        creditoId: req.params.id,
        file: req.file as Express.Multer.File,
      });

      res.status(200).json({
        success: true,
        message: 'Archivo adicional agregado correctamente',
        data: credito,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/creditos/mis
   * Obtener los créditos del estudiante autenticado
   */
  static async getMisCreditos(req: Request, res: Response, next: NextFunction) {
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

      const creditos = await CreditoService.obtenerCreditosEstudiante(estudiante.id);

      res.status(200).json({
        success: true,
        data: creditos,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/creditos
   * Listado para administradores
   */
  static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const { estatus } = req.query;
      let filtro: EstatusCreditoComplementario | undefined;

      if (estatus && typeof estatus === 'string') {
        if (!Object.values(EstatusCreditoComplementario).includes(estatus as EstatusCreditoComplementario)) {
          throw new ValidationError(`Estatus inválido: ${estatus}`);
        }
        filtro = estatus as EstatusCreditoComplementario;
      }

      const creditos = await CreditoService.listarCreditosAdmin(filtro);

      res.status(200).json({
        success: true,
        data: creditos,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/creditos/estudiante/:estudianteId/generar-acta
   * Generar constancia en PDF para todos los créditos de un estudiante
   */
  static async generarActa(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'No autenticado' });
        return;
      }

      const resultado = await CreditoService.generarConstancia({
        estudianteId: req.params.estudianteId,
        administradorId: req.user.userId,
        fechaEmision: req.body.fechaEmision,
      });

      res.status(200).json({
        success: true,
        message: 'Constancia generada correctamente',
        data: resultado,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PATCH /api/creditos/:id/revision
   * Aprobar/Rechazar crédito
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

      const credito = await CreditoService.revisarCredito({
        creditoId: req.params.id,
        administradorId: req.user.userId,
        aprobado: aprobadoBoolean,
        motivoRechazo,
        observaciones,
        archivoFirmado: req.file as Express.Multer.File | undefined,
      });

      res.status(200).json({
        success: true,
        message: aprobadoBoolean
          ? 'Crédito validado y constancia actualizada'
          : 'Crédito rechazado correctamente',
        data: credito,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/creditos/:id/archivo?tipo=original|generado|firmado
   */
  static async descargarArchivo(req: Request, res: Response, next: NextFunction) {
    try {
      const tipo = req.query.tipo;

      if (!tipo || typeof tipo !== 'string') {
        throw new ValidationError('Debes indicar el tipo de archivo a descargar');
      }

      if (!['original', 'generado', 'firmado'].includes(tipo)) {
        throw new ValidationError('Tipo de archivo inválido');
      }

      const credito = await prisma.creditoComplementario.findUnique({
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

      if (!credito) {
        res.status(404).send('Crédito no encontrado');
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

        if (!estudiante || estudiante.id !== credito.estudianteId) {
          throw new AuthorizationError('No puedes acceder a este archivo');
        }

        if (tipo !== 'original' && tipo !== 'firmado') {
          throw new AuthorizationError('Solo puedes acceder a tus archivos originales o firmados');
        }
      } else {
        if (!rolesAdministrativos.includes(req.user.rol as Rol)) {
          throw new AuthorizationError('No tienes permisos para acceder a este archivo');
        }
        esAdministrador = true;
      }

      const ruta = await CreditoService.obtenerArchivo(req.params.id, tipo as 'original' | 'generado' | 'firmado', esAdministrador);

      if (!fs.existsSync(ruta)) {
        res.status(404).send('Archivo no encontrado');
        return;
      }

      // Generar nombre de archivo personalizado para administradores
      if (esAdministrador) {
        const estudiante = credito.estudiante;
        const matricula = estudiante.matricula;
        
        // Generar iniciales: primera letra del nombre + primera letra del apellido paterno + (opcional) primera letra del apellido materno
        const iniciales = 
          (estudiante.usuario.nombre?.charAt(0).toUpperCase() || '') +
          (estudiante.usuario.apellidoPaterno?.charAt(0).toUpperCase() || '') +
          (estudiante.usuario.apellidoMaterno?.charAt(0).toUpperCase() || '');

        // Determinar el tipo de archivo según el tipo de descarga
        let tipoArchivo = 'Credito_Complementario';
        if (tipo === 'generado') {
          tipoArchivo = 'Constancia_Generada';
        } else if (tipo === 'firmado') {
          tipoArchivo = 'Constancia_Firmada';
        }

        const nombreArchivo = `${tipoArchivo}_${matricula}_${iniciales}.pdf`;
        
        res.download(ruta, nombreArchivo);
      } else {
        // Para estudiantes, usar el nombre original
        res.sendFile(ruta);
      }
    } catch (error) {
      next(error);
    }
  }
}

export default CreditoController;

