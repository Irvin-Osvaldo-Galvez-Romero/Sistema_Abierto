# Diseño de Base de Datos (SQL Server 2019) - MVP Núcleo

Base de datos: `univ_docs`

## Convenciones
- Identificadores en español, snake_case.
- Tiempos en UTC: columnas `*_en` con `SYSUTCDATETIME()` por defecto.
- Tipos: `BIGINT IDENTITY` para PK; `NVARCHAR` para texto; `DATETIME2` para fechas.
- Integridad: FK explícitas, índices en consultas frecuentes, FTI para OCR.

## Módulos y Tablas

### Identidad y RBAC
- `usuarios`
  - Campos: `id`, `guid`, `correo (UQ)`, `hash_contrasena`, `nombre`, `apellidos`, `activo`, `ultimo_acceso`, `creado_en`, `actualizado_en`
  - Índices: UQ `correo`
- `roles` (`id`, `nombre (UQ)`, `descripcion`)
- `permisos` (`id`, `codigo (UQ)`, `descripcion`)
- `usuarios_roles` (PK compuesta: `usuario_id, rol_id`)
- `roles_permisos` (PK compuesta: `rol_id, permiso_id`)

Relaciones:
- `usuarios_roles.usuario_id` → `usuarios.id`
- `usuarios_roles.rol_id` → `roles.id`
- `roles_permisos.rol_id` → `roles.id`
- `roles_permisos.permiso_id` → `permisos.id`

### Académico
- `departamentos` (`id`, `clave (UQ)`, `nombre`)
- `programas` (`id`, `departamento_id (FK)`, `clave (UQ)`, `nombre`, `nivel`)
- `alumnos` (`id`, `usuario_id (UQ, FK)`, `matricula (UQ)`, `programa_id (FK)`, `semestre`, `estatus`)
- `personal` (`id`, `usuario_id (UQ, FK)`, `puesto`, `departamento_id (FK)`)

### Trámites (catálogos y flujos)
- `tipos_tramite` (`id`, `clave (UQ)`, `nombre`, `descripcion`, `sla_dias`, `activo`)
- `tipos_documento` (`id`, `clave (UQ)`, `nombre`, `mimes_permitidos`, `tam_max_mb`, `requiere_ocr`)
- `requisitos_tramite` (`id`, `tipo_tramite_id (FK)`, `programa_id (FK|NULL)`, `tipo_documento_id (FK)`, `obligatorio`, `orden`)
  - Índices: UQ `(tipo_tramite_id, ISNULL(programa_id,0), tipo_documento_id, orden)`
- `pasos_flujo` (`id`, `tipo_tramite_id (FK)`, `orden`, `nombre`, `rol_requerido`, `regla_asignacion`)
  - Índices: UQ `(tipo_tramite_id, orden)`

### Instancias de trámite
- `tramites_alumno` (`id`, `alumno_id (FK)`, `tipo_tramite_id (FK)`, `estatus`, `prioridad`, `paso_actual_id (FK|NULL)`, `vence_en`, `iniciado_en`, `finalizado_en`, `sla_incumplido`)
  - Índices: `(estatus)`, `(alumno_id)`, `(tipo_tramite_id, estatus, iniciado_en DESC)`
- `asignaciones_tramite` (`id`, `tramite_id (FK)`, `paso_id (FK)`, `asignado_a_usuario_id (FK|NULL)`, `asignado_en`, `liberado_en`, `estatus`)
- `eventos_tramite` (`id`, `tramite_id (FK)`, `actor_usuario_id (FK|NULL)`, `tipo_evento`, `datos`, `creado_en`)
  - Índices: `(tramite_id, creado_en DESC)`

### Documentos y versionado
- `documentos` (`id`, `tramite_id (FK)`, `requisito_id (FK)`, `tipo_documento_id (FK)`, `version_actual`, `estatus`)
  - Índices: UQ `(tramite_id, requisito_id)`, `(tramite_id, estatus)`
- `versiones_documento` (`id`, `documento_id (FK)`, `version`, `nombre_archivo`, `clave_almacen`, `mime`, `tamano_bytes`, `sha256`, `subido_por_usuario_id (FK)`, `subido_en`, `estatus`, `motivo_rechazo`)
  - Índices: UQ `(documento_id, version)`, `sha256`, `(documento_id, subido_en DESC)`
- `revisiones_documento` (`id`, `version_documento_id (FK)`, `revisor_usuario_id (FK)`, `accion`, `comentarios`, `creado_en`)

### Validaciones automáticas y OCR
- `validaciones_archivo` (`id`, `version_documento_id (FK)`, `mime_detectado`, `mime_valido`, `tamano_valido`, `duplicado`, `datos_validacion`, `validado_en`)
- `escaneos_antivirus` (`id`, `version_documento_id (FK)`, `motor`, `estatus`, `firma`, `escaneado_en`)
- `ocr_texto_documento` (`version_documento_id (PK, FK)`, `idioma`, `texto`)
  - FTI: catálogo `catalogo_ft`; índice de texto completo en `texto (LANGUAGE 3082)`

### Notificaciones y auditoría
- `notificaciones` (`id`, `usuario_id (FK)`, `titulo`, `mensaje`, `tipo`, `leida`, `creado_en`)
  - Índices: `(usuario_id, leida, creado_en DESC)`
- `bitacora_auditoria` (`id`, `ocurrio_en`, `actor_usuario_id (FK|NULL)`, `accion`, `entidad`, `entidad_id`, `datos_antes`, `datos_despues`, `ip`, `user_agent`)

## Diagrama ERD (referencia)
Consulta `docs/casos-uso.md` y los ERD previos compartidos; el script `sql/univ_docs_mvp.sql` corresponde a este modelo.

## Consideraciones de Desempeño
- Usar `NVARCHAR` y evitar `TEXT` (obsoleto).
- Índices compuestos alineados a consultas y filtros comunes.
- FTI solo en columnas consultadas por texto (`ocr_texto_documento.texto`).
- Evitar transacciones largas; versionado y validaciones por versión.

## Backups y Mantenimiento
- Recovery model: `SIMPLE` (dev), `FULL` (prod).
- Jobs: backups, reindexación e integridad.
- Monitoreo: tamaño de `FTI`, fragmentación de índices, crecimiento de logs.
