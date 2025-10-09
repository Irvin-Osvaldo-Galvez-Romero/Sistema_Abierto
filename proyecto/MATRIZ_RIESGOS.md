# 🛡️ MATRIZ DE RIESGOS - SISTEMA DE GESTIÓN DOCUMENTAL TESCHI

## 📋 Información General

**Sistema:** Sistema de Gestión Documental para Reinscripción
**Institución:** Tecnológico de Estudios Superiores de Chimalhuacán (TESCHI)
**Fecha de Análisis:** Enero 2025
**Versión:** 1.0

---

## 📊 ESCALA DE VALORACIÓN

### **Probabilidad de Ocurrencia**

| Nivel | Descripción | Probabilidad |
|-------|-------------|--------------|
| **5** | Muy Alta | > 80% - Casi seguro que ocurra |
| **4** | Alta | 60-80% - Probablemente ocurra |
| **3** | Media | 40-60% - Puede ocurrir |
| **2** | Baja | 20-40% - Poco probable |
| **1** | Muy Baja | < 20% - Muy improbable |

### **Impacto**

| Nivel | Descripción | Consecuencias |
|-------|-------------|---------------|
| **5** | Crítico | Sistema inoperante, pérdida de datos, impacto legal |
| **4** | Alto | Funcionalidad crítica afectada, pérdida parcial de datos |
| **3** | Medio | Funcionalidad importante afectada, molestias significativas |
| **2** | Bajo | Funcionalidad menor afectada, molestias menores |
| **1** | Muy Bajo | Impacto mínimo, casi imperceptible |

### **Nivel de Riesgo**

| Puntuación | Nivel | Color | Acción Requerida |
|------------|-------|-------|------------------|
| **20-25** | 🔴 Crítico | Rojo | Acción inmediata |
| **15-19** | 🟠 Alto | Naranja | Acción prioritaria |
| **10-14** | 🟡 Medio | Amarillo | Planificar mitigación |
| **5-9** | 🟢 Bajo | Verde | Monitorear |
| **1-4** | ⚪ Muy Bajo | Blanco | Aceptar |

**Cálculo:** Riesgo = Probabilidad × Impacto

---

## 🔴 RIESGOS CRÍTICOS Y ALTOS

### **R01 - Pérdida de Datos de Estudiantes**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Datos / Base de Datos |
| **Probabilidad** | 2 - Baja |
| **Impacto** | 5 - Crítico |
| **Riesgo Total** | **10 - 🟡 MEDIO** |

**Descripción:**
Pérdida o corrupción de la base de datos PostgreSQL que contiene información de estudiantes, documentos y reinscripciones.

**Causas Potenciales:**
- Falla del servidor de base de datos
- Corrupción de datos
- Error humano (eliminación accidental)
- Ataque malicioso
- Falla de hardware del servidor

**Consecuencias:**
- ❌ Pérdida de información de reinscripciones
- ❌ Pérdida de documentos subidos
- ❌ Imposibilidad de continuar el proceso de reinscripción
- ❌ Impacto legal y reputacional severo

**Mitigaciones Implementadas:**
- ✅ Base de datos PostgreSQL con ACID compliance
- ✅ Validaciones en backend (Prisma ORM)
- ✅ Logs de auditoría

**Mitigaciones Recomendadas:**
- 🔧 **URGENTE:** Implementar respaldos automáticos diarios
- 🔧 **URGENTE:** Configurar replicación de base de datos
- 🔧 Pruebas periódicas de restauración
- 🔧 Almacenamiento de backups en ubicación remota
- 🔧 Política de retención de backups (30 días mínimo)

**Plan de Acción:**
```
1. Configurar pg_dump automático (diario a las 2:00 AM)
2. Implementar backup incremental cada 4 horas
3. Almacenar backups en almacenamiento externo/nube
4. Documentar procedimiento de restauración
5. Realizar simulacro de recuperación mensual
```

---

### **R02 - Pérdida de Archivos Subidos por Estudiantes**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Almacenamiento / Archivos |
| **Probabilidad** | 3 - Media |
| **Impacto** | 5 - Crítico |
| **Riesgo Total** | **15 - 🟠 ALTO** |

**Descripción:**
Pérdida de documentos PDF/imágenes subidos por estudiantes almacenados en el directorio `uploads/`.

**Causas Potenciales:**
- Falla del disco duro del servidor
- Eliminación accidental del directorio uploads
- Corrupción del sistema de archivos
- Ransomware que cifre los archivos
- Falta de espacio en disco

**Consecuencias:**
- ❌ Estudiantes deben volver a subir documentos
- ❌ Retraso en proceso de reinscripción
- ❌ Desconfianza en el sistema
- ❌ Pérdida de evidencia para auditorías

**Mitigaciones Implementadas:**
- ✅ Almacenamiento organizado por estudiante
- ✅ Hash de archivos para verificar integridad
- ✅ Validación de virus antes de guardar

**Mitigaciones Recomendadas:**
- 🔧 **URGENTE:** Backup diario del directorio uploads/
- 🔧 **URGENTE:** Considerar almacenamiento en nube (AWS S3, Azure Blob)
- 🔧 RAID para redundancia de discos
- 🔧 Monitoreo de espacio en disco
- 🔧 Sistema de archivos con snapshots (ZFS, Btrfs)

**Plan de Acción:**
```
1. Configurar rsync para backup del directorio uploads/
2. Evaluar migración a AWS S3 o Azure Blob Storage
3. Implementar monitoreo de espacio en disco (alerta al 80%)
4. Configurar RAID 1 o RAID 10 en servidor
5. Política de limpieza de archivos antiguos (después de 2 años)
```

---

### **R03 - Acceso No Autorizado a Documentos Sensibles**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Seguridad / Acceso |
| **Probabilidad** | 3 - Media |
| **Impacto** | 5 - Crítico |
| **Riesgo Total** | **15 - 🟠 ALTO** |

**Descripción:**
Acceso no autorizado a documentos personales de estudiantes (Kardex, fichas, comprobantes).

**Causas Potenciales:**
- Vulnerabilidad en autenticación/autorización
- Credenciales comprometidas
- Inyección SQL
- Token JWT robado o comprometido
- Escalación de privilegios

**Consecuencias:**
- ❌ Violación de privacidad de estudiantes
- ❌ Incumplimiento de Ley de Protección de Datos
- ❌ Demandas legales
- ❌ Daño reputacional severo
- ❌ Sanciones del INAI

**Mitigaciones Implementadas:**
- ✅ Autenticación JWT con tokens de corta duración
- ✅ Middleware de autorización por roles
- ✅ Validación de entrada con Joi
- ✅ Helmet.js para headers de seguridad
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Prisma ORM (previene SQL injection)

**Mitigaciones Recomendadas:**
- 🔧 Implementar autenticación de dos factores (2FA)
- 🔧 Auditoría de acceso a documentos (logging)
- 🔧 Cifrado de documentos en reposo
- 🔧 Análisis de vulnerabilidades periódico
- 🔧 Rotación automática de secrets
- 🔧 Política de contraseñas más estricta

**Plan de Acción:**
```
1. Implementar 2FA para administradores
2. Agregar logging detallado de accesos a documentos
3. Cifrar archivos en disco con AES-256
4. Contratar auditoría de seguridad externa (anual)
5. Implementar WAF (Web Application Firewall)
```

---

### **R04 - Virus o Malware en Archivos Subidos**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Seguridad / Malware |
| **Probabilidad** | 2 - Baja |
| **Impacto** | 4 - Alto |
| **Riesgo Total** | **8 - 🟢 BAJO** |

**Descripción:**
Estudiante sube archivo infectado que compromete el servidor o afecta a otros usuarios.

**Causas Potenciales:**
- Archivo PDF con exploit
- Imagen con código malicioso embebido
- Archivo con extensión falsa
- Exploit 0-day

**Consecuencias:**
- ❌ Compromiso del servidor
- ❌ Infección de otros sistemas
- ❌ Robo de información
- ❌ Ransomware

**Mitigaciones Implementadas:**
- ✅ Escaneo básico de virus (firmas conocidas)
- ✅ Validación de tipos MIME
- ✅ Verificación de extensiones peligrosas
- ✅ Límite de tamaño de archivo (10MB)
- ✅ Solo PDF, JPG, PNG permitidos

**Mitigaciones Recomendadas:**
- 🔧 **PRIORITARIO:** Integrar ClamAV para escaneo real
- 🔧 Integrar VirusTotal API para análisis avanzado
- 🔧 Sandbox para ejecutar archivos sospechosos
- 🔧 Actualización automática de firmas de virus
- 🔧 Cuarentena de archivos sospechosos

**Plan de Acción:**
```
1. Instalar y configurar ClamAV en el servidor
2. Integrar ClamAV en el proceso de upload
3. Configurar actualización automática de firmas
4. Implementar cuarentena para archivos sospechosos
5. Notificar a administradores de detecciones
```

---

### **R05 - Falla del Servidor en Período de Reinscripción**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Disponibilidad / Infraestructura |
| **Probabilidad** | 3 - Media |
| **Impacto** | 5 - Crítico |
| **Riesgo Total** | **15 - 🟠 ALTO** |

**Descripción:**
El servidor se cae durante el período crítico de reinscripción dejando a estudiantes sin poder completar el proceso.

**Causas Potenciales:**
- Sobrecarga del servidor (muchos usuarios simultáneos)
- Falla de hardware
- Ataque DDoS
- Error en actualización de software
- Corte de energía eléctrica

**Consecuencias:**
- ❌ Estudiantes no pueden reinscribirse
- ❌ Pérdida de fechas límite
- ❌ Quejas masivas
- ❌ Impacto en inicio de semestre
- ❌ Daño reputacional

**Mitigaciones Implementadas:**
- ✅ Rate limiting
- ✅ Compresión de respuestas
- ✅ CORS configurado
- ✅ Logs para debugging

**Mitigaciones Recomendadas:**
- 🔧 **URGENTE:** Pruebas de carga antes de período de reinscripción
- 🔧 **URGENTE:** Plan de contingencia documentado
- 🔧 Servidor de respaldo (hot standby)
- 🔧 Load balancer para distribución de carga
- 🔧 Monitoreo 24/7 con alertas
- 🔧 UPS y generador eléctrico
- 🔧 CDN para archivos estáticos

**Plan de Acción:**
```
1. Realizar pruebas de carga (simular 500 usuarios concurrentes)
2. Configurar servidor de respaldo
3. Implementar Nginx como load balancer
4. Configurar monitoreo con Grafana/Prometheus
5. Documentar procedimiento de failover
6. Capacitar personal técnico en recuperación
```

---

## 🟡 RIESGOS MEDIOS

### **R06 - Expiración de Token Durante Operación**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Usabilidad / Autenticación |
| **Probabilidad** | 4 - Alta |
| **Impacto** | 2 - Bajo |
| **Riesgo Total** | **8 - 🟢 BAJO** |

**Descripción:**
Token JWT expira mientras estudiante está subiendo documentos, causando pérdida de progreso.

**Mitigaciones Implementadas:**
- ✅ Refresh token implementado
- ✅ Tokens de corta duración

**Mitigaciones Recomendadas:**
- 🔧 Renovación automática de token antes de expirar
- 🔧 Guardar formularios en localStorage
- 🔧 Advertencia visual cuando token está por expirar

---

### **R07 - Pérdida de Conectividad Durante Subida**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Red / Conectividad |
| **Probabilidad** | 3 - Media |
| **Impacto** | 3 - Medio |
| **Riesgo Total** | **9 - 🟢 BAJO** |

**Descripción:**
Estudiante pierde conexión a internet mientras sube documento de 10MB.

**Mitigaciones Implementadas:**
- ✅ Límite de 10MB por archivo
- ✅ Validación de tipo de archivo

**Mitigaciones Recomendadas:**
- 🔧 Implementar subida por chunks (resumable uploads)
- 🔧 Progreso de subida visible
- 🔧 Capacidad de reanudar subida interrumpida
- 🔧 Comprimir imágenes automáticamente

---

### **R08 - Errores en Validación de Documentos**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Proceso / Validación |
| **Probabilidad** | 3 - Media |
| **Impacto** | 3 - Medio |
| **Riesgo Total** | **9 - 🟢 BAJO** |

**Descripción:**
Administrador aprueba/rechaza documentos incorrectamente por error humano.

**Mitigaciones Implementadas:**
- ✅ Sistema de notificaciones
- ✅ Vista previa de documentos
- ✅ Estado de revisión

**Mitigaciones Recomendadas:**
- 🔧 Diálogo de confirmación en aprobación/rechazo
- 🔧 Historial de cambios de estatus
- 🔧 Posibilidad de revertir decisión
- 🔧 Segundo revisor para casos críticos
- 🔧 Checklist de validación visible

---

### **R09 - Incumplimiento de LGPD (Ley de Protección de Datos)**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Legal / Cumplimiento |
| **Probabilidad** | 2 - Baja |
| **Impacto** | 5 - Crítico |
| **Riesgo Total** | **10 - 🟡 MEDIO** |

**Descripción:**
Sistema no cumple con requisitos de la Ley General de Protección de Datos Personales.

**Mitigaciones Implementadas:**
- ✅ Autenticación y autorización
- ✅ Cifrado en tránsito (HTTPS)

**Mitigaciones Recomendadas:**
- 🔧 **PRIORITARIO:** Aviso de privacidad visible
- 🔧 Consentimiento explícito del estudiante
- 🔧 Derecho de acceso (ver sus datos)
- 🔧 Derecho de rectificación (corregir datos)
- 🔧 Derecho de cancelación (eliminar datos)
- 🔧 Derecho de oposición
- 🔧 Registro ante INAI si es necesario
- 🔧 Cifrado de datos en reposo
- 🔧 Política de retención de datos

---

### **R10 - Falta de Documentación Técnica**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Mantenimiento / Documentación |
| **Probabilidad** | 4 - Alta |
| **Impacto** | 3 - Medio |
| **Riesgo Total** | **12 - 🟡 MEDIO** |

**Descripción:**
Falta de documentación dificulta mantenimiento y recuperación ante desastres.

**Mitigaciones Implementadas:**
- ✅ README básico
- ✅ Comentarios en código
- ✅ Documentación de API

**Mitigaciones Recomendadas:**
- 🔧 Manual de instalación detallado
- 🔧 Manual de operación
- 🔧 Procedimientos de backup y restauración
- 🔧 Diagramas de arquitectura
- 🔧 Runbook para incidentes comunes
- 🔧 Documentación de decisiones técnicas

---

## 🟢 RIESGOS BAJOS

### **R11 - Problemas de Compatibilidad de Navegadores**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Compatibilidad / Frontend |
| **Probabilidad** | 2 - Baja |
| **Impacto** | 2 - Bajo |
| **Riesgo Total** | **4 - ⚪ MUY BAJO** |

**Descripción:**
Sistema no funciona correctamente en navegadores antiguos.

**Mitigaciones:** Usar navegadores modernos (Chrome, Firefox, Edge actualizados)

---

### **R12 - Errores de Usuario (Subir Archivo Incorrecto)**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Usabilidad / Error Humano |
| **Probabilidad** | 4 - Alta |
| **Impacto** | 2 - Bajo |
| **Riesgo Total** | **8 - 🟢 BAJO** |

**Descripción:**
Estudiante sube documento equivocado (ej: Kardex en lugar de Ficha).

**Mitigaciones Implementadas:**
- ✅ Etiquetas claras de cada tipo de documento
- ✅ Posibilidad de resubir

**Mitigaciones Recomendadas:**
- 🔧 Vista previa antes de subir
- 🔧 Confirmación de documento correcto

---

### **R13 - Rendimiento Lento en Hora Pico**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Rendimiento / Escalabilidad |
| **Probabilidad** | 3 - Media |
| **Impacto** | 2 - Bajo |
| **Riesgo Total** | **6 - 🟢 BAJO** |

**Descripción:**
Sistema se vuelve lento cuando muchos usuarios lo usan simultáneamente.

**Mitigaciones Implementadas:**
- ✅ Compresión de respuestas
- ✅ Rate limiting
- ✅ Lazy loading en frontend

**Mitigaciones Recomendadas:**
- 🔧 Cacheo de consultas frecuentes (Redis)
- 🔧 Optimización de queries de BD
- 🔧 CDN para archivos estáticos
- 🔧 Horizontal scaling (más servidores)

---

### **R14 - Falta de Capacitación del Personal**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Recursos Humanos / Capacitación |
| **Probabilidad** | 3 - Media |
| **Impacto** | 3 - Medio |
| **Riesgo Total** | **9 - 🟢 BAJO** |

**Descripción:**
Personal administrativo no sabe usar el sistema correctamente.

**Mitigaciones Recomendadas:**
- 🔧 Manual de usuario para administradores
- 🔧 Capacitación presencial
- 🔧 Videos tutoriales
- 🔧 Soporte técnico disponible

---

### **R15 - Dependencia de Desarrollador Único**

| Atributo | Valor |
|----------|-------|
| **Categoría** | Recursos / Continuidad |
| **Probabilidad** | 3 - Media |
| **Impacto** | 4 - Alto |
| **Riesgo Total** | **12 - 🟡 MEDIO** |

**Descripción:**
Solo una persona conoce el sistema a fondo, si no está disponible hay riesgo.

**Mitigaciones Recomendadas:**
- 🔧 Documentación técnica completa
- 🔧 Transferencia de conocimiento a equipo
- 🔧 Código bien comentado
- 🔧 Repositorio con acceso compartido
- 🔧 Contrato de soporte externo

---

## 📈 RESUMEN EJECUTIVO

### **Distribución de Riesgos**

```
🔴 Críticos (20-25):  0 riesgos
🟠 Altos (15-19):     3 riesgos  ⚠️ ATENCIÓN REQUERIDA
🟡 Medios (10-14):    4 riesgos  📋 PLANIFICAR
🟢 Bajos (5-9):       7 riesgos  👁️ MONITOREAR
⚪ Muy Bajos (1-4):   1 riesgo   ✅ ACEPTAR
─────────────────────────────────
   TOTAL:           15 riesgos identificados
```

### **Top 5 Riesgos Prioritarios**

| # | Riesgo | Nivel | Acción Inmediata |
|---|--------|-------|------------------|
| 1 | R02 - Pérdida de archivos | 🟠 15 | Implementar backup de uploads/ |
| 2 | R03 - Acceso no autorizado | 🟠 15 | Implementar 2FA y cifrado |
| 3 | R05 - Falla en período crítico | 🟠 15 | Pruebas de carga + servidor backup |
| 4 | R15 - Dependencia de desarrollador | 🟡 12 | Documentar y transferir conocimiento |
| 5 | R10 - Falta de documentación | 🟡 12 | Crear manuales técnicos |

---

## 🎯 PLAN DE ACCIÓN PRIORITARIO (30 DÍAS)

### **Semana 1: Seguridad de Datos**
```
□ Implementar backup automático de PostgreSQL
□ Implementar backup de directorio uploads/
□ Probar restauración de backups
□ Documentar procedimientos de backup/restauración
```

### **Semana 2: Seguridad de Acceso**
```
□ Implementar logging de acceso a documentos
□ Evaluar herramientas de 2FA
□ Análisis de vulnerabilidades con OWASP ZAP
□ Actualizar todas las dependencias npm
```

### **Semana 3: Disponibilidad**
```
□ Pruebas de carga con Apache JMeter
□ Documentar plan de contingencia
□ Evaluar servidor de respaldo
□ Configurar monitoreo básico (Uptime Robot)
```

### **Semana 4: Documentación y Cumplimiento**
```
□ Crear manual técnico completo
□ Elaborar aviso de privacidad
□ Documentar arquitectura del sistema
□ Capacitar a equipo de soporte
```

---

## 📅 REVISIÓN Y ACTUALIZACIÓN

**Frecuencia de Revisión:** Trimestral

**Próxima Revisión:** Abril 2025

**Responsable:** Coordinación de TI del TESCHI

**Triggers para Revisión Extraordinaria:**
- Incidente de seguridad
- Cambio significativo en el sistema
- Nueva legislación aplicable
- Incidente que materialize un riesgo

---

## 📞 CONTACTOS DE EMERGENCIA

| Rol | Responsabilidad | Contacto |
|-----|----------------|----------|
| **Administrador del Sistema** | Operación diaria | [Por definir] |
| **Desarrollador** | Soporte técnico | [Por definir] |
| **Coordinador de TI** | Decisiones técnicas | [Por definir] |
| **DPO (Data Protection Officer)** | Protección de datos | [Por definir] |
| **Proveedor de Hosting** | Infraestructura | [Por definir] |

---

## 📚 REFERENCIAS

- NIST Cybersecurity Framework
- ISO 27001:2013 (Seguridad de la Información)
- Ley General de Protección de Datos Personales (LGPD)
- OWASP Top 10 (2021)
- Lineamientos del INAI

---

**Documento elaborado:** Enero 2025
**Versión:** 1.0
**Estado:** Activo

**Firmas de Aprobación:**
- [ ] Coordinador de TI
- [ ] Dirección Académica
- [ ] Coordinador de Protección de Datos

---

**Este documento es confidencial y de uso exclusivo del TESCHI**

