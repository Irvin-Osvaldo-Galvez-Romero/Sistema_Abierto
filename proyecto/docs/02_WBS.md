# WBS (WORK BREAKDOWN STRUCTURE)
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

## 1. ESTRUCTURA JERÁRQUICA DEL PROYECTO

### 1.0 SISTEMA DE GESTIÓN DOCUMENTAL UNIVERSITARIA TESCHI

#### 1.1 PLANIFICACIÓN DEL PROYECTO
- 1.1.1 Análisis de Requerimientos
  - 1.1.1.1 Entrevistas con stakeholders
  - 1.1.1.2 Definición de casos de uso
  - 1.1.1.3 Especificación de funcionalidades
  - 1.1.1.4 Análisis de restricciones técnicas
- 1.1.2 Diseño de Arquitectura
  - 1.1.2.1 Arquitectura del sistema
  - 1.1.2.2 Diseño de base de datos
  - 1.1.2.3 Diseño de API REST
  - 1.1.2.4 Diseño de interfaz de usuario
- 1.1.3 Planificación de Recursos
  - 1.1.3.1 Asignación de roles y responsabilidades
  - 1.1.3.2 Estimación de tiempo y costos
  - 1.1.3.3 Definición de hitos y entregables
  - 1.1.3.4 Gestión de riesgos

#### 1.2 DESARROLLO DEL SISTEMA
- 1.2.1 Configuración del Entorno
  - 1.2.1.1 Instalación de herramientas de desarrollo
  - 1.2.1.2 Configuración de repositorio Git
  - 1.2.1.3 Configuración de base de datos
  - 1.2.1.4 Configuración de servidor de desarrollo
- 1.2.2 Desarrollo del Backend
  - 1.2.2.1 Configuración del servidor Node.js
  - 1.2.2.2 Implementación de modelos de datos (Prisma)
  - 1.2.2.3 Desarrollo de API REST
    - 1.2.2.3.1 Módulo de autenticación
    - 1.2.2.3.2 Módulo de gestión de usuarios
    - 1.2.2.3.3 Módulo de gestión de documentos
    - 1.2.2.3.4 Módulo de gestión de carreras
  - 1.2.2.4 Implementación de middleware
  - 1.2.2.5 Configuración de seguridad
- 1.2.3 Desarrollo del Frontend
  - 1.2.3.1 Configuración de React con TypeScript
  - 1.2.3.2 Implementación de componentes base
  - 1.2.3.3 Desarrollo de páginas principales
    - 1.2.3.3.1 Página de login
    - 1.2.3.3.2 Dashboard de administrador
    - 1.2.3.3.3 Dashboard de estudiante
    - 1.2.3.3.4 Gestión de estudiantes
    - 1.2.3.3.5 Gestión de documentos
  - 1.2.3.4 Implementación de autenticación
  - 1.2.3.5 Integración con API REST
- 1.2.4 Integración de Componentes
  - 1.2.4.1 Integración frontend-backend
  - 1.2.4.2 Pruebas de integración
  - 1.2.4.3 Optimización de rendimiento
  - 1.2.4.4 Configuración de despliegue

#### 1.3 PRUEBAS DEL SISTEMA
- 1.3.1 Pruebas Unitarias
  - 1.3.1.1 Pruebas de componentes React
  - 1.3.1.2 Pruebas de servicios backend
  - 1.3.1.3 Pruebas de modelos de datos
  - 1.3.1.4 Pruebas de utilidades
- 1.3.2 Pruebas de Integración
  - 1.3.2.1 Pruebas de API endpoints
  - 1.3.2.2 Pruebas de flujos completos
  - 1.3.2.3 Pruebas de base de datos
  - 1.3.2.4 Pruebas de autenticación
- 1.3.3 Pruebas de Sistema
  - 1.3.3.1 Pruebas de funcionalidad
  - 1.3.3.2 Pruebas de rendimiento
  - 1.3.3.3 Pruebas de seguridad
  - 1.3.3.4 Pruebas de usabilidad
- 1.3.4 Pruebas de Aceptación
  - 1.3.4.1 Pruebas con usuarios finales
  - 1.3.4.2 Validación de requerimientos
  - 1.3.4.3 Pruebas de casos de uso
  - 1.3.4.4 Documentación de bugs

#### 1.4 DESPLIEGUE Y CONFIGURACIÓN
- 1.4.1 Preparación del Entorno de Producción
  - 1.4.1.1 Configuración del servidor de producción
  - 1.4.1.2 Configuración de base de datos de producción
  - 1.4.1.3 Configuración de seguridad
  - 1.4.1.4 Configuración de backup
- 1.4.2 Despliegue del Sistema
  - 1.4.2.1 Despliegue del backend
  - 1.4.2.2 Despliegue del frontend
  - 1.4.2.3 Configuración de dominio y SSL
  - 1.4.2.4 Configuración de monitoreo
- 1.4.3 Migración de Datos
  - 1.4.3.1 Creación de datos iniciales
  - 1.4.3.2 Migración de usuarios existentes
  - 1.4.3.3 Configuración de carreras
  - 1.4.3.4 Validación de datos migrados

#### 1.5 DOCUMENTACIÓN
- 1.5.1 Documentación Técnica
  - 1.5.1.1 Documentación de API
  - 1.5.1.2 Documentación de base de datos
  - 1.5.1.3 Documentación de código
  - 1.5.1.4 Guías de instalación
- 1.5.2 Documentación de Usuario
  - 1.5.2.1 Manual de usuario administrador
  - 1.5.2.2 Manual de usuario estudiante
  - 1.5.2.3 Guías de procedimientos
  - 1.5.2.4 FAQ (Preguntas frecuentes)
- 1.5.3 Documentación del Proyecto
  - 1.5.3.1 Especificación de requerimientos
  - 1.5.3.2 Diseño de arquitectura
  - 1.5.3.3 Plan de pruebas
  - 1.5.3.4 Informe final del proyecto

#### 1.6 MANTENIMIENTO Y SOPORTE
- 1.6.1 Mantenimiento Preventivo
  - 1.6.1.1 Monitoreo del sistema
  - 1.6.1.2 Actualizaciones de seguridad
  - 1.6.1.3 Optimización de rendimiento
  - 1.6.1.4 Backup regular
- 1.6.2 Mantenimiento Correctivo
  - 1.6.2.1 Resolución de bugs
  - 1.6.2.2 Corrección de errores
  - 1.6.2.3 Recuperación de datos
  - 1.6.2.4 Soporte técnico
- 1.6.3 Mejoras y Actualizaciones
  - 1.6.3.1 Implementación de nuevas funcionalidades
  - 1.6.3.2 Mejoras de usabilidad
  - 1.6.3.3 Optimizaciones de rendimiento
  - 1.6.3.4 Actualizaciones de tecnología

---

## 2. MATRIZ DE RESPONSABILIDADES

| WBS | Irvin | Ángel | Kevin | Alberto |
|-----|-------|-------|-------|---------|
| 1.1.1 Análisis de Requerimientos | L | A | A | A |
| 1.1.2 Diseño de Arquitectura | L | L | A | A |
| 1.1.3 Planificación de Recursos | L | A | A | A |
| 1.2.1 Configuración del Entorno | A | L | A | L |
| 1.2.2 Desarrollo del Backend | A | L | A | A |
| 1.2.3 Desarrollo del Frontend | A | A | L | A |
| 1.2.4 Integración de Componentes | L | A | A | A |
| 1.3.1 Pruebas Unitarias | A | L | L | A |
| 1.3.2 Pruebas de Integración | L | A | A | A |
| 1.3.3 Pruebas de Sistema | A | A | A | L |
| 1.3.4 Pruebas de Aceptación | L | A | A | A |
| 1.4.1 Preparación del Entorno | A | A | A | L |
| 1.4.2 Despliegue del Sistema | L | A | A | L |
| 1.4.3 Migración de Datos | A | A | A | L |
| 1.5.1 Documentación Técnica | A | L | A | A |
| 1.5.2 Documentación de Usuario | A | A | L | A |
| 1.5.3 Documentación del Proyecto | L | A | A | A |
| 1.6.1 Mantenimiento Preventivo | A | A | A | L |
| 1.6.2 Mantenimiento Correctivo | L | A | A | A |
| 1.6.3 Mejoras y Actualizaciones | L | A | A | A |

**Leyenda:** L = Líder, A = Asistente

---

## 3. CRONOGRAMA DE ACTIVIDADES

### Fase 1: Planificación (Semanas 1-2)
- 1.1.1 Análisis de Requerimientos
- 1.1.2 Diseño de Arquitectura
- 1.1.3 Planificación de Recursos

### Fase 2: Desarrollo (Semanas 3-8)
- 1.2.1 Configuración del Entorno
- 1.2.2 Desarrollo del Backend
- 1.2.3 Desarrollo del Frontend
- 1.2.4 Integración de Componentes

### Fase 3: Pruebas (Semanas 9-10)
- 1.3.1 Pruebas Unitarias
- 1.3.2 Pruebas de Integración
- 1.3.3 Pruebas de Sistema
- 1.3.4 Pruebas de Aceptación

### Fase 4: Despliegue (Semanas 11-12)
- 1.4.1 Preparación del Entorno
- 1.4.2 Despliegue del Sistema
- 1.4.3 Migración de Datos

### Fase 5: Documentación (Semanas 13-14)
- 1.5.1 Documentación Técnica
- 1.5.2 Documentación de Usuario
- 1.5.3 Documentación del Proyecto

### Fase 6: Mantenimiento (Semanas 15-16)
- 1.6.1 Mantenimiento Preventivo
- 1.6.2 Mantenimiento Correctivo
- 1.6.3 Mejoras y Actualizaciones

---

## 4. ENTREGABLES PRINCIPALES

### 4.1 Entregables de Planificación
- Especificación de Requerimientos
- Diseño de Arquitectura del Sistema
- Plan de Proyecto
- Matriz de Riesgos

### 4.2 Entregables de Desarrollo
- Código fuente del backend
- Código fuente del frontend
- Base de datos implementada
- API REST funcional

### 4.3 Entregables de Pruebas
- Plan de Pruebas
- Reportes de Pruebas Unitarias
- Reportes de Pruebas de Integración
- Reportes de Pruebas de Sistema

### 4.4 Entregables de Despliegue
- Sistema desplegado en producción
- Documentación de instalación
- Guías de configuración
- Procedimientos de backup

### 4.5 Entregables de Documentación
- Manual de Usuario
- Documentación Técnica
- Guías de Mantenimiento
- Informe Final del Proyecto

---

## 5. CRITERIOS DE ACEPTACIÓN

### 5.1 Funcionalidad
- Todos los casos de uso implementados
- Sistema funcional al 100%
- Interfaz de usuario intuitiva
- Rendimiento óptimo

### 5.2 Calidad
- Código bien documentado
- Pruebas completas ejecutadas
- Sin bugs críticos
- Cumplimiento de estándares

### 5.3 Entrega
- Documentación completa
- Sistema desplegado
- Capacitación realizada
- Soporte inicial proporcionado

---

**Documento elaborado por:** Equipo de Desarrollo TESCHI  
**Fecha de creación:** [Fecha actual]  
**Última actualización:** [Fecha actual]  
**Próxima revisión:** [Fecha + 1 mes]
