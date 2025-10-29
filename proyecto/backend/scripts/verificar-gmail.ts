/**
 * Script para verificar configuración de Gmail
 */

import nodemailer from 'nodemailer';

async function verificarConfiguracionGmail() {
  console.log('🔍 VERIFICANDO CONFIGURACIÓN DE GMAIL');
  console.log('=' .repeat(50));
  
  try {
    // Crear transporter con configuración del .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    console.log('\n📧 Configuración actual:');
    console.log('   SMTP_HOST:', process.env.SMTP_HOST || 'No configurado');
    console.log('   SMTP_PORT:', process.env.SMTP_PORT || 'No configurado');
    console.log('   SMTP_USER:', process.env.SMTP_USER || 'No configurado');
    console.log('   SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'Configurado' : 'No configurado');
    console.log('   FRONTEND_URL:', process.env.FRONTEND_URL || 'No configurado');

    console.log('\n🔌 Verificando conexión SMTP...');
    
    // Verificar conexión
    await transporter.verify();
    
    console.log('✅ ¡CONEXIÓN EXITOSA!');
    console.log('   El servidor SMTP está funcionando correctamente');
    console.log('   chatgptpremiumopen@gmail.com está configurado');
    
    console.log('\n📧 Probando envío de correo de prueba...');
    
    // Enviar correo de prueba
    const info = await transporter.sendMail({
      from: `"TESCHI - Sistema de Gestión Documental" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Enviar a sí mismo para prueba
      subject: '🧪 Prueba de Configuración - Sistema TESCHI',
      html: `
        <h2>✅ Configuración Exitosa</h2>
        <p>El sistema de correo está funcionando correctamente.</p>
        <p><strong>Correo configurado:</strong> ${process.env.SMTP_USER}</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
        <hr>
        <p><em>Sistema Universitario de Gestión Documental Digital</em></p>
      `,
    });

    console.log('✅ ¡CORREO ENVIADO EXITOSAMENTE!');
    console.log('   Message ID:', info.messageId);
    console.log('   Revisa tu bandeja de entrada en:', process.env.SMTP_USER);
    
    console.log('\n🎉 CONFIGURACIÓN COMPLETA');
    console.log('   • Gmail configurado correctamente');
    console.log('   • Conexión SMTP verificada');
    console.log('   • Envío de correo funcionando');
    
    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('   1. Reinicia el servidor: npm run dev');
    console.log('   2. Ve a: http://localhost:3000/forgot-password');
    console.log('   3. Prueba con cualquier email');
    console.log('   4. Deberías recibir el correo de restablecimiento');

  } catch (error: any) {
    console.error('\n❌ ERROR EN LA CONFIGURACIÓN:');
    console.error('   Mensaje:', error.message);
    
    if (error.code === 'EAUTH') {
      console.error('\n🔧 SOLUCIÓN:');
      console.error('   1. Verifica que SMTP_USER=chatgptpremiumopen@gmail.com');
      console.error('   2. Verifica que SMTP_PASSWORD sea la contraseña de aplicación');
      console.error('   3. Asegúrate de que la verificación en 2 pasos esté activada');
      console.error('   4. Genera una nueva contraseña de aplicación si es necesario');
    } else if (error.code === 'ECONNECTION') {
      console.error('\n🔧 SOLUCIÓN:');
      console.error('   1. Verifica tu conexión a internet');
      console.error('   2. Verifica que SMTP_HOST=smtp.gmail.com');
      console.error('   3. Verifica que SMTP_PORT=587');
    }
    
    console.error('\n📋 REVISAR ARCHIVO .env:');
    console.error('   • SMTP_USER=chatgptpremiumopen@gmail.com');
    console.error('   • SMTP_PASSWORD=contraseña_de_16_caracteres_sin_espacios');
  }
}

verificarConfiguracionGmail();
