# 🔒 Seguridad del Proyecto - Sistema Universitario

## Resumen Ejecutivo

El proyecto implementa múltiples capas de seguridad siguiendo las mejores prácticas de la industria para proteger datos sensibles, autenticación y prevenir ataques comunes.

---

## 🔐 Tipos de Encriptación y Cifrado

### 1. **Encriptación de Contraseñas**
- **Algoritmo**: `bcrypt` con salt rounds = 10
- **Ubicación**: `src/utils/crypto.ts`
- **Uso**: Todas las contraseñas de usuarios se almacenan hasheadas (nunca en texto plano)
- **Características**:
  - Salt automático generado por bcrypt
  - Resistente a ataques de fuerza bruta
  - Imposible de revertir (hash unidireccional)

```typescript
// Ejemplo de uso
const hashedPassword = await hashPassword("contraseña123");
// Resultado: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
```

### 2. **Encriptación de Datos Sensibles (AES-256-CBC)**
- **Algoritmo**: AES-256-CBC (Advanced Encryption Standard)
- **Tamaño de clave**: 256 bits (32 caracteres)
- **Vector de inicialización (IV)**: 16 bytes aleatorios por cada encriptación
- **Ubicación**: `src/utils/crypto.ts`
- **Uso**: Para encriptar datos sensibles que necesitan ser desencriptados posteriormente
- **Características**:
  - IV único por cada encriptación (mismo texto produce diferentes resultados)
  - Formato: `IV:datos_encriptados` (hexadecimal)
  - Requiere `ENCRYPTION_KEY` de 32 caracteres en variables de entorno

```typescript
// Ejemplo de uso
const encrypted = encrypt("dato sensible");
// Resultado: "a1b2c3d4e5f6...:f8e7d6c5b4a3..."
const decrypted = decrypt(encrypted);
// Resultado: "dato sensible"
```

### 3. **Hash de Archivos (SHA-256)**
- **Algoritmo**: SHA-256 (Secure Hash Algorithm)
- **Ubicación**: `src/utils/crypto.ts`
- **Uso**: Generar hash único de archivos para verificar integridad
- **Características**:
  - Hash unidireccional de 64 caracteres hexadecimales
  - Detecta cualquier modificación en el archivo
  - Usado para validar que los archivos no han sido alterados

```typescript
// Ejemplo de uso
const fileHash = generateFileHash(fileBuffer);
// Resultado: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
```

### 4. **Tokens JWT (JSON Web Tokens)**
- **Algoritmo**: HMAC-SHA256 (firmado con JWT_SECRET)
- **Ubicación**: `src/utils/jwt.ts`
- **Tipos de tokens**:
  - **Access Token**: Expira en 24 horas (configurable)
  - **Refresh Token**: Expira en 7 días (configurable)
- **Características**:
  - Firmado digitalmente con secreto JWT
  - Incluye: `userId`, `email`, `rol`
  - Validación de issuer y audience
  - Verificación de expiración automática

```typescript
// Estructura del payload JWT
{
  userId: "uuid",
  email: "usuario@teschi.edu.mx",
  rol: "ESTUDIANTE",
  iat: 1234567890,  // Issued at
  exp: 1234571490,  // Expiration
  iss: "sistema-universitario",
  aud: "api"
}
```

---

## 🛡️ Medidas de Seguridad Implementadas

### 1. **Autenticación y Autorización**

#### Middleware de Autenticación
- **Ubicación**: `src/middleware/auth.middleware.ts`
- **Funcionalidades**:
  - Verificación de tokens JWT en cada request
  - Extracción de token desde header `Authorization: Bearer <token>`
  - Validación de expiración y firma
  - Adjunta información del usuario a la request

#### Control de Acceso Basado en Roles (RBAC)
- **Roles disponibles**:
  - `SUPER_ADMIN`: Acceso completo al sistema
  - `ADMINISTRADOR`: Gestión de módulos y usuarios
  - `PERSONAL_ADMINISTRATIVO`: Operaciones administrativas
  - `ESTUDIANTE`: Acceso limitado a sus propios datos
- **Implementación**: Middleware `authorize()` que verifica roles antes de permitir acceso

### 2. **Protección contra Ataques Comunes**

#### Helmet.js
- **Protección**: Headers de seguridad HTTP
- **Incluye**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security` (HSTS)
  - Deshabilitación de `X-Powered-By`

#### Rate Limiting
- **Configuración**: `express-rate-limit`
- **Límites**:
  - Ventana: 15 minutos (900,000 ms)
  - Máximo de requests: 100 por ventana
  - Previene ataques DDoS y fuerza bruta

#### CORS (Cross-Origin Resource Sharing)
- **Configuración**: Solo permite orígenes específicos
- **Desarrollo**: `http://localhost:3000`, `http://localhost:4000`
- **Producción**: Configurable via `CORS_ORIGIN`
- **Credenciales**: Habilitadas para cookies/tokens

### 3. **Validación de Entrada**

#### Express Validator
- **Uso**: Validación de datos en todos los endpoints
- **Protección**: Previene inyección SQL, XSS, y datos malformados
- **Ejemplo**: Validación de emails, números, strings, etc.

#### Sanitización
- Limpieza automática de datos de entrada
- Escape de caracteres especiales
- Validación de tipos de datos

### 4. **Gestión de Sesiones y Tokens**

#### Refresh Token Rotation
- Los refresh tokens se renuevan en cada uso
- Previene reutilización de tokens comprometidos
- Almacenamiento seguro en base de datos

#### Timeout de Sesión
- **Configuración**: 30 minutos (1800 segundos)
- **Comportamiento**: El usuario debe reautenticarse después del timeout

#### Límite de Intentos de Login
- **Máximo**: 5 intentos fallidos
- **Bloqueo**: 15 minutos (900 segundos)
- **Protección**: Previene ataques de fuerza bruta

### 5. **Seguridad de Archivos**

#### Validación de Tipos de Archivo
- **Tipos permitidos**: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG
- **Validación**: Por extensión y MIME type
- **Tamaño máximo**: 10MB por defecto (configurable)

#### Hash de Integridad
- Cada archivo subido genera un hash SHA-256
- Permite verificar que el archivo no ha sido modificado
- Almacenado en base de datos junto con metadatos

#### Almacenamiento Seguro
- Archivos almacenados fuera del directorio web
- Rutas no predecibles
- Validación de permisos antes de servir archivos

### 6. **Seguridad de Base de Datos**

#### Prisma ORM
- **Protección**: Previene inyección SQL automáticamente
- **Prepared Statements**: Todas las queries usan parámetros preparados
- **Validación de tipos**: TypeScript + Prisma garantizan tipos correctos

#### Variables de Entorno
- **Secrets**: Nunca hardcodeados en el código
- **Validación**: Verificación de variables requeridas al iniciar
- **Separación**: Diferentes configuraciones para desarrollo/producción

---

## 🔑 Variables de Entorno Requeridas

### Seguridad Crítica
```env
# JWT Secret (mínimo 32 caracteres, recomendado 64+)
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui_cambiar_en_produccion

# Encryption Key (exactamente 32 caracteres)
ENCRYPTION_KEY=tu_clave_de_encriptacion_de_32_caracteres_aqui_cambiar

# Database URL (con credenciales)
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/db
```

### Configuración de Seguridad
```env
# Timeout de sesión (segundos)
SESSION_TIMEOUT=1800

# Intentos máximos de login
MAX_LOGIN_ATTEMPTS=5

# Duración de bloqueo (segundos)
LOCKOUT_DURATION=900

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 📋 Checklist de Seguridad

### ✅ Implementado
- [x] Encriptación de contraseñas con bcrypt
- [x] Encriptación AES-256-CBC para datos sensibles
- [x] Hash SHA-256 para integridad de archivos
- [x] Tokens JWT con expiración
- [x] Refresh token rotation
- [x] Rate limiting
- [x] Helmet.js para headers de seguridad
- [x] CORS configurado
- [x] Validación de entrada
- [x] Control de acceso basado en roles
- [x] Límite de intentos de login
- [x] Timeout de sesión
- [x] Protección contra inyección SQL (Prisma)
- [x] Validación de archivos

### ⚠️ Recomendaciones para Producción
- [ ] Implementar HTTPS/SSL
- [ ] Configurar firewall
- [ ] Habilitar logging de seguridad
- [ ] Implementar monitoreo de intrusiones
- [ ] Configurar backups encriptados
- [ ] Revisar y rotar secrets regularmente
- [ ] Implementar 2FA (autenticación de dos factores)
- [ ] Configurar WAF (Web Application Firewall)
- [ ] Auditoría de accesos
- [ ] Encriptación de base de datos en reposo

---

## 🔍 Auditoría y Monitoreo

### Logs de Seguridad
- Intentos de login fallidos
- Cambios de contraseña
- Accesos no autorizados
- Errores de validación
- Rate limiting activado

### Métricas Recomendadas
- Número de intentos de login fallidos por IP
- Tokens expirados vs renovados
- Archivos subidos vs validados
- Tiempo promedio de sesión
- Errores de autenticación

---

## 📚 Referencias y Estándares

- **OWASP Top 10**: Protección contra vulnerabilidades comunes
- **NIST**: Estándares de encriptación
- **RFC 7519**: Especificación JWT
- **bcrypt**: Algoritmo de hash recomendado para contraseñas
- **AES-256**: Estándar de encriptación simétrica

---

## 🚨 Incidentes de Seguridad

En caso de compromiso de seguridad:

1. **Inmediato**:
   - Rotar todos los secrets (JWT_SECRET, ENCRYPTION_KEY)
   - Invalidar todos los tokens activos
   - Revisar logs de acceso

2. **Corto plazo**:
   - Forzar cambio de contraseñas de usuarios afectados
   - Revisar integridad de archivos (usando hashes)
   - Auditar accesos recientes

3. **Largo plazo**:
   - Implementar medidas adicionales según el tipo de ataque
   - Actualizar documentación de seguridad
   - Capacitar al equipo

---

**Última actualización**: 2025-01-XX
**Versión del documento**: 1.0

