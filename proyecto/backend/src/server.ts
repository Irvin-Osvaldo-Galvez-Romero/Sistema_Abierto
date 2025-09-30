import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { authRouter } from './tiers/auth.routes.js';
import { catalogosRouter } from './tiers/catalogos.routes.js';
import { alumnosRouter } from './tiers/alumnos.routes.js';
import { documentosRouter } from './tiers/documentos.routes.js';

const app = express();
app.use(cors());
app.use(json({ limit: '10mb' })); // Aumentado para soportar base64 de archivos

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter);
app.use('/catalogos', catalogosRouter);
app.use('/alumnos', alumnosRouter);
app.use('/documentos', documentosRouter);

// Ruta raíz informativa
app.get('/', (_req, res) => {
  res.type('text').send(
    'API de Universidad activa. Endpoints:\n' +
    'GET /health\n' +
    '\nAutenticación:\n' +
    'POST /auth/register\n' +
    'POST /auth/login\n' +
    'POST /auth/refresh\n' +
    'GET  /auth/me\n' +
    '\nCatálogos:\n' +
    'GET /catalogos/programas\n' +
    '\nAlumnos (requiere auth):\n' +
    'GET /alumnos\n' +
    'GET /alumnos/buscar?q=texto\n' +
    'GET /alumnos/:id\n' +
    'GET /alumnos/:id/tramites\n' +
    'PATCH /alumnos/:id\n' +
    'GET /alumnos/stats/general\n' +
    '\nAbre el archivo frontend/auth-test.html en tu navegador para usar la UI.'
  );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth API listening on port ${PORT}`);
});


