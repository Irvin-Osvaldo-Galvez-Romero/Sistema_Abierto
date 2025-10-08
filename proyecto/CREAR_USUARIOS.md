# 👥 Crear Usuarios de Prueba - Guía Rápida

## 🚀 **MÉTODO RÁPIDO CON cURL**

Copia y pega estos comandos en PowerShell (uno por uno):

---

## 👨‍🎓 **ESTUDIANTES**

### **Estudiante 1 (Ya existe):**
```
Email: estudiante@universidad.edu.mx
Password: Password123
```

### **Estudiante 2:**
```powershell
curl.exe -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{\"email\":\"estudiante2@universidad.edu.mx\",\"password\":\"Password123\",\"nombre\":\"Pedro\",\"apellidoPaterno\":\"López\",\"rol\":\"ESTUDIANTE\"}'
```

### **Estudiante 3:**
```powershell
curl.exe -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{\"email\":\"estudiante3@universidad.edu.mx\",\"password\":\"Password123\",\"nombre\":\"Ana\",\"apellidoPaterno\":\"Martínez\",\"rol\":\"ESTUDIANTE\"}'
```

---

## 👔 **ADMINISTRADOR**

```powershell
curl.exe -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{\"email\":\"admin@universidad.edu.mx\",\"password\":\"Admin123!\",\"nombre\":\"María\",\"apellidoPaterno\":\"González\",\"rol\":\"ADMINISTRADOR\"}'
```

**Credenciales:**
```
Email: admin@universidad.edu.mx
Password: Admin123!
```

---

## 👨‍🏫 **PROFESOR**

```powershell
curl.exe -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{\"email\":\"profesor@universidad.edu.mx\",\"password\":\"Profesor123!\",\"nombre\":\"Carlos\",\"apellidoPaterno\":\"Ramírez\",\"rol\":\"PROFESOR\"}'
```

**Credenciales:**
```
Email: profesor@universidad.edu.mx
Password: Profesor123!
```

---

## 🦸 **SUPER ADMIN**

```powershell
curl.exe -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{\"email\":\"superadmin@universidad.edu.mx\",\"password\":\"SuperAdmin123!\",\"nombre\":\"Diana\",\"apellidoPaterno\":\"Flores\",\"rol\":\"SUPER_ADMIN\"}'
```

**Credenciales:**
```
Email: superadmin@universidad.edu.mx
Password: SuperAdmin123!
```

---

## 📋 **RESUMEN DE USUARIOS CREADOS**

| Email | Password | Rol | Nombre |
|-------|----------|-----|--------|
| estudiante@universidad.edu.mx | Password123 | ESTUDIANTE | Juan Pérez |
| estudiante2@universidad.edu.mx | Password123 | ESTUDIANTE | Pedro López |
| estudiante3@universidad.edu.mx | Password123 | ESTUDIANTE | Ana Martínez |
| admin@universidad.edu.mx | Admin123! | ADMINISTRADOR | María González |
| profesor@universidad.edu.mx | Profesor123! | PROFESOR | Carlos Ramírez |
| superadmin@universidad.edu.mx | SuperAdmin123! | SUPER_ADMIN | Diana Flores |

---

## ✅ **VERIFICAR USUARIOS CREADOS**

### **Opción 1: Intentar Login**
Ve a http://localhost:3000/login y prueba las credenciales

### **Opción 2: Prisma Studio**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
npx prisma studio
```

### **Opción 3: Query SQL**
```powershell
docker exec univ_postgres_dev psql -U univ_app -d sistema_universitario -c "SELECT email, nombre, apellidoPaterno, rol FROM usuarios ORDER BY rol, createdAt;"
```

---

## 🔄 **CREAR DESDE LA WEB (Más Fácil)**

### **Para Estudiantes:**
1. Ve a: http://localhost:3000/register
2. Completa el formulario
3. El rol será ESTUDIANTE automáticamente
4. Click en "Crear Cuenta"

**Nota:** Para crear Admin, Profesor o Super Admin, debes usar la API (comandos de arriba)

---

## 🎯 **ACCEDER AL SISTEMA**

Una vez creados los usuarios:

1. **Ve a:** http://localhost:3000
2. **Inicia sesión** con cualquiera de las credenciales
3. **Explora** las diferentes vistas según el rol

---

**¡Usa estos usuarios para probar todas las funcionalidades del sistema!** 👥✅


