/**
 * Validadores de Carreras
 */

import Joi from 'joi';
import { Modalidad } from '@prisma/client';

export const createCarreraSchema = {
  body: Joi.object({
    clave: Joi.string().required().max(20),
    nombre: Joi.string().required().max(200),
    descripcion: Joi.string().optional().allow(''),
    duracionSemestres: Joi.number().integer().min(1).max(20).required(),
    creditos: Joi.number().integer().min(1).required(),
    modalidad: Joi.string().valid(...Object.values(Modalidad)).required(),
  }),
};

export const updateCarreraSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
  body: Joi.object({
    clave: Joi.string().max(20).optional(),
    nombre: Joi.string().max(200).optional(),
    descripcion: Joi.string().optional().allow(''),
    duracionSemestres: Joi.number().integer().min(1).max(20).optional(),
    creditos: Joi.number().integer().min(1).optional(),
    modalidad: Joi.string().valid(...Object.values(Modalidad)).optional(),
    activo: Joi.boolean().optional(),
  }).min(1),
};

export const getCarreraByIdSchema = {
  params: Joi.object({
    id: Joi.string().uuid().required(),
  }),
};


