# ⚡ Instalación Rápida - Resumen Ejecutivo

## 📋 Requisitos Mínimos

1. **Node.js 18+** - Descargar de: https://nodejs.org/
2. **Git** (opcional) - Descargar de: https://git-scm.com/

## 🚀 Instalación en 5 Pasos

### 1️⃣ Copiar el Proyecto
Copia la carpeta completa del proyecto a la nueva computadora.

### 2️⃣ Configurar Backend
```bash
cd proyecto/backend
npm install
```

### 3️⃣ Crear Archivo .env
En `proyecto/backend/`, crea un archivo `.env` copiando `env.example` y editando estos valores críticos:

```env
PORT=4000
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET=[genera_un_valor_aleatorio_seguro]
JWT_REFRESH_SECRET=[genera_otro_valor_aleatorio_seguro]
ENCRYPTION_KEY=[32_caracteres_aleatorios]
NODE_ENV=development
```

**Para generar claves seguras:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4️⃣ Configurar Base de Datos
```bash
cd proyecto/backend
npx prisma generate
npx prisma db push
```

### 5️⃣ Instalar Frontend
```bash
cd proyecto/frontend
npm install
```

## ▶️ Ejecutar

**Terminal 1 - Backend:**
```bash
cd proyecto/backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd proyecto/frontend
npm start
```

## 🌐 Acceso

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## ❓ Problemas?

Ver la guía completa: [GUIA_INSTALACION.md](GUIA_INSTALACION.md)

---

**⏱️ Tiempo estimado:** 15-20 minutos

