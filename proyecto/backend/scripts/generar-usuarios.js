// Script para generar hashes de contraseñas y crear usuarios de prueba
import bcrypt from 'bcryptjs';

async function generarHash(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log(`Contraseña: ${password}`);
  console.log(`Hash: ${hash}`);
  console.log('---');
}

console.log('Generando hashes de contraseñas...\n');

(async () => {
  await generarHash('Alumno123!');
  await generarHash('Admin123!');
  await generarHash('Docente123!');
})();
