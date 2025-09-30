# Dashboard de Alumno - Sistema Universitario

## Descripción

Dashboard completo para alumnos con funcionalidades de subida de documentos, notificaciones y seguimiento de trámites.

## Características

### 📊 Estadísticas en Tiempo Real
- **Documentos Subidos**: Total de documentos cargados al sistema
- **En Revisión**: Documentos pendientes de validación
- **Aprobados**: Documentos validados y aceptados

### 🔔 Sistema de Notificaciones
- Notificaciones en tiempo real sobre el estado de documentos
- Tipos de notificaciones:
  - ✅ **Éxito**: Documento aprobado
  - ⚠️ **Advertencia**: Recordatorios y fechas límite
  - ❌ **Error**: Documento rechazado
  - ℹ️ **Información**: Actualizaciones generales

### 📄 Gestión de Documentos

El sistema maneja 3 documentos obligatorios:

1. **Solicitud de Reinscripción/Inscripción**
   - Formato: PDF
   - Tamaño máximo: 5MB
   - Para alumnos de nuevo ingreso: solicitud de inscripción
   - Para alumnos regulares: solicitud de reinscripción

2. **Kárdex Académico**
   - Formato: PDF
   - Tamaño máximo: 5MB
   - Historial académico completo con calificaciones

3. **Comprobante de Pago**
   - Formatos: PDF, JPG, PNG
   - Tamaño máximo: 5MB
   - Voucher o comprobante bancario

### Estados de Documentos

- 🟡 **Pendiente**: Documento no subido
- 🔵 **En Revisión**: Documento subido, esperando validación
- 🟢 **Aprobado**: Documento validado y aceptado
- 🔴 **Rechazado**: Documento no cumple requisitos

## Flujo de Uso

### 1. Iniciar Sesión
```
1. Abre auth-test.html
2. Ingresa con credenciales de alumno
3. Serás redirigido automáticamente al dashboard
```

### 2. Subir Documento
```
1. Haz clic en la zona de carga del documento deseado
2. Selecciona el archivo desde tu computadora
3. Verifica que el archivo sea correcto
4. Haz clic en "📤 Subir Documento"
5. Espera la confirmación de carga
```

### 3. Ver Notificaciones
```
1. Revisa el panel izquierdo del dashboard
2. Las notificaciones más recientes aparecen arriba
3. Recibirás alertas cuando:
   - Un documento sea aprobado
   - Un documento sea rechazado
   - Haya recordatorios importantes
```

## API Backend

### Endpoints Disponibles

#### GET `/documentos/mis-documentos`
Obtiene los documentos del alumno autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "tramiteActual": {
    "id": 1,
    "tipo_tramite_id": 1,
    "estatus": "en_proceso"
  },
  "documentos": [
    {
      "id": 1,
      "tipo_documento": "Solicitud de Reinscripción",
      "tipo_clave": "SOLICITUD",
      "estatus": "en_revision",
      "nombre_archivo": "solicitud.pdf",
      "subido_en": "2025-09-30T10:00:00Z"
    }
  ]
}
```

#### POST `/documentos/subir`
Sube un nuevo documento.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Body:**
```json
{
  "tipoDocumento": "SOLICITUD",
  "nombreArchivo": "mi_solicitud.pdf",
  "tamanoBytes": 1024000
}
```

**Response:**
```json
{
  "mensaje": "Documento subido correctamente",
  "documentoId": 1,
  "version": 1,
  "estatus": "en_revision"
}
```

#### GET `/documentos/notificaciones`
Obtiene las notificaciones del alumno.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "id": 1,
    "titulo": "✅ Documento Aprobado",
    "mensaje": "Tu kárdex ha sido revisado y aprobado",
    "tipo": "exito",
    "leida": false,
    "creado_en": "2025-09-30T10:00:00Z"
  }
]
```

## Instalación y Configuración

### 1. Base de Datos

Ejecuta los scripts SQL en orden:

```sql
-- 1. Crear tipos de trámite y documentos
-- Ejecutar: SQL/seed_tipos_tramite_documentos.sql
```

Este script crea:
- Tipos de trámite (REINSCRIPCION, INSCRIPCION, KARDEX)
- Tipos de documento (SOLICITUD, KARDEX, PAGO)
- Requisitos asociados

### 2. Backend

El backend ya incluye las rutas necesarias en:
- `backend/src/tiers/documentos.routes.ts`
- Registradas en `backend/src/server.ts`

Endpoints disponibles en: `http://localhost:4000/documentos/`

### 3. Frontend

Archivo principal: `frontend/dashboard-alumno.html`

Características:
- Diseño responsive
- Validación de archivos en el cliente
- Barra de progreso de subida
- Notificaciones en tiempo real
- Actualización automática de estadísticas

## Validaciones

### Cliente (Frontend)
- Tamaño máximo de archivo: 5MB
- Tipos de archivo permitidos:
  - Solicitud: PDF
  - Kárdex: PDF
  - Pago: PDF, JPG, PNG

### Servidor (Backend)
- Autenticación JWT requerida
- Validación de tipos de documento
- Creación automática de trámites
- Versionado de documentos
- Registro de actividad

## Seguridad

- ✅ Autenticación JWT obligatoria
- ✅ Validación de sesión en cada petición
- ✅ Tokens expiran después de 1 hora
- ✅ Solo el alumno puede ver sus propios documentos
- ✅ Validación de tipos y tamaños de archivo
- ✅ SQL parametrizado para prevenir inyección

## Mejoras Futuras

1. **Almacenamiento Real de Archivos**
   - Integración con S3/MinIO
   - Almacenamiento local encriptado

2. **Validación Avanzada**
   - OCR automático en documentos
   - Verificación de firmas
   - Detección de duplicados

3. **Notificaciones Push**
   - Notificaciones en navegador
   - Emails automáticos
   - SMS para recordatorios

4. **Historial Completo**
   - Versiones anteriores de documentos
   - Log de cambios
   - Descargas de documentos aprobados

5. **Integración**
   - Chat en vivo con soporte
   - Calendario de vencimientos
   - Tutoriales interactivos

## Solución de Problemas

### Error: "Debes iniciar sesión primero"
**Solución:** Inicia sesión desde `auth-test.html` con credenciales de alumno.

### Error: "No hay tipos de trámite configurados"
**Solución:** Ejecuta el script `SQL/seed_tipos_tramite_documentos.sql`

### Error: "Archivo demasiado grande"
**Solución:** El archivo debe ser menor a 5MB. Comprime el PDF o reduce la calidad de la imagen.

### Error al subir documento
**Solución:** 
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador para más detalles
3. Comprueba que el token no haya expirado

### No se muestran notificaciones
**Solución:** Las notificaciones se crean cuando hay actividad en los documentos. Sube un documento para ver notificaciones.

## Usuarios de Prueba

Para probar el dashboard:

```
Email: alumno@uni.mx
Contraseña: Alumno123!
```

---

**Versión:** 1.0  
**Última actualización:** Septiembre 2025  
**Autor:** Sistema de Gestión Universitaria
