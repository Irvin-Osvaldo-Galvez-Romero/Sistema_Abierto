# 📧 GUÍA DE CONFIGURACIÓN DE CORREO ELECTRÓNICO

## 🎯 Objetivo

Configurar el servicio de correo electrónico del sistema para enviar automáticamente las credenciales de acceso a estudiantes y profesores del TESCHI.

---

## 📋 REQUISITOS PREVIOS

Antes de comenzar, necesitas:

1. ✅ Una cuenta de correo institucional del TESCHI (ej: `sistema@teschi.edu.mx`)
2. ✅ Acceso SMTP al servidor de correo institucional
3. ✅ Acceso al archivo `.env` del backend
4. ✅ Node.js y el sistema backend funcionando

---

## 🔧 CONFIGURACIÓN PASO A PASO

### **OPCIÓN 1: Usando Gmail Institucional**

Si el TESCHI usa Google Workspace (Gmail institucional):

#### **Paso 1: Habilitar Verificación en 2 Pasos**

1. Ve a tu cuenta de Google: https://myaccount.google.com
2. En el menú lateral, selecciona **"Seguridad"**
3. Busca **"Verificación en dos pasos"**
4. Haz clic en **"Comenzar"** y sigue las instrucciones
5. Configura tu método preferido (SMS, app de autenticación, etc.)

#### **Paso 2: Generar Contraseña de Aplicación**

1. Una vez activada la verificación en 2 pasos, regresa a **"Seguridad"**
2. Busca **"Contraseñas de aplicaciones"**
3. Haz clic en **"Contraseñas de aplicaciones"**
4. Selecciona **"Aplicación personalizada"**
5. Escribe: `Sistema TESCHI`
6. Haz clic en **"Generar"**
7. **COPIA** la contraseña de 16 caracteres (algo como: `abcd efgh ijkl mnop`)
8. ⚠️ **IMPORTANTE:** Esta contraseña solo se muestra una vez

#### **Paso 3: Configurar el Backend**

1. Navega a la carpeta del backend:
   ```bash
   cd proyecto/backend
   ```

2. Abre (o crea) el archivo `.env`:
   ```bash
   notepad .env
   ```

3. Agrega estas líneas (con tus datos reales):
   ```env
   # Configuración de Correo (Gmail)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=sistema@teschi.edu.mx
   SMTP_PASSWORD=abcd efgh ijkl mnop
   FRONTEND_URL=http://localhost:3000
   ```

4. **Reemplaza:**
   - `sistema@teschi.edu.mx` → Tu correo institucional
   - `abcd efgh ijkl mnop` → La contraseña de aplicación generada (sin espacios)

5. Guarda y cierra el archivo

#### **Paso 4: Reiniciar el Backend**

```bash
# Detener el servidor (Ctrl+C si está corriendo)

# Iniciar nuevamente
npm start
```

---

### **OPCIÓN 2: Usando Servidor SMTP Propio del TESCHI**

Si el TESCHI tiene su propio servidor de correo:

#### **Paso 1: Obtener Credenciales del Servidor**

Contacta al departamento de TI del TESCHI y solicita:

- 📧 Dirección del servidor SMTP (ej: `mail.teschi.edu.mx`)
- 🔢 Puerto SMTP (usualmente `587` o `465`)
- 👤 Usuario/cuenta de correo (ej: `sistema@teschi.edu.mx`)
- 🔐 Contraseña de la cuenta
- 🔒 Tipo de seguridad (TLS o SSL)

#### **Paso 2: Configurar el Backend**

1. Navega a la carpeta del backend:
   ```bash
   cd proyecto/backend
   ```

2. Edita el archivo `.env`:
   ```env
   # Configuración de Correo (Servidor Propio)
   SMTP_HOST=mail.teschi.edu.mx
   SMTP_PORT=587
   SMTP_USER=sistema@teschi.edu.mx
   SMTP_PASSWORD=tu_contraseña_real_aquí
   FRONTEND_URL=http://localhost:3000
   ```

3. Si el puerto es **465** (SSL), ajusta el código en `email.service.ts`:
   ```typescript
   secure: true, // Cambiar a true para puerto 465
   ```

4. Guarda y reinicia el backend

---

### **OPCIÓN 3: Usando Outlook/Office 365 Institucional**

Si el TESCHI usa Microsoft Office 365:

#### **Configuración:**

```env
# Configuración de Correo (Outlook)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=sistema@teschi.edu.mx
SMTP_PASSWORD=tu_contraseña_aquí
FRONTEND_URL=http://localhost:3000
```

**Nota:** Outlook puede requerir activar "SMTP autenticado" en la configuración de la cuenta.

---

## ✅ VERIFICAR LA CONFIGURACIÓN

### **Método 1: Usando el Sistema**

1. Inicia el backend:
   ```bash
   cd proyecto/backend
   npm start
   ```

2. Busca en los logs del servidor:
   ```
   ✅ Conexión al servidor SMTP verificada correctamente
   ```

3. Si ves ese mensaje, ¡la configuración es correcta!

### **Método 2: Crear un Usuario de Prueba**

1. Inicia el frontend:
   ```bash
   cd proyecto/frontend
   npm start
   ```

2. Ingresa como administrador

3. Crea un estudiante de prueba con **TU propio correo**:
   - Correo: `tu.nombre@teschi.edu.mx`
   - Los demás datos pueden ser ficticios

4. Revisa tu bandeja de entrada

5. Deberías recibir un correo como este:
   ```
   🎓 Bienvenido al TESCHI
   
   Estimado(a) [Tu Nombre],
   
   Tu cuenta de estudiante ha sido creada exitosamente...
   ```

---

## 🔍 SOLUCIÓN DE PROBLEMAS

### **Error: "Authentication failed"**

**Causa:** Credenciales incorrectas

**Solución:**
- Verifica que el correo y contraseña sean correctos
- Si usas Gmail, asegúrate de usar la **contraseña de aplicación**, no tu contraseña normal
- Verifica que el usuario no tenga espacios extra

### **Error: "Connection timeout"**

**Causa:** Servidor SMTP no accesible

**Solución:**
- Verifica que `SMTP_HOST` sea correcto
- Verifica que `SMTP_PORT` sea el correcto
- Verifica tu conexión a internet
- El firewall podría estar bloqueando el puerto

### **Error: "Secure connection failed"**

**Causa:** Problema con SSL/TLS

**Solución:**
- Si usas puerto 587, asegúrate que `secure: false`
- Si usas puerto 465, cambia a `secure: true`

### **Los correos llegan a spam**

**Causa:** Dominio no verificado o configuración SPF/DKIM

**Solución:**
- Contacta a TI para configurar registros SPF y DKIM
- Pide que agreguen el servidor a la lista blanca
- Usa un correo institucional oficial (no `@gmail.com`)

### **El usuario no recibe el correo**

**Verificar:**
1. ✅ ¿El correo fue escrito correctamente?
2. ✅ ¿El usuario revisó spam/promociones?
3. ✅ ¿Los logs del backend muestran "Correo enviado"?
4. ✅ ¿La configuración SMTP es correcta?

---

## 📊 LOGS Y MONITOREO

### **Ver Logs del Backend**

Cuando el sistema envía un correo, verás en la consola:

```
info: Usuario registrado: juan.perez@teschi.edu.mx
info: 📧 Correo de credenciales enviado a estudiante: juan.perez@teschi.edu.mx
```

Si hay un error:

```
warn: ⚠️ Error al enviar correo de credenciales a juan.perez@teschi.edu.mx: [detalles del error]
```

### **Importante:**

- ✅ Si falla el envío del correo, **la cuenta se crea de todos modos**
- ⚠️ El error solo se registra, no interrumpe el proceso
- 📝 El administrador puede crear el usuario nuevamente si es necesario

---

## 🔐 SEGURIDAD

### **Buenas Prácticas:**

1. **Nunca** compartas las credenciales SMTP públicamente
2. **Nunca** subas el archivo `.env` a Git (ya está en `.gitignore`)
3. Usa una cuenta de correo **exclusiva** para el sistema (no personal)
4. Cambia la contraseña SMTP periódicamente (cada 6 meses)
5. Limita el acceso al archivo `.env` solo a administradores
6. Monitorea los logs para detectar envíos sospechosos

### **Protección del `.env`:**

```bash
# En Linux/Mac, restringir permisos:
chmod 600 .env

# Solo el propietario puede leer/escribir
```

---

## 📝 EJEMPLO COMPLETO DE `.env`

```env
# ==================================
# CONFIGURACIÓN DEL BACKEND - TESCHI
# ==================================

# Puerto del servidor
PORT=3001

# Base de Datos PostgreSQL
DATABASE_URL="postgresql://teschi_user:password@localhost:5432/teschi_db?schema=public"

# JWT Secrets
JWT_SECRET=super_secreto_jwt_teschi_2024_cambiar_en_produccion
JWT_REFRESH_SECRET=super_secreto_refresh_teschi_2024_cambiar_en_produccion

# JWT Expiration
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Environment
NODE_ENV=development

# ==================================
# CONFIGURACIÓN DE CORREO ELECTRÓNICO
# ==================================

# Servidor SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Credenciales SMTP
SMTP_USER=sistema@teschi.edu.mx
SMTP_PASSWORD=abcd efgh ijkl mnop

# URL del frontend (para enlaces en correos)
FRONTEND_URL=http://localhost:3000
```

---

## 🎯 VERIFICACIÓN FINAL

### **Checklist de Configuración Completa:**

- [ ] Archivo `.env` creado en `proyecto/backend/`
- [ ] Variables `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` configuradas
- [ ] Variable `FRONTEND_URL` configurada
- [ ] Backend reiniciado después de configurar
- [ ] Logs muestran: "✅ Conexión al servidor SMTP verificada correctamente"
- [ ] Usuario de prueba creado exitosamente
- [ ] Correo de prueba recibido correctamente
- [ ] Correo contiene credenciales correctas
- [ ] Enlace del correo funciona correctamente

---

## 📞 SOPORTE

Si necesitas ayuda adicional:

1. **Revisa los logs del backend** para ver mensajes de error específicos
2. **Contacta a TI del TESCHI** para obtener credenciales SMTP correctas
3. **Revisa la documentación de NodeMailer:** https://nodemailer.com/
4. **Verifica el archivo `email.service.ts`** para ajustes avanzados

---

## 🎉 ¡CONFIGURACIÓN COMPLETA!

Una vez completada la configuración, el sistema enviará automáticamente correos con credenciales a:

- ✅ Estudiantes cuando se den de alta
- ✅ Profesores cuando se den de alta

Los correos incluirán:
- Correo institucional
- Contraseña temporal (Teschi123)
- Matrícula (solo estudiantes)
- Enlace directo al sistema
- Instrucciones de acceso

---

**Documento creado:** Enero 2025
**Sistema:** Gestión Documental TESCHI
**Versión:** 1.0

