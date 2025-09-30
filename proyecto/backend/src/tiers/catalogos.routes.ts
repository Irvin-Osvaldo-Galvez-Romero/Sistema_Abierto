import { Router } from 'express';
import { getPool, sql } from './db.js';

export const catalogosRouter = Router();

catalogosRouter.get('/programas', async (_req, res) => {
  try {
    const pool = await getPool();
    const r = await pool.request().query(
      'SELECT p.id, p.clave, p.nombre, p.nivel, d.nombre AS departamento FROM programas p JOIN departamentos d ON d.id = p.departamento_id ORDER BY d.nombre, p.nombre'
    );
    res.json(r.recordset);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});


