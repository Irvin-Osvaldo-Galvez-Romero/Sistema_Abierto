# 🐳 Guía de Instalación de Docker Desktop

## 📋 ¿Qué es Docker y por qué lo necesitamos?

Docker nos permite:
- ✅ Tener un ambiente consistente en todos los equipos
- ✅ No instalar servicios directamente en tu computadora
- ✅ Levantar y bajar servicios fácilmente
- ✅ Aislar aplicaciones y sus dependencias
- ✅ Replicar el ambiente de producción en desarrollo

## 🚀 PASO 1: Descargar Docker Desktop

### Requisitos del Sistema (Windows)
- **Windows 10 64-bit**: Pro, Enterprise, o Education (Build 19041 o superior)
- **Windows 11**: 64-bit
- **WSL 2** habilitado (Docker lo instalará automáticamente)
- **Virtualización** habilitada en BIOS

### Descarga
1. Ve a: **https://www.docker.com/products/docker-desktop/**
2. Haz clic en **"Download for Windows"**
3. Espera a que descargue el instalador (aproximadamente 500 MB)

## 🛠️ PASO 2: Instalar Docker Desktop

### Instalación
1. **Ejecuta el instalador** `Docker Desktop Installer.exe`
2. **Acepta** los términos de servicio
3. **Configuración recomendada**:
   - ✅ Use WSL 2 instead of Hyper-V (recomendado)
   - ✅ Add shortcut to desktop
4. Haz clic en **"Ok"**
5. Espera a que se instale (puede tomar 5-10 minutos)

### Después de la Instalación
1. **Reinicia tu computadora** (obligatorio)
2. **Abre Docker Desktop** desde el menú inicio
3. **Acepta** el Service Agreement
4. **Opcionalmente** crea una cuenta de Docker Hub (no es obligatorio)
5. **Espera** a que Docker Desktop se inicie completamente
   - Verás el logo de Docker en la barra de tareas
   - Cuando esté listo, el ícono dejará de parpadear

## ✅ PASO 3: Verificar Instalación

### Verificación Básica
Abre PowerShell o Command Prompt y ejecuta:

```bash
# Verificar versión de Docker
docker --version

# Verificar versión de Docker Compose
docker-compose --version

# Verificar que Docker está corriendo
docker ps
```

### Resultados Esperados
```
Docker version 24.0.x, build xxxxx
Docker Compose version v2.x.x
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

### Prueba de Funcionamiento
```bash
# Ejecutar contenedor de prueba
docker run hello-world
```

Deberías ver:
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

## 🔧 PASO 4: Configuración Recomendada

### Ajustar Recursos
1. Abre **Docker Desktop**
2. Ve a **Settings** (⚙️) → **Resources**
3. Configura:
   - **CPUs**: 4 (o la mitad de tus cores)
   - **Memory**: 4 GB (mínimo), 8 GB (recomendado)
   - **Swap**: 1 GB
   - **Disk image size**: 60 GB

### Habilitar Kubernetes (Opcional)
1. Ve a **Settings** → **Kubernetes**
2. ✅ Enable Kubernetes (si lo necesitas en el futuro)

## 🚨 Solución de Problemas Comunes

### Error: "WSL 2 installation is incomplete"
**Solución**:
1. Abre PowerShell como administrador
2. Ejecuta: `wsl --install`
3. Reinicia tu computadora
4. Abre Docker Desktop de nuevo

### Error: "Hardware assisted virtualization and data execution protection must be enabled in the BIOS"
**Solución**:
1. Reinicia tu computadora
2. Entra al BIOS (generalmente F2, F10, o DEL durante el arranque)
3. Busca "Virtualization Technology" o "Intel VT-x" o "AMD-V"
4. Habilítalo
5. Guarda y reinicia

### Error: "Docker Desktop starting..." (se queda pegado)
**Solución**:
1. Cierra Docker Desktop completamente
2. Abre PowerShell como administrador
3. Ejecuta: `wsl --shutdown`
4. Abre Docker Desktop de nuevo

### Docker es muy lento
**Solución**:
1. Asegúrate de tener WSL 2 habilitado
2. Aumenta recursos en Settings → Resources
3. Excluye la carpeta de Docker de tu antivirus

## 📚 Comandos Útiles de Docker

### Gestión de Contenedores
```bash
# Ver contenedores en ejecución
docker ps

# Ver todos los contenedores (incluidos los detenidos)
docker ps -a

# Detener un contenedor
docker stop <container_id>

# Eliminar un contenedor
docker rm <container_id>

# Ver logs de un contenedor
docker logs <container_id>

# Entrar a un contenedor
docker exec -it <container_id> bash
```

### Gestión de Imágenes
```bash
# Ver imágenes descargadas
docker images

# Descargar una imagen
docker pull <image_name>

# Eliminar una imagen
docker rmi <image_id>

# Limpiar imágenes no utilizadas
docker image prune
```

### Gestión de Volúmenes
```bash
# Ver volúmenes
docker volume ls

# Crear un volumen
docker volume create <volume_name>

# Eliminar un volumen
docker volume rm <volume_name>

# Limpiar volúmenes no utilizados
docker volume prune
```

### Limpieza General
```bash
# Limpiar todo lo no utilizado (contenedores, imágenes, volúmenes, redes)
docker system prune -a

# Ver espacio usado por Docker
docker system df
```

## 🎯 Próximos Pasos

Una vez que Docker Desktop esté instalado y funcionando:

1. ✅ Verificar que `docker --version` funciona
2. ✅ Verificar que `docker-compose --version` funciona
3. ✅ Ejecutar `docker run hello-world` exitosamente
4. 🚀 Configurar docker-compose.yml para el proyecto
5. 🚀 Crear Dockerfiles para backend y frontend
6. 🚀 Levantar los servicios del proyecto

---

## 📞 Recursos Adicionales

- **Documentación oficial**: https://docs.docker.com/
- **Docker Hub**: https://hub.docker.com/
- **Tutoriales**: https://www.docker.com/101-tutorial/

---

**¡Docker Desktop listo!** Ahora podemos crear contenedores para PostgreSQL, Redis, y nuestras aplicaciones. 🎉
