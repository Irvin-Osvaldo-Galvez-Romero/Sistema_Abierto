"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const materia_controller_1 = require("../controllers/materia.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', materia_controller_1.MateriaController.getAll);
router.post('/', (0, auth_middleware_1.authorize)(client_1.Rol.ADMINISTRADOR, client_1.Rol.SUPER_ADMIN), materia_controller_1.MateriaController.create);
router.get('/:id', materia_controller_1.MateriaController.getById);
router.put('/:id', (0, auth_middleware_1.authorize)(client_1.Rol.ADMINISTRADOR, client_1.Rol.SUPER_ADMIN), materia_controller_1.MateriaController.update);
router.delete('/:id', (0, auth_middleware_1.authorize)(client_1.Rol.SUPER_ADMIN), materia_controller_1.MateriaController.delete);
exports.default = router;
//# sourceMappingURL=materia.routes.js.map