# 📦 Guía de Instalación - Sistema Universitario

Esta guía te ayudará a configurar el proyecto en una computadora nueva desde cero.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

### 1. Node.js y npm
- **Node.js**: Versión 18.x o superior
- **npm**: Viene incluido con Node.js

**Descarga e instalación:**
- Visita: https://nodejs.org/
- Descarga la versión LTS (Long Term Support)
- Ejecuta el instalador y sigue las instrucciones
- Verifica la instalación:
  ```bash
  node --version
  npm --version
  ```

### 2. Git (Opcional, si vas a clonar el repositorio)
- **Git**: Cualquier versión reciente
- Descarga: https://git-scm.com/downloads

### 3. Editor de Código (Recomendado)
- **Visual Studio Code**: https://code.visualstudio.com/
- O cualquier editor de tu preferencia

---

## 🚀 Pasos de Instalación

### Paso 1: Obtener el Código del Proyecto

#### Opción A: Si tienes el proyecto en una carpeta
1. Copia toda la carpeta del proyecto a la nueva computadora
2. Colócala en una ubicación de tu preferencia (ej: `C:\Proyectos\Sistema_Abierto`)

#### Opción B: Si tienes el proyecto en Git
```bash
git clone [URL_DEL_REPOSITORIO]
cd Sistema_Abierto
```

### Paso 2: Instalar Dependencias del Backend

1. Abre una terminal o PowerShell
2. Navega a la carpeta del backend:
   ```bash
   cd proyecto/backend
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

   ⏱️ Esto puede tomar varios minutos la primera vez.

### Paso 3: Configurar Variables de Entorno del Backend

1. En la carpeta `proyecto/backend`, crea un archivo llamado `.env`
2. Copia el contenido del archivo `env.example` a tu nuevo archivo `.env`
3. Edita el archivo `.env` y configura las siguientes variables:

```env
# Puerto del servidor (puedes dejarlo en 4000 o cambiarlo)
PORT=4000

# Base de Datos - SQLite (ya está configurado para desarrollo)
# Si usas SQLite, no necesitas cambiar esto
DATABASE_URL="file:./prisma/dev.db"

# JWT Secrets (CAMBIA ESTOS VALORES POR UNOS SEGUROS)
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui_cambiar_en_produccion
JWT_REFRESH_SECRET=tu_secreto_refresh_jwt_super_seguro_aqui_cambiar_en_produccion

# JWT Expiration
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS - URL del frontend
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Environment
NODE_ENV=development

# Encryption Key (genera uno aleatorio)
ENCRYPTION_KEY=tu_clave_de_encriptacion_de_32_caracteres_aqui

# Configuración de Correo (opcional, para desarrollo puedes dejarlo vacío)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_correo@ejemplo.com
SMTP_PASSWORD=tu_contraseña
FRONTEND_URL=http://localhost:3000
```

**Nota importante sobre las claves:**
- `JWT_SECRET` y `JWT_REFRESH_SECRET`: Deben ser cadenas aleatorias y seguras
- `ENCRYPTION_KEY`: Debe tener exactamente 32 caracteres
- Puedes generar claves seguras en: https://www.grc.com/passwords.htm o usando:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

### Paso 4: Configurar la Base de Datos

1. Asegúrate de estar en la carpeta `proyecto/backend`
2. Genera el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
3. Crea la base de datos y aplica las migraciones:
   ```bash
   npx prisma db push
   ```
   
   ⚠️ **Importante**: Si la base de datos ya tiene datos y quieres empezar desde cero:
   ```bash
   npx prisma db push --force-reset
   ```

4. (Opcional) Si tienes un script para crear usuarios de prueba:
   ```bash
   npm run build
   node dist/scripts/recrear-usuarios.js
   ```

### Paso 5: Instalar Dependencias del Frontend

1. Abre una **nueva terminal** o PowerShell
2. Navega a la carpeta del frontend:
   ```bash
   cd proyecto/frontend
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

   ⏱️ Esto también puede tomar varios minutos.

### Paso 6: Configurar el Frontend (Opcional)

El frontend está configurado para conectarse al backend en `http://localhost:4000` por defecto.

Si necesitas cambiar la URL del backend:
1. Crea un archivo `.env.development` en `proyecto/frontend/`
2. Agrega:
   ```env
   REACT_APP_API_URL=http://localhost:4000
   ```

---

## ▶️ Ejecutar el Proyecto

### Iniciar el Backend

1. Abre una terminal
2. Navega a `proyecto/backend`
3. Ejecuta:
   ```bash
   npm run dev
   ```
   
   El servidor debería iniciarse en `http://localhost:4000`

### Iniciar el Frontend

1. Abre **otra terminal** (deja el backend corriendo)
2. Navega a `proyecto/frontend`
3. Ejecuta:
   ```bash
   npm start
   ```
   
   El navegador debería abrirse automáticamente en `http://localhost:3000`

---

## 🎯 Verificar que Todo Funciona

1. **Backend**: Abre tu navegador y ve a `http://localhost:4000/api/health` (si existe el endpoint)
   - Deberías ver una respuesta JSON o un mensaje de que el servidor está funcionando

2. **Frontend**: Debería abrirse automáticamente en `http://localhost:3000`
   - Deberías ver la página de login o la página principal

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module"
**Solución**: Asegúrate de haber ejecutado `npm install` en ambas carpetas (backend y frontend)

### Error: "Port already in use"
**Solución**: 
- Backend (puerto 4000): Cierra otros programas que usen ese puerto o cambia el puerto en `.env`
- Frontend (puerto 3000): Lo mismo, o presiona `Y` cuando te pregunte si quieres usar otro puerto

### Error: "Prisma Client not generated"
**Solución**: Ejecuta `npx prisma generate` en la carpeta del backend

### Error: "Database connection failed"
**Solución**: 
- Verifica que el archivo `.env` esté en la carpeta correcta (`proyecto/backend/.env`)
- Verifica que la ruta de la base de datos sea correcta
- Si usas SQLite, verifica que la carpeta `prisma` exista y tenga permisos de escritura

### Error: Variables de entorno no encontradas
**Solución**: 
- Verifica que el archivo `.env` exista en `proyecto/backend/`
- Verifica que todas las variables requeridas estén definidas
- No dejes espacios alrededor del signo `=` en el archivo `.env`

---

## 📝 Estructura de Carpetas Importantes

```
Sistema_Abierto/
├── proyecto/
│   ├── backend/
│   │   ├── .env                    ← IMPORTANTE: Configuración del backend
│   │   ├── prisma/
│   │   │   ├── schema.prisma       ← Esquema de la base de datos
│   │   │   └── dev.db              ← Base de datos SQLite (se crea automáticamente)
│   │   ├── uploads/                ← Archivos subidos por usuarios
│   │   └── package.json
│   │
│   └── frontend/
│       ├── .env.development        ← Opcional: Configuración del frontend
│       └── package.json
```

---

## 🔑 Crear Usuario Administrador

Si la base de datos está vacía, necesitas crear un usuario administrador:

1. Asegúrate de que el backend esté compilado:
   ```bash
   cd proyecto/backend
   npm run build
   ```

2. Ejecuta el script de creación de usuarios (si existe):
   ```bash
   node dist/scripts/recrear-usuarios.js
   ```

O crea manualmente un usuario a través de la API o la interfaz de administración.

---

## 📦 Resumen de Comandos Rápidos

```bash
# 1. Instalar dependencias del backend
cd proyecto/backend
npm install

# 2. Configurar base de datos
npx prisma generate
npx prisma db push

# 3. Instalar dependencias del frontend
cd ../frontend
npm install

# 4. Iniciar backend (terminal 1)
cd ../backend
npm run dev

# 5. Iniciar frontend (terminal 2)
cd ../frontend
npm start
```

---

## ✅ Checklist de Instalación

- [ ] Node.js y npm instalados
- [ ] Código del proyecto copiado/clonado
- [ ] Dependencias del backend instaladas (`npm install` en backend)
- [ ] Archivo `.env` creado y configurado en `proyecto/backend/`
- [ ] Clave `JWT_SECRET` configurada (valor seguro)
- [ ] Clave `ENCRYPTION_KEY` configurada (32 caracteres)
- [ ] Base de datos configurada (`npx prisma generate` y `npx prisma db push`)
- [ ] Dependencias del frontend instaladas (`npm install` en frontend)
- [ ] Backend inicia sin errores (`npm run dev`)
- [ ] Frontend inicia sin errores (`npm start`)
- [ ] Puedes acceder al sistema en el navegador

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas durante la instalación:

1. Verifica que todos los requisitos previos estén instalados
2. Revisa la sección "Solución de Problemas Comunes"
3. Revisa los logs de error en las terminales (backend y frontend)
4. Verifica que los puertos 3000 y 4000 no estén en uso

---

## 📌 Notas Importantes

- **Desarrollo vs Producción**: Esta guía está enfocada en desarrollo. Para producción, se requieren configuraciones adicionales de seguridad.

- **Base de Datos**: El proyecto usa SQLite en desarrollo, lo cual es más fácil de configurar. En producción, se recomienda usar PostgreSQL.

- **Seguridad**: **NUNCA** compartas tu archivo `.env` o lo subas a Git. Contiene información sensible.

- **Actualizaciones**: Si el proyecto se actualiza, puede que necesites:
  - Ejecutar `npm install` de nuevo
  - Ejecutar `npx prisma generate` y `npx prisma db push` de nuevo
  - Actualizar tu archivo `.env` si hay nuevas variables requeridas

¡Listo! Tu sistema debería estar funcionando. 🎉

