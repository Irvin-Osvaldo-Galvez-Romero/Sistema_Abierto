# Usuarios de Prueba - Sistema Universitario

## Credenciales de Acceso

### 👤 Alumno
- **Email:** `alumno@uni.mx`
- **Contraseña:** `Alumno123!`
- **Rol:** Alumno
- **Matrícula:** A001
- **Acceso:** Vista de alumnos (limitada a sus propios datos en futuras versiones)

### 👨‍💼 Administrador
- **Email:** `admin@uni.mx`
- **Contraseña:** `Admin123!`
- **Rol:** Administrador
- **Acceso:** Dashboard administrativo completo
- **Permisos:** Acceso total al sistema

### 👨‍🏫 Docente
- **Email:** `docente@uni.mx`
- **Contraseña:** `Docente123!`
- **Rol:** Docente
- **Acceso:** Dashboard administrativo
- **Permisos:** Ver alumnos, revisar trámites

## Instalación de Usuarios

Para crear estos usuarios en tu base de datos, ejecuta el script SQL:

```bash
# En SQL Server Management Studio (SSMS):
# 1. Abre el archivo: SQL/seed_usuarios_prueba.sql
# 2. Asegúrate de estar en la base de datos: univ_docs
# 3. Presiona F5 o haz clic en "Execute"
```

El script creará automáticamente:
- ✅ Roles (Alumno, Administrador, Docente, Administrativo)
- ✅ Permisos básicos del sistema
- ✅ Asignación de permisos a roles
- ✅ Los 3 usuarios de prueba con sus roles
- ✅ Registros asociados (alumnos, personal)

## Flujo de Inicio de Sesión

El sistema redirige automáticamente según el rol:

### Login como Alumno
1. Abre `frontend/auth-test.html`
2. Ingresa: `alumno@uni.mx` / `Alumno123!`
3. El sistema te redirige a → `alumnos.html`

### Login como Admin/Docente
1. Abre `frontend/auth-test.html`
2. Ingresa: `admin@uni.mx` / `Admin123!` (o docente@uni.mx)
3. El sistema te redirige a → `dashboard-admin.html`

## Características por Rol

### Alumno
- ✅ Ver listado de alumnos
- ✅ Ver detalles de alumnos
- ✅ Buscar alumnos
- 🚧 Ver sus propios trámites (pendiente)
- 🚧 Iniciar nuevos trámites (pendiente)

### Docente
- ✅ Acceso al dashboard administrativo
- ✅ Ver listado completo de alumnos
- ✅ Ver detalles y trámites de alumnos
- 🚧 Revisar y aprobar trámites (pendiente)
- 🚧 Ver reportes (pendiente)

### Administrador
- ✅ Acceso completo al dashboard administrativo
- ✅ Gestión de alumnos
- ✅ Ver estadísticas del sistema
- 🚧 Gestión de usuarios y roles (pendiente)
- 🚧 Configuración del sistema (pendiente)
- 🚧 Reportes avanzados (pendiente)

## Verificación de Instalación

Después de ejecutar el script, verifica que los usuarios se crearon correctamente:

```sql
-- Verificar usuarios y sus roles
SELECT 
    u.correo,
    u.nombre + ' ' + u.apellidos AS nombre_completo,
    r.nombre AS rol
FROM usuarios u
INNER JOIN usuarios_roles ur ON ur.usuario_id = u.id
INNER JOIN roles r ON r.id = ur.rol_id
WHERE u.correo IN ('alumno@uni.mx', 'admin@uni.mx', 'docente@uni.mx')
ORDER BY u.correo;
```

## Notas de Seguridad

⚠️ **IMPORTANTE:** Estos usuarios son solo para desarrollo y pruebas.

En producción:
- Cambia todas las contraseñas por unas seguras
- Elimina o desactiva usuarios de prueba
- Implementa políticas de contraseñas fuertes
- Habilita autenticación de dos factores
- Registra todos los accesos en auditoría

## Solución de Problemas

### Error: "Credenciales inválidas"
- Verifica que el script SQL se haya ejecutado correctamente
- Revisa que la base de datos `univ_docs` esté activa
- Comprueba que exista al menos un programa y departamento

### Error: "No tienes permisos"
- Verifica que el usuario tenga roles asignados en `usuarios_roles`
- Revisa la tabla `roles` para confirmar que existen los roles

### No se redirige automáticamente
- Limpia el localStorage del navegador
- Verifica que el backend esté corriendo en `http://localhost:4000`
- Revisa la consola del navegador para errores

## Regenerar Contraseñas

Si necesitas generar nuevos hashes de contraseñas:

```bash
cd proyecto/backend
node scripts/generar-usuarios.js
```

Esto generará nuevos hashes bcrypt que puedes usar en el script SQL.

---

**Última actualización:** Septiembre 2025  
**Versión del sistema:** 1.0 MVP
