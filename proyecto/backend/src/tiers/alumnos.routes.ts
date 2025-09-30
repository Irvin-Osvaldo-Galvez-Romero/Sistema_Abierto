import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { getPool, sql } from './db.js';

export const alumnosRouter = Router();

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

// GET /alumnos - Lista todos los alumnos con información completa
alumnosRouter.get('/', jwtMiddleware, async (_req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT 
        a.id,
        a.matricula,
        a.semestre,
        a.estatus,
        u.nombre,
        u.apellidos,
        u.correo,
        u.activo,
        u.creado_en,
        p.nombre AS programa,
        p.clave AS programa_clave,
        p.nivel AS programa_nivel,
        d.nombre AS departamento
      FROM alumnos a
      INNER JOIN usuarios u ON u.id = a.usuario_id
      INNER JOIN programas p ON p.id = a.programa_id
      INNER JOIN departamentos d ON d.id = p.departamento_id
      ORDER BY a.matricula
    `);
    res.json(r.recordset);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /alumnos/buscar?q=texto - Buscar alumnos por matrícula, nombre o correo
alumnosRouter.get('/buscar', jwtMiddleware, async (req, res) => {
  const q = req.query.q as string | undefined;
  if (!q) return res.status(400).json({ error: 'Parámetro q requerido' });
  
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('q', sql.NVarChar(255), `%${q}%`)
      .query(`
        SELECT 
          a.id,
          a.matricula,
          a.semestre,
          a.estatus,
          u.nombre,
          u.apellidos,
          u.correo,
          p.nombre AS programa,
          d.nombre AS departamento
        FROM alumnos a
        INNER JOIN usuarios u ON u.id = a.usuario_id
        INNER JOIN programas p ON p.id = a.programa_id
        INNER JOIN departamentos d ON d.id = p.departamento_id
        WHERE 
          a.matricula LIKE @q OR
          u.nombre LIKE @q OR
          u.apellidos LIKE @q OR
          u.correo LIKE @q
        ORDER BY a.matricula
      `);
    res.json(r.recordset);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /alumnos/:id - Obtener detalle de un alumno específico
alumnosRouter.get('/:id', jwtMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('id', sql.BigInt, id)
      .query(`
        SELECT 
          a.id,
          a.matricula,
          a.semestre,
          a.estatus,
          a.usuario_id,
          a.programa_id,
          u.nombre,
          u.apellidos,
          u.correo,
          u.activo,
          u.creado_en,
          u.ultimo_acceso,
          p.nombre AS programa,
          p.clave AS programa_clave,
          p.nivel AS programa_nivel,
          d.nombre AS departamento,
          d.clave AS departamento_clave
        FROM alumnos a
        INNER JOIN usuarios u ON u.id = a.usuario_id
        INNER JOIN programas p ON p.id = a.programa_id
        INNER JOIN departamentos d ON d.id = p.departamento_id
        WHERE a.id = @id
      `);
    
    if (!r.recordset.length) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    
    res.json(r.recordset[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /alumnos/:id/tramites - Obtener trámites de un alumno
alumnosRouter.get('/:id/tramites', jwtMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  
  try {
    const pool = await getPool();
    const r = await pool.request()
      .input('alumno_id', sql.BigInt, id)
      .query(`
        SELECT 
          t.id,
          t.estatus,
          t.prioridad,
          t.iniciado_en,
          t.finalizado_en,
          t.vence_en,
          t.sla_incumplido,
          tt.nombre AS tipo_tramite,
          tt.clave AS tipo_tramite_clave
        FROM tramites_alumno t
        INNER JOIN tipos_tramite tt ON tt.id = t.tipo_tramite_id
        WHERE t.alumno_id = @alumno_id
        ORDER BY t.iniciado_en DESC
      `);
    
    res.json(r.recordset);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// PATCH /alumnos/:id - Actualizar información del alumno
const updateAlumnoSchema = z.object({
  semestre: z.number().int().min(1).max(20).optional(),
  estatus: z.enum(['activo', 'inactivo', 'egresado', 'baja']).optional(),
  programa_id: z.number().int().positive().optional()
});

alumnosRouter.patch('/:id', jwtMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });
  
  const parsed = updateAlumnoSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  
  const updates = parsed.data;
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No hay campos para actualizar' });
  }
  
  try {
    const pool = await getPool();
    const parts: string[] = [];
    const request = pool.request().input('id', sql.BigInt, id);
    
    if (updates.semestre !== undefined) {
      parts.push('semestre = @semestre');
      request.input('semestre', sql.Int, updates.semestre);
    }
    if (updates.estatus !== undefined) {
      parts.push('estatus = @estatus');
      request.input('estatus', sql.NVarChar(30), updates.estatus);
    }
    if (updates.programa_id !== undefined) {
      parts.push('programa_id = @programa_id');
      request.input('programa_id', sql.BigInt, updates.programa_id);
    }
    
    const query = `UPDATE alumnos SET ${parts.join(', ')} WHERE id = @id`;
    await request.query(query);
    
    res.json({ mensaje: 'Alumno actualizado correctamente' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

// GET /alumnos/stats/general - Estadísticas generales de alumnos
alumnosRouter.get('/stats/general', jwtMiddleware, async (_req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN a.estatus = 'activo' THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN a.estatus = 'inactivo' THEN 1 ELSE 0 END) as inactivos,
        SUM(CASE WHEN a.estatus = 'egresado' THEN 1 ELSE 0 END) as egresados,
        SUM(CASE WHEN a.estatus = 'baja' THEN 1 ELSE 0 END) as bajas
      FROM alumnos a
    `);
    res.json(r.recordset[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});
