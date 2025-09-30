import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool, sql } from './db.js';

export const authRouter = Router();

authRouter.get('/', (_req, res) => {
  res.type('text').send(
    'Auth API: usa POST /auth/register (correo, contrasena, nombre, apellidos, matricula, programaId[, semestre]) y POST /auth/login.'
  );
});

authRouter.get('/register', (_req, res) => {
  res.type('application/json').send({
    info:
      'Este endpoint requiere POST con JSON: { correo, contrasena, nombre, apellidos, matricula, programaId, semestre? }'
  });
});

const registerSchema = z.object({
  correo: z.string().email(),
  contrasena: z.string().min(8),
  nombre: z.string().min(1),
  apellidos: z.string().min(1),
  matricula: z.string().min(3),
  programaId: z.number().int().positive(),
  semestre: z.number().int().min(1).max(20).optional()
});

authRouter.post('/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { correo, contrasena, nombre, apellidos, matricula, programaId, semestre } = parsed.data;
  try {
    const pool = await getPool();
    const tx = new sql.Transaction(pool);
    await tx.begin();
    try {
      const req = new sql.Request(tx);
      const existing = await req
        .input('correo', sql.NVarChar(255), correo)
        .query('SELECT id FROM usuarios WHERE correo = @correo');
      if (existing.recordset.length) {
        await tx.rollback();
        return res.status(409).json({ error: 'Correo ya registrado' });
      }

      const hash = await bcrypt.hash(contrasena, 10);
      const insUser = await new sql.Request(tx)
        .input('correo', sql.NVarChar(255), correo)
        .input('hash', sql.NVarChar(255), hash)
        .input('nombre', sql.NVarChar(100), nombre)
        .input('apellidos', sql.NVarChar(100), apellidos)
        .query(
          'INSERT INTO usuarios (correo, hash_contrasena, nombre, apellidos) OUTPUT inserted.id VALUES (@correo, @hash, @nombre, @apellidos)'
        );
      const userId = insUser.recordset[0].id as number;

      const existingMat = await new sql.Request(tx)
        .input('matricula', sql.NVarChar(30), matricula)
        .query('SELECT id FROM alumnos WHERE matricula = @matricula');
      if (existingMat.recordset.length) {
        await tx.rollback();
        return res.status(409).json({ error: 'Matrícula ya registrada' });
      }

      await new sql.Request(tx)
        .input('usuario_id', sql.BigInt, userId)
        .input('matricula', sql.NVarChar(30), matricula)
        .input('programa_id', sql.BigInt, programaId)
        .input('semestre', sql.Int, semestre ?? null)
        .query(
          'INSERT INTO alumnos (usuario_id, matricula, programa_id, semestre) VALUES (@usuario_id, @matricula, @programa_id, @semestre)'
        );

      await tx.commit();

      // Asignar rol de Alumno por defecto al registrarse
      const rolQ = await pool.request().query("SELECT id FROM roles WHERE nombre = 'Alumno'");
      if (rolQ.recordset.length) {
        const rolId = rolQ.recordset[0].id;
        await pool.request()
          .input('usuario_id', sql.BigInt, userId)
          .input('rol_id', sql.BigInt, rolId)
          .query('INSERT INTO usuarios_roles (usuario_id, rol_id) VALUES (@usuario_id, @rol_id)');
      }

      const accessToken = jwt.sign({ sub: userId, correo }, process.env.JWT_SECRET || 'dev_secret', {
        expiresIn: '1h'
      });
      const refreshToken = jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET || 'dev_secret'), {
        expiresIn: '7d'
      });

      res.status(201).json({
        usuario: { id: userId, correo, nombre, apellidos, matricula, roles: ['Alumno'], tipo: 'alumno' },
        token: accessToken,
        refreshToken
      });
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

const loginSchema = z.object({ correo: z.string().email(), contrasena: z.string().min(8) });

authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { correo, contrasena } = parsed.data;
  try {
    const pool = await getPool();
    const q = await pool
      .request()
      .input('correo', sql.NVarChar(255), correo)
      .query('SELECT id, hash_contrasena, nombre, apellidos FROM usuarios WHERE correo = @correo AND activo = 1');
    if (!q.recordset.length) return res.status(401).json({ error: 'Credenciales inválidas' });
    const user = q.recordset[0] as { id: number; hash_contrasena: string; nombre: string; apellidos: string };
    const ok = await bcrypt.compare(contrasena, user.hash_contrasena);
    if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

    // Obtener roles del usuario
    const rolesQ = await pool
      .request()
      .input('usuario_id', sql.BigInt, user.id)
      .query(`
        SELECT r.nombre, r.id
        FROM usuarios_roles ur
        INNER JOIN roles r ON r.id = ur.rol_id
        WHERE ur.usuario_id = @usuario_id
      `);
    
    const roles = rolesQ.recordset.map((r: any) => r.nombre);
    const tipoUsuario = roles.includes('Administrador') ? 'admin' 
                      : roles.includes('Docente') ? 'docente'
                      : roles.includes('Administrativo') ? 'docente'
                      : 'alumno';

    // Si es alumno, obtener la matrícula
    let matricula = null;
    if (tipoUsuario === 'alumno') {
      const alumnoQ = await pool
        .request()
        .input('usuario_id', sql.BigInt, user.id)
        .query('SELECT matricula FROM alumnos WHERE usuario_id = @usuario_id');
      
      if (alumnoQ.recordset.length) {
        matricula = alumnoQ.recordset[0].matricula;
      }
    }

    const secret = process.env.JWT_SECRET || 'dev_secret';
    const token = jwt.sign({ sub: user.id, correo }, secret, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ sub: user.id }, process.env.JWT_REFRESH_SECRET || secret, { expiresIn: '7d' });
    res.json({ 
      token, 
      refreshToken, 
      usuario: { 
        id: user.id, 
        correo, 
        nombre: user.nombre, 
        apellidos: user.apellidos,
        roles,
        tipo: tipoUsuario,
        matricula: matricula
      } 
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

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

authRouter.get('/me', jwtMiddleware, async (req: any, res) => {
  try {
    const pool = await getPool();
    const q = await pool
      .request()
      .input('id', sql.BigInt, req.user.id)
      .query('SELECT id, correo, nombre, apellidos FROM usuarios WHERE id = @id');
    if (!q.recordset.length) return res.status(404).json({ error: 'No encontrado' });
    res.json(q.recordset[0]);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error del servidor' });
  }
});

const refreshSchema = z.object({ refreshToken: z.string().min(20) });

authRouter.post('/refresh', async (req, res) => {
  const parsed = refreshSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { refreshToken } = parsed.data;
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET || 'dev_secret')
    ) as any;
    const accessToken = jwt.sign({ sub: payload.sub }, process.env.JWT_SECRET || 'dev_secret', {
      expiresIn: '1h'
    });
    res.json({ token: accessToken });
  } catch {
    return res.status(401).json({ error: 'refreshToken inválido' });
  }
});


