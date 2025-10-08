# 🐘 Guía de Instalación PostgreSQL para Sistema Universitario

## 📋 Aplicaciones a Instalar desde Stack Builder

### ✅ **APLICACIONES OBLIGATORIAS**

#### 1. pgAdmin 4
- **Categoría**: Database Drivers
- **Versión**: Más reciente disponible
- **Uso**: Interfaz gráfica principal para administración
- **Configuración**: Crear conexión a localhost:5432

#### 2. PostgreSQL ODBC Driver
- **Categoría**: Database Drivers
- **Versión**: ANSI/Unicode
- **Uso**: Conectividad ODBC para herramientas externas

#### 3. PostgreSQL JDBC Driver
- **Categoría**: Database Drivers
- **Versión**: Más reciente
- **Uso**: Conectividad Java para futuras integraciones

### ✅ **HERRAMIENTAS DE DESARROLLO**

#### 4. PostgreSQL Enterprise Manager
- **Categoría**: Management
- **Versión**: Community/Enterprise según licencia
- **Uso**: Monitoreo y administración avanzada

#### 5. pg_stat_statements Extension
- **Categoría**: Extensions
- **Versión**: Incluida en PostgreSQL
- **Uso**: Monitoreo de consultas SQL

### ✅ **SEGURIDAD**

#### 6. PostgreSQL SSL/TLS Support
- **Categoría**: Security
- **Versión**: Incluida en PostgreSQL
- **Uso**: Conexiones encriptadas

#### 7. PostgreSQL Audit Extension
- **Categoría**: Security
- **Versión**: pgaudit
- **Uso**: Auditoría de accesos y operaciones

### ✅ **EXTENSIONES ÚTILES**

#### 8. Full Text Search
- **Categoría**: Extensions
- **Versión**: Incluida en PostgreSQL
- **Uso**: Búsquedas avanzadas en texto

#### 9. JSON/JSONB Support
- **Categoría**: Extensions
- **Versión**: Incluida en PostgreSQL
- **Uso**: Almacenamiento de datos JSON

#### 10. UUID Extension
- **Categoría**: Extensions
- **Versión**: Incluida en PostgreSQL
- **Uso**: Generación de identificadores únicos

### ⚠️ **OPCIONALES (Según Necesidades)**

#### PostGIS
- **Categoría**: Extensions
- **Uso**: Datos geoespaciales (mapas, ubicaciones)
- **Instalar solo si**: Necesitas funcionalidad de mapas

#### TimescaleDB
- **Categoría**: Extensions
- **Uso**: Análisis de series temporales
- **Instalar solo si**: Necesitas análisis de métricas temporales

## 🚀 Configuración Post-Instalación

### 1. Configurar pgAdmin 4
```sql
-- Crear conexión a servidor local
Host: localhost
Port: 5432
Database: postgres
Username: postgres
Password: [tu_password]
```

### 2. Habilitar Extensiones
```sql
-- Conectarse a la base de datos y ejecutar:
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
```

### 3. Configurar SSL (Para Producción)
```sql
-- En postgresql.conf:
ssl = on
ssl_cert_file = 'server.crt'
ssl_key_file = 'server.key'
```

### 4. Configurar Auditoría
```sql
-- En postgresql.conf:
shared_preload_libraries = 'pgaudit'
pgaudit.log = 'all'
```

## 🔧 Herramientas Adicionales Recomendadas

### DBeaver (Alternativa a pgAdmin)
- **Descarga**: https://dbeaver.io/
- **Uso**: Cliente universal de bases de datos
- **Ventaja**: Soporte para múltiples bases de datos

### Navicat for PostgreSQL
- **Descarga**: https://www.navicat.com/
- **Uso**: Cliente comercial con más funcionalidades
- **Nota**: Versión de pago, pero muy completa

### DataGrip (JetBrains)
- **Descarga**: https://www.jetbrains.com/datagrip/
- **Uso**: IDE completo para bases de datos
- **Ventaja**: Integración con otros IDEs de JetBrains

## 📊 Configuración para el Sistema Universitario

### Parámetros Recomendados
```sql
-- En postgresql.conf para desarrollo:
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

### Usuarios y Roles
```sql
-- Crear usuario para la aplicación:
CREATE USER univ_app WITH PASSWORD 'secure_password';

-- Crear base de datos:
CREATE DATABASE sistema_universitario OWNER univ_app;

-- Otorgar permisos:
GRANT ALL PRIVILEGES ON DATABASE sistema_universitario TO univ_app;
```

## 🚨 Solución de Problemas Comunes

### Error de Conexión
```
psql: error: connection to server at "localhost" (127.0.0.1), port 5432 failed
```
**Solución**: Verificar que el servicio PostgreSQL esté ejecutándose

### Error de Autenticación
```
psql: error: FATAL: password authentication failed for user "postgres"
```
**Solución**: Verificar password o resetear con pgAdmin

### Puerto en Uso
```
FATAL: could not create any TCP/IP sockets
```
**Solución**: Cambiar puerto en postgresql.conf o liberar el puerto 5432

## 📞 Soporte

Para problemas específicos de PostgreSQL:
- **Documentación oficial**: https://www.postgresql.org/docs/
- **Stack Overflow**: https://stackoverflow.com/questions/tagged/postgresql
- **Comunidad**: https://www.postgresql.org/community/

---

**Nota**: Esta configuración está optimizada para el desarrollo del Sistema Universitario de Gestión Documental Digital.
