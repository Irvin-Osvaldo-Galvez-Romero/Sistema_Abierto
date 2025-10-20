# ⚠️ IMPORTANTE: CONFIGURACIÓN DE CORREO ELECTRÓNICO

## 🚨 PROBLEMA DETECTADO

**Los correos NO se están enviando porque el archivo `.env` tiene credenciales de ejemplo (no reales).**

### **Estado Actual del `.env`:**

```env
SMTP_USER=your_email@domain.com          ← ❌ EJEMPLO (NO REAL)
SMTP_PASSWORD=your_email_password         ← ❌ EJEMPLO (NO REAL)
```

**Por eso no recibes los correos con las credenciales.**

---

## ✅ SOLUCIÓN: Configurar Credenciales Reales

### **OPCIÓN 1: Gmail Institucional (Recomendado)**

#### **Paso 1: Generar Contraseña de Aplicación**

1. Ve a tu cuenta de Google: https://myaccount.google.com
2. Habilita **"Verificación en 2 pasos"**
3. Ve a **"Contraseñas de aplicaciones"**
4. Crea una nueva para "Sistema TESCHI"
5. **Copia la contraseña de 16 caracteres**

#### **Paso 2: Editar el archivo `.env`**

```bash
# Abrir el archivo
notepad proyecto/backend/.env
```

#### **Paso 3: Reemplazar con tus credenciales reales**

```env
# Configuración de Correo
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo_real@teschi.edu.mx
SMTP_PASSWORD=abcd efgh ijkl mnop
FRONTEND_URL=http://localhost:3000
```

**Reemplaza:**
- `tu_correo_real@teschi.edu.mx` → Tu correo institucional REAL
- `abcd efgh ijkl mnop` → La contraseña de aplicación que copiaste (sin espacios)

#### **Paso 4: Guardar y Reiniciar Backend**

```bash
# Detener el backend (Ctrl+C)

# Iniciar nuevamente
cd proyecto/backend
npm start
```

#### **Paso 5: Verificar en los Logs**

Deberías ver:
```
✅ Conexión al servidor SMTP verificada correctamente
```

---

### **OPCIÓN 2: Servidor SMTP del TESCHI**

Si el TESCHI tiene su propio servidor de correo:

```env
SMTP_HOST=mail.teschi.edu.mx
SMTP_PORT=587
SMTP_USER=sistema@teschi.edu.mx
SMTP_PASSWORD=contraseña_real_del_servidor
FRONTEND_URL=http://localhost:3000
```

**Contacta a TI del TESCHI para obtener estas credenciales.**

---

## 🧪 PRUEBA DESPUÉS DE CONFIGURAR

### **1. Reiniciar Backend**

```bash
cd proyecto/backend
npm start
```

### **2. Crear Usuario de Prueba**

1. Login como admin: http://localhost:3000/login
2. Ir a "Dar de Alta Estudiante"
3. **Usar TU propio correo** (puede ser @gmail.com para prueba)
4. Llenar formulario:
   ```
   Correo: tu.nombre  (el sistema agregará @teschi.edu.mx)
   Password: Teschi123 (ya está pre-llenado)
   ```
5. Click en "Crear Estudiante"

### **3. Revisar Correo**

Deberías recibir en menos de 5 segundos un correo como este:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    🎓 Bienvenido al TESCHI
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estimado(a) [Tu Nombre],

📋 Tus Credenciales de Acceso:
• Matrícula: 2024001
• Correo: tu.nombre@teschi.edu.mx
• Contraseña: Teschi123

      [ 🔐 Acceder al Sistema ]
```

---

## 🔍 SI AÚN NO LLEGA EL CORREO

### **Verificar Logs del Backend**

En la terminal donde corre el backend, busca:

```
info: 📧 Correo de credenciales enviado a estudiante: tu.nombre@teschi.edu.mx
```

Si ves:
```
warn: ⚠️ Error al enviar correo de credenciales a...
```

**Entonces hay un problema con las credenciales SMTP.**

### **Verificaciones:**

1. ✅ `SMTP_USER` es tu correo completo (con @)
2. ✅ `SMTP_PASSWORD` es la contraseña de aplicación (no tu contraseña normal)
3. ✅ `SMTP_PASSWORD` NO tiene espacios
4. ✅ Reiniciaste el backend después de editar `.env`
5. ✅ Tienes internet
6. ✅ Tu firewall no bloquea el puerto 587

---

## 📧 USAR OTRO CORREO PARA PRUEBAS

Si no tienes correo institucional, puedes usar Gmail personal para pruebas:

### **Paso 1: Configurar Gmail Personal**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_gmail_personal@gmail.com
SMTP_PASSWORD=contraseña_de_aplicacion_de_gmail
FRONTEND_URL=http://localhost:3000
```

### **Paso 2: Crear Usuario con Gmail**

Al crear el estudiante, el sistema agregará `@teschi.edu.mx`, pero el correo se enviará desde tu Gmail personal.

**Nota:** Para producción, DEBES usar el correo institucional del TESCHI.

---

## ✨ NUEVA FUNCIONALIDAD: Cambio Obligatorio de Contraseña

### **¿Qué se Implementó?**

Ahora, cuando un usuario inicia sesión por primera vez:

1. Se detecta que es `primerLogin: true`
2. Se redirige automáticamente a la página de cambio de contraseña
3. El usuario DEBE cambiar su contraseña antes de continuar
4. La nueva contraseña debe cumplir:
   - ✅ Mínimo 8 caracteres
   - ✅ Al menos una mayúscula
   - ✅ Al menos una minúscula
   - ✅ Al menos un número

### **Flujo Completo:**

```
1. Admin crea estudiante
       ↓
2. Sistema envía correo con:
   - Correo: estudiante@teschi.edu.mx
   - Password: Teschi123
       ↓
3. Estudiante recibe correo
       ↓
4. Estudiante hace login
       ↓
5. Sistema detecta primerLogin: true
       ↓
6. Redirige a /change-password
       ↓
7. Estudiante cambia contraseña
       ↓
8. Sistema marca primerLogin: false
       ↓
9. Redirige a dashboard
```

---

## 📝 ARCHIVOS MODIFICADOS

### **Backend:**
- ✅ `schema.prisma` - Agregado campo `primerLogin`
- ✅ `password.controller.ts` - Controlador de cambio de contraseña (NUEVO)
- ✅ `password.routes.ts` - Rutas de cambio de contraseña (NUEVO)
- ✅ `app.ts` - Registradas rutas de password
- ✅ `auth.service.ts` - Retorna `primerLogin` en login

### **Frontend:**
- ✅ `auth.types.ts` - Agregado `primerLogin` al tipo User
- ✅ `ChangePasswordPage.tsx` - Página de cambio de contraseña (NUEVA)
- ✅ `LoginPage.tsx` - Detecta primer login y redirige
- ✅ `App.tsx` - Agregada ruta `/change-password`

---

## 🎯 PRÓXIMOS PASOS

### **1. Configurar Correo (URGENTE)**

```bash
notepad proyecto/backend/.env
# Agregar credenciales reales
# Guardar y reiniciar backend
```

### **2. Aplicar Cambios a Base de Datos**

```bash
cd proyecto/backend
npx prisma db push
```

### **3. Limpiar Base de Datos**

```bash
npx tsx scripts/limpiar-usuarios.ts
```

### **4. Probar Sistema Completo**

1. Crear estudiante con tu correo
2. Verificar que llegue el correo
3. Hacer login con las credenciales
4. Verificar que te lleve a cambio de contraseña
5. Cambiar contraseña
6. Verificar que entres al dashboard

---

## ✅ CHECKLIST

- [ ] Configuré credenciales SMTP reales en `.env`
- [ ] Reinicié el backend
- [ ] Logs muestran: "✅ Conexión al servidor SMTP verificada"
- [ ] Apliqué cambios a la BD (prisma db push)
- [ ] Limpié la base de datos
- [ ] Creé usuario de prueba con mi correo
- [ ] Recibí el correo con credenciales
- [ ] Hice login exitoso
- [ ] Me redirigió a cambio de contraseña
- [ ] Cambié mi contraseña exitosamente
- [ ] Accedí al dashboard correctamente

---

## 📖 DOCUMENTACIÓN

### **Para Configurar SMTP:**
- `CONFIGURACION_CORREO.md` - Guía completa paso a paso

### **Para Hacer Pruebas:**
- `GUIA_RAPIDA_PRUEBAS.md` - Guía de pruebas del sistema

### **Para Entender el Sistema:**
- `SISTEMA_CORREO_CREDENCIALES.md` - Descripción técnica

---

## 🆘 AYUDA

Si sigues teniendo problemas:

1. **Revisa los logs del backend** (terminal donde corre `npm start`)
2. **Verifica que el `.env` esté correcto** (sin espacios extra)
3. **Prueba con Gmail personal** primero
4. **Consulta `CONFIGURACION_CORREO.md`** para más detalles

---

**Documento creado:** Enero 2025
**Prioridad:** 🔴 URGENTE
**Estado:** Requiere configuración de usuario

---

**⚠️ SIN CONFIGURAR EL CORREO, NO SE ENVIARÁN LAS CREDENCIALES ⚠️**

