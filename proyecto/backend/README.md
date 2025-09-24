Autenticación - API (Node/TypeScript + SQL Server)

Prerrequisitos
- Node.js 18+
- SQL Server Developer 2019 (instancia: SARFERT)
- Base de datos creada: univ_docs (ya incluida en sql/univ_docs_mvp.sql)

Configurar variables de entorno
- Se creó un archivo `.env` con valores por defecto para tu entorno:

```
PORT=4000
JWT_SECRET=dev_secret_cambia_esto
SQL_SERVER=SARFERT
SQL_DATABASE=univ_docs
SQL_PORT=1433
```

Si deseas usar autenticación SQL Server en lugar de Windows:

```
SQL_AUTH=sql
SQL_USER=sa
SQL_PASSWORD=TuClaveSegura
```

Instalación
```
cd backend
npm install
```

Ejecución en desarrollo
```
npm run dev
# Healthcheck
# http://localhost:4000/health
```

Endpoints principales
- POST `/auth/register` { correo, contrasena, nombre, apellidos, matricula, programaId, semestre? }
- POST `/auth/login` { correo, contrasena }
- GET  `/auth/me`  (Header: Authorization: Bearer <token>)

Pruebas rápidas (PowerShell)
```
curl http://localhost:4000/health

curl -X POST http://localhost:4000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"alumno1@uni.mx\",\"contrasena\":\"Secreta123!\",\"nombre\":\"Ana\",\"apellidos\":\"García\",\"matricula\":\"A0001\",\"programaId\":1,\"semestre\":1}"

curl -X POST http://localhost:4000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"alumno1@uni.mx\",\"contrasena\":\"Secreta123!\"}"
```

Notas
- Si `programaId` no existe, crea uno con el script en `sql/univ_docs_mvp.sql` (tablas `departamentos` y `programas`).
- La conexión por defecto usa Windows Authentication a `SARFERT`. Para SQL Auth, define `SQL_AUTH=sql` y credenciales.


