"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const carrera_controller_1 = require("../controllers/carrera.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.get('/', carrera_controller_1.CarreraController.getAll);
router.get('/:id', carrera_controller_1.CarreraController.getById);
exports.default = router;
//# sourceMappingURL=carrera.routes.js.map