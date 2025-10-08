/**
 * Servicio de Profesores
 * Lógica de negocio para gestión de profesores
 */

import prisma from '../config/database';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';

export class ProfesorService {
  /**
   * Crear un nuevo profesor
   */
  static async crearProfesor(data: {
    usuarioId: string;
    numeroEmpleado: string;
    especialidad: string;
    estatus?: string;
  }) {
    try {
      // Verificar que el usuario existe y es profesor
      const usuario = await prisma.usuario.findUnique({
        where: { id: data.usuarioId },
      });

      if (!usuario) {
        throw new AppError('Usuario no encontrado', 404);
      }

      if (usuario.rol !== 'PROFESOR') {
        throw new AppError('El usuario no tiene rol de profesor', 400);
      }

      // Verificar que no exista otro profesor con el mismo número de empleado
      const existing = await prisma.profesor.findUnique({
        where: { numeroEmpleado: data.numeroEmpleado },
      });

      if (existing) {
        throw new AppError('Ya existe un profesor con ese número de empleado', 400);
      }

      // Crear el profesor
      const profesor = await prisma.profesor.create({
        data: {
          usuarioId: data.usuarioId,
          numeroEmpleado: data.numeroEmpleado,
          especialidad: data.especialidad,
          activo: true,
        },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidoPaterno: true,
              apellidoMaterno: true,
              email: true,
              telefono: true,
            },
          },
        },
      });

      logger.info('Profesor creado exitosamente', { profesorId: profesor.id });
      return profesor;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error al crear profesor', { error });
      throw new AppError('Error al crear el profesor', 500);
    }
  }

  /**
   * Obtener todos los profesores
   */
  static async obtenerProfesores() {
    try {
      const profesores = await prisma.profesor.findMany({
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidoPaterno: true,
              apellidoMaterno: true,
              email: true,
              telefono: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return profesores;
    } catch (error) {
      logger.error('Error al obtener profesores', { error });
      throw new AppError('Error al obtener los profesores', 500);
    }
  }

  /**
   * Obtener un profesor por ID
   */
  static async obtenerProfesorPorId(id: string) {
    try {
      const profesor = await prisma.profesor.findUnique({
        where: { id },
        include: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellidoPaterno: true,
              apellidoMaterno: true,
              email: true,
              telefono: true,
            },
          },
        },
      });

      if (!profesor) {
        throw new AppError('Profesor no encontrado', 404);
      }

      return profesor;
    } catch (error) {
      if (error instanceof AppError) throw error;
      logger.error('Error al obtener profesor', { error, profesorId: id });
      throw new AppError('Error al obtener el profesor', 500);
    }
  }
}

