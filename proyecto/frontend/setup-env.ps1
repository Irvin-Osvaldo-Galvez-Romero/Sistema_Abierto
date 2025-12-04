# Script para configurar variables de entorno antes de iniciar React
# Ejecutar: .\setup-env.ps1

$env:WDS_SOCKET_HOST = "localhost"
$env:WDS_SOCKET_PORT = "3000"
$env:WDS_SOCKET_PATH = "/ws"
$env:REACT_APP_API_URL = "http://localhost:4000/api"
$env:REACT_APP_ENV = "development"

Write-Host "Variables de entorno configuradas para desarrollo" -ForegroundColor Green
Write-Host "Iniciando servidor de desarrollo..." -ForegroundColor Cyan

npm start

