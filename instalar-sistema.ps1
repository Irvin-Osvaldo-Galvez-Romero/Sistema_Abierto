# ============================================
# Script de Instalación Automática
# Sistema Universitario de Gestión Documental
# ============================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALACIÓN DEL SISTEMA UNIVERSITARIO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "[1/7] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "  ✓ Node.js $nodeVersion encontrado" -ForegroundColor Green
    Write-Host "  ✓ npm $npmVersion encontrado" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js no encontrado. Por favor instálalo desde https://nodejs.org/" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Verificar que estamos en la carpeta correcta
Write-Host "[2/7] Verificando estructura del proyecto..." -ForegroundColor Yellow
if (-not (Test-Path "proyecto\backend") -or -not (Test-Path "proyecto\frontend")) {
    Write-Host "  ✗ Estructura del proyecto no encontrada." -ForegroundColor Red
    Write-Host "  Asegúrate de ejecutar este script desde la raíz del proyecto." -ForegroundColor Red
    exit 1
}
Write-Host "  ✓ Estructura del proyecto encontrada" -ForegroundColor Green

Write-Host ""

# Instalar dependencias del backend
Write-Host "[3/7] Instalando dependencias del BACKEND..." -ForegroundColor Yellow
Write-Host "  Esto puede tardar varios minutos..." -ForegroundColor Gray
Set-Location "proyecto\backend"
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install falló"
    }
    Write-Host "  ✓ Dependencias del backend instaladas" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Error al instalar dependencias del backend" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Write-Host ""

# Verificar o crear archivo .env
Write-Host "[4/7] Verificando archivo .env del backend..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    if (Test-Path "env.example") {
        Write-Host "  ⚠ Archivo .env no encontrado. Creando desde env.example..." -ForegroundColor Yellow
        Copy-Item "env.example" ".env"
        Write-Host "  ✓ Archivo .env creado" -ForegroundColor Green
        Write-Host ""
        Write-Host "  ⚠ IMPORTANTE: Debes editar el archivo .env y configurar:" -ForegroundColor Yellow
        Write-Host "     - JWT_SECRET (genera un valor aleatorio seguro)" -ForegroundColor Yellow
        Write-Host "     - JWT_REFRESH_SECRET (genera otro valor aleatorio seguro)" -ForegroundColor Yellow
        Write-Host "     - ENCRYPTION_KEY (32 caracteres aleatorios)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "  Puedes generar claves usando:" -ForegroundColor Cyan
        Write-Host "    node -e `"console.log(require('crypto').randomBytes(32).toString('hex'))`"" -ForegroundColor Cyan
        Write-Host ""
        $continuar = Read-Host "  ¿Deseas continuar? (S/N)"
        if ($continuar -ne "S" -and $continuar -ne "s") {
            Set-Location ..\..
            exit 0
        }
    } else {
        Write-Host "  ✗ Archivo env.example no encontrado" -ForegroundColor Red
        Set-Location ..\..
        exit 1
    }
} else {
    Write-Host "  ✓ Archivo .env encontrado" -ForegroundColor Green
}

Write-Host ""

# Configurar base de datos
Write-Host "[5/7] Configurando base de datos..." -ForegroundColor Yellow
try {
    Write-Host "  Generando cliente de Prisma..." -ForegroundColor Gray
    npx prisma generate
    if ($LASTEXITCODE -ne 0) {
        throw "prisma generate falló"
    }
    Write-Host "  ✓ Cliente de Prisma generado" -ForegroundColor Green
    
    Write-Host "  Creando/actualizando base de datos..." -ForegroundColor Gray
    npx prisma db push
    if ($LASTEXITCODE -ne 0) {
        throw "prisma db push falló"
    }
    Write-Host "  ✓ Base de datos configurada" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Error al configurar la base de datos" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Write-Host ""

# Volver a la raíz y instalar dependencias del frontend
Write-Host "[6/7] Instalando dependencias del FRONTEND..." -ForegroundColor Yellow
Write-Host "  Esto puede tardar varios minutos..." -ForegroundColor Gray
Set-Location "..\frontend"
try {
    npm install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install falló"
    }
    Write-Host "  ✓ Dependencias del frontend instaladas" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Error al instalar dependencias del frontend" -ForegroundColor Red
    Set-Location ..\..
    exit 1
}

Write-Host ""

# Resumen final
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTALACIÓN COMPLETADA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar el sistema:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor Cyan
Write-Host "  cd proyecto\backend" -ForegroundColor White
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Terminal 2 - Frontend:" -ForegroundColor Cyan
Write-Host "  cd proyecto\frontend" -ForegroundColor White
Write-Host "  npm start" -ForegroundColor White
Write-Host ""
Write-Host "URLs:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend:  http://localhost:4000" -ForegroundColor White
Write-Host ""

# Volver a la raíz
Set-Location ..\..

Write-Host "¿Deseas iniciar el sistema ahora? (S/N)" -ForegroundColor Yellow
$iniciar = Read-Host

if ($iniciar -eq "S" -or $iniciar -eq "s") {
    Write-Host ""
    Write-Host "Iniciando sistema..." -ForegroundColor Green
    Write-Host ""
    
    # Iniciar backend en nueva ventana
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\proyecto\backend'; Write-Host 'Backend iniciando...' -ForegroundColor Green; npm run dev"
    
    # Esperar un poco antes de iniciar el frontend
    Start-Sleep -Seconds 3
    
    # Iniciar frontend en nueva ventana
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\proyecto\frontend'; Write-Host 'Frontend iniciando...' -ForegroundColor Green; npm start"
    
    Write-Host "✓ Sistema iniciado en ventanas separadas" -ForegroundColor Green
    Write-Host ""
}

Write-Host "¡Listo! El sistema está instalado." -ForegroundColor Green

