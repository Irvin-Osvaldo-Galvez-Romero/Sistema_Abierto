# Solución de Errores de Conexión

## Problema
Los errores `ERR_CONNECTION_REFUSED` indican que el **backend no está corriendo** o no está escuchando en el puerto correcto.

## Solución

### 1. Verificar que el Backend esté corriendo

El backend debe estar corriendo en el puerto **4000** antes de iniciar el frontend.

#### Pasos para iniciar el Backend:

```bash
# 1. Ir a la carpeta del backend
cd proyecto/backend

# 2. Verificar que existe el archivo .env
# Si no existe, copiar el ejemplo:
copy env.example .env

# 3. Asegurarse de que el archivo .env tenga:
PORT=4000

# 4. Instalar dependencias (si no lo has hecho)
npm install

# 5. Generar el cliente de Prisma
npx prisma generate

# 6. Actualizar la base de datos (crear las nuevas tablas del Modelo Dual)
npx prisma db push

# 7. Iniciar el servidor en modo desarrollo
npm run dev
```

Deberías ver un mensaje como:
```
🚀 Servidor corriendo en http://localhost:4000
```

### 2. Verificar configuración del Frontend

El frontend está configurado para usar:
- **Proxy**: `http://localhost:4000` (configurado en `package.json`)
- **URL de API**: `/api` (usa el proxy automáticamente)

#### Pasos para iniciar el Frontend:

```bash
# 1. Ir a la carpeta del frontend
cd proyecto/frontend

# 2. Verificar que existe el archivo .env
# Si no existe, crear uno con:
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_ENV=development

# 3. Instalar dependencias (si no lo has hecho)
npm install

# 4. Iniciar el servidor de desarrollo
npm start
```

### 3. Verificar que ambos servidores estén corriendo

- **Backend**: `http://localhost:4000` ✅
- **Frontend**: `http://localhost:3000` ✅

### 4. Solución de problemas comunes

#### Error: "Cannot find module"
```bash
# En el backend
cd proyecto/backend
npm install
npx prisma generate
```

#### Error: "Database connection failed"
```bash
# Verificar que el archivo .env tenga:
DATABASE_URL="file:./prisma/dev.db"

# Luego ejecutar:
npx prisma db push
```

#### Error: "Port 4000 already in use"
```bash
# En Windows, encontrar el proceso:
netstat -ano | findstr :4000

# Matar el proceso (reemplaza PID con el número que aparezca):
taskkill /PID <PID> /F
```

#### Error: "Port 3000 already in use"
```bash
# El frontend de React te preguntará si quieres usar otro puerto
# O puedes especificar otro puerto:
set PORT=3001 && npm start
```

### 5. Orden correcto de inicio

1. **Primero**: Iniciar el Backend
   ```bash
   cd proyecto/backend
   npm run dev
   ```

2. **Segundo**: Iniciar el Frontend (en otra terminal)
   ```bash
   cd proyecto/frontend
   npm start
   ```

### 6. Verificar que todo funciona

1. Abre el navegador en `http://localhost:3000`
2. Deberías ver la página de login
3. Si ves errores en la consola del navegador, verifica:
   - Que el backend esté corriendo (ve a `http://localhost:4000/health`)
   - Que no haya errores en la terminal del backend
   - Que el archivo `.env` del backend tenga `PORT=4000`

## Nota sobre el favicon.ico

El error `404 favicon.ico` es **normal** y no afecta el funcionamiento. Puedes ignorarlo o agregar un favicon.ico en la carpeta `public` del frontend.

