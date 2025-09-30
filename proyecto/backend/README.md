# Backend API - Sistema Universitario

API REST para la gestión de documentos universitarios (Node.js + TypeScript + SQL Server)

## 🚀 Inicio Rápido

```bash
cd backend
npm install
npm run dev
```

API disponible en: `http://localhost:4000`

## 📋 Prerrequisitos

- **Node.js 18+**
- **SQL Server 2019** Developer (instancia: SARFERT)
- **Base de datos:** `univ_docs` (creada con scripts SQL)

## ⚙️ Configuración

### Variables de Entorno

Archivo `.env` en la raíz del backend:

```env
PORT=4000
JWT_SECRET=dev_secret_cambia_esto
SQL_SERVER=SARFERT
SQL_DATABASE=univ_docs
SQL_PORT=1433
```

### Autenticación SQL Server (Opcional)

```env
SQL_AUTH=sql
SQL_USER=sa
SQL_PASSWORD=TuContraseñaSegura
```

## 📡 Endpoints de la API

### Salud del Sistema
- `GET /health` - Verificar estado del servidor
- `GET /` - Información de endpoints disponibles

### Autenticación (`/auth`)
- `POST /auth/register` - Registrar nuevo alumno
- `POST /auth/login` - Iniciar sesión (devuelve roles y tipo)
- `POST /auth/refresh` - Renovar token de acceso
- `GET /auth/me` - Obtener perfil del usuario autenticado

### Catálogos (`/catalogos`)
- `GET /catalogos/programas` - Listar programas académicos

### Alumnos (`/alumnos`) 🔐 Requiere autenticación
- `GET /alumnos` - Listar todos los alumnos
- `GET /alumnos/buscar?q=texto` - Buscar alumnos
- `GET /alumnos/:id` - Detalle de un alumno
- `GET /alumnos/:id/tramites` - Trámites del alumno
- `PATCH /alumnos/:id` - Actualizar alumno
- `GET /alumnos/stats/general` - Estadísticas generales

## 🔑 Autenticación

La API usa **JWT (JSON Web Tokens)** para autenticación.

### Login Response
```json
{
  "token": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "usuario": {
    "id": 1,
    "correo": "alumno@uni.mx",
    "nombre": "Juan",
    "apellidos": "Pérez",
    "roles": ["Alumno"],
    "tipo": "alumno"
  }
}
```

El campo `tipo` puede ser:
- `alumno` - Estudiante
- `docente` - Profesor o administrativo
- `admin` - Administrador del sistema

### Usar el Token

Incluye el token en el header de las peticiones protegidas:

```
Authorization: Bearer <tu_token_aqui>
```

## 🧪 Pruebas con cURL

### Verificar salud
```bash
curl http://localhost:4000/health
```

### Registrar alumno
```powershell
curl -X POST http://localhost:4000/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"correo\":\"alumno1@uni.mx\",\"contrasena\":\"Secreta123!\",\"nombre\":\"Ana\",\"apellidos\":\"García\",\"matricula\":\"A0001\",\"programaId\":1,\"semestre\":1}'
```

### Iniciar sesión
```powershell
curl -X POST http://localhost:4000/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"correo\":\"alumno@uni.mx\",\"contrasena\":\"Alumno123!\"}'
```

### Obtener alumnos (requiere token)
```powershell
curl http://localhost:4000/alumnos `
  -H "Authorization: Bearer <TU_TOKEN>"
```

## 🗄️ Base de Datos

### Scripts de Instalación (en orden)

1. `../SQL/univ_docs_mvp.sql` - Crear base de datos y tablas
2. `../SQL/seed_basico.sql` - Datos básicos (departamentos, programas)
3. `../SQL/seed_usuarios_prueba.sql` - Usuarios de prueba

### Usuarios de Prueba

| Email | Contraseña | Rol | Tipo |
|-------|-----------|-----|------|
| alumno@uni.mx | Alumno123! | Alumno | `alumno` |
| admin@uni.mx | Admin123! | Administrador | `admin` |
| docente@uni.mx | Docente123! | Docente | `docente` |

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── server.ts          # Servidor Express principal
│   └── tiers/
│       ├── db.ts          # Conexión a SQL Server
│       ├── auth.routes.ts # Rutas de autenticación
│       ├── catalogos.routes.ts # Catálogos
│       └── alumnos.routes.ts   # Gestión de alumnos
├── scripts/
│   └── generar-usuarios.js # Generar hashes bcrypt
├── package.json
├── tsconfig.json
└── .env
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Modo desarrollo (hot reload con tsx)
- `npm run build` - Compilar TypeScript
- `npm start` - Ejecutar versión compilada

## 🔒 Seguridad

- **Contraseñas:** Hasheadas con bcrypt (10 rounds)
- **JWT:** Tokens con expiración (1h access, 7d refresh)
- **SQL:** Consultas parametrizadas (prevención de inyección SQL)
- **Validación:** Esquemas Zod para validar entrada de datos
- **CORS:** Habilitado para desarrollo

## 🐛 Solución de Problemas

### Error de conexión a SQL Server
```
Error: Failed to connect to SARFERT:1433
```
**Solución:**
1. Verifica que SQL Server esté corriendo
2. Habilita TCP/IP en SQL Server Configuration Manager
3. Verifica el nombre de la instancia en `.env`

### Error de autenticación SQL
```
Login failed for user
```
**Solución:**
- Usa Windows Authentication (por defecto)
- O configura SQL Auth correctamente en `.env`

### Puerto 4000 en uso
**Solución:**
- Cambia `PORT=4000` en `.env` a otro puerto disponible

## 📚 Documentación Adicional

- [API de Autenticación](../docs/api-auth.md)
- [Vista de Alumnos](../docs/vista-alumnos.md)
- [Base de Datos](../docs/db.md)
- [Instrucciones de Instalación](../INSTRUCCIONES_INSTALACION.md)

## 🚀 Desarrollo

Para agregar nuevas rutas:

1. Crea un archivo en `src/tiers/` (ej: `tramites.routes.ts`)
2. Define tus rutas con Express Router
3. Importa y registra en `server.ts`
4. Documenta los endpoints

Ejemplo:
```typescript
import { Router } from 'express';
export const tramitesRouter = Router();

tramitesRouter.get('/', async (req, res) => {
  // Tu lógica aquí
});
```

---

**Versión:** 1.0 MVP  
**Última actualización:** Septiembre 2025


