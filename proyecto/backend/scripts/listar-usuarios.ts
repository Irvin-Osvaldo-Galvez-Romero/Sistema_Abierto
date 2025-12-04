import { prisma } from '../src/config/database';

async function main(): Promise<void> {
  const usuarios = await prisma.usuario.findMany({
    select: {
      id: true,
      email: true,
      rol: true,
      nombre: true,
      apellidoPaterno: true,
      apellidoMaterno: true,
      intentosFallidos: true,
      bloqueadoHasta: true,
      activo: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  if (!usuarios.length) {
    console.log('No hay usuarios registrados en la base de datos.');
    return;
  }

  console.table(
    usuarios.map((usuario) => ({
      ID: usuario.id,
      Email: usuario.email,
      Rol: usuario.rol,
      Nombre: `${usuario.nombre} ${usuario.apellidoPaterno ?? ''} ${usuario.apellidoMaterno ?? ''}`.trim(),
      Activo: usuario.activo,
      Intentos: usuario.intentosFallidos,
      BloqueadoHasta: usuario.bloqueadoHasta?.toISOString() ?? null,
    }))
  );
}

main()
  .catch((error) => {
    console.error('Error al obtener usuarios:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

