# 📧 SISTEMA DE ENVÍO AUTOMÁTICO DE CREDENCIALES

## 🎯 Descripción General

Sistema automático que envía las credenciales de acceso por correo electrónico institucional (`@teschi.edu.mx`) cuando un administrador crea una nueva cuenta de estudiante o profesor en el Sistema de Gestión Documental del TESCHI.

---

## ✨ CARACTERÍSTICAS PRINCIPALES

### **1. Envío Automático**
- ✅ El correo se envía **automáticamente** al crear el usuario
- ✅ No requiere intervención manual del administrador
- ✅ Entrega instantánea al correo institucional

### **2. Correos Profesionales**
- ✅ Diseño HTML profesional con colores institucionales
- ✅ Logotipo y branding del TESCHI
- ✅ Responsive (se ve bien en móvil y desktop)
- ✅ Incluye enlace directo al sistema

### **3. Información Completa**
- ✅ Nombre completo del usuario
- ✅ Correo institucional
- ✅ Contraseña temporal
- ✅ Matrícula (solo estudiantes)
- ✅ Instrucciones de acceso
- ✅ Recomendaciones de seguridad

### **4. Seguridad**
- 🔒 Conexión TLS cifrada
- 🔒 Correo solo al destinatario (no CC ni BCC)
- 🔒 Contraseña temporal que debe cambiarse
- 🔒 Logs de auditoría
- 🔒 Si falla el envío, la cuenta se crea igual

---

## 📊 FLUJO DE FUNCIONAMIENTO

```
┌─────────────────────────────────────────────────────────────┐
│                    ADMINISTRADOR                            │
│  Ingresa al sistema y llena formulario de alta             │
│                                                             │
│  Estudiante:                    Profesor:                   │
│  • Nombre                       • Nombre                    │
│  • Email (solo usuario)         • Email (solo usuario)      │
│  • Matrícula                    • No. Empleado              │
│  • Carrera                      • Especialidad              │
│  • Otros datos                  • Otros datos               │
│                                                             │
│  Password: Teschi123 (pre-llenado)                         │
│  Correo: @teschi.edu.mx (automático)                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Click en "Crear"
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (auth.service.ts)                  │
│                                                             │
│  1. Valida datos                                            │
│  2. Crea usuario en BD                                      │
│  3. Hashea contraseña                                       │
│  4. Genera tokens JWT                                       │
│  5. ✉️  Envía correo con credenciales                      │
│                                                             │
│     ┌──────────────────────────────────────┐               │
│     │  email.service.ts                    │               │
│     │  • Conecta a servidor SMTP           │               │
│     │  • Genera HTML del correo            │               │
│     │  • Envía correo                      │               │
│     │  • Registra en logs                  │               │
│     └──────────────────────────────────────┘               │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Correo enviado
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  SERVIDOR SMTP                              │
│  (Gmail, Outlook o servidor propio del TESCHI)              │
│                                                             │
│  • Recibe correo del sistema                                │
│  • Valida autenticación                                     │
│  • Envía a destinatario                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Entrega
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              USUARIO (Estudiante/Profesor)                  │
│                                                             │
│  Recibe correo en: usuario@teschi.edu.mx                   │
│                                                             │
│  ┌─────────────────────────────────────────────┐           │
│  │  🎓 Bienvenido al TESCHI                   │           │
│  ├─────────────────────────────────────────────┤           │
│  │  Estimado(a) Juan Pérez,                   │           │
│  │                                             │           │
│  │  Tu cuenta ha sido creada exitosamente     │           │
│  │                                             │           │
│  │  📋 Credenciales de Acceso:                │           │
│  │  • Matrícula: 2024001                      │           │
│  │  • Correo: juan.perez@teschi.edu.mx       │           │
│  │  • Contraseña: Teschi123                   │           │
│  │                                             │           │
│  │  [  🔐 Acceder al Sistema  ]               │           │
│  └─────────────────────────────────────────────┘           │
│                                                             │
│  Click en el botón → Accede al sistema                     │
│  Login con sus credenciales                                 │
│  Cambia su contraseña en primer acceso                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 📄 PLANTILLAS DE CORREO

### **Estudiantes**

**Asunto:** 🎓 Credenciales de Acceso - Sistema TESCHI

**Color Principal:** Azul (#1976d2)

**Contenido:**
- Saludo personalizado con nombre completo
- Mensaje de bienvenida
- Recuadro destacado con:
  - Matrícula
  - Correo institucional
  - Contraseña temporal
- Advertencias de seguridad
- Instrucciones paso a paso
- Botón de acceso directo
- Información de contacto

### **Profesores**

**Asunto:** 👨‍🏫 Credenciales de Acceso - Sistema TESCHI

**Color Principal:** Verde (#2e7d32)

**Contenido:**
- Saludo personalizado con nombre completo
- Mensaje de bienvenida (rol profesor)
- Recuadro destacado con:
  - Correo institucional
  - Contraseña temporal
- Advertencias de seguridad
- Instrucciones paso a paso
- Botón de acceso directo
- Información de contacto

---

## 🔧 ARCHIVOS IMPLEMENTADOS

### **Backend**

```
proyecto/backend/src/
├── services/
│   ├── email.service.ts         ← ✨ NUEVO
│   └── auth.service.ts          ← ✏️ MODIFICADO
└── env.example                   ← ✨ NUEVO
```

**1. `email.service.ts` (Nuevo - 600+ líneas)**
- Clase `EmailService` con métodos estáticos
- `sendStudentCredentials()` - Plantilla para estudiantes
- `sendProfessorCredentials()` - Plantilla para profesores
- `sendEmail()` - Método genérico de envío
- `verifyConnection()` - Verificar configuración SMTP
- Integración con NodeMailer
- Plantillas HTML completas y profesionales

**2. `auth.service.ts` (Modificado)**
- Import de `EmailService`
- Interfaz `RegisterData` extendida con:
  - `matricula?: string`
  - `sendEmail?: boolean`
- Función `register()` modificada:
  - Llama a `EmailService` después de crear usuario
  - Envía correo según rol (ESTUDIANTE o PROFESOR)
  - Manejo de errores sin interrumpir registro
  - Logs detallados de envío

**3. `env.example` (Nuevo)**
- Plantilla de configuración
- Variables SMTP requeridas
- Comentarios explicativos
- Ejemplos para Gmail, Outlook, servidor propio

### **Frontend**

```
proyecto/frontend/src/pages/
├── AdminNewStudentPage.tsx      ← ✏️ MODIFICADO
└── AdminNewProfessorPage.tsx    ← ✏️ MODIFICADO
```

**1. `AdminNewStudentPage.tsx` (Modificado)**
- Envía `matricula` al backend en el registro
- Envía `sendEmail: true` para activar envío
- Mensaje de éxito actualizado con confirmación de correo
- Toast: "¡Estudiante creado! Se ha enviado un correo a..."

**2. `AdminNewProfessorPage.tsx` (Modificado)**
- Envía `sendEmail: true` para activar envío
- Mensaje de éxito actualizado con confirmación de correo
- Toast: "¡Docente creado! Se ha enviado un correo a..."

### **Documentación**

```
proyecto/
├── CONFIGURACION_CORREO.md      ← ✨ NUEVO
├── CREDENCIALES_TESCHI.md       ← ✏️ ACTUALIZADO
└── SISTEMA_CORREO_CREDENCIALES.md ← ✨ ESTE ARCHIVO
```

---

## ⚙️ CONFIGURACIÓN

### **Paso 1: Variables de Entorno**

Crear o editar `proyecto/backend/.env`:

```bash
# ==================================
# CONFIGURACIÓN DE CORREO
# ==================================

# Servidor SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Credenciales
SMTP_USER=sistema@teschi.edu.mx
SMTP_PASSWORD=abcd efgh ijkl mnop

# URL del frontend
FRONTEND_URL=http://localhost:3000
```

### **Paso 2: Obtener Contraseña de Aplicación (Gmail)**

1. Ve a https://myaccount.google.com
2. Habilita "Verificación en 2 pasos"
3. Ve a "Contraseñas de aplicaciones"
4. Genera una contraseña para "Sistema TESCHI"
5. Copia la contraseña de 16 caracteres
6. Úsala en `SMTP_PASSWORD` (sin espacios)

### **Paso 3: Reiniciar Backend**

```bash
cd proyecto/backend
npm start
```

Verifica en los logs:
```
✅ Conexión al servidor SMTP verificada correctamente
```

### **Paso 4: Probar**

1. Crea un usuario de prueba con tu propio correo
2. Verifica que recibas el correo
3. Confirma que el contenido sea correcto

---

## 📋 EJEMPLO DE USO

### **Crear Estudiante**

1. **Admin accede al sistema**
   - Login como administrador
   - Va a "Dar de Alta Estudiante"

2. **Llena el formulario:**
   ```
   Nombre: Juan
   Apellido Paterno: Pérez
   Apellido Materno: López
   Correo: juan.perez (automático: @teschi.edu.mx)
   Password: Teschi123 (pre-llenado)
   Teléfono: 5512345678
   Matrícula: 2024001
   Carrera: Ingeniería en Sistemas
   ```

3. **Click en "Crear Estudiante"**
   - Diálogo de confirmación aparece
   - Admin confirma

4. **Sistema procesa:**
   - Crea usuario en BD
   - Crea perfil de estudiante
   - **Envía correo automático a: juan.perez@teschi.edu.mx**
   - Muestra toast: "¡Estudiante creado! Se ha enviado un correo a juan.perez@teschi.edu.mx"

5. **Juan Pérez recibe correo:**
   ```
   🎓 Bienvenido al TESCHI
   
   Estimado(a) Juan Pérez López,
   
   📋 Tus Credenciales:
   • Matrícula: 2024001
   • Correo: juan.perez@teschi.edu.mx
   • Contraseña: Teschi123
   
   [🔐 Acceder al Sistema]
   ```

6. **Juan accede:**
   - Click en el botón del correo
   - Login con sus credenciales
   - Sistema le pide cambiar contraseña
   - Accede a su dashboard

---

## 🔍 LOGS Y MONITOREO

### **Logs Exitosos**

```bash
info: Usuario registrado: juan.perez@teschi.edu.mx
info: 📧 Correo de credenciales enviado a estudiante: juan.perez@teschi.edu.mx
```

### **Logs de Error**

```bash
warn: ⚠️ Error al enviar correo de credenciales a juan.perez@teschi.edu.mx: 
Authentication failed
```

**Importante:** Si falla el envío del correo, la cuenta **se crea de todos modos**. Solo se registra una advertencia en los logs.

---

## 🛡️ SEGURIDAD

### **Implementada**

- ✅ Conexión TLS cifrada (puerto 587)
- ✅ Autenticación SMTP con contraseña de aplicación
- ✅ Contraseña temporal que debe cambiarse
- ✅ Correo solo al destinatario (sin CC/BCC)
- ✅ Variables sensibles en `.env` (no en Git)
- ✅ Logs de auditoría de envíos
- ✅ Manejo de errores sin exponer información sensible

### **Recomendaciones Adicionales**

1. Usar cuenta exclusiva para el sistema (no personal)
2. Cambiar contraseña SMTP cada 6 meses
3. Monitorear logs regularmente
4. Configurar SPF y DKIM para el dominio
5. Limitar acceso al archivo `.env`

---

## ❓ PREGUNTAS FRECUENTES

### **¿Qué pasa si el correo no llega?**

1. Verificar carpeta de spam
2. Verificar que el correo esté bien escrito
3. Revisar logs del backend
4. Verificar configuración SMTP
5. La cuenta ya fue creada, solo faltó el correo

### **¿Se puede reenviar el correo?**

Actualmente no hay función de reenvío. Opciones:
- El admin puede crear el usuario nuevamente (detectará duplicado)
- Implementar función de "Reenviar credenciales" (futura mejora)

### **¿Los correos van a spam?**

No, si el dominio está configurado correctamente con:
- Registros SPF
- Registros DKIM
- Servidor SMTP oficial del TESCHI

### **¿Puedo personalizar las plantillas?**

Sí, edita `email.service.ts`:
- Método `sendStudentCredentials()` para estudiantes
- Método `sendProfessorCredentials()` para profesores
- Modifica el HTML según necesites

### **¿Funciona con otros proveedores de correo?**

Sí, compatible con:
- Gmail / Google Workspace
- Outlook / Office 365
- Servidor SMTP propio
- Cualquier servidor SMTP estándar

---

## 📊 ESTADÍSTICAS

### **Código Añadido**

```
email.service.ts:           600+ líneas
auth.service.ts:            +35 líneas
AdminNewStudentPage.tsx:    +2 líneas
AdminNewProfessorPage.tsx:  +1 línea
env.example:                65 líneas
CONFIGURACION_CORREO.md:    550+ líneas
CREDENCIALES_TESCHI.md:     +175 líneas
────────────────────────────────────────
TOTAL:                      ~1,428 líneas
```

### **Funcionalidades**

- ✅ Envío automático de correos
- ✅ Plantillas HTML profesionales
- ✅ Configuración flexible (Gmail, Outlook, SMTP propio)
- ✅ Logs de auditoría
- ✅ Manejo de errores robusto
- ✅ Documentación completa
- ✅ Guía de configuración paso a paso
- ✅ Soporte para estudiantes y profesores

---

## 🚀 VENTAJAS DEL SISTEMA

| Ventaja | Antes | Ahora |
|---------|-------|-------|
| **Entrega** | Manual, por papel o WhatsApp | Automática por correo |
| **Tiempo** | Varios minutos | Instantáneo |
| **Seguridad** | Baja (papel, mensajes) | Alta (correo cifrado) |
| **Evidencia** | No hay registro | Correo guardado + logs |
| **Profesionalismo** | Bajo | Alto (diseño institucional) |
| **Escalabilidad** | Difícil con muchos usuarios | Fácil (automatizado) |
| **Accesibilidad** | Solo en persona | Desde cualquier lugar |
| **Trazabilidad** | No hay | Logs completos |

---

## 📈 MEJORAS FUTURAS

### **Corto Plazo**

- [ ] Función de "Reenviar credenciales"
- [ ] Panel de historial de correos enviados
- [ ] Notificación al admin si falla el envío
- [ ] Vista previa del correo antes de enviar

### **Mediano Plazo**

- [ ] Plantillas personalizables desde panel admin
- [ ] Correos en múltiples idiomas
- [ ] Estadísticas de apertura de correos
- [ ] Recordatorio si el usuario no accede en X días

### **Largo Plazo**

- [ ] Sistema de notificaciones por correo para:
  - Documentos aprobados/rechazados
  - Fechas límite
  - Mensajes del admin
- [ ] Newsletter institucional
- [ ] Confirmación de lectura

---

## 🎉 CONCLUSIÓN

El sistema de envío automático de credenciales por correo electrónico está **completamente implementado y funcional**. 

### **Para empezar a usarlo:**

1. ✅ Configurar variables SMTP en `.env`
2. ✅ Reiniciar el backend
3. ✅ Crear un usuario de prueba
4. ✅ Verificar recepción del correo

### **Beneficios inmediatos:**

- 🚀 Proceso automatizado
- 📧 Entrega profesional
- 🔐 Mayor seguridad
- 📋 Trazabilidad completa
- ✅ Mejor experiencia de usuario

---

## 📞 SOPORTE

**Documentación:**
- `CONFIGURACION_CORREO.md` - Guía completa de configuración
- `CREDENCIALES_TESCHI.md` - Sistema de credenciales
- Este documento - Descripción general

**Archivos clave:**
- `proyecto/backend/src/services/email.service.ts`
- `proyecto/backend/src/services/auth.service.ts`
- `proyecto/backend/.env`

**Contacto:**
- Revisa los logs del backend para diagnóstico
- Consulta la sección de solución de problemas
- Contacta al departamento de TI del TESCHI

---

**Documento creado:** Enero 2025
**Sistema:** Gestión Documental TESCHI
**Versión:** 1.0
**Estado:** ✅ Implementado y Funcional

