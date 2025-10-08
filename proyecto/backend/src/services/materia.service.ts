/**
 * Servicio de Gestión de Materias
 */

import { Materia } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';
import logger from '../utils/logger';

interface CreateMateriaData {
  clave: string;
  nombre: string;
  descripcion?: string;
  creditos: number;
  semestre: number;
  horasTeoria: number;
  horasPractica: number;
  carreraId: string;
}

export class MateriaService {
  static async create(data: CreateMateriaData): Promise<Materia> {
    try {
      const existing = await prisma.materia.findUnique({
        where: { clave: data.clave },
      });

      if (existing) {
        throw new ConflictError('La clave de materia ya existe');
      }

      const carrera = await prisma.carrera.findUnique({
        where: { id: data.carreraId },
      });

      if (!carrera) {
        throw new NotFoundError('La carrera no existe');
      }

      const materia = await prisma.materia.create({
        data,
        include: {
          carrera: true,
        },
      });

      logger.info(`Materia creada: ${materia.nombre}`);
      return materia;
    } catch (error) {
      logger.error('Error al crear materia:', error);
      throw error;
    }
  }

  static async findAll(carreraId?: string): Promise<Materia[]> {
    try {
      const where = carreraId ? { carreraId, activo: true } : { activo: true };

      return await prisma.materia.findMany({
        where,
        include: {
          carrera: true,
          _count: {
            select: {
              grupos: true,
            },
          },
        },
        orderBy: [
          { semestre: 'asc' },
          { nombre: 'asc' },
        ],
      }) as any;
    } catch (error) {
      logger.error('Error al obtener materias:', error);
      throw error;
    }
  }

  static async findById(id: string): Promise<Materia> {
    try {
      const materia = await prisma.materia.findUnique({
        where: { id },
        include: {
          carrera: true,
          grupos: {
            include: {
              profesor: {
                include: {
                  usuario: true,
                },
              },
            },
          },
        },
      });

      if (!materia) {
        throw new NotFoundError('Materia no encontrada');
      }

      return materia as any;
    } catch (error) {
      logger.error('Error al obtener materia:', error);
      throw error;
    }
  }

  static async update(id: string, data: Partial<CreateMateriaData>): Promise<Materia> {
    try {
      const existing = await prisma.materia.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundError('Materia no encontrada');
      }

      const materia = await prisma.materia.update({
        where: { id },
        data,
        include: {
          carrera: true,
        },
      });

      logger.info(`Materia actualizada: ${materia.nombre}`);
      return materia;
    } catch (error) {
      logger.error('Error al actualizar materia:', error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await prisma.materia.update({
        where: { id },
        data: { activo: false },
      });

      logger.info(`Materia desactivada: ${id}`);
    } catch (error) {
      logger.error('Error al eliminar materia:', error);
      throw error;
    }
  }
}

export default MateriaService;


