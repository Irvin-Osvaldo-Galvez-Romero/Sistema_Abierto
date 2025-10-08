"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const validation_middleware_1 = require("../middleware/validation.middleware");
const auth_middleware_1 = require("../middleware/auth.middleware");
const auth_validators_1 = require("../validators/auth.validators");
const router = (0, express_1.Router)();
router.post('/register', (0, validation_middleware_1.validate)(auth_validators_1.registerSchema), auth_controller_1.AuthController.register);
router.post('/login', (0, validation_middleware_1.validate)(auth_validators_1.loginSchema), auth_controller_1.AuthController.login);
router.post('/refresh', (0, validation_middleware_1.validate)(auth_validators_1.refreshTokenSchema), auth_controller_1.AuthController.refreshToken);
router.post('/logout', (0, validation_middleware_1.validate)(auth_validators_1.logoutSchema), auth_controller_1.AuthController.logout);
router.get('/profile', auth_middleware_1.authenticate, auth_controller_1.AuthController.getProfile);
router.get('/me', auth_middleware_1.authenticate, auth_controller_1.AuthController.getMe);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map