# Vista de Alumnos - Sistema Universitario

## Descripción
Módulo completo para la gestión y visualización de alumnos en el sistema. Incluye funcionalidades de listado, búsqueda, visualización de detalles y consulta de trámites asociados.

## Estructura

### Backend

**Archivo**: `backend/src/tiers/alumnos.routes.ts`

#### Endpoints Disponibles

1. **GET /alumnos**
   - Descripción: Lista todos los alumnos con información completa
   - Autenticación: Requerida (JWT)
   - Respuesta: Array de alumnos con datos de usuario, programa y departamento

2. **GET /alumnos/buscar?q={texto}**
   - Descripción: Busca alumnos por matrícula, nombre, apellidos o correo
   - Parámetros: `q` (string) - término de búsqueda
   - Autenticación: Requerida (JWT)
   - Respuesta: Array de alumnos que coinciden con la búsqueda

3. **GET /alumnos/:id**
   - Descripción: Obtiene el detalle completo de un alumno específico
   - Parámetros: `id` (number) - ID del alumno
   - Autenticación: Requerida (JWT)
   - Respuesta: Objeto con información detallada del alumno

4. **GET /alumnos/:id/tramites**
   - Descripción: Obtiene todos los trámites de un alumno
   - Parámetros: `id` (number) - ID del alumno
   - Autenticación: Requerida (JWT)
   - Respuesta: Array de trámites con su estado y fechas

5. **PATCH /alumnos/:id**
   - Descripción: Actualiza información del alumno
   - Parámetros: `id` (number) - ID del alumno
   - Body (opcionales):
     - `semestre` (number, 1-20)
     - `estatus` (string: 'activo', 'inactivo', 'egresado', 'baja')
     - `programa_id` (number)
   - Autenticación: Requerida (JWT)
   - Respuesta: Mensaje de confirmación

6. **GET /alumnos/stats/general**
   - Descripción: Obtiene estadísticas generales de alumnos
   - Autenticación: Requerida (JWT)
   - Respuesta: Objeto con conteos por estatus

### Frontend

**Archivo**: `frontend/alumnos.html`

#### Características

1. **Dashboard de Estadísticas**
   - Total de alumnos
   - Alumnos activos, inactivos, egresados y bajas
   - Actualización automática al cargar la página

2. **Listado de Alumnos**
   - Tabla responsive con todos los alumnos
   - Información visible: matrícula, nombre, correo, programa, semestre, estatus
   - Botones de acción para ver detalles y trámites

3. **Búsqueda Avanzada**
   - Campo de búsqueda en tiempo real
   - Búsqueda por matrícula, nombre, apellidos o correo
   - Botón para limpiar búsqueda y volver al listado completo

4. **Modal de Detalles**
   - Visualización completa de información del alumno
   - Incluye datos académicos y administrativos
   - Historial de acceso

5. **Vista de Trámites**
   - Lista de todos los trámites del alumno
   - Estado, prioridad y fechas de cada trámite
   - Indicador de SLA incumplido

6. **Autenticación**
   - Verificación automática de token JWT
   - Redirección a login si no hay sesión
   - Uso de localStorage para persistir sesión

## Uso

### Iniciar el Backend

```bash
cd proyecto/backend
npm run dev
```

El servidor estará disponible en `http://localhost:4000`

### Acceder a la Vista

1. Abre `frontend/auth-test.html` en tu navegador
2. Registra una cuenta o inicia sesión
3. Haz clic en el botón "📚 Alumnos" o navega a `frontend/alumnos.html`

## Ejemplos de Uso con cURL

### Obtener todos los alumnos
```bash
curl http://localhost:4000/alumnos \
  -H "Authorization: Bearer TU_TOKEN"
```

### Buscar alumno
```bash
curl "http://localhost:4000/alumnos/buscar?q=Ana" \
  -H "Authorization: Bearer TU_TOKEN"
```

### Ver detalle de alumno
```bash
curl http://localhost:4000/alumnos/1 \
  -H "Authorization: Bearer TU_TOKEN"
```

### Ver trámites de alumno
```bash
curl http://localhost:4000/alumnos/1/tramites \
  -H "Authorization: Bearer TU_TOKEN"
```

### Actualizar alumno
```bash
curl -X PATCH http://localhost:4000/alumnos/1 \
  -H "Authorization: Bearer TU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"semestre": 3, "estatus": "activo"}'
```

### Obtener estadísticas
```bash
curl http://localhost:4000/alumnos/stats/general \
  -H "Authorization: Bearer TU_TOKEN"
```

## Tablas de Base de Datos Utilizadas

- `usuarios` - Información básica del usuario
- `alumnos` - Datos específicos del alumno (matrícula, programa, semestre)
- `programas` - Programas académicos
- `departamentos` - Departamentos de la universidad
- `tramites_alumno` - Trámites asociados a cada alumno
- `tipos_tramite` - Catálogo de tipos de trámite

## Seguridad

- **Autenticación JWT**: Todos los endpoints requieren un token válido
- **Validación de entrada**: Uso de Zod para validar datos
- **SQL Parametrizado**: Prevención de inyección SQL
- **CORS habilitado**: Permite peticiones desde el frontend

## Mejoras Futuras

1. **Paginación**: Implementar paginación para manejar grandes volúmenes de datos
2. **Filtros avanzados**: Filtrar por programa, departamento, semestre, etc.
3. **Exportación**: Descargar listado en Excel/PDF
4. **Edición inline**: Editar datos directamente desde la tabla
5. **Fotos de perfil**: Agregar imágenes de perfil de alumnos
6. **Historial de cambios**: Auditoría de modificaciones
7. **Notificaciones**: Alertas para alumnos en riesgo o con SLA vencido
8. **Gráficas**: Visualización de estadísticas con charts

## Problemas Comunes

### Error 401 - No autorizado
- Verifica que el token JWT sea válido
- Asegúrate de haber iniciado sesión primero
- El token expira después de 1 hora

### Error 500 - Error del servidor
- Verifica que SQL Server esté corriendo
- Revisa la configuración de `.env` en el backend
- Comprueba que la base de datos `univ_docs` exista

### No se muestran alumnos
- Verifica que haya datos en la tabla `alumnos`
- Ejecuta el script `SQL/seed_basico.sql` para datos de prueba
- Registra un alumno desde `auth-test.html`

## Contribuciones

Para agregar nuevas funcionalidades:

1. Agregar endpoint en `backend/src/tiers/alumnos.routes.ts`
2. Actualizar la interfaz en `frontend/alumnos.html`
3. Documentar cambios en este archivo
4. Probar con datos reales de la base de datos

---

Creado: 2025-01-30  
Autor: Sistema de Gestión Universitaria  
Versión: 1.0
