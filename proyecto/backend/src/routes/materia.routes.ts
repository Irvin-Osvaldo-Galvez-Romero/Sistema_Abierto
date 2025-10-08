/**
 * Rutas de Materias
 */

import { Router } from 'express';
import { MateriaController } from '../controllers/materia.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Rol } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', MateriaController.getAll);
router.post('/', authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN), MateriaController.create);
router.get('/:id', MateriaController.getById);
router.put('/:id', authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN), MateriaController.update);
router.delete('/:id', authorize(Rol.SUPER_ADMIN), MateriaController.delete);

export default router;


