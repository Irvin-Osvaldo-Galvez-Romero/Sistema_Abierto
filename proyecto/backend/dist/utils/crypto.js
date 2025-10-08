"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = exports.generateFileHash = exports.decrypt = exports.encrypt = exports.generateRandomToken = exports.verifyPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
const hashPassword = async (password) => {
    const salt = await bcryptjs_1.default.genSalt(10);
    return bcryptjs_1.default.hash(password, salt);
};
exports.hashPassword = hashPassword;
const verifyPassword = async (password, hashedPassword) => {
    return bcryptjs_1.default.compare(password, hashedPassword);
};
exports.verifyPassword = verifyPassword;
const generateRandomToken = (length = 32) => {
    return crypto_1.default.randomBytes(length).toString('hex');
};
exports.generateRandomToken = generateRandomToken;
const encrypt = (text) => {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(env_1.config.security.encryptionKey.padEnd(32, '0').slice(0, 32));
    const iv = crypto_1.default.randomBytes(16);
    const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
};
exports.encrypt = encrypt;
const decrypt = (encryptedText) => {
    const algorithm = 'aes-256-cbc';
    const key = Buffer.from(env_1.config.security.encryptionKey.padEnd(32, '0').slice(0, 32));
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const encrypted = parts[1];
    const decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decrypt = decrypt;
const generateFileHash = (buffer) => {
    return crypto_1.default.createHash('sha256').update(buffer).digest('hex');
};
exports.generateFileHash = generateFileHash;
const generateVerificationCode = (length = 6) => {
    const digits = '0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto_1.default.randomInt(0, digits.length);
        code += digits[randomIndex];
    }
    return code;
};
exports.generateVerificationCode = generateVerificationCode;
//# sourceMappingURL=crypto.js.map