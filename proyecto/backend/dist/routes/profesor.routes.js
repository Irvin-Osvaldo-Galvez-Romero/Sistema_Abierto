"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profesor_controller_1 = require("../controllers/profesor.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.post('/', profesor_controller_1.ProfesorController.crearProfesor);
router.get('/', profesor_controller_1.ProfesorController.obtenerProfesores);
router.get('/:id', profesor_controller_1.ProfesorController.obtenerProfesorPorId);
exports.default = router;
//# sourceMappingURL=profesor.routes.js.map