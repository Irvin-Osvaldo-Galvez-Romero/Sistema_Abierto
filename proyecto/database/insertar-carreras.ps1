# Script para insertar carreras en la base de datos

Write-Host ""
Write-Host "INSERCION DE CARRERAS EN LA BASE DE DATOS" -ForegroundColor Cyan
Write-Host ""

# Configuracion de la base de datos
$DB_HOST = "localhost"
$DB_PORT = "5432"
$DB_NAME = "univ_docs_db"
$DB_USER = "univ_admin"
$DB_PASSWORD = "univ_secure_password_2024"

Write-Host "Configuracion:" -ForegroundColor Yellow
Write-Host "   Host: $DB_HOST" -ForegroundColor Gray
Write-Host "   Puerto: $DB_PORT" -ForegroundColor Gray
Write-Host "   Base de datos: $DB_NAME" -ForegroundColor Gray
Write-Host "   Usuario: $DB_USER" -ForegroundColor Gray
Write-Host ""

# Verificar si el archivo SQL existe
$sqlFile = Join-Path $PSScriptRoot "seed_carreras.sql"
if (-not (Test-Path $sqlFile)) {
    Write-Host "ERROR: No se encontro el archivo seed_carreras.sql" -ForegroundColor Red
    Write-Host ""
    exit 1
}

Write-Host "Archivo SQL encontrado: seed_carreras.sql" -ForegroundColor Green
Write-Host "Ejecutando insercion de carreras..." -ForegroundColor Cyan
Write-Host ""

# Establecer variable de entorno para la contrasena
$env:PGPASSWORD = $DB_PASSWORD

try {
    # Ejecutar el script SQL
    psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f $sqlFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "CARRERAS INSERTADAS EXITOSAMENTE" -ForegroundColor Green
        Write-Host ""
        Write-Host "Carreras disponibles:" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "   Ingenierias:" -ForegroundColor Yellow
        Write-Host "   - Ingenieria en Sistemas Computacionales (ISC)" -ForegroundColor White
        Write-Host "   - Ingenieria Industrial (II)" -ForegroundColor White
        Write-Host "   - Ingenieria Electronica (IE)" -ForegroundColor White
        Write-Host "   - Ingenieria Mecanica (IM)" -ForegroundColor White
        Write-Host "   - Ingenieria Civil (IC)" -ForegroundColor White
        Write-Host ""
        Write-Host "   Licenciaturas:" -ForegroundColor Yellow
        Write-Host "   - Licenciatura en Administracion (LA)" -ForegroundColor White
        Write-Host "   - Licenciatura en Contaduria (LC)" -ForegroundColor White
        Write-Host "   - Licenciatura en Mercadotecnia (LMKT)" -ForegroundColor White
        Write-Host "   - Licenciatura en Derecho (LD)" -ForegroundColor White
        Write-Host "   - Licenciatura en Psicologia (LP)" -ForegroundColor White
        Write-Host ""
        Write-Host "Las carreras ya estan disponibles en el sistema" -ForegroundColor Green
        Write-Host ""
    }
    else {
        Write-Host ""
        Write-Host "ERROR al insertar carreras" -ForegroundColor Red
        Write-Host ""
        exit 1
    }
}
catch {
    Write-Host ""
    Write-Host "ERROR al ejecutar el script:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    exit 1
}
finally {
    # Limpiar la variable de entorno
    Remove-Item Env:\PGPASSWORD -ErrorAction SilentlyContinue
}

Write-Host "Ahora puedes crear estudiantes con carreras asignadas" -ForegroundColor Cyan
Write-Host ""
