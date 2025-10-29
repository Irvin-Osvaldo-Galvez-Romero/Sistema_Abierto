/**
 * Servicio de Gestión de Calificaciones
 */

import { Calificacion } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';
import { Decimal } from '@prisma/client/runtime/library';

interface CreateCalificacionData {
  calificacion: number;
  estatus: string;
  observaciones?: string;
  estudianteId: string;
  materiaId: string;
  inscripcionId: string;
}

export class CalificacionService {
  static async create(data: CreateCalificacionData): Promise<Calificacion> {
    try {
      // Validar que la calificación esté en rango válido
      if (data.calificacion < 0 || data.calificacion > 10) {
        throw new ValidationError('La calificación debe estar entre 0 y 10');
      }

      // Verificar que la inscripción existe
      const inscripcion = await prisma.inscripcion.findUnique({
        where: { id: data.inscripcionId },
      });

      if (!inscripcion) {
        throw new NotFoundError('Inscripción no encontrada');
      }

      // Verificar si ya existe una calificación para esta inscripción
      const existing = await prisma.calificacion.findUnique({
        where: { inscripcionId: data.inscripcionId },
      });

      if (existing) {
        throw new ValidationError('Ya existe una calificación para esta inscripción');
      }

      const calificacion = await prisma.calificacion.create({
        data: {
          calificacion: data.calificacion,
          estatus: data.estatus,
          observaciones: data.observaciones,
          estudianteId: data.estudianteId,
          materiaId: data.materiaId,
          inscripcionId: data.inscripcionId,
        },
        include: {
          materia: true,
          estudiante: {
            include: {
              usuario: {
                select: {
                  nombre: true,
                  apellidoPaterno: true,
                },
              },
            },
          },
        },
      });

      logger.info(`Calificación creada para estudiante ${data.estudianteId}`);
      return calificacion;
    } catch (error) {
      logger.error('Error al crear calificación:', error);
      throw error;
    }
  }

  static async findByEstudiante(estudianteId: string): Promise<Calificacion[]> {
    try {
      const calificaciones = await prisma.calificacion.findMany({
        where: { estudianteId },
        include: {
          materia: {
            include: {
              carrera: true,
            },
          },
          inscripcion: {
            include: {
              grupo: {
                include: {
                  profesor: {
                    include: {
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
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return calificaciones as any;
    } catch (error) {
      logger.error('Error al obtener calificaciones:', error);
      throw error;
    }
  }

  static async update(id: string, calificacion: number, observaciones?: string): Promise<Calificacion> {
    try {
      if (calificacion < 0 || calificacion > 10) {
        throw new ValidationError('La calificación debe estar entre 0 y 10');
      }

      const updated = await prisma.calificacion.update({
        where: { id },
        data: {
          calificacion: calificacion,
          observaciones,
        },
        include: {
          materia: true,
          estudiante: {
            include: {
              usuario: true,
            },
          },
        },
      });

      logger.info(`Calificación actualizada: ${id}`);
      return updated;
    } catch (error) {
      logger.error('Error al actualizar calificación:', error);
      throw error;
    }
  }

  static async calculatePromedio(estudianteId: string): Promise<number> {
    try {
      const calificaciones = await prisma.calificacion.findMany({
        where: {
          estudianteId,
          estatus: 'APROBADO',
        },
      });

      if (calificaciones.length === 0) {
        return 0;
      }

      const sum = calificaciones.reduce(
        (acc, cal) => acc + parseFloat(cal.calificacion.toString()),
        0
      );

      return parseFloat((sum / calificaciones.length).toFixed(2));
    } catch (error) {
      logger.error('Error al calcular promedio:', error);
      throw error;
    }
  }
}

export default CalificacionService;


