"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const calificacion_controller_1 = require("../controllers/calificacion.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/my-calificaciones', (0, auth_middleware_1.authorize)(client_1.Rol.ESTUDIANTE), calificacion_controller_1.CalificacionController.getMyCalificaciones);
router.post('/', (0, auth_middleware_1.authorize)(client_1.Rol.PROFESOR, client_1.Rol.ADMINISTRADOR, client_1.Rol.SUPER_ADMIN), calificacion_controller_1.CalificacionController.create);
router.get('/estudiante/:estudianteId', (0, auth_middleware_1.authorize)(client_1.Rol.PROFESOR, client_1.Rol.ADMINISTRADOR, client_1.Rol.SUPER_ADMIN), calificacion_controller_1.CalificacionController.getByEstudiante);
router.get('/promedio/:estudianteId', calificacion_controller_1.CalificacionController.getPromedio);
router.put('/:id', (0, auth_middleware_1.authorize)(client_1.Rol.PROFESOR, client_1.Rol.ADMINISTRADOR, client_1.Rol.SUPER_ADMIN), calificacion_controller_1.CalificacionController.update);
exports.default = router;
//# sourceMappingURL=calificacion.routes.js.map