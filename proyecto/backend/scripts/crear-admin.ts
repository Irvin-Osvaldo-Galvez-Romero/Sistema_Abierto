/**
 * Script para crear usuario administrador
 * Ejecutar: npx ts-node scripts/crear-admin.ts
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function crearAdmin() {
  try {
    console.log('🔧 Creando usuario administrador...');

    // Verificar si ya existe un admin
    const adminExistente = await prisma.usuario.findFirst({
      where: { rol: 'SUPER_ADMIN' }
    });

    if (adminExistente) {
      console.log('✅ Ya existe un administrador:', adminExistente.email);
      return;
    }

    // Crear administrador
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.usuario.create({
      data: {
        email: 'admin@teschi.edu.mx',
        password: hashedPassword,
        nombre: 'Administrador',
        apellidoPaterno: 'Sistema',
        apellidoMaterno: 'TESCHI',
        telefono: '5551234567',
        rol: 'SUPER_ADMIN',
        activo: true,
        emailVerificado: true,
        primerLogin: false
      }
    });

    console.log('✅ Administrador creado exitosamente:');
    console.log('   Email: admin@teschi.edu.mx');
    console.log('   Password: admin123');
    console.log('   ID:', admin.id);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crearAdmin();


