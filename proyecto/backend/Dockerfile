# ==========================================
# Dockerfile para Backend - Node.js + TypeScript
# Sistema Universitario de Gestión Documental
# ==========================================

# Etapa 1: Build
FROM node:20-alpine AS builder

# Información del mantenedor
LABEL maintainer="Sistema Universitario"
LABEL description="Backend API para Sistema Universitario"

# Instalar dependencias necesarias para compilación
RUN apk add --no-cache python3 make g++

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias
RUN npm ci --only=production && \
    npm cache clean --force

# Copiar código fuente
COPY . .

# Compilar TypeScript a JavaScript
RUN npm run build

# ==========================================
# Etapa 2: Production
FROM node:20-alpine

# Variables de entorno por defecto
ENV NODE_ENV=production \
    PORT=3001

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Crear directorios necesarios
WORKDIR /app

# Copiar dependencias de producción desde builder
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Crear directorios para logs y uploads
RUN mkdir -p logs uploads && \
    chown -R nodejs:nodejs /app

# Cambiar a usuario no-root
USER nodejs

# Exponer puerto
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar la aplicación
CMD ["node", "dist/server.js"]
