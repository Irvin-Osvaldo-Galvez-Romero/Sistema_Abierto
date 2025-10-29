import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function verificarAdmin() {
  try {
    console.log('🔍 Verificando usuario administrador...');
    
    const admin = await prisma.usuario.findUnique({
      where: { email: 'admin@teschi.edu.mx' },
    });

    if (!admin) {
      console.log('❌ No se encontró el usuario administrador');
      return;
    }

    console.log('✅ Usuario encontrado:');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Nombre: ${admin.nombre} ${admin.apellidoPaterno} ${admin.apellidoPaterno}`);
    console.log(`   Rol: ${admin.rol}`);
    console.log(`   Activo: ${admin.activo}`);
    console.log(`   Email Verificado: ${admin.emailVerificado}`);
    console.log(`   Primer Login: ${admin.primerLogin}`);

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare('Admin123', admin.password);
    console.log(`   Contraseña correcta: ${passwordMatch}`);

    if (!passwordMatch) {
      console.log('❌ La contraseña no coincide');
      console.log('🔧 Actualizando contraseña...');
      
      const newHashedPassword = await bcrypt.hash('Admin123', 10);
      await prisma.usuario.update({
        where: { email: 'admin@teschi.edu.mx' },
        data: { password: newHashedPassword }
      });
      
      console.log('✅ Contraseña actualizada');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verificarAdmin();

