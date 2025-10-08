# 🚀 Backend - Sistema Universitario

API REST para el Sistema Universitario de Gestión Documental Digital

## 📋 Características

- ✅ **TypeScript** para tipado estático
- ✅ **Express** como framework web
- ✅ **Prisma ORM** para base de datos
- ✅ **JWT** para autenticación
- ✅ **PostgreSQL** como base de datos
- ✅ **Redis** para caché y sesiones
- ✅ **Winston** para logging
- ✅ **Joi** para validación
- ✅ **Docker** para contenedores

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+
- Docker Desktop
- PostgreSQL (o usar Docker)

### Pasos

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
cp env.example .env
# Editar .env con tus configuraciones
```

3. **Iniciar servicios Docker:**
```bash
cd ..
docker-compose -f docker-compose.dev.yml up -d
```

4. **Generar cliente Prisma:**
```bash
npx prisma generate
```

5. **Sincronizar base de datos:**
```bash
npx prisma db push
```

## 🚀 Uso

### Modo Desarrollo
```bash
npm run dev
```
El servidor se iniciará en `http://localhost:3001` con hot reload.

### Modo Producción
```bash
npm run build
npm start
```

### Ver Base de Datos
```bash
npx prisma studio
```
Se abrirá en `http://localhost:5555`

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── config/           # Configuraciones
│   │   ├── database.ts   # Prisma client
│   │   └── env.ts        # Variables de entorno
│   ├── controllers/      # Controladores HTTP
│   │   └── auth.controller.ts
│   ├── middleware/       # Middleware personalizados
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   ├── routes/           # Definición de rutas
│   │   └── auth.routes.ts
│   ├── services/         # Lógica de negocio
│   │   └── auth.service.ts
│   ├── utils/            # Utilidades
│   │   ├── crypto.ts     # Funciones de criptografía
│   │   ├── jwt.ts        # Manejo de JWT
│   │   ├── logger.ts     # Winston logger
│   │   └── errors.ts     # Clases de errores
│   ├── validators/       # Esquemas de validación
│   │   └── auth.validators.ts
│   ├── types/            # Tipos TypeScript
│   ├── app.ts            # Aplicación Express
│   └── server.ts         # Punto de entrada
├── prisma/
│   └── schema.prisma     # Esquema de base de datos
├── logs/                 # Logs de aplicación
├── uploads/              # Archivos subidos
└── dist/                 # Código compilado
```

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar token
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Obtener perfil (protegido)
- `GET /api/auth/me` - Información básica (protegido)

### Health Checks
- `GET /health` - Estado del servidor
- `GET /api/health` - Estado de la API

Ver [documentación completa](../docs/API_AUTENTICACION.md)

## 🧪 Testing

### Ejecutar pruebas
```bash
npm test
```

### Cobertura de pruebas
```bash
npm run test:coverage
```

### Linting
```bash
npm run lint
npm run lint:fix
```

### Formateo
```bash
npm run format
```

## 📊 Modelos de Base de Datos

- **Usuario** - Autenticación y datos base
- **Estudiante** - Información académica
- **Profesor** - Datos de profesores
- **Administrador** - Personal administrativo
- **Carrera** - Programas educativos
- **Materia** - Asignaturas
- **Grupo** - Grupos de clases
- **Inscripcion** - Inscripciones de estudiantes
- **Calificacion** - Calificaciones
- **Documento** - Gestión documental
- **Pago** - Pagos y finanzas
- **TokenSesion** - Tokens de sesión
- **ActividadUsuario** - Auditoría

## 🔐 Seguridad

### Implementado:
- ✅ JWT para autenticación
- ✅ bcrypt para hash de contraseñas
- ✅ Helmet para headers de seguridad
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Validación de datos
- ✅ Logs de auditoría
- ✅ Bloqueo de cuenta por intentos fallidos

### Variables de Seguridad:
- `JWT_SECRET`: Clave secreta para JWT
- `ENCRYPTION_KEY`: Clave para encriptación de datos
- `MAX_LOGIN_ATTEMPTS`: Máximo de intentos (default: 5)
- `LOCKOUT_DURATION`: Duración de bloqueo en segundos (default: 900 = 15 min)

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Desarrollo con hot reload |
| `npm run build` | Compilar TypeScript |
| `npm start` | Iniciar servidor de producción |
| `npm test` | Ejecutar pruebas |
| `npm run lint` | Verificar código |
| `npm run format` | Formatear código |

## 🐳 Docker

### Comandos útiles:
```bash
# Ver contenedores
docker ps

# Ver logs
docker logs univ_postgres_dev
docker logs univ_redis_dev

# Conectar a PostgreSQL
docker exec -it univ_postgres_dev psql -U univ_app -d sistema_universitario

# Conectar a Redis
docker exec -it univ_redis_dev redis-cli
```

## 📞 Soporte

Ver documentación en:
- [Guía de Instalación](../docs/INSTALACION.md)
- [API de Autenticación](../docs/API_AUTENTICACION.md)
- [Seguridad](../docs/SEGURIDAD.md)
- [Normas](../docs/NORMAS.md)

---

**Versión:** 1.0.0  
**Estado:** ✅ Funcional  
**Última actualización:** Octubre 2024

