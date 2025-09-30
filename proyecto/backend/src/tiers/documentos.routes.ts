import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { getPool, sql } from './db.js';

export const documentosRouter = Router();

// Middleware JWT
function jwtMiddleware(req: any, res: any, next: any) {
  const hdr = req.headers.authorization as string | undefined;
  if (!hdr?.startsWith('Bearer ')) return res.status(401).json({ error: 'No autorizado' });
  const token = hdr.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret') as any;
    req.user = { id: Number(payload.sub) };
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// GET /documentos/mis-documentos - Obtener documentos del alumno actual
documentosRouter.get('/mis-documentos', jwtMiddleware, async (req: any, res) => {
  try {
    const pool = await getPool();
    
    // Obtener alumno_id del usuario
    const alumnoQ = await pool.request()
      .input('usuario_id', sql.BigInt, req.user.id)
      .query('SELECT id FROM alumnos WHERE usuario_id = @usuario_id');
    
    if (!alumnoQ.recordset.length) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    
    const alumnoId = alumnoQ.recordset[0].id;
    
    // Obtener trámite activo del alumno
    const tramiteQ = await pool.request()
      .input('alumno_id', sql.BigInt, alumnoId)
      .query(`
        SELECT TOP 1 id, tipo_tramite_id, estatus
        FROM tramites_alumno
        WHERE alumno_id = @alumno_id
        ORDER BY iniciado_en DESC
      `);
    
    if (!tramiteQ.recordset.length) {
      return res.json({ documentos: [], tramiteActual: null });
    }
    
    const tramite = tramiteQ.recordset[0];
    
    // Obtener documentos del trámite
    const docsQ = await pool.request()
      .input('tramite_id', sql.BigInt, tramite.id)
      .query(`
        SELECT 
          d.id,
          d.estatus,
          d.version_actual,
          td.nombre AS tipo_documento,
          td.clave AS tipo_clave,
          rt.obligatorio,
          vd.nombre_archivo,
          vd.subido_en,
          vd.estatus AS version_estatus,
          vd.motivo_rechazo
        FROM documentos d
        INNER JOIN requisitos_tramite rt ON rt.id = d.requisito_id
        INNER JOIN tipos_documento td ON td.id = d.tipo_documento_id
        LEFT JOIN versiones_documento vd ON vd.documento_id = d.id AND vd.version = d.version_actual
        WHERE d.tramite_id = @tramite_id
        ORDER BY rt.orden
      `);
    
    res.json({
      tramiteActual: tramite,
      documentos: docsQ.recordset
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// POST /documentos/subir - Simular subida de documento (sin almacenamiento real)
const subirDocumentoSchema = z.object({
  tipoDocumento: z.string(),
  nombreArchivo: z.string(),
  tamanoBytes: z.number()
});

documentosRouter.post('/subir', jwtMiddleware, async (req: any, res) => {
  const parsed = subirDocumentoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  
  const { tipoDocumento, nombreArchivo, tamanoBytes } = parsed.data;
  
  try {
    const pool = await getPool();
    
    // Obtener alumno_id
    const alumnoQ = await pool.request()
      .input('usuario_id', sql.BigInt, req.user.id)
      .query('SELECT id FROM alumnos WHERE usuario_id = @usuario_id');
    
    if (!alumnoQ.recordset.length) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    
    const alumnoId = alumnoQ.recordset[0].id;
    
    // Obtener o crear trámite activo
    let tramiteQ = await pool.request()
      .input('alumno_id', sql.BigInt, alumnoId)
      .query(`
        SELECT TOP 1 id 
        FROM tramites_alumno 
        WHERE alumno_id = @alumno_id AND estatus IN ('pendiente', 'en_proceso')
        ORDER BY iniciado_en DESC
      `);
    
    let tramiteId;
    
    if (!tramiteQ.recordset.length) {
      // Crear nuevo trámite de reinscripción
      const tipoTramiteQ = await pool.request()
        .query("SELECT TOP 1 id FROM tipos_tramite WHERE clave = 'REINSCRIPCION' OR nombre LIKE '%reinscripci%'");
      
      if (!tipoTramiteQ.recordset.length) {
        return res.status(400).json({ error: 'No hay tipos de trámite configurados. Ejecuta los scripts de seed.' });
      }
      
      const nuevoTramite = await pool.request()
        .input('alumno_id', sql.BigInt, alumnoId)
        .input('tipo_tramite_id', sql.BigInt, tipoTramiteQ.recordset[0].id)
        .query(`
          INSERT INTO tramites_alumno (alumno_id, tipo_tramite_id, estatus)
          OUTPUT inserted.id
          VALUES (@alumno_id, @tipo_tramite_id, 'en_proceso')
        `);
      
      tramiteId = nuevoTramite.recordset[0].id;
    } else {
      tramiteId = tramiteQ.recordset[0].id;
    }
    
    // Obtener tipo_documento_id basado en la clave
    const tipoDocQ = await pool.request()
      .input('clave', sql.NVarChar(50), tipoDocumento.toUpperCase())
      .query('SELECT id FROM tipos_documento WHERE clave = @clave');
    
    if (!tipoDocQ.recordset.length) {
      return res.status(400).json({ error: 'Tipo de documento no válido' });
    }
    
    const tipoDocumentoId = tipoDocQ.recordset[0].id;
    
    // Obtener requisito_id
    const requisitoQ = await pool.request()
      .input('tipo_tramite_id', sql.BigInt, tramiteQ.recordset.length ? tramiteQ.recordset[0].id : tramiteId)
      .input('tipo_documento_id', sql.BigInt, tipoDocumentoId)
      .query(`
        SELECT rt.id 
        FROM requisitos_tramite rt
        INNER JOIN tramites_alumno t ON t.tipo_tramite_id = rt.tipo_tramite_id
        WHERE t.id = @tipo_tramite_id AND rt.tipo_documento_id = @tipo_documento_id
      `);
    
    // Si no existe requisito, usar un genérico
    let requisitoId = requisitoQ.recordset.length ? requisitoQ.recordset[0].id : null;
    
    // Crear o actualizar documento
    const docExistente = await pool.request()
      .input('tramite_id', sql.BigInt, tramiteId)
      .input('tipo_documento_id', sql.BigInt, tipoDocumentoId)
      .query(`
        SELECT id, version_actual 
        FROM documentos 
        WHERE tramite_id = @tramite_id AND tipo_documento_id = @tipo_documento_id
      `);
    
    let documentoId;
    let version = 1;
    
    if (docExistente.recordset.length) {
      documentoId = docExistente.recordset[0].id;
      version = docExistente.recordset[0].version_actual + 1;
      
      await pool.request()
        .input('id', sql.BigInt, documentoId)
        .input('version', sql.Int, version)
        .query('UPDATE documentos SET version_actual = @version, estatus = N\'en_revision\' WHERE id = @id');
    } else {
      const nuevoDoc = await pool.request()
        .input('tramite_id', sql.BigInt, tramiteId)
        .input('requisito_id', sql.BigInt, requisitoId || 0)
        .input('tipo_documento_id', sql.BigInt, tipoDocumentoId)
        .query(`
          INSERT INTO documentos (tramite_id, requisito_id, tipo_documento_id, estatus)
          OUTPUT inserted.id
          VALUES (@tramite_id, @requisito_id, @tipo_documento_id, N'en_revision')
        `);
      
      documentoId = nuevoDoc.recordset[0].id;
    }
    
    // Crear versión del documento (simulada)
    const claveAlmacen = `docs/${tramiteId}/${tipoDocumento}_${Date.now()}.pdf`;
    const sha256Hash = `sha256_${Date.now()}_${Math.random().toString(36)}`;
    
    await pool.request()
      .input('documento_id', sql.BigInt, documentoId)
      .input('version', sql.Int, version)
      .input('nombre_archivo', sql.NVarChar(255), nombreArchivo)
      .input('clave_almacen', sql.NVarChar(500), claveAlmacen)
      .input('mime', sql.NVarChar(150), 'application/pdf')
      .input('tamano_bytes', sql.BigInt, tamanoBytes)
      .input('sha256', sql.NVarChar(64), sha256Hash)
      .input('subido_por_usuario_id', sql.BigInt, req.user.id)
      .query(`
        INSERT INTO versiones_documento 
        (documento_id, version, nombre_archivo, clave_almacen, mime, tamano_bytes, sha256, subido_por_usuario_id, estatus)
        VALUES (@documento_id, @version, @nombre_archivo, @clave_almacen, @mime, @tamano_bytes, @sha256, @subido_por_usuario_id, N'pendiente')
      `);
    
    res.json({ 
      mensaje: 'Documento subido correctamente',
      documentoId,
      version,
      estatus: 'en_revision'
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /documentos/notificaciones - Obtener notificaciones del alumno
documentosRouter.get('/notificaciones', jwtMiddleware, async (req: any, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('usuario_id', sql.BigInt, req.user.id)
      .query(`
        SELECT TOP 10
          id,
          titulo,
          mensaje,
          tipo,
          leida,
          creado_en
        FROM notificaciones
        WHERE usuario_id = @usuario_id
        ORDER BY creado_en DESC
      `);
    
    res.json(r.recordset);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// PATCH /documentos/notificaciones/:id/marcar-leida
documentosRouter.patch('/notificaciones/:id/marcar-leida', jwtMiddleware, async (req: any, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  
  try {
    const pool = await getPool();
    await pool.request()
      .input('id', sql.BigInt, id)
      .input('usuario_id', sql.BigInt, req.user.id)
      .query('UPDATE notificaciones SET leida = 1 WHERE id = @id AND usuario_id = @usuario_id');
    
    res.json({ mensaje: 'Notificación marcada como leída' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});
