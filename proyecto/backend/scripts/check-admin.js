const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdmin() {
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
    console.log(`   Nombre: ${admin.nombre} ${admin.apellidoPaterno} ${admin.apellidoMaterno}`);
    console.log(`   Rol: ${admin.rol}`);
    console.log(`   Activo: ${admin.activo}`);
    console.log(`   Email Verificado: ${admin.emailVerificado}`);
    console.log(`   Primer Login: ${admin.primerLogin}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin();

