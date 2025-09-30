USE univ_docs;
GO

-- ====== CREAR ROLES SI NO EXISTEN ======
IF NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'Alumno')
    INSERT INTO roles (nombre, descripcion) VALUES ('Alumno', 'Estudiante de la universidad');

IF NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'Administrador')
    INSERT INTO roles (nombre, descripcion) VALUES ('Administrador', 'Administrador del sistema');

IF NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'Docente')
    INSERT INTO roles (nombre, descripcion) VALUES ('Docente', 'Profesor de la universidad');

IF NOT EXISTS (SELECT 1 FROM roles WHERE nombre = 'Administrativo')
    INSERT INTO roles (nombre, descripcion) VALUES ('Administrativo', 'Personal administrativo');
GO

-- ====== CREAR PERMISOS BÁSICOS ======
IF NOT EXISTS (SELECT 1 FROM permisos WHERE codigo = 'alumnos.ver')
    INSERT INTO permisos (codigo, descripcion) VALUES ('alumnos.ver', 'Ver listado de alumnos');

IF NOT EXISTS (SELECT 1 FROM permisos WHERE codigo = 'alumnos.editar')
    INSERT INTO permisos (codigo, descripcion) VALUES ('alumnos.editar', 'Editar información de alumnos');

IF NOT EXISTS (SELECT 1 FROM permisos WHERE codigo = 'tramites.revisar')
    INSERT INTO permisos (codigo, descripcion) VALUES ('tramites.revisar', 'Revisar trámites');

IF NOT EXISTS (SELECT 1 FROM permisos WHERE codigo = 'sistema.admin')
    INSERT INTO permisos (codigo, descripcion) VALUES ('sistema.admin', 'Administración completa del sistema');
GO

-- ====== ASIGNAR PERMISOS A ROLES ======
DECLARE @rolAlumno BIGINT = (SELECT id FROM roles WHERE nombre = 'Alumno');
DECLARE @rolAdmin BIGINT = (SELECT id FROM roles WHERE nombre = 'Administrador');
DECLARE @rolDocente BIGINT = (SELECT id FROM roles WHERE nombre = 'Docente');

DECLARE @permisoVerAlumnos BIGINT = (SELECT id FROM permisos WHERE codigo = 'alumnos.ver');
DECLARE @permisoEditarAlumnos BIGINT = (SELECT id FROM permisos WHERE codigo = 'alumnos.editar');
DECLARE @permisoRevisarTramites BIGINT = (SELECT id FROM permisos WHERE codigo = 'tramites.revisar');
DECLARE @permisoAdmin BIGINT = (SELECT id FROM permisos WHERE codigo = 'sistema.admin');

-- Administrador tiene todos los permisos
IF NOT EXISTS (SELECT 1 FROM roles_permisos WHERE rol_id = @rolAdmin AND permiso_id = @permisoVerAlumnos)
    INSERT INTO roles_permisos (rol_id, permiso_id) VALUES (@rolAdmin, @permisoVerAlumnos);

IF NOT EXISTS (SELECT 1 FROM roles_permisos WHERE rol_id = @rolAdmin AND permiso_id = @permisoEditarAlumnos)
    INSERT INTO roles_permisos (rol_id, permiso_id) VALUES (@rolAdmin, @permisoEditarAlumnos);

IF NOT EXISTS (SELECT 1 FROM roles_permisos WHERE rol_id = @rolAdmin AND permiso_id = @permisoRevisarTramites)
    INSERT INTO roles_permisos (rol_id, permiso_id) VALUES (@rolAdmin, @permisoRevisarTramites);

IF NOT EXISTS (SELECT 1 FROM roles_permisos WHERE rol_id = @rolAdmin AND permiso_id = @permisoAdmin)
    INSERT INTO roles_permisos (rol_id, permiso_id) VALUES (@rolAdmin, @permisoAdmin);

-- Docente puede ver alumnos y revisar trámites
IF NOT EXISTS (SELECT 1 FROM roles_permisos WHERE rol_id = @rolDocente AND permiso_id = @permisoVerAlumnos)
    INSERT INTO roles_permisos (rol_id, permiso_id) VALUES (@rolDocente, @permisoVerAlumnos);

IF NOT EXISTS (SELECT 1 FROM roles_permisos WHERE rol_id = @rolDocente AND permiso_id = @permisoRevisarTramites)
    INSERT INTO roles_permisos (rol_id, permiso_id) VALUES (@rolDocente, @permisoRevisarTramites);
GO

-- ====== CREAR USUARIO ALUMNO DE PRUEBA ======
-- Contraseña: Alumno123!
-- Hash generado con bcrypt (10 rounds)
DECLARE @usuarioAlumnoId BIGINT;
DECLARE @programaId BIGINT = (SELECT TOP 1 id FROM programas ORDER BY id);

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'alumno@uni.mx')
BEGIN
    INSERT INTO usuarios (correo, hash_contrasena, nombre, apellidos, activo)
    VALUES ('alumno@uni.mx', '$2a$10$iOaVFEYaoS7n.MebW5ZwhuR8QFdzmkv3X2hVlwevOnvt2LfzEXadi', 'Juan', 'Pérez López', 1);
    
    SET @usuarioAlumnoId = SCOPE_IDENTITY();
    
    -- Asignar rol de Alumno
    DECLARE @rolAlumnoId BIGINT = (SELECT id FROM roles WHERE nombre = 'Alumno');
    INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (@usuarioAlumnoId, @rolAlumnoId);
    
    -- Crear registro en tabla alumnos
    IF @programaId IS NOT NULL
    BEGIN
        INSERT INTO alumnos (usuario_id, matricula, programa_id, semestre, estatus)
        VALUES (@usuarioAlumnoId, 'A001', @programaId, 5, 'activo');
    END
    
    PRINT 'Usuario alumno creado: alumno@uni.mx / Alumno123!';
END
ELSE
    PRINT 'El usuario alumno@uni.mx ya existe';
GO

-- ====== CREAR USUARIO ADMINISTRADOR DE PRUEBA ======
-- Contraseña: Admin123!
-- Hash generado con bcrypt (10 rounds)
DECLARE @usuarioAdminId BIGINT;
DECLARE @deptoId BIGINT = (SELECT TOP 1 id FROM departamentos ORDER BY id);

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'admin@uni.mx')
BEGIN
    INSERT INTO usuarios (correo, hash_contrasena, nombre, apellidos, activo)
    VALUES ('admin@uni.mx', '$2a$10$AC68lVgnKBO3Xvy5ssCUveeodpB3YHKFU82MdWC.bKf.v2kx05u2G', 'María', 'González Admin', 1);
    
    SET @usuarioAdminId = SCOPE_IDENTITY();
    
    -- Asignar rol de Administrador
    DECLARE @rolAdminId BIGINT = (SELECT id FROM roles WHERE nombre = 'Administrador');
    INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (@usuarioAdminId, @rolAdminId);
    
    -- Crear registro en tabla personal
    IF @deptoId IS NOT NULL
    BEGIN
        INSERT INTO personal (usuario_id, puesto, departamento_id)
        VALUES (@usuarioAdminId, 'Administrador del Sistema', @deptoId);
    END
    
    PRINT 'Usuario administrador creado: admin@uni.mx / Admin123!';
END
ELSE
    PRINT 'El usuario admin@uni.mx ya existe';
GO

-- ====== CREAR USUARIO DOCENTE DE PRUEBA ======
-- Contraseña: Docente123!
DECLARE @usuarioDocenteId BIGINT;
DECLARE @deptoId2 BIGINT = (SELECT TOP 1 id FROM departamentos ORDER BY id);

IF NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'docente@uni.mx')
BEGIN
    INSERT INTO usuarios (correo, hash_contrasena, nombre, apellidos, activo)
    VALUES ('docente@uni.mx', '$2a$10$ESmLbVv3ohdhshsRUhbXO.9ikiLUIOnwk3wPpgWGhRvPXxRX/d6e6', 'Carlos', 'Ramírez Profesor', 1);
    
    SET @usuarioDocenteId = SCOPE_IDENTITY();
    
    -- Asignar rol de Docente
    DECLARE @rolDocenteId BIGINT = (SELECT id FROM roles WHERE nombre = 'Docente');
    INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (@usuarioDocenteId, @rolDocenteId);
    
    -- Crear registro en tabla personal
    IF @deptoId2 IS NOT NULL
    BEGIN
        INSERT INTO personal (usuario_id, puesto, departamento_id)
        VALUES (@usuarioDocenteId, 'Profesor Titular', @deptoId2);
    END
    
    PRINT 'Usuario docente creado: docente@uni.mx / Docente123!';
END
ELSE
    PRINT 'El usuario docente@uni.mx ya existe';
GO

-- ====== RESUMEN ======
PRINT '';
PRINT '========================================';
PRINT 'USUARIOS DE PRUEBA CREADOS';
PRINT '========================================';
PRINT 'Alumno:';
PRINT '  Email: alumno@uni.mx';
PRINT '  Contraseña: Alumno123!';
PRINT '';
PRINT 'Administrador:';
PRINT '  Email: admin@uni.mx';
PRINT '  Contraseña: Admin123!';
PRINT '';
PRINT 'Docente:';
PRINT '  Email: docente@uni.mx';
PRINT '  Contraseña: Docente123!';
PRINT '========================================';
GO

-- Verificar roles asignados
SELECT 
    u.correo,
    u.nombre + ' ' + u.apellidos AS nombre_completo,
    r.nombre AS rol
FROM usuarios u
INNER JOIN usuarios_roles ur ON ur.usuario_id = u.id
INNER JOIN roles r ON r.id = ur.rol_id
WHERE u.correo IN ('alumno@uni.mx', 'admin@uni.mx', 'docente@uni.mx')
ORDER BY u.correo;
