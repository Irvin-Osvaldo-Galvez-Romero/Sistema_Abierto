/**
 * Script para Limpiar Base de Datos
 * Elimina todos los estudiantes y profesores de prueba
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function limpiarBaseDatos() {
  try {
    console.log('');
    console.log('═══════════════════════════════════════════════════════');
    console.log('  🗑️  LIMPIEZA DE BASE DE DATOS');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');

    // Conectar a la base de datos
    await prisma.$connect();
    console.log('✅ Conectado a la base de datos PostgreSQL');
    console.log('');

    // Obtener estadísticas actuales
    const countEstudiantes = await prisma.estudiante.count();
    const countProfesores = await prisma.profesor.count();
    const countDocumentos = await prisma.documento.count();
    const countUsuarios = await prisma.usuario.count();

    console.log('📊 Estado actual de la base de datos:');
    console.log('─────────────────────────────────────────────────────');
    console.log(`   Usuarios:     ${countUsuarios}`);
    console.log(`   Estudiantes:  ${countEstudiantes}`);
    console.log(`   Profesores:   ${countProfesores}`);
    console.log(`   Documentos:   ${countDocumentos}`);
    console.log('');

    // Confirmación
    console.log('⚠️  ADVERTENCIA:');
    console.log('   Esta operación eliminará TODOS los datos de:');
    console.log('   - Documentos subidos');
    console.log('   - Registros de estudiantes-documentos');
    console.log('   - Perfiles de estudiantes');
    console.log('   - Perfiles de profesores');
    console.log('   - Tokens de sesión');
    console.log('   - Registros de actividad');
    console.log('   - Usuarios (excepto administradores)');
    console.log('');
    console.log('   ✅ Se mantendrán: Administradores, Carreras, Tipos de Trámite');
    console.log('');

    // Iniciar limpieza
    console.log('🔄 Iniciando limpieza...');
    console.log('');

    // 1. Eliminar documentos y relaciones
    console.log('1️⃣  Eliminando documentos y relaciones...');
    
    const deletedDocumentoEstudiante = await prisma.documentoEstudiante.deleteMany({});
    console.log(`   ✓ Relaciones documento-estudiante: ${deletedDocumentoEstudiante.count}`);
    
    const deletedDocumentos = await prisma.documento.deleteMany({});
    console.log(`   ✓ Documentos: ${deletedDocumentos.count}`);
    console.log('');

    // 2. Eliminar estudiantes
    console.log('2️⃣  Eliminando estudiantes...');
    const deletedEstudiantes = await prisma.estudiante.deleteMany({});
    console.log(`   ✓ Estudiantes eliminados: ${deletedEstudiantes.count}`);
    console.log('');

    // 3. Eliminar profesores
    console.log('3️⃣  Eliminando profesores...');
    const deletedProfesores = await prisma.profesor.deleteMany({});
    console.log(`   ✓ Profesores eliminados: ${deletedProfesores.count}`);
    console.log('');

    // 4. Eliminar tokens de sesión (excepto de admins)
    console.log('4️⃣  Limpiando tokens de sesión...');
    const deletedTokens = await prisma.tokenSesion.deleteMany({
      where: {
        usuario: {
          rol: {
            in: ['ESTUDIANTE', 'PROFESOR'],
          },
        },
      },
    });
    console.log(`   ✓ Tokens eliminados: ${deletedTokens.count}`);
    console.log('');

    // 5. Eliminar actividad de usuarios no admin
    console.log('5️⃣  Limpiando registros de actividad...');
    const deletedActividad = await prisma.actividadUsuario.deleteMany({
      where: {
        usuario: {
          rol: {
            in: ['ESTUDIANTE', 'PROFESOR'],
          },
        },
      },
    });
    console.log(`   ✓ Actividades eliminadas: ${deletedActividad.count}`);
    console.log('');

    // 6. Eliminar usuarios no admin
    console.log('6️⃣  Eliminando usuarios (excepto administradores)...');
    const deletedUsuarios = await prisma.usuario.deleteMany({
      where: {
        rol: {
          in: ['ESTUDIANTE', 'PROFESOR'],
        },
      },
    });
    console.log(`   ✓ Usuarios eliminados: ${deletedUsuarios.count}`);
    console.log('');

    // 7. Verificar carreras
    console.log('7️⃣  Verificando carreras...');
    const countCarreras = await prisma.carrera.count();
    console.log(`   ✓ Carreras en la base de datos: ${countCarreras}`);
    
    if (countCarreras === 0) {
      console.log('   ⚠️  No hay carreras, insertando carreras del TESCHI...');
      
      const carreras = [
        { nombre: 'Ingeniería en Sistemas Computacionales', clave: 'ISC' },
        { nombre: 'Ingeniería Industrial', clave: 'II' },
        { nombre: 'Ingeniería en Gestión Empresarial', clave: 'IGE' },
        { nombre: 'Ingeniería Mecatrónica', clave: 'IM' },
        { nombre: 'Ingeniería en Tecnologías de la Información y Comunicaciones', clave: 'ITIC' },
        { nombre: 'Licenciatura en Administración', clave: 'LA' },
        { nombre: 'Licenciatura en Contaduría', clave: 'LC' },
      ];

      for (const carrera of carreras) {
        await prisma.carrera.create({
          data: carrera,
        });
      }
      
      console.log(`   ✓ ${carreras.length} carreras insertadas`);
    }
    console.log('');

    // 8. Verificar administradores
    console.log('8️⃣  Verificando administradores...');
    const adminCount = await prisma.usuario.count({
      where: {
        rol: {
          in: ['ADMINISTRADOR', 'SUPER_ADMIN'],
        },
      },
    });
    console.log(`   ✓ Administradores en el sistema: ${adminCount}`);
    console.log('');

    // Estadísticas finales
    const finalUsuarios = await prisma.usuario.count();
    const finalEstudiantes = await prisma.estudiante.count();
    const finalProfesores = await prisma.profesor.count();
    const finalDocumentos = await prisma.documento.count();

    console.log('═══════════════════════════════════════════════════════');
    console.log('  ✅ LIMPIEZA COMPLETADA EXITOSAMENTE');
    console.log('═══════════════════════════════════════════════════════');
    console.log('');
    console.log('📊 Estado final de la base de datos:');
    console.log('─────────────────────────────────────────────────────');
    console.log(`   Usuarios:     ${finalUsuarios} (solo administradores)`);
    console.log(`   Estudiantes:  ${finalEstudiantes}`);
    console.log(`   Profesores:   ${finalProfesores}`);
    console.log(`   Documentos:   ${finalDocumentos}`);
    console.log(`   Carreras:     ${countCarreras}`);
    console.log('');
    console.log('✨ Base de datos lista para nuevos usuarios');
    console.log('');
    console.log('📝 Siguiente paso:');
    console.log('   Crear usuarios de prueba para probar el envío de correos');
    console.log('');

  } catch (error) {
    console.error('');
    console.error('❌ Error durante la limpieza:', error);
    console.error('');
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar
limpiarBaseDatos()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

