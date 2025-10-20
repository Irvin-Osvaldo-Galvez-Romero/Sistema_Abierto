/**
 * Script para corregir las rutas absolutas de los documentos existentes
 */

import { PrismaClient } from '@prisma/client';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('\n🔧 CORRIGIENDO RUTAS DE DOCUMENTOS\n');

  // Obtener todos los documentos
  const documentos = await prisma.documento.findMany();

  console.log(`Total de documentos: ${documentos.length}\n`);

  let corregidos = 0;
  let errores = 0;

  for (const doc of documentos) {
    console.log(`Procesando: ${doc.folio}`);
    console.log(`  Ruta actual: ${doc.rutaArchivo}`);

    // Si la ruta es absoluta, corregirla
    if (path.isAbsolute(doc.rutaArchivo)) {
      // Extraer solo la parte uploads/...
      const match = doc.rutaArchivo.match(/uploads[\\\/].+$/);
      
      if (match) {
        const rutaRelativa = match[0].replace(/\\/g, '/'); // Normalizar barras
        
        console.log(`  Ruta corregida: ${rutaRelativa}`);
        
        try {
          await prisma.documento.update({
            where: { id: doc.id },
            data: { rutaArchivo: rutaRelativa },
          });
          
          console.log(`  ✅ Corregido`);
          corregidos++;
        } catch (error) {
          console.log(`  ❌ Error al actualizar`);
          errores++;
        }
      } else {
        console.log(`  ⚠️  No se pudo extraer ruta relativa`);
        errores++;
      }
    } else {
      console.log(`  ℹ️  Ya es ruta relativa`);
    }
    
    console.log('');
  }

  console.log('\n📊 RESUMEN:');
  console.log(`   Total: ${documentos.length}`);
  console.log(`   Corregidos: ${corregidos}`);
  console.log(`   Errores: ${errores}`);
  console.log(`   Sin cambios: ${documentos.length - corregidos - errores}`);
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


