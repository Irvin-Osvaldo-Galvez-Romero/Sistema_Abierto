/**
 * Script de prueba para verificar documentos en la base de datos
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('\n📄 VERIFICACIÓN DE DOCUMENTOS\n');

  // Obtener todos los documentos
  const documentos = await prisma.documento.findMany({
    include: {
      documentosEstudiante: {
        include: {
          estudiante: {
            include: {
              usuario: {
                select: {
                  nombre: true,
                  apellidoPaterno: true,
                },
              },
            },
          },
        },
      },
    },
  });

  console.log(`Total de documentos en la BD: ${documentos.length}\n`);

  if (documentos.length === 0) {
    console.log('❌ No hay documentos en la base de datos');
    console.log('   Necesitas subir documentos desde el sistema\n');
    return;
  }

  // Verificar cada documento
  for (const doc of documentos) {
    const estudianteData = doc.documentosEstudiante[0];
    const estudiante = estudianteData?.estudiante;
    const usuario = estudiante?.usuario;

    console.log(`\n📋 Documento: ${doc.folio}`);
    console.log(`   ID: ${doc.id}`);
    console.log(`   Tipo: ${doc.tipo}`);
    console.log(`   Estatus: ${doc.estatus}`);
    console.log(`   Estudiante: ${usuario?.nombre} ${usuario?.apellidoPaterno}`);
    console.log(`   Ruta: ${doc.rutaArchivo}`);
    console.log(`   MIME Type: ${doc.mimeType}`);
    console.log(`   Tamaño: ${(doc.tamanoBytes / 1024).toFixed(2)} KB`);

    // Verificar si el archivo existe
    const filePath = path.join(process.cwd(), doc.rutaArchivo);
    const exists = fs.existsSync(filePath);
    
    if (exists) {
      console.log(`   ✅ Archivo existe en disco`);
      const stats = fs.statSync(filePath);
      console.log(`   📦 Tamaño real: ${(stats.size / 1024).toFixed(2)} KB`);
    } else {
      console.log(`   ❌ Archivo NO existe en disco`);
      console.log(`   📍 Ruta completa: ${filePath}`);
    }
  }

  // Resumen
  const existentes = documentos.filter(doc => {
    const filePath = path.join(process.cwd(), doc.rutaArchivo);
    return fs.existsSync(filePath);
  });

  console.log(`\n\n📊 RESUMEN:`);
  console.log(`   Total documentos en BD: ${documentos.length}`);
  console.log(`   Archivos existentes: ${existentes.length}`);
  console.log(`   Archivos faltantes: ${documentos.length - existentes.length}`);

  if (existentes.length > 0) {
    console.log(`\n✅ Hay ${existentes.length} documento(s) listo(s) para previsualizar/descargar`);
    console.log(`\nPuedes probar con estos IDs:`);
    existentes.slice(0, 3).forEach(doc => {
      console.log(`   • ${doc.id} - ${doc.tipo} - ${doc.folio}`);
    });
    
    console.log(`\nURLs de prueba:`);
    const token = 'TU_TOKEN_AQUI';
    existentes.slice(0, 1).forEach(doc => {
      console.log(`   Vista previa: http://localhost:3001/api/upload/view/${doc.id}?token=${token}`);
      console.log(`   Descarga: http://localhost:3001/api/upload/download/${doc.id}`);
    });
  } else {
    console.log(`\n❌ No hay documentos disponibles para previsualizar`);
    console.log(`   Por favor, sube documentos desde el sistema primero`);
  }

  console.log('\n');
}

main()
  .catch((error) => {
    console.error('\n❌ ERROR:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


