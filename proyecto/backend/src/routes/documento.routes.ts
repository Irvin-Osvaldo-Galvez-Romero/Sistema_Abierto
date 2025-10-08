/**
 * Rutas de Documentos
 */

import { Router } from 'express';
import { DocumentoController } from '../controllers/documento.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { Rol } from '@prisma/client';

const router = Router();

router.use(authenticate);

router.get('/', DocumentoController.getAll);
router.get('/:id', DocumentoController.getById);
router.patch('/:id/estatus', authorize(Rol.ADMINISTRADOR, Rol.SUPER_ADMIN, Rol.PERSONAL_ADMINISTRATIVO), DocumentoController.updateEstatus);
router.delete('/:id', authorize(Rol.SUPER_ADMIN), DocumentoController.delete);

export default router;


