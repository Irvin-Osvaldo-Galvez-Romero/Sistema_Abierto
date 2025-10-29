/**
 * Script para verificar y configurar Gmail automáticamente
 */

import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

async function verificarYConfigurarGmail() {
  console.log('🔧 VERIFICACIÓN Y CONFIGURACIÓN AUTOMÁTICA DE GMAIL');
  console.log('=' .repeat(60));
  
  const envPath = path.join(process.cwd(), '.env');
  
  try {
    // Verificar si existe el archivo .env
    if (!fs.existsSync(envPath)) {
      console.log('❌ Archivo .env no encontrado');
      console.log('💡 Ejecuta primero: npx ts-node scripts/guia-completa-gmail.ts');
      return;
    }
    
    // Leer configuración actual
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    let smtpUser = '';
    let smtpPassword = '';
    let smtpHost = '';
    let smtpPort = '';
    
    lines.forEach(line => {
      if (line.startsWith('SMTP_USER=')) {
        smtpUser = line.split('=')[1];
      } else if (line.startsWith('SMTP_PASSWORD=')) {
        smtpPassword = line.split('=')[1];
      } else if (line.startsWith('SMTP_HOST=')) {
        smtpHost = line.split('=')[1];
      } else if (line.startsWith('SMTP_PORT=')) {
        smtpPort = line.split('=')[1];
      }
    });
    
    console.log('\n📊 CONFIGURACIÓN ACTUAL:');
    console.log('=' .repeat(30));
    console.log('   SMTP_HOST:', smtpHost || 'No configurado');
    console.log('   SMTP_PORT:', smtpPort || 'No configurado');
    console.log('   SMTP_USER:', smtpUser || 'No configurado');
    console.log('   SMTP_PASSWORD:', smtpPassword ? 'Configurado' : 'No configurado');
    
    // Verificar configuración específica
    console.log('\n🔍 VERIFICACIÓN DE CONFIGURACIÓN:');
    console.log('=' .repeat(35));
    
    let configuracionCorrecta = true;
    
    if (smtpUser !== 'chatgptpremiumopen@gmail.com') {
      console.log('❌ SMTP_USER debe ser: chatgptpremiumopen@gmail.com');
      console.log('   Actual:', smtpUser);
      configuracionCorrecta = false;
    } else {
      console.log('✅ SMTP_USER configurado correctamente');
    }
    
    if (!smtpPassword || smtpPassword === 'tu_contraseña_de_aplicacion' || smtpPassword === 'AQUI_VA_TU_CONTRASEÑA_DE_APLICACION') {
      console.log('❌ SMTP_PASSWORD no está configurado');
      console.log('   Necesitas generar una contraseña de aplicación');
      configuracionCorrecta = false;
    } else if (smtpPassword.length !== 16) {
      console.log('❌ SMTP_PASSWORD debe tener exactamente 16 caracteres');
      console.log('   Longitud actual:', smtpPassword.length);
      configuracionCorrecta = false;
    } else {
      console.log('✅ SMTP_PASSWORD configurado correctamente');
    }
    
    if (smtpHost !== 'smtp.gmail.com') {
      console.log('❌ SMTP_HOST debe ser: smtp.gmail.com');
      console.log('   Actual:', smtpHost);
      configuracionCorrecta = false;
    } else {
      console.log('✅ SMTP_HOST configurado correctamente');
    }
    
    if (smtpPort !== '587') {
      console.log('❌ SMTP_PORT debe ser: 587');
      console.log('   Actual:', smtpPort);
      configuracionCorrecta = false;
    } else {
      console.log('✅ SMTP_PORT configurado correctamente');
    }
    
    if (!configuracionCorrecta) {
      console.log('\n🔄 CONFIGURACIÓN NECESARIA:');
      console.log('=' .repeat(30));
      console.log('1. Ve a: https://myaccount.google.com/apppasswords');
      console.log('2. Genera contraseña de aplicación');
      console.log('3. Actualiza el archivo .env');
      console.log('4. Ejecuta este script nuevamente');
      return;
    }
    
    console.log('\n🚀 PROBANDO CONEXIÓN SMTP:');
    console.log('=' .repeat(30));
    
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
    
    try {
      console.log('🔌 Verificando conexión...');
      await transporter.verify();
      console.log('✅ ¡CONEXIÓN EXITOSA!');
      
      console.log('\n📧 Enviando correo de prueba...');
      const info = await transporter.sendMail({
        from: `"TESCHI - Sistema" <${smtpUser}>`,
        to: smtpUser,
        subject: '🧪 Prueba de Configuración - Sistema TESCHI',
        html: `
          <h2>✅ Configuración Exitosa</h2>
          <p>El sistema de correo está funcionando correctamente.</p>
          <p><strong>Correo:</strong> ${smtpUser}</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
          <hr>
          <p><em>Sistema Universitario de Gestión Documental</em></p>
        `,
      });
      
      console.log('✅ ¡CORREO ENVIADO EXITOSAMENTE!');
      console.log('   Message ID:', info.messageId);
      console.log('   Revisa tu bandeja en:', smtpUser);
      
      console.log('\n🎉 CONFIGURACIÓN COMPLETA Y FUNCIONANDO');
      console.log('=' .repeat(40));
      console.log('✅ Gmail configurado correctamente');
      console.log('✅ Conexión SMTP verificada');
      console.log('✅ Envío de correo funcionando');
      
      console.log('\n🚀 PRÓXIMOS PASOS:');
      console.log('1. npm run dev                    # Iniciar servidor');
      console.log('2. http://localhost:3000/forgot-password');
      console.log('3. Probar con cualquier email');
      
    } catch (error: any) {
      console.error('\n❌ ERROR EN LA CONEXIÓN:');
      console.error('   Tipo:', error.code);
      console.error('   Mensaje:', error.message);
      
      if (error.code === 'EAUTH') {
        console.error('\n🔧 SOLUCIÓN PARA EAUTH:');
        console.error('   • Verifica que la contraseña sea de aplicación');
        console.error('   • Verifica que no tenga espacios');
        console.error('   • Genera una nueva contraseña de aplicación');
        console.error('   • URL: https://myaccount.google.com/apppasswords');
      } else if (error.code === 'ECONNECTION') {
        console.error('\n🔧 SOLUCIÓN PARA ECONNECTION:');
        console.error('   • Verifica tu conexión a internet');
        console.error('   • Verifica SMTP_HOST=smtp.gmail.com');
        console.error('   • Verifica SMTP_PORT=587');
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  }
}

verificarYConfigurarGmail();
