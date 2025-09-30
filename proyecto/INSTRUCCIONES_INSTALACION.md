# 📋 Instrucciones de Instalación - Sistema Universitario

## Guía Completa de Instalación y Configuración

### 🎯 Requisitos Previos

1. **SQL Server 2019** (o superior)
   - SQL Server Management Studio (SSMS)
   - Full-Text Search habilitado

2. **Node.js 18+**
   - npm o yarn

3. **Navegador Web Moderno**
   - Chrome, Firefox, Edge o Safari

---

## 📦 Paso 1: Configurar la Base de Datos

### 1.1 Ejecutar el Script Principal

1. Abre **SQL Server Management Studio (SSMS)**
2. Conéctate a tu instancia de SQL Server (por ejemplo: `SARFERT`)
3. Abre el archivo: `SQL/univ_docs_mvp.sql`
4. Presiona **F5** o haz clic en **Execute**
5. Verifica que no haya errores

✅ **Resultado esperado:** Base de datos `univ_docs` creada con todas las tablas

### 1.2 Insertar Datos Básicos

1. En SSMS, abre el archivo: `SQL/seed_basico.sql`
2. Asegúrate de estar en la base de datos `univ_docs`
3. Presiona **F5** para ejecutar
4. Verifica que se creó al menos un departamento y un programa

### 1.3 Crear Usuarios de Prueba

1. En SSMS, abre el archivo: `SQL/seed_usuarios_prueba.sql`
2. Asegúrate de estar en la base de datos `univ_docs`
3. Presiona **F5** para ejecutar
4. Verifica el mensaje de confirmación

✅ **Usuarios creados:**
- **Alumno:** `alumno@uni.mx` / `Alumno123!`
- **Administrador:** `admin@uni.mx` / `Admin123!`
- **Docente:** `docente@uni.mx` / `Docente123!`

---

## ⚙️ Paso 2: Configurar el Backend

### 2.1 Instalar Dependencias

```bash
cd proyecto/backend
npm install
```

### 2.2 Configurar Variables de Entorno

El archivo `.env` ya debe existir en `proyecto/backend/.env` con:

```env
PORT=4000
JWT_SECRET=dev_secret_cambia_esto
SQL_SERVER=SARFERT
SQL_DATABASE=univ_docs
SQL_PORT=1433
```

⚠️ **IMPORTANTE:** Ajusta `SQL_SERVER` si tu instancia tiene otro nombre.

#### Autenticación Windows (Por defecto)
No necesitas configurar nada más.

#### Autenticación SQL Server
Agrega estas líneas al `.env`:
```env
SQL_AUTH=sql
SQL_USER=sa
SQL_PASSWORD=TuContraseñaSegura
```

### 2.3 Iniciar el Servidor

```bash
npm run dev
```

✅ **Resultado esperado:** 
```
Auth API listening on port 4000
```

### 2.4 Verificar que el Backend Funciona

Abre otra terminal y ejecuta:

```bash
curl http://localhost:4000/health
```

✅ **Respuesta esperada:** `{"ok":true}`

---

## 🌐 Paso 3: Usar el Frontend

### 3.1 Abrir la Aplicación

1. Navega a la carpeta `proyecto/frontend`
2. Abre el archivo `auth-test.html` en tu navegador
3. O simplemente arrastra el archivo al navegador

### 3.2 Crear una Nueva Cuenta

1. Haz clic en la pestaña **"Crear cuenta"**
2. Llena el formulario:
   - Nombre y apellidos
   - Correo institucional
   - Contraseña (mínimo 8 caracteres)
   - Semestre (opcional)
   - Matrícula
   - **Selecciona tu carrera** del dropdown
3. Haz clic en **Crear cuenta**
4. Tu cuenta será creada automáticamente con rol de Alumno

### 3.3 Probar el Login

#### Como Alumno:
1. Email: `alumno@uni.mx`
2. Contraseña: `Alumno123!`
3. Haz clic en **Ingresar**
4. Serás redirigido automáticamente al **Dashboard de Alumno**

#### Como Administrador:
1. Email: `admin@uni.mx`
2. Contraseña: `Admin123!`
3. Haz clic en **Ingresar**
4. Serás redirigido automáticamente al **Dashboard Administrativo**

#### Como Docente:
1. Email: `docente@uni.mx`
2. Contraseña: `Docente123!`
3. Haz clic en **Ingresar**
4. Serás redirigido automáticamente al **Dashboard Administrativo**

---

## ✅ Verificación de Instalación

### Verificar Base de Datos

```sql
USE univ_docs;

-- Verificar tablas
SELECT COUNT(*) AS total_tablas 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE';
-- Debe ser >= 25 tablas

-- Verificar usuarios de prueba
SELECT correo, nombre, apellidos 
FROM usuarios 
WHERE correo IN ('alumno@uni.mx', 'admin@uni.mx', 'docente@uni.mx');
-- Debe mostrar 3 usuarios

-- Verificar roles
SELECT u.correo, r.nombre AS rol
FROM usuarios u
INNER JOIN usuarios_roles ur ON ur.usuario_id = u.id
INNER JOIN roles r ON r.id = ur.rol_id
WHERE u.correo IN ('alumno@uni.mx', 'admin@uni.mx', 'docente@uni.mx');
-- Debe mostrar cada usuario con su rol
```

### Verificar Backend

```bash
# Terminal 1: Backend debe estar corriendo
npm run dev

# Terminal 2: Probar endpoints
curl http://localhost:4000/health
curl http://localhost:4000/catalogos/programas
```

### Verificar Frontend

1. Abre `frontend/auth-test.html`
2. Verifica que el estado muestre **OK** (verde)
3. Intenta registrar un nuevo alumno o iniciar sesión

---

## 🎨 Funcionalidades Disponibles

### ✅ Completadas

1. **Autenticación**
   - ✅ Registro de alumnos
   - ✅ Login con detección de roles
   - ✅ Refresh token
   - ✅ Redirección automática según rol

2. **Vista de Alumnos**
   - ✅ Listado completo
   - ✅ Búsqueda avanzada
   - ✅ Detalles de alumno
   - ✅ Ver trámites asociados
   - ✅ Estadísticas (total, activos, inactivos, etc.)

3. **Dashboard Administrativo**
   - ✅ Panel de control
   - ✅ Acceso a módulos
   - ✅ Verificación de permisos

### 🚧 En Desarrollo

- Gestión completa de trámites
- Módulo de documentos
- Gestión de usuarios y roles (UI)
- Reportes y análisis
- Notificaciones

---

## 🔧 Solución de Problemas

### Error: "Cannot connect to SQL Server"

**Solución:**
1. Verifica que SQL Server esté corriendo
2. Abre **SQL Server Configuration Manager**
3. Habilita **TCP/IP** en protocolos
4. Verifica el puerto (por defecto 1433)
5. Reinicia el servicio de SQL Server

### Error: "Login failed for user"

**Solución:**
- Verifica las credenciales en `.env`
- Si usas Windows Auth, asegúrate de que tu usuario tenga permisos
- Si usas SQL Auth, verifica que el usuario exista y tenga permisos en la BD

### Error: "Credenciales inválidas" al hacer login

**Solución:**
1. Verifica que ejecutaste `seed_usuarios_prueba.sql`
2. Comprueba que los usuarios existen:
   ```sql
   SELECT * FROM usuarios WHERE correo LIKE '%@uni.mx';
   ```
3. Si no existen, vuelve a ejecutar el script

### Error: "No se puede conectar a localhost:4000"

**Solución:**
1. Verifica que el backend esté corriendo: `npm run dev`
2. Revisa la consola por errores
3. Verifica que el puerto 4000 esté libre
4. Intenta cambiar el puerto en `.env` si está ocupado

### Frontend no muestra datos

**Solución:**
1. Abre la consola del navegador (F12)
2. Revisa errores en la pestaña Console
3. Verifica que el backend responda: `http://localhost:4000/health`
4. Limpia el localStorage del navegador
5. Recarga la página (Ctrl+F5)

---

## 📚 Documentación Adicional

- **Vista de Alumnos:** `docs/vista-alumnos.md`
- **API de Autenticación:** `docs/api-auth.md`
- **Base de Datos:** `docs/db.md`
- **Casos de Uso:** `docs/casos-uso.md`
- **Usuarios de Prueba:** `docs/usuarios-prueba.md`

---

## 🚀 Próximos Pasos

1. **Explora el sistema:**
   - Inicia sesión con diferentes usuarios
   - Prueba la búsqueda de alumnos
   - Revisa las estadísticas

2. **Agrega más datos:**
   - Registra nuevos alumnos desde el frontend
   - Crea más programas y departamentos
   - Agrega tipos de trámite

3. **Desarrolla nuevas funcionalidades:**
   - Implementa el módulo de trámites
   - Agrega gestión de documentos
   - Crea reportes personalizados

---

## 💡 Tips

- Mantén el backend corriendo mientras uses el frontend
- Usa la consola del navegador (F12) para debug
- Revisa los logs del backend en la terminal
- Los tokens JWT expiran en 1 hora (usa refresh si es necesario)

---

## 📞 Soporte

Si encuentras problemas:
1. Revisa esta guía completamente
2. Consulta la documentación en `docs/`
3. Verifica los logs en terminal y consola del navegador
4. Revisa que todos los scripts SQL se ejecutaron correctamente

---

**Versión del Sistema:** 1.0 MVP  
**Última actualización:** Septiembre 2025  
**Autor:** Sistema de Gestión Universitaria

¡Listo para usar! 🎉
