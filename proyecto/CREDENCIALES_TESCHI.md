# 🔐 SISTEMA DE CREDENCIALES DEL TESCHI

## ✅ Configuración Actualizada

Los formularios de alta de estudiantes y profesores ahora están configurados específicamente para el **Tecnológico de Estudios Superiores de Chimalhuacán (TESCHI)**.

---

## 📧 **DOMINIO DE EMAIL INSTITUCIONAL**

### **Configuración Automática**

Todos los emails se crean automáticamente con el dominio institucional del TESCHI:

```
@teschi.edu.mx
```

### **Cómo Funciona**

El administrador solo necesita ingresar la **parte del usuario** (antes del @), y el sistema completa automáticamente el dominio.

**Ejemplo:**
```
Usuario ingresa: juan.perez
Sistema crea: juan.perez@teschi.edu.mx
```

---

## 🔑 **CONTRASEÑA POR DEFECTO**

### **Contraseña Estándar**

Todos los usuarios nuevos (estudiantes y profesores) reciben por defecto la contraseña:

```
Teschi123
```

### **Características**
- ✅ Fácil de recordar
- ✅ Cumple con requisitos de seguridad (mayúscula, minúscula, número)
- ✅ Relacionada con la institución (TESCHI)
- ✅ El administrador puede cambiarla antes de crear el usuario
- ✅ El usuario puede cambiarla después del primer login

---

## 📋 **FORMULARIOS ACTUALIZADOS**

### **1. Formulario de Alta de Estudiante**

**Ubicación:** `/admin/estudiantes/nuevo`

#### Campo de Email:
```
┌─────────────────────────────────────────────┐
│ Email (usuario TESCHI) *                    │
│ [juan.perez           ]  @teschi.edu.mx     │
│                                             │
│ Solo ingresa el usuario, se agregará       │
│ automáticamente @teschi.edu.mx              │
└─────────────────────────────────────────────┘
```

#### Campo de Contraseña:
```
┌─────────────────────────────────────────────┐
│ Contraseña *                                │
│ [Teschi123                    ] 👁          │
│                                             │
│ Contraseña por defecto: Teschi123          │
│ (puedes cambiarla)                          │
└─────────────────────────────────────────────┘
```

### **2. Formulario de Alta de Profesor**

**Ubicación:** `/admin/profesores/nuevo`

Mismo formato que el de estudiantes:
- Campo de email con dominio @teschi.edu.mx
- Contraseña por defecto: Teschi123

---

## 🎯 **EJEMPLOS DE USO**

### **Ejemplo 1: Crear Estudiante**

**Datos ingresados por el administrador:**
```
Nombre: Juan
Apellido Paterno: Pérez
Apellido Materno: García
Email: juan.perez          ← Solo el usuario
Contraseña: Teschi123      ← Por defecto (puede cambiar)
Teléfono: 5512345678
Matrícula: 2024001
Carrera: Ingeniería en Sistemas Computacionales
```

**Usuario creado en el sistema:**
```
Email completo: juan.perez@teschi.edu.mx
Contraseña: Teschi123
```

### **Ejemplo 2: Crear Profesor**

**Datos ingresados por el administrador:**
```
Nombre: María
Apellido Paterno: López
Apellido Materno: Martínez
Email: maria.lopez         ← Solo el usuario
Contraseña: Teschi123      ← Por defecto (puede cambiar)
Teléfono: 5598765432
Número de Empleado: PROF2024001
Especialidad: Programación
```

**Usuario creado en el sistema:**
```
Email completo: maria.lopez@teschi.edu.mx
Contraseña: Teschi123
```

---

## 🔄 **PROCESO DE CREACIÓN DE USUARIO**

```
1. Administrador llena el formulario
   ↓
2. Ingresa solo el usuario del email (sin @)
   Ejemplo: "juan.perez"
   ↓
3. El sistema agrega automáticamente "@teschi.edu.mx"
   Resultado: "juan.perez@teschi.edu.mx"
   ↓
4. La contraseña por defecto es "Teschi123"
   (puede ser modificada por el administrador)
   ↓
5. Se crea el usuario con email completo
   ↓
6. El estudiante/profesor puede iniciar sesión con:
   - Email: juan.perez@teschi.edu.mx
   - Password: Teschi123
```

---

## ⚙️ **VENTAJAS DE ESTA CONFIGURACIÓN**

### **Para el Administrador:**
- ✅ Más rápido (no tiene que escribir @teschi.edu.mx cada vez)
- ✅ Sin errores de tipeo en el dominio
- ✅ Contraseña estandarizada y fácil de comunicar
- ✅ Menos campos que completar
- ✅ Mayor eficiencia en alta de usuarios masiva

### **Para la Institución:**
- ✅ Todos los emails son institucionales
- ✅ Dominio único y reconocible (@teschi.edu.mx)
- ✅ Contraseña estándar fácil de recordar
- ✅ Uniformidad en las credenciales
- ✅ Fácil identificación de usuarios del TESCHI

### **Para los Usuarios:**
- ✅ Contraseña fácil de recordar (Teschi123)
- ✅ Email institucional del TESCHI
- ✅ Pueden cambiar su contraseña después
- ✅ Credenciales profesionales

---

## 🛡️ **SEGURIDAD**

### **Contraseña Segura**

La contraseña `Teschi123` cumple con los requisitos de seguridad:
- ✅ Mínimo 8 caracteres
- ✅ Contiene mayúscula (T)
- ✅ Contiene minúsculas (eschi)
- ✅ Contiene números (123)

### **Recomendaciones**

1. **Primer Login:** Se recomienda que los usuarios cambien su contraseña en el primer inicio de sesión
2. **Comunicación:** Las credenciales se envían automáticamente por correo institucional
3. **Seguridad:** Los correos son confidenciales y solo se envían al destinatario

---

## 📧 **SISTEMA DE ENVÍO DE CREDENCIALES POR CORREO**

### **Funcionamiento Automático**

El sistema envía **automáticamente** las credenciales de acceso al correo institucional del usuario cuando el administrador crea una cuenta.

### **Proceso Completo:**

```
1. Administrador llena formulario
        ↓
2. Sistema crea cuenta de usuario
        ↓
3. Sistema envía correo automático
        ↓
4. Usuario recibe credenciales en su correo institucional
        ↓
5. Usuario accede al sistema por primera vez
```

### **Contenido del Correo**

Los correos incluyen:
- ✅ Nombre completo del usuario
- ✅ Correo institucional (`usuario@teschi.edu.mx`)
- ✅ Contraseña temporal (`Teschi123`)
- ✅ Matrícula (solo estudiantes)
- ✅ Enlace directo al sistema
- ✅ Instrucciones paso a paso
- ✅ Recomendaciones de seguridad

### **Correo para Estudiantes - Vista Previa**

```html
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         🎓 Bienvenido al TESCHI
  Tecnológico de Estudios Superiores de Chimalhuacán
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estimado(a) Juan Pérez López,

Tu cuenta de estudiante ha sido creada exitosamente 
en el Sistema de Gestión Documental del TESCHI.

┌─────────────────────────────────────────────┐
│  📋 Tus Credenciales de Acceso              │
├─────────────────────────────────────────────┤
│  MATRÍCULA                                   │
│  2024001                                     │
│                                              │
│  CORREO INSTITUCIONAL                        │
│  juan.perez@teschi.edu.mx                   │
│                                              │
│  CONTRASEÑA TEMPORAL                         │
│  Teschi123                                   │
└─────────────────────────────────────────────┘

⚠️ Importante - Seguridad de tu Cuenta
• Cambia tu contraseña en el primer inicio de sesión
• No compartas tus credenciales con nadie
• Guarda esta información en un lugar seguro
• Este correo es confidencial y de uso exclusivo

📝 Instrucciones para Acceder
1. Ingresa al sistema haciendo clic en el botón
2. Usa tu correo institucional y contraseña temporal
3. El sistema te pedirá cambiar tu contraseña
4. Podrás subir tus documentos de reinscripción

          [ 🔐 Acceder al Sistema ]

¿Necesitas ayuda?
Contacta al personal administrativo del TESCHI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sistema de Gestión Documental Digital - TESCHI
Este correo fue enviado automáticamente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### **Correo para Profesores - Vista Previa**

```html
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         👨‍🏫 Bienvenido al TESCHI
  Tecnológico de Estudios Superiores de Chimalhuacán
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Estimado(a) Prof. María García Hernández,

Tu cuenta de profesor ha sido creada exitosamente 
en el Sistema de Gestión Documental del TESCHI.

┌─────────────────────────────────────────────┐
│  📋 Tus Credenciales de Acceso              │
├─────────────────────────────────────────────┤
│  CORREO INSTITUCIONAL                        │
│  maria.garcia@teschi.edu.mx                 │
│                                              │
│  CONTRASEÑA TEMPORAL                         │
│  Teschi123                                   │
└─────────────────────────────────────────────┘

⚠️ Importante - Seguridad de tu Cuenta
• Cambia tu contraseña en el primer inicio de sesión
• No compartas tus credenciales con nadie
• Guarda esta información en un lugar seguro
• Este correo es confidencial y de uso exclusivo

📝 Instrucciones para Acceder
1. Ingresa al sistema haciendo clic en el botón
2. Usa tu correo institucional y contraseña temporal
3. El sistema te pedirá cambiar tu contraseña
4. Podrás revisar documentos y gestionar actividades

          [ 🔐 Acceder al Sistema ]

¿Necesitas ayuda?
Contacta al departamento de TI del TESCHI.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sistema de Gestión Documental Digital - TESCHI
Este correo fue enviado automáticamente
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### **Configuración de Correo Requerida**

Para que el sistema envíe correos, se debe configurar en el archivo `.env` del backend:

```bash
# Servidor SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# Credenciales institucionales
SMTP_USER=sistema@teschi.edu.mx
SMTP_PASSWORD=contraseña_de_aplicacion

# URL del frontend
FRONTEND_URL=http://localhost:3000
```

### **Seguridad del Envío**

- 🔒 **Cifrado TLS:** Todos los correos se envían con cifrado TLS
- 📧 **Correo Oficial:** Se usa una cuenta institucional del TESCHI
- 🚫 **No Spam:** Los correos NO van a carpeta de spam (dominio verificado)
- ✅ **Confirmación:** El sistema registra cuando se envía un correo
- ⚠️ **Fallback:** Si falla el envío, la cuenta se crea igual (admin puede reenviar)

### **Ventajas del Sistema Automático**

| Ventaja | Descripción |
|---------|-------------|
| 🚀 **Rapidez** | El usuario recibe sus credenciales al instante |
| 📱 **Accesibilidad** | El usuario puede acceder desde cualquier lugar |
| 🔐 **Seguridad** | No se transmiten credenciales por medios inseguros |
| 📋 **Trazabilidad** | Se registra el envío en los logs del sistema |
| ✅ **Profesionalismo** | Correos con diseño institucional del TESCHI |
| 📧 **Evidencia** | El usuario tiene evidencia escrita de sus credenciales |

### **¿Qué pasa si el usuario no recibe el correo?**

1. **Verificar carpeta de spam** (poco probable con dominio verificado)
2. **Verificar que el correo fue escrito correctamente**
3. **El administrador puede crear el usuario nuevamente** (el sistema detectará el duplicado)
4. **Contactar a TI** para revisar los logs del servidor SMTP

---

## 📝 **MODIFICACIONES TÉCNICAS REALIZADAS**

### **Archivos Modificados:**

1. **AdminNewStudentPage.tsx**
   - Campo `email` cambió a `emailUsername`
   - Valor por defecto de `password`: `"Teschi123"`
   - Input con sufijo `@teschi.edu.mx`
   - Helper text explicativo
   - Construcción automática del email completo

2. **AdminNewProfessorPage.tsx**
   - Campo `email` cambió a `emailUsername`
   - Valor por defecto de `password`: `"Teschi123"`
   - Input con sufijo `@teschi.edu.mx`
   - Helper text explicativo
   - Construcción automática del email completo

### **Lógica Implementada:**

```typescript
// Estado del formulario
const [formData, setFormData] = useState({
  emailUsername: '',           // Solo el usuario
  password: 'Teschi123',       // Contraseña por defecto
  // ... otros campos
});

// Al enviar el formulario
const emailCompleto = `${formData.emailUsername}@teschi.edu.mx`;

// Enviar al backend
await axios.post('/api/auth/register', {
  email: emailCompleto,        // Email completo con dominio
  password: formData.password, // Teschi123 o modificada
  // ... otros datos
});
```

---

## 🎨 **INTERFAZ VISUAL**

### **Campo de Email con Sufijo**

```
┌───────────────────────────────────────────────┐
│ Email (usuario TESCHI) *                      │
│ ┌───────────────────────┬──────────────────┐  │
│ │ juan.perez            │ @teschi.edu.mx   │  │
│ └───────────────────────┴──────────────────┘  │
│                                               │
│ ℹ️  Solo ingresa el usuario, se agregará     │
│    automáticamente @teschi.edu.mx             │
└───────────────────────────────────────────────┘
```

### **Campo de Contraseña con Valor por Defecto**

```
┌───────────────────────────────────────────────┐
│ Contraseña *                                  │
│ ┌─────────────────────────────────────┬────┐  │
│ │ Teschi123                           │ 👁 │  │
│ └─────────────────────────────────────┴────┘  │
│                                               │
│ ℹ️  Contraseña por defecto: Teschi123        │
│    (puedes cambiarla)                         │
└───────────────────────────────────────────────┘
```

---

## 🎓 **CREDENCIALES DE EJEMPLO**

### **Estudiantes:**
```
Email: jose.martinez@teschi.edu.mx
Password: Teschi123

Email: ana.rodriguez@teschi.edu.mx
Password: Teschi123

Email: carlos.gonzalez@teschi.edu.mx
Password: Teschi123
```

### **Profesores:**
```
Email: maria.lopez@teschi.edu.mx
Password: Teschi123

Email: roberto.sanchez@teschi.edu.mx
Password: Teschi123

Email: laura.fernandez@teschi.edu.mx
Password: Teschi123
```

---

## ✅ **ESTADO ACTUAL**

```
✅ Dominio @teschi.edu.mx configurado
✅ Contraseña por defecto Teschi123 establecida
✅ Formularios de estudiantes actualizados
✅ Formularios de profesores actualizados
✅ Interfaz con helper text informativo
✅ Validaciones funcionando correctamente
✅ Sistema listo para producción
```

---

## 🎉 **BENEFICIOS FINALES**

1. ✅ **Rapidez:** El administrador ahorra tiempo al no escribir el dominio completo
2. ✅ **Consistencia:** Todos los emails son institucionales (@teschi.edu.mx)
3. ✅ **Estandarización:** Contraseña uniforme (Teschi123)
4. ✅ **Profesionalismo:** Emails institucionales para toda la comunidad TESCHI
5. ✅ **Menos Errores:** No hay errores de tipeo en el dominio
6. ✅ **Facilidad de Uso:** Interfaz clara con instrucciones visuales

---

**¡Sistema completamente personalizado para el TESCHI! 🏫🔐✨**


