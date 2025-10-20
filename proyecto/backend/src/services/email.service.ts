/**
 * Servicio de Correo Electrónico
 * Gestiona el envío de correos institucionales
 */

import nodemailer from 'nodemailer';
import logger from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

interface CredentialsData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  password: string;
  matricula?: string;
  tipo: 'ESTUDIANTE' | 'PROFESOR';
}

export class EmailService {
  private static transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true para puerto 465, false para otros puertos
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  /**
   * Enviar correo genérico
   */
  static async sendEmail({ to, subject, html }: EmailOptions): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: `"TESCHI - Sistema de Gestión Documental" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
      });

      logger.info(`📧 Correo enviado exitosamente a ${to}`, {
        messageId: info.messageId,
        accepted: info.accepted,
      });
    } catch (error) {
      logger.error('❌ Error al enviar correo:', error);
      throw new Error('No se pudo enviar el correo electrónico');
    }
  }

  /**
   * Enviar credenciales de acceso a estudiante
   */
  static async sendStudentCredentials(data: CredentialsData): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credenciales de Acceso - TESCHI</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px 20px;
    }
    .greeting {
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
    }
    .credentials-box {
      background-color: #f8f9fa;
      border-left: 4px solid #1976d2;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .credential-item {
      margin: 12px 0;
    }
    .credential-label {
      font-weight: 600;
      color: #555;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .credential-value {
      font-size: 16px;
      color: #1976d2;
      font-weight: 600;
      margin-top: 5px;
      padding: 8px 12px;
      background-color: #e3f2fd;
      border-radius: 4px;
      display: inline-block;
      font-family: 'Courier New', monospace;
    }
    .warning-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .warning-box h3 {
      margin: 0 0 10px 0;
      color: #856404;
      font-size: 14px;
      font-weight: 600;
    }
    .warning-box ul {
      margin: 0;
      padding-left: 20px;
      color: #856404;
      font-size: 13px;
    }
    .warning-box li {
      margin: 5px 0;
    }
    .instructions {
      margin: 20px 0;
    }
    .instructions h3 {
      color: #333;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .instructions ol {
      color: #555;
      font-size: 14px;
      line-height: 1.6;
      padding-left: 20px;
    }
    .instructions li {
      margin: 8px 0;
    }
    .button {
      display: inline-block;
      background-color: #1976d2;
      color: white;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 5px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 12px;
      border-top: 1px solid #e0e0e0;
    }
    .footer p {
      margin: 5px 0;
    }
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 Bienvenido al TESCHI</h1>
      <p>Tecnológico de Estudios Superiores de Chimalhuacán</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        <p>Estimado(a) <strong>${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}</strong>,</p>
        <p>Tu cuenta de estudiante ha sido creada exitosamente en el Sistema de Gestión Documental del TESCHI.</p>
      </div>

      <div class="credentials-box">
        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">📋 Tus Credenciales de Acceso</h2>
        
        <div class="credential-item">
          <div class="credential-label">Matrícula</div>
          <div class="credential-value">${data.matricula || 'Por asignar'}</div>
        </div>

        <div class="credential-item">
          <div class="credential-label">Correo Institucional</div>
          <div class="credential-value">${data.email}</div>
        </div>

        <div class="credential-item">
          <div class="credential-label">Contraseña Temporal</div>
          <div class="credential-value">${data.password}</div>
        </div>
      </div>

      <div class="warning-box">
        <h3>⚠️ Importante - Seguridad de tu Cuenta</h3>
        <ul>
          <li><strong>Cambia tu contraseña</strong> en el primer inicio de sesión</li>
          <li><strong>No compartas</strong> tus credenciales con nadie</li>
          <li><strong>Guarda esta información</strong> en un lugar seguro</li>
          <li><strong>Este correo es confidencial</strong> y de uso exclusivo para ti</li>
        </ul>
      </div>

      <div class="instructions">
        <h3>📝 Instrucciones para Acceder</h3>
        <ol>
          <li>Ingresa al sistema haciendo clic en el botón de abajo</li>
          <li>Usa tu <strong>correo institucional</strong> y <strong>contraseña temporal</strong></li>
          <li>El sistema te pedirá cambiar tu contraseña en el primer acceso</li>
          <li>Una vez dentro, podrás subir tus documentos de reinscripción</li>
        </ol>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
          🔐 Acceder al Sistema
        </a>
      </div>

      <div class="divider"></div>

      <div style="font-size: 13px; color: #666; line-height: 1.6;">
        <p><strong>¿Necesitas ayuda?</strong></p>
        <p>Si tienes problemas para acceder o alguna duda, contacta al personal administrativo del TESCHI.</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>Tecnológico de Estudios Superiores de Chimalhuacán</strong></p>
      <p>Sistema de Gestión Documental Digital</p>
      <p style="margin-top: 10px; font-size: 11px; color: #999;">
        Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to: data.email,
      subject: '🎓 Credenciales de Acceso - Sistema TESCHI',
      html,
    });
  }

  /**
   * Enviar credenciales de acceso a profesor
   */
  static async sendProfessorCredentials(data: CredentialsData): Promise<void> {
    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Credenciales de Acceso - TESCHI</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f5f5f5;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .header p {
      margin: 5px 0 0 0;
      font-size: 14px;
      opacity: 0.9;
    }
    .content {
      padding: 30px 20px;
    }
    .greeting {
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
    }
    .credentials-box {
      background-color: #f1f8e9;
      border-left: 4px solid #2e7d32;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .credential-item {
      margin: 12px 0;
    }
    .credential-label {
      font-weight: 600;
      color: #555;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .credential-value {
      font-size: 16px;
      color: #2e7d32;
      font-weight: 600;
      margin-top: 5px;
      padding: 8px 12px;
      background-color: #dcedc8;
      border-radius: 4px;
      display: inline-block;
      font-family: 'Courier New', monospace;
    }
    .warning-box {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .warning-box h3 {
      margin: 0 0 10px 0;
      color: #856404;
      font-size: 14px;
      font-weight: 600;
    }
    .warning-box ul {
      margin: 0;
      padding-left: 20px;
      color: #856404;
      font-size: 13px;
    }
    .warning-box li {
      margin: 5px 0;
    }
    .instructions {
      margin: 20px 0;
    }
    .instructions h3 {
      color: #333;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .instructions ol {
      color: #555;
      font-size: 14px;
      line-height: 1.6;
      padding-left: 20px;
    }
    .instructions li {
      margin: 8px 0;
    }
    .button {
      display: inline-block;
      background-color: #2e7d32;
      color: white;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 5px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 12px;
      border-top: 1px solid #e0e0e0;
    }
    .footer p {
      margin: 5px 0;
    }
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>👨‍🏫 Bienvenido al TESCHI</h1>
      <p>Tecnológico de Estudios Superiores de Chimalhuacán</p>
    </div>
    
    <div class="content">
      <div class="greeting">
        <p>Estimado(a) <strong>Prof. ${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}</strong>,</p>
        <p>Tu cuenta de profesor ha sido creada exitosamente en el Sistema de Gestión Documental del TESCHI.</p>
      </div>

      <div class="credentials-box">
        <h2 style="margin: 0 0 15px 0; color: #333; font-size: 18px;">📋 Tus Credenciales de Acceso</h2>
        
        <div class="credential-item">
          <div class="credential-label">Correo Institucional</div>
          <div class="credential-value">${data.email}</div>
        </div>

        <div class="credential-item">
          <div class="credential-label">Contraseña Temporal</div>
          <div class="credential-value">${data.password}</div>
        </div>
      </div>

      <div class="warning-box">
        <h3>⚠️ Importante - Seguridad de tu Cuenta</h3>
        <ul>
          <li><strong>Cambia tu contraseña</strong> en el primer inicio de sesión</li>
          <li><strong>No compartas</strong> tus credenciales con nadie</li>
          <li><strong>Guarda esta información</strong> en un lugar seguro</li>
          <li><strong>Este correo es confidencial</strong> y de uso exclusivo para ti</li>
        </ul>
      </div>

      <div class="instructions">
        <h3>📝 Instrucciones para Acceder</h3>
        <ol>
          <li>Ingresa al sistema haciendo clic en el botón de abajo</li>
          <li>Usa tu <strong>correo institucional</strong> y <strong>contraseña temporal</strong></li>
          <li>El sistema te pedirá cambiar tu contraseña en el primer acceso</li>
          <li>Podrás revisar documentos y gestionar actividades académicas</li>
        </ol>
      </div>

      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/login" class="button">
          🔐 Acceder al Sistema
        </a>
      </div>

      <div class="divider"></div>

      <div style="font-size: 13px; color: #666; line-height: 1.6;">
        <p><strong>¿Necesitas ayuda?</strong></p>
        <p>Si tienes problemas para acceder o alguna duda, contacta al departamento de TI del TESCHI.</p>
      </div>
    </div>

    <div class="footer">
      <p><strong>Tecnológico de Estudios Superiores de Chimalhuacán</strong></p>
      <p>Sistema de Gestión Documental Digital</p>
      <p style="margin-top: 10px; font-size: 11px; color: #999;">
        Este correo fue enviado automáticamente. Por favor no respondas a este mensaje.
      </p>
    </div>
  </div>
</body>
</html>
    `;

    await this.sendEmail({
      to: data.email,
      subject: '👨‍🏫 Credenciales de Acceso - Sistema TESCHI',
      html,
    });
  }

  /**
   * Verificar configuración del servicio de correo
   */
  static async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('✅ Conexión al servidor SMTP verificada correctamente');
      return true;
    } catch (error) {
      logger.error('❌ Error al verificar conexión SMTP:', error);
      return false;
    }
  }
}

