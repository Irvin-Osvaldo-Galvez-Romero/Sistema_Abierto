USE univ_docs;
GO

IF NOT EXISTS (SELECT 1 FROM departamentos WHERE clave = 'ING')
INSERT INTO departamentos(clave, nombre) VALUES('ING', N'Ingeniería');

DECLARE @dep BIGINT = (SELECT TOP 1 id FROM departamentos WHERE clave = 'ING');

IF NOT EXISTS (SELECT 1 FROM programas WHERE clave = 'SIS')
INSERT INTO programas(departamento_id, clave, nombre, nivel)
VALUES(@dep, 'SIS', N'Ingeniería en Sistemas', N'Licenciatura');

SELECT TOP 1 id, clave, nombre FROM programas ORDER BY id;


