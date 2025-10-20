# 🚀 GUÍA RÁPIDA PARA PROBAR EL SISTEMA DE CORREO

## ✅ Estado Actual

La base de datos ha sido **limpiada exitosamente** y está lista para probar el sistema de envío automático de credenciales por correo.

### **Base de Datos Limpia:**

```
✅ Estudiantes:     0
✅ Profesores:      0
✅ Documentos:      0
✅ Carreras:        7 (TESCHI)
✅ Administradores: 2 (conservados)
```

---

## 📋 PASOS PARA PROBAR EL SISTEMA

### **PASO 1: Configurar Correo SMTP** 📧

#### **Opción A: Gmail Institucional (Recomendado)**

1. **Generar Contraseña de Aplicación:**
   - Ve a: https://myaccount.google.com
   - Habilita "Verificación en 2 pasos"
   - Ve a "Contraseñas de aplicaciones"
   - Crea una para "Sistema TESCHI"
   - Copia la contraseña (16 caracteres)

2. **Editar archivo `.env`:**
   ```bash
   # Abrir el archivo
   notepad proyecto/backend/.env
   ```

3. **Agregar configuración:**
   ```env
   # Configuración de Correo
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=tu_correo@teschi.edu.mx
   SMTP_PASSWORD=abcd efgh ijkl mnop
   FRONTEND_URL=http://localhost:3000
   ```

4. **Reemplazar:**
   - `tu_correo@teschi.edu.mx` → Tu correo institucional
   - `abcd efgh ijkl mnop` → La contraseña de aplicación (sin espacios)

5. **Guardar y cerrar**

#### **Opción B: Servidor SMTP del TESCHI**

Si el TESCHI tiene servidor propio, contacta a TI para obtener:
- Servidor SMTP
- Puerto
- Usuario
- Contraseña

```env
SMTP_HOST=mail.teschi.edu.mx
SMTP_PORT=587
SMTP_USER=sistema@teschi.edu.mx
SMTP_PASSWORD=tu_contraseña
FRONTEND_URL=http://localhost:3000
```

---

### **PASO 2: Iniciar Backend** 🔄

```bash
cd proyecto/backend
npm start
```

**Verificar en logs:**
```
✅ Conexión al servidor SMTP verificada correctamente
```

Si ves este mensaje, ¡la configuración es correcta! ✨

---

### **PASO 3: Iniciar Frontend** 🌐

**Abrir otra terminal:**

```bash
cd proyecto/frontend
npm start
```

El navegador se abrirá automáticamente en `http://localhost:3000`

---

### **PASO 4: Crear Usuario de Prueba** 👤

#### **4.1 Login como Administrador**

1. Ve a: http://localhost:3000/login
2. Ingresa con tus credenciales de admin
3. Click en "Iniciar Sesión"

#### **4.2 Ir a Alta de Estudiante**

1. En el dashboard, busca: **"Dar de Alta Estudiante"**
2. Click en el botón

#### **4.3 Llenar Formulario**

**⚠️ IMPORTANTE:** Usa **TU PROPIO CORREO** para recibir el correo de prueba

```
Nombre:             Juan
Apellido Paterno:   Pérez
Apellido Materno:   López
Correo:             tu.nombre    ← Solo la parte antes del @
                    (El sistema agregará @teschi.edu.mx)
Password:           Teschi123    ← Ya está pre-llenado
Teléfono:           5512345678
Matrícula:          2024001
Carrera:            Ingeniería en Sistemas Computacionales
```

#### **4.4 Crear Estudiante**

1. Click en **"Crear Estudiante"**
2. Confirma en el diálogo
3. Espera el mensaje: **"¡Estudiante creado! Se ha enviado un correo a tu.nombre@teschi.edu.mx"**

---

### **PASO 5: Verificar Correo** 📧

#### **5.1 Revisar Bandeja de Entrada**

1. Abre tu correo (`tu.nombre@teschi.edu.mx`)
2. Busca correo de: **"TESCHI - Sistema de Gestión Documental"**
3. Asunto: **"🎓 Credenciales de Acceso - Sistema TESCHI"**

#### **5.2 Contenido Esperado**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    🎓 Bienvenido al TESCHI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estimado(a) Juan Pérez López,

Tu cuenta de estudiante ha sido creada
exitosamente.

┌────────────────────────────────────┐
│  📋 Tus Credenciales de Acceso     │
├────────────────────────────────────┤
│  MATRÍCULA: 2024001                │
│  CORREO: juan.perez@teschi.edu.mx │
│  CONTRASEÑA: Teschi123             │
└────────────────────────────────────┘

⚠️ Importante:
• Cambia tu contraseña en el primer acceso
• No compartas tus credenciales

      [ 🔐 Acceder al Sistema ]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

#### **5.3 Probar Acceso**

1. Click en el botón **"🔐 Acceder al Sistema"**
2. O ve manualmente a: http://localhost:3000/login
3. Ingresa las credenciales:
   - Correo: `tu.nombre@teschi.edu.mx`
   - Password: `Teschi123`
4. Click en "Iniciar Sesión"
5. El sistema te pedirá cambiar tu contraseña ✅

---

## ✅ CHECKLIST DE PRUEBA

Marca cada paso conforme lo completes:

- [ ] Configuré variables SMTP en `.env`
- [ ] Backend inició correctamente
- [ ] Logs muestran: "✅ Conexión al servidor SMTP verificada"
- [ ] Frontend inició correctamente
- [ ] Accedí como administrador
- [ ] Fui a "Dar de Alta Estudiante"
- [ ] Llené formulario con mi correo
- [ ] Creé el estudiante exitosamente
- [ ] Recibí correo en mi bandeja
- [ ] El correo contiene mis credenciales
- [ ] El enlace del correo funciona
- [ ] Pude iniciar sesión con las credenciales

---

## 🧪 PROBAR TAMBIÉN CON PROFESORES

Repite el proceso pero con **"Dar de Alta Docente"**:

```
Nombre:             María
Apellido Paterno:   García
Apellido Materno:   Hernández
Correo:             maria.garcia    ← Tu correo
Password:           Teschi123
Teléfono:           5512345679
No. Empleado:       EMP001
Especialidad:       Desarrollo de Software
```

**Correo esperado:**
- Asunto: **"👨‍🏫 Credenciales de Acceso - Sistema TESCHI"**
- Color: Verde institucional
- Contenido similar pero sin matrícula

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### **❌ No recibo el correo**

**Verificar:**

1. **¿El correo está correcto?**
   - Revisa que hayas escrito bien tu usuario

2. **¿Está en spam?**
   - Revisa carpeta de spam/promociones

3. **¿Los logs muestran envío?**
   - En la terminal del backend busca:
     ```
     info: 📧 Correo de credenciales enviado a...
     ```

4. **¿La configuración SMTP es correcta?**
   - Verifica `.env`
   - Verifica que la contraseña no tenga espacios

5. **¿Hay errores en logs?**
   - Busca líneas con:
     ```
     warn: ⚠️ Error al enviar correo...
     ```

### **❌ Error: "Authentication failed"**

**Solución:**
- Verifica que uses **contraseña de aplicación**, no tu contraseña normal
- Verifica que `SMTP_USER` sea tu correo completo
- Verifica que `SMTP_PASSWORD` no tenga espacios

### **❌ Error: "Connection timeout"**

**Solución:**
- Verifica tu conexión a internet
- Verifica que `SMTP_HOST` y `SMTP_PORT` sean correctos
- Verifica que tu firewall no bloquee el puerto 587

### **❌ Backend no inicia**

**Solución:**
```bash
# Limpiar y reinstalar dependencias
cd proyecto/backend
rm -rf node_modules
npm install
npm start
```

---

## 📊 LOGS ESPERADOS

### **Backend al Iniciar:**

```
info: ✅ Conexión a PostgreSQL establecida
info: ✅ Conexión al servidor SMTP verificada correctamente
info: 🚀 Servidor corriendo en puerto 3001
```

### **Al Crear Usuario:**

```
info: Usuario registrado: juan.perez@teschi.edu.mx
info: 📧 Correo de credenciales enviado a estudiante: juan.perez@teschi.edu.mx
```

### **Si Hay Error en Correo (No crítico):**

```
warn: ⚠️ Error al enviar correo de credenciales a juan.perez@teschi.edu.mx: [detalles]
```

**Nota:** Si falla el correo, la cuenta **se crea de todos modos**. Solo se registra una advertencia.

---

## 🧹 LIMPIAR BASE DE DATOS NUEVAMENTE

Si necesitas empezar de cero otra vez:

```bash
cd proyecto/backend
npx tsx scripts/limpiar-usuarios.ts
```

Este script:
- ✅ Elimina todos los estudiantes y profesores
- ✅ Elimina todos los documentos
- ✅ Conserva administradores
- ✅ Conserva carreras
- ✅ Conserva catálogos

---

## 📧 PROBAR MÚLTIPLES USUARIOS

Puedes crear varios usuarios de prueba usando **alias de email**:

Si tu correo es `tu.nombre@teschi.edu.mx`, puedes usar:
- `tu.nombre+test1@teschi.edu.mx`
- `tu.nombre+test2@teschi.edu.mx`
- `tu.nombre+estudiante@teschi.edu.mx`

Todos llegarán a tu misma bandeja pero el sistema los tratará como correos diferentes.

---

## 🎉 PRUEBA EXITOSA

Si completaste todos los pasos y recibiste el correo, ¡felicidades! ✨

El sistema de envío automático de credenciales está funcionando correctamente.

### **Siguiente Nivel:**

1. Prueba crear varios estudiantes
2. Prueba crear varios profesores
3. Verifica que cada uno reciba su correo
4. Verifica que puedan iniciar sesión
5. Verifica el dashboard de cada usuario

---

## 📚 DOCUMENTACIÓN ADICIONAL

### **Para Configuración Avanzada:**
- `CONFIGURACION_CORREO.md` - Guía completa de SMTP

### **Para Entender el Sistema:**
- `SISTEMA_CORREO_CREDENCIALES.md` - Descripción técnica

### **Para Ver las Plantillas:**
- `CREDENCIALES_TESCHI.md` - Sistema de credenciales

### **Para Análisis de Riesgos:**
- `MATRIZ_RIESGOS.md` - Análisis de riesgos del sistema

---

## 🆘 SOPORTE

Si tienes problemas:

1. **Revisa los logs del backend** (terminal donde corre `npm start`)
2. **Revisa esta guía** de principio a fin
3. **Consulta `CONFIGURACION_CORREO.md`** para configuración SMTP
4. **Verifica tu archivo `.env`** que esté completo y sin errores

---

## ✨ RESUMEN

```
1. Configurar SMTP en .env        ← 5 minutos
2. Iniciar backend                ← 30 segundos
3. Iniciar frontend               ← 30 segundos
4. Crear usuario de prueba        ← 2 minutos
5. Verificar correo recibido      ← Inmediato
═══════════════════════════════════════════════
TIEMPO TOTAL: ~8 minutos
```

---

**Documento creado:** Enero 2025
**Sistema:** Gestión Documental TESCHI
**Versión:** 1.0

**¡Buena suerte con las pruebas! 🚀📧✨**

