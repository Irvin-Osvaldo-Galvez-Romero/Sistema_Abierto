# Script para insertar carreras usando el script TypeScript

Write-Host ""
Write-Host "INSERCION DE CARRERAS EN LA BASE DE DATOS" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en el directorio correcto
if (-not (Test-Path "package.json")) {
    Write-Host "ERROR: Ejecuta este script desde el directorio backend" -ForegroundColor Red
    Write-Host ""
    exit 1
}

# Verificar que el script TypeScript existe
if (-not (Test-Path "scripts/seed-carreras.ts")) {
    Write-Host "ERROR: No se encontro el archivo scripts/seed-carreras.ts" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "Ejecutando script de insercion..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar el script usando tsx
npx tsx scripts/seed-carreras.ts

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Las carreras estan listas para usar en el sistema" -ForegroundColor Green
    Write-Host "Ahora puedes crear estudiantes y asignarles carreras" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "ERROR: Hubo un problema al insertar las carreras" -ForegroundColor Red
    Write-Host ""
    exit 1
}

