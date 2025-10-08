"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const errors_1 = require("../utils/errors");
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new errors_1.ValidationError('Solo se permiten archivos PDF o imágenes (JPG, PNG)'));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
    },
});
exports.default = exports.upload;
//# sourceMappingURL=upload.middleware.js.map