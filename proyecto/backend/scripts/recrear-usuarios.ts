/**
 * Script para recrear usuarios después de resetear la base de datos
 */

import { PrismaClient, Rol } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

interface UsuarioData {
  email: string;
  password: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  rol: Rol;
  matricula?: string;
  numeroEmpleado?: string;
}

const usuarios: UsuarioData[] = [
  // Super Admin
  {
    email: 'admin@teschi.edu.mx',
    password: 'Admin123!',
    nombre: 'Administrador',
    apellidoPaterno: 'Sistema',
    rol: Rol.SUPER_ADMIN,
  },
  // Estudiantes
  {
    email: '2022452150@teschi.edu.mx',
    password: 'Alumno123!',
    nombre: 'Estudiante',
    apellidoPaterno: 'Uno',
    matricula: '2022452150',
    rol: Rol.ESTUDIANTE,
  },
  {
    email: '2022452138@teschi.edu.mx',
    password: 'Alumno123!',
    nombre: 'Estudiante',
    apellidoPaterno: 'Dos',
    matricula: '2022452138',
    rol: Rol.ESTUDIANTE,
  },
  {
    email: '2022452166@teschi.edu.mx',
    password: 'Alumno123!',
    nombre: 'Estudiante',
    apellidoPaterno: 'Tres',
    matricula: '2022452166',
    rol: Rol.ESTUDIANTE,
  },
  {
    email: '2022452137@teschi.edu.mx',
    password: 'Alumno123!',
    nombre: 'Estudiante',
    apellidoPaterno: 'Cuatro',
    matricula: '2022452137',
    rol: Rol.ESTUDIANTE,
  },
  {
    email: '20224521390@teschi.edu.mx',
    password: 'Alumno123!',
    nombre: 'Estudiante',
    apellidoPaterno: 'Cinco',
    matricula: '20224521390',
    rol: Rol.ESTUDIANTE,
  },
  {
    email: '202245213939@teschi.edu.mx',
    password: 'Alumno123!',
    nombre: 'Estudiante',
    apellidoPaterno: 'Seis',
    matricula: '202245213939',
    rol: Rol.ESTUDIANTE,
  },
  {
    email: '2021452339@teschi.edu.mx',
    password: 'Alumno123!',
    nombre: 'Estudiante',
    apellidoPaterno: 'Siete',
    matricula: '2021452339',
    rol: Rol.ESTUDIANTE,
  },
  {
    email: '2022452139@teschi.edu.mx',
    password: 'Alumno123!',
    nombre: 'Estudiante',
    apellidoPaterno: 'Ocho',
    matricula: '2022452139',
    rol: Rol.ESTUDIANTE,
  },
];

async function crearUsuarios() {
  console.log('\n🎓 RECREANDO USUARIOS\n');

  for (const usuarioData of usuarios) {
    try {
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(usuarioData.password, 10);

      // Crear usuario
      const usuario = await prisma.usuario.create({
        data: {
          email: usuarioData.email,
          password: hashedPassword,
          nombre: usuarioData.nombre,
          apellidoPaterno: usuarioData.apellidoPaterno,
          apellidoMaterno: usuarioData.apellidoMaterno,
          rol: usuarioData.rol,
          primerLogin: false, // Ya no es primer login
        },
      });

      console.log(`✅ Usuario creado: ${usuarioData.email} (${usuarioData.rol})`);

      // Si es estudiante, crear perfil de estudiante
      if (usuarioData.rol === Rol.ESTUDIANTE && usuarioData.matricula) {
        // Buscar una carrera por defecto o crear una si no existe
        let carrera = await prisma.carrera.findFirst();
        
        if (!carrera) {
          carrera = await prisma.carrera.create({
            data: {
              clave: 'ISC',
              nombre: 'Ingeniería en Sistemas Computacionales',
              duracionSemestres: 9,
              creditos: 250,
              modalidad: 'MIXTA',
            },
          });
          console.log(`✅ Carrera por defecto creada: ${carrera.nombre}`);
        }

        await prisma.estudiante.create({
          data: {
            matricula: usuarioData.matricula,
            usuarioId: usuario.id,
            carreraId: carrera.id,
            estatus: 'ACTIVO',
          },
        });
        console.log(`   └─ Perfil de estudiante creado (Matrícula: ${usuarioData.matricula})`);
      }

      // Si es administrador, crear perfil de administrador
      if (usuarioData.rol === Rol.ADMINISTRADOR || usuarioData.rol === Rol.SUPER_ADMIN) {
        await prisma.administrador.create({
          data: {
            numeroEmpleado: usuarioData.numeroEmpleado || `ADM-${usuario.id.substring(0, 8)}`,
            usuarioId: usuario.id,
            activo: true,
          },
        });
        console.log(`   └─ Perfil de administrador creado`);
      }
    } catch (error: any) {
      if (error.code === 'P2002') {
        console.log(`⚠️  Usuario ya existe: ${usuarioData.email}`);
      } else {
        console.error(`❌ Error al crear ${usuarioData.email}:`, error.message);
      }
    }
  }

  console.log('\n✅ PROCESO COMPLETADO\n');
  console.log('📋 CREDENCIALES CREADAS:\n');
  console.log('SUPER ADMIN:');
  console.log('  admin@teschi.edu.mx / Admin123!\n');
  console.log('ESTUDIANTES:');
  usuarios
    .filter((u) => u.rol === Rol.ESTUDIANTE)
    .forEach((u) => {
      console.log(`  ${u.email} / ${u.password}`);
    });
  console.log('\n');
}

crearUsuarios()
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

