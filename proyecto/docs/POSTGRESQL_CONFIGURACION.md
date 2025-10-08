# 🐘 Configuración Paso a Paso de PostgreSQL

## 📋 Guía Visual para Configurar PostgreSQL

### PASO 1: Abrir pgAdmin 4

1. **Buscar pgAdmin 4**:
   - Presiona `Windows + S`
   - Escribe "pgAdmin 4"
   - Haz clic en la aplicación

2. **Primera configuración**:
   - Si es la primera vez, te pedirá crear una contraseña maestra
   - Anota esta contraseña, la necesitarás para acceder a pgAdmin

3. **Interfaz de pgAdmin**:
   - Se abrirá en tu navegador (generalmente en http://localhost:5050)
   - Verás el panel izquierdo con "Servers"

### PASO 2: Conectar al Servidor PostgreSQL

1. **Expandir "Servers"**:
   - Haz clic en la flecha junto a "Servers"
   - Deberías ver "PostgreSQL 15" (o tu versión)

2. **Conectar al servidor**:
   - Haz clic derecho en "PostgreSQL 15"
   - Selecciona "Properties" o haz doble clic
   - Te pedirá la contraseña del usuario `postgres`

3. **Credenciales por defecto**:
   - **Usuario**: `postgres`
   - **Contraseña**: La que configuraste durante la instalación de PostgreSQL
   - **Puerto**: `5432`
   - **Host**: `localhost`

### PASO 3: Crear Base de Datos

1. **Crear nueva base de datos**:
   - Haz clic derecho en "Databases"
   - Selecciona "Create" → "Database..."

2. **Configurar la base de datos**:
   - **General Tab**:
     - Name: `sistema_universitario`
     - Owner: `postgres`
     - Encoding: `UTF8`
     - Collation: `en_US.UTF-8`
     - Character Type: `en_US.UTF-8`

   - **Definition Tab**:
     - Template: `template0`
     - Connection limit: `-1` (sin límite)

3. **Guardar**:
   - Haz clic en "Save"
   - La base de datos aparecerá en el panel izquierdo

### PASO 4: Crear Usuario de Aplicación

1. **Crear nuevo rol**:
   - Haz clic derecho en "Login/Group Roles"
   - Selecciona "Create" → "Login/Group Role..."

2. **Configurar el rol**:
   - **General Tab**:
     - Name: `univ_app`
     - Password: `univ_app_password_2024` (cámbiala por una segura)
     - Account expires: `Never`

   - **Privileges Tab**:
     - Can login: ✅
     - Create roles: ❌
     - Create databases: ❌
     - Inherit privileges: ✅
     - Superuser: ❌

   - **Definition Tab**:
     - Connection limit: `-1`
     - Password encryption: `MD5`

3. **Guardar el rol**:
   - Haz clic en "Save"

### PASO 5: Otorgar Permisos

1. **Seleccionar la base de datos**:
   - Haz clic en `sistema_universitario` en el panel izquierdo
   - Ve a la pestaña "Properties"

2. **Configurar permisos**:
   - Ve a la pestaña "Security"
   - Haz clic en "+" para agregar un privilegio
   - Selecciona `univ_app` como Role
   - Otorga los siguientes permisos:
     - **Usage**: ✅
     - **Create**: ✅
     - **Connect**: ✅

3. **Guardar cambios**:
   - Haz clic en "Save"

### PASO 6: Verificar Conexión

1. **Probar conexión**:
   - Ve a "Tools" → "Query Tool"
   - Ejecuta esta consulta:
   ```sql
   SELECT version();
   SELECT current_database();
   SELECT current_user;
   ```

2. **Resultado esperado**:
   - Deberías ver la versión de PostgreSQL
   - La base de datos actual: `sistema_universitario`
   - El usuario actual: `postgres`

### PASO 7: Configurar Variables de Entorno

1. **Crear archivo .env**:
   - Ve a la carpeta `backend` del proyecto
   - Copia `env.example` a `.env`
   - Edita el archivo `.env`

2. **Configurar conexión**:
   ```env
   DATABASE_URL="postgresql://univ_app:univ_app_password_2024@localhost:5432/sistema_universitario?schema=public"
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sistema_universitario
   DB_USER=univ_app
   DB_PASSWORD=univ_app_password_2024
   ```

### PASO 8: Probar Conexión desde Node.js

1. **Crear script de prueba**:
   ```javascript
   // test-connection.js
   const { Pool } = require('pg');
   
   const pool = new Pool({
     user: 'univ_app',
     host: 'localhost',
     database: 'sistema_universitario',
     password: 'univ_app_password_2024',
     port: 5432,
   });
   
   pool.query('SELECT NOW()', (err, res) => {
     if (err) {
       console.error('Error de conexión:', err);
     } else {
       console.log('✅ Conexión exitosa!');
       console.log('Hora actual:', res.rows[0].now);
     }
     pool.end();
   });
   ```

2. **Ejecutar prueba**:
   ```bash
   cd backend
   node test-connection.js
   ```

### PASO 9: Configurar Extensiones Útiles

1. **Ejecutar en Query Tool**:
   ```sql
   -- Habilitar extensión UUID
   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
   
   -- Habilitar extensión para búsqueda de texto
   CREATE EXTENSION IF NOT EXISTS "pg_trgm";
   
   -- Verificar extensiones instaladas
   SELECT * FROM pg_extension;
   ```

### PASO 10: Configurar Parámetros de Rendimiento

1. **En Query Tool, ejecutar**:
   ```sql
   -- Configuraciones básicas para desarrollo
   ALTER SYSTEM SET shared_buffers = '256MB';
   ALTER SYSTEM SET effective_cache_size = '1GB';
   ALTER SYSTEM SET maintenance_work_mem = '64MB';
   ALTER SYSTEM SET checkpoint_completion_target = 0.9;
   ALTER SYSTEM SET wal_buffers = '16MB';
   ALTER SYSTEM SET default_statistics_target = 100;
   ALTER SYSTEM SET random_page_cost = 1.1;
   ALTER SYSTEM SET effective_io_concurrency = 200;
   
   -- Recargar configuración
   SELECT pg_reload_conf();
   ```

## 🚨 Solución de Problemas Comunes

### Error: "Password authentication failed"
**Solución**: Verificar que la contraseña del usuario `postgres` sea correcta

### Error: "Database does not exist"
**Solución**: Asegurarse de que la base de datos `sistema_universitario` esté creada

### Error: "Permission denied"
**Solución**: Verificar que el usuario `univ_app` tenga los permisos correctos

### Error: "Connection refused"
**Solución**: Verificar que el servicio PostgreSQL esté ejecutándose

### Error: "Role does not exist"
**Solución**: Crear el rol `univ_app` con los pasos anteriores

## 📞 Comandos Útiles de PostgreSQL

```sql
-- Ver bases de datos
\l

-- Ver usuarios/roles
\du

-- Conectar a una base de datos
\c sistema_universitario

-- Ver tablas
\dt

-- Ver esquemas
\dn

-- Salir
\q
```

## ✅ Checklist de Verificación

- [ ] pgAdmin 4 abierto y funcionando
- [ ] Conexión al servidor PostgreSQL establecida
- [ ] Base de datos `sistema_universitario` creada
- [ ] Usuario `univ_app` creado
- [ ] Permisos otorgados correctamente
- [ ] Archivo `.env` configurado
- [ ] Conexión desde Node.js funcionando
- [ ] Extensiones básicas instaladas
- [ ] Parámetros de rendimiento configurados

---

**¡Configuración completada!** 🎉

Tu base de datos PostgreSQL está lista para el Sistema Universitario.
