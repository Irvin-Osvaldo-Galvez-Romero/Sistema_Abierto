# MAPEO DE PROCESOS
## Sistema de Gestión Documental Universitaria TESCHI

---

## CARÁTULA

**INSTITUCIÓN:** Tecnológico de Estudios Superiores de Chimalhuacán (TESCHI)  
**PROYECTO:** Sistema de Gestión Documental Universitaria  
**MATERIA:** Ingeniería de Software  
**DOCENTE:** Modesto Castro Yolanda  
**SEMESTRE:** 7ISC23 

### INTEGRANTES DEL EQUIPO:

1. **Gálvez Romero Irvin Osvaldo** - Administrador de Base de Datos / Desarrollador Full-Stack
2. **Cruz Contreras Ángel Valentín** - Desarrollador Frontend / UI/UX
3. **Sánchez Vargas Kevin Antonio** - Analista de Sistemas / Desarrollador Backend
4. **Juárez Vargas Alberto** - Líder de Proyecto / DevOps

**FECHA:** [Fecha actual]  
**VERSIÓN:** 1.0

---

## 1. PROCESO PRINCIPAL: GESTIÓN DE DOCUMENTOS ACADÉMICOS

### 1.1 Subproceso: Registro de Usuarios

**Actores:** Administrador, Estudiante, Profesor  
**Objetivo:** Crear cuentas de usuario en el sistema

**Flujo Principal:**
1. Usuario accede al sistema
2. Selecciona "Registrarse"
3. Completa formulario de registro
4. Sistema valida datos
5. Sistema crea cuenta de usuario
6. Sistema envía credenciales por correo
7. Usuario recibe confirmación

**Flujo Alternativo:**
- Si datos inválidos → Mostrar errores de validación
- Si correo duplicado → Mostrar mensaje de error

### 1.2 Subproceso: Autenticación de Usuarios

**Actores:** Todos los usuarios  
**Objetivo:** Verificar identidad y autorizar acceso

**Flujo Principal:**
1. Usuario ingresa credenciales
2. Sistema valida credenciales
3. Sistema genera token de sesión
4. Sistema redirige según rol:
   - Administrador → Dashboard Admin
   - Profesor → Dashboard Profesor
   - Estudiante → Dashboard Estudiante

**Flujo Alternativo:**
- Si credenciales incorrectas → Mostrar error
- Si cuenta bloqueada → Mostrar mensaje de bloqueo
- Si primer login → Redirigir a cambio de contraseña

### 1.3 Subproceso: Gestión de Estudiantes

**Actores:** Administrador  
**Objetivo:** Administrar información de estudiantes

**Flujo Principal:**
1. Administrador accede a gestión de estudiantes
2. Sistema muestra lista de estudiantes
3. Administrador puede:
   - Ver detalles de estudiante
   - Crear nuevo estudiante
   - Dar de baja estudiante (soft delete)
   - Eliminar permanentemente (hard delete)
   - Buscar estudiantes
4. Sistema actualiza base de datos
5. Sistema muestra confirmación

### 1.4 Subproceso: Gestión de Documentos

**Actores:** Estudiante, Administrador  
**Objetivo:** Subir, revisar y gestionar documentos académicos

**Flujo Principal (Subida):**
1. Estudiante selecciona "Subir Documento"
2. Estudiante selecciona tipo de documento
3. Estudiante adjunta archivo
4. Sistema valida archivo
5. Sistema almacena documento
6. Sistema notifica a administrador

**Flujo Principal (Revisión):**
1. Administrador accede a revisión de documentos
2. Sistema muestra documentos pendientes
3. Administrador revisa documento
4. Administrador aprueba o rechaza
5. Sistema notifica resultado al estudiante

### 1.5 Subproceso: Gestión de Carreras

**Actores:** Administrador  
**Objetivo:** Administrar carreras académicas

**Flujo Principal:**
1. Administrador accede a gestión de carreras
2. Sistema muestra lista de carreras
3. Administrador puede:
   - Crear nueva carrera
   - Editar carrera existente
   - Desactivar carrera
4. Sistema valida datos
5. Sistema actualiza base de datos

---

## 2. DIAGRAMA DE FLUJO PRINCIPAL

```
[Inicio] → [Acceso al Sistema] → [Autenticación]
    ↓
[¿Usuario Autenticado?]
    ↓ NO
[Mostrar Login] ← [Registro de Usuario]
    ↓ SÍ
[¿Primer Login?]
    ↓ SÍ
[Cambio de Contraseña]
    ↓ NO
[Redirección según Rol]
    ↓
[Administrador] → [Dashboard Admin] → [Gestión de Estudiantes/Documentos]
[Profesor] → [Dashboard Profesor] → [Revisión de Documentos]
[Estudiante] → [Dashboard Estudiante] → [Subir Documentos]
    ↓
[Fin]
```

---

## 3. DIAGRAMA DE FLUJO: GESTIÓN DE DOCUMENTOS

```
[Estudiante] → [Seleccionar Documento] → [Validar Archivo]
    ↓
[¿Archivo Válido?]
    ↓ NO
[Mostrar Error] → [Volver a Seleccionar]
    ↓ SÍ
[Subir Archivo] → [Almacenar en BD] → [Notificar Admin]
    ↓
[Admin] → [Revisar Documento] → [¿Aprobar?]
    ↓ SÍ
[Documento Aprobado] → [Notificar Estudiante]
    ↓ NO
[Documento Rechazado] → [Notificar Estudiante]
```

---

## 4. DIAGRAMA DE FLUJO: GESTIÓN DE ESTUDIANTES

```
[Admin] → [Gestión Estudiantes] → [¿Acción?]
    ↓
[Ver Detalles] → [Mostrar Info Completa]
[Crear Nuevo] → [Formulario] → [Validar] → [Crear Usuario]
[Dar de Baja] → [Confirmar] → [Soft Delete]
[Eliminar] → [Confirmar] → [Hard Delete]
[Buscar] → [Filtros] → [Mostrar Resultados]
```

---

## 5. MATRIZ DE ROLES Y RESPONSABILIDADES

| Proceso | Administrador | Profesor | Estudiante |
|---------|---------------|----------|------------|
| Registro de Usuarios | ✓ Crear | ✗ | ✓ Registrarse |
| Autenticación | ✓ | ✓ | ✓ |
| Gestión Estudiantes | ✓ CRUD | ✗ | ✗ |
| Gestión Documentos | ✓ Revisar | ✓ Revisar | ✓ Subir |
| Gestión Carreras | ✓ CRUD | ✗ | ✗ |
| Dashboard | ✓ Completo | ✓ Limitado | ✓ Básico |

---

## 6. DIAGRAMA DE CONTEXTO

```
[Estudiante] ←→ [Sistema TESCHI] ←→ [Administrador]
                      ↕
                [Base de Datos]
                      ↕
                [Servidor de Archivos]
                      ↕
                [Servidor de Correo]
```

---

## 7. DIAGRAMA DE COMPONENTES

```
[Frontend React] ←→ [API REST] ←→ [Base de Datos SQLite]
       ↕                ↕
[Autenticación]   [Servicios de Negocio]
       ↕                ↕
[Middleware]      [Controladores]
       ↕                ↕
[Validación]      [Modelos de Datos]
```

---

## 8. DIAGRAMA DE DESPLIEGUE

```
[Cliente Web] ←→ [Servidor Web (Node.js)] ←→ [Base de Datos SQLite]
     ↕                    ↕
[Navegador]        [Servidor de Archivos]
     ↕                    ↕
[React App]        [Sistema de Correo]
```

---

## 9. MÉTRICAS DE PROCESO

### 9.1 Tiempos de Respuesta
- **Autenticación:** < 2 segundos
- **Carga de documentos:** < 5 segundos
- **Búsqueda de estudiantes:** < 3 segundos
- **Generación de reportes:** < 10 segundos

### 9.2 Disponibilidad
- **Sistema:** 99.5% uptime
- **Base de datos:** 99.9% uptime
- **Servidor de archivos:** 99.8% uptime

### 9.3 Capacidad
- **Usuarios concurrentes:** 100
- **Documentos por usuario:** 50
- **Tamaño máximo de archivo:** 10MB

---

## 10. MEJORAS CONTINUAS

### 10.1 Optimizaciones Identificadas
1. Implementar caché para consultas frecuentes
2. Compresión de archivos para reducir almacenamiento
3. Backup automático de base de datos
4. Monitoreo en tiempo real del sistema

### 10.2 Indicadores de Calidad
- **Satisfacción del usuario:** > 4.5/5
- **Tiempo de resolución de incidencias:** < 24 horas
- **Disponibilidad del sistema:** > 99%
- **Tiempo de respuesta promedio:** < 3 segundos

---

**Documento elaborado por:** Equipo de Desarrollo TESCHI  
**Fecha de creación:** [Fecha actual]  
**Última actualización:** [Fecha actual]  
**Próxima revisión:** [Fecha + 1 mes]
