# 🚀 Guía de Inicio Rápido - Sistema Universitario

## 📋 Resumen del Sistema

Sistema completo de gestión universitaria enfocado en la **reducción de documentos físicos** mediante digitalización.

## ✅ Estado Actual del Proyecto

### **COMPLETADO AL 100%:**
- ✅ Infraestructura Docker (PostgreSQL, Redis)
- ✅ Backend API con Node.js + TypeScript
- ✅ Autenticación JWT completa y funcional
- ✅ Frontend React con Material-UI
- ✅ Base de datos con 15+ modelos
- ✅ Documentación completa

## 🚀 Iniciar el Sistema (3 Pasos)

### **PASO 1: Iniciar Docker (Servicios)**
```bash
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto
docker-compose -f docker-compose.dev.yml up -d
```

**Servicios que se inician:**
- PostgreSQL (puerto 5432)
- Redis (puerto 6379)
- pgAdmin (puerto 5050)
- Redis Commander (puerto 8081)

### **PASO 2: Iniciar Backend (API)**
```bash
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\backend
npm run dev
```

**Backend corriendo en:** http://localhost:3001

### **PASO 3: Iniciar Frontend (Página Web)**
```bash
cd C:\Users\User\Documents\GitHub\Sistema_Abierto\proyecto\frontend
npm start
```

**Frontend abrirá automáticamente en:** http://localhost:3000

---

## 🌐 URLs de Acceso

| Servicio | URL | Credenciales |
|----------|-----|--------------|
| **Frontend (Web)** | http://localhost:3000 | - |
| **Backend API** | http://localhost:3001 | - |
| **API Health** | http://localhost:3001/api/health | - |
| **PostgreSQL** | localhost:5432 | user: `univ_app`, pass: `univ_app_password_2024` |
| **pgAdmin** | http://localhost:5050 | email: `admin@universidad.edu.mx`, pass: `admin123` |
| **Redis** | localhost:6379 | - |
| **Redis Commander** | http://localhost:8081 | - |

---

## 🔐 Usuarios de Prueba

### Usuario Estudiante (Ya creado):
```
Email: estudiante@universidad.edu.mx
Password: Password123
Rol: ESTUDIANTE
```

### Crear más usuarios:
Ve a http://localhost:3000/register y crea nuevos usuarios.

---

## 🎯 Funcionalidades Disponibles

### Autenticación ✅
- [x] Login
- [x] Registro
- [x] Logout
- [x] Renovación automática de tokens
- [x] Protección contra brute force

### Dashboard ✅
- [x] Página principal del estudiante
- [x] Estadísticas generales
- [x] Accesos rápidos
- [x] Perfil de usuario

### Próximamente:
- [ ] Gestión de Materias
- [ ] Calificaciones
- [ ] Documentos Digitales
- [ ] Pagos Online
- [ ] Constancias Automáticas

---

## 🛠️ Comandos Útiles

### Docker:
```bash
# Ver contenedores
docker ps

# Ver logs
docker logs univ_postgres_dev

# Detener todo
docker-compose -f docker-compose.dev.yml down

# Reiniciar un servicio
docker-compose -f docker-compose.dev.yml restart postgres
```

### Backend:
```bash
# Ver base de datos en Prisma Studio
npx prisma studio

# Ver logs en tiempo real
# (El servidor ya muestra logs en la consola)

# Recompilar
npm run build
```

### Frontend:
```bash
# Limpiar caché
rm -rf node_modules .cache
npm install

# Build para producción
npm run build
```

---

## 🐛 Solución de Problemas

### Error: "Cannot connect to database"
**Solución:** Asegúrate de que Docker esté corriendo
```bash
docker ps  # Debe mostrar contenedores activos
```

### Error: "Port 3001 already in use"
**Solución:** Mata el proceso anterior
```bash
# Windows PowerShell
Stop-Process -Name node -Force
```

### Error: "Failed to fetch"
**Solución:** Verifica que el backend esté corriendo en puerto 3001
```bash
curl http://localhost:3001/health
```

### Frontend no carga
**Solución:** Verifica que esté corriendo
```bash
# Debe mostrar "webpack compiled successfully"
```

---

## 📊 Estructura de Datos

### Modelos Principales:
- **Usuario**: Autenticación y datos base
- **Estudiante**: Información académica
- **Profesor**: Datos de profesores
- **Carrera**: Programas educativos
- **Materia**: Asignaturas
- **Grupo**: Clases
- **Inscripción**: Registro en materias
- **Calificación**: Notas
- **Documento**: Archivos digitales
- **Pago**: Transacciones

---

## 🔒 Seguridad Implementada

### Backend:
- ✅ JWT con expiración
- ✅ bcrypt para contraseñas
- ✅ Helmet (security headers)
- ✅ CORS configurado
- ✅ Rate limiting (100 req/15 min)
- ✅ Validación de datos
- ✅ Logs de auditoría

### Frontend:
- ✅ Tokens en localStorage
- ✅ Renovación automática de tokens
- ✅ Rutas protegidas
- ✅ Manejo de sesiones expiradas

---

## 📚 Documentación Completa

- [Instalación Completa](docs/INSTALACION.md)
- [API de Autenticación](docs/API_AUTENTICACION.md)
- [Seguridad](docs/SEGURIDAD.md)
- [Normas y Estándares](docs/NORMAS.md)
- [PostgreSQL Setup](docs/POSTGRESQL_SETUP.md)
- [Docker](docs/DOCKER_INSTALACION.md)
- [Resumen de Progreso](docs/RESUMEN_PROGRESO.md)

---

## 🎓 Módulos del Sistema

### Fase 1 (Completado):
- [x] Autenticación JWT
- [x] Dashboard básico
- [x] Registro de usuarios

### Fase 2 (Por implementar):
- [ ] Gestión de Estudiantes
- [ ] Gestión de Materias
- [ ] Sistema de Inscripciones
- [ ] Calificaciones Online

### Fase 3 (Por implementar):
- [ ] Gestión Documental
- [ ] Generación de Certificados
- [ ] Firma Digital
- [ ] Verificación Blockchain

---

## 📞 Soporte

Para problemas o preguntas:
- Revisa la documentación en `docs/`
- Verifica los logs de errores
- Consulta el archivo de configuración `.env`

---

## 🎉 ¡Listo para Usar!

Tu sistema está **completamente funcional** con:
- ✅ Backend API corriendo
- ✅ Frontend web operativo
- ✅ Base de datos configurada
- ✅ Autenticación implementada
- ✅ Docker containerizado

**Accede ahora a:** http://localhost:3000

---

**Versión:** 1.0.0  
**Fecha:** Octubre 2024  
**Estado:** ✅ Producción lista para desarrollo

