/**
 * Script para insertar carreras de ejemplo en la base de datos
 */

import { PrismaClient, Modalidad } from '@prisma/client';

const prisma = new PrismaClient();

const carreras = [
  // Ingenierías - Tecnológico de Estudios Superiores de Chimalhuacán (TESCHI)
  {
    clave: 'ISC',
    nombre: 'Ingeniería en Sistemas Computacionales',
    descripcion: 'Formación de profesionales capaces de diseñar, desarrollar e implementar sistemas computacionales innovadores',
    duracionSemestres: 9,
    creditos: 300,
    modalidad: Modalidad.PRESENCIAL,
  },
  {
    clave: 'II',
    nombre: 'Ingeniería Industrial',
    descripcion: 'Formación de profesionales en la optimización de sistemas productivos, logística y calidad',
    duracionSemestres: 9,
    creditos: 300,
    modalidad: Modalidad.PRESENCIAL,
  },
  {
    clave: 'IQ',
    nombre: 'Ingeniería Química',
    descripcion: 'Formación de profesionales en procesos químicos, control de calidad y desarrollo sustentable',
    duracionSemestres: 9,
    creditos: 300,
    modalidad: Modalidad.PRESENCIAL,
  },
  {
    clave: 'IMT',
    nombre: 'Ingeniería Mecatrónica',
    descripcion: 'Formación de profesionales en sistemas automatizados, robótica y control de procesos industriales',
    duracionSemestres: 9,
    creditos: 300,
    modalidad: Modalidad.PRESENCIAL,
  },
  {
    clave: 'IADEV',
    nombre: 'Ingeniería en Animación Digital y Efectos Visuales',
    descripcion: 'Formación de profesionales en diseño, animación 2D/3D, efectos visuales y producción multimedia',
    duracionSemestres: 9,
    creditos: 300,
    modalidad: Modalidad.PRESENCIAL,
  },
  // Licenciaturas - Tecnológico de Estudios Superiores de Chimalhuacán (TESCHI)
  {
    clave: 'LA',
    nombre: 'Licenciatura en Administración',
    descripcion: 'Formación de profesionales en gestión empresarial, recursos humanos y dirección estratégica',
    duracionSemestres: 8,
    creditos: 280,
    modalidad: Modalidad.PRESENCIAL,
  },
  {
    clave: 'LG',
    nombre: 'Licenciatura en Gastronomía',
    descripcion: 'Formación de profesionales en artes culinarias, administración gastronómica y cultura alimentaria',
    duracionSemestres: 8,
    creditos: 280,
    modalidad: Modalidad.PRESENCIAL,
  },
];

async function main() {
  console.log('\n🎓 INSERTANDO CARRERAS EN LA BASE DE DATOS\n');

  let insertadas = 0;
  let omitidas = 0;

  for (const carrera of carreras) {
    try {
      // Verificar si ya existe
      const existe = await prisma.carrera.findUnique({
        where: { clave: carrera.clave },
      });

      if (existe) {
        console.log(`⏭️  ${carrera.clave} - ${carrera.nombre} (ya existe)`);
        omitidas++;
      } else {
        await prisma.carrera.create({
          data: carrera,
        });
        console.log(`✅ ${carrera.clave} - ${carrera.nombre}`);
        insertadas++;
      }
    } catch (error) {
      console.error(`❌ Error al insertar ${carrera.clave}:`, error);
    }
  }

  console.log('\n📊 RESUMEN:');
  console.log(`   ✅ Insertadas: ${insertadas}`);
  console.log(`   ⏭️  Omitidas (ya existían): ${omitidas}`);
  console.log(`   📋 Total: ${carreras.length}\n`);

  // Mostrar todas las carreras actuales
  const todasLasCarreras = await prisma.carrera.findMany({
    where: { activo: true },
    orderBy: { nombre: 'asc' },
  });

  console.log('📚 CARRERAS DISPONIBLES EN EL SISTEMA:\n');
  
  const ingenierias = todasLasCarreras.filter(c => c.nombre.startsWith('Ingeniería'));
  const licenciaturas = todasLasCarreras.filter(c => c.nombre.startsWith('Licenciatura'));

  if (ingenierias.length > 0) {
    console.log('   Ingenierías:');
    ingenierias.forEach(c => console.log(`   • ${c.nombre} (${c.clave})`));
    console.log('');
  }

  if (licenciaturas.length > 0) {
    console.log('   Licenciaturas:');
    licenciaturas.forEach(c => console.log(`   • ${c.nombre} (${c.clave})`));
    console.log('');
  }

  console.log('✅ Las carreras están listas para usarse en el sistema\n');
}

main()
  .catch((error) => {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


