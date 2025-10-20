/**
 * Script para Generar Credenciales de Correo de Prueba
 * Usa Ethereal Email para crear credenciales temporales automáticamente
 */

import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

async function generarCredenciales() {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  📧 GENERANDO CREDENCIALES DE CORREO DE PRUEBA');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
  
  try {
    // Crear cuenta de prueba en Ethereal Email
    console.log('Generando cuenta de prueba en Ethereal Email...');
    const testAccount = await nodemailer.createTestAccount();
    
    console.log('');
    console.log('✅ ¡Credenciales generadas exitosamente!');
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  CREDENCIALES DE PRUEBA');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log(`Host:     ${testAccount.smtp.host}`);
    console.log(`Port:     ${testAccount.smtp.port}`);
    console.log(`Username: ${testAccount.user}`);
    console.log(`Password: ${testAccount.pass}`);
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    
    // Actualizar archivo .env
    const envPath = path.join(__dirname, '..', '.env');
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Actualizar variables SMTP
    envContent = envContent.replace(/SMTP_HOST=.*/g, `SMTP_HOST=${testAccount.smtp.host}`);
    envContent = envContent.replace(/SMTP_PORT=.*/g, `SMTP_PORT=${testAccount.smtp.port}`);
    envContent = envContent.replace(/SMTP_USER=.*/g, `SMTP_USER=${testAccount.user}`);
    envContent = envContent.replace(/SMTP_PASSWORD=.*/g, `SMTP_PASSWORD=${testAccount.pass}`);
    
    // Asegurar que FRONTEND_URL esté configurado
    if (!envContent.includes('FRONTEND_URL=')) {
      envContent += '\nFRONTEND_URL=http://localhost:3000\n';
    }
    
    // Guardar archivo .env actualizado
    fs.writeFileSync(envPath, envContent);
    
    console.log('✅ Archivo .env actualizado correctamente');
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('  📝 IMPORTANTE - CÓMO VER LOS CORREOS');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('Los correos NO se envían realmente a direcciones reales.');
    console.log('En su lugar, puedes verlos en:');
    console.log('');
    console.log(`🌐 URL: ${testAccount.web}`);
    console.log('');
    console.log('O usa estas credenciales para ver los correos en:');
    console.log('https://ethereal.email/login');
    console.log('');
    console.log(`Email:    ${testAccount.user}`);
    console.log(`Password: ${testAccount.pass}`);
    console.log('');
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🚀 PRÓXIMOS PASOS');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('1. ⚠️  REINICIA EL BACKEND (Ctrl+C y npm start)');
    console.log('2. Crea un usuario de prueba desde el admin');
    console.log('3. Los logs mostrarán: "📧 Correo enviado..."');
    console.log('4. Ve a la URL de Ethereal para ver el correo');
    console.log('');
    
    // Guardar credenciales en un archivo aparte
    const credencialesPath = path.join(__dirname, '..', 'credenciales-correo-prueba.txt');
    const credencialesContent = `
═══════════════════════════════════════════════════════
CREDENCIALES DE CORREO DE PRUEBA - ETHEREAL EMAIL
═══════════════════════════════════════════════════════

Generadas el: ${new Date().toLocaleString('es-MX')}

SMTP:
  Host:     ${testAccount.smtp.host}
  Port:     ${testAccount.smtp.port}
  Username: ${testAccount.user}
  Password: ${testAccount.pass}

VER CORREOS EN:
  URL Directa: ${testAccount.web}
  
  O en: https://ethereal.email/login
  Email:    ${testAccount.user}
  Password: ${testAccount.pass}

NOTA IMPORTANTE:
Los correos enviados NO llegan a direcciones reales.
Todos los correos se capturan y puedes verlos en la URL de arriba.

═══════════════════════════════════════════════════════
`;
    
    fs.writeFileSync(credencialesPath, credencialesContent);
    console.log(`✅ Credenciales guardadas en: ${credencialesPath}`);
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('❌ Error al generar credenciales:', error);
    console.error('');
    throw error;
  }
}

// Ejecutar
generarCredenciales()
  .then(() => {
    console.log('');
    console.log('✨ ¡Configuración completada!');
    console.log('');
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

