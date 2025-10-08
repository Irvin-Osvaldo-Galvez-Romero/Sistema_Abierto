# 🔑 Credenciales de Acceso - Sistema Universitario

## 👤 **USUARIOS DE PRUEBA**

### **Estudiante Existente (Ya Creado)**
```
Email: estudiante@universidad.edu.mx
Password: Password123
Rol: ESTUDIANTE
```

**Acceso a:**
- ✅ Dashboard del estudiante
- ✅ Subir documentos
- ✅ Ver notificaciones
- ✅ Ver mi perfil

---

## 🆕 **CREAR NUEVOS USUARIOS**

### **Opción 1: Desde la Página de Registro**

1. Ve a: http://localhost:3000/register
2. Completa el formulario:
   ```
   Nombre: Tu nombre
   Apellido Paterno: Tu apellido
   Apellido Materno: (Opcional)
   Teléfono: (Opcional, 10 dígitos)
   Email: tu_email@universidad.edu.mx
   Password: Mínimo 8 caracteres, con mayúscula, minúscula y número
   Confirmar Password: (La misma)
   ```
3. Click en "Crear Cuenta"
4. Serás redirigido al Dashboard automáticamente

**Nota:** El rol por defecto es **ESTUDIANTE**

---

### **Opción 2: Crear Usuario Administrador (API)**

**Usando cURL desde PowerShell:**

```powershell
# Crear Administrador
curl.exe -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email": "admin@universidad.edu.mx",
    "password": "Admin123!",
    "nombre": "María",
    "apellidoPaterno": "González",
    "apellidoMaterno": "López",
    "telefono": "5512345678",
    "rol": "ADMINISTRADOR"
  }'
```

**Credenciales del Admin:**
```
Email: admin@universidad.edu.mx
Password: Admin123!
Rol: ADMINISTRADOR
```

**Acceso a:**
- ✅ Panel de administración completo
- ✅ Ver y gestionar estudiantes
- ✅ Revisar y aprobar/rechazar documentos
- ✅ Dar de alta nuevos estudiantes
- ✅ Dar de alta nuevos docentes

---

### **Opción 3: Crear Usuario Profesor (API)**

```powershell
# Crear Profesor
curl.exe -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email": "profesor@universidad.edu.mx",
    "password": "Profesor123!",
    "nombre": "Carlos",
    "apellidoPaterno": "Ramírez",
    "rol": "PROFESOR"
  }'
```

**Credenciales del Profesor:**
```
Email: profesor@universidad.edu.mx
Password: Profesor123!
Rol: PROFESOR
```

---

### **Opción 4: Crear Super Admin (API)**

```powershell
# Crear Super Admin
curl.exe -X POST http://localhost:3001/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "email": "superadmin@universidad.edu.mx",
    "password": "SuperAdmin123!",
    "nombre": "Ana",
    "apellidoPaterno": "Martínez",
    "rol": "SUPER_ADMIN"
  }'
```

**Credenciales del Super Admin:**
```
Email: superadmin@universidad.edu.mx
Password: SuperAdmin123!
Rol: SUPER_ADMIN
```

---

## 👥 **ROLES DISPONIBLES**

| Rol | Permisos | Vistas |
|-----|----------|--------|
| **ESTUDIANTE** | • Subir documentos<br>• Ver notificaciones<br>• Ver su perfil | • Dashboard<br>• Subir Documentos<br>• Notificaciones |
| **PROFESOR** | • Ver estudiantes<br>• Ver calificaciones<br>• Capturar notas | • Dashboard profesor<br>• Lista estudiantes |
| **ADMINISTRADOR** | • Todo de Profesor<br>• Aprobar/Rechazar docs<br>• Gestión completa | • Dashboard admin<br>• Todos los módulos |
| **SUPER_ADMIN** | • Todo de Admin<br>• Eliminar registros<br>• Acceso total | • Panel completo<br>• Todos los módulos |
| **PERSONAL_ADMINISTRATIVO** | • Gestión de estudiantes<br>• Revisar documentos | • Dashboard admin<br>• Gestión básica |

---

## 🌐 **ACCESO A LAS VISTAS**

### **Vistas de Estudiante:**
1. **Login** - http://localhost:3000/login
2. **Registro** - http://localhost:3000/register
3. **Dashboard** - http://localhost:3000/dashboard
4. **Subir Documentos** - http://localhost:3000/documentos
5. **Notificaciones** - http://localhost:3000/notificaciones

### **Redirecciones Automáticas:**
- Si NO estás autenticado → `/login`
- Si estás autenticado y vas a `/` → `/dashboard`
- Si estás autenticado y vas a `/login` → `/dashboard`

---

## 🔄 **CAMBIAR DE USUARIO**

### **Para Cambiar de Cuenta:**

1. **Cerrar Sesión:**
   - Click en "Cerrar Sesión" en el header
   - O navega a http://localhost:3000/login

2. **Iniciar con Otro Usuario:**
   - Ingresa las nuevas credenciales
   - Click en "Iniciar Sesión"

---

## 🧪 **USUARIOS DE PRUEBA RECOMENDADOS**

### **Crear estos usuarios para probar todas las funcionalidades:**

#### **1. Estudiante 1 (Ya existe):**
```
Email: estudiante@universidad.edu.mx
Password: Password123
```

#### **2. Estudiante 2:**
```
Email: estudiante2@universidad.edu.mx
Password: Password123
Nombre: Pedro
Apellido: López
```

#### **3. Administrador:**
```
Email: admin@universidad.edu.mx
Password: Admin123!
Nombre: María
Apellido: González
Rol: ADMINISTRADOR
```

**Vistas disponibles:**
- http://localhost:3000/admin/dashboard - Panel principal
- http://localhost:3000/admin/estudiantes - Gestión de estudiantes
- http://localhost:3000/admin/docentes - Gestión de docentes (NUEVO)
- http://localhost:3000/admin/documentos - Revisión de documentos
- http://localhost:3000/admin/nuevo-estudiante - Alta de estudiante
- http://localhost:3000/admin/nuevo-docente - Alta de docente

#### **4. Profesor:**
```
Email: profesor@universidad.edu.mx
Password: Profesor123!
Nombre: Carlos
Apellido: Ramírez
Rol: PROFESOR
```

---

## 📝 **VALIDACIONES DE PASSWORD**

**Requisitos de Contraseña:**
- ✅ Mínimo 8 caracteres
- ✅ Al menos una mayúscula (A-Z)
- ✅ Al menos una minúscula (a-z)
- ✅ Al menos un número (0-9)

**Ejemplos Válidos:**
- `Password123`
- `Admin123!`
- `Estudiante2024`
- `MiContra123`

**Ejemplos NO Válidos:**
- `password` (sin mayúscula ni número)
- `PASSWORD123` (sin minúscula)
- `Password` (sin número)
- `Pass123` (menos de 8 caracteres)

---

## 🔐 **SEGURIDAD DE ACCESO**

### **Protección Implementada:**
- ✅ Tokens JWT (Access + Refresh)
- ✅ Bloqueo después de 5 intentos fallidos
- ✅ Bloqueo temporal de 15 minutos
- ✅ Renovación automática de tokens
- ✅ Logs de todos los accesos

### **Tokens:**
- **Access Token:** Expira en 24 horas
- **Refresh Token:** Expira en 7 días
- **Almacenamiento:** localStorage del navegador

---

## 🔄 **CREAR MÚLTIPLES USUARIOS RÁPIDAMENTE**

### **Script PowerShell para Crear Usuarios:**

```powershell
# Guardar en: crear-usuarios.ps1

# Función para crear usuario
function Create-User {
    param($email, $password, $nombre, $apellido, $rol)
    
    curl.exe -X POST http://localhost:3001/api/auth/register `
      -H "Content-Type: application/json" `
      -d "{
        `"email`": `"$email`",
        `"password`": `"$password`",
        `"nombre`": `"$nombre`",
        `"apellidoPaterno`": `"$apellido`",
        `"rol`": `"$rol`"
      }"
    
    Write-Host "`nUsuario creado: $email`n" -ForegroundColor Green
}

# Crear usuarios
Create-User "estudiante2@universidad.edu.mx" "Password123" "Pedro" "López" "ESTUDIANTE"
Create-User "estudiante3@universidad.edu.mx" "Password123" "Ana" "Martínez" "ESTUDIANTE"
Create-User "admin@universidad.edu.mx" "Admin123!" "María" "González" "ADMINISTRADOR"
Create-User "profesor@universidad.edu.mx" "Profesor123!" "Carlos" "Ramírez" "PROFESOR"

Write-Host "✅ Todos los usuarios creados exitosamente!" -ForegroundColor Green
```

**Ejecutar:**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
.\crear-usuarios.ps1
```

---

## 🗄️ **VER USUARIOS EN LA BASE DE DATOS**

### **Opción 1: Prisma Studio**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
npx prisma studio
```
Abre: http://localhost:5555

### **Opción 2: pgAdmin**
1. Abre: http://localhost:5050
2. Login: `admin@universidad.edu.mx` / `admin123`
3. Conecta al servidor PostgreSQL
4. Ve a: `sistema_universitario` → `Schemas` → `public` → `Tables` → `usuarios`
5. Click derecho → `View/Edit Data` → `All Rows`

### **Opción 3: Comando SQL**
```powershell
docker exec -it univ_postgres_dev psql -U univ_app -d sistema_universitario -c "SELECT email, nombre, rol FROM usuarios;"
```

---

## 🧹 **LIMPIAR USUARIOS (Reiniciar)**

### **Si quieres empezar de cero:**

```powershell
# Conectarse a PostgreSQL
docker exec -it univ_postgres_dev psql -U univ_app -d sistema_universitario

# Ejecutar en psql:
DELETE FROM usuarios;

# Salir:
\q
```

**⚠️ CUIDADO:** Esto eliminará todos los usuarios y sus datos relacionados.

---

## 📊 **RESUMEN DE ACCESOS**

### **Vista de Estudiante:**
- Dashboard simplificado
- Subir 3 documentos
- Ver notificaciones
- Ver perfil

### **Vista de Administrador:**
- Todo lo del estudiante +
- Revisar documentos
- Aprobar/Rechazar
- Ver todos los estudiantes
- Gestión completa

### **Vista de Profesor:**
- Ver estudiantes
- Ver calificaciones
- Capturar notas

---

## 🎯 **CREDENCIALES RÁPIDAS**

**Para pruebas rápidas, usa:**

```
Estudiante:
estudiante@universidad.edu.mx / Password123

Admin (crear primero):
admin@universidad.edu.mx / Admin123!

Profesor (crear primero):
profesor@universidad.edu.mx / Profesor123!
```

---

## 💡 **TIPS**

### **Para Desarrollo:**
- Usa el estudiante existente para probar uploads
- Crea un admin para probar aprobaciones
- Usa diferentes navegadores para simular múltiples usuarios

### **Para Pruebas:**
- Sube archivos PDF de prueba
- Intenta subir un .exe para probar el antivirus
- Sube el mismo documento varias veces
- Prueba con archivos grandes (>10MB)

---

## 🆘 **PROBLEMAS DE ACCESO**

### **Si no puedes iniciar sesión:**
1. Verifica que el backend esté corriendo
2. Verifica las credenciales
3. Revisa que no estés bloqueado (5 intentos)
4. Espera 15 minutos si estás bloqueado
5. O resetea el usuario en la BD

### **Si olvidaste tu contraseña:**
Por ahora, debes crear un nuevo usuario o resetear en la BD.

---

**¡Usa estas credenciales para acceder a todas las vistas del sistema!** 🚀

---

**Última actualización:** Octubre 2024  
**Versión:** 1.1.0


