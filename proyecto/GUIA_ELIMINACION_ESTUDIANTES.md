# 🗑️ GUÍA DE ELIMINACIÓN DE ESTUDIANTES

## 📋 Dos Opciones Disponibles

El sistema ahora ofrece **dos formas** de eliminar estudiantes, según tus necesidades:

---

## 🚫 **OPCIÓN 1: Dar de Baja Definitiva** (Soft Delete)

### **Botón:** 🚫 Naranja (PersonOff)

### **¿Qué hace?**

- ✅ Marca al estudiante con estatus: `BAJA_DEFINITIVA`
- ✅ **Conserva todos los datos** en la base de datos
- ✅ Conserva documentos subidos
- ✅ Conserva historial de actividad
- ✅ Conserva usuario y credenciales
- ✅ El estudiante ya no aparece en listas activas
- ✅ **Puede reactivarse** si es necesario (en el futuro)

### **¿Cuándo usar?**

✓ El estudiante se dio de baja temporal
✓ Quieres mantener el historial para auditorías
✓ El estudiante podría regresar
✓ Necesitas conservar documentos oficiales
✓ Cumplimiento de regulaciones (LGPD)

### **Endpoint:**
```
PATCH /api/students/:id/baja
```

### **Mensaje de Confirmación:**

```
┌────────────────────────────────────────────┐
│  ⚠️ Dar de Baja Estudiante                │
├────────────────────────────────────────────┤
│  ¿Estás seguro de que deseas dar de baja  │
│  al estudiante Juan Pérez López (2024001)?│
│                                            │
│  Esta acción marcará al estudiante como    │
│  INACTIVO pero conservará sus datos en el  │
│  sistema.                                  │
│                                            │
│      [Cancelar]    [Dar de Baja]           │
└────────────────────────────────────────────┘
```

---

## 🗑️ **OPCIÓN 2: Eliminar Permanentemente** (Hard Delete)

### **Botón:** 🗑️ Rojo (DeleteForever)

### **¿Qué hace?**

- ❌ **Elimina COMPLETAMENTE** al estudiante de la base de datos
- ❌ Elimina todos los documentos subidos
- ❌ Elimina todas las relaciones
- ❌ Elimina el perfil del estudiante
- ❌ Elimina el usuario y credenciales
- ❌ Elimina tokens de sesión
- ❌ Elimina historial de actividad
- ⚠️ **NO SE PUEDE RECUPERAR** - Eliminación permanente

### **¿Cuándo usar?**

✓ Estudiante creado por error
✓ Datos duplicados que deben eliminarse
✓ Pruebas que necesitas limpiar
✓ No necesitas conservar ningún dato
✓ Limpieza completa de la base de datos

### **Endpoint:**
```
DELETE /api/students/:id/permanent
```

### **Mensaje de Confirmación:**

```
┌────────────────────────────────────────────┐
│  🚨 ⚠️ Eliminar Permanentemente            │
├────────────────────────────────────────────┤
│  ¿Estás ABSOLUTAMENTE SEGURO de que       │
│  deseas ELIMINAR PERMANENTEMENTE al        │
│  estudiante Juan Pérez López (2024001)?    │
│                                            │
│  🚨 ADVERTENCIA: Esta acción eliminará     │
│  COMPLETAMENTE:                            │
│  • El estudiante de la base de datos       │
│  • Su usuario y credenciales               │
│  • Todos sus documentos subidos            │
│  • Todo su historial                       │
│                                            │
│  ⚠️ ESTA ACCIÓN NO SE PUEDE DESHACER       │
│                                            │
│  [Cancelar]  [Eliminar Permanentemente]    │
└────────────────────────────────────────────┘
```

---

## 📊 **TABLA COMPARATIVA DETALLADA**

| Aspecto | Dar de Baja (🚫) | Eliminar (🗑️) |
|---------|------------------|----------------|
| **Color del botón** | 🟠 Naranja | 🔴 Rojo |
| **Icono** | PersonOff | DeleteForever |
| **Tipo de eliminación** | Soft Delete | Hard Delete |
| **Perfil de estudiante** | ✅ Se conserva | ❌ Se borra |
| **Usuario y credenciales** | ✅ Se conservan | ❌ Se borran |
| **Documentos subidos** | ✅ Se conservan | ❌ Se borran |
| **Relaciones** | ✅ Se conservan | ❌ Se borran |
| **Historial de actividad** | ✅ Se conserva | ❌ Se borra |
| **Tokens de sesión** | ✅ Se conservan | ❌ Se borran |
| **Matrícula** | ✅ Sigue ocupada | ✅ Se libera |
| **Reversible** | ✅ Sí (puede reactivarse) | ❌ NO |
| **Recomendado para** | Bajas reales | Datos de prueba/errores |
| **Impacto** | Bajo (solo cambia estatus) | Alto (elimina todo) |
| **Advertencia** | Normal | Fuerte (múltiples avisos) |

---

## 🎯 **CASOS DE USO**

### **Caso 1: Estudiante se Retira Temporalmente**

**Situación:**
Un estudiante decide tomarse un semestre sabático.

**Acción recomendada:** 🚫 **Dar de Baja**
- Marca como BAJA_DEFINITIVA
- Conserva todos sus datos
- Si regresa, puede reactivarse
- Historial completo conservado

---

### **Caso 2: Estudiante se Gradúa**

**Situación:**
Un estudiante termina sus estudios.

**Acción recomendada:** 🚫 **Dar de Baja** (cambiar a EGRESADO)
- Conserva documentos para certificados
- Conserva historial académico
- Puede consultarse en el futuro

---

### **Caso 3: Estudiante Creado por Error**

**Situación:**
El admin creó un estudiante por error (datos incorrectos, duplicado).

**Acción recomendada:** 🗑️ **Eliminar Permanentemente**
- Borra completamente de la BD
- Libera la matrícula
- No deja rastro en el sistema
- Base de datos limpia

---

### **Caso 4: Datos de Prueba**

**Situación:**
Tienes estudiantes de prueba que ya no necesitas.

**Acción recomendada:** 🗑️ **Eliminar Permanentemente**
- Limpia completamente la BD
- Deja el sistema listo para producción
- No contamina estadísticas

---

## 🔍 **INTERFAZ DE USUARIO**

### **Gestión de Estudiantes - Vista de Tabla:**

```
┌──────┬──────────────┬────────────────┬─────────┬────────┬─────────────┐
│ Mat. │ Nombre       │ Email          │ Carrera │ Status │ Acciones    │
├──────┼──────────────┼────────────────┼─────────┼────────┼─────────────┤
│ 2001 │ Juan Pérez   │ juan@teschi... │ ISC     │ ACTIVO │ 👁️ 🚫 🗑️  │
│ 2002 │ María García │ maria@...      │ LA      │ ACTIVO │ 👁️ 🚫 🗑️  │
│ 2003 │ Pedro López  │ pedro@...      │ II      │ BAJA   │ 👁️ 🚫 🗑️  │
└──────┴──────────────┴────────────────┴─────────┴────────┴─────────────┘

Iconos:
  👁️ = Ver Detalles (verde)
  🚫 = Dar de Baja (naranja) - Soft delete
  🗑️ = Eliminar Permanente (rojo) - Hard delete
```

### **Al hacer hover sobre los botones:**

- **👁️ Verde:** "Ver Detalles"
- **🚫 Naranja:** "Dar de Baja (Marca como inactivo)"
- **🗑️ Rojo:** "Eliminar Permanentemente (Borra de BD)"

---

## ⚠️ **ADVERTENCIAS DE SEGURIDAD**

### **Baja Definitiva:**

```
Nivel de riesgo: 🟡 BAJO
Reversible: ✅ SÍ
Confirmación: Simple
```

### **Eliminación Permanente:**

```
Nivel de riesgo: 🔴 ALTO
Reversible: ❌ NO
Confirmación: Detallada con advertencia fuerte
```

---

## 🔄 **FLUJOS DE TRABAJO**

### **Flujo de Baja:**

```
1. Admin click en 🚫 (naranja)
        ↓
2. Diálogo de confirmación simple
        ↓
3. Admin confirma "Dar de Baja"
        ↓
4. Sistema marca estatus = BAJA_DEFINITIVA
        ↓
5. Toast: "Estudiante dado de baja exitosamente"
        ↓
6. Lista se recarga
        ↓
7. Estudiante aparece con chip naranja "BAJA_DEFINITIVA"
```

### **Flujo de Eliminación Permanente:**

```
1. Admin click en 🗑️ (rojo)
        ↓
2. Diálogo de advertencia fuerte:
   "⚠️ ELIMINAR PERMANENTEMENTE"
   Lista todo lo que se eliminará
   "NO SE PUEDE DESHACER"
        ↓
3. Admin lee advertencia cuidadosamente
        ↓
4. Admin confirma "Eliminar Permanentemente"
        ↓
5. Sistema elimina:
   - Relaciones estudiante-documento
   - Documentos subidos
   - Perfil de estudiante
   - Tokens de sesión
   - Historial de actividad
   - Usuario
        ↓
6. Toast: "Estudiante eliminado permanentemente de la BD"
        ↓
7. Lista se recarga
        ↓
8. Estudiante YA NO existe en la BD
```

---

## 🛡️ **MEJORES PRÁCTICAS**

### **Recomendaciones:**

1. **Usa "Dar de Baja"** para estudiantes reales que se retiran
2. **Usa "Eliminar Permanentemente"** solo para:
   - Datos de prueba
   - Registros duplicados
   - Errores de captura
3. **Piensa dos veces** antes de eliminar permanentemente
4. **Revisa la advertencia** completa antes de confirmar
5. **Considera hacer backup** antes de eliminar datos importantes

### **Para Producción:**

```
✅ Siempre usa "Dar de Baja" para estudiantes reales
❌ Nunca uses "Eliminar Permanentemente" sin estar seguro
⚠️ Considera implementar un registro de auditoría
📋 Mantén logs de quién elimina qué
```

---

## 📝 **ENDPOINTS DISPONIBLES**

### **Backend - Student Routes:**

```
PATCH /api/students/:id/baja
  Descripción: Dar de baja estudiante (soft delete)
  Acción: Cambia estatus a BAJA_DEFINITIVA
  Conserva: Todos los datos
  Reversible: Sí

DELETE /api/students/:id/permanent
  Descripción: Eliminar permanentemente (hard delete)
  Acción: Borra completamente de la BD
  Conserva: Nada
  Reversible: NO

DELETE /api/students/:id (legacy)
  Descripción: Dar de baja (compatibilidad)
  Acción: Llama a darDeBaja()
  Conserva: Todos los datos
  Reversible: Sí
```

---

## 🧪 **PRUEBAS SUGERIDAS**

### **Prueba 1: Dar de Baja**

```
1. Crear estudiante de prueba: "Test Baja"
2. Verificar que aparece en la lista
3. Click en 🚫 (naranja)
4. Confirmar baja
5. Verificar toast: "Estudiante dado de baja"
6. Verificar que el chip muestra "BAJA_DEFINITIVA"
7. Verificar en la BD que el estudiante existe
```

### **Prueba 2: Eliminación Permanente**

```
1. Crear estudiante de prueba: "Test Delete"
2. Verificar que aparece en la lista
3. Click en 🗑️ (rojo)
4. Leer advertencia completa
5. Confirmar eliminación permanente
6. Verificar toast: "eliminado permanentemente de la BD"
7. Verificar que YA NO aparece en la lista
8. Verificar en la BD que el estudiante NO existe
```

---

## 🔍 **VERIFICAR EN LA BASE DE DATOS**

### **Ver estudiantes en la BD:**

```sql
-- Ver todos los estudiantes (incluidos dados de baja)
SELECT id, matricula, estatus 
FROM estudiantes 
ORDER BY createdAt DESC;

-- Ver solo estudiantes activos
SELECT id, matricula, estatus 
FROM estudiantes 
WHERE estatus = 'ACTIVO';

-- Ver estudiantes dados de baja
SELECT id, matricula, estatus 
FROM estudiantes 
WHERE estatus = 'BAJA_DEFINITIVA';
```

---

## 📊 **EJEMPLO VISUAL**

### **Estado Inicial:**

```
Base de Datos:
  Estudiante 1: Juan Pérez (2024001) - ACTIVO
  Estudiante 2: María García (2024002) - ACTIVO
  Estudiante 3: Pedro López (2024003) - ACTIVO
```

### **Después de "Dar de Baja" a Juan:**

```
Base de Datos:
  Estudiante 1: Juan Pérez (2024001) - BAJA_DEFINITIVA  ← Todavía existe
  Estudiante 2: María García (2024002) - ACTIVO
  Estudiante 3: Pedro López (2024003) - ACTIVO
```

### **Después de "Eliminar Permanentemente" a María:**

```
Base de Datos:
  Estudiante 1: Juan Pérez (2024001) - BAJA_DEFINITIVA
  [Estudiante 2: María García - BORRADO]  ← Ya no existe
  Estudiante 3: Pedro López (2024003) - ACTIVO
```

---

## 🎨 **COLORES Y DISEÑO**

### **Botones:**

| Acción | Color | Icono | Tooltip |
|--------|-------|-------|---------|
| **Ver Detalles** | 🟢 Verde (#008000) | Visibility | Ver Detalles |
| **Dar de Baja** | 🟠 Naranja (#ff9800) | PersonOff | Dar de Baja (Marca como inactivo) |
| **Eliminar** | 🔴 Rojo (#d32f2f) | DeleteForever | Eliminar Permanentemente (Borra de BD) |

### **Diálogos de Confirmación:**

| Tipo | Color | Icono | Uso |
|------|-------|-------|-----|
| **Warning** | 🟡 Amarillo | Warning | Baja definitiva |
| **Error** | 🔴 Rojo | Error | Eliminación permanente |

---

## 🔐 **SEGURIDAD Y AUDITORÍA**

### **Logs Generados:**

**Al dar de baja:**
```
info: Estudiante dado de baja: 2024001
```

**Al eliminar permanentemente:**
```
info: Estudiante eliminado permanentemente: 2024001
```

### **Recomendaciones de Auditoría:**

1. Implementar tabla de auditoría para eliminaciones
2. Guardar quién eliminó, cuándo y por qué
3. Requiere doble autenticación para eliminación permanente (futuro)
4. Backup antes de eliminaciones masivas

---

## 💡 **TIPS ÚTILES**

### **Antes de Eliminar Permanentemente:**

✅ Verifica que sea el estudiante correcto
✅ Revisa que no tenga documentos importantes
✅ Considera si alguien más podría necesitar esos datos
✅ Haz backup si es ambiente de producción
✅ Lee la advertencia completa

### **Recuperación:**

**Si diste de baja por error:**
- ✅ Puedes reactivar modificando el estatus en la BD

**Si eliminaste permanentemente por error:**
- ❌ NO hay recuperación
- ❌ Debes restaurar desde backup
- ❌ O recrear el estudiante manualmente

---

## 🚀 **CÓMO PROBAR**

### **Paso 1: Ir a Gestión de Estudiantes**

```
http://localhost:3000/admin/estudiantes
```

### **Paso 2: Crear Dos Estudiantes de Prueba**

```
Estudiante 1:
  Nombre: Test Baja
  Matrícula: 9999991

Estudiante 2:
  Nombre: Test Delete
  Matrícula: 9999992
```

### **Paso 3: Probar Baja Definitiva**

1. Click en 🚫 naranja del "Test Baja"
2. Leer confirmación
3. Click en "Dar de Baja"
4. Verificar que cambia a "BAJA_DEFINITIVA"

### **Paso 4: Probar Eliminación Permanente**

1. Click en 🗑️ rojo del "Test Delete"
2. Leer advertencia completa
3. Click en "Eliminar Permanentemente"
4. Verificar que desaparece de la lista

---

## ✅ **VERIFICACIÓN FINAL**

### **Después de Dar de Baja:**

- [ ] El estudiante tiene chip "BAJA_DEFINITIVA"
- [ ] Sigue apareciendo en la lista
- [ ] Sus datos siguen en la BD
- [ ] Puede verse en detalles

### **Después de Eliminar Permanentemente:**

- [ ] El estudiante YA NO aparece en la lista
- [ ] NO existe en la base de datos
- [ ] La matrícula se liberó
- [ ] No hay rastro del usuario

---

## 📞 **SOPORTE**

### **Si algo no funciona:**

1. Revisa los logs del backend
2. Verifica que los endpoints estén registrados
3. Verifica permisos de usuario (debe ser admin)
4. Revisa que el frontend esté actualizado

---

**Documento creado:** Enero 2025
**Sistema:** Gestión Documental TESCHI
**Versión:** 2.0
**Estado:** ✅ Implementado

