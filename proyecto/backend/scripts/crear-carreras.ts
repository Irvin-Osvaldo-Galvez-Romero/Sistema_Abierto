/**
 * Script para crear carreras del TESCHI
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function crearCarreras() {
  try {
    console.log('🔧 Creando carreras del TESCHI...');

    const carreras = [
      { 
        clave: 'ISC', 
        nombre: 'Ingeniería en Sistemas Computacionales',
        descripcion: 'Formación en desarrollo de software y sistemas',
        duracionSemestres: 10,
        creditos: 300,
        modalidad: 'PRESENCIAL' as const
      },
      { 
        clave: 'II', 
        nombre: 'Ingeniería Industrial',
        descripcion: 'Optimización de procesos industriales',
        duracionSemestres: 10,
        creditos: 300,
        modalidad: 'PRESENCIAL' as const
      },
      { 
        clave: 'LA', 
        nombre: 'Licenciatura en Administración',
        descripcion: 'Gestión empresarial y administrativa',
        duracionSemestres: 8,
        creditos: 240,
        modalidad: 'PRESENCIAL' as const
      },
      { 
        clave: 'LC', 
        nombre: 'Licenciatura en Contaduría',
        descripcion: 'Contabilidad y finanzas empresariales',
        duracionSemestres: 8,
        creditos: 240,
        modalidad: 'PRESENCIAL' as const
      },
      { 
        clave: 'LTI', 
        nombre: 'Licenciatura en Tecnologías de la Información',
        descripcion: 'Tecnologías de la información y comunicación',
        duracionSemestres: 8,
        creditos: 240,
        modalidad: 'PRESENCIAL' as const
      }
    ];

    for (const carrera of carreras) {
      await prisma.carrera.upsert({
        where: { clave: carrera.clave },
        update: {},
        create: carrera
      });
      console.log(`✅ Carrera creada: ${carrera.clave} - ${carrera.nombre}`);
    }

    console.log('🎉 Todas las carreras creadas exitosamente');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

crearCarreras();
