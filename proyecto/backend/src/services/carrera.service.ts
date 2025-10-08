/**
 * Servicio de Gestión de Carreras
 * Lógica de negocio para CRUD de carreras
 */

import { Carrera, Modalidad } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import logger from '../utils/logger';

interface CreateCarreraData {
  clave: string;
  nombre: string;
  descripcion?: string;
  duracionSemestres: number;
  creditos: number;
  modalidad: Modalidad;
}

interface UpdateCarreraData {
  clave?: string;
  nombre?: string;
  descripcion?: string;
  duracionSemestres?: number;
  creditos?: number;
  modalidad?: Modalidad;
  activo?: boolean;
}

export class CarreraService {
  /**
   * Crear nueva carrera
   */
  static async create(data: CreateCarreraData): Promise<Carrera> {
    try {
      // Verificar si la clave ya existe
      const existing = await prisma.carrera.findUnique({
        where: { clave: data.clave },
      });

      if (existing) {
        throw new ConflictError('La clave de carrera ya existe');
      }

      const carrera = await prisma.carrera.create({
        data,
      });

      logger.info(`Carrera creada: ${carrera.nombre}`);
      return carrera;
    } catch (error) {
      logger.error('Error al crear carrera:', error);
      throw error;
    }
  }

  /**
   * Obtener todas las carreras
   */
  static async findAll(includeInactive: boolean = false): Promise<Carrera[]> {
    try {
      const where = includeInactive ? {} : { activo: true };

      const carreras = await prisma.carrera.findMany({
        where,
        include: {
          _count: {
            select: {
              estudiantes: true,
              materias: true,
            },
          },
        },
        orderBy: {
          nombre: 'asc',
        },
      });

      return carreras as any;
    } catch (error) {
      logger.error('Error al obtener carreras:', error);
      throw error;
    }
  }

  /**
   * Obtener carrera por ID
   */
  static async findById(id: string): Promise<Carrera> {
    try {
      const carrera = await prisma.carrera.findUnique({
        where: { id },
        include: {
          estudiantes: {
            take: 10,
            include: {
              usuario: {
                select: {
                  nombre: true,
                  apellidoPaterno: true,
                  email: true,
                },
              },
            },
          },
          materias: {
            orderBy: {
              semestre: 'asc',
            },
          },
          _count: {
            select: {
              estudiantes: true,
              materias: true,
            },
          },
        },
      });

      if (!carrera) {
        throw new NotFoundError('Carrera no encontrada');
      }

      return carrera as any;
    } catch (error) {
      logger.error('Error al obtener carrera:', error);
      throw error;
    }
  }

  /**
   * Actualizar carrera
   */
  static async update(id: string, data: UpdateCarreraData): Promise<Carrera> {
    try {
      const existing = await prisma.carrera.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundError('Carrera no encontrada');
      }

      // Si se actualiza la clave, verificar que no exista
      if (data.clave && data.clave !== existing.clave) {
        const claveExists = await prisma.carrera.findUnique({
          where: { clave: data.clave },
        });

        if (claveExists) {
          throw new ConflictError('La clave de carrera ya existe');
        }
      }

      const carrera = await prisma.carrera.update({
        where: { id },
        data,
      });

      logger.info(`Carrera actualizada: ${carrera.nombre}`);
      return carrera;
    } catch (error) {
      logger.error('Error al actualizar carrera:', error);
      throw error;
    }
  }

  /**
   * Eliminar carrera (soft delete)
   */
  static async delete(id: string): Promise<void> {
    try {
      const carrera = await prisma.carrera.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              estudiantes: true,
            },
          },
        },
      });

      if (!carrera) {
        throw new NotFoundError('Carrera no encontrada');
      }

      // Verificar si tiene estudiantes activos
      if ((carrera as any)._count.estudiantes > 0) {
        throw new ConflictError('No se puede eliminar una carrera con estudiantes inscritos');
      }

      await prisma.carrera.update({
        where: { id },
        data: { activo: false },
      });

      logger.info(`Carrera desactivada: ${carrera.nombre}`);
    } catch (error) {
      logger.error('Error al eliminar carrera:', error);
      throw error;
    }
  }
}

export default CarreraService;


