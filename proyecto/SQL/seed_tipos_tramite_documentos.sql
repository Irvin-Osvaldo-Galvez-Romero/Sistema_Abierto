USE univ_docs;
GO

-- ====== CREAR TIPOS DE TRÁMITE ======
IF NOT EXISTS (SELECT 1 FROM tipos_tramite WHERE clave = 'REINSCRIPCION')
INSERT INTO tipos_tramite (clave, nombre, descripcion, sla_dias, activo)
VALUES ('REINSCRIPCION', N'Reinscripción', N'Trámite de reinscripción para alumnos regulares', 5, 1);

IF NOT EXISTS (SELECT 1 FROM tipos_tramite WHERE clave = 'INSCRIPCION')
INSERT INTO tipos_tramite (clave, nombre, descripcion, sla_dias, activo)
VALUES ('INSCRIPCION', N'Inscripción', N'Trámite de inscripción para alumnos de nuevo ingreso', 7, 1);

IF NOT EXISTS (SELECT 1 FROM tipos_tramite WHERE clave = 'KARDEX')
INSERT INTO tipos_tramite (clave, nombre, descripcion, sla_dias, activo)
VALUES ('KARDEX', N'Solicitud de Kárdex', N'Solicitud de historial académico oficial', 3, 1);

PRINT 'Tipos de trámite creados correctamente';
GO

-- ====== CREAR TIPOS DE DOCUMENTO ======
IF NOT EXISTS (SELECT 1 FROM tipos_documento WHERE clave = 'SOLICITUD')
INSERT INTO tipos_documento (clave, nombre, mimes_permitidos, tam_max_mb, requiere_ocr)
VALUES ('SOLICITUD', N'Solicitud de Reinscripción/Inscripción', 'application/pdf', 5, 0);

IF NOT EXISTS (SELECT 1 FROM tipos_documento WHERE clave = 'KARDEX')
INSERT INTO tipos_documento (clave, nombre, mimes_permitidos, tam_max_mb, requiere_ocr)
VALUES ('KARDEX', N'Kárdex Académico', 'application/pdf', 5, 1);

IF NOT EXISTS (SELECT 1 FROM tipos_documento WHERE clave = 'PAGO')
INSERT INTO tipos_documento (clave, nombre, mimes_permitidos, tam_max_mb, requiere_ocr)
VALUES ('PAGO', N'Comprobante de Pago', 'application/pdf,image/jpeg,image/png', 5, 0);

IF NOT EXISTS (SELECT 1 FROM tipos_documento WHERE clave = 'INE')
INSERT INTO tipos_documento (clave, nombre, mimes_permitidos, tam_max_mb, requiere_ocr)
VALUES ('INE', N'Identificación Oficial', 'application/pdf,image/jpeg,image/png', 5, 0);

IF NOT EXISTS (SELECT 1 FROM tipos_documento WHERE clave = 'CURP')
INSERT INTO tipos_documento (clave, nombre, mimes_permitidos, tam_max_mb, requiere_ocr)
VALUES ('CURP', N'CURP', 'application/pdf,image/jpeg,image/png', 5, 0);

PRINT 'Tipos de documento creados correctamente';
GO

-- ====== CREAR REQUISITOS PARA REINSCRIPCIÓN ======
DECLARE @tipoReinscripcion BIGINT = (SELECT id FROM tipos_tramite WHERE clave = 'REINSCRIPCION');
DECLARE @docSolicitud BIGINT = (SELECT id FROM tipos_documento WHERE clave = 'SOLICITUD');
DECLARE @docKardex BIGINT = (SELECT id FROM tipos_documento WHERE clave = 'KARDEX');
DECLARE @docPago BIGINT = (SELECT id FROM tipos_documento WHERE clave = 'PAGO');

IF @tipoReinscripcion IS NOT NULL AND @docSolicitud IS NOT NULL
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM requisitos_tramite 
        WHERE tipo_tramite_id = @tipoReinscripcion 
        AND tipo_documento_id = @docSolicitud
        AND programa_id IS NULL
    )
    INSERT INTO requisitos_tramite (tipo_tramite_id, programa_id, tipo_documento_id, obligatorio, orden)
    VALUES (@tipoReinscripcion, NULL, @docSolicitud, 1, 1);
END

IF @tipoReinscripcion IS NOT NULL AND @docKardex IS NOT NULL
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM requisitos_tramite 
        WHERE tipo_tramite_id = @tipoReinscripcion 
        AND tipo_documento_id = @docKardex
        AND programa_id IS NULL
    )
    INSERT INTO requisitos_tramite (tipo_tramite_id, programa_id, tipo_documento_id, obligatorio, orden)
    VALUES (@tipoReinscripcion, NULL, @docKardex, 1, 2);
END

IF @tipoReinscripcion IS NOT NULL AND @docPago IS NOT NULL
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM requisitos_tramite 
        WHERE tipo_tramite_id = @tipoReinscripcion 
        AND tipo_documento_id = @docPago
        AND programa_id IS NULL
    )
    INSERT INTO requisitos_tramite (tipo_tramite_id, programa_id, tipo_documento_id, obligatorio, orden)
    VALUES (@tipoReinscripcion, NULL, @docPago, 1, 3);
END

PRINT 'Requisitos para reinscripción creados correctamente';
GO

-- ====== VERIFICACIÓN ======
PRINT '';
PRINT '========================================';
PRINT 'RESUMEN DE TIPOS DE TRÁMITE Y DOCUMENTOS';
PRINT '========================================';

SELECT 
    'Tipos de Trámite' AS Tabla,
    COUNT(*) AS Total
FROM tipos_tramite
UNION ALL
SELECT 
    'Tipos de Documento' AS Tabla,
    COUNT(*) AS Total
FROM tipos_documento
UNION ALL
SELECT 
    'Requisitos Configurados' AS Tabla,
    COUNT(*) AS Total
FROM requisitos_tramite;

PRINT '';
PRINT 'Detalle de Requisitos:';
SELECT 
    tt.nombre AS Tramite,
    td.nombre AS Documento_Requerido,
    rt.obligatorio AS Obligatorio,
    rt.orden AS Orden
FROM requisitos_tramite rt
INNER JOIN tipos_tramite tt ON tt.id = rt.tipo_tramite_id
INNER JOIN tipos_documento td ON td.id = rt.tipo_documento_id
WHERE rt.programa_id IS NULL
ORDER BY tt.nombre, rt.orden;

GO
