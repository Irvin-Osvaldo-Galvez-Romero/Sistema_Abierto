# 👥 Usuarios del Sistema - Todos los Roles

## ✅ **USUARIOS CREADOS Y LISTOS PARA USAR**

---

## 🎓 **ESTUDIANTES (3 usuarios)**

### **Estudiante 1:**
```
📧 Email: estudiante@universidad.edu.mx
🔒 Password: Password123
👤 Rol: ESTUDIANTE
📝 Nombre: Juan Pérez García
```

### **Estudiante 2:**
```
📧 Email: estudiante2@universidad.edu.mx
🔒 Password: Password123
👤 Rol: ESTUDIANTE
📝 Nombre: Pedro López García
```

### **Estudiante 3:**
```
📧 Email: estudiante3@universidad.edu.mx
🔒 Password: Password123
👤 Rol: ESTUDIANTE
📝 Nombre: Ana Martínez Díaz
```

**Acceso a:**
- ✅ Dashboard simplificado
- ✅ Subir 3 documentos (Kardex, Ficha, Comprobante)
- ✅ Ver notificaciones
- ✅ Ver mi perfil

---

## 👔 **ADMINISTRADOR (1 usuario)**

### **Administrador:**
```
📧 Email: admin@universidad.edu.mx
🔒 Password: Admin123!
👤 Rol: ADMINISTRADOR
📝 Nombre: María González López
```

**Acceso a:**
- ✅ Todo lo de Estudiante +
- ✅ Ver todos los estudiantes
- ✅ Revisar documentos
- ✅ Aprobar/Rechazar documentos
- ✅ Gestión de carreras
- ✅ Gestión de materias
- ✅ Crear/Editar estudiantes

---

## 👨‍🏫 **PROFESOR (1 usuario)**

### **Profesor:**
```
📧 Email: profesor@universidad.edu.mx
🔒 Password: Profesor123!
👤 Rol: PROFESOR
📝 Nombre: Carlos Ramírez Torres
```

**Acceso a:**
- ✅ Ver lista de estudiantes
- ✅ Buscar estudiantes
- ✅ Ver calificaciones
- ✅ Capturar calificaciones
- ✅ Ver materias

---

## 🦸 **SUPER ADMIN (1 usuario)**

### **Super Administrador:**
```
📧 Email: superadmin@universidad.edu.mx
🔒 Password: SuperAdmin123!
👤 Rol: SUPER_ADMIN
📝 Nombre: Diana Flores Martínez
```

**Acceso a:**
- ✅ **ACCESO TOTAL** a todas las funciones
- ✅ Eliminar registros
- ✅ Gestión completa del sistema
- ✅ Todas las operaciones de Admin
- ✅ Operaciones críticas

---

## 📋 **PERSONAL ADMINISTRATIVO (1 usuario)**

### **Personal:**
```
📧 Email: personal@universidad.edu.mx
🔒 Password: Personal123!
👤 Rol: PERSONAL_ADMINISTRATIVO
📝 Nombre: Jorge Hernández Silva
```

**Acceso a:**
- ✅ Gestión de estudiantes
- ✅ Revisar documentos
- ✅ Aprobar/Rechazar documentos
- ✅ Ver carreras y materias

---

## 📊 **RESUMEN DE USUARIOS**

| # | Email | Password | Rol | Nombre |
|---|-------|----------|-----|--------|
| 1 | estudiante@universidad.edu.mx | Password123 | ESTUDIANTE | Juan Pérez |
| 2 | estudiante2@universidad.edu.mx | Password123 | ESTUDIANTE | Pedro López |
| 3 | estudiante3@universidad.edu.mx | Password123 | ESTUDIANTE | Ana Martínez |
| 4 | admin@universidad.edu.mx | Admin123! | ADMINISTRADOR | María González |
| 5 | profesor@universidad.edu.mx | Profesor123! | PROFESOR | Carlos Ramírez |
| 6 | superadmin@universidad.edu.mx | SuperAdmin123! | SUPER_ADMIN | Diana Flores |
| 7 | personal@universidad.edu.mx | Personal123! | PERSONAL_ADMINISTRATIVO | Jorge Hernández |

**Total: 7 usuarios creados** ✅

---

## 🎯 **GUÍA DE USO POR ROL**

### **Como ESTUDIANTE:**

1. **Inicia sesión** en http://localhost:3000
   ```
   Email: estudiante@universidad.edu.mx
   Password: Password123
   ```

2. **Dashboard:** Verás:
   - Contador de documentos aprobados (0/3)
   - Botón "Subir Documentos"
   - Botón "Ver Notificaciones"

3. **Subir Documentos:**
   - Click en "Subir Documentos"
   - Sube Kardex (PDF o imagen)
   - Sube Ficha de Reinscripción
   - Sube Comprobante de Pago
   - Sistema escanea automáticamente por virus
   - Recibes notificación de "Pendiente"

4. **Ver Notificaciones:**
   - Click en campana (🔔)
   - O click en "Ver Notificaciones"
   - Verás todas tus notificaciones

---

### **Como ADMINISTRADOR:**

1. **Inicia sesión**
   ```
   Email: admin@universidad.edu.mx
   Password: Admin123!
   ```

2. **Funciones disponibles:**
   - Revisar documentos de estudiantes
   - Aprobar documentos
   - Rechazar documentos (con motivo)
   - Ver lista de todos los estudiantes
   - Gestionar carreras
   - Gestionar materias

3. **Aprobar/Rechazar documentos:**
   ```bash
   # Aprobar:
   PATCH /api/upload/:documentoId/review
   { "aprobado": true }
   
   # Rechazar:
   PATCH /api/upload/:documentoId/review
   { 
     "aprobado": false,
     "motivoRechazo": "Documento ilegible" 
   }
   ```

---

### **Como PROFESOR:**

1. **Inicia sesión**
   ```
   Email: profesor@universidad.edu.mx
   Password: Profesor123!
   ```

2. **Funciones disponibles:**
   - Ver estudiantes
   - Buscar estudiantes
   - Ver calificaciones
   - Capturar calificaciones

---

### **Como SUPER_ADMIN:**

1. **Inicia sesión**
   ```
   Email: superadmin@universidad.edu.mx
   Password: SuperAdmin123!
   ```

2. **Funciones disponibles:**
   - **TODAS** las funciones del sistema
   - Operaciones de eliminación
   - Acceso total

---

## 🌐 **URLS DE ACCESO**

| Página | URL |
|--------|-----|
| **Login** | http://localhost:3000/login |
| **Registro** | http://localhost:3000/register |
| **Dashboard** | http://localhost:3000/dashboard |
| **Documentos** | http://localhost:3000/documentos |
| **Notificaciones** | http://localhost:3000/notificaciones |

---

## 🔄 **CAMBIAR DE USUARIO**

### **Para probar diferentes roles:**

1. **Cerrar sesión** (botón "Cerrar Sesión")
2. **Iniciar con otro usuario**
3. **Explorar las funciones** de ese rol

---

## 🧪 **ESCENARIO DE PRUEBA COMPLETO**

### **Paso 1: Como Estudiante**
```
1. Login: estudiante@universidad.edu.mx / Password123
2. Ve a "Subir Documentos"
3. Sube los 3 archivos (usa PDFs de prueba)
4. Verás estado "PENDIENTE" en cada uno
5. Cierra sesión
```

### **Paso 2: Como Administrador**
```
1. Login: admin@universidad.edu.mx / Admin123!
2. Usa la API para aprobar documentos:
   
   PATCH /api/upload/:documentoId/review
   { "aprobado": true }
   
3. O rechaza con motivo:
   { 
     "aprobado": false,
     "motivoRechazo": "Documento no legible" 
   }
4. Cierra sesión
```

### **Paso 3: Como Estudiante (Revisar Notificaciones)**
```
1. Login: estudiante@universidad.edu.mx / Password123
2. Click en campana (🔔)
3. Verás notificaciones de aprobación o rechazo
4. Si fue rechazado, sube de nuevo
```

---

## 🔐 **SEGURIDAD**

### **Recordatorios de Password:**
- Mínimo 8 caracteres
- Al menos 1 mayúscula
- Al menos 1 minúscula
- Al menos 1 número

### **Bloqueo de Cuenta:**
- Después de 5 intentos fallidos
- Bloqueo temporal de 15 minutos
- Mensaje: "Cuenta bloqueada. Intenta en X minutos"

---

## 📞 **SOPORTE**

### **Si tienes problemas:**
1. Verifica que el backend esté corriendo
2. Verifica las credenciales
3. Revisa COMANDOS_UTILES.md
4. Consulta CREDENCIALES.md

---

## 💾 **BACKUP DE CREDENCIALES**

**Guarda esta información:**
- USUARIOS_SISTEMA.md (este archivo)
- CREDENCIALES.md (documentación completa)
- CREAR_USUARIOS.md (cómo crear más)

---

## 🎊 **¡LISTO!**

**Tienes 7 usuarios con todos los roles para probar el sistema completo:**

✅ 3 Estudiantes  
✅ 1 Administrador  
✅ 1 Profesor  
✅ 1 Super Admin  
✅ 1 Personal Administrativo  

**Accede ahora:** http://localhost:3000

---

**Versión:** 1.1.0  
**Fecha:** Octubre 2024  
**Estado:** ✅ Todos los usuarios creados

