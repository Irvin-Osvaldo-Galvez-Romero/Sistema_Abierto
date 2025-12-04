import { PrismaClient, Rol } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PASSWORDS: Record<Rol, string> = {
  SUPER_ADMIN: 'Admin123!',
  ADMINISTRADOR: 'Admin123!',
  PERSONAL_ADMINISTRATIVO: 'Admin123!',
  PROFESOR: 'Profesor123!',
  ESTUDIANTE: 'Alumno123!',
};

async function main(): Promise<void> {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      email: true,
      rol: true,
    },
  });

  if (!usuarios.length) {
    console.log('No hay usuarios para actualizar.');
    return;
  }

  console.log('Actualizando contraseñas...');

  for (const usuario of usuarios) {
    const nuevaPassword = PASSWORDS[usuario.rol];
    const hashed = await bcrypt.hash(nuevaPassword, 10);

    await prisma.usuario.update({
      where: { id: usuario.id },
      data: {
        password: hashed,
        intentosFallidos: 0,
        bloqueadoHasta: null,
        primerLogin: false,
      },
    });

    console.log(`✓ ${usuario.email} -> ${nuevaPassword}`);
  }
}

main()
  .catch((error) => {
    console.error('Error al actualizar contraseñas:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

