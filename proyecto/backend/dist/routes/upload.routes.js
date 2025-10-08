"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const upload_middleware_1 = require("../middleware/upload.middleware");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
router.get('/view/:id', auth_middleware_1.authenticate, upload_controller_1.UploadController.viewDocument);
router.get('/download/:id', auth_middleware_1.authenticate, upload_controller_1.UploadController.downloadDocument);
router.get('/my-documents', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Rol.ESTUDIANTE), upload_controller_1.UploadController.getMyDocuments);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Rol.ESTUDIANTE), upload_middleware_1.upload.single('archivo'), upload_controller_1.UploadController.uploadDocument);
router.patch('/:id/review', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(client_1.Rol.ADMINISTRADOR, client_1.Rol.SUPER_ADMIN, client_1.Rol.PERSONAL_ADMINISTRATIVO), upload_controller_1.UploadController.reviewDocument);
exports.default = router;
//# sourceMappingURL=upload.routes.js.map