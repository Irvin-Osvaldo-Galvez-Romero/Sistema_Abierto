import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { authRouter } from './tiers/auth.routes.js';
import { catalogosRouter } from './tiers/catalogos.routes.js';

const app = express();
app.use(cors());
app.use(json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/auth', authRouter);
app.use('/catalogos', catalogosRouter);

// Ruta raíz informativa
app.get('/', (_req, res) => {
  res.type('text').send(
    'API de Universidad activa. Endpoints:\n' +
    'GET /health\n' +
    'POST /auth/register\n' +
    'POST /auth/login\n' +
    'POST /auth/refresh\n' +
    'GET  /auth/me\n' +
    '\nAbre el archivo frontend/auth-test.html en tu navegador para usar la UI.'
  );
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Auth API listening on port ${PORT}`);
});


