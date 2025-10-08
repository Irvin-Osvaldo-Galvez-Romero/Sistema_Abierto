# 👔 **VISTA DE ADMINISTRADOR**

## Sistema Universitario - Panel de Administración

---

## 📋 **DESCRIPCIÓN**

El panel de administración permite a los administradores gestionar todo el sistema universitario, incluyendo:

- ✅ Ver y gestionar todos los estudiantes
- ✅ Revisar y aprobar/rechazar documentos
- ✅ Dar de alta nuevos estudiantes
- ✅ Dar de alta nuevos docentes

---

## 🎯 **FUNCIONALIDADES PRINCIPALES**

### 1. **Dashboard de Administrador** (`/admin/dashboard`)

Panel principal con vista general del sistema:

- **Estadísticas en tiempo real:**
  - Total de estudiantes
  - Documentos pendientes de revisión
  - Documentos aprobados

- **Acciones rápidas:**
  - Ver todos los estudiantes
  - Revisar documentos
  - Dar de alta estudiante
  - Dar de alta docente

### 2. **Gestión de Estudiantes** (`/admin/estudiantes`)

Vista completa de todos los estudiantes registrados:

- **Tabla con información:**
  - Matrícula
  - Nombre completo
  - Email
  - Carrera
  - Estatus (ACTIVO, INACTIVO, EGRESADO)

- **Funcionalidades:**
  - Búsqueda por nombre, matrícula o email
  - Ver detalles de cada estudiante
  - Botón para dar de alta nuevo estudiante

### 3. **Revisión de Documentos** (`/admin/documentos`)

Sistema de revisión y validación de documentos:

- **Filtros por estatus:**
  - Pendientes
  - Aprobados
  - Rechazados
  - Todos

- **Tabla de documentos:**
  - Folio único
  - Tipo de documento (KARDEX, FICHA_REINSCRIPCION, COMPROBANTE_PAGO)
  - Nombre del estudiante
  - Matrícula
  - Tamaño del archivo
  - Estatus actual

- **Acciones de revisión:**
  - ✅ **Aprobar documento:** Marca el documento como aprobado
  - ❌ **Rechazar documento:** Requiere motivo del rechazo
  - Notifica automáticamente al estudiante

### 4. **Alta de Estudiante** (`/admin/nuevo-estudiante`)

Formulario completo para registrar nuevos estudiantes:

- **Información Personal:**
  - Nombre(s)
  - Apellido Paterno
  - Apellido Materno (opcional)
  - Teléfono (opcional)

- **Credenciales de Acceso:**
  - Email
  - Contraseña

- **Información Académica:**
  - Matrícula (obligatorio)
  - Estatus (ACTIVO, INACTIVO, EGRESADO)

### 5. **Alta de Docente** (`/admin/nuevo-docente`)

Formulario para registrar nuevos profesores:

- **Información Personal:**
  - Nombre(s)
  - Apellido Paterno
  - Apellido Materno (opcional)
  - Teléfono (opcional)

- **Credenciales de Acceso:**
  - Email
  - Contraseña

- **Información Profesional:**
  - Número de Empleado (obligatorio)
  - Especialidad (opcional)
  - Estatus (ACTIVO, INACTIVO, LICENCIA)

---

## 🔐 **ACCESO AL PANEL DE ADMINISTRADOR**

### **Credenciales de Administrador:**

```
Email: admin@universidad.edu.mx
Contraseña: Admin123!
```

### **URL de acceso:**
```
http://localhost:3000/admin/dashboard
```

---

## 🎨 **DISEÑO DE LA INTERFAZ**

### **Colores del Sistema:**
- **Verde:** `#008000` (Principal)
- **Verde Oscuro:** `#006000` (Hover/Activo)
- **Blanco:** `#FFFFFF` (Fondo)
- **Negro:** `#000000` (Texto Principal)
- **Gris Oscuro:** `#333333` (Texto Secundario)
- **Gris Medio:** `#888888` (Bordes/Disabled)

### **Componentes:**
- **Header:** Fondo verde degradado con logo y botones de acción
- **Tarjetas de estadísticas:** Con iconos y colores distintivos
- **Tablas:** Con hover verde claro para mejor UX
- **Botones:** Verde principal con efecto hover

---

## 📊 **FLUJO DE TRABAJO**

### **Revisión de Documentos:**

1. **Administrador accede** a `/admin/documentos`
2. **Filtra por "Pendientes"** para ver documentos sin revisar
3. **Revisa el documento** y decide:
   - ✅ **Aprobar:** Click en el botón verde ✓
   - ❌ **Rechazar:** Click en el botón rojo ✗ y proporciona motivo
4. **El sistema notifica** automáticamente al estudiante
5. **El documento cambia de estatus** a APROBADO o RECHAZADO

### **Alta de Estudiante:**

1. **Administrador accede** a `/admin/nuevo-estudiante`
2. **Completa el formulario** con toda la información
3. **Hace click en "Guardar Estudiante"**
4. **El sistema:**
   - Crea el usuario con rol ESTUDIANTE
   - Crea el perfil de estudiante
   - Envía confirmación
5. **Redirecciona** a la lista de estudiantes

### **Alta de Docente:**

1. **Administrador accede** a `/admin/nuevo-docente`
2. **Completa el formulario** con toda la información
3. **Hace click en "Guardar Docente"**
4. **El sistema:**
   - Crea el usuario con rol PROFESOR
   - Crea el perfil de profesor
   - Envía confirmación
5. **Redirecciona** al dashboard de administrador

---

## 🔄 **ENDPOINTS DE LA API**

### **Estudiantes:**
```
GET    /api/students           - Obtener todos los estudiantes
GET    /api/students/search    - Buscar estudiantes
POST   /api/students           - Crear estudiante
```

### **Profesores:**
```
GET    /api/profesores         - Obtener todos los profesores
POST   /api/profesores         - Crear profesor
GET    /api/profesores/:id     - Obtener profesor por ID
```

### **Documentos:**
```
GET    /api/documentos         - Obtener todos los documentos
PATCH  /api/upload/:id/review  - Aprobar/Rechazar documento
```

### **Autenticación:**
```
POST   /api/auth/register      - Registrar nuevo usuario
POST   /api/auth/login         - Iniciar sesión
```

---

## 🛡️ **SEGURIDAD**

- ✅ **Autenticación JWT:** Todas las rutas requieren token válido
- ✅ **Validación de roles:** Solo usuarios con rol ADMINISTRADOR pueden acceder
- ✅ **Protección de rutas:** Frontend y backend verifican permisos
- ✅ **Redirección automática:** Por rol al iniciar sesión

---

## 🚀 **PRÓXIMOS PASOS**

1. ✅ **Iniciar sesión como administrador**
2. ✅ **Explorar el panel de administración**
3. ✅ **Revisar documentos pendientes**
4. ✅ **Dar de alta estudiantes y docentes**
5. ✅ **Gestionar el sistema completo**

---

## 📞 **SOPORTE**

Si necesitas ayuda adicional:

1. Revisa la documentación en `proyecto/docs/`
2. Consulta `CREDENCIALES.md` para acceso completo
3. Verifica que ambos servidores estén corriendo:
   - Backend: `http://localhost:3001`
   - Frontend: `http://localhost:3000`

---

**¡Tu panel de administración está listo! 🎉**

