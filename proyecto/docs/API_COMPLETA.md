# 📚 API Completa - Sistema Universitario

## Base URL
```
http://localhost:3001/api
```

---

## 🔐 AUTENTICACIÓN (`/api/auth`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| POST | `/register` | Registrar usuario | Público |
| POST | `/login` | Iniciar sesión | Público |
| POST | `/refresh` | Renovar token | Público |
| POST | `/logout` | Cerrar sesión | Público |
| GET | `/profile` | Perfil completo | Privado |
| GET | `/me` | Info del token | Privado |

---

## 👨‍🎓 ESTUDIANTES (`/api/students`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/my-profile` | Mi perfil | Estudiante |
| GET | `/` | Lista de estudiantes | Admin/Profesor |
| POST | `/` | Crear estudiante | Admin |
| GET | `/:id` | Obtener por ID | Admin/Profesor |
| GET | `/matricula/:matricula` | Por matrícula | Admin/Profesor |
| PUT | `/:id` | Actualizar | Admin |
| DELETE | `/:id` | Eliminar | Super Admin |
| GET | `/search?q=` | Buscar | Admin/Profesor |
| GET | `/generate-matricula` | Generar matrícula | Admin |

---

## 📚 CARRERAS (`/api/carreras`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/` | Lista de carreras | Autenticado |
| POST | `/` | Crear carrera | Admin |
| GET | `/:id` | Obtener por ID | Autenticado |
| PUT | `/:id` | Actualizar | Admin |
| DELETE | `/:id` | Eliminar | Super Admin |

**Ejemplo de creación:**
```json
{
  "clave": "ISC",
  "nombre": "Ingeniería en Sistemas Computacionales",
  "descripcion": "Programa de ingeniería enfocado en sistemas",
  "duracionSemestres": 9,
  "creditos": 300,
  "modalidad": "PRESENCIAL"
}
```

---

## 📖 MATERIAS (`/api/materias`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/` | Lista de materias | Autenticado |
| GET | `/?carreraId=uuid` | Materias por carrera | Autenticado |
| POST | `/` | Crear materia | Admin |
| GET | `/:id` | Obtener por ID | Autenticado |
| PUT | `/:id` | Actualizar | Admin |
| DELETE | `/:id` | Eliminar | Super Admin |

**Ejemplo de creación:**
```json
{
  "clave": "MAT101",
  "nombre": "Cálculo Diferencial",
  "descripcion": "Fundamentos de cálculo",
  "creditos": 8,
  "semestre": 1,
  "horasTeoria": 4,
  "horasPractica": 2,
  "carreraId": "uuid-de-carrera"
}
```

---

## 📄 DOCUMENTOS (`/api/documentos`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/` | Lista de documentos | Autenticado |
| GET | `/?estudianteId=uuid` | Docs por estudiante | Autenticado |
| GET | `/:id` | Obtener por ID | Autenticado |
| PATCH | `/:id/estatus` | Actualizar estatus | Admin |
| DELETE | `/:id` | Anular documento | Super Admin |

**Tipos de Documento:**
- CERTIFICADO
- CONSTANCIA
- TITULO
- KARDEX
- BOLETA
- COMPROBANTE_PAGO
- COMPROBANTE_INSCRIPCION
- HISTORIAL_ACADEMICO
- CARTA_PASANTE
- OTRO

**Estatus:**
- PENDIENTE
- EN_REVISION
- APROBADO
- RECHAZADO
- VENCIDO
- ANULADO

---

## 📊 CALIFICACIONES (`/api/calificaciones`)

| Método | Endpoint | Descripción | Acceso |
|--------|----------|-------------|--------|
| GET | `/my-calificaciones` | Mis calificaciones | Estudiante |
| POST | `/` | Crear calificación | Profesor/Admin |
| GET | `/estudiante/:estudianteId` | Por estudiante | Profesor/Admin |
| GET | `/promedio/:estudianteId` | Calcular promedio | Autenticado |
| PUT | `/:id` | Actualizar | Profesor/Admin |

**Ejemplo de creación:**
```json
{
  "calificacion": 8.5,
  "estatus": "APROBADO",
  "observaciones": "Excelente desempeño",
  "estudianteId": "uuid",
  "materiaId": "uuid",
  "inscripcionId": "uuid"
}
```

---

## 📋 RESPUESTAS ESTÁNDAR

### Éxito:
```json
{
  "success": true,
  "data": { ... },
  "message": "Operación exitosa" // opcional
}
```

### Con Paginación:
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

### Error:
```json
{
  "success": false,
  "error": {
    "message": "Descripción del error",
    "statusCode": 400
  }
}
```

---

## 🔒 AUTENTICACIÓN

Todas las rutas (excepto registro y login) requieren autenticación.

**Header requerido:**
```
Authorization: Bearer <access_token>
```

**Ejemplo con cURL:**
```bash
curl -H "Authorization: Bearer eyJhbGci..." http://localhost:3001/api/students
```

---

## 🎯 CÓDIGOS DE ESTADO

| Código | Descripción |
|--------|-------------|
| 200 | OK - Operación exitosa |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Sin permisos |
| 404 | Not Found - Recurso no encontrado |
| 409 | Conflict - Conflicto (duplicado) |
| 429 | Too Many Requests - Rate limit |
| 500 | Internal Server Error |

---

## 📊 RESUMEN DE ENDPOINTS

**Total de endpoints:** 35+

- Autenticación: 6 endpoints
- Estudiantes: 9 endpoints
- Carreras: 5 endpoints
- Materias: 5 endpoints
- Documentos: 4 endpoints
- Calificaciones: 5 endpoints
- Health checks: 2 endpoints

---

**Versión:** 1.0.0  
**Última actualización:** Octubre 2024


