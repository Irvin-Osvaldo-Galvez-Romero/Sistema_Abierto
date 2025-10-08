/**
 * Utilidades de criptografía
 * Funciones para hash, encriptación y generación de tokens
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { config } from '../config/env';

/**
 * Hashear contraseña usando bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Verificar contraseña hasheada
 */
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generar token aleatorio seguro
 */
export const generateRandomToken = (length: number = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Encriptar datos sensibles
 */
export const encrypt = (text: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(config.security.encryptionKey.padEnd(32, '0').slice(0, 32));
  const iv = crypto.randomBytes(16);
  
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return iv.toString('hex') + ':' + encrypted;
};

/**
 * Desencriptar datos
 */
export const decrypt = (encryptedText: string): string => {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(config.security.encryptionKey.padEnd(32, '0').slice(0, 32));
  
  const parts = encryptedText.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const encrypted = parts[1];
  
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};

/**
 * Generar hash SHA-256 de un archivo
 */
export const generateFileHash = (buffer: Buffer): string => {
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

/**
 * Generar código de verificación aleatorio
 */
export const generateVerificationCode = (length: number = 6): string => {
  const digits = '0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(0, digits.length);
    code += digits[randomIndex];
  }
  
  return code;
};

