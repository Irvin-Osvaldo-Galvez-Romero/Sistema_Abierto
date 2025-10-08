/**
 * Servicio de Gestión de Estudiantes
 * Lógica de negocio para CRUD de estudiantes
 */

import { Estudiante, EstatusEstudiante } from '@prisma/client';
import { prisma } from '../config/database';
import { NotFoundError, ConflictError, ValidationError } from '../utils/errors';
import logger from '../utils/logger';

interface CreateStudentData {
  usuarioId: string;
  matricula: string;
  fechaNacimiento?: Date;
  curp?: string;
  nss?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  codigoPostal?: string;
  tutorNombre?: string;
  tutorTelefono?: string;
  tutorEmail?: string;
  carreraId?: string;
  estatus?: EstatusEstudiante;
}

interface UpdateStudentData {
  fechaNacimiento?: Date;
  curp?: string;
  nss?: string;
  direccion?: string;
  ciudad?: string;
  estado?: string;
  codigoPostal?: string;
  tutorNombre?: string;
  tutorTelefono?: string;
  tutorEmail?: string;
  estatus?: EstatusEstudiante;
  carreraId?: string;
}

export class StudentService {
  /**
   * Crear nuevo estudiante
   */
  static async create(data: CreateStudentData): Promise<Estudiante> {
    try {
      // Verificar si la matrícula ya existe
      const existingStudent = await prisma.estudiante.findUnique({
        where: { matricula: data.matricula },
      });

      if (existingStudent) {
        throw new ConflictError('La matrícula ya está registrada');
      }

      // Verificar si el usuario ya tiene un perfil de estudiante
      const existingProfile = await prisma.estudiante.findUnique({
        where: { usuarioId: data.usuarioId },
      });

      if (existingProfile) {
        throw new ConflictError('El usuario ya tiene un perfil de estudiante');
      }

      // Verificar si la carrera existe (solo si se proporciona)
      if (data.carreraId) {
        const carrera = await prisma.carrera.findUnique({
          where: { id: data.carreraId },
        });

        if (!carrera) {
          throw new NotFoundError('La carrera no existe');
        }
      }

      // Preparar datos para crear
      const createData: any = {
        usuarioId: data.usuarioId,
        matricula: data.matricula,
        estatus: data.estatus || EstatusEstudiante.ACTIVO,
      };

      // Agregar campos opcionales solo si están presentes
      if (data.fechaNacimiento) {
        createData.fechaNacimiento = new Date(data.fechaNacimiento);
      }
      if (data.carreraId) {
        createData.carreraId = data.carreraId;
      }
      if (data.curp) createData.curp = data.curp;
      if (data.nss) createData.nss = data.nss;
      if (data.direccion) createData.direccion = data.direccion;
      if (data.ciudad) createData.ciudad = data.ciudad;
      if (data.estado) createData.estado = data.estado;
      if (data.codigoPostal) createData.codigoPostal = data.codigoPostal;
      if (data.tutorNombre) createData.tutorNombre = data.tutorNombre;
      if (data.tutorTelefono) createData.tutorTelefono = data.tutorTelefono;
      if (data.tutorEmail) createData.tutorEmail = data.tutorEmail;

      // Crear estudiante
      const estudiante = await prisma.estudiante.create({
        data: createData,
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nombre: true,
              apellidoPaterno: true,
              apellidoMaterno: true,
            },
          },
          carrera: true,
        },
      });

      logger.info(`Estudiante creado: ${estudiante.matricula}`);

      return estudiante;
    } catch (error) {
      logger.error('Error al crear estudiante:', error);
      throw error;
    }
  }

  /**
   * Obtener todos los estudiantes
   */
  static async findAll(
    page: number = 1,
    limit: number = 10,
    estatus?: EstatusEstudiante
  ): Promise<{ estudiantes: Estudiante[]; total: number; pages: number }> {
    try {
      const skip = (page - 1) * limit;
      const where = estatus ? { estatus } : {};

      const [estudiantes, total] = await Promise.all([
        prisma.estudiante.findMany({
          where,
          skip,
          take: limit,
          include: {
            usuario: {
              select: {
                id: true,
                email: true,
                nombre: true,
                apellidoPaterno: true,
                apellidoMaterno: true,
                telefono: true,
              },
            },
            carrera: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.estudiante.count({ where }),
      ]);

      const pages = Math.ceil(total / limit);

      return { estudiantes, total, pages };
    } catch (error) {
      logger.error('Error al obtener estudiantes:', error);
      throw error;
    }
  }

  /**
   * Obtener estudiante por ID
   */
  static async findById(id: string): Promise<Estudiante> {
    try {
      const estudiante = await prisma.estudiante.findUnique({
        where: { id },
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nombre: true,
              apellidoPaterno: true,
              apellidoMaterno: true,
              telefono: true,
            },
          },
          carrera: true,
          documentos: {
            include: {
              documento: {
                select: {
                  id: true,
                  folio: true,
                  tipo: true,
                  titulo: true,
                  estatus: true,
                  rutaArchivo: true,
                  mimeType: true,
                  tamanoBytes: true,
                  createdAt: true,
                  updatedAt: true,
                },
              },
            },
            orderBy: {
              documento: {
                createdAt: 'desc',
              },
            },
          },
          inscripciones: {
            include: {
              grupo: {
                include: {
                  materia: true,
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
          calificaciones: {
            include: {
              materia: true,
            },
          },
        },
      });

      if (!estudiante) {
        throw new NotFoundError('Estudiante no encontrado');
      }

      return estudiante;
    } catch (error) {
      logger.error('Error al obtener estudiante:', error);
      throw error;
    }
  }

  /**
   * Obtener estudiante por matrícula
   */
  static async findByMatricula(matricula: string): Promise<Estudiante> {
    try {
      const estudiante = await prisma.estudiante.findUnique({
        where: { matricula },
        include: {
          usuario: true,
          carrera: true,
        },
      });

      if (!estudiante) {
        throw new NotFoundError('Estudiante no encontrado');
      }

      return estudiante;
    } catch (error) {
      logger.error('Error al obtener estudiante por matrícula:', error);
      throw error;
    }
  }

  /**
   * Obtener estudiante por usuario ID
   */
  static async findByUserId(usuarioId: string): Promise<Estudiante> {
    try {
      const estudiante = await prisma.estudiante.findUnique({
        where: { usuarioId },
        include: {
          usuario: true,
          carrera: true,
        },
      });

      if (!estudiante) {
        throw new NotFoundError('Perfil de estudiante no encontrado');
      }

      return estudiante;
    } catch (error) {
      logger.error('Error al obtener estudiante por usuario:', error);
      throw error;
    }
  }

  /**
   * Actualizar estudiante
   */
  static async update(id: string, data: UpdateStudentData): Promise<Estudiante> {
    try {
      // Verificar si el estudiante existe
      const existing = await prisma.estudiante.findUnique({
        where: { id },
      });

      if (!existing) {
        throw new NotFoundError('Estudiante no encontrado');
      }

      // Si se actualiza la carrera, verificar que existe
      if (data.carreraId) {
        const carrera = await prisma.carrera.findUnique({
          where: { id: data.carreraId },
        });

        if (!carrera) {
          throw new NotFoundError('La carrera no existe');
        }
      }

      // Actualizar estudiante
      const estudiante = await prisma.estudiante.update({
        where: { id },
        data: {
          ...data,
          fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : undefined,
        },
        include: {
          usuario: true,
          carrera: true,
        },
      });

      logger.info(`Estudiante actualizado: ${estudiante.matricula}`);

      return estudiante;
    } catch (error) {
      logger.error('Error al actualizar estudiante:', error);
      throw error;
    }
  }

  /**
   * Eliminar estudiante (soft delete)
   */
  static async delete(id: string): Promise<void> {
    try {
      const estudiante = await prisma.estudiante.findUnique({
        where: { id },
      });

      if (!estudiante) {
        throw new NotFoundError('Estudiante no encontrado');
      }

      // Cambiar estatus a BAJA_DEFINITIVA (soft delete)
      await prisma.estudiante.update({
        where: { id },
        data: {
          estatus: EstatusEstudiante.BAJA_DEFINITIVA,
        },
      });

      logger.info(`Estudiante dado de baja: ${estudiante.matricula}`);
    } catch (error) {
      logger.error('Error al eliminar estudiante:', error);
      throw error;
    }
  }

  /**
   * Generar matrícula automática
   */
  static async generateMatricula(): Promise<string> {
    try {
      const year = new Date().getFullYear();
      
      // Obtener el último estudiante creado en el año actual
      const lastStudent = await prisma.estudiante.findFirst({
        where: {
          matricula: {
            startsWith: year.toString(),
          },
        },
        orderBy: {
          matricula: 'desc',
        },
      });

      let nextNumber = 1;
      
      if (lastStudent) {
        const lastNumber = parseInt(lastStudent.matricula.slice(-6));
        nextNumber = lastNumber + 1;
      }

      // Formato: YYYY000001
      const matricula = `${year}${nextNumber.toString().padStart(6, '0')}`;
      
      return matricula;
    } catch (error) {
      logger.error('Error al generar matrícula:', error);
      throw error;
    }
  }

  /**
   * Buscar estudiantes
   */
  static async search(query: string): Promise<Estudiante[]> {
    try {
      const estudiantes = await prisma.estudiante.findMany({
        where: {
          OR: [
            { matricula: { contains: query, mode: 'insensitive' } },
            { usuario: { nombre: { contains: query, mode: 'insensitive' } } },
            { usuario: { apellidoPaterno: { contains: query, mode: 'insensitive' } } },
            { usuario: { email: { contains: query, mode: 'insensitive' } } },
          ],
        },
        include: {
          usuario: true,
          carrera: true,
        },
        take: 20,
      });

      return estudiantes;
    } catch (error) {
      logger.error('Error al buscar estudiantes:', error);
      throw error;
    }
  }
}

export default StudentService;


