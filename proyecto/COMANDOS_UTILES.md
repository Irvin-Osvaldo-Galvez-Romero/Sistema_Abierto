# 🛠️ Comandos Útiles - Sistema Universitario

## 🚀 INICIAR EL SISTEMA

### **Paso 1: Iniciar Docker (Servicios)**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto
docker-compose -f docker-compose.dev.yml up -d
```

### **Paso 2: Iniciar Backend**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
node dist/server.js
```
**Nota:** El servidor se ejecutará en primer plano y mostrará logs.

### **Paso 3: Iniciar Frontend (Nueva Terminal)**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\frontend
npm start
```

---

## 🛑 DETENER EL SISTEMA

### **Detener Backend:**
```powershell
# Presiona Ctrl + C en la terminal donde está corriendo
# O mata todos los procesos Node.js:
Stop-Process -Name "node" -Force
```

### **Detener Frontend:**
```powershell
# Presiona Ctrl + C en la terminal donde está corriendo
```

### **Detener Docker:**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto
docker-compose -f docker-compose.dev.yml down
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### **Error: Puerto 3001 en uso**
```powershell
# Matar todos los procesos Node.js
Stop-Process -Name "node" -Force

# Esperar 2 segundos
Start-Sleep -Seconds 2

# Reiniciar backend
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
node dist/server.js
```

### **Error: Puerto 3000 en uso**
```powershell
# Matar procesos Node.js
Stop-Process -Name "node" -Force

# Reiniciar frontend
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\frontend
npm start
```

### **Ver qué está usando un puerto:**
```powershell
# Ver procesos en puerto 3001
netstat -ano | findstr :3001

# Ver procesos en puerto 3000
netstat -ano | findstr :3000
```

### **Matar proceso específico por PID:**
```powershell
# Reemplaza <PID> con el número del proceso
Stop-Process -Id <PID> -Force
```

---

## 🐳 COMANDOS DOCKER

### **Ver contenedores activos:**
```powershell
docker ps
```

### **Ver logs de un contenedor:**
```powershell
# PostgreSQL
docker logs univ_postgres_dev

# Redis
docker logs univ_redis_dev

# Seguir logs en tiempo real
docker logs -f univ_postgres_dev
```

### **Reiniciar un contenedor:**
```powershell
docker restart univ_postgres_dev
```

### **Detener todos los contenedores:**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto
docker-compose -f docker-compose.dev.yml down
```

### **Eliminar todo (incluye datos):**
```powershell
# ⚠️ CUIDADO: Esto elimina los datos
docker-compose -f docker-compose.dev.yml down -v
```

### **Conectarse a PostgreSQL:**
```powershell
docker exec -it univ_postgres_dev psql -U univ_app -d sistema_universitario
```

### **Conectarse a Redis:**
```powershell
docker exec -it univ_redis_dev redis-cli
```

---

## 💾 COMANDOS DE BASE DE DATOS

### **Ver base de datos con Prisma Studio:**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
npx prisma studio
```
Se abre en: http://localhost:5555

### **Sincronizar esquema:**
```powershell
npx prisma db push
```

### **Generar cliente Prisma:**
```powershell
npx prisma generate
```

### **Ver tablas en PostgreSQL:**
```sql
-- En pgAdmin o en psql:
\dt
```

### **Resetear base de datos:**
```powershell
# ⚠️ CUIDADO: Esto elimina todos los datos
npx prisma migrate reset
```

---

## 🔄 COMANDOS DE DESARROLLO

### **Backend:**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend

# Compilar TypeScript
npm run build

# Iniciar servidor (compilado)
node dist/server.js

# Ver logs en tiempo real
# Los logs se muestran en la consola
```

### **Frontend:**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\frontend

# Iniciar desarrollo
npm start

# Build para producción
npm run build

# Limpiar caché
Remove-Item -Path node_modules, .cache -Recurse -Force
npm install
```

---

## 🧪 COMANDOS DE TESTING

### **Probar API con cURL:**
```powershell
# Health check
curl.exe http://localhost:3001/health

# Login
curl.exe -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"estudiante@universidad.edu.mx","password":"Password123"}'

# Obtener estudiantes (requiere token)
curl.exe -X GET http://localhost:3001/api/students `
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### **Probar conexión a PostgreSQL:**
```powershell
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
node -e "const { PrismaClient } = require('@prisma/client'); const prisma = new PrismaClient(); prisma.$connect().then(() => console.log('✅ Conectado')).catch(e => console.log('❌ Error:', e.message));"
```

---

## 📊 COMANDOS DE MONITOREO

### **Ver logs del backend:**
Los logs se muestran en la consola donde ejecutaste `node dist/server.js`

### **Ver procesos Node.js:**
```powershell
Get-Process -Name "node"
```

### **Ver uso de memoria:**
```powershell
# Procesos Node.js
Get-Process node | Select-Object Name, CPU, PM

# Contenedores Docker
docker stats
```

---

## 🔍 COMANDOS DE DEPURACIÓN

### **Verificar servicios:**
```powershell
# Backend
curl.exe http://localhost:3001/health

# Frontend (en navegador)
# http://localhost:3000

# PostgreSQL
docker exec univ_postgres_dev pg_isready -U univ_app

# Redis
docker exec univ_redis_dev redis-cli ping
```

### **Ver errores del backend:**
```powershell
# Si el servidor no inicia, ejecuta directamente para ver el error:
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
node dist/server.js
# Los errores se mostrarán en la consola
```

---

## 🔄 REINICIO COMPLETO DEL SISTEMA

### **Reinicio limpio:**
```powershell
# 1. Detener todo
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto
docker-compose -f docker-compose.dev.yml down

# 2. Esperar
Start-Sleep -Seconds 3

# 3. Iniciar Docker
docker-compose -f docker-compose.dev.yml up -d

# 4. Esperar a que Docker esté listo
Start-Sleep -Seconds 5

# 5. Iniciar Backend
cd backend
node dist/server.js
```

---

## 📝 NOTAS IMPORTANTES

### **Buenas Prácticas:**
- ✅ Siempre detén el servidor anterior antes de iniciar uno nuevo
- ✅ Verifica que Docker esté corriendo antes de iniciar el backend
- ✅ Usa terminales separadas para Backend y Frontend
- ✅ Revisa los logs si algo falla

### **Orden de Inicio:**
1. **Primero:** Docker (servicios)
2. **Segundo:** Backend (API)
3. **Tercero:** Frontend (Web)

### **Para Detener:**
1. **Primero:** Frontend (Ctrl + C)
2. **Segundo:** Backend (Ctrl + C)
3. **Tercero:** Docker (opcional, puede quedarse corriendo)

---

## 🎯 ACCESOS RÁPIDOS

```powershell
# Ver estado de Docker
docker ps

# Ver logs del backend en tiempo real
# (En la terminal donde está corriendo)

# Abrir pgAdmin
start http://localhost:5050

# Abrir Frontend
start http://localhost:3000

# Probar API
curl.exe http://localhost:3001/api/health
```

---

## 🆘 COMANDOS DE EMERGENCIA

### **Si nada funciona:**
```powershell
# 1. Matar todo
Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
docker-compose -f C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\docker-compose.dev.yml down

# 2. Reiniciar Docker Desktop
# Cierra y abre Docker Desktop

# 3. Esperar 30 segundos

# 4. Iniciar todo de nuevo desde el paso 1
```

---

**¡Guarda este documento para referencia rápida!** 📌

