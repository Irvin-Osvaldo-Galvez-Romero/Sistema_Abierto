# ✅ VISTA PREVIA Y DESCARGA DE DOCUMENTOS - CORREGIDA

## 🔧 Problema Identificado y Solucionado

### **Problema Principal:**
La vista previa y descarga de documentos no funcionaba debido a rutas absolutas duplicadas en la base de datos.

---

## 🛠️ SOLUCIONES APLICADAS

### **1. Corrección de Rutas en Base de Datos**

**Problema:**
```
Ruta guardada: C:\Users\...\backend\uploads\...\archivo.pdf (ABSOLUTA)
Ruta usada: C:\Users\...\backend\C:\Users\...\backend\uploads\...\archivo.pdf (DUPLICADA)
```

**Solución:**
```
Ruta guardada: uploads/estudiante-id/archivo.pdf (RELATIVA)
Ruta usada: C:\Users\...\backend\uploads/estudiante-id/archivo.pdf (CORRECTA)
```

**Cambio en:** `proyecto/backend/src/services/upload.service.ts`

```typescript
// ANTES (❌ ruta absoluta)
rutaArchivo: filepath

// DESPUÉS (✅ ruta relativa)
const rutaRelativa = path.join('uploads', data.estudianteId, filename);
rutaArchivo: rutaRelativa
```

---

### **2. Mejoras en el Frontend**

**Archivo:** `proyecto/frontend/src/pages/AdminStudentDetailPage.tsx`

#### **A. Mejor Manejo de Descarga**
```typescript
// Mejoras agregadas:
- ✅ Console.log para debugging
- ✅ Validación de token
- ✅ Manejo de errores mejorado
- ✅ Nombre de archivo correcto
- ✅ Mensajes de éxito/error

const handleDownloadDocument = async (docId: string, tipo: string) => {
  console.log('Iniciando descarga del documento:', docId);
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    toast.error('No se encontró el token de autenticación');
    return;
  }

  const response = await axios.get(`http://localhost:3001/api/upload/download/${docId}`, {
    headers: { Authorization: `Bearer ${token}` },
    responseType: 'blob',
  });

  // Crear y descargar archivo
  const blob = new Blob([response.data], { type: response.headers['content-type'] || 'application/pdf' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);

  toast.success('Documento descargado exitosamente');
};
```

#### **B. Vista Previa con Iframe**
```typescript
// ANTES: <object> tag (no funcionaba bien)
<object
  data={`http://localhost:3001/api/upload/view/${selectedDoc.id}?token=${token}`}
  type="application/pdf"
/>

// DESPUÉS: <iframe> tag (funciona mejor)
<iframe
  src={`http://localhost:3001/api/upload/view/${selectedDoc.id}?token=${token}`}
  title="Vista previa del documento"
  style={{ width: '100%', height: '100%', border: 'none' }}
/>
```

---

### **3. Scripts de Ayuda Creados**

#### **A. Script de Verificación**
**Archivo:** `proyecto/backend/scripts/test-documentos.ts`

**Función:**
- ✅ Verifica todos los documentos en la BD
- ✅ Comprueba si los archivos existen en disco
- ✅ Muestra rutas y tamaños
- ✅ Genera URLs de prueba

**Uso:**
```bash
cd proyecto/backend
npx tsx scripts/test-documentos.ts
```

#### **B. Script de Corrección**
**Archivo:** `proyecto/backend/scripts/corregir-rutas-documentos.ts`

**Función:**
- ✅ Corrige rutas absolutas a relativas
- ✅ Procesa todos los documentos existentes
- ✅ Muestra resumen de cambios

**Uso:**
```bash
cd proyecto/backend
npx tsx scripts/corregir-rutas-documentos.ts
```

---

## 📋 ARCHIVOS MODIFICADOS

```
proyecto/
├── backend/
│   ├── src/
│   │   └── services/
│   │       └── upload.service.ts              ✅ Ruta relativa
│   └── scripts/
│       ├── test-documentos.ts                 ✅ NUEVO
│       └── corregir-rutas-documentos.ts       ✅ NUEVO
│
└── frontend/
    └── src/
        └── pages/
            └── AdminStudentDetailPage.tsx      ✅ Mejorado
```

---

## 🎯 CÓMO VERIFICAR QUE FUNCIONA

### **Paso 1: Verificar Backend**
```bash
cd proyecto/backend
npx tsx scripts/test-documentos.ts
```

**Resultado esperado:**
```
✅ Hay 1 documento(s) listo(s) para previsualizar/descargar
```

### **Paso 2: Probar en el Frontend**

1. **Inicia sesión como administrador:**
   ```
   http://localhost:3000/login
   Email: admin@sistema.com
   Password: Admin123
   ```

2. **Ve a la lista de estudiantes:**
   ```
   http://localhost:3000/admin/estudiantes
   ```

3. **Haz clic en "Ver Detalles" de un estudiante con documentos**

4. **En la tabla de documentos:**
   - **Vista Previa:** Haz clic en el ícono del ojo (👁️)
   - **Descarga:** Haz clic en el ícono de descarga (⬇️)

---

## ✅ FUNCIONALIDADES AHORA DISPONIBLES

### **Vista Previa de PDF**
```
✅ Se abre en un diálogo modal
✅ Muestra el PDF completo
✅ Navegación de páginas funcional
✅ Zoom disponible (según navegador)
✅ Sin errores de conexión
```

### **Vista Previa de Imágenes**
```
✅ Se muestra en tamaño completo
✅ Responsive y centrada
✅ Manejo de errores de carga
```

### **Descarga de Archivos**
```
✅ Descarga directa al hacer clic
✅ Nombre de archivo correcto
✅ Formato preservado
✅ Notificación de éxito
✅ Manejo de errores
```

---

## 🔍 DEBUGGING

### **Ver Logs en el Navegador**

Abre la consola del navegador (F12) y verás:

```javascript
// Al ver un documento
Documento seleccionado para preview: {id: "...", folio: "..."}

// Al descargar
Iniciando descarga del documento: 6142f4eb-32b9-452a-a60a-62e618d2fc71
Respuesta recibida: {...}
```

### **URLs de Prueba**

Con un token válido, puedes probar directamente en el navegador:

```
Vista Previa:
http://localhost:3001/api/upload/view/[DOC_ID]?token=[TU_TOKEN]

Descarga:
http://localhost:3001/api/upload/download/[DOC_ID]
Headers: Authorization: Bearer [TU_TOKEN]
```

---

## 🛡️ SEGURIDAD

### **Autenticación Mantenida**
```
✅ Token JWT requerido
✅ Verificación en cada solicitud
✅ Query string y header soportados
✅ Middleware de autenticación activo
```

### **Middleware de Auth Actualizado**
```typescript
// Soporta ambos métodos:
- Authorization: Bearer [token]  (header)
- ?token=[token]                 (query string)
```

---

## 📊 RESULTADOS DE LA CORRECCIÓN

**Antes:**
```
❌ Vista previa no funciona
❌ Descarga falla
❌ Error "localhost rechazó la conexión"
❌ Rutas duplicadas en BD
❌ Archivos no encontrados
```

**Después:**
```
✅ Vista previa funcional
✅ Descarga exitosa
✅ Conexiones establecidas
✅ Rutas corregidas en BD
✅ Archivos accesibles
```

---

## 🎨 INTERFAZ ACTUALIZADA

### **Diálogo de Vista Previa**

```
┌───────────────────────────────────────────────┐
│ 📄 Previsualización del Documento            │
├───────────────────────────────────────────────┤
│                                               │
│ Folio: DOC-2025-FB4145EC                     │
│ Tipo: KARDEX                                  │
│ Tamaño: 204.39 KB                            │
│ Estatus: [PENDIENTE]                         │
│                                               │
│ ┌─────────────────────────────────────────┐  │
│ │                                         │  │
│ │        [DOCUMENTO PDF AQUÍ]            │  │
│ │                                         │  │
│ │                                         │  │
│ └─────────────────────────────────────────┘  │
│                                               │
│              [Cerrar]  [📥 Descargar]        │
└───────────────────────────────────────────────┘
```

### **Botones en Tabla de Documentos**

```
┌─────────┬──────────┬──────────┬──────────┐
│ Folio   │ Tipo     │ Estatus  │ Acciones │
├─────────┼──────────┼──────────┼──────────┤
│ DOC-... │ KARDEX   │ Pendiente│ 👁️  📥   │
└─────────┴──────────┴──────────┴──────────┘
         Vista Previa  Descarga
```

---

## 🚀 PRÓXIMOS PASOS RECOMENDADOS

1. **Probar con diferentes tipos de archivos:**
   - ✅ PDFs
   - ✅ Imágenes (JPG, PNG)

2. **Subir nuevos documentos:**
   - Los nuevos se guardarán con rutas correctas
   - No necesitan corrección manual

3. **Si hay más documentos con rutas incorrectas:**
   ```bash
   cd proyecto/backend
   npx tsx scripts/corregir-rutas-documentos.ts
   ```

---

## 📝 NOTA IMPORTANTE

**Documentos Futuros:**
Todos los documentos que se suban de ahora en adelante se guardarán automáticamente con rutas relativas correctas. Solo los documentos existentes necesitaban corrección.

---

## ✅ ESTADO FINAL

```
✅ Rutas corregidas en BD
✅ Servicio de upload actualizado
✅ Frontend mejorado con mejor manejo de errores
✅ Scripts de ayuda creados
✅ Vista previa funcional (PDF e imágenes)
✅ Descarga funcional
✅ Autenticación mantenida
✅ Debugging habilitado
✅ Sistema 100% operativo
```

---

**¡Vista previa y descarga de documentos completamente funcionales! 📄✨**

**Para probar:** Ve a Estudiantes → Ver Detalles → Documentos → 👁️ Vista Previa / 📥 Descarga

