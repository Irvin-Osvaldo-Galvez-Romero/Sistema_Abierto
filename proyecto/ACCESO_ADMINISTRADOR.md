# 👔 **GUÍA DE ACCESO - PANEL DE ADMINISTRADOR**

## Sistema Universitario - Gestión Administrativa

---

## 🚀 **INICIO RÁPIDO**

### **Paso 1: Verificar que los servidores estén corriendo**

Debes tener DOS ventanas de terminal abiertas:

**Terminal 1 - Backend:**
```bash
cd proyecto/backend
npm start
```
✅ Debe decir: `Servidor escuchando en http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd proyecto/frontend
npm start
```
✅ Debe abrir automáticamente: `http://localhost:3000`

---

### **Paso 2: Crear el Usuario Administrador**

**Abre PowerShell y ejecuta:**

```powershell
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

✅ **Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": { ... }
}
```

---

### **Paso 3: Iniciar Sesión como Administrador**

1. **Abre tu navegador en:** http://localhost:3000/login

2. **Ingresa las credenciales:**
   ```
   Email: admin@universidad.edu.mx
   Password: Admin123!
   ```

3. **Click en "Iniciar Sesión"**

4. **Serás redirigido automáticamente a:**
   ```
   http://localhost:3000/admin/dashboard
   ```

---

## 🎯 **PANEL DE ADMINISTRADOR**

### **Dashboard Principal**
**URL:** http://localhost:3000/admin/dashboard

**Verás:**
- 📊 **Estadísticas:**
  - Total de estudiantes
  - Documentos pendientes
  - Documentos aprobados

- 🎬 **Acciones Principales:**
  - Ver todos los estudiantes
  - Revisar documentos
  - Dar de alta estudiante
  - Dar de alta docente

---

## 👨‍🎓 **GESTIÓN DE ESTUDIANTES**

### **Ver Todos los Estudiantes**
**URL:** http://localhost:3000/admin/estudiantes

**Funciones:**
- 📋 Ver tabla completa de estudiantes
- 🔍 Buscar por nombre, matrícula o email
- 👁️ Ver detalles de cada estudiante
- ➕ Botón "Nuevo Estudiante"

### **Dar de Alta Estudiante**
**URL:** http://localhost:3000/admin/nuevo-estudiante

**Formulario completo con:**
1. **Información Personal:**
   - Nombre(s) *
   - Apellido Paterno *
   - Apellido Materno
   - Teléfono

2. **Credenciales:**
   - Email * (único)
   - Contraseña * (mín. 8 caracteres)

3. **Información Académica:**
   - Matrícula * (única)
   - Estatus (ACTIVO/INACTIVO/EGRESADO)

**Ejemplo:**
```
Nombre: Juan
Apellido Paterno: Pérez
Email: juan.perez@universidad.edu.mx
Password: Estudiante123
Matrícula: EST2024001
Estatus: ACTIVO
```

---

## 👨‍🏫 **GESTIÓN DE DOCENTES**

### **Dar de Alta Docente**
**URL:** http://localhost:3000/admin/nuevo-docente

**Formulario completo con:**
1. **Información Personal:**
   - Nombre(s) *
   - Apellido Paterno *
   - Apellido Materno
   - Teléfono

2. **Credenciales:**
   - Email * (único)
   - Contraseña * (mín. 8 caracteres)

3. **Información Profesional:**
   - Número de Empleado * (único)
   - Especialidad
   - Estatus (ACTIVO/INACTIVO/LICENCIA)

**Ejemplo:**
```
Nombre: Carlos
Apellido Paterno: Ramírez
Email: carlos.ramirez@universidad.edu.mx
Password: Profesor123!
Número de Empleado: PROF2024001
Especialidad: Matemáticas
Estatus: ACTIVO
```

---

## 📄 **REVISIÓN DE DOCUMENTOS**

### **Panel de Revisión**
**URL:** http://localhost:3000/admin/documentos

**Filtros disponibles:**
- 🟡 **Pendientes** - Documentos sin revisar
- 🟢 **Aprobados** - Documentos aceptados
- 🔴 **Rechazados** - Documentos rechazados
- 🔵 **Todos** - Ver todos los documentos

### **Tabla de Documentos:**
Muestra:
- Folio único
- Tipo (KARDEX, FICHA_REINSCRIPCION, COMPROBANTE_PAGO)
- Estudiante
- Matrícula
- Tamaño del archivo
- Estatus actual

### **Acciones de Revisión:**

#### **✅ Aprobar Documento:**
1. Click en el botón verde ✓
2. Confirmar en el diálogo
3. Click en "Aprobar"
4. ✅ El estudiante recibe notificación automática

#### **❌ Rechazar Documento:**
1. Click en el botón rojo ✗
2. Escribir el motivo del rechazo (obligatorio)
   ```
   Ejemplo: El documento está borroso y no se puede leer
   Ejemplo: El comprobante no corresponde al periodo actual
   ```
3. Click en "Rechazar"
4. ❌ El estudiante recibe notificación con el motivo

---

## 🔔 **SISTEMA DE NOTIFICACIONES**

**Cuando apruebas/rechazas un documento:**
1. Se crea automáticamente una notificación
2. El estudiante la ve en su dashboard
3. Contiene:
   - ✅ "Tu documento [tipo] ha sido aprobado"
   - ❌ "Tu documento [tipo] ha sido rechazado. Motivo: [motivo]"

---

## 🎨 **INTERFAZ**

### **Colores del Sistema:**
- 🟢 **Verde:** Botones principales, headers
- ⚪ **Blanco:** Fondos
- ⚫ **Negro:** Texto principal
- 🔲 **Gris:** Texto secundario

### **Diseño:**
- ✅ Material-UI moderno
- ✅ Responsive
- ✅ Iconos intuitivos
- ✅ Transiciones suaves

---

## 🔄 **FLUJO DE TRABAJO TÍPICO**

### **Caso 1: Revisar Documentos Pendientes**

1. **Login como admin**
   ```
   http://localhost:3000/login
   Email: admin@universidad.edu.mx
   Password: Admin123!
   ```

2. **Click en "Revisar Documentos"**
   - O ve directo a: http://localhost:3000/admin/documentos

3. **Filtrar por "Pendientes"**

4. **Para cada documento:**
   - ✅ Si está correcto: Aprobar
   - ❌ Si tiene problemas: Rechazar con motivo

5. **El estudiante recibe notificación automática**

---

### **Caso 2: Dar de Alta un Estudiante**

1. **Dashboard → "Dar de Alta Estudiante"**
   - O ve a: http://localhost:3000/admin/nuevo-estudiante

2. **Completar el formulario:**
   ```
   Nombre: Ana
   Apellido Paterno: Martínez
   Email: ana.martinez@universidad.edu.mx
   Password: Estudiante123
   Matrícula: EST2024002
   ```

3. **Click en "Guardar Estudiante"**

4. **El sistema:**
   - ✅ Crea el usuario
   - ✅ Crea el perfil de estudiante
   - ✅ Muestra confirmación
   - ✅ Redirige a lista de estudiantes

5. **El estudiante ya puede iniciar sesión**

---

### **Caso 3: Dar de Alta un Docente**

1. **Dashboard → "Dar de Alta Docente"**
   - O ve a: http://localhost:3000/admin/nuevo-docente

2. **Completar el formulario:**
   ```
   Nombre: Roberto
   Apellido Paterno: García
   Email: roberto.garcia@universidad.edu.mx
   Password: Profesor123!
   Número de Empleado: PROF2024002
   Especialidad: Programación
   ```

3. **Click en "Guardar Docente"**

4. **El sistema:**
   - ✅ Crea el usuario
   - ✅ Crea el perfil de profesor
   - ✅ Muestra confirmación
   - ✅ Redirige al dashboard

5. **El docente ya puede iniciar sesión**

---

## 🔐 **SEGURIDAD**

### **Protecciones Activas:**
- ✅ Solo usuarios con rol ADMINISTRADOR pueden acceder
- ✅ Token JWT verificado en cada petición
- ✅ Redirección automática si no hay permiso
- ✅ Logs de todas las acciones

### **Si no eres administrador:**
- ❌ No podrás acceder a `/admin/*`
- ❌ Serás redirigido a `/login`
- ❌ El backend rechazará las peticiones

---

## ❓ **SOLUCIÓN DE PROBLEMAS**

### **No puedo acceder al panel de admin**
✅ **Verifica:**
1. ¿Creaste el usuario con rol ADMINISTRADOR?
2. ¿Las credenciales son correctas?
3. ¿Estás usando el email correcto?
4. ¿El backend está corriendo?

### **No aparecen los estudiantes**
✅ **Verifica:**
1. ¿Hay estudiantes creados en el sistema?
2. ¿El backend responde correctamente?
3. Revisa la consola del navegador (F12)

### **No puedo aprobar documentos**
✅ **Verifica:**
1. ¿Hay documentos subidos?
2. ¿Estás en la pestaña correcta (Pendientes)?
3. ¿El backend está respondiendo?

---

## 📞 **ARCHIVOS DE AYUDA**

- `VISTA_ADMINISTRADOR.md` - Guía completa del panel
- `CREDENCIALES.md` - Todas las credenciales
- `SISTEMA_COMPLETO_FINAL.md` - Resumen del sistema
- `COMANDOS_UTILES.md` - Solución de problemas

---

## ✅ **CHECKLIST DE INICIO**

Antes de comenzar, verifica:

- [ ] Backend corriendo en puerto 3001
- [ ] Frontend corriendo en puerto 3000
- [ ] Usuario administrador creado
- [ ] Puedes hacer login correctamente
- [ ] Te redirige a `/admin/dashboard`
- [ ] Ves las estadísticas
- [ ] Puedes navegar entre secciones

---

## 🎉 **¡TODO LISTO!**

**Tu panel de administrador está completamente funcional.**

**Accede ahora:**
```
http://localhost:3000/login
```

**Credenciales:**
```
Email: admin@universidad.edu.mx
Password: Admin123!
```

---

**¿Necesitas ayuda? Revisa la documentación completa en `proyecto/docs/`** 📚

