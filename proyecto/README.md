# 🎓 Sistema Universitario de Gestión Documental Digital

## 📋 Descripción del Proyecto

Sistema integral para la gestión universitaria enfocado en la **reducción de documentos físicos** mediante la digitalización completa de procesos académicos y administrativos.

## 🎯 Objetivos

- **Reducción del 90%** de documentos físicos en la universidad
- Digitalización completa de trámites académicos y administrativos
- Mejora en la experiencia del usuario (estudiantes, profesores, personal administrativo)
- Cumplimiento de normas de seguridad y protección de datos
- Sostenibilidad ambiental mediante la reducción del uso de papel

## 🏗️ Arquitectura del Sistema

### Frontend
- **React.js** con TypeScript
- **Material-UI** para componentes
- **Progressive Web App (PWA)**
- Responsive design para dispositivos móviles

### Backend
- **Node.js** con Express y TypeScript
- **PostgreSQL** como base de datos principal
- **Redis** para caché y gestión de sesiones
- **JWT** para autenticación

### Infraestructura
- **Docker** para contenedores
- **Nginx** como proxy reverso
- **SSL/TLS** para seguridad
- **Cloud Storage** para documentos

## 📁 Estructura del Proyecto

```
sistema-universitario/
├── frontend/                 # Aplicación React
├── backend/                  # API Node.js
├── database/                 # Scripts SQL y migraciones
├── docs/                     # Documentación
├── docker/                   # Configuración Docker
├── security/                 # Políticas de seguridad
└── tests/                    # Pruebas automatizadas
```

## 🔒 Seguridad

- Autenticación multi-factor (MFA)
- Cifrado de datos en reposo y tránsito
- Logs de auditoría completos
- Cumplimiento GDPR y normativas locales
- Certificados digitales para documentos oficiales

## 📚 Módulos Principales

1. **Gestión Académica**
   - Inscripciones digitales
   - Calificaciones online
   - Certificados digitales
   - Historial académico

2. **Gestión Administrativa**
   - Trámites digitales
   - Constancias automáticas
   - Pagos online
   - Notificaciones

3. **Gestión de Títulos**
   - Emisión digital de títulos
   - Verificación blockchain
   - Certificados verificables

4. **Biblioteca Digital**
   - Recursos académicos
   - Catálogo digital
   - Reservas online

5. **Comunicaciones**
   - Notificaciones push
   - Circulares digitales
   - Chat institucional

## 🚀 Instalación y Configuración

### 📖 Guías de Instalación

- **[GUIA_INSTALACION.md](../GUIA_INSTALACION.md)** - Guía completa y detallada paso a paso
- **[INSTALACION_RAPIDA.md](../INSTALACION_RAPIDA.md)** - Resumen ejecutivo para instalación rápida
- **[instalar-sistema.ps1](../instalar-sistema.ps1)** - Script de instalación automática para Windows

### ⚡ Inicio Rápido

1. **Requisitos**: Node.js 18+ instalado
2. **Backend**: 
   ```bash
   cd proyecto/backend
   npm install
   # Crear archivo .env desde env.example
   npx prisma generate
   npx prisma db push
   npm run dev
   ```
3. **Frontend**: 
   ```bash
   cd proyecto/frontend
   npm install
   npm start
   ```

Para más detalles, consulta las guías de instalación arriba.

## 📖 Documentación

- [Arquitectura del Sistema](docs/ARQUITECTURA.md)
- [Guía de Seguridad](docs/SEGURIDAD.md)
- [API Documentation](docs/API.md)
- [Normas y Estándares](docs/NORMAS.md)

## 🤝 Contribución

Ver [CONTRIBUTING.md](CONTRIBUTING.md) para guías de contribución.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 📞 Soporte

Para soporte técnico o consultas, contactar al equipo de desarrollo.
