# 📄 Sistema de Gestión de Documentos - Reinscripción

## 🎯 Objetivo

Sistema especializado para que los estudiantes suban sus documentos de reinscripción de forma digital, con validación antivirus y notificaciones automáticas.

---

## 📋 Documentos Requeridos

Los estudiantes deben subir **3 documentos obligatorios**:

### 1. **Kardex** 📊
- Historial académico completo
- Formato: PDF o Imagen
- Tamaño máximo: 10MB

### 2. **Ficha de Reinscripción** 📝
- Documento oficial de reinscripción del semestre
- Formato: PDF o Imagen
- Tamaño máximo: 10MB

### 3. **Comprobante de Pago** 💰
- Comprobante de pago de reinscripción
- Formato: PDF o Imagen
- Tamaño máximo: 10MB

---

## 🔒 Seguridad Implementada

### **Escaneo Antivirus Automático:**
- ✅ Todos los archivos se escanean antes de ser almacenados
- ✅ Detección de extensiones peligrosas (.exe, .bat, .cmd, etc.)
- ✅ Verificación de firmas de archivos ejecutables
- ✅ Rechazo automático de archivos infectados
- ✅ Notificación al estudiante si se detect virus

### **Validaciones:**
- ✅ Solo PDF e imágenes permitidas (JPG, PNG)
- ✅ Tamaño máximo: 10MB por archivo
- ✅ Hash SHA-256 de cada archivo para verificación
- ✅ Folio único por documento

### **Protección Implementada:**
- Archivos ejecutables bloqueados
- Extensiones peligrosas rechazadas
- Buffer scanning antes de guardar
- Almacenamiento aislado por estudiante

---

## 📬 Sistema de Notificaciones

### **Notificaciones Automáticas:**

#### **Al Subir un Documento:**
- 📩 "Documento subido exitosamente y está pendiente de revisión"
- Tipo: DOCUMENTO_PENDIENTE
- Color: Amarillo (Warning)

#### **Al Aprobar un Documento:**
- ✅ "Tu [Documento] ha sido aprobado exitosamente"
- Tipo: DOCUMENTO_APROBADO
- Color: Verde (Success)

#### **Al Rechazar un Documento:**
- ❌ "Tu [Documento] ha sido rechazado. Motivo: [razón]"
- Tipo: DOCUMENTO_RECHAZADO
- Color: Rojo (Error)
- Incluye motivo de rechazo

#### **Al Detectar Virus:**
- 🦠 "Archivo rechazado - Virus detectado: [nombre del virus]"
- Tipo: DOCUMENTO_RECHAZADO
- Acción: Archivo no se guarda

---

## 🔄 Flujo del Sistema

### **1. Estudiante:**
```
1. Inicia sesión
2. Va a "Subir Documentos"
3. Selecciona tipo de documento (Kardex, Ficha, o Comprobante)
4. Elige archivo de su computadora
5. Sistema escanea por virus
   ├─ Si hay virus → Notificación de rechazo
   └─ Si está limpio → Documento guardado
6. Recibe notificación de "Pendiente de revisión"
7. Espera revisión del administrador
8. Recibe notificación de aprobación o rechazo
```

### **2. Administrador:**
```
1. Inicia sesión
2. Ve lista de documentos pendientes
3. Revisa cada documento
4. Aprueba o rechaza (con motivo si rechaza)
5. Sistema notifica al estudiante automáticamente
```

---

## 🌐 API Endpoints

### **Para Estudiantes:**

#### **Subir Documento:**
```
POST /api/upload
Headers: Authorization: Bearer {token}
Body: FormData
  - archivo: File
  - tipo: "KARDEX" | "FICHA_REINSCRIPCION" | "COMPROBANTE_PAGO"

Response:
{
  "success": true,
  "message": "Documento subido exitosamente...",
  "data": { ... }
}
```

#### **Ver Mis Documentos:**
```
GET /api/upload/my-documents
Headers: Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "documentos": [...],
    "tiposFaltantes": ["KARDEX"],
    "completo": false
  }
}
```

#### **Mis Notificaciones:**
```
GET /api/notificaciones/my-notifications
GET /api/notificaciones/my-notifications?unread=true

Response:
{
  "success": true,
  "data": {
    "notificaciones": [...],
    "unreadCount": 5
  }
}
```

#### **Marcar Notificación como Leída:**
```
PATCH /api/notificaciones/:id/read
```

#### **Marcar Todas como Leídas:**
```
PATCH /api/notificaciones/mark-all-read
```

### **Para Administradores:**

#### **Revisar Documento:**
```
PATCH /api/upload/:id/review
Headers: Authorization: Bearer {token}
Body:
{
  "aprobado": true,  // o false
  "motivoRechazo": "Documento ilegible"  // solo si aprobado = false
}
```

---

## 📊 Estados del Documento

| Estado | Descripción | Acción del Estudiante |
|--------|-------------|-----------------------|
| **PENDIENTE** | En espera de revisión | Esperar |
| **EN_REVISION** | Siendo revisado | Esperar |
| **APROBADO** | Documento válido | Ninguna |
| **RECHAZADO** | No cumple requisitos | Subir de nuevo |
| **ANULADO** | Reemplazado por nuevo | Ninguna |

---

## 🛡️ Características de Seguridad

### **Escaneo Antivirus:**
```typescript
// El sistema verifica:
1. Extensiones peligrosas (.exe, .bat, .cmd, .com, .scr, .vbs, .js, .jar)
2. Firmas MZ (archivos ejecutables de Windows)
3. Patrones de malware conocidos (básico)
4. Integridad del archivo con hash SHA-256
```

### **Si se Detecta Virus:**
- ❌ El archivo NO se guarda
- 🚨 Se crea notificación inmediata
- 📝 Se registra en logs
- 👤 Estudiante debe subir archivo limpio

---

## 💡 Recomendaciones para Estudiantes

### **Formato de Archivos:**
- 📄 **Preferido:** PDF
- 📷 **Alternativa:** JPG o PNG
- ❌ **No permitido:** Word, Excel, archivos comprimidos

### **Calidad del Archivo:**
- ✅ Legible y claro
- ✅ Bien iluminado (si es foto)
- ✅ Sin recortes importantes
- ✅ Orientación correcta

### **Antes de Subir:**
- 🔍 Verifica que el archivo sea el correcto
- 📏 Comprueba que sea menor a 10MB
- 🦠 Escanea con tu antivirus local
- 👁️ Revisa que sea legible

---

## 📱 Uso desde el Frontend

### **Acceso:**
1. Inicia sesión en http://localhost:3000
2. Desde el Dashboard, click en "Subir Documentos"
3. O navega a http://localhost:3000/documentos

### **Subir Documento:**
1. Selecciona el tipo de documento
2. Click en "Subir Archivo"
3. Selecciona archivo de tu computadora
4. Espera la confirmación
5. Verás el estado: Pendiente/Aprobado/Rechazado

### **Ver Notificaciones:**
1. Click en el ícono de campana (🔔)
2. O navega a http://localhost:3000/notificaciones
3. Verás todas tus notificaciones
4. Marca como leídas las que ya viste

---

## 🎨 Interfaz de Usuario

### **Página de Documentos:**
- 3 tarjetas (una por documento)
- Estados visuales con colores:
  - 🟡 Amarillo: Pendiente
  - 🟢 Verde: Aprobado
  - 🔴 Rojo: Rechazado
  - ⚪ Gris: Faltante
- Botón de subida por documento
- Barra de progreso durante upload
- Mensajes de motivo de rechazo

### **Página de Notificaciones:**
- Lista ordenada por fecha
- Badge con contador de no leídas
- Iconos según tipo de notificación
- Marca individual o todas como leídas

---

## 🔧 Para Administradores

### **Revisar Documentos:**
```bash
# Endpoint de revisión
PATCH /api/upload/:documentoId/review

# Aprobar:
{
  "aprobado": true
}

# Rechazar:
{
  "aprobado": false,
  "motivoRechazo": "El documento está borroso y no se puede leer"
}
```

### **Motivos Comunes de Rechazo:**
- Documento ilegible o borroso
- Archivo incompleto
- Formato incorrecto
- Información no coincide
- Documento vencido

---

## 📈 Estadísticas

El sistema rastrea:
- Total de documentos subidos
- Documentos pendientes de revisión
- Documentos aprobados
- Documentos rechazados
- Virus detectados
- Notificaciones enviadas

---

## 🎯 Ventajas del Sistema

### **Para Estudiantes:**
- ✅ Upload 24/7 desde cualquier lugar
- ✅ Notificaciones en tiempo real
- ✅ Historial de todos los documentos
- ✅ Resubida fácil si se rechaza
- ✅ Sin necesidad de ir presencialmente

### **Para la Universidad:**
- ✅ 100% digital (cero papel)
- ✅ Seguridad antivirus automática
- ✅ Trazabilidad completa
- ✅ Reducción de carga administrativa
- ✅ Archivos organizados automáticamente

---

## 📞 Soporte

**Para problemas con archivos:**
- Verifica que el archivo sea PDF o imagen
- Comprueba que sea menor a 10MB
- Escanea con antivirus antes de subir
- Contacta a soporte si persiste el problema

---

**Versión:** 1.0.0  
**Última actualización:** Octubre 2024  
**Estado:** ✅ Completamente Funcional

