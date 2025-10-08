# 🎨 Frontend - Sistema Universitario

Aplicación web React con TypeScript para el Sistema Universitario de Gestión Documental Digital

## 🚀 Características

- ✅ **React 18** con TypeScript
- ✅ **Material-UI** para componentes
- ✅ **Zustand** para gestión de estado
- ✅ **React Router** para navegación
- ✅ **Axios** para peticiones HTTP
- ✅ **React Hook Form** para formularios
- ✅ **React Hot Toast** para notificaciones
- ✅ **JWT** para autenticación

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start

# Compilar para producción
npm run build
```

## 📁 Estructura del Proyecto

```
frontend/
├── public/              # Archivos públicos
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── assets/         # Imágenes, iconos
│   ├── components/     # Componentes reutilizables
│   ├── hooks/          # Custom hooks
│   ├── layouts/        # Layouts de páginas
│   ├── pages/          # Páginas principales
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   └── DashboardPage.tsx
│   ├── services/       # Servicios API
│   │   ├── api.service.ts
│   │   └── auth.service.ts
│   ├── store/          # Estado global (Zustand)
│   │   └── authStore.ts
│   ├── types/          # Tipos TypeScript
│   │   └── auth.types.ts
│   ├── utils/          # Utilidades
│   ├── App.tsx         # Componente principal
│   ├── index.tsx       # Punto de entrada
│   └── index.css       # Estilos globales
└── package.json
```

## 🎨 Páginas Implementadas

### 1. Login Page (`/login`)
- Formulario de inicio de sesión
- Validación de credenciales
- Manejo de errores
- Redirección automática

### 2. Register Page (`/register`)
- Formulario de registro
- Validación de datos
- Verificación de contraseñas
- Registro de estudiantes

### 3. Dashboard Page (`/dashboard`)
- Vista principal del estudiante
- Estadísticas generales
- Accesos rápidos
- Notificaciones

## 🔐 Autenticación

### Flujo de Autenticación:
1. Usuario inicia sesión
2. Backend genera Access Token (24h) y Refresh Token (7 días)
3. Tokens se guardan en localStorage
4. Access Token se adjunta automáticamente en todas las peticiones
5. Si Access Token expira, se renueva automáticamente con Refresh Token
6. Si Refresh Token expira, usuario debe iniciar sesión nuevamente

### Protección de Rutas:
- Rutas públicas: `/login`, `/register`
- Rutas protegidas: `/dashboard` y todas las demás
- Redirección automática si no está autenticado

## 🌐 Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

## 🧪 Testing

```bash
# Ejecutar pruebas
npm test

# Ejecutar pruebas con cobertura
npm run test:coverage
```

## 🎯 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm start` | Desarrollo con hot reload |
| `npm run build` | Compilar para producción |
| `npm test` | Ejecutar pruebas |
| `npm run lint` | Verificar código |
| `npm run format` | Formatear código |

## 📦 Dependencias Principales

- **@mui/material** - Componentes UI
- **@mui/icons-material** - Iconos
- **react-router-dom** - Navegación
- **axios** - Cliente HTTP
- **zustand** - Gestión de estado
- **react-hot-toast** - Notificaciones
- **react-hook-form** - Formularios
- **yup** - Validación de esquemas

## 🎨 Tema y Diseño

### Colores Principales:
- **Primary**: #667eea (Azul morado)
- **Secondary**: #f50057 (Rosa)
- **Background**: Linear gradient

### Características de Diseño:
- ✅ Diseño responsive (móvil, tablet, desktop)
- ✅ Material Design 3
- ✅ Animaciones suaves
- ✅ Iconos Material-UI
- ✅ Gradientes modernos
- ✅ Glassmorphism effects

## 🚀 Próximas Funcionalidades

- [ ] Página de Perfil del Usuario
- [ ] Módulo de Materias
- [ ] Módulo de Calificaciones
- [ ] Módulo de Documentos
- [ ] Módulo de Pagos
- [ ] Sistema de Notificaciones en tiempo real
- [ ] Chat institucional
- [ ] Calendario académico

## 📞 Conexión con Backend

Asegúrate de que el backend esté corriendo en `http://localhost:3001`

```bash
# En la carpeta backend:
npm run dev
```

---

**Versión:** 1.0.0  
**Estado:** ✅ Funcional  
**Última actualización:** Octubre 2024

