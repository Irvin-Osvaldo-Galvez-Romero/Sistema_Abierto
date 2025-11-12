# Script para iniciar el sistema completo
# Verifica y configura todo lo necesario

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  🚀 INICIANDO SISTEMA UNIVERSITARIO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Verificar Node.js
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    Write-Host "   Por favor instala Node.js desde https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar Docker
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Docker no está instalado o no está corriendo" -ForegroundColor Red
    Write-Host "   Por favor inicia Docker Desktop" -ForegroundColor Yellow
    exit 1
}

# Directorio del proyecto
$ProjectRoot = Split-Path -Parent $PSScriptRoot
$BackendPath = Join-Path $ProjectRoot "backend"
$FrontendPath = Join-Path $ProjectRoot "frontend"
$EnvFile = Join-Path $BackendPath ".env"

# Crear archivo .env si no existe
if (!(Test-Path $EnvFile)) {
    Write-Host "📝 Creando archivo .env en el backend..." -ForegroundColor Cyan
    
    $envContent = @"
# ==================================
# CONFIGURACIÓN DEL BACKEND
# ==================================

PORT=3001
DATABASE_URL="postgresql://univ_app:univ_app_password_2024@localhost:5432/sistema_universitario?schema=public"
JWT_SECRET=tu_secreto_jwt_super_seguro_aqui_cambiar_en_produccion_2024
JWT_REFRESH_SECRET=tu_secreto_refresh_jwt_super_seguro_aqui_cambiar_en_produccion_2024
ENCRYPTION_KEY=tu_clave_encriptacion_32_caracteres_minimo_2024_segura
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
HOST=localhost
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
NODE_ENV=development
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM=noreply@universidad.edu.mx
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log
SESSION_TIMEOUT=1800
MAX_LOGIN_ATTEMPTS=5
LOCKOUT_DURATION=900
"@
    
    $envContent | Out-File -FilePath $EnvFile -Encoding UTF8
    Write-Host "✅ Archivo .env creado" -ForegroundColor Green
} else {
    Write-Host "✅ Archivo .env ya existe" -ForegroundColor Green
}

# PASO 1: Iniciar Docker (PostgreSQL y Redis)
Write-Host ""
Write-Host "🐳 PASO 1: Iniciando servicios Docker..." -ForegroundColor Cyan
Write-Host "   (PostgreSQL y Redis)" -ForegroundColor Gray

$dockerCompose = Join-Path $ProjectRoot "docker-compose.dev.yml"
docker-compose -f $dockerCompose up -d

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al iniciar Docker" -ForegroundColor Red
    exit 1
}

Write-Host "   Esperando a que los servicios estén listos..." -ForegroundColor Gray
Start-Sleep -Seconds 5

# Verificar que los contenedores estén corriendo
$postgresRunning = docker ps --filter "name=univ_postgres_dev" --format "{{.Names}}" | Select-String "univ_postgres_dev"
if (!$postgresRunning) {
    Write-Host "⚠️  Advertencia: PostgreSQL podría no estar listo aún" -ForegroundColor Yellow
}

Write-Host "✅ Servicios Docker iniciados" -ForegroundColor Green

# PASO 2: Iniciar Backend
Write-Host ""
Write-Host "📦 PASO 2: Iniciando Backend..." -ForegroundColor Cyan
Write-Host "   (Puerto 3001)" -ForegroundColor Gray

# Verificar si node_modules existe
$nodeModulesBackend = Join-Path $BackendPath "node_modules"
if (!(Test-Path $nodeModulesBackend)) {
    Write-Host "   Instalando dependencias del backend..." -ForegroundColor Yellow
    Set-Location $BackendPath
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias del backend" -ForegroundColor Red
        exit 1
    }
}

# Iniciar backend en ventana nueva
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$BackendPath'; Write-Host '🚀 Backend iniciando en http://localhost:3001...' -ForegroundColor Green; npm run dev"

# Esperar a que el backend inicie
Start-Sleep -Seconds 5

# PASO 3: Iniciar Frontend
Write-Host ""
Write-Host "📦 PASO 3: Iniciando Frontend..." -ForegroundColor Cyan
Write-Host "   (Puerto 3000)" -ForegroundColor Gray

# Verificar si node_modules existe
$nodeModulesFrontend = Join-Path $FrontendPath "node_modules"
if (!(Test-Path $nodeModulesFrontend)) {
    Write-Host "   Instalando dependencias del frontend..." -ForegroundColor Yellow
    Set-Location $FrontendPath
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar dependencias del frontend" -ForegroundColor Red
        exit 1
    }
}

# Iniciar frontend en ventana nueva
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$FrontendPath'; Write-Host '🚀 Frontend iniciando en http://localhost:3000...' -ForegroundColor Green; npm start"

# Resumen
Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ SISTEMA INICIADO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Servicios disponibles:" -ForegroundColor White
Write-Host "   • Frontend:  http://localhost:3000" -ForegroundColor Yellow
Write-Host "   • Backend:   http://localhost:3001" -ForegroundColor Yellow
Write-Host "   • API Health: http://localhost:3001/health" -ForegroundColor Yellow
Write-Host "   • pgAdmin:   http://localhost:5050" -ForegroundColor Yellow
Write-Host "   • Redis UI:  http://localhost:8081" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔐 Credenciales de prueba:" -ForegroundColor White
Write-Host "   • Email:    admin@teschi.edu.mx" -ForegroundColor Yellow
Write-Host "   • Password: Admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Abre tu navegador en: " -NoNewline -ForegroundColor Cyan
Write-Host "http://localhost:3000" -ForegroundColor White -BackgroundColor DarkBlue
Write-Host ""
Write-Host "💡 Nota: Puede tomar unos segundos para que los servicios estén completamente listos" -ForegroundColor Gray
Write-Host ""

