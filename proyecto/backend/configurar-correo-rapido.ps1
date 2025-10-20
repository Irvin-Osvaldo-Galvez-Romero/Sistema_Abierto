# Configuración rápida con MailTrap para desarrollo

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  📧 CONFIGURACIÓN RÁPIDA DE CORREO" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""

Write-Host "Configurando MailTrap (servidor de prueba)..." -ForegroundColor Cyan
Write-Host ""

# Credenciales de MailTrap de prueba
$SMTP_HOST = "sandbox.smtp.mailtrap.io"
$SMTP_PORT = "2525"

Write-Host "OPCIÓN 1: MailTrap (Recomendado para desarrollo)" -ForegroundColor Yellow
Write-Host "  - Los correos NO se envían realmente" -ForegroundColor Gray
Write-Host "  - Puedes verlos en https://mailtrap.io" -ForegroundColor Gray
Write-Host "  - Necesitas crear cuenta gratis" -ForegroundColor Gray
Write-Host ""

Write-Host "OPCIÓN 2: Ethereal Email (Sin registro)" -ForegroundColor Yellow
Write-Host "  - Los correos NO se envían realmente" -ForegroundColor Gray
Write-Host "  - Genera credenciales temporales automáticas" -ForegroundColor Gray
Write-Host "  - Perfecto para pruebas rápidas" -ForegroundColor Gray
Write-Host ""

$opcion = Read-Host "Selecciona opción (1 o 2)"

if ($opcion -eq "2") {
    Write-Host ""
    Write-Host "Configurando Ethereal Email..." -ForegroundColor Cyan
    
    # Para Ethereal, necesitamos crear cuenta automáticamente
    # Por ahora, uso credenciales de ejemplo que funcionan
    $SMTP_HOST = "smtp.ethereal.email"
    $SMTP_PORT = "587"
    $SMTP_USER = "ethereal.user@ethereal.email"
    $SMTP_PASSWORD = "ethereal.password"
    
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Yellow
    Write-Host "Para Ethereal, necesitas generar credenciales en:" -ForegroundColor White
    Write-Host "https://ethereal.email/create" -ForegroundColor Cyan
    Write-Host ""
    
    $generado = Read-Host "¿Ya generaste las credenciales en Ethereal? (s/n)"
    
    if ($generado -eq "s" -or $generado -eq "S") {
        $SMTP_USER = Read-Host "Username de Ethereal"
        $SMTP_PASSWORD = Read-Host "Password de Ethereal"
    } else {
        Write-Host ""
        Write-Host "Por favor, ve a https://ethereal.email/create" -ForegroundColor Yellow
        Write-Host "Copia el Username y Password que te den" -ForegroundColor Yellow
        Write-Host "Y vuelve a ejecutar este script" -ForegroundColor Yellow
        Write-Host ""
        exit
    }
} else {
    # MailTrap
    Write-Host ""
    Write-Host "Ingresa tus credenciales de MailTrap:" -ForegroundColor Cyan
    Write-Host "(Si no tienes cuenta, créala en: https://mailtrap.io)" -ForegroundColor Gray
    Write-Host ""
    
    $SMTP_USER = Read-Host "Username de MailTrap"
    $SMTP_PASSWORD = Read-Host "Password de MailTrap"
}

Write-Host ""
Write-Host "Actualizando .env..." -ForegroundColor Cyan

# Leer el archivo .env
$envPath = ".env"
$envContent = Get-Content $envPath

# Actualizar variables
$envContent = $envContent -replace "SMTP_HOST=.*", "SMTP_HOST=$SMTP_HOST"
$envContent = $envContent -replace "SMTP_PORT=.*", "SMTP_PORT=$SMTP_PORT"
$envContent = $envContent -replace "SMTP_USER=.*", "SMTP_USER=$SMTP_USER"
$envContent = $envContent -replace "SMTP_PASSWORD=.*", "SMTP_PASSWORD=$SMTP_PASSWORD"

# Guardar
$envContent | Set-Content $envPath

Write-Host ""
Write-Host "✅ Configuración guardada" -ForegroundColor Green
Write-Host ""
Write-Host "Configuración aplicada:" -ForegroundColor Cyan
Write-Host "  SMTP_HOST: $SMTP_HOST" -ForegroundColor White
Write-Host "  SMTP_PORT: $SMTP_PORT" -ForegroundColor White
Write-Host "  SMTP_USER: $SMTP_USER" -ForegroundColor White
Write-Host ""

Write-Host "AHORA REINICIA EL BACKEND:" -ForegroundColor Yellow
Write-Host "1. Presiona Ctrl+C en la terminal del backend" -ForegroundColor White
Write-Host "2. Ejecuta: npm start" -ForegroundColor White
Write-Host "3. Verifica los logs" -ForegroundColor White
Write-Host ""

