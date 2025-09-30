# 🎓 Sistema de Gestión de Documentos Universitarios

Sistema completo de gestión y revisión de documentos académicos para instituciones educativas.

## 🎨 Paleta de Colores

El sistema utiliza una paleta de colores consistente en todas las vistas:

### Colores Principales
- **Verde Principal**: `#2E8B57` - Color institucional y elementos principales
- **Verde Claro**: `#66BB6A` - Acentos y estados de éxito
- **Verde Oscuro**: `#1E5E3C` - Contraste y elementos primarios oscuros

### Colores Neutros
- **Gris Claro**: `#F5F5F5` - Fondo principal
- **Gris Medio**: `#757575` - Texto secundario y bordes
- **Negro Suave**: `#212121` - Texto principal

### Colores de Estado
- **Azul**: `#2196F3` - Información y enlaces
- **Amarillo**: `#FFC107` - Advertencias y pendientes
- **Rojo**: `#EF5350` - Errores y rechazos

## 📁 Estructura del Proyecto

```
proyecto/
├── backend/                  # API Node.js + TypeScript
│   ├── src/
│   │   ├── server.ts        # Servidor principal
│   │   └── tiers/
│   │       ├── auth.routes.ts        # Autenticación
│   │       ├── alumnos.routes.ts     # Gestión de alumnos
│   │       ├── documentos.routes.ts  # Gestión de documentos
│   │       ├── catalogos.routes.ts   # Catálogos
│   │       └── db.ts                 # Conexión a BD
│   ├── scripts/
│   │   └── generar-usuarios.js
│   └── package.json
├── frontend/                 # Interfaces web
│   ├── auth-test.html               # Login/Registro
│   ├── dashboard-alumno.html        # Dashboard de alumnos
│   ├── dashboard-admin.html         # Dashboard administrativo
│   └── revision-documentos.html     # Revisión de documentos
├── SQL/                      # Scripts de base de datos
│   ├── univ_docs_mvp.sql           # Creación de BD
│   ├── seed_basico.sql             # Datos básicos
│   ├── seed_usuarios_prueba.sql    # Usuarios de prueba
│   └── seed_tipos_tramite_documentos.sql
├── img/                      # Recursos
│   └── Logo.png             # Logo institucional
└── docs/                     # Documentación
    ├── dashboard-alumno.md
    ├── vista-alumnos.md
    ├── usuarios-prueba.md
    ├── api-auth.md
    ├── db.md
    └── casos-uso.md
```

## 🚀 Características Principales

### Para Alumnos
- ✅ Registro con selección de carrera/programa
- ✅ Dashboard personalizado con estadísticas
- ✅ Sistema de notificaciones en tiempo real
- ✅ Subida de documentos (Solicitud, Kárdex, Comprobante de Pago)
- ✅ Seguimiento de estado de documentos
- ✅ Validación de archivos (tipo y tamaño)
- ✅ Barra de progreso visual

### Para Administradores/Docentes
- ✅ Vista de revisión de documentos
- ✅ Filtros por programa, semestre y estado
- ✅ Notificaciones de documentos que requieren revisión
- ✅ Aprobación/Rechazo de documentos
- ✅ División por carrera, semestre y grupo
- ✅ Dashboard administrativo completo

### Sistema General
- ✅ Autenticación JWT con roles
- ✅ Redirección automática según tipo de usuario
- ✅ Diseño responsive y moderno
- ✅ Paleta de colores consistente
- ✅ Logo institucional en todas las vistas

## 📦 Instalación

### 1. Base de Datos

Ejecuta los scripts SQL en orden:

```sql
-- 1. Crear base de datos y tablas
SQL/univ_docs_mvp.sql

-- 2. Datos básicos (departamentos, programas)
SQL/seed_basico.sql

-- 3. Tipos de trámite y documentos
SQL/seed_tipos_tramite_documentos.sql

-- 4. Usuarios de prueba
SQL/seed_usuarios_prueba.sql
```

### 2. Backend

```bash
cd backend
npm install

# Configurar .env
# El archivo .env ya debe estar creado con:
# - SQL_SERVER=SARFERT
# - SQL_DATABASE=univ_docs
# - SQL_AUTH=sql
# - SQL_USER=sa
# - SQL_PASSWORD=tu_password

npm run dev
```

### 3. Frontend

Simplemente abre `frontend/auth-test.html` en tu navegador.

## 👥 Usuarios de Prueba

| Email | Contraseña | Rol | Vista |
|-------|-----------|-----|-------|
| alumno@uni.mx | Alumno123! | Alumno | Dashboard Alumno |
| admin@uni.mx | Admin123! | Administrador | Dashboard Admin + Revisión |
| docente@uni.mx | Docente123! | Docente | Dashboard Admin + Revisión |

## 🎯 Flujo de Uso

### Alumno
1. Inicia sesión → Redirigido a `dashboard-alumno.html`
2. Ve notificaciones de sus documentos
3. Sube documentos requeridos (Solicitud, Kárdex, Pago)
4. Recibe notificaciones cuando son revisados

### Administrador/Docente
1. Inicia sesión → Redirigido a `dashboard-admin.html`
2. Haz clic en "📋 Revisar Documentos"
3. Filtra por programa, semestre o estado
4. Revisa documentos de alumnos
5. Aprueba o rechaza con comentarios

## 🔧 Endpoints de la API

### Autenticación
- `POST /auth/register` - Registrar alumno
- `POST /auth/login` - Iniciar sesión
- `POST /auth/refresh` - Renovar token
- `GET /auth/me` - Perfil del usuario

### Alumnos
- `GET /alumnos` - Listar alumnos
- `GET /alumnos/buscar?q=texto` - Buscar alumnos
- `GET /alumnos/:id` - Detalle de alumno
- `GET /alumnos/:id/tramites` - Trámites del alumno
- `PATCH /alumnos/:id` - Actualizar alumno
- `GET /alumnos/stats/general` - Estadísticas

### Documentos
- `GET /documentos/mis-documentos` - Documentos del alumno
- `POST /documentos/subir` - Subir documento
- `GET /documentos/notificaciones` - Obtener notificaciones
- `PATCH /documentos/notificaciones/:id/marcar-leida` - Marcar como leída

### Catálogos
- `GET /catalogos/programas` - Listar programas académicos

## 🎨 Vistas del Sistema

### 1. Login/Registro (`auth-test.html`)
- Formulario de inicio de sesión
- Formulario de registro de alumnos con:
  - Nombre y apellidos
  - Correo institucional
  - Contraseña
  - Semestre (opcional)
  - Matrícula
  - **Selector de Carrera/Programa** (carga dinámica desde BD)
- Logo institucional en header
- Paleta de colores verde

### 2. Dashboard de Alumno (`dashboard-alumno.html`)
- Estadísticas personales
- Panel de notificaciones
- 3 documentos para subir:
  - Solicitud de Reinscripción/Inscripción
  - Kárdex Académico
  - Comprobante de Pago
- Estados visuales (Pendiente, En Revisión, Aprobado, Rechazado)

### 3. Dashboard Administrativo (`dashboard-admin.html`)
- Estadísticas generales del sistema
- Accesos rápidos a módulos
- Acceso a revisión de documentos
- Logo institucional

### 4. Revisión de Documentos (`revision-documentos.html`)
- **Filtros avanzados**:
  - Por programa/carrera
  - Por semestre (1-10)
  - Por estado (Pendiente, En Revisión, Aprobado, Rechazado)
  - Búsqueda por nombre o matrícula
- **Vista de alumnos**:
  - Avatar con iniciales
  - Nombre completo, matrícula, programa, semestre
  - Badge "Necesita Revisión" animado
- **Documentos por alumno**:
  - Solicitud, Kárdex, Comprobante de Pago
  - Botones: Ver, Aprobar, Rechazar
  - Estados visuales con colores
- **Estadísticas en tiempo real**:
  - Total pendientes
  - En revisión
  - Aprobados
  - Rechazados

## 🔐 Seguridad

- ✅ Autenticación JWT
- ✅ Tokens con expiración (1h access, 7d refresh)
- ✅ Contraseñas hasheadas con bcrypt
- ✅ Validación de entrada con Zod
- ✅ SQL parametrizado
- ✅ Verificación de roles y permisos

## 🎓 Tecnologías Utilizadas

### Backend
- Node.js 18+
- TypeScript
- Express.js
- SQL Server 2019
- JWT (jsonwebtoken)
- Bcrypt
- Zod (validación)

### Frontend
- HTML5
- CSS3 (Variables CSS)
- JavaScript (ES6+)
- Fetch API
- LocalStorage

## 📊 Estados de Documentos

- 🟡 **Pendiente**: Documento no subido
- 🔵 **En Revisión**: Subido, esperando validación
- 🟢 **Aprobado**: Validado y aceptado
- 🔴 **Rechazado**: No cumple requisitos

## 🚧 Próximas Mejoras

1. Almacenamiento real de archivos (S3/MinIO)
2. Visor de documentos PDF en línea
3. OCR automático para validación
4. Sistema de notificaciones por email
5. Reportes y análisis avanzados
6. Firma digital de documentos
7. Historial completo de versiones
8. Chat en tiempo real

## 📝 Documentación Adicional

- `docs/dashboard-alumno.md` - Guía completa del dashboard de alumno
- `docs/usuarios-prueba.md` - Credenciales y flujos de login
- `docs/api-auth.md` - Documentación de la API de autenticación
- `docs/db.md` - Diseño de base de datos
- `INSTRUCCIONES_INSTALACION.md` - Guía paso a paso de instalación

## 🤝 Soporte

Para problemas o preguntas:
1. Revisa la documentación en `/docs`
2. Verifica los logs del backend en la terminal
3. Usa la consola del navegador (F12) para debug
4. Asegúrate de que todos los scripts SQL se ejecutaron

## 📄 Licencia

Sistema de Gestión Universitaria - Proyecto Académico 2025

---

**Desarrollado para**: Gestión de Proyectos  
**Versión**: 1.0 MVP  
**Fecha**: Septiembre 2025
