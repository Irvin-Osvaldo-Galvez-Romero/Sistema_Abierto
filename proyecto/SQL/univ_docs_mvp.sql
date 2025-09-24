/* ====== BASE Y CATÁLOGO FTI ====== */
IF DB_ID(N'univ_docs') IS NULL
BEGIN
    CREATE DATABASE univ_docs;
END;
GO
USE univ_docs;
GO

IF NOT EXISTS (SELECT 1 FROM sys.fulltext_catalogs WHERE name = 'catalogo_ft')
    CREATE FULLTEXT CATALOG catalogo_ft AS DEFAULT;
GO

/* ====== IDENTIDAD Y RBAC ====== */
CREATE TABLE usuarios (
    id BIGINT IDENTITY PRIMARY KEY,
    guid UNIQUEIDENTIFIER NOT NULL DEFAULT NEWID() UNIQUE,
    correo NVARCHAR(255) NOT NULL UNIQUE,
    hash_contrasena NVARCHAR(255) NOT NULL,
    nombre NVARCHAR(100) NOT NULL,
    apellidos NVARCHAR(100) NOT NULL,
    activo BIT NOT NULL DEFAULT 1,
    ultimo_acceso DATETIME2 NULL,
    creado_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    actualizado_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE roles (
    id BIGINT IDENTITY PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL UNIQUE,
    descripcion NVARCHAR(255) NULL
);

CREATE TABLE permisos (
    id BIGINT IDENTITY PRIMARY KEY,
    codigo NVARCHAR(150) NOT NULL UNIQUE,
    descripcion NVARCHAR(255) NULL
);

CREATE TABLE usuarios_roles (
    usuario_id BIGINT NOT NULL FOREIGN KEY REFERENCES usuarios(id),
    rol_id BIGINT NOT NULL FOREIGN KEY REFERENCES roles(id),
    PRIMARY KEY (usuario_id, rol_id)
);

CREATE TABLE roles_permisos (
    rol_id BIGINT NOT NULL FOREIGN KEY REFERENCES roles(id),
    permiso_id BIGINT NOT NULL FOREIGN KEY REFERENCES permisos(id),
    PRIMARY KEY (rol_id, permiso_id)
);

/* ====== ACADÉMICO ====== */
CREATE TABLE departamentos (
    id BIGINT IDENTITY PRIMARY KEY,
    clave NVARCHAR(50) NOT NULL UNIQUE,
    nombre NVARCHAR(150) NOT NULL
);

CREATE TABLE programas (
    id BIGINT IDENTITY PRIMARY KEY,
    departamento_id BIGINT NOT NULL FOREIGN KEY REFERENCES departamentos(id),
    clave NVARCHAR(50) NOT NULL UNIQUE,
    nombre NVARCHAR(150) NOT NULL,
    nivel NVARCHAR(50) NOT NULL
);

CREATE TABLE alumnos (
    id BIGINT IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE FOREIGN KEY REFERENCES usuarios(id),
    matricula NVARCHAR(30) NOT NULL UNIQUE,
    programa_id BIGINT NOT NULL FOREIGN KEY REFERENCES programas(id),
    semestre INT NULL,
    estatus NVARCHAR(30) NOT NULL DEFAULT N'activo'
);

CREATE TABLE personal (
    id BIGINT IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL UNIQUE FOREIGN KEY REFERENCES usuarios(id),
    puesto NVARCHAR(100) NULL,
    departamento_id BIGINT NULL FOREIGN KEY REFERENCES departamentos(id)
);

/* ====== CATÁLOGOS DE TRÁMITES Y FLUJOS ====== */
CREATE TABLE tipos_tramite (
    id BIGINT IDENTITY PRIMARY KEY,
    clave NVARCHAR(50) NOT NULL UNIQUE,
    nombre NVARCHAR(150) NOT NULL,
    descripcion NVARCHAR(MAX) NULL,
    sla_dias INT NOT NULL DEFAULT 5,
    activo BIT NOT NULL DEFAULT 1
);

CREATE TABLE tipos_documento (
    id BIGINT IDENTITY PRIMARY KEY,
    clave NVARCHAR(50) NOT NULL UNIQUE,
    nombre NVARCHAR(150) NOT NULL,
    mimes_permitidos NVARCHAR(500) NULL,
    tam_max_mb INT NOT NULL DEFAULT 10,
    requiere_ocr BIT NOT NULL DEFAULT 0
);

CREATE TABLE requisitos_tramite (
    id BIGINT IDENTITY PRIMARY KEY,
    tipo_tramite_id BIGINT NOT NULL FOREIGN KEY REFERENCES tipos_tramite(id),
    programa_id BIGINT NULL FOREIGN KEY REFERENCES programas(id),
    tipo_documento_id BIGINT NOT NULL FOREIGN KEY REFERENCES tipos_documento(id),
    obligatorio BIT NOT NULL DEFAULT 1,
    orden INT NOT NULL DEFAULT 1
);
CREATE UNIQUE INDEX UX_req_tramite
ON requisitos_tramite(tipo_tramite_id, ISNULL(programa_id, 0), tipo_documento_id, orden);

CREATE TABLE pasos_flujo (
    id BIGINT IDENTITY PRIMARY KEY,
    tipo_tramite_id BIGINT NOT NULL FOREIGN KEY REFERENCES tipos_tramite(id),
    orden INT NOT NULL,
    nombre NVARCHAR(100) NOT NULL,
    rol_requerido NVARCHAR(100) NOT NULL,
    regla_asignacion NVARCHAR(200) NULL
);
CREATE UNIQUE INDEX UX_pasos_flujo ON pasos_flujo(tipo_tramite_id, orden);

/* ====== INSTANCIAS DE TRÁMITE ====== */
CREATE TABLE tramites_alumno (
    id BIGINT IDENTITY PRIMARY KEY,
    alumno_id BIGINT NOT NULL FOREIGN KEY REFERENCES alumnos(id),
    tipo_tramite_id BIGINT NOT NULL FOREIGN KEY REFERENCES tipos_tramite(id),
    estatus NVARCHAR(30) NOT NULL DEFAULT N'pendiente',
    prioridad NVARCHAR(10) NOT NULL DEFAULT N'normal',
    paso_actual_id BIGINT NULL FOREIGN KEY REFERENCES pasos_flujo(id),
    vence_en DATETIME2 NULL,
    iniciado_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    finalizado_en DATETIME2 NULL,
    sla_incumplido BIT NOT NULL DEFAULT 0
);
CREATE INDEX IX_tramites_alumno_estatus ON tramites_alumno(estatus);
CREATE INDEX IX_tramites_alumno_alumno ON tramites_alumno(alumno_id);

CREATE TABLE asignaciones_tramite (
    id BIGINT IDENTITY PRIMARY KEY,
    tramite_id BIGINT NOT NULL FOREIGN KEY REFERENCES tramites_alumno(id),
    paso_id BIGINT NOT NULL FOREIGN KEY REFERENCES pasos_flujo(id),
    asignado_a_usuario_id BIGINT NULL FOREIGN KEY REFERENCES usuarios(id),
    asignado_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    liberado_en DATETIME2 NULL,
    estatus NVARCHAR(30) NOT NULL DEFAULT N'abierto'
);

CREATE TABLE eventos_tramite (
    id BIGINT IDENTITY PRIMARY KEY,
    tramite_id BIGINT NOT NULL FOREIGN KEY REFERENCES tramites_alumno(id),
    actor_usuario_id BIGINT NULL FOREIGN KEY REFERENCES usuarios(id),
    tipo_evento NVARCHAR(50) NOT NULL,
    datos NVARCHAR(MAX) NULL,
    creado_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

/* ====== DOCUMENTOS Y VERSIONADO ====== */
CREATE TABLE documentos (
    id BIGINT IDENTITY PRIMARY KEY,
    tramite_id BIGINT NOT NULL FOREIGN KEY REFERENCES tramites_alumno(id),
    requisito_id BIGINT NOT NULL FOREIGN KEY REFERENCES requisitos_tramite(id),
    tipo_documento_id BIGINT NOT NULL FOREIGN KEY REFERENCES tipos_documento(id),
    version_actual INT NOT NULL DEFAULT 1,
    estatus NVARCHAR(20) NOT NULL DEFAULT N'pendiente'
);
CREATE UNIQUE INDEX UX_documento_por_tramite ON documentos(tramite_id, requisito_id);

CREATE TABLE versiones_documento (
    id BIGINT IDENTITY PRIMARY KEY,
    documento_id BIGINT NOT NULL FOREIGN KEY REFERENCES documentos(id),
    version INT NOT NULL,
    nombre_archivo NVARCHAR(255) NOT NULL,
    clave_almacen NVARCHAR(500) NOT NULL,
    mime NVARCHAR(150) NOT NULL,
    tamano_bytes BIGINT NOT NULL,
    sha256 NVARCHAR(64) NOT NULL,
    subido_por_usuario_id BIGINT NOT NULL FOREIGN KEY REFERENCES usuarios(id),
    subido_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    estatus NVARCHAR(20) NOT NULL DEFAULT N'pendiente',
    motivo_rechazo NVARCHAR(500) NULL
);
CREATE UNIQUE INDEX UX_versiones_documento ON versiones_documento(documento_id, version);
CREATE INDEX IX_versiones_sha ON versiones_documento(sha256);

/* ====== VALIDACIONES AUTOMÁTICAS ====== */
CREATE TABLE validaciones_archivo (
    id BIGINT IDENTITY PRIMARY KEY,
    version_documento_id BIGINT NOT NULL FOREIGN KEY REFERENCES versiones_documento(id),
    mime_detectado NVARCHAR(150) NOT NULL,
    mime_valido BIT NOT NULL,
    tamano_valido BIT NOT NULL,
    duplicado BIT NOT NULL,
    datos_validacion NVARCHAR(MAX) NULL,
    validado_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE escaneos_antivirus (
    id BIGINT IDENTITY PRIMARY KEY,
    version_documento_id BIGINT NOT NULL FOREIGN KEY REFERENCES versiones_documento(id),
    motor NVARCHAR(50) NOT NULL,
    estatus NVARCHAR(20) NOT NULL,
    firma NVARCHAR(200) NULL,
    escaneado_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

/* ====== OCR Y BÚSQUEDA ====== */
CREATE TABLE ocr_texto_documento (
    version_documento_id BIGINT NOT NULL PRIMARY KEY FOREIGN KEY REFERENCES versiones_documento(id),
    idioma NVARCHAR(10) NULL,
    texto NVARCHAR(MAX) NOT NULL
);
CREATE UNIQUE INDEX UX_ocr_version ON ocr_texto_documento(version_documento_id);

IF NOT EXISTS (SELECT 1 FROM sys.fulltext_indexes WHERE object_id = OBJECT_ID('ocr_texto_documento'))
BEGIN
    CREATE FULLTEXT INDEX ON ocr_texto_documento
    (
        texto LANGUAGE 3082
    )
    KEY INDEX UX_ocr_version
    WITH CHANGE_TRACKING AUTO;
END
GO

/* ====== REVISIÓN Y NOTIFICACIONES ====== */
CREATE TABLE revisiones_documento (
    id BIGINT IDENTITY PRIMARY KEY,
    version_documento_id BIGINT NOT NULL FOREIGN KEY REFERENCES versiones_documento(id),
    revisor_usuario_id BIGINT NOT NULL FOREIGN KEY REFERENCES usuarios(id),
    accion NVARCHAR(20) NOT NULL,
    comentarios NVARCHAR(MAX) NULL,
    creado_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

CREATE TABLE notificaciones (
    id BIGINT IDENTITY PRIMARY KEY,
    usuario_id BIGINT NOT NULL FOREIGN KEY REFERENCES usuarios(id),
    titulo NVARCHAR(255) NOT NULL,
    mensaje NVARCHAR(MAX) NOT NULL,
    tipo NVARCHAR(50) NOT NULL,
    leida BIT NOT NULL DEFAULT 0,
    creado_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME()
);

/* ====== AUDITORÍA MÍNIMA ====== */
CREATE TABLE bitacora_auditoria (
    id BIGINT IDENTITY PRIMARY KEY,
    ocurrio_en DATETIME2 NOT NULL DEFAULT SYSUTCDATETIME(),
    actor_usuario_id BIGINT NULL FOREIGN KEY REFERENCES usuarios(id),
    accion NVARCHAR(100) NOT NULL,
    entidad NVARCHAR(100) NOT NULL,
    entidad_id BIGINT NOT NULL,
    datos_antes NVARCHAR(MAX) NULL,
    datos_despues NVARCHAR(MAX) NULL,
    ip NVARCHAR(45) NULL,
    user_agent NVARCHAR(255) NULL
);

/* ====== ÍNDICES ADICIONALES ====== */
CREATE INDEX IX_tramites_tipo_estatus_fecha ON tramites_alumno(tipo_tramite_id, estatus, iniciado_en DESC);
CREATE INDEX IX_documentos_por_tramite_estatus ON documentos(tramite_id, estatus);
CREATE INDEX IX_versiones_por_doc_fecha ON versiones_documento(documento_id, subido_en DESC);
CREATE INDEX IX_eventos_tramite_fecha ON eventos_tramite(tramite_id, creado_en DESC);
CREATE INDEX IX_notificaciones_usuario_leida_fecha ON notificaciones(usuario_id, leida, creado_en DESC);


