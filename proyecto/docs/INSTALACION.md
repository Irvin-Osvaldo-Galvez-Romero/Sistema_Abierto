# 🚀 Guía de Instalación del Sistema Universitario

## 📋 Prerrequisitos

### Software Requerido
- **Docker**: Versión 20.10 o superior
- **Docker Compose**: Versión 2.0 o superior
- **Node.js**: Versión 18 o superior (para desarrollo)
- **Git**: Para clonar el repositorio

### Hardware Mínimo
- **RAM**: 8GB mínimo, 16GB recomendado
- **Almacenamiento**: 50GB de espacio libre
- **CPU**: 4 cores mínimo
- **Red**: Conexión estable a internet

## 🛠️ Instalación Paso a Paso

### 1. Clonar el Repositorio
```bash
git clone https://github.com/universidad/sistema-universitario.git
cd sistema-universitario/proyecto
```

### 2. Configurar Variables de Entorno
```bash
# Copiar el archivo de ejemplo
cp docker/env.example docker/.env

# Editar las variables según tu configuración
nano docker/.env
```

### 3. Configuración de Variables Críticas
```bash
# Generar claves seguras
DB_PASSWORD=$(openssl rand -base64 32)
REDIS_PASSWORD=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 64)
ENCRYPTION_KEY=$(openssl rand -base64 32)
MINIO_ACCESS_KEY=$(openssl rand -base64 16)
MINIO_SECRET_KEY=$(openssl rand -base64 32)
GRAFANA_PASSWORD=$(openssl rand -base64 16)
```

### 4. Configurar SSL/TLS (Opcional pero Recomendado)
```bash
# Crear directorio para certificados
mkdir -p docker/ssl

# Generar certificado autofirmado (solo para desarrollo)
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout docker/ssl/key.pem \
  -out docker/ssl/cert.pem \
  -subj "/C=MX/ST=Estado/L=Ciudad/O=Universidad/CN=localhost"
```

### 5. Construir y Ejecutar los Contenedores
```bash
# Construir todas las imágenes
docker-compose -f docker/docker-compose.yml build

# Ejecutar en modo desarrollo
docker-compose -f docker/docker-compose.yml up -d

# Ver logs en tiempo real
docker-compose -f docker/docker-compose.yml logs -f
```

### 6. Verificar la Instalación
```bash
# Verificar que todos los contenedores estén ejecutándose
docker-compose -f docker/docker-compose.yml ps

# Verificar conectividad
curl http://localhost:3000  # Frontend
curl http://localhost:3001/api/health  # Backend API
```

## 🔧 Configuración Post-Instalación

### 1. Inicializar la Base de Datos
```bash
# Ejecutar migraciones
docker-compose -f docker/docker-compose.yml exec backend npm run migrate

# Cargar datos iniciales
docker-compose -f docker/docker-compose.yml exec backend npm run seed
```

### 2. Configurar Usuario Administrador
```bash
# Crear usuario administrador
docker-compose -f docker/docker-compose.yml exec backend npm run create-admin
```

### 3. Configurar MinIO
1. Acceder a http://localhost:9001
2. Usar las credenciales de MINIO_ACCESS_KEY y MINIO_SECRET_KEY
3. Crear bucket 'documents'
4. Configurar políticas de acceso

## 🌐 Acceso a los Servicios

| Servicio | URL | Descripción |
|----------|-----|-------------|
| Frontend | http://localhost:3000 | Interfaz principal |
| Backend API | http://localhost:3001 | API REST |
| MinIO Console | http://localhost:9001 | Gestión de archivos |
| Grafana | http://localhost:3001 | Monitoreo |
| Kibana | http://localhost:5601 | Logs y análisis |
| Prometheus | http://localhost:9090 | Métricas |

## 🚀 Desarrollo Local

### Configuración para Desarrollo
```bash
# Clonar repositorio
git clone https://github.com/universidad/sistema-universitario.git
cd sistema-universitario/proyecto

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install

# Configurar variables de desarrollo
cp .env.development .env
```

### Ejecutar en Modo Desarrollo
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - Base de datos (Docker)
docker-compose -f docker/docker-compose.yml up postgres redis
```

## 🐳 Comandos Docker Útiles

### Gestión de Contenedores
```bash
# Ver estado de contenedores
docker-compose -f docker/docker-compose.yml ps

# Reiniciar un servicio específico
docker-compose -f docker/docker-compose.yml restart backend

# Ver logs de un servicio
docker-compose -f docker/docker-compose.yml logs -f backend

# Ejecutar comandos en contenedores
docker-compose -f docker/docker-compose.yml exec backend bash
docker-compose -f docker/docker-compose.yml exec postgres psql -U univ_admin -d sistema_universitario
```

### Backup y Restauración
```bash
# Backup de base de datos
docker-compose -f docker/docker-compose.yml exec postgres pg_dump -U univ_admin sistema_universitario > backup.sql

# Restaurar base de datos
docker-compose -f docker/docker-compose.yml exec -T postgres psql -U univ_admin -d sistema_universitario < backup.sql
```

### Limpieza
```bash
# Detener todos los servicios
docker-compose -f docker/docker-compose.yml down

# Eliminar volúmenes (CUIDADO: Esto elimina todos los datos)
docker-compose -f docker/docker-compose.yml down -v

# Limpiar imágenes no utilizadas
docker system prune -a
```

## 🔍 Solución de Problemas

### Problemas Comunes

#### Puerto ya en uso
```bash
# Verificar qué proceso está usando el puerto
netstat -tulpn | grep :3000

# Matar el proceso
kill -9 <PID>
```

#### Problemas de permisos en Docker
```bash
# Agregar usuario al grupo docker
sudo usermod -aG docker $USER
newgrp docker
```

#### Error de conexión a base de datos
```bash
# Verificar que PostgreSQL esté ejecutándose
docker-compose -f docker/docker-compose.yml logs postgres

# Verificar variables de entorno
docker-compose -f docker/docker-compose.yml config
```

#### Problemas de memoria
```bash
# Verificar uso de recursos
docker stats

# Ajustar límites en docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 1G
```

### Logs de Diagnóstico
```bash
# Ver todos los logs
docker-compose -f docker/docker-compose.yml logs

# Logs específicos por servicio
docker-compose -f docker/docker-compose.yml logs backend
docker-compose -f docker/docker-compose.yml logs postgres
docker-compose -f docker/docker-compose.yml logs nginx
```

## 📊 Monitoreo y Mantenimiento

### Health Checks
```bash
# Verificar salud de la aplicación
curl http://localhost:3001/api/health

# Verificar métricas de Prometheus
curl http://localhost:9090/metrics
```

### Actualizaciones
```bash
# Actualizar imágenes
docker-compose -f docker/docker-compose.yml pull

# Reconstruir y reiniciar
docker-compose -f docker/docker-compose.yml up -d --build
```

### Backup Automático
```bash
# Script de backup diario (agregar a crontab)
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose -f /path/to/docker-compose.yml exec -T postgres pg_dump -U univ_admin sistema_universitario > /backups/backup_$DATE.sql
```

## 📞 Soporte

### Recursos de Ayuda
- **Documentación**: https://docs.universidad.edu.mx
- **Issues**: https://github.com/universidad/sistema-universitario/issues
- **Email**: soporte@universidad.edu.mx
- **Chat**: https://chat.universidad.edu.mx

### Información del Sistema
```bash
# Versión del sistema
curl http://localhost:3001/api/version

# Información del entorno
docker-compose -f docker/docker-compose.yml config
```

---

## ✅ Checklist de Instalación

- [ ] Docker y Docker Compose instalados
- [ ] Repositorio clonado
- [ ] Variables de entorno configuradas
- [ ] Contenedores construidos y ejecutándose
- [ ] Base de datos inicializada
- [ ] Usuario administrador creado
- [ ] MinIO configurado
- [ ] SSL/TLS configurado (opcional)
- [ ] Monitoreo funcionando
- [ ] Backup configurado

**¡Instalación completada exitosamente!** 🎉
