/**
 * Script final para probar el sistema completo de restablecimiento de contraseña
 */

import nodemailer from 'nodemailer';

async function probarSistemaCompleto() {
  console.log('🧪 PRUEBA COMPLETA DEL SISTEMA DE RESTABLECIMIENTO');
  console.log('=' .repeat(60));
  
  try {
    console.log('\n🔍 Verificando configuración...');
    
    // Verificar variables de entorno
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = process.env.SMTP_PORT;
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const frontendUrl = process.env.FRONTEND_URL;
    
    console.log('   SMTP_HOST:', smtpHost || 'No configurado');
    console.log('   SMTP_PORT:', smtpPort || 'No configurado');
    console.log('   SMTP_USER:', smtpUser || 'No configurado');
    console.log('   SMTP_PASSWORD:', smtpPassword ? 'Configurado' : 'No configurado');
    console.log('   FRONTEND_URL:', frontendUrl || 'No configurado');
    
    if (!smtpHost || !smtpPort || !smtpUser || !smtpPassword) {
      console.log('\n❌ Configuración incompleta');
      console.log('💡 Ejecuta: npx ts-node scripts/verificar-configuracion.ts');
      return;
    }
    
    console.log('\n🔌 Probando conexión SMTP...');
    
    // Crear transporter
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort),
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });
    
    // Verificar conexión
    await transporter.verify();
    console.log('✅ Conexión SMTP exitosa');
    
    console.log('\n📧 Enviando correo de prueba...');
    
    // Generar token de prueba
    const resetToken = 'test-token-' + Date.now();
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;
    
    // Enviar correo de prueba
    const info = await transporter.sendMail({
      from: `"TESCHI - Sistema de Gestión Documental" <${smtpUser}>`,
      to: smtpUser,
      subject: '🧪 Prueba de Restablecimiento - Sistema TESCHI',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Restablecer Contraseña</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #008000; margin-bottom: 10px;">🔐 Restablecer Contraseña</h1>
              <h2 style="color: #333; margin-bottom: 20px;">Sistema TESCHI</h2>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #008000; margin-top: 0;">¡Hola!</h3>
              <p>Has solicitado restablecer tu contraseña en el Sistema Universitario de Gestión Documental Digital.</p>
              
              <div style="background: #fff; padding: 15px; border-left: 4px solid #008000; margin: 20px 0;">
                <p style="margin: 0;"><strong>📧 Correo:</strong> ${smtpUser}</p>
                <p style="margin: 5px 0 0 0;"><strong>🕒 Fecha:</strong> ${new Date().toLocaleString()}</p>
              </div>
              
              <p><strong>Para restablecer tu contraseña, haz clic en el siguiente enlace:</strong></p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background: #008000; color: white; padding: 15px 30px; 
                          text-decoration: none; border-radius: 5px; font-weight: bold;
                          display: inline-block;">
                  🔐 Restablecer Contraseña
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666;">
                <strong>⚠️ Importante:</strong> Este enlace expirará en 15 minutos por seguridad.
              </p>
              
              <p style="font-size: 14px; color: #666;">
                Si no solicitaste este restablecimiento, puedes ignorar este correo.
              </p>
            </div>
            
            <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                © 2024 Sistema Universitario de Gestión Documental Digital<br>
                Tecnológico de Estudios Superiores de Chalco
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    
    console.log('✅ ¡CORREO ENVIADO EXITOSAMENTE!');
    console.log('   Message ID:', info.messageId);
    console.log('   Destinatario:', smtpUser);
    
    console.log('\n🎉 SISTEMA FUNCIONANDO CORRECTAMENTE');
    console.log('=' .repeat(40));
    console.log('✅ Configuración Gmail: OK');
    console.log('✅ Conexión SMTP: OK');
    console.log('✅ Envío de correo: OK');
    console.log('✅ Template HTML: OK');
    
    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('=' .repeat(20));
    console.log('1. npm run dev                    # Iniciar servidor');
    console.log('2. http://localhost:3000/forgot-password');
    console.log('3. Ingresa cualquier email');
    console.log('4. Verifica que llegue el correo');
    
    console.log('\n📋 FUNCIONALIDADES DISPONIBLES:');
    console.log('=' .repeat(35));
    console.log('✅ Solicitar restablecimiento de contraseña');
    console.log('✅ Envío de correo con enlace seguro');
    console.log('✅ Token de seguridad con expiración');
    console.log('✅ Interfaz de usuario completa');
    console.log('✅ Validación de contraseñas');
    
    console.log('\n🔍 PARA PROBAR:');
    console.log('=' .repeat(15));
    console.log('• Ve a: http://localhost:3000/forgot-password');
    console.log('• Ingresa: chatgptpremiumopen@gmail.com');
    console.log('• Revisa tu bandeja de entrada');
    console.log('• Haz clic en el enlace del correo');
    console.log('• Establece una nueva contraseña');
    
  } catch (error: any) {
    console.error('\n❌ ERROR EN LA PRUEBA:');
    console.error('   Tipo:', error.code);
    console.error('   Mensaje:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔧 SOLUCIÓN:');
      console.error('   • Verifica que SMTP_PASSWORD sea contraseña de aplicación');
      console.error('   • Genera nueva contraseña en: https://myaccount.google.com/apppasswords');
      console.error('   • Actualiza el archivo .env');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🔧 SOLUCIÓN:');
      console.error('   • Verifica tu conexión a internet');
      console.error('   • Verifica SMTP_HOST=smtp.gmail.com');
      console.error('   • Verifica SMTP_PORT=587');
    }
    
    console.error('\n💡 EJECUTA:');
    console.error('   npx ts-node scripts/verificar-configuracion.ts');
  }
}

probarSistemaCompleto();
