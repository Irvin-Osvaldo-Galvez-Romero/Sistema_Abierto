# API de Autenticación (Backend Node/TypeScript)

Base URL: `http://localhost:4000`

## Variables de entorno (.env)
```
PORT=4000
JWT_SECRET=dev_secret_cambia_esto
# opcional: secreto distinto para refresh
# JWT_REFRESH_SECRET=otro_secreto

SQL_SERVER=SARFERT
SQL_DATABASE=univ_docs
SQL_PORT=1433
# Para usar SQL Auth (opcional)
# SQL_AUTH=sql
# SQL_USER=sa
# SQL_PASSWORD=TuClaveSegura
```

## Dependencias principales
- express, cors, jsonwebtoken, bcryptjs, mssql, zod, dotenv

## Rutas

### Health
- GET `/health`
  - 200: `{ ok: true }`

### Registro
- POST `/auth/register`
- Request (JSON):
```json
{
  "correo": "alumno@uni.mx",
  "contrasena": "Secreta123!",
  "nombre": "Ana",
  "apellidos": "García",
  "matricula": "A0001",
  "programaId": 1,
  "semestre": 1
}
```
- Response 201:
```json
{
  "usuario": { "id": 1, "correo": "alumno@uni.mx", "nombre": "Ana", "apellidos": "García", "matricula": "A0001" },
  "token": "<accessToken>",
  "refreshToken": "<refreshToken>"
}
```
- Errores: 409 (correo/matrícula en uso), 400 (validación), 500

### Login
- POST `/auth/login`
- Request:
```json
{ "correo": "alumno@uni.mx", "contrasena": "Secreta123!" }
```
- Response 200:
```json
{ "token": "<accessToken>", "refreshToken": "<refreshToken>", "usuario": { "id": 1, "correo": "alumno@uni.mx", "nombre": "Ana", "apellidos": "García" } }
```
- Errores: 401 (credenciales), 400, 500

### Refresh Token
- POST `/auth/refresh`
- Request:
```json
{ "refreshToken": "<refreshToken>" }
```
- Response 200:
```json
{ "token": "<nuevoAccessToken>" }
```
- Errores: 401 (refresh inválido), 400

### Perfil
- GET `/auth/me`
- Headers: `Authorization: Bearer <accessToken>`
- Response 200:
```json
{ "id": 1, "correo": "alumno@uni.mx", "nombre": "Ana", "apellidos": "García" }
```
- Errores: 401, 404

## Validaciones y Seguridad
- `bcryptjs` para hash de contraseñas (salt 10)
- Tokens JWT:
  - Access: exp 1h (env `JWT_SECRET`)
  - Refresh: exp 7d (env `JWT_REFRESH_SECRET` o `JWT_SECRET`)
- Middleware JWT protege `/auth/me`
- Transacción en registro: crea `usuarios` y `alumnos` atómicamente

## SQL utilizado (tablas relevantes)
- `usuarios(correo, hash_contrasena, nombre, apellidos, activo)`
- `alumnos(usuario_id, matricula, programa_id, semestre)`
- Consultas con parámetros usando `mssql` para evitar inyecciones

## Pruebas rápidas (PowerShell)
```
curl http://localhost:4000/health

curl -X POST http://localhost:4000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"alumno1@uni.mx\",\"contrasena\":\"Secreta123!\",\"nombre\":\"Ana\",\"apellidos\":\"García\",\"matricula\":\"A0001\",\"programaId\":1,\"semestre\":1}"

curl -X POST http://localhost:4000/auth/login ^
  -H "Content-Type: application/json" ^
  -d "{\"correo\":\"alumno1@uni.mx\",\"contrasena\":\"Secreta123!\"}"

# Reemplaza con tu refreshToken
curl -X POST http://localhost:4000/auth/refresh ^
  -H "Content-Type: application/json" ^
  -d "{\"refreshToken\":\"<REFRESH>\"}"

# Reemplaza con tu token
curl http://localhost:4000/auth/me -H "Authorization: Bearer <TOKEN>"
```

## Errores comunes
- 500: revisar conexión a SQL Server (`.env` y SQL Server Configuration Manager TCP/IP 1433)
- 409: correo/matrícula ya existen
- 401: credenciales inválidas o token expirado
