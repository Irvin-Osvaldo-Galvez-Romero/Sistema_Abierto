# Script para solucionar errores de Prisma en Windows
# Ejecutar en PowerShell

Write-Host "Solucionando errores de Prisma..." -ForegroundColor Cyan

# 1. Cerrar procesos Node.js
Write-Host ""
Write-Host "1. Cerrando procesos Node.js..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    $nodeProcesses | Stop-Process -Force
    Write-Host "   Procesos Node.js cerrados" -ForegroundColor Green
    Start-Sleep -Seconds 2
} else {
    Write-Host "   No hay procesos Node.js corriendo" -ForegroundColor Gray
}

# 2. Eliminar carpeta .prisma
Write-Host ""
Write-Host "2. Eliminando carpeta .prisma..." -ForegroundColor Yellow
$prismaPath = "node_modules\.prisma"
if (Test-Path $prismaPath) {
    Remove-Item -Path $prismaPath -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   Carpeta .prisma eliminada" -ForegroundColor Green
} else {
    Write-Host "   La carpeta .prisma no existe" -ForegroundColor Gray
}

# 3. Esperar un momento
Write-Host ""
Write-Host "3. Esperando 3 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# 4. Regenerar Prisma Client
Write-Host ""
Write-Host "4. Regenerando Prisma Client..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -eq 0) {
    Write-Host "   Prisma Client regenerado correctamente" -ForegroundColor Green
} else {
    Write-Host "   Error al regenerar Prisma Client" -ForegroundColor Red
    exit 1
}

# 5. Actualizar base de datos
Write-Host ""
Write-Host "5. Actualizando base de datos..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -eq 0) {
    Write-Host "   Base de datos actualizada correctamente" -ForegroundColor Green
} else {
    Write-Host "   Error al actualizar la base de datos" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Proceso completado exitosamente!" -ForegroundColor Green
Write-Host ""
Write-Host "Ahora puedes iniciar el servidor con: npm run dev" -ForegroundColor Cyan
