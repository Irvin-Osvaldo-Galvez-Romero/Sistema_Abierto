# 🔐 API de Autenticación - Sistema Universitario

## 📋 Endpoints Disponibles

Base URL: `http://localhost:3001/api/auth`

### 1. **Registrar Usuario**

**Endpoint:** `POST /api/auth/register`  
**Acceso:** Público  
**Descripción:** Registra un nuevo usuario en el sistema

**Request Body:**
```json
{
  "email": "estudiante@universidad.edu.mx",
  "password": "Password123",
  "nombre": "Juan",
  "apellidoPaterno": "Pérez",
  "apellidoMaterno": "García",
  "telefono": "5512345678",
  "rol": "ESTUDIANTE"
}
```

**Validaciones:**
- Email: Debe ser válido
- Password: Mínimo 8 caracteres, con mayúscula, minúscula y número
- Nombre: Mínimo 2 caracteres, máximo 100
- Apellido Paterno: Requerido, mínimo 2 caracteres
- Apellido Materno: Opcional
- Teléfono: Opcional, 10 dígitos
- Rol: ESTUDIANTE, PROFESOR, ADMINISTRADOR, SUPER_ADMIN, PERSONAL_ADMINISTRATIVO

**Response (201):**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "uuid",
      "email": "estudiante@universidad.edu.mx",
      "nombre": "Juan Pérez",
      "rol": "ESTUDIANTE"
    },
    "tokens": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci..."
    }
  }
}
```

**Errores:**
- `409 Conflict`: Email ya registrado
- `400 Bad Request`: Datos de validación incorrectos

---

### 2. **Iniciar Sesión**

**Endpoint:** `POST /api/auth/login`  
**Acceso:** Público  
**Descripción:** Autentica un usuario y genera tokens JWT

**Request Body:**
```json
{
  "email": "estudiante@universidad.edu.mx",
  "password": "Password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Inicio de sesión exitoso",
  "data": {
    "user": {
      "id": "uuid",
      "email": "estudiante@universidad.edu.mx",
      "nombre": "Juan Pérez",
      "rol": "ESTUDIANTE"
    },
    "tokens": {
      "accessToken": "eyJhbGci...",
      "refreshToken": "eyJhbGci..."
    }
  }
}
```

**Errores:**
- `401 Unauthorized`: Credenciales inválidas
- `401 Unauthorized`: Cuenta desactivada
- `429 Too Many Requests`: Cuenta bloqueada por múltiples intentos

**Seguridad:**
- Después de 5 intentos fallidos, la cuenta se bloquea por 15 minutos
- Se registra la IP y User-Agent de cada inicio de sesión

---

### 3. **Renovar Token**

**Endpoint:** `POST /api/auth/refresh`  
**Acceso:** Público  
**Descripción:** Genera un nuevo access token usando el refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token renovado exitosamente",
  "data": {
    "accessToken": "eyJhbGci..."
  }
}
```

**Errores:**
- `401 Unauthorized`: Token inválido
- `401 Unauthorized`: Token revocado
- `401 Unauthorized`: Token expirado

---

### 4. **Cerrar Sesión**

**Endpoint:** `POST /api/auth/logout`  
**Acceso:** Público  
**Descripción:** Revoca el refresh token y cierra la sesión

**Request Body:**
```json
{
  "refreshToken": "eyJhbGci..."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Sesión cerrada exitosamente"
}
```

---

### 5. **Obtener Perfil Completo**

**Endpoint:** `GET /api/auth/profile`  
**Acceso:** Privado (requiere autenticación)  
**Descripción:** Obtiene el perfil completo del usuario autenticado

**Headers:**
```
Authorization: Bearer eyJhbGci...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "estudiante@universidad.edu.mx",
    "nombre": "Juan",
    "apellidoPaterno": "Pérez",
    "apellidoMaterno": "García",
    "telefono": "5512345678",
    "rol": "ESTUDIANTE",
    "activo": true,
    "emailVerificado": false,
    "ultimoAcceso": "2024-10-01T00:00:00.000Z",
    "createdAt": "2024-10-01T00:00:00.000Z",
    "updatedAt": "2024-10-01T00:00:00.000Z",
    "estudiante": {
      "id": "uuid",
      "matricula": "2024001",
      ...
    }
  }
}
```

**Errores:**
- `401 Unauthorized`: Token no proporcionado o inválido

---

### 6. **Obtener Información Básica**

**Endpoint:** `GET /api/auth/me`  
**Acceso:** Privado (requiere autenticación)  
**Descripción:** Obtiene la información básica del token JWT

**Headers:**
```
Authorization: Bearer eyJhbGci...
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "estudiante@universidad.edu.mx",
    "rol": "ESTUDIANTE",
    "iat": 1759300789,
    "exp": 1759387189,
    "aud": "api",
    "iss": "sistema-universitario"
  }
}
```

---

## 🧪 Ejemplos de Uso con cURL

### Registrar un nuevo usuario:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@universidad.edu.mx",
    "password": "Admin123!",
    "nombre": "María",
    "apellidoPaterno": "González",
    "apellidoMaterno": "López",
    "telefono": "5512345678",
    "rol": "ADMINISTRADOR"
  }'
```

### Iniciar sesión:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "estudiante@universidad.edu.mx",
    "password": "Password123"
  }'
```

### Obtener perfil (con token):
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer TU_ACCESS_TOKEN"
```

### Renovar token:
```bash
curl -X POST http://localhost:3001/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "TU_REFRESH_TOKEN"
  }'
```

### Cerrar sesión:
```bash
curl -X POST http://localhost:3001/api/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "TU_REFRESH_TOKEN"
  }'
```

---

## 🔒 Seguridad Implementada

### Tokens JWT
- **Access Token**: Expira en 24 horas
- **Refresh Token**: Expira en 7 días
- Almacenados en base de datos con información de sesión
- Posibilidad de revocar tokens

### Protección contra Ataques
- ✅ **Brute Force**: Máximo 5 intentos fallidos
- ✅ **Account Lockout**: Bloqueo por 15 minutos después de 5 intentos
- ✅ **Password Hashing**: bcrypt con salt
- ✅ **Rate Limiting**: 100 requests por 15 minutos
- ✅ **Auditoría**: Registro de todas las actividades

### Headers de Seguridad
- Helmet configurado
- CORS habilitado solo para orígenes permitidos
- Rate limiting en todas las rutas

---

## 📊 Auditoría y Logs

Todas las operaciones se registran en:
- **Base de datos**: Tabla `actividades_usuario`
- **Logs**: Archivo `logs/app.log`

Información registrada:
- Acción realizada
- Usuario que la realizó
- IP Address
- User Agent
- Timestamp

---

## 🧪 Testing

### Probar con Postman:
1. Importa la colección de Postman (próximamente)
2. Configura el environment con la URL base
3. Ejecuta las pruebas

### Probar con REST Client (VS Code):
Crea un archivo `test.http`:

```http
### Registrar usuario
POST http://localhost:3001/api/auth/register
Content-Type: application/json

{
  "email": "test@universidad.edu.mx",
  "password": "Test123!",
  "nombre": "Test",
  "apellidoPaterno": "Usuario"
}

### Login
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "test@universidad.edu.mx",
  "password": "Test123!"
}

### Obtener perfil
GET http://localhost:3001/api/auth/me
Authorization: Bearer {{accessToken}}
```

---

## 📞 Próximos Endpoints

Próximamente se agregarán:
- `POST /api/auth/forgot-password` - Recuperar contraseña
- `POST /api/auth/reset-password` - Resetear contraseña
- `POST /api/auth/verify-email` - Verificar email
- `POST /api/auth/resend-verification` - Reenviar verificación
- `PUT /api/auth/change-password` - Cambiar contraseña

---

**Estado:** ✅ Completamente funcional  
**Versión:** 1.0.0  
**Última actualización:** Octubre 2024

