"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const password_controller_1 = require("../controllers/password.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.post('/change-first-login', auth_middleware_1.authenticate, password_controller_1.PasswordController.changeFirstLogin);
router.post('/change', auth_middleware_1.authenticate, password_controller_1.PasswordController.changePassword);
exports.default = router;
//# sourceMappingURL=password.routes.js.map