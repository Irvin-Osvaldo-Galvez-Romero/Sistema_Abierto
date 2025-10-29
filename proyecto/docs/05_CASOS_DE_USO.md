# CASOS DE USO
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

## 1. INTRODUCCIÓN

### 1.1 Propósito del Documento
Este documento describe los casos de uso del Sistema de Gestión Documental Universitaria TESCHI, definiendo las interacciones entre los actores del sistema y las funcionalidades que el sistema debe proporcionar.

### 1.2 Alcance
El documento cubre todos los casos de uso principales del sistema, incluyendo la gestión de usuarios, administración de estudiantes, manejo de documentos y funcionalidades administrativas.

### 1.3 Definiciones
- **Actor:** Entidad externa que interactúa con el sistema
- **Caso de Uso:** Descripción de una funcionalidad del sistema
- **Escenario:** Secuencia específica de pasos en un caso de uso
- **Precondición:** Condición que debe cumplirse antes de ejecutar el caso de uso
- **Postcondición:** Estado del sistema después de ejecutar el caso de uso

---

## 2. ACTORES DEL SISTEMA

### 2.1 Actores Primarios
- **Administrador:** Usuario con acceso completo al sistema
- **Estudiante:** Usuario que sube documentos y consulta su estado
- **Profesor:** Usuario que revisa información de estudiantes

### 2.2 Actores Secundarios
- **Sistema de Correo:** Envía notificaciones automáticas
- **Sistema de Archivos:** Almacena documentos subidos
- **Base de Datos:** Persiste información del sistema

---

## 3. DIAGRAMA DE CASOS DE USO

```
                    SISTEMA DE GESTIÓN DOCUMENTAL TESCHI
    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
    │  │Administrador│    │  Estudiante │    │  Profesor   │         │
    │  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘         │
    │         │                  │                  │                │
    │         │                  │                  │                │
    │    ┌────▼────┐        ┌────▼────┐        ┌────▼────┐           │
    │    │Gestionar│        │Subir    │        │Revisar  │           │
    │    │Usuarios │        │Documento│        │Documento│           │
    │    └─────────┘        └─────────┘        └─────────┘           │
    │         │                  │                  │                │
    │         │                  │                  │                │
    │    ┌────▼────┐        ┌────▼────┐        ┌────▼────┐           │
    │    │Gestionar│        │Consultar│        │Ver      │           │
    │    │Estudiantes│      │Estado   │        │Estudiantes│         │
    │    └─────────┘        └─────────┘        └─────────┘           │
    │         │                  │                  │                │
    │         │                  │                  │                │
    │    ┌────▼────┐        ┌────▼────┐        ┌────▼────┐           │
    │    │Revisar  │        │Autenticarse│     │Autenticarse│       │
    │    │Documentos│       └─────────┘        └─────────┘           │
    │    └─────────┘              │                  │                │
    │         │                   │                  │                │
    │         │                   │                  │                │
    │    ┌────▼────┐        ┌────▼────┐        ┌────▼────┐           │
    │    │Generar  │        │Cambiar  │        │Cambiar  │           │
    │    │Reportes │        │Contraseña│       │Contraseña│          │
    │    └─────────┘        └─────────┘        └─────────┘           │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
```

---

## 4. CASOS DE USO DETALLADOS

### CU-001: Autenticarse en el Sistema

**Actor Principal:** Todos los usuarios  
**Actor Secundario:** Sistema de autenticación  
**Descripción:** El usuario inicia sesión en el sistema proporcionando sus credenciales.

**Precondiciones:**
- El usuario debe tener una cuenta válida en el sistema
- El sistema debe estar operativo

**Flujo Principal:**
1. El usuario accede a la página de login
2. El usuario ingresa su email y contraseña
3. El sistema valida las credenciales
4. El sistema genera un token de sesión
5. El sistema redirige al usuario según su rol:
   - Administrador → Dashboard de administrador
   - Profesor → Dashboard de profesor
   - Estudiante → Dashboard de estudiante

**Flujos Alternativos:**
- **3a. Credenciales inválidas:**
  1. El sistema muestra mensaje de error
  2. El usuario puede intentar nuevamente
- **3b. Cuenta bloqueada:**
  1. El sistema muestra mensaje de cuenta bloqueada
  2. El usuario debe contactar al administrador
- **3c. Primer login:**
  1. El sistema redirige a cambio de contraseña
  2. El usuario debe cambiar su contraseña

**Postcondiciones:**
- El usuario está autenticado en el sistema
- Se ha creado una sesión activa
- El usuario puede acceder a las funcionalidades según su rol

**Criterios de Aceptación:**
- El sistema debe validar credenciales en menos de 2 segundos
- Debe implementar bloqueo por intentos fallidos
- Debe requerir cambio de contraseña en primer login

---

### CU-002: Registrar Usuario

**Actor Principal:** Administrador  
**Actor Secundario:** Sistema de correo  
**Descripción:** El administrador registra un nuevo usuario en el sistema.

**Precondiciones:**
- El administrador debe estar autenticado
- El email del nuevo usuario debe ser único

**Flujo Principal:**
1. El administrador accede a la gestión de usuarios
2. El administrador selecciona "Crear Usuario"
3. El administrador completa el formulario de registro
4. El sistema valida los datos ingresados
5. El sistema crea la cuenta de usuario
6. El sistema genera credenciales automáticamente
7. El sistema envía las credenciales por correo electrónico
8. El sistema muestra confirmación de registro

**Flujos Alternativos:**
- **4a. Datos inválidos:**
  1. El sistema muestra errores de validación
  2. El administrador corrige los datos
  3. Vuelve al paso 4
- **4b. Email duplicado:**
  1. El sistema muestra error de email duplicado
  2. El administrador ingresa un email diferente
  3. Vuelve al paso 4

**Postcondiciones:**
- Se ha creado un nuevo usuario en el sistema
- Se han enviado las credenciales por correo
- El usuario puede autenticarse en el sistema

**Criterios de Aceptación:**
- Debe validar todos los campos obligatorios
- Debe generar credenciales seguras
- Debe enviar correo de confirmación

---

### CU-003: Gestionar Estudiantes

**Actor Principal:** Administrador  
**Actor Secundario:** Base de datos  
**Descripción:** El administrador gestiona la información de los estudiantes.

**Precondiciones:**
- El administrador debe estar autenticado
- Debe existir al menos una carrera en el sistema

**Flujo Principal:**
1. El administrador accede a la gestión de estudiantes
2. El sistema muestra la lista de estudiantes
3. El administrador puede realizar las siguientes acciones:
   - **Ver detalles:** Click en un estudiante
   - **Crear nuevo:** Click en "Nuevo Estudiante"
   - **Buscar:** Ingresar criterios de búsqueda
   - **Dar de baja:** Click en "Dar de Baja"
   - **Eliminar:** Click en "Eliminar Permanentemente"

**Subcasos de Uso:**

#### CU-003.1: Ver Detalles de Estudiante
1. El administrador click en un estudiante
2. El sistema muestra información completa del estudiante
3. El sistema muestra documentos subidos por el estudiante
4. El administrador puede ver, descargar o previsualizar documentos

#### CU-003.2: Crear Nuevo Estudiante
1. El administrador click en "Nuevo Estudiante"
2. El sistema muestra formulario de registro
3. El administrador completa los datos del estudiante
4. El sistema valida los datos
5. El sistema crea la cuenta del estudiante
6. El sistema envía credenciales por correo
7. El sistema muestra confirmación

#### CU-003.3: Dar de Baja Estudiante
1. El administrador click en "Dar de Baja"
2. El sistema muestra diálogo de confirmación
3. El administrador confirma la acción
4. El sistema marca al estudiante como "BAJA_DEFINITIVA"
5. El sistema conserva todos los datos
6. El sistema muestra confirmación

#### CU-003.4: Eliminar Estudiante Permanentemente
1. El administrador click en "Eliminar Permanentemente"
2. El sistema muestra advertencia fuerte
3. El administrador confirma la eliminación
4. El sistema elimina completamente al estudiante
5. El sistema elimina todos los datos relacionados
6. El sistema muestra confirmación

**Postcondiciones:**
- La información de estudiantes ha sido actualizada
- Se han realizado las acciones solicitadas
- Los cambios se han persistido en la base de datos

**Criterios de Aceptación:**
- Debe mostrar información completa de estudiantes
- Debe permitir búsqueda y filtrado
- Debe implementar confirmaciones para acciones destructivas

---

### CU-004: Subir Documento

**Actor Principal:** Estudiante  
**Actor Secundario:** Sistema de archivos  
**Descripción:** El estudiante sube un documento académico al sistema.

**Precondiciones:**
- El estudiante debe estar autenticado
- El archivo debe cumplir con los formatos permitidos

**Flujo Principal:**
1. El estudiante accede a su dashboard
2. El estudiante selecciona "Subir Documento"
3. El sistema muestra formulario de subida
4. El estudiante selecciona el tipo de documento
5. El estudiante selecciona el archivo
6. El sistema valida el archivo (formato, tamaño)
7. El sistema sube el archivo al servidor
8. El sistema almacena metadatos en la base de datos
9. El sistema notifica al administrador
10. El sistema muestra confirmación de subida

**Flujos Alternativos:**
- **6a. Archivo inválido:**
  1. El sistema muestra error de validación
  2. El estudiante selecciona un archivo válido
  3. Vuelve al paso 6
- **6b. Archivo muy grande:**
  1. El sistema muestra error de tamaño
  2. El estudiante comprime o reduce el archivo
  3. Vuelve al paso 6

**Postcondiciones:**
- El documento ha sido almacenado en el sistema
- El administrador ha sido notificado
- El documento aparece en la lista del estudiante

**Criterios de Aceptación:**
- Debe aceptar formatos: PDF, DOC, DOCX, JPG, PNG
- Debe validar tamaño máximo de 10MB
- Debe generar nombres únicos para archivos

---

### CU-005: Revisar Documento

**Actor Principal:** Administrador  
**Actor Secundario:** Sistema de correo  
**Descripción:** El administrador revisa y aprueba/rechaza documentos subidos por estudiantes.

**Precondiciones:**
- El administrador debe estar autenticado
- Debe existir al menos un documento pendiente de revisión

**Flujo Principal:**
1. El administrador accede a la revisión de documentos
2. El sistema muestra lista de documentos pendientes
3. El administrador selecciona un documento
4. El sistema muestra información del documento y estudiante
5. El administrador puede:
   - Previsualizar el documento
   - Descargar el documento
   - Aprobar el documento
   - Rechazar el documento
6. Si aprueba:
   - El sistema marca el documento como "APROBADO"
   - El sistema notifica al estudiante
7. Si rechaza:
   - El sistema solicita motivo del rechazo
   - El sistema marca el documento como "RECHAZADO"
   - El sistema notifica al estudiante con el motivo

**Flujos Alternativos:**
- **5a. Documento no se puede previsualizar:**
  1. El sistema muestra mensaje de error
  2. El administrador puede descargar el documento
  3. Continúa con la revisión

**Postcondiciones:**
- El documento ha sido revisado
- El estudiante ha sido notificado del resultado
- El estado del documento ha sido actualizado

**Criterios de Aceptación:**
- Debe permitir previsualización de documentos
- Debe notificar al estudiante el resultado
- Debe mantener historial de revisiones

---

### CU-006: Consultar Estado de Documentos

**Actor Principal:** Estudiante  
**Actor Secundario:** Base de datos  
**Descripción:** El estudiante consulta el estado de sus documentos subidos.

**Precondiciones:**
- El estudiante debe estar autenticado
- El estudiante debe haber subido al menos un documento

**Flujo Principal:**
1. El estudiante accede a su dashboard
2. El estudiante selecciona "Mis Documentos"
3. El sistema muestra lista de documentos del estudiante
4. Para cada documento se muestra:
   - Nombre del documento
   - Fecha de subida
   - Estado actual (Pendiente, Aprobado, Rechazado)
   - Fecha de revisión (si aplica)
   - Comentarios del administrador (si aplica)
5. El estudiante puede:
   - Ver detalles del documento
   - Descargar documentos aprobados
   - Subir nueva versión si fue rechazado

**Flujos Alternativos:**
- **4a. No hay documentos:**
  1. El sistema muestra mensaje "No hay documentos"
  2. El estudiante puede subir un documento

**Postcondiciones:**
- El estudiante conoce el estado de sus documentos
- Puede tomar acciones según el estado

**Criterios de Aceptación:**
- Debe mostrar información clara del estado
- Debe permitir descarga de documentos aprobados
- Debe mostrar fechas y comentarios relevantes

---

### CU-007: Generar Reportes

**Actor Principal:** Administrador  
**Actor Secundario:** Sistema de reportes  
**Descripción:** El administrador genera reportes estadísticos del sistema.

**Precondiciones:**
- El administrador debe estar autenticado
- Debe existir datos en el sistema

**Flujo Principal:**
1. El administrador accede al dashboard administrativo
2. El sistema muestra estadísticas generales
3. El administrador puede generar reportes de:
   - Estudiantes por carrera
   - Documentos por estado
   - Actividad de usuarios
   - Documentos más subidos
4. El administrador selecciona tipo de reporte
5. El sistema genera el reporte
6. El administrador puede:
   - Ver el reporte en pantalla
   - Exportar a PDF
   - Exportar a Excel

**Flujos Alternativos:**
- **5a. No hay datos suficientes:**
  1. El sistema muestra mensaje "Datos insuficientes"
  2. El administrador puede seleccionar otro reporte

**Postcondiciones:**
- Se ha generado el reporte solicitado
- El administrador tiene la información requerida

**Criterios de Aceptación:**
- Debe generar reportes en tiempo real
- Debe permitir exportación en múltiples formatos
- Debe mostrar gráficos y estadísticas claras

---

### CU-008: Cambiar Contraseña

**Actor Principal:** Todos los usuarios  
**Actor Secundario:** Sistema de autenticación  
**Descripción:** El usuario cambia su contraseña de acceso.

**Precondiciones:**
- El usuario debe estar autenticado
- El usuario debe conocer su contraseña actual

**Flujo Principal:**
1. El usuario accede a su perfil
2. El usuario selecciona "Cambiar Contraseña"
3. El sistema muestra formulario de cambio
4. El usuario ingresa:
   - Contraseña actual
   - Nueva contraseña
   - Confirmación de nueva contraseña
5. El sistema valida los datos
6. El sistema actualiza la contraseña
7. El sistema muestra confirmación

**Flujos Alternativos:**
- **5a. Contraseña actual incorrecta:**
  1. El sistema muestra error
  2. El usuario ingresa la contraseña correcta
  3. Vuelve al paso 5
- **5b. Nueva contraseña no cumple requisitos:**
  1. El sistema muestra requisitos de contraseña
  2. El usuario ingresa una contraseña válida
  3. Vuelve al paso 5

**Postcondiciones:**
- La contraseña ha sido actualizada
- El usuario debe usar la nueva contraseña para futuros logins

**Criterios de Aceptación:**
- Debe validar contraseña actual
- Debe aplicar políticas de seguridad
- Debe confirmar el cambio exitoso

---

## 5. DIAGRAMAS DE SECUENCIA

### 5.1 Autenticación de Usuario

```
Usuario    Frontend    Backend    Base de Datos
  |           |          |            |
  |--login--->|          |            |
  |           |--POST /api/auth/login->|
  |           |          |            |
  |           |          |--validar credenciales->|
  |           |          |<--usuario válido------|
  |           |          |            |
  |           |<--token JWT-----------|
  |<--redirección---------------------|
  |           |          |            |
```

### 5.2 Subida de Documento

```
Estudiante  Frontend    Backend    Base de Datos    Sistema Archivos
    |          |          |            |                 |
    |--subir-->|          |            |                 |
    |          |--POST /api/documents->|                 |
    |          |          |            |                 |
    |          |          |--validar archivo->|          |
    |          |          |<--archivo válido--|          |
    |          |          |            |                 |
    |          |          |--guardar metadatos->|        |
    |          |          |            |                 |
    |          |          |--guardar archivo---------->|
    |          |          |            |                 |
    |          |<--confirmación--------|                 |
    |<--éxito----------------|            |                 |
```

---

## 6. DIAGRAMAS DE ACTIVIDAD

### 6.1 Proceso de Gestión de Estudiantes

```
[Inicio] → [Acceder a Gestión] → [¿Acción?]
    ↓
[Ver Detalles] → [Mostrar Info] → [Fin]
[Crear Nuevo] → [Formulario] → [Validar] → [Crear] → [Notificar] → [Fin]
[Buscar] → [Filtros] → [Mostrar Resultados] → [Fin]
[Dar de Baja] → [Confirmar] → [Soft Delete] → [Fin]
[Eliminar] → [Advertencia] → [Confirmar] → [Hard Delete] → [Fin]
```

### 6.2 Proceso de Revisión de Documentos

```
[Inicio] → [Lista Documentos] → [Seleccionar] → [¿Acción?]
    ↓
[Previsualizar] → [Ver Documento] → [¿Aprobar?]
[Descargar] → [Descargar Archivo] → [¿Aprobar?]
    ↓
[Sí] → [Aprobar] → [Notificar Estudiante] → [Fin]
[No] → [Motivo] → [Rechazar] → [Notificar Estudiante] → [Fin]
```

---

## 7. CRITERIOS DE ACEPTACIÓN POR CASO DE USO

### 7.1 CU-001: Autenticarse
- Tiempo de respuesta < 2 segundos
- Bloqueo por 5 intentos fallidos
- Redirección correcta según rol
- Cambio obligatorio de contraseña en primer login

### 7.2 CU-002: Registrar Usuario
- Validación de campos obligatorios
- Email único en el sistema
- Generación automática de credenciales
- Envío de correo de confirmación

### 7.3 CU-003: Gestionar Estudiantes
- Búsqueda en tiempo real
- Confirmaciones para acciones destructivas
- Información completa y actualizada
- Operaciones CRUD completas

### 7.4 CU-004: Subir Documento
- Formatos permitidos: PDF, DOC, DOCX, JPG, PNG
- Tamaño máximo: 10MB
- Nombres únicos para archivos
- Notificación automática a administrador

### 7.5 CU-005: Revisar Documento
- Previsualización de documentos
- Aprobación/rechazo con comentarios
- Notificación automática al estudiante
- Historial de revisiones

### 7.6 CU-006: Consultar Estado
- Información clara y actualizada
- Fechas y comentarios relevantes
- Descarga de documentos aprobados
- Interfaz intuitiva

### 7.7 CU-007: Generar Reportes
- Datos en tiempo real
- Exportación a PDF y Excel
- Gráficos y estadísticas claras
- Filtros y opciones de personalización

### 7.8 CU-008: Cambiar Contraseña
- Validación de contraseña actual
- Políticas de seguridad aplicadas
- Confirmación de cambio exitoso
- Seguridad en el proceso

---

## 8. MÉTRICAS DE RENDIMIENTO

### 8.1 Tiempos de Respuesta
- **Autenticación:** < 2 segundos
- **Carga de páginas:** < 3 segundos
- **Subida de archivos:** < 10 segundos
- **Generación de reportes:** < 15 segundos

### 8.2 Disponibilidad
- **Sistema:** 99.5% uptime
- **Base de datos:** 99.9% uptime
- **Servidor de archivos:** 99.8% uptime

### 8.3 Capacidad
- **Usuarios concurrentes:** 100
- **Documentos por usuario:** 50
- **Tamaño total de archivos:** 1TB

---

**Documento elaborado por:** Equipo de Desarrollo TESCHI  
**Fecha de creación:** [Fecha actual]  
**Última actualización:** [Fecha actual]  
**Próxima revisión:** [Fecha + 1 mes]
