# ==========================================
# Dockerfile para Frontend - React + TypeScript
# Sistema Universitario de Gestión Documental
# ==========================================

# Etapa 1: Build
FROM node:20-alpine AS builder

# Información del mantenedor
LABEL maintainer="Sistema Universitario"
LABEL description="Frontend React para Sistema Universitario"

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci && \
    npm cache clean --force

# Copiar código fuente
COPY . .

# Construir la aplicación para producción
RUN npm run build

# ==========================================
# Etapa 2: Production con Nginx
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar archivos build desde la etapa anterior
COPY --from=builder /app/build /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
