"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const documento_controller_1 = require("../controllers/documento.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', documento_controller_1.DocumentoController.getAll);
router.get('/:id', documento_controller_1.DocumentoController.getById);
router.patch('/:id/estatus', (0, auth_middleware_1.authorize)(client_1.Rol.ADMINISTRADOR, client_1.Rol.SUPER_ADMIN, client_1.Rol.PERSONAL_ADMINISTRATIVO), documento_controller_1.DocumentoController.updateEstatus);
router.delete('/:id', (0, auth_middleware_1.authorize)(client_1.Rol.SUPER_ADMIN), documento_controller_1.DocumentoController.delete);
exports.default = router;
//# sourceMappingURL=documento.routes.js.map