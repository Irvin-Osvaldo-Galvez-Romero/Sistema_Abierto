"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificacion_controller_1 = require("../controllers/notificacion.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/my-notifications', (0, auth_middleware_1.authorize)(client_1.Rol.ESTUDIANTE), notificacion_controller_1.NotificacionController.getMyNotifications);
router.patch('/:id/read', (0, auth_middleware_1.authorize)(client_1.Rol.ESTUDIANTE), notificacion_controller_1.NotificacionController.markAsRead);
router.patch('/mark-all-read', (0, auth_middleware_1.authorize)(client_1.Rol.ESTUDIANTE), notificacion_controller_1.NotificacionController.markAllAsRead);
exports.default = router;
//# sourceMappingURL=notificacion.routes.js.map