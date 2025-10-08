# 🗺️ **MAPA COMPLETO DEL SISTEMA UNIVERSITARIO**

## Navegación y Vistas Disponibles

---

## 🌐 **ESTRUCTURA DE RUTAS**

```
Sistema Universitario
│
├── 🔓 PÚBLICAS (Sin autenticación)
│   │
│   ├── /login                      → Iniciar Sesión
│   └── /register                   → Crear Cuenta
│
├── 👨‍🎓 ESTUDIANTE (Autenticación requerida)
│   │
│   ├── /dashboard                  → Dashboard Principal
│   │   ├── 📊 Estadísticas personales
│   │   ├── ✅ Documentos aprobados
│   │   ├── 📤 Botón "Subir Documentos"
│   │   └── 🔔 Botón "Notificaciones"
│   │
│   ├── /documentos                 → Subir Documentos
│   │   ├── 📄 Kardex
│   │   ├── 📋 Ficha de Reinscripción
│   │   └── 💵 Comprobante de Pago
│   │
│   └── /notificaciones             → Ver Notificaciones
│       ├── 🔔 Nuevas (sin leer)
│       └── ✅ Leídas
│
└── 👔 ADMINISTRADOR (Autenticación + Rol Admin)
    │
    ├── /admin/dashboard            → Panel de Control
    │   ├── 📊 Estadísticas generales
    │   ├── 👥 Total de estudiantes
    │   ├── 📄 Documentos pendientes
    │   ├── ✅ Documentos aprobados
    │   └── 🎬 Acciones principales
    │
    ├── /admin/estudiantes          → Gestión de Estudiantes
    │   ├── 📋 Tabla de todos los estudiantes
    │   ├── 🔍 Búsqueda avanzada
    │   ├── 👁️ Ver detalles
    │   └── ➕ Nuevo estudiante
    │
    ├── /admin/documentos           → Revisión de Documentos
    │   ├── 🟡 Filtro: Pendientes
    │   ├── 🟢 Filtro: Aprobados
    │   ├── 🔴 Filtro: Rechazados
    │   ├── 🔵 Filtro: Todos
    │   ├── ✅ Aprobar documento
    │   └── ❌ Rechazar con motivo
    │
    ├── /admin/nuevo-estudiante     → Alta de Estudiante
    │   ├── 📝 Formulario completo
    │   ├── 👤 Información personal
    │   ├── 🔐 Credenciales
    │   └── 🎓 Información académica
    │
    └── /admin/nuevo-docente        → Alta de Docente
        ├── 📝 Formulario completo
        ├── 👤 Información personal
        ├── 🔐 Credenciales
        └── 👨‍🏫 Información profesional
```

---

## 🎯 **FLUJOS DE USUARIO**

### **FLUJO 1: Estudiante Completo**

```
1️⃣ REGISTRO
   http://localhost:3000/register
   ↓
   Completar formulario
   ↓
   Click "Crear Cuenta"
   ↓
   ✅ Cuenta creada

2️⃣ LOGIN
   http://localhost:3000/login
   ↓
   Ingresar credenciales
   ↓
   Click "Iniciar Sesión"
   ↓
   🔄 Redirección automática

3️⃣ DASHBOARD
   http://localhost:3000/dashboard
   ↓
   Ver documentos aprobados
   ↓
   Click "Subir Documentos"

4️⃣ SUBIR DOCUMENTOS
   http://localhost:3000/documentos
   ↓
   Seleccionar tipo
   ↓
   Elegir archivo
   ↓
   Click "Subir"
   ↓
   ⏳ Escaneo antivirus
   ↓
   ✅ Documento subido

5️⃣ ESPERAR REVISIÓN
   ⏰ Administrador revisa
   ↓
   🔔 Notificación recibida

6️⃣ VER NOTIFICACIÓN
   http://localhost:3000/notificaciones
   ↓
   Ver resultado
   ↓
   ✅ Aprobado / ❌ Rechazado
```

---

### **FLUJO 2: Administrador Completo**

```
1️⃣ CREAR ADMIN (Una sola vez)
   PowerShell
   ↓
   curl -X POST .../register
   ↓
   ✅ Admin creado

2️⃣ LOGIN COMO ADMIN
   http://localhost:3000/login
   ↓
   Email: admin@universidad.edu.mx
   Password: Admin123!
   ↓
   🔄 Redirección automática

3️⃣ DASHBOARD ADMIN
   http://localhost:3000/admin/dashboard
   ↓
   Ver estadísticas
   ↓
   Elegir acción

4️⃣ OPCIÓN A: Revisar Documentos
   Click "Revisar Documentos"
   ↓
   http://localhost:3000/admin/documentos
   ↓
   Filtrar "Pendientes"
   ↓
   Ver documento
   ↓
   Decidir:
   ├── ✅ Aprobar
   │   ↓
   │   Confirmación
   │   ↓
   │   🔔 Estudiante notificado
   │
   └── ❌ Rechazar
       ↓
       Escribir motivo
       ↓
       Confirmación
       ↓
       🔔 Estudiante notificado

5️⃣ OPCIÓN B: Dar de Alta Estudiante
   Click "Dar de Alta Estudiante"
   ↓
   http://localhost:3000/admin/nuevo-estudiante
   ↓
   Completar formulario
   ↓
   Click "Guardar"
   ↓
   ✅ Estudiante creado
   ↓
   🔄 Redirección a lista

6️⃣ OPCIÓN C: Dar de Alta Docente
   Click "Dar de Alta Docente"
   ↓
   http://localhost:3000/admin/nuevo-docente
   ↓
   Completar formulario
   ↓
   Click "Guardar"
   ↓
   ✅ Docente creado
   ↓
   🔄 Redirección al dashboard

7️⃣ OPCIÓN D: Gestionar Estudiantes
   Click "Ver Estudiantes"
   ↓
   http://localhost:3000/admin/estudiantes
   ↓
   Ver tabla completa
   ↓
   🔍 Buscar estudiante
   ↓
   👁️ Ver detalles
```

---

## 🔄 **REDIRECCIONES AUTOMÁTICAS**

### **Por Rol:**

```
LOGIN
  ↓
  Verificar rol
  ↓
  ┌─────────────┐
  │ ¿Qué rol?   │
  └──┬──────┬───┘
     │      │
     ↓      ↓
ESTUDIANTE  ADMINISTRADOR
     ↓      ↓
/dashboard  /admin/dashboard
```

### **Por Estado de Autenticación:**

```
Usuario intenta acceder a ruta protegida
  ↓
  ¿Autenticado?
  ├── NO → /login
  └── SÍ → Ruta solicitada
```

---

## 📊 **COMPONENTES PRINCIPALES**

### **Dashboard de Estudiante:**
```
┌────────────────────────────────────┐
│ 🎓 Sistema Universitario           │ [Notif] [Salir]
├────────────────────────────────────┤
│                                    │
│  Bienvenido, [Nombre]              │
│  Panel de control para estudiantes │
│                                    │
│  ┌──────────────┐  ┌─────────────┐│
│  │   📊 Stats   │  │ ✅ Docs     ││
│  │   Promedio   │  │ Aprobados   ││
│  │      0       │  │     0       ││
│  └──────────────┘  └─────────────┘│
│                                    │
│  ┌─────────────────────────────┐  │
│  │ 📤 Subir Documentos         │  │
│  └─────────────────────────────┘  │
│                                    │
│  ┌─────────────────────────────┐  │
│  │ 🔔 Ver Notificaciones       │  │
│  └─────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

### **Dashboard de Administrador:**
```
┌────────────────────────────────────┐
│ 👔 Panel de Administración         │ [+Est] [Salir]
├────────────────────────────────────┤
│                                    │
│  Bienvenido, [Admin]               │
│  Panel de control para gestión     │
│                                    │
│  ┌─────┐  ┌─────┐  ┌─────────┐   │
│  │ 👥  │  │ 📄  │  │ ✅      │   │
│  │  3  │  │  0  │  │  0      │   │
│  │Est. │  │Pend.│  │Aprob.   │   │
│  └─────┘  └─────┘  └─────────┘   │
│                                    │
│  Acciones Principales:             │
│  ┌──────────────┐ ┌──────────────┐│
│  │👥 Estudiantes│ │📄 Documentos ││
│  └──────────────┘ └──────────────┘│
│  ┌──────────────┐ ┌──────────────┐│
│  │+ Estudiante  │ │+ Docente     ││
│  └──────────────┘ └──────────────┘│
│                                    │
└────────────────────────────────────┘
```

### **Revisión de Documentos:**
```
┌────────────────────────────────────┐
│ 📄 Revisión de Documentos          │
├────────────────────────────────────┤
│ [Pendientes][Aprobados][Rechazados]│
├────┬──────┬─────────┬──────┬──────┤
│Folio│Tipo  │Estudiante│Estado│Acc. │
├────┼──────┼─────────┼──────┼──────┤
│001 │KARDEX│Juan P.  │PEND. │✅ ❌│
│002 │FICHA │Ana M.   │PEND. │✅ ❌│
│003 │COMP. │Luis G.  │APROB.│  -  │
└────┴──────┴─────────┴──────┴──────┘
```

---

## 🎨 **TEMAS Y ESTILOS**

### **Paleta de Colores:**
```
🟢 Verde Principal:  #008000  → Botones, Headers
🟢 Verde Oscuro:     #006000  → Hover, Activo
⚪ Blanco:           #FFFFFF  → Fondo, Texto invertido
⚫ Negro:            #000000  → Texto Principal
🔲 Gris Oscuro:      #333333  → Texto Secundario
🔲 Gris Medio:       #888888  → Bordes, Disabled
```

### **Tipografía:**
```
Familia: Roboto, Helvetica, Arial
Headers: Bold
Botones: Semi-bold (600)
Cuerpo: Regular
```

---

## 🔐 **SISTEMA DE PERMISOS**

```
┌──────────────┬──────────┬──────────────┬──────────┐
│ Ruta         │Estudiante│ Administrador│  Público │
├──────────────┼──────────┼──────────────┼──────────┤
│/login        │    ✅    │      ✅      │    ✅    │
│/register     │    ✅    │      ✅      │    ✅    │
│/dashboard    │    ✅    │      ❌      │    ❌    │
│/documentos   │    ✅    │      ❌      │    ❌    │
│/notificacio. │    ✅    │      ❌      │    ❌    │
│/admin/*      │    ❌    │      ✅      │    ❌    │
└──────────────┴──────────┴──────────────┴──────────┘
```

---

## 📱 **RESPONSIVE DESIGN**

### **Desktop (>960px):**
```
┌─────────────────────────────────────────┐
│  Header: Logo + Título + Botones        │
├─────────────────────────────────────────┤
│                                         │
│  [Card 1]  [Card 2]  [Card 3]          │
│                                         │
│  ┌────────────────────────────────┐    │
│  │  Contenido Principal           │    │
│  └────────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

### **Mobile (<960px):**
```
┌──────────────┐
│  Header      │
│  ☰ Logo      │
├──────────────┤
│              │
│  [Card 1]    │
│              │
│  [Card 2]    │
│              │
│  [Card 3]    │
│              │
│  ┌─────────┐ │
│  │Contenido│ │
│  └─────────┘ │
│              │
└──────────────┘
```

---

## 🚀 **ACCESO RÁPIDO**

### **URLs Importantes:**

**Estudiante:**
```
Login:          http://localhost:3000/login
Dashboard:      http://localhost:3000/dashboard
Documentos:     http://localhost:3000/documentos
Notificaciones: http://localhost:3000/notificaciones
```

**Administrador:**
```
Login:          http://localhost:3000/login
Dashboard:      http://localhost:3000/admin/dashboard
Estudiantes:    http://localhost:3000/admin/estudiantes
Documentos:     http://localhost:3000/admin/documentos
Nuevo Est.:     http://localhost:3000/admin/nuevo-estudiante
Nuevo Doc.:     http://localhost:3000/admin/nuevo-docente
```

---

## 🎯 **CASOS DE USO RÁPIDOS**

### **Como Estudiante:**
1. Login → Dashboard → Subir Doc → Esperar → Ver Notif

### **Como Administrador:**
1. Login → Dashboard → Revisar Docs → Aprobar/Rechazar
2. Login → Dashboard → Nuevo Estudiante → Guardar
3. Login → Dashboard → Nuevo Docente → Guardar
4. Login → Dashboard → Ver Estudiantes → Buscar

---

## 📞 **DOCUMENTACIÓN RELACIONADA**

- `ACCESO_ADMINISTRADOR.md` - Guía completa de acceso admin
- `VISTA_ADMINISTRADOR.md` - Funcionalidades del panel
- `SISTEMA_COMPLETO_FINAL.md` - Resumen del sistema
- `CREDENCIALES.md` - Todas las credenciales

---

**¡Usa este mapa para navegar por todo el sistema! 🗺️**

