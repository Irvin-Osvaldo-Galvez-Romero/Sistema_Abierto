# 🚀 PRUEBA EL SISTEMA AHORA - PASO A PASO

## ✅ TODO ESTÁ CONFIGURADO

El correo y el cambio de contraseña están **100% funcionales**.

---

## 📝 SIGUE ESTOS 3 PASOS

### **PASO 1: Reiniciar el Backend (1 minuto)**

```bash
# Abre una terminal (PowerShell o CMD)
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend

# Si ya está corriendo, detenerlo primero (Ctrl+C)

# Iniciar:
npm start
```

**✅ Verifica que veas:**
```
✅ Conexión a PostgreSQL establecida
✅ Conexión al servidor SMTP verificada correctamente  ← IMPORTANTE!
🚀 Servidor corriendo en http://localhost:3001
```

---

### **PASO 2: Iniciar el Frontend (1 minuto)**

```bash
# Abre OTRA terminal (PowerShell o CMD)
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\frontend

# Iniciar:
npm start
```

El navegador se abrirá en `http://localhost:3000`

---

### **PASO 3: Probar Todo (5 minutos)**

#### **A. Crear un estudiante:**

1. **Login como admin:**
   - Usuario: `admin@universidad.com` (o el que tengas)
   - Password: tu contraseña de admin

2. **Ir a "Dar de Alta Estudiante"**

3. **Llenar formulario** (usa datos inventados):
   ```
   Nombre:          Pedro
   Apellido Paterno: García
   Apellido Materno: Rodríguez
   Correo:          pedro.garcia  ← Solo esto, el sistema agrega @teschi.edu.mx
   Password:        Teschi123     ← Ya está llenado
   Teléfono:        5512345678
   Matrícula:       2024002
   Carrera:         Cualquiera
   ```

4. **Click "Crear Estudiante"**

5. **Verás mensaje:**
   ```
   ¡Estudiante creado exitosamente!
   Se ha enviado un correo con las credenciales de acceso a pedro.garcia@teschi.edu.mx
   ```

#### **B. Ver el correo enviado:**

1. **Abre:** https://ethereal.email/login

2. **Login con:**
   - Email: `rdfbrh6tfu2flhf3@ethereal.email`
   - Password: `g1tUH8xtXk1XV82Sxx`

3. **Verás el correo** con las credenciales del estudiante

#### **C. Probar el login del estudiante:**

1. **Logout del admin** (botón "Salir")

2. **Login con el estudiante:**
   - Usuario: `pedro.garcia@teschi.edu.mx`
   - Password: `Teschi123`

3. **¡AUTOMÁTICAMENTE TE LLEVA A LA PÁGINA DE CAMBIO DE CONTRASEÑA!** 🎉

4. **Cambiar contraseña:**
   - Contraseña Actual: `Teschi123`
   - Nueva Contraseña: `Pedro2024!` (o cualquiera que cumpla requisitos)
   - Confirmar: `Pedro2024!`

5. **Click "Cambiar Contraseña"**

6. **¡TE LLEVA AL DASHBOARD DEL ESTUDIANTE!** 🎉

---

## ✅ SI TODO FUNCIONÓ

Deberías haber visto:

✅ El correo en Ethereal con las credenciales
✅ La página morada de cambio de contraseña
✅ El dashboard del estudiante después de cambiar

---

## ❓ SI ALGO NO FUNCIONA

### **El backend dice "Error SMTP":**
- Las credenciales ya están configuradas, pero puedes regenerarlas:
```bash
cd proyecto/backend
npx tsx scripts/generar-credenciales-correo.ts
npm start
```

### **No aparece la página de cambio de contraseña:**
- Limpia caché del navegador: `Ctrl+Shift+R`
- Verifica que el backend esté actualizado

### **No veo el correo en Ethereal:**
- Verifica que el backend muestre: "📧 Correo enviado..."
- Usa las credenciales correctas de Ethereal

---

## 📊 VERIFICAR EN LOS LOGS

### **Backend debe mostrar:**

```
Al crear el estudiante:
info: Usuario registrado: pedro.garcia@teschi.edu.mx
info: 📧 Correo de credenciales enviado a estudiante: pedro.garcia@teschi.edu.mx

Al hacer login:
info: Login exitoso: pedro.garcia@teschi.edu.mx

Al cambiar contraseña:
info: 🔐 Usuario cambió contraseña en primer login: pedro.garcia@teschi.edu.mx
```

---

## 🎯 RESUMEN DEL FLUJO

```
Admin crea estudiante
        ↓
Sistema envía correo con credenciales
        ↓
Correo llega a Ethereal Email
        ↓
Estudiante hace login
        ↓
Sistema detecta primer login
        ↓
Redirige a cambio de contraseña (OBLIGATORIO)
        ↓
Estudiante cambia contraseña
        ↓
Accede al dashboard
```

---

## 📧 CREDENCIALES DE ETHEREAL

**Para ver los correos:**
- URL: https://ethereal.email/login
- Email: `rdfbrh6tfu2flhf3@ethereal.email`
- Password: `g1tUH8xtXk1XV82Sxx`

**Guardadas en:**
`proyecto/backend/credenciales-correo-prueba.txt`

---

## 🎉 ¡LISTO!

El sistema está **100% funcional**.

**Documentación completa:**
- `SOLUCION_COMPLETA_CORREO.md`

**¿Preguntas?**
- Todo está documentado en los archivos MD del proyecto
- Los logs del backend te dirán exactamente qué está pasando

---

**¡EMPIEZA A PROBAR AHORA!** 🚀

