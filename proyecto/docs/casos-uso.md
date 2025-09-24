# Diagramas de Casos de Uso - Sistema de Gestión de Documentos Universitarios

## 1. Diagrama General de Actores y Casos de Uso

```mermaid
graph TB
    subgraph "Actores Externos"
        A[Alumno]
        D[Docente]
        AD[Administrativo]
        ADM[Administrador del Sistema]
    end
    
    subgraph "Sistema de Gestión de Documentos"
        subgraph "Portal de Alumnos"
            UC1[Registrarse en el Sistema]
            UC2[Iniciar Sesión]
            UC3[Ver Dashboard Personal]
            UC4[Iniciar Trámite]
            UC5[Subir Documentos]
            UC6[Ver Estado de Trámites]
            UC7[Recibir Notificaciones]
        end
        
        subgraph "Portal de Docentes/Administrativos"
            UC8[Iniciar Sesión]
            UC9[Ver Cola de Revisión]
            UC10[Revisar Documentos]
            UC11[Aprobar/Rechazar Documentos]
            UC12[Comentar en Documentos]
            UC13[Reasignar Trámites]
        end
        
        subgraph "Administración del Sistema"
            UC14[Gestionar Usuarios]
            UC15[Configurar Tipos de Trámite]
            UC16[Configurar Requisitos]
            UC17[Gestionar Roles y Permisos]
            UC18[Ver Reportes]
            UC19[Configurar Flujos de Trabajo]
        end
        
        subgraph "Sistema de Validación"
            UC20[Validar Archivos]
            UC21[Escaneo Antivirus]
            UC22[Procesar OCR]
            UC23[Detectar Códigos QR/Barras]
        end
    end
    
    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6
    A --> UC7
    
    D --> UC8
    D --> UC9
    D --> UC10
    D --> UC11
    D --> UC12
    D --> UC13
    
    AD --> UC8
    AD --> UC9
    AD --> UC10
    AD --> UC11
    AD --> UC12
    AD --> UC13
    
    ADM --> UC14
    ADM --> UC15
    ADM --> UC16
    ADM --> UC17
    ADM --> UC18
    ADM --> UC19
    
    UC5 --> UC20
    UC5 --> UC21
    UC5 --> UC22
    UC5 --> UC23
```

## 2. Casos de Uso Detallados - Portal de Alumnos

```mermaid
graph TB
    subgraph "Alumno"
        A[Alumno]
    end
    
    subgraph "Casos de Uso - Portal Alumnos"
        UC1[Registrarse]
        UC2[Iniciar Sesión]
        UC3[Ver Dashboard]
        UC4[Iniciar Trámite de Reinscripción]
        UC5[Iniciar Trámite de Kárdex]
        UC6[Iniciar Trámite de Pago]
        UC7[Subir Documento Kárdex]
        UC8[Subir Comprobante de Pago]
        UC9[Subir Ficha de Reinscripción]
        UC10[Ver Estado de Trámites]
        UC11[Descargar Constancias]
        UC12[Ver Historial de Documentos]
    end
    
    A --> UC1
    A --> UC2
    A --> UC3
    A --> UC4
    A --> UC5
    A --> UC6
    A --> UC7
    A --> UC8
    A --> UC9
    A --> UC10
    A --> UC11
    A --> UC12
```

## 3. Casos de Uso Detallados - Portal de Docentes/Administrativos

```mermaid
graph TB
    subgraph "Personal Académico"
        D[Docente]
        AD[Administrativo]
    end
    
    subgraph "Casos de Uso - Revisión"
        UC1[Iniciar Sesión]
        UC2[Ver Cola de Trabajo]
        UC3[Filtrar por Tipo de Trámite]
        UC4[Filtrar por Prioridad]
        UC5[Revisar Documento]
        UC6[Aprobar Documento]
        UC7[Rechazar Documento]
        UC8[Agregar Comentarios]
        UC9[Solicitar Cambios]
        UC10[Reasignar a Otro Revisor]
        UC11[Ver Historial de Revisiones]
        UC12[Generar Reporte de Actividad]
    end
    
    D --> UC1
    D --> UC2
    D --> UC3
    D --> UC4
    D --> UC5
    D --> UC6
    D --> UC7
    D --> UC8
    D --> UC9
    D --> UC10
    D --> UC11
    D --> UC12
    
    AD --> UC1
    AD --> UC2
    AD --> UC3
    AD --> UC4
    AD --> UC5
    AD --> UC6
    AD --> UC7
    AD --> UC8
    AD --> UC9
    AD --> UC10
    AD --> UC11
    AD --> UC12
```

## 4. Casos de Uso del Sistema - Validaciones Automáticas

```mermaid
graph TB
    subgraph "Sistema"
        S[Sistema de Validación]
    end
    
    subgraph "Validaciones Automáticas"
        UC1[Validar Tipo de Archivo]
        UC2[Validar Tamaño de Archivo]
        UC3[Detectar Archivos Duplicados]
        UC4[Escaneo Antivirus]
        UC5[Procesar OCR]
        UC6[Extraer Texto de Documentos]
        UC7[Detectar Códigos QR]
        UC8[Detectar Códigos de Barras]
        UC9[Validar Integridad del Archivo]
        UC10[Generar Hash SHA256]
        UC11[Crear Versión del Documento]
        UC12[Indexar para Búsqueda]
    end
    
    S --> UC1
    S --> UC2
    S --> UC3
    S --> UC4
    S --> UC5
    S --> UC6
    S --> UC7
    S --> UC8
    S --> UC9
    S --> UC10
    S --> UC11
    S --> UC12
```

## 5. Casos de Uso de Administración

```mermaid
graph TB
    subgraph "Administrador"
        ADM[Administrador del Sistema]
    end
    
    subgraph "Gestión del Sistema"
        UC1[Gestionar Usuarios]
        UC2[Crear/Editar Roles]
        UC3[Asignar Permisos]
        UC4[Configurar Tipos de Trámite]
        UC5[Definir Requisitos por Programa]
        UC6[Configurar Flujos de Trabajo]
        UC7[Gestionar Departamentos]
        UC8[Gestionar Programas Académicos]
        UC9[Configurar SLA por Trámite]
        UC10[Ver Reportes de Cumplimiento]
        UC11[Auditar Actividad del Sistema]
        UC12[Gestionar Políticas de Retención]
        UC13[Configurar Notificaciones]
        UC14[Gestionar Integraciones Externas]
    end
    
    ADM --> UC1
    ADM --> UC2
    ADM --> UC3
    ADM --> UC4
    ADM --> UC5
    ADM --> UC6
    ADM --> UC7
    ADM --> UC8
    ADM --> UC9
    ADM --> UC10
    ADM --> UC11
    ADM --> UC12
    ADM --> UC13
    ADM --> UC14
```

## 6. Flujo Principal - Trámite de Reinscripción

```mermaid
sequenceDiagram
    participant A as Alumno
    participant S as Sistema
    participant V as Validador
    participant D as Docente/Admin
    participant N as Notificaciones
    
    A->>S: Iniciar trámite de reinscripción
    S->>A: Mostrar checklist de requisitos
    A->>S: Subir documentos (Kárdex, Pago, Ficha)
    S->>V: Validar archivos
    V->>S: Resultado validación
    S->>D: Asignar para revisión
    N->>D: Notificar nueva tarea
    D->>S: Revisar documentos
    D->>S: Aprobar/Rechazar con comentarios
    S->>A: Actualizar estado
    N->>A: Notificar resultado
    alt Todos aprobados
        S->>A: Generar constancia
        N->>A: Notificar trámite completado
    else Hay rechazos
        S->>A: Solicitar correcciones
        A->>S: Subir documentos corregidos
    end
```

## 7. Casos de Uso de Búsqueda y Reportes

```mermaid
graph TB
    subgraph "Usuarios Autorizados"
        U[Usuario Autorizado]
    end
    
    subgraph "Búsqueda y Consultas"
        UC1[Buscar por Matrícula]
        UC2[Buscar por Nombre de Alumno]
        UC3[Buscar por Tipo de Documento]
        UC4[Buscar por Estado de Trámite]
        UC5[Buscar por Fechas]
        UC6[Buscar por Texto en OCR]
        UC7[Filtrar por Programa Académico]
        UC8[Filtrar por Departamento]
    end
    
    subgraph "Reportes"
        UC9[Reporte de SLA por Trámite]
        UC10[Reporte de Cuellos de Botella]
        UC11[Reporte de Cumplimiento]
        UC12[Reporte de Volumetría]
        UC13[Reporte de Actividad por Usuario]
        UC14[Reporte de Documentos Pendientes]
    end
    
    U --> UC1
    U --> UC2
    U --> UC3
    U --> UC4
    U --> UC5
    U --> UC6
    U --> UC7
    U --> UC8
    U --> UC9
    U --> UC10
    U --> UC11
    U --> UC12
    U --> UC13
    U --> UC14
```

## Descripción de Actores

### Actores Principales
- **Alumno**: Usuario que inicia trámites y sube documentos
- **Docente**: Personal académico que revisa y aprueba documentos
- **Administrativo**: Personal administrativo que gestiona trámites
- **Administrador del Sistema**: Configura y mantiene el sistema

### Actores Secundarios
- **Sistema de Validación**: Procesa automáticamente los archivos
- **Sistema de Notificaciones**: Envía alertas y actualizaciones
- **Sistema de Reportes**: Genera estadísticas y análisis

## Relaciones entre Casos de Uso

### Inclusión (Include)
- Todos los casos de uso incluyen "Iniciar Sesión"
- "Subir Documentos" incluye "Validar Archivos"
- "Revisar Documentos" incluye "Ver Historial de Revisiones"

### Extensión (Extend)
- "Notificar Resultado" extiende "Aprobar/Rechazar Documentos"
- "Solicitar Cambios" extiende "Rechazar Documento"
- "Generar Constancia" extiende "Completar Trámite"

### Generalización
- "Iniciar Trámite" es generalización de "Iniciar Trámite de Reinscripción", "Iniciar Trámite de Kárdex", etc.
- "Revisar Documentos" es generalización de "Aprobar Documento" y "Rechazar Documento"
