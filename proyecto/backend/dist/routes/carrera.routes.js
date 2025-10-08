"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carrera_controller_1 = require("../controllers/carrera.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const carrera_validators_1 = require("../validators/carrera.validators");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', carrera_controller_1.CarreraController.getAll);
router.post('/', (0, auth_middleware_1.authorize)(client_1.Rol.ADMINISTRADOR, client_1.Rol.SUPER_ADMIN), (0, validation_middleware_1.validate)(carrera_validators_1.createCarreraSchema), carrera_controller_1.CarreraController.create);
router.get('/:id', (0, validation_middleware_1.validate)(carrera_validators_1.getCarreraByIdSchema), carrera_controller_1.CarreraController.getById);
router.put('/:id', (0, auth_middleware_1.authorize)(client_1.Rol.ADMINISTRADOR, client_1.Rol.SUPER_ADMIN), (0, validation_middleware_1.validate)(carrera_validators_1.updateCarreraSchema), carrera_controller_1.CarreraController.update);
router.delete('/:id', (0, auth_middleware_1.authorize)(client_1.Rol.SUPER_ADMIN), (0, validation_middleware_1.validate)(carrera_validators_1.getCarreraByIdSchema), carrera_controller_1.CarreraController.delete);
exports.default = router;
//# sourceMappingURL=carrera.routes.js.map