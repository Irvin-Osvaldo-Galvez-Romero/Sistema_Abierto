# Script para iniciar el sistema completo
# Backend + Frontend

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  🚀 INICIANDO SISTEMA UNIVERSITARIO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

# Verificar si Node.js está instalado
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Error: Node.js no está instalado" -ForegroundColor Red
    exit 1
}

# Directorio del proyecto
$ProjectRoot = Split-Path -Parent $PSScriptRoot

# Iniciar Backend
Write-Host "📦 Iniciando Backend..." -ForegroundColor Cyan
$backendPath = Join-Path $ProjectRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host 'Backend iniciando...' -ForegroundColor Yellow; npm start"

# Esperar 3 segundos para que el backend inicie
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "📦 Iniciando Frontend..." -ForegroundColor Cyan
$frontendPath = Join-Path $ProjectRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host 'Frontend iniciando...' -ForegroundColor Yellow; npm start"

# Esperar un poco
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✅ SISTEMA INICIADO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Servicios:" -ForegroundColor White
Write-Host "   • Backend:  http://localhost:3001" -ForegroundColor Yellow
Write-Host "   • Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔐 Credenciales:" -ForegroundColor White
Write-Host "   • Email:    admin@teschi.edu.mx" -ForegroundColor Yellow
Write-Host "   • Password: Admin123" -ForegroundColor Yellow
Write-Host ""
Write-Host "🌐 Abre tu navegador en: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

